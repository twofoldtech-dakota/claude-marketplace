---
name: backend-csharp
description: Apply when working with C#/.NET backend code including controllers, services, and dependency injection
globs:
  - "**/*.cs"
  - "**/Controllers/**/*"
  - "**/Services/**/*"
  - "**/Repositories/**/*"
  - "**/appsettings*.json"
  - "!**/obj/**"
  - "!**/bin/**"
---

# C#/.NET Backend Development Patterns

## Dependency Injection

### Service Registration

```csharp
// Program.cs or Startup.cs
var builder = WebApplication.CreateBuilder(args);

// Transient: New instance every time
builder.Services.AddTransient<IEmailService, EmailService>();

// Scoped: One instance per HTTP request
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IOrderService, OrderService>();

// Singleton: One instance for application lifetime
builder.Services.AddSingleton<ICacheService, MemoryCacheService>();

// With factory
builder.Services.AddScoped<IDbContext>(provider =>
{
    var config = provider.GetRequiredService<IConfiguration>();
    return new DbContext(config.GetConnectionString("Default"));
});
```

### Constructor Injection

```csharp
public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IProductService _productService;
    private readonly IEmailService _emailService;
    private readonly ILogger<OrderService> _logger;

    public OrderService(
        IOrderRepository orderRepository,
        IProductService productService,
        IEmailService emailService,
        ILogger<OrderService> logger)
    {
        _orderRepository = orderRepository;
        _productService = productService;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task<Order> CreateOrderAsync(CreateOrderRequest request, CancellationToken ct)
    {
        _logger.LogInformation("Creating order for customer {CustomerId}", request.CustomerId);
        
        // Implementation
    }
}
```

### Interface Segregation

```csharp
// Focused interfaces
public interface IProductReader
{
    Task<Product?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<IReadOnlyList<Product>> GetAllAsync(CancellationToken ct);
    Task<IReadOnlyList<Product>> SearchAsync(string query, CancellationToken ct);
}

public interface IProductWriter
{
    Task<Product> CreateAsync(CreateProductRequest request, CancellationToken ct);
    Task UpdateAsync(Guid id, UpdateProductRequest request, CancellationToken ct);
    Task DeleteAsync(Guid id, CancellationToken ct);
}

// Combined interface for convenience
public interface IProductService : IProductReader, IProductWriter { }
```

## Service Layer Architecture

### Service Interface

```csharp
public interface IProductService
{
    Task<Product?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<PagedResult<Product>> GetPagedAsync(int page, int pageSize, CancellationToken ct = default);
    Task<Product> CreateAsync(CreateProductRequest request, CancellationToken ct = default);
    Task UpdateAsync(Guid id, UpdateProductRequest request, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}
```

### Service Implementation

```csharp
public class ProductService : IProductService
{
    private readonly IProductRepository _repository;
    private readonly IValidator<CreateProductRequest> _createValidator;
    private readonly ILogger<ProductService> _logger;

    public ProductService(
        IProductRepository repository,
        IValidator<CreateProductRequest> createValidator,
        ILogger<ProductService> logger)
    {
        _repository = repository;
        _createValidator = createValidator;
        _logger = logger;
    }

    public async Task<Product?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _repository.GetByIdAsync(id, ct);
    }

    public async Task<PagedResult<Product>> GetPagedAsync(
        int page, 
        int pageSize, 
        CancellationToken ct = default)
    {
        var skip = (page - 1) * pageSize;
        var items = await _repository.GetPagedAsync(skip, pageSize, ct);
        var total = await _repository.CountAsync(ct);

        return new PagedResult<Product>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalCount = total,
            TotalPages = (int)Math.Ceiling(total / (double)pageSize)
        };
    }

    public async Task<Product> CreateAsync(
        CreateProductRequest request, 
        CancellationToken ct = default)
    {
        var validationResult = await _createValidator.ValidateAsync(request, ct);
        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            CreatedAt = DateTime.UtcNow
        };

        await _repository.AddAsync(product, ct);
        
        _logger.LogInformation("Created product {ProductId}: {ProductName}", 
            product.Id, product.Name);

        return product;
    }

    public async Task UpdateAsync(
        Guid id, 
        UpdateProductRequest request, 
        CancellationToken ct = default)
    {
        var product = await _repository.GetByIdAsync(id, ct)
            ?? throw new NotFoundException($"Product {id} not found");

        product.Name = request.Name ?? product.Name;
        product.Description = request.Description ?? product.Description;
        product.Price = request.Price ?? product.Price;
        product.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(product, ct);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var exists = await _repository.ExistsAsync(id, ct);
        if (!exists)
        {
            throw new NotFoundException($"Product {id} not found");
        }

        await _repository.DeleteAsync(id, ct);
        
        _logger.LogInformation("Deleted product {ProductId}", id);
    }
}
```

## Repository Pattern

### Repository Interface

```csharp
public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<T>> GetAllAsync(CancellationToken ct = default);
    Task<IReadOnlyList<T>> GetPagedAsync(int skip, int take, CancellationToken ct = default);
    Task<int> CountAsync(CancellationToken ct = default);
    Task<bool> ExistsAsync(Guid id, CancellationToken ct = default);
    Task AddAsync(T entity, CancellationToken ct = default);
    Task UpdateAsync(T entity, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}

public interface IProductRepository : IRepository<Product>
{
    Task<IReadOnlyList<Product>> GetByCategoryAsync(string category, CancellationToken ct = default);
    Task<IReadOnlyList<Product>> SearchAsync(string query, CancellationToken ct = default);
}
```

### Repository Implementation

```csharp
public class ProductRepository : IProductRepository
{
    private readonly AppDbContext _context;

    public ProductRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Product?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _context.Products
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id, ct);
    }

    public async Task<IReadOnlyList<Product>> GetPagedAsync(
        int skip, 
        int take, 
        CancellationToken ct = default)
    {
        return await _context.Products
            .AsNoTracking()
            .OrderByDescending(p => p.CreatedAt)
            .Skip(skip)
            .Take(take)
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<Product>> SearchAsync(
        string query, 
        CancellationToken ct = default)
    {
        return await _context.Products
            .AsNoTracking()
            .Where(p => p.Name.Contains(query) || p.Description.Contains(query))
            .OrderBy(p => p.Name)
            .Take(100)
            .ToListAsync(ct);
    }

    public async Task AddAsync(Product entity, CancellationToken ct = default)
    {
        await _context.Products.AddAsync(entity, ct);
        await _context.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(Product entity, CancellationToken ct = default)
    {
        _context.Products.Update(entity);
        await _context.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var entity = await _context.Products.FindAsync(new object[] { id }, ct);
        if (entity != null)
        {
            _context.Products.Remove(entity);
            await _context.SaveChangesAsync(ct);
        }
    }
}
```

## Controller Patterns

### API Controller

```csharp
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(
        IProductService productService,
        ILogger<ProductsController> logger)
    {
        _productService = productService;
        _logger = logger;
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<ProductDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken ct = default)
    {
        var result = await _productService.GetPagedAsync(page, pageSize, ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var product = await _productService.GetByIdAsync(id, ct);
        if (product == null)
        {
            return NotFound();
        }
        return Ok(product);
    }

    [HttpPost]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(
        [FromBody] CreateProductRequest request,
        CancellationToken ct)
    {
        var product = await _productService.CreateAsync(request, ct);
        return CreatedAtAction(
            nameof(GetById), 
            new { id = product.Id }, 
            product);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdateProductRequest request,
        CancellationToken ct)
    {
        await _productService.UpdateAsync(id, request, ct);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await _productService.DeleteAsync(id, ct);
        return NoContent();
    }
}
```

### MVC Controller

```csharp
public class ProductsController : Controller
{
    private readonly IProductService _productService;
    private readonly ICategoryService _categoryService;

    public ProductsController(
        IProductService productService,
        ICategoryService categoryService)
    {
        _productService = productService;
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<IActionResult> Index(int page = 1, CancellationToken ct = default)
    {
        var products = await _productService.GetPagedAsync(page, 12, ct);
        return View(products);
    }

    [HttpGet]
    public async Task<IActionResult> Details(Guid id, CancellationToken ct)
    {
        var product = await _productService.GetByIdAsync(id, ct);
        if (product == null)
        {
            return NotFound();
        }
        return View(product);
    }

    [HttpGet]
    public async Task<IActionResult> Create(CancellationToken ct)
    {
        ViewBag.Categories = await _categoryService.GetAllAsync(ct);
        return View(new CreateProductRequest());
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(
        CreateProductRequest request,
        CancellationToken ct)
    {
        if (!ModelState.IsValid)
        {
            ViewBag.Categories = await _categoryService.GetAllAsync(ct);
            return View(request);
        }

        var product = await _productService.CreateAsync(request, ct);
        TempData["SuccessMessage"] = "Product created successfully.";
        return RedirectToAction(nameof(Details), new { id = product.Id });
    }
}
```

## Async/Await Best Practices

### Async All the Way

```csharp
// BAD: Blocking on async code
public Product GetProduct(Guid id)
{
    return _repository.GetByIdAsync(id).Result; // Deadlock risk!
}

// GOOD: Async all the way
public async Task<Product?> GetProductAsync(Guid id, CancellationToken ct)
{
    return await _repository.GetByIdAsync(id, ct);
}
```

### CancellationToken Propagation

```csharp
public async Task<Order> ProcessOrderAsync(
    CreateOrderRequest request,
    CancellationToken ct = default)
{
    // Pass cancellation token to all async operations
    var customer = await _customerService.GetByIdAsync(request.CustomerId, ct);
    var products = await _productService.GetByIdsAsync(request.ProductIds, ct);
    
    var order = new Order { /* ... */ };
    await _orderRepository.AddAsync(order, ct);
    
    // Background work that should continue even if request is cancelled
    _ = _emailService.SendOrderConfirmationAsync(order.Id, CancellationToken.None);
    
    return order;
}
```

### Parallel Operations

```csharp
public async Task<DashboardData> GetDashboardAsync(CancellationToken ct)
{
    // Run independent queries in parallel
    var ordersTask = _orderService.GetRecentAsync(10, ct);
    var productsTask = _productService.GetTopSellingAsync(5, ct);
    var statsTask = _analyticsService.GetSummaryAsync(ct);

    await Task.WhenAll(ordersTask, productsTask, statsTask);

    return new DashboardData
    {
        RecentOrders = await ordersTask,
        TopProducts = await productsTask,
        Stats = await statsTask
    };
}
```

### ConfigureAwait

```csharp
// In library code, use ConfigureAwait(false) to avoid context capture
public async Task<string> FetchDataAsync(string url, CancellationToken ct)
{
    using var client = new HttpClient();
    var response = await client.GetAsync(url, ct).ConfigureAwait(false);
    return await response.Content.ReadAsStringAsync(ct).ConfigureAwait(false);
}

// In ASP.NET Core controllers/services, it's generally not needed
// The framework handles synchronization context properly
```

## LINQ Patterns

### Query Syntax vs Method Syntax

```csharp
// Method syntax (preferred for most cases)
var activeProducts = products
    .Where(p => p.IsActive)
    .OrderBy(p => p.Name)
    .Select(p => new ProductDto(p.Id, p.Name, p.Price))
    .ToList();

// Query syntax (useful for complex joins)
var orderDetails = 
    from order in orders
    join customer in customers on order.CustomerId equals customer.Id
    join product in products on order.ProductId equals product.Id
    where order.Date >= startDate
    orderby order.Date descending
    select new OrderDetailDto
    {
        OrderId = order.Id,
        CustomerName = customer.Name,
        ProductName = product.Name,
        Total = order.Quantity * product.Price
    };
```

### Common LINQ Operations

```csharp
// Filtering
var active = products.Where(p => p.IsActive);
var expensive = products.Where(p => p.Price > 100);

// Projection
var names = products.Select(p => p.Name);
var dtos = products.Select(p => new ProductDto(p));

// Aggregation
var totalValue = products.Sum(p => p.Price * p.Stock);
var averagePrice = products.Average(p => p.Price);
var maxPrice = products.Max(p => p.Price);
var count = products.Count(p => p.IsActive);

// Grouping
var byCategory = products
    .GroupBy(p => p.Category)
    .Select(g => new 
    { 
        Category = g.Key, 
        Products = g.ToList(),
        Count = g.Count()
    });

// First/Single
var first = products.FirstOrDefault(p => p.Id == id);
var single = products.SingleOrDefault(p => p.Sku == sku);

// Any/All
var hasActive = products.Any(p => p.IsActive);
var allActive = products.All(p => p.IsActive);
```

### EF Core Specific

```csharp
// Include related data
var ordersWithItems = await _context.Orders
    .Include(o => o.Customer)
    .Include(o => o.Items)
        .ThenInclude(i => i.Product)
    .ToListAsync(ct);

// Explicit loading
await _context.Entry(order)
    .Collection(o => o.Items)
    .LoadAsync(ct);

// Projection (more efficient)
var orderSummaries = await _context.Orders
    .Select(o => new OrderSummaryDto
    {
        Id = o.Id,
        CustomerName = o.Customer.Name,
        Total = o.Items.Sum(i => i.Quantity * i.UnitPrice),
        ItemCount = o.Items.Count
    })
    .ToListAsync(ct);
```

## Configuration Pattern

### Options Pattern

```csharp
// Configuration class
public class EmailSettings
{
    public const string SectionName = "Email";
    
    public string SmtpHost { get; set; } = string.Empty;
    public int SmtpPort { get; set; } = 587;
    public string FromAddress { get; set; } = string.Empty;
    public string FromName { get; set; } = string.Empty;
    public bool UseSsl { get; set; } = true;
}

// Registration
builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection(EmailSettings.SectionName));

// Usage with IOptions
public class EmailService : IEmailService
{
    private readonly EmailSettings _settings;

    public EmailService(IOptions<EmailSettings> options)
    {
        _settings = options.Value;
    }
}

// Usage with IOptionsSnapshot (reloads on change)
public class EmailService : IEmailService
{
    private readonly IOptionsSnapshot<EmailSettings> _options;

    public EmailService(IOptionsSnapshot<EmailSettings> options)
    {
        _options = options;
    }

    public void Send()
    {
        var settings = _options.Value; // Gets current value
    }
}
```

### Validation

```csharp
public class EmailSettingsValidation : IValidateOptions<EmailSettings>
{
    public ValidateOptionsResult Validate(string? name, EmailSettings options)
    {
        var failures = new List<string>();

        if (string.IsNullOrWhiteSpace(options.SmtpHost))
        {
            failures.Add("SmtpHost is required");
        }

        if (string.IsNullOrWhiteSpace(options.FromAddress))
        {
            failures.Add("FromAddress is required");
        }

        return failures.Count > 0
            ? ValidateOptionsResult.Fail(failures)
            : ValidateOptionsResult.Success;
    }
}

// Registration
builder.Services.AddSingleton<IValidateOptions<EmailSettings>, EmailSettingsValidation>();
```

## Logging

### Structured Logging

```csharp
public class OrderService : IOrderService
{
    private readonly ILogger<OrderService> _logger;

    public async Task<Order> CreateOrderAsync(CreateOrderRequest request, CancellationToken ct)
    {
        // Structured logging with named parameters
        _logger.LogInformation(
            "Creating order for customer {CustomerId} with {ItemCount} items",
            request.CustomerId,
            request.Items.Count);

        try
        {
            var order = await ProcessOrderAsync(request, ct);
            
            _logger.LogInformation(
                "Order {OrderId} created successfully. Total: {Total:C}",
                order.Id,
                order.Total);
            
            return order;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Failed to create order for customer {CustomerId}",
                request.CustomerId);
            throw;
        }
    }
}
```

### Log Levels

```csharp
// Trace - Very detailed, typically only in development
_logger.LogTrace("Entering method {MethodName}", nameof(ProcessOrder));

// Debug - Debugging information
_logger.LogDebug("Processing item {ItemId} with quantity {Quantity}", item.Id, item.Quantity);

// Information - General flow
_logger.LogInformation("Order {OrderId} shipped to {Address}", order.Id, order.ShippingAddress);

// Warning - Something unexpected but not an error
_logger.LogWarning("Payment retry {Attempt} for order {OrderId}", attempt, orderId);

// Error - An error occurred but application can continue
_logger.LogError(ex, "Failed to send email for order {OrderId}", orderId);

// Critical - Application failure
_logger.LogCritical(ex, "Database connection failed");
```

### Scopes

```csharp
public async Task ProcessOrderAsync(Order order, CancellationToken ct)
{
    using (_logger.BeginScope(new Dictionary<string, object>
    {
        ["OrderId"] = order.Id,
        ["CustomerId"] = order.CustomerId
    }))
    {
        _logger.LogInformation("Processing order");
        // All logs within this scope will include OrderId and CustomerId
        await ProcessPaymentAsync(order, ct);
        await ProcessShippingAsync(order, ct);
    }
}
```

## Exception Handling

### Custom Exceptions

```csharp
public class NotFoundException : Exception
{
    public string ResourceType { get; }
    public string ResourceId { get; }

    public NotFoundException(string resourceType, string resourceId)
        : base($"{resourceType} with ID '{resourceId}' was not found")
    {
        ResourceType = resourceType;
        ResourceId = resourceId;
    }
}

public class ValidationException : Exception
{
    public IReadOnlyList<ValidationError> Errors { get; }

    public ValidationException(IEnumerable<ValidationError> errors)
        : base("One or more validation errors occurred")
    {
        Errors = errors.ToList();
    }
}

public class BusinessRuleException : Exception
{
    public string Code { get; }

    public BusinessRuleException(string code, string message)
        : base(message)
    {
        Code = code;
    }
}
```

### Global Exception Handler

```csharp
public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken ct)
    {
        _logger.LogError(exception, "An unhandled exception occurred");

        var (statusCode, response) = exception switch
        {
            NotFoundException ex => (
                StatusCodes.Status404NotFound,
                new ProblemDetails
                {
                    Status = 404,
                    Title = "Resource not found",
                    Detail = ex.Message
                }),
            ValidationException ex => (
                StatusCodes.Status400BadRequest,
                new ValidationProblemDetails
                {
                    Status = 400,
                    Title = "Validation failed",
                    Errors = ex.Errors.ToDictionary(
                        e => e.PropertyName,
                        e => new[] { e.Message })
                }),
            _ => (
                StatusCodes.Status500InternalServerError,
                new ProblemDetails
                {
                    Status = 500,
                    Title = "An error occurred",
                    Detail = "An unexpected error occurred. Please try again later."
                })
        };

        httpContext.Response.StatusCode = statusCode;
        await httpContext.Response.WriteAsJsonAsync(response, ct);
        return true;
    }
}
```

## Unit of Work Pattern

```csharp
public interface IUnitOfWork : IDisposable
{
    IProductRepository Products { get; }
    IOrderRepository Orders { get; }
    ICustomerRepository Customers { get; }
    
    Task<int> SaveChangesAsync(CancellationToken ct = default);
    Task BeginTransactionAsync(CancellationToken ct = default);
    Task CommitTransactionAsync(CancellationToken ct = default);
    Task RollbackTransactionAsync(CancellationToken ct = default);
}

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;
    private IDbContextTransaction? _transaction;

    public IProductRepository Products { get; }
    public IOrderRepository Orders { get; }
    public ICustomerRepository Customers { get; }

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
        Products = new ProductRepository(context);
        Orders = new OrderRepository(context);
        Customers = new CustomerRepository(context);
    }

    public async Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
        return await _context.SaveChangesAsync(ct);
    }

    public async Task BeginTransactionAsync(CancellationToken ct = default)
    {
        _transaction = await _context.Database.BeginTransactionAsync(ct);
    }

    public async Task CommitTransactionAsync(CancellationToken ct = default)
    {
        if (_transaction != null)
        {
            await _transaction.CommitAsync(ct);
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync(CancellationToken ct = default)
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync(ct);
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
}
```
