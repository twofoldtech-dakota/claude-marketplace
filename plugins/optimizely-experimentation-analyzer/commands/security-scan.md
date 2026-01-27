---
name: security-scan
description: Preview analysis scope and check for sensitive patterns in Optimizely Experimentation code
argument_hint: "[--preview]"
---

# Optimizely Experimentation Security Scan Command

Preview what files will be analyzed and identify potential security concerns.

## Usage

```bash
/optimizely-exp:security-scan              # Run security preview
/optimizely-exp:security-scan --preview    # Detailed file listing
```

## What It Checks

### SDK Key Exposure
- Hardcoded SDK keys in source
- Private vs public key usage
- Environment variable patterns

### PII in Events
- Email, phone, or sensitive data in track() calls
- User attributes with PII

### CSP Configuration
- Content Security Policy headers
- Optimizely domains allowed

## Output

```
Optimizely Experimentation Security Scan

=== SDK Key Check ===
✓ Using environment variable: NEXT_PUBLIC_OPTIMIZELY_SDK_KEY
✓ Key appears to be public SDK key (client-safe)

=== Event Data Check ===
⚠️ Potential PII found:
  - src/tracking/events.ts:45 - track() includes 'email' property

=== CSP Check ===
⚠️ CSP not configured for Optimizely domains

=== Recommendations ===
1. Remove email from event properties
2. Add cdn.optimizely.com to CSP script-src
3. Add logx.optimizely.com to CSP connect-src
```
