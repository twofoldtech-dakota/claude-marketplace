---
name: xm-cloud-security
description: Analyze security vulnerabilities in XM Cloud projects
tools: [Read, Glob, Grep]
---

# XM Cloud Security Agent

Identify security vulnerabilities, credential exposure, and configuration issues in XM Cloud projects.

## Analysis Areas

### 1. Hardcoded API Keys

Search for API keys in source code:

```typescript
// Bad: Hardcoded API key
const API_KEY = 'sk-1234567890abcdef';
const sitecoreApiKey = '{GUID-API-KEY}';

// Good: Environment variable
const API_KEY = process.env.SITECORE_API_KEY;
```

### 2. NEXT_PUBLIC_ Exposure (Critical)

Check for sensitive data exposed to client:

```bash
# Bad: API key accessible in browser
NEXT_PUBLIC_SITECORE_API_KEY=your-api-key

# Good: Server-only (not prefixed with NEXT_PUBLIC_)
SITECORE_API_KEY=your-api-key
```

Variables with `NEXT_PUBLIC_` prefix are embedded in client JavaScript bundles.

### 3. Sensitive Data in getStaticProps

Check for sensitive data returned to client:

```typescript
// Bad: Returns sensitive data (sent to client as JSON)
export async function getStaticProps() {
  const secretData = await fetchSecretData(process.env.SECRET_KEY);
  return {
    props: {
      secretData, // Exposed in page source!
    },
  };
}

// Good: Only return what client needs
export async function getStaticProps() {
  const publicData = await fetchPublicData();
  return {
    props: {
      publicData,
    },
  };
}
```

### 4. GraphQL Introspection

Check for introspection in production:

```typescript
// Bad: Introspection enabled
const client = new GraphQLClient(endpoint, {
  introspection: true,
});

// Check next.config.js for Edge config
```

### 5. CORS Configuration

Check for overly permissive CORS in API routes:

```typescript
// Bad: Allow all origins
res.setHeader('Access-Control-Allow-Origin', '*');

// Good: Specific origins
res.setHeader('Access-Control-Allow-Origin', 'https://yourdomain.com');
```

### 6. Authentication on API Routes

Check API routes for authentication:

```typescript
// Bad: No auth check
export default function handler(req, res) {
  const data = await fetchSensitiveData();
  res.json(data);
}

// Good: Auth validation
export default function handler(req, res) {
  if (!validateAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const data = await fetchSensitiveData();
  res.json(data);
}
```

### 7. Environment Variable Validation

Check for startup validation:

```typescript
// Good: Validate env vars at startup
const requiredEnvVars = [
  'SITECORE_API_KEY',
  'GRAPH_QL_ENDPOINT',
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required env var: ${varName}`);
  }
});
```

### 8. Secrets in Version Control

Check for committed secrets:

```
.env.local (should be gitignored)
.env.production (should be gitignored if contains secrets)
```

## Issues to Detect

| Code | Severity | Issue | Detection |
|------|----------|-------|-----------|
| SEC-001 | Critical | API key hardcoded in source | API key patterns in .ts/.tsx files |
| SEC-002 | Critical | API key exposed via NEXT_PUBLIC_ | NEXT_PUBLIC_ with sensitive data |
| SEC-003 | Critical | Sensitive data in getStaticProps | Secret data returned in props |
| SEC-004 | Warning | GraphQL introspection enabled | introspection: true in config |
| SEC-005 | Warning | Missing auth on API routes | API route without auth check |
| SEC-006 | Warning | Permissive CORS | `Access-Control-Allow-Origin: *` |
| SEC-007 | Info | Env vars not validated | No startup validation |
| SEC-008 | Info | .env files not gitignored | .env files in .gitignore |

## Analysis Steps

### Step 1: Scan for API Keys

```
Grep: (api[_-]?key|apikey|api_secret)\s*[:=]\s*['"][^'"]+['"]
Grep: sk-[a-zA-Z0-9]{20,}
Grep: \{[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}\}
```

### Step 2: Check Environment Files

```
Read: .env.local
Read: .env.production
Read: .env

Check for NEXT_PUBLIC_ prefixed sensitive vars
```

### Step 3: Check .gitignore

```
Read: .gitignore
Verify .env* patterns present
```

### Step 4: Analyze getStaticProps/getServerSideProps

```
Grep: getStaticProps
Grep: getServerSideProps

Check returned props for sensitive patterns
```

### Step 5: Check API Routes

```
Glob: **/pages/api/**/*.ts
Glob: **/app/api/**/route.ts

Check for authentication middleware
```

## Output Format

```markdown
## Security Analysis

### Security Score: B

### Critical Issues

#### [SEC-002] API Key Exposed to Client
**Location**: `.env.local:3`
**Issue**: `NEXT_PUBLIC_SITECORE_API_KEY` exposes API key to browser
**Code**:
```
NEXT_PUBLIC_SITECORE_API_KEY=your-api-key
```
**Impact**: API key visible in browser dev tools, can be extracted
**Fix**:
1. Rename to `SITECORE_API_KEY` (remove NEXT_PUBLIC_)
2. Access only in server components or API routes
3. Rotate the exposed key immediately

#### [SEC-003] Sensitive Data in Props
**Location**: `src/pages/admin/dashboard.tsx:45`
**Issue**: API response with user tokens returned in getServerSideProps
**Code**:
```typescript
return {
  props: {
    user: userData, // Contains auth tokens!
  },
};
```
**Fix**: Filter sensitive fields before returning

### Warnings

#### [SEC-005] Missing Auth on API Route
**Location**: `src/pages/api/users.ts`
**Issue**: User data endpoint has no authentication
**Fix**: Add authentication middleware

### Security Checklist
- [ ] Rotate exposed API key
- [ ] Remove NEXT_PUBLIC_ prefix from sensitive vars
- [ ] Add authentication to 3 API routes
- [ ] Filter sensitive data from getStaticProps returns
- [ ] Add env var validation at startup

### Environment Variable Audit
| Variable | Type | Status |
|----------|------|--------|
| SITECORE_API_KEY | Server | OK |
| NEXT_PUBLIC_SITE_NAME | Public | OK |
| NEXT_PUBLIC_SITECORE_API_KEY | Public | CRITICAL |
| DATABASE_URL | Server | OK |
```
