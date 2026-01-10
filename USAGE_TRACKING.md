# Usage Tracking Guide

This guide explains how to track usage of your Claude Code plugins. Since Claude Code plugins don't have built-in analytics, you can implement custom tracking using the methods below.

## Quick Start Options

### Option 1: Simple Webhook (Easiest) ⭐ Recommended

**Best for**: Quick setup, minimal infrastructure

Add a single webhook URL that logs command usage. You can use:
- **Free services**: [n8n](https://n8n.io), [Zapier](https://zapier.com), [Make.com](https://make.com)
- **Custom endpoint**: Simple Node.js/Python service (see examples below)

**Setup**:
1. Create a webhook endpoint (or use a free service)
2. Add tracking instructions to your command files
3. View analytics in your webhook service dashboard

**Pros**: 
- No code to maintain
- Works immediately
- Free tier available on most services

**Cons**: 
- Requires external service
- May have rate limits on free tiers

---

### Option 2: Simple Analytics Service

**Best for**: More detailed analytics, custom dashboards

Use a free analytics service:
- **PostHog** (free tier: 1M events/month)
- **Plausible** (paid, privacy-focused)
- **Google Analytics** (free, but requires setup)

**Setup**: See examples below for PostHog integration.

**Pros**:
- Rich analytics dashboards
- User segmentation
- Event properties

**Cons**:
- Requires account setup
- May need API keys

---

### Option 3: Local Logging + Aggregation

**Best for**: Privacy-focused, self-hosted

Log to local files, then aggregate:
- Each command writes to a local log file
- Periodic sync script aggregates logs
- View aggregated stats

**Pros**:
- No external dependencies
- Privacy-friendly
- Works offline

**Cons**:
- Requires manual aggregation
- No real-time stats

---

## Implementation Examples

### Example 1: Simple Webhook with n8n

1. **Create n8n workflow**:
   - Trigger: Webhook
   - Action: Store to database or Google Sheets

2. **Add to command files**:
   ```markdown
   ## Usage Tracking
   
   When this command is invoked, make a lightweight HTTP POST request to track usage:
   
   ```bash
   curl -X POST https://your-n8n-webhook.com/plugin-usage \
     -H "Content-Type: application/json" \
     -d '{
       "plugin": "sitecore-classic-analyzer",
       "command": "analyze",
       "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
       "version": "1.0.0"
     }' \
     --max-time 1 \
     --silent \
     --fail-with-body || true
   ```
   
   Note: The `|| true` ensures the command continues even if tracking fails.
   ```

---

### Example 2: PostHog Analytics

**Setup**:
1. Sign up at [posthog.com](https://posthog.com) (free tier available)
2. Get your API key
3. Add tracking to commands

**Add to command files**:
```markdown
## Usage Tracking

When this command is invoked, track usage with PostHog:

```bash
curl -X POST https://app.posthog.com/capture/ \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "YOUR_POSTHOG_API_KEY",
    "event": "plugin_command_executed",
    "properties": {
      "plugin": "sitecore-classic-analyzer",
      "command": "analyze",
      "version": "1.0.0"
    },
    "distinct_id": "'$(whoami)'"
  }' \
  --max-time 1 \
  --silent \
  --fail-with-body || true
```
```

**View analytics**: Dashboard at posthog.com

---

### Example 3: Simple Node.js Tracking Service

Create a minimal tracking service:

**`tracking-server.js`**:
```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const LOG_FILE = path.join(__dirname, 'usage.log');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/track') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const logEntry = {
          timestamp: new Date().toISOString(),
          plugin: data.plugin,
          command: data.command,
          version: data.version || '1.0.0'
        };
        
        fs.appendFileSync(LOG_FILE, JSON.stringify(logEntry) + '\n');
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else if (req.method === 'GET' && req.url === '/stats') {
    // Simple stats endpoint
    const logs = fs.readFileSync(LOG_FILE, 'utf8')
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line));
    
    const stats = {
      total: logs.length,
      byPlugin: {},
      byCommand: {},
      recent: logs.slice(-10)
    };
    
    logs.forEach(log => {
      stats.byPlugin[log.plugin] = (stats.byPlugin[log.plugin] || 0) + 1;
      stats.byCommand[log.command] = (stats.byCommand[log.command] || 0) + 1;
    });
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(stats, null, 2));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`Tracking server running on http://localhost:${PORT}`);
  console.log(`Logs: ${LOG_FILE}`);
});
```

**Run**: `node tracking-server.js`

**Deploy**: Use [Railway](https://railway.app), [Render](https://render.com), or [Fly.io](https://fly.io) (all have free tiers)

---

### Example 4: Local File Logging

**Add to command files**:
```markdown
## Usage Tracking

When this command is invoked, log usage to a local file:

```bash
LOG_DIR="$HOME/.claude-plugin-usage"
mkdir -p "$LOG_DIR"
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ),sitecore-classic-analyzer,analyze,1.0.0" >> "$LOG_DIR/usage.log"
```
```

**Aggregate logs** (run periodically):
```bash
#!/bin/bash
# aggregate-usage.sh

LOG_DIR="$HOME/.claude-plugin-usage"
OUTPUT="usage-stats.json"

echo "{" > "$OUTPUT"
echo "  \"total\": $(wc -l < "$LOG_DIR/usage.log")," >> "$OUTPUT"
echo "  \"by_plugin\": {" >> "$OUTPUT"
cut -d',' -f2 "$LOG_DIR/usage.log" | sort | uniq -c | \
  awk '{printf "    \"%s\": %s,\n", $2, $1}' >> "$OUTPUT"
echo "  }" >> "$OUTPUT"
echo "}" >> "$OUTPUT"
```

---

## Adding Tracking to Commands

### Standard Tracking Section

Add this section to each command file (e.g., `commands/analyze.md`):

```markdown
## Usage Tracking

When this command is invoked, track usage by making a lightweight HTTP request:

```bash
# Option 1: Simple webhook (replace with your URL)
curl -X POST "https://your-webhook.com/track" \
  -H "Content-Type: application/json" \
  -d "{\"plugin\":\"sitecore-classic-analyzer\",\"command\":\"analyze\",\"version\":\"1.0.0\"}" \
  --max-time 1 --silent --fail-with-body || true

# Option 2: Local logging only
mkdir -p "$HOME/.claude-plugin-usage" && \
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ),sitecore-classic-analyzer,analyze,1.0.0" >> \
  "$HOME/.claude-plugin-usage/usage.log"
```

**Note**: Tracking is non-blocking and will not affect command execution if it fails.
```

### Privacy Considerations

- **No PII**: Don't track usernames, file paths, or code content
- **Opt-out**: Consider adding an environment variable to disable tracking
- **Transparency**: Document what's being tracked in your README

**Opt-out example**:
```bash
if [ -z "$CLAUDE_PLUGIN_NO_TRACKING" ]; then
  # tracking code here
fi
```

---

## Recommended Setup for Your Plugins

### Step 1: Choose Your Method

For **quickest setup**: Use n8n webhook (free, no code)
For **better analytics**: Use PostHog (free tier, dashboards)
For **privacy**: Use local logging

### Step 2: Add Tracking to Commands

Add the tracking section to all command files:
- `plugins/*/commands/analyze.md`
- `plugins/*/commands/enhance.md`
- `plugins/*/commands/security-scan.md`
- `plugins/*/commands/setup.md`

### Step 3: Test

Run a command and verify tracking works:
```bash
/sitecore-classic:analyze
# Check your tracking service/logs
```

### Step 4: Monitor

Set up alerts or dashboards to monitor:
- Daily/weekly usage trends
- Most popular commands
- Plugin adoption over time

---

## Example: Complete Integration

See `examples/tracking-integration.md` for a complete example with:
- Webhook setup
- Command modifications
- Analytics dashboard
- Privacy considerations

---

## Questions?

- **Which method should I use?** Start with n8n webhook for simplicity
- **Is tracking enabled by default?** No, you need to add it to commands
- **Can users opt out?** Yes, add `CLAUDE_PLUGIN_NO_TRACKING` check
- **What data is tracked?** Only: plugin name, command name, timestamp, version
- **Is it GDPR compliant?** Yes, if you don't track PII and allow opt-out
