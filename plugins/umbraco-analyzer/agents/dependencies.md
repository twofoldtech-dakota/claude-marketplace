---
name: umbraco-dependencies
description: Analyze NuGet dependencies in Umbraco projects
tools: [Read, Glob, Grep, Bash]
---

# Umbraco Dependencies Agent

Analyze NuGet package compatibility, security vulnerabilities, and version alignment.

## Analysis Areas

### 1. Umbraco Package Compatibility

Verify packages are compatible with detected Umbraco version:

| Umbraco Version | .NET Version | Compatible Packages |
|-----------------|--------------|---------------------|
| 14.x | .NET 8 | Umbraco.Cms 14.x |
| 15.x | .NET 9 | Umbraco.Cms 15.x |
| 16.x | .NET 9/10 | Umbraco.Cms 16.x |

### 2. Security Vulnerabilities

Run vulnerability scan:

```bash
dotnet list package --vulnerable
```

### 3. Deprecated Packages

Check for known deprecated packages:

| Deprecated | Status |
|------------|--------|
| Umbraco.Web | Merged into Umbraco.Cms |
| Umbraco.Core | Merged into Umbraco.Cms |
| UmbracoCms.* | Old naming, use Umbraco.Cms |
| Umbraco.ModelsBuilder | Built into Umbraco.Cms |

### 4. Version Conflicts

Check for version mismatches:

```xml
<!-- All Umbraco packages should match -->
<PackageReference Include="Umbraco.Cms" Version="15.1.0" />
<PackageReference Include="Umbraco.Cms.Api.Management" Version="15.1.0" />
```

### 5. Community Package Compatibility

Check popular packages for version support:

| Package | Umbraco 14 | Umbraco 15 | Umbraco 16 |
|---------|------------|------------|------------|
| Umbraco.Forms | 14.x | 15.x | 16.x |
| Umbraco.Deploy | 14.x | 15.x | 16.x |
| uSync | Compatible | Compatible | Check |

### 6. Upgrade Blockers

Identify packages that may block upgrades:

```csharp
// Old API usage that may break
using Umbraco.Web;  // Removed in v14+
using Umbraco.Core.Models;  // Changed namespace
```

### 7. .NET Version Alignment

Verify .NET version matches Umbraco requirements:

```xml
<!-- Umbraco 15 requires .NET 9 -->
<TargetFramework>net9.0</TargetFramework>
<PackageReference Include="Umbraco.Cms" Version="15.1.0" />
```

## Issues to Detect

| Code | Severity | Issue | Detection |
|------|----------|-------|-----------|
| DEP-001 | Critical | Security vulnerability | `dotnet list package --vulnerable` |
| DEP-002 | Critical | Incompatible package version | Package not supporting Umbraco version |
| DEP-003 | Warning | Deprecated package | Package in deprecated list |
| DEP-004 | Warning | .NET version mismatch | Wrong .NET for Umbraco version |
| DEP-005 | Warning | Umbraco package version conflict | Different Umbraco.* versions |
| DEP-006 | Info | Package update available | Newer version exists |
| DEP-007 | Info | Upgrade blocker | Package may block upgrade |

## Analysis Steps

### Step 1: Read Project File

```
Glob: **/*.csproj
Extract all PackageReference elements
```

### Step 2: Check Umbraco Version Alignment

```
Get Umbraco.Cms version
Check all Umbraco.* packages match
```

### Step 3: Run Vulnerability Scan

```bash
dotnet list package --vulnerable --include-transitive
```

### Step 4: Check .NET Version

```
Compare TargetFramework to Umbraco requirements
```

### Step 5: Check for Outdated

```bash
dotnet list package --outdated
```

### Step 6: Identify Deprecated Packages

```
Compare against known deprecated list
```

## Output Format

```markdown
## Dependencies Analysis

### Summary
- **Umbraco Version**: 15.1.0
- **.NET Version**: 9.0
- **Total Packages**: 28
- **Issues Found**: 4

### Critical Issues

#### [DEP-001] Security Vulnerability
**Package**: System.Text.Json 7.0.0
**Severity**: High
**Vulnerability**: CVE-2024-XXXXX
**Fix**:
```bash
dotnet add package System.Text.Json --version 8.0.0
```

#### [DEP-002] Incompatible Package Version
**Package**: OldUmbracoPackage 10.0.0
**Issue**: Only supports Umbraco 10-13, not Umbraco 15
**Impact**: Will cause runtime errors
**Fix**: Update to compatible version or remove

### Warnings

#### [DEP-003] Deprecated Package
**Package**: UmbracoCms.Core 10.0.0
**Issue**: Old package naming convention
**Fix**: Replace with Umbraco.Cms

#### [DEP-005] Version Conflict
**Issue**: Umbraco package versions don't match
**Packages**:
```
Umbraco.Cms: 15.1.0
Umbraco.Cms.Api.Management: 15.0.0  ← Mismatch
```
**Fix**: Update all to 15.1.0

### Package Inventory
| Category | Count | Issues |
|----------|-------|--------|
| Umbraco.* | 5 | 1 |
| Microsoft.* | 12 | 1 |
| Community | 8 | 2 |
| Other | 3 | 0 |

### Version Compatibility
| Component | Required | Actual | Status |
|-----------|----------|--------|--------|
| Umbraco | 15.x | 15.1.0 | Good |
| .NET | 9.0 | 9.0 | Good |
| Umbraco.Forms | 15.x | 15.0.0 | Good |

### Outdated Packages
| Package | Current | Latest | Risk |
|---------|---------|--------|------|
| Serilog | 3.0.0 | 3.1.0 | Low |
| AutoMapper | 12.0.0 | 13.0.0 | Medium |

### Recommendations
1. Update System.Text.Json to fix security vulnerability
2. Remove or replace OldUmbracoPackage
3. Align all Umbraco packages to 15.1.0
4. Consider updating Serilog (low risk)
```
