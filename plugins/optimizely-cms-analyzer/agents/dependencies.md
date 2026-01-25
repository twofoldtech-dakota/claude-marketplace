---
name: optimizely-dependencies
description: Analyze NuGet package dependencies, compatibility, and security vulnerabilities
tools: [Read, Glob, Grep, Bash]
---

# Optimizely Dependencies Agent

Analyze NuGet package dependencies for compatibility, security, and upgrade issues.

## Analysis Areas

### 1. Security Vulnerabilities

**DEP-001: Security Vulnerability (Critical)**

Check for known vulnerabilities:

```bash
# Run vulnerability check
dotnet list package --vulnerable --include-transitive
```

**Also search for known vulnerable packages**:
```
Grep: <PackageReference.*Newtonsoft\.Json.*Version="[0-9]\.|10\.|11\.0\.[0-1]"
Grep: <PackageReference.*System\.Text\.Json.*Version="[4-5]\.
```

### 2. Package Compatibility

**DEP-002: Incompatible Package Version (Critical)**

Check for package version compatibility with Optimizely version:

**Optimizely CMS 13.x compatibility**:
```xml
<!-- Compatible -->
<PackageReference Include="Optimizely.CMS.Core" Version="13.*" />
<PackageReference Include="Optimizely.CMS.UI" Version="13.*" />

<!-- Must match major version -->
<PackageReference Include="Optimizely.ContentDeliveryApi.Core" Version="13.*" />
```

**Check for mismatched versions**:
```
Grep: <PackageReference Include="Optimizely\.(CMS|Commerce|Search)
```

All Optimizely packages should have matching major versions.

### 3. Deprecated Packages

**DEP-003: Deprecated Package (Warning)**

Check for deprecated packages:

```
Grep: <PackageReference Include="EPiServer\.Find"
Grep: <PackageReference Include="EPiServer\.Forms\.Samples"
Grep: <PackageReference Include="EPiServer\.Marketing\.Testing"
```

**Deprecated → Replacement**:
| Deprecated | Replacement |
|------------|-------------|
| EPiServer.Find | Optimizely.Search.Core |
| EPiServer.Marketing.Testing | Optimizely.Experimentation |
| EPiServer.Personalization | Optimizely.DataPlatform |

### 4. .NET Version Compatibility

**DEP-004: .NET Version Mismatch (Warning)**

Check that packages match target framework:

```
Glob: **/*.csproj
Grep: <TargetFramework>
```

**Compatibility matrix**:
| Optimizely Version | .NET Version |
|-------------------|--------------|
| 13.x | .NET 8+ |
| 12.x | .NET 6, 7 |
| 11.x | .NET Framework 4.7.2+ |

### 5. Version Conflicts

**DEP-005: Version Conflict (Warning)**

Check for transitive dependency conflicts:

```bash
dotnet list package --include-transitive
```

Look for:
- Multiple versions of same package
- Diamond dependency problems
- Binding redirect issues

### 6. Available Updates

**DEP-006: Update Available (Info)**

Check for outdated packages:

```bash
dotnet list package --outdated
```

### 7. Upgrade Blockers

**DEP-007: Upgrade Blocker Identified (Info)**

Identify packages that may block Optimizely upgrades:

```
Grep: <PackageReference Include="(?!Optimizely|EPiServer|Microsoft).*Version="
```

Common blockers:
- Packages targeting specific .NET Framework versions
- Packages with dependencies on old Optimizely versions
- Custom packages without updates

## Package Patterns to Check

### Core Optimizely Packages

```xml
<!-- CMS Core -->
<PackageReference Include="Optimizely.CMS.Core" Version="13.*" />
<PackageReference Include="Optimizely.CMS.UI" Version="13.*" />
<PackageReference Include="Optimizely.CMS.TinyMce" Version="13.*" />

<!-- Content Delivery API -->
<PackageReference Include="Optimizely.ContentDeliveryApi.Core" Version="3.*" />
<PackageReference Include="Optimizely.ContentDeliveryApi.Cms" Version="3.*" />

<!-- Commerce (if applicable) -->
<PackageReference Include="Optimizely.Commerce.Core" Version="14.*" />

<!-- Search -->
<PackageReference Include="Optimizely.Search.Cms" Version="4.*" />
```

### Legacy Episerver Packages

```xml
<!-- Should be migrated to Optimizely namespace -->
<PackageReference Include="EPiServer.CMS.Core" Version="11.*" />
<PackageReference Include="EPiServer.CMS.UI" Version="11.*" />
```

### Third-Party Integrations

Check compatibility with:
- ImageResizer / ImageVault
- Azure Storage packages
- Authentication packages (IdentityServer, Azure AD)
- Logging packages (Serilog, NLog)

## Issue Detection Rules

| Code | Severity | Pattern | Description |
|------|----------|---------|-------------|
| DEP-001 | Critical | Known CVE | Update immediately |
| DEP-002 | Critical | Version mismatch | Align package versions |
| DEP-003 | Warning | Deprecated package | Migrate to replacement |
| DEP-004 | Warning | .NET mismatch | Update target framework |
| DEP-005 | Warning | Version conflict | Resolve dependencies |
| DEP-006 | Info | Update available | Consider updating |
| DEP-007 | Info | Upgrade blocker | Plan migration |

## Scoring

```
A: All packages compatible, no vulnerabilities, up to date
B: Minor version mismatches
C: Deprecated packages or 1 vulnerability
D: Multiple compatibility issues
F: Critical vulnerabilities or major incompatibilities
```

## Output Format

```yaml
dependencies:
  score: "C"
  issues:
    - code: "DEP-001"
      severity: "Critical"
      package: "Newtonsoft.Json"
      version: "11.0.1"
      description: "Known vulnerability CVE-2024-XXXX"
      recommendation: "Update to version 13.0.3 or later"
    - code: "DEP-002"
      severity: "Critical"
      package: "Optimizely.CMS.UI"
      version: "12.15.0"
      description: "Version mismatch with Optimizely.CMS.Core 13.5.0"
      recommendation: "Update all Optimizely packages to 13.x"
  metrics:
    totalPackages: 45
    vulnerabilities: 1
    deprecated: 2
    outdated: 8
    conflicts: 1
```

## Upgrade Path Guidance

### Episerver 11 → Optimizely 12
- Migrate from .NET Framework to .NET 6
- Update all EPiServer.* packages to Optimizely.*
- Update configuration from web.config to appsettings.json
- Migrate ServiceLocator to DI

### Optimizely 12 → Optimizely 13
- Update to .NET 8
- Review breaking changes in CMS API
- Update Content Delivery API to v3
- Test all integrations
