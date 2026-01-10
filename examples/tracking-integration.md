# Complete Tracking Integration Example

This example shows a complete integration using a simple webhook service.

## Step 1: Create Webhook Endpoint

### Using n8n (Free, No Code)

1. Sign up at [n8n.io](https://n8n.io) (free cloud account)
2. Create new workflow
3. Add **Webhook** node:
   - Method: POST
   - Path: `plugin-usage`
   - Response: JSON
4. Add **Google Sheets** or **Database** node to store data
5. Copy webhook URL (e.g., `https://your-workflow.n8n.io/webhook/plugin-usage`)

### Using Simple Node.js Service

See `tracking-server.js` in the root directory.

Deploy to Railway:
```bash
railway init
railway up
# Get your URL: https://your-app.railway.app
```

## Step 2: Add Tracking to Commands

### Modified Command File Example

Add this section at the top of each command file (after the frontmatter):

```markdown
---
name: analyze
description: Analyze Sitecore 10.x projects for architecture, security, and performance issues
argument_hint: "[agent|all]"
---

# Sitecore Classic Analyzer

## Usage Tracking

When this command is invoked, track usage (non-blocking):

```bash
# Track command execution
if [ -z "$CLAUDE_PLUGIN_NO_TRACKING" ]; then
  curl -X POST "https://your-webhook.com/track" \
    -H "Content-Type: application/json" \
    -d "{\"plugin\":\"sitecore-classic-analyzer\",\"command\":\"analyze\",\"version\":\"1.0.0\",\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" \
    --max-time 1 \
    --silent \
    --fail-with-body > /dev/null 2>&1 || true
fi
```

**Note**: Tracking is optional and can be disabled by setting `CLAUDE_PLUGIN_NO_TRACKING=1`.

---

# Sitecore Classic Analyzer

[rest of command content...]
```

## Step 3: Update All Commands

Apply tracking to all command files:

```bash
# List all command files
find plugins -name "*.md" -path "*/commands/*"

# Add tracking section to each (manual or script)
```

## Step 4: Test Tracking

```bash
# Test a command
/sitecore-classic:analyze

# Check webhook received data
# (View in n8n dashboard or your tracking service)
```

## Step 5: View Analytics

### n8n Dashboard
- View workflow executions
- See all tracked events
- Export to CSV/JSON

### Custom Dashboard (if using Node.js service)

```bash
# Get stats
curl http://localhost:3000/stats

# Response:
{
  "total": 42,
  "byPlugin": {
    "sitecore-classic-analyzer": 25,
    "xm-cloud-analyzer": 12,
    "umbraco-analyzer": 5
  },
  "byCommand": {
    "analyze": 30,
    "enhance": 8,
    "security-scan": 4
  },
  "recent": [...]
}
```

## Step 6: Privacy & Opt-Out

### Document in README

Add to your main README.md:

```markdown
## Usage Tracking

This plugin tracks anonymous usage statistics to help improve the tool. 
We track:
- Plugin name
- Command name  
- Timestamp
- Version

**No personal information or code content is tracked.**

To opt out, set the environment variable:
```bash
export CLAUDE_PLUGIN_NO_TRACKING=1
```
```

## Step 7: Monitor Usage

### Daily Usage Report

Create a simple script to check daily usage:

```bash
#!/bin/bash
# daily-usage.sh

WEBHOOK_URL="https://your-webhook.com/stats"
curl "$WEBHOOK_URL" | jq '{
  total: .total,
  today: (.recent | map(select(.timestamp | startswith("'$(date +%Y-%m-%d)'"))) | length),
  top_plugins: .byPlugin,
  top_commands: .byCommand
}'
```

Run daily: `./daily-usage.sh`

## Advanced: Rich Analytics with PostHog

### Setup PostHog

1. Sign up at [posthog.com](https://posthog.com)
2. Create project
3. Get API key from Settings → Project API Key

### Update Tracking Code

```bash
curl -X POST "https://app.posthog.com/capture/" \
  -H "Content-Type: application/json" \
  -d "{
    \"api_key\": \"YOUR_API_KEY\",
    \"event\": \"plugin_command_executed\",
    \"properties\": {
      \"plugin\": \"sitecore-classic-analyzer\",
      \"command\": \"analyze\",
      \"version\": \"1.0.0\",
      \"\$set\": {
        \"plugin_version\": \"1.0.0\"
      }
    },
    \"distinct_id\": \"anonymous-$(whoami)\"
  }" \
  --max-time 1 \
  --silent \
  --fail-with-body > /dev/null 2>&1 || true
```

### View in PostHog Dashboard

- Events: See all command executions
- Insights: Create charts (usage over time, popular commands)
- Funnels: Track user journeys
- Cohorts: Group users by behavior

## Troubleshooting

### Tracking Not Working

1. **Check webhook URL**: Verify it's correct
2. **Test manually**: `curl -X POST "your-webhook-url" -d '{"test":true}'`
3. **Check logs**: Look for curl errors
4. **Verify opt-out**: Ensure `CLAUDE_PLUGIN_NO_TRACKING` is not set

### Privacy Concerns

- Use local logging if webhooks aren't acceptable
- Allow opt-out via environment variable
- Document what's tracked
- Don't track PII or code content

## Next Steps

1. ✅ Choose tracking method (webhook recommended)
2. ✅ Add tracking to all commands
3. ✅ Test with a few commands
4. ✅ Document in README
5. ✅ Set up monitoring/alerts
6. ✅ Review analytics weekly
