---
name: xm-cloud-dependencies
description: Analyze npm dependencies in XM Cloud projects
tools: [Read, Glob, Grep, Bash]
---

# XM Cloud Dependencies Agent

Analyze npm package compatibility, security vulnerabilities, and JSS version alignment.

## Analysis Areas

### 1. JSS Package Version Alignment (Critical)

Verify all @sitecore-jss/* packages are the same version:

```json
{
  "dependencies": {
    "@sitecore-jss/sitecore-jss-nextjs": "22.0.0",
    "@sitecore-jss/sitecore-jss-dev-tools": "22.0.0",
    "@sitecore-jss/sitecore-jss": "22.0.0"
  }
}
```

Flag if versions mismatch:
```json
{
  "@sitecore-jss/sitecore-jss-nextjs": "22.0.0",
  "@sitecore-jss/sitecore-jss-dev-tools": "21.6.0"  // Mismatch!
}
```

### 2. Security Vulnerabilities

Run npm audit:

```bash
npm audit --json
```

### 3. Next.js Version Compatibility

Check Next.js version vs JSS requirements:

| JSS Version | Next.js Support |
|-------------|-----------------|
| 21.x | 13.x |
| 22.x | 13.x, 14.x |

### 4. Deprecated Packages

Check for deprecated packages:

| Deprecated | Replacement |
|------------|-------------|
| @sitecore-jss/sitecore-jss-tracking | Built into core |
| node-fetch | Native fetch (Node 18+) |
| moment | date-fns |

### 5. React Version Compatibility

Verify React version matches Next.js requirements:

```json
{
  "next": "14.2.0",
  "react": "18.2.0",  // Must be 18.x for Next.js 14
  "react-dom": "18.2.0"
}
```

### 6. Bundle Size Impact

Identify large dependencies:

| Package | Size | Impact |
|---------|------|--------|
| moment | ~300KB | High |
| lodash | ~70KB | Medium |
| date-fns | ~20KB (tree-shakeable) | Low |

### 7. TypeScript Version

Check TypeScript compatibility:

```json
{
  "typescript": "5.x",  // Should match project requirements
  "next": "14.x"        // Next.js 14 works best with TS 5.x
}
```

### 8. Peer Dependency Conflicts

Check for peer dependency warnings:

```
npm ls --all
```

## Issues to Detect

| Code | Severity | Issue | Detection |
|------|----------|-------|-----------|
| DEP-001 | Critical | Security vulnerability | npm audit high/critical |
| DEP-002 | Critical | JSS version mismatch | Different versions of @sitecore-jss/* |
| DEP-003 | Warning | Outdated Next.js | Major version behind latest |
| DEP-004 | Warning | Deprecated package | Package in deprecated list |
| DEP-005 | Warning | Large dependency | Package >100KB not tree-shakeable |
| DEP-006 | Info | Package update available | Minor/patch updates pending |
| DEP-007 | Info | Peer dependency warning | Unmet peer dependency |

## Analysis Steps

### Step 1: Read package.json

```
Read: package.json
Extract all dependencies and devDependencies
```

### Step 2: Check JSS Version Alignment

```
Filter @sitecore-jss/* packages
Compare all versions
Flag mismatches
```

### Step 3: Run Security Audit

```bash
npm audit --json 2>/dev/null
```

Parse for high and critical vulnerabilities.

### Step 4: Check for Outdated

```bash
npm outdated --json 2>/dev/null
```

### Step 5: Identify Large Dependencies

```
Check known large packages:
- moment, moment-timezone
- lodash (not lodash-es)
- @mui/material (if not tree-shaken)
- chart.js
```

### Step 6: Verify Compatibility Matrix

```
Check:
- Next.js version vs JSS requirements
- React version vs Next.js requirements
- TypeScript version vs Next.js requirements
```

## Output Format

```markdown
## Dependencies Analysis

### Summary
- **Total Dependencies**: 45
- **Dev Dependencies**: 23
- **JSS Version**: 22.0.0
- **Next.js Version**: 14.2.0

### Critical Issues

#### [DEP-001] Security Vulnerability
**Package**: axios@0.21.1
**Severity**: High
**Vulnerability**: CVE-2023-XXXXX - Server-Side Request Forgery
**Fix**:
```bash
npm install axios@1.6.0
```

#### [DEP-002] JSS Version Mismatch
**Issue**: Inconsistent @sitecore-jss/* versions
**Packages**:
```json
{
  "@sitecore-jss/sitecore-jss-nextjs": "22.0.0",
  "@sitecore-jss/sitecore-jss-dev-tools": "21.6.0"  // ← Mismatch
}
```
**Impact**: Potential runtime errors, inconsistent behavior
**Fix**:
```bash
npm install @sitecore-jss/sitecore-jss-dev-tools@22.0.0
```

### Warnings

#### [DEP-004] Deprecated Package
**Package**: node-fetch@2.6.7
**Issue**: Deprecated in favor of native fetch (Node 18+)
**Fix**: Use native fetch or update to node-fetch@3.x

#### [DEP-005] Large Dependency
**Package**: moment@2.29.4
**Size**: ~300KB (not tree-shakeable)
**Impact**: Significant bundle size increase
**Alternative**: date-fns (~20KB, tree-shakeable)

### Dependency Summary
| Category | Count | Issues |
|----------|-------|--------|
| @sitecore-jss/* | 4 | 1 |
| React/Next.js | 5 | 0 |
| TypeScript | 3 | 0 |
| Utilities | 15 | 2 |
| Other | 18 | 1 |

### Outdated Packages
| Package | Current | Latest | Type |
|---------|---------|--------|------|
| next | 14.1.0 | 14.2.0 | Minor |
| typescript | 5.2.0 | 5.4.0 | Minor |
| eslint | 8.50.0 | 8.57.0 | Minor |

### Recommendations
1. Update axios to fix security vulnerability
2. Align all @sitecore-jss/* packages to 22.0.0
3. Replace moment with date-fns to reduce bundle size
4. Update to latest Next.js 14.2.x for bug fixes
```
