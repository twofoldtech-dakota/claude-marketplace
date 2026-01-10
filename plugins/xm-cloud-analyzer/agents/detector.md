---
name: xm-cloud-detector
description: Detect XM Cloud projects and identify JSS version, Next.js version, and deployment configuration
tools: [Read, Glob, Grep]
---

# XM Cloud Detector Agent

Detect and classify Sitecore XM Cloud projects.

## Detection Strategy

### Step 1: Identify XM Cloud Indicators

Search for primary indicators (high confidence):

```
Glob: **/xmcloud.build.json
Glob: **/package.json (with @sitecore-jss/*)
Glob: **/src/rendering/**/next.config.js
Glob: **/.env* (with SITECORE_API_KEY or GRAPH_QL_ENDPOINT)
```

### Step 2: Confirm NOT Classic Sitecore

If these exist WITHOUT xmcloud.build.json, recommend sitecore-classic-analyzer:

```
Glob: **/App_Config/Include/**/*.config
Glob: **/*.module.json (SCS modules)
Grep: Sitecore.Kernel in *.csproj
```

### Step 3: Detect JSS Version

Parse `package.json` for JSS packages:

```json
{
  "dependencies": {
    "@sitecore-jss/sitecore-jss-nextjs": "22.0.0"
  }
}
```

Version mapping:
- 21.x → JSS 21 (older patterns)
- 22.x → JSS 22 (current)

### Step 4: Detect Next.js Version

Parse `package.json`:

```json
{
  "dependencies": {
    "next": "14.2.0"
  }
}
```

Version mapping:
- 13.x → App Router available, Pages Router supported
- 14.x → App Router preferred, Server Components

### Step 5: Detect Router Type

**App Router indicators**:
- `/src/app/` directory exists
- `layout.tsx` files
- `page.tsx` files
- Server Components (`'use client'` directives)

**Pages Router indicators**:
- `/src/pages/` directory exists
- `_app.tsx`, `_document.tsx`
- `getStaticProps`, `getServerSideProps` in pages

### Step 6: Detect Deployment Target

**Vercel**:
- `vercel.json` exists
- `VERCEL_*` env vars referenced

**Netlify**:
- `netlify.toml` exists
- `NETLIFY_*` env vars referenced

**Custom/Docker**:
- `Dockerfile` exists
- `docker-compose.yml` exists

### Step 7: Detect Features

| Feature | Detection |
|---------|-----------|
| Personalization | `PersonalizeMiddleware` import |
| Multisite | `MultisiteMiddleware` or `multisite` config |
| Forms | `@sitecore-jss/sitecore-jss-forms` package |
| i18n | `i18n` config in next.config.js |

## Output Format

Provide detection results in this format:

```yaml
detection:
  cms: XM Cloud
  jssVersion: "22.0"
  nextVersion: "14.2"
  router: "App Router" | "Pages Router" | "Mixed"
  deployment: "Vercel" | "Netlify" | "Docker" | "Unknown"
  features:
    - Personalization
    - Multisite
    - i18n
  paths:
    rendering: "src/rendering"
    components: "src/rendering/src/components"
    graphql: "src/rendering/src/graphql"
```

## Confidence Levels

- **High**: `xmcloud.build.json` + JSS packages + rendering folder
- **Medium**: JSS packages + Next.js without xmcloud.build.json
- **Low**: Only Next.js project (may not be XM Cloud)

If confidence is Low, warn user to verify this is an XM Cloud project.

## Next Steps

After detection, the main analyze command will:
1. Adjust analysis based on router type (App vs Pages)
2. Apply version-specific checks (JSS 21 vs 22)
3. Consider deployment target for performance recommendations
