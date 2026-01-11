---
name: frontend-classic
description: Apply when working with classic frontend technologies including CSS, SASS, JavaScript, and jQuery
globs:
  - "**/*.css"
  - "**/*.scss"
  - "**/*.sass"
  - "**/scripts/**/*.js"
  - "**/js/**/*.js"
  - "!**/node_modules/**"
  - "!**/*.min.js"
---

# Classic Frontend Development Patterns

## CSS/SASS Organization

### File Structure (7-1 Pattern)

```
styles/
├── abstracts/
│   ├── _variables.scss      # Colors, fonts, breakpoints
│   ├── _mixins.scss         # Reusable mixins
│   └── _functions.scss      # SASS functions
├── base/
│   ├── _reset.scss          # CSS reset/normalize
│   ├── _typography.scss     # Base typography
│   └── _utilities.scss      # Utility classes
├── components/
│   ├── _buttons.scss        # Button styles
│   ├── _forms.scss          # Form elements
│   └── _cards.scss          # Card components
├── layout/
│   ├── _header.scss         # Header layout
│   ├── _footer.scss         # Footer layout
│   ├── _grid.scss           # Grid system
│   └── _navigation.scss     # Navigation
├── pages/
│   ├── _home.scss           # Home page specific
│   └── _contact.scss        # Contact page specific
├── themes/
│   └── _default.scss        # Default theme
├── vendors/
│   └── _bootstrap.scss      # Third-party overrides
└── main.scss                # Main import file
```

### Main SCSS Import Order

```scss
// main.scss
@import 'abstracts/variables';
@import 'abstracts/mixins';
@import 'abstracts/functions';

@import 'vendors/bootstrap';

@import 'base/reset';
@import 'base/typography';

@import 'layout/grid';
@import 'layout/header';
@import 'layout/footer';
@import 'layout/navigation';

@import 'components/buttons';
@import 'components/forms';
@import 'components/cards';

@import 'pages/home';
@import 'pages/contact';

@import 'themes/default';

@import 'base/utilities'; // Last for override capability
```

## SASS Variables and Mixins

### Color System

```scss
// _variables.scss
$color-primary: #0066cc;
$color-primary-dark: darken($color-primary, 10%);
$color-primary-light: lighten($color-primary, 10%);

$color-secondary: #6c757d;
$color-success: #28a745;
$color-warning: #ffc107;
$color-danger: #dc3545;

$color-text: #333333;
$color-text-muted: #6c757d;
$color-background: #ffffff;
$color-border: #dee2e6;

// Semantic aliases
$color-link: $color-primary;
$color-link-hover: $color-primary-dark;
```

### Typography Variables

```scss
// _variables.scss
$font-family-base: 'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif;
$font-family-heading: 'Montserrat', $font-family-base;

$font-size-base: 16px;
$font-size-sm: 14px;
$font-size-lg: 18px;

$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-bold: 700;

$line-height-base: 1.5;
$line-height-heading: 1.2;
```

### Responsive Breakpoints

```scss
// _variables.scss
$breakpoint-xs: 0;
$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
$breakpoint-xl: 1200px;
$breakpoint-xxl: 1400px;

$breakpoints: (
  'xs': $breakpoint-xs,
  'sm': $breakpoint-sm,
  'md': $breakpoint-md,
  'lg': $breakpoint-lg,
  'xl': $breakpoint-xl,
  'xxl': $breakpoint-xxl
);
```

### Essential Mixins

```scss
// _mixins.scss

// Responsive breakpoint mixin
@mixin respond-to($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    @media (min-width: map-get($breakpoints, $breakpoint)) {
      @content;
    }
  } @else {
    @warn "Unknown breakpoint: #{$breakpoint}";
  }
}

// Flexbox center
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

// Clearfix
@mixin clearfix {
  &::after {
    content: '';
    display: table;
    clear: both;
  }
}

// Truncate text with ellipsis
@mixin text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// Visually hidden (accessible)
@mixin visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

// Button reset
@mixin button-reset {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font: inherit;
  color: inherit;
}
```

### Using Mixins

```scss
// Example component
.hero {
  padding: 2rem;
  
  @include respond-to('md') {
    padding: 4rem;
  }
  
  @include respond-to('lg') {
    padding: 6rem;
  }
  
  &__content {
    @include flex-center;
    flex-direction: column;
  }
  
  &__title {
    @include text-truncate;
    max-width: 100%;
  }
}
```

## BEM Naming Convention

### Block, Element, Modifier

```scss
// Block
.card { }

// Element (double underscore)
.card__header { }
.card__body { }
.card__footer { }
.card__title { }
.card__image { }

// Modifier (double hyphen)
.card--featured { }
.card--compact { }
.card__title--large { }
```

### BEM Example

```scss
.navigation {
  display: flex;
  background: $color-background;
  
  &__list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  &__item {
    margin: 0 1rem;
  }
  
  &__link {
    color: $color-text;
    text-decoration: none;
    
    &:hover {
      color: $color-primary;
    }
    
    &--active {
      color: $color-primary;
      font-weight: $font-weight-bold;
    }
  }
  
  // Modifier for dark theme
  &--dark {
    background: #333;
    
    .navigation__link {
      color: #fff;
    }
  }
}
```

## JavaScript Patterns

### Namespace Pattern

```javascript
// Avoid global pollution
var MYAPP = MYAPP || {};

MYAPP.navigation = {
    init: function() {
        this.bindEvents();
    },
    
    bindEvents: function() {
        $('.navigation__toggle').on('click', this.toggle.bind(this));
    },
    
    toggle: function(e) {
        e.preventDefault();
        $('.navigation__menu').toggleClass('is-open');
    }
};

// Initialize
$(document).ready(function() {
    MYAPP.navigation.init();
});
```

### Module Pattern

```javascript
var MYAPP = MYAPP || {};

MYAPP.modal = (function($) {
    // Private variables
    var $modal = null;
    var isOpen = false;
    
    // Private functions
    function bindEvents() {
        $(document).on('click', '[data-modal-open]', open);
        $(document).on('click', '[data-modal-close]', close);
        $(document).on('click', '.modal__overlay', close);
        $(document).on('keydown', handleKeydown);
    }
    
    function handleKeydown(e) {
        if (e.key === 'Escape' && isOpen) {
            close();
        }
    }
    
    // Public functions
    function init() {
        bindEvents();
    }
    
    function open(e) {
        e.preventDefault();
        var target = $(this).data('modal-open');
        $modal = $('#' + target);
        $modal.addClass('is-visible');
        isOpen = true;
        $('body').addClass('modal-open');
    }
    
    function close() {
        if ($modal) {
            $modal.removeClass('is-visible');
            isOpen = false;
            $('body').removeClass('modal-open');
        }
    }
    
    // Expose public API
    return {
        init: init,
        open: open,
        close: close
    };
})(jQuery);
```

### Document Ready Pattern

```javascript
// Short syntax
$(function() {
    // DOM ready
    MYAPP.init();
});

// Full syntax (preferred for clarity)
$(document).ready(function() {
    MYAPP.init();
});

// When also waiting for images
$(window).on('load', function() {
    // All assets loaded
    MYAPP.initAfterLoad();
});
```

## jQuery Best Practices

### Cache Selectors

```javascript
// BAD - queries DOM multiple times
$('.header').addClass('sticky');
$('.header').find('.nav').show();
$('.header').attr('data-visible', 'true');

// GOOD - cache the selector
var $header = $('.header');
$header.addClass('sticky');
$header.find('.nav').show();
$header.attr('data-visible', 'true');

// BETTER - chain methods
$('.header')
    .addClass('sticky')
    .find('.nav').show()
    .end()
    .attr('data-visible', 'true');
```

### Event Delegation

```javascript
// BAD - binds to each element (memory heavy)
$('.item').on('click', function() {
    $(this).toggleClass('active');
});

// GOOD - delegate from parent (handles dynamic elements)
$('.item-list').on('click', '.item', function() {
    $(this).toggleClass('active');
});

// For document-level delegation
$(document).on('click', '[data-action="delete"]', function(e) {
    e.preventDefault();
    var id = $(this).data('id');
    deleteItem(id);
});
```

### AJAX Patterns

```javascript
// Basic GET request
$.get('/api/items', function(data) {
    renderItems(data);
});

// POST with data
$.post('/api/items', { name: 'New Item' }, function(response) {
    showSuccess('Item created');
});

// Full AJAX with error handling
$.ajax({
    url: '/api/items',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ name: 'New Item' }),
    beforeSend: function() {
        showLoader();
    },
    success: function(response) {
        showSuccess('Item created');
        refreshList();
    },
    error: function(xhr, status, error) {
        showError('Failed to create item: ' + error);
    },
    complete: function() {
        hideLoader();
    }
});
```

### Form Handling

```javascript
// Form submission with AJAX
$('#contact-form').on('submit', function(e) {
    e.preventDefault();
    
    var $form = $(this);
    var $submit = $form.find('[type="submit"]');
    var formData = $form.serialize();
    
    // Disable button during submission
    $submit.prop('disabled', true).text('Sending...');
    
    $.ajax({
        url: $form.attr('action'),
        type: $form.attr('method') || 'POST',
        data: formData,
        success: function(response) {
            $form[0].reset();
            showSuccess('Message sent successfully');
        },
        error: function(xhr) {
            var errors = xhr.responseJSON;
            showErrors(errors);
        },
        complete: function() {
            $submit.prop('disabled', false).text('Send');
        }
    });
});

// Client-side validation
function validateForm($form) {
    var isValid = true;
    
    $form.find('[required]').each(function() {
        var $field = $(this);
        var value = $field.val().trim();
        
        if (!value) {
            $field.addClass('is-invalid');
            isValid = false;
        } else {
            $field.removeClass('is-invalid');
        }
    });
    
    return isValid;
}
```

### Animation and Transitions

```javascript
// Fade animations
$('.notification').fadeIn(300);
$('.notification').fadeOut(300, function() {
    $(this).remove();
});

// Slide animations
$('.accordion__content').slideToggle(200);

// Custom animation
$('.element').animate({
    opacity: 0.5,
    marginLeft: '20px'
}, 300);

// Using CSS classes (preferred for performance)
$('.element').addClass('is-visible');
// Combined with CSS transition
// .element { transition: opacity 0.3s ease; }
// .element.is-visible { opacity: 1; }
```

## Responsive Patterns

### Mobile-First CSS

```scss
// Start with mobile styles
.container {
  padding: 1rem;
  
  // Tablet and up
  @include respond-to('md') {
    padding: 2rem;
  }
  
  // Desktop and up
  @include respond-to('lg') {
    padding: 3rem;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### Responsive Images

```scss
.responsive-image {
  max-width: 100%;
  height: auto;
}

// Background image responsive
.hero {
  background-image: url('/images/hero-mobile.jpg');
  background-size: cover;
  background-position: center;
  
  @include respond-to('md') {
    background-image: url('/images/hero-tablet.jpg');
  }
  
  @include respond-to('lg') {
    background-image: url('/images/hero-desktop.jpg');
  }
}
```

### Print Styles

```scss
@media print {
  // Hide non-essential elements
  .navigation,
  .footer,
  .sidebar,
  .btn {
    display: none !important;
  }
  
  // Ensure content is readable
  body {
    font-size: 12pt;
    line-height: 1.4;
    color: #000;
    background: #fff;
  }
  
  // Show URLs for links
  a[href]::after {
    content: ' (' attr(href) ')';
  }
  
  // Avoid page breaks inside elements
  h1, h2, h3, h4 {
    page-break-after: avoid;
  }
  
  img, table, figure {
    page-break-inside: avoid;
  }
}
```

## Asset Management

### Script Loading Order

```html
<!-- In head: Critical CSS only -->
<link rel="stylesheet" href="/css/critical.css">

<!-- Defer non-critical CSS -->
<link rel="preload" href="/css/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">

<!-- Before closing body: Scripts -->
<script src="/js/vendor/jquery.min.js"></script>
<script src="/js/vendor/plugins.js"></script>
<script src="/js/main.js"></script>
```

### Cache Busting

```html
<!-- Version query string -->
<link rel="stylesheet" href="/css/main.css?v=1.2.3">
<script src="/js/main.js?v=1.2.3"></script>

<!-- Or hash-based (build tool generated) -->
<link rel="stylesheet" href="/css/main.a1b2c3d4.css">
<script src="/js/main.e5f6g7h8.js"></script>
```
