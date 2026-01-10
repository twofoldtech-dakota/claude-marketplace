#!/bin/bash
# Script to add usage tracking to all command files
# 
# Usage: ./add-tracking.sh [tracking-endpoint-url]
#
# Example: ./add-tracking.sh "https://your-webhook.com/track"

TRACKING_URL="${1:-https://your-tracking-endpoint.com/track}"
PLUGINS_DIR="plugins"

# Tracking section template
TRACKING_SECTION=$(cat <<'EOF'
## Usage Tracking

When this command is invoked, track usage by making a lightweight HTTP request (non-blocking):

```bash
# Track command execution (optional - can be disabled with CLAUDE_PLUGIN_NO_TRACKING=1)
if [ -z "$CLAUDE_PLUGIN_NO_TRACKING" ]; then
  curl -X POST "TRACKING_URL_PLACEHOLDER" \
    -H "Content-Type: application/json" \
    -d "{\"plugin\":\"PLUGIN_NAME_PLACEHOLDER\",\"command\":\"COMMAND_NAME_PLACEHOLDER\",\"version\":\"1.0.0\",\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" \
    --max-time 1 \
    --silent \
    --fail-with-body > /dev/null 2>&1 || true
fi
```

**Note**: Tracking is optional and can be disabled by setting `CLAUDE_PLUGIN_NO_TRACKING=1`. No personal information or code content is tracked. See [USAGE_TRACKING.md](../../../../USAGE_TRACKING.md) for setup instructions.

---
EOF
)

echo "Adding usage tracking to command files..."
echo "Tracking URL: $TRACKING_URL"
echo ""

# Find all command files
find "$PLUGINS_DIR" -name "*.md" -path "*/commands/*" | while read -r cmd_file; do
  # Extract plugin name and command name from path
  # e.g., plugins/sitecore-classic-analyzer/commands/analyze.md
  plugin_name=$(echo "$cmd_file" | sed -n 's|plugins/\([^/]*\)/.*|\1|p')
  command_name=$(basename "$cmd_file" .md)
  
  echo "Processing: $cmd_file (plugin: $plugin_name, command: $command_name)"
  
  # Check if tracking section already exists
  if grep -q "## Usage Tracking" "$cmd_file"; then
    echo "  ⚠️  Tracking section already exists, skipping..."
    continue
  fi
  
  # Create temp file with tracking section
  temp_section=$(echo "$TRACKING_SECTION" | \
    sed "s|TRACKING_URL_PLACEHOLDER|$TRACKING_URL|g" | \
    sed "s|PLUGIN_NAME_PLACEHOLDER|$plugin_name|g" | \
    sed "s|COMMAND_NAME_PLACEHOLDER|$command_name|g")
  
  # Insert tracking section after frontmatter
  # Find the line after the frontmatter (---)
  if grep -q "^---$" "$cmd_file"; then
    # Find the second --- line (end of frontmatter)
    end_frontmatter=$(grep -n "^---$" "$cmd_file" | sed -n '2p' | cut -d: -f1)
    
    if [ -n "$end_frontmatter" ]; then
      # Insert after frontmatter
      {
        head -n "$end_frontmatter" "$cmd_file"
        echo ""
        echo "$temp_section"
        tail -n +$((end_frontmatter + 1)) "$cmd_file"
      } > "${cmd_file}.tmp" && mv "${cmd_file}.tmp" "$cmd_file"
      echo "  ✅ Added tracking section"
    else
      echo "  ⚠️  Could not find end of frontmatter, skipping..."
    fi
  else
    echo "  ⚠️  No frontmatter found, skipping..."
  fi
done

echo ""
echo "Done! Review the changes and update the tracking URL if needed."
echo ""
echo "To test tracking:"
echo "  1. Set up your tracking endpoint"
echo "  2. Run a command: /sitecore-classic:analyze"
echo "  3. Check your tracking service for the event"
echo ""
echo "To disable tracking:"
echo "  export CLAUDE_PLUGIN_NO_TRACKING=1"
