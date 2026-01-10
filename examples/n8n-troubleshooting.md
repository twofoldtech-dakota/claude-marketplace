# n8n Workflow Troubleshooting Guide

## Common Error: "Error in workflow"

If you're getting `{"message":"Error in workflow"}`, follow these steps:

### Step 1: Check Execution Logs

1. In your n8n workflow, look at the **bottom panel** (Executions tab)
2. Click on the **most recent execution** (should show an error icon)
3. Expand the execution to see which node failed
4. Look for the error message - it will tell you exactly what went wrong

### Step 2: Common Issues & Fixes

#### Issue 1: Google Sheets Node Not Configured

**Symptoms:**
- Error mentions "Google Sheets" or "authentication"
- Node shows red error icon

**Fix:**
1. Click on the Google Sheets node
2. Make sure you've connected your Google account (click "Connect your Google account")
3. Verify the Spreadsheet ID is correct
4. Check that the Sheet name matches (usually "Sheet1")

#### Issue 2: Column Mapping Wrong

**Symptoms:**
- Error mentions "column" or "field"
- Data not mapping correctly

**Fix:**
1. In Google Sheets node, go to "Values to Send"
2. Make sure you're using the correct syntax:
   - `{{ $json.timestamp }}` (not `$json.timestamp` or `timestamp`)
   - `{{ $json.plugin }}`
   - `{{ $json.command }}`
   - `{{ $json.version }}`
3. The columns in Google Sheets should match exactly:
   - Column A: timestamp
   - Column B: plugin
   - Column C: command
   - Column D: version

#### Issue 3: Google Sheet Doesn't Exist or Wrong Permissions

**Symptoms:**
- Error mentions "not found" or "permission denied"

**Fix:**
1. Create a new Google Sheet: [https://sheets.google.com](https://sheets.google.com)
2. Name it "Plugin Usage Tracker"
3. Make sure it's accessible (not private/restricted)
4. Copy the Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[THIS_IS_THE_ID]/edit
   ```
5. Update the Spreadsheet ID in n8n

#### Issue 4: Workflow Not Connected Properly

**Symptoms:**
- Webhook executes but nothing happens
- No data reaches Google Sheets

**Fix:**
1. Make sure the Webhook node connects to Google Sheets node
2. There should be a line connecting them
3. If not, drag from Webhook output to Google Sheets input

### Step 3: Test Each Node Individually

#### Test Webhook Node:

1. Click on Webhook node
2. Click "Execute Node"
3. In the test data, enter:
   ```json
   {
     "plugin": "test-plugin",
     "command": "test-command",
     "version": "1.0.0",
     "timestamp": "2024-01-15T10:30:00Z"
   }
   ```
4. Click "Execute Node"
5. Check output - should show your JSON data

#### Test Google Sheets Node:

1. Click on Google Sheets node
2. Make sure it's connected to Webhook node
3. Click "Execute Node"
4. Check output - should show success message
5. Check your Google Sheet - should have a new row

### Step 4: Simplified Test Workflow

If the Google Sheets integration is causing issues, try this simpler version first:

#### Option A: Use "Respond to Webhook" Node

1. Delete the Google Sheets node
2. Add a **"Respond to Webhook"** node after Webhook
3. Configure it to return:
   ```json
   {
     "success": true,
     "received": {{ $json }}
   }
   ```
4. Test - should return your data
5. Once this works, add Google Sheets back

#### Option B: Use "Set" Node to Log Data

1. Add a **"Set"** node after Webhook
2. Map all fields:
   - `timestamp` = `{{ $json.timestamp }}`
   - `plugin` = `{{ $json.plugin }}`
   - `command` = `{{ $json.command }}`
   - `version` = `{{ $json.version }}`
3. Add **"Respond to Webhook"** node
4. Test - this helps verify data flow

### Step 5: Check n8n Execution Details

In the Executions tab, look for:

1. **Which node failed** (red icon)
2. **Error message** (expand the node)
3. **Input data** (what was received)
4. **Output data** (what was sent)

Common error messages:
- `"Spreadsheet not found"` → Wrong Sheet ID
- `"Permission denied"` → Google account not connected properly
- `"Column not found"` → Wrong column mapping
- `"Invalid JSON"` → Data format issue

### Step 6: Alternative - Use Airtable Instead

If Google Sheets keeps causing issues, try Airtable (easier setup):

1. Create free Airtable account: [https://airtable.com](https://airtable.com)
2. Create a base with columns: timestamp, plugin, command, version
3. In n8n, add **"Airtable"** node instead of Google Sheets
4. Configure with your Airtable API key and base ID
5. Much simpler authentication!

### Step 7: Debug Mode

Enable debug mode in n8n:

1. In workflow settings, enable "Save Execution Data"
2. Run test again
3. Check execution - you'll see full data at each step
4. This helps identify where data is getting lost

### Quick Fix Checklist

- [ ] Workflow is **Active** (green toggle)
- [ ] Webhook node is configured (POST, path: `track`)
- [ ] Google account is connected in Google Sheets node
- [ ] Spreadsheet ID is correct
- [ ] Sheet name matches (usually "Sheet1")
- [ ] Column mapping uses `{{ $json.field }}` syntax
- [ ] Nodes are connected (line between them)
- [ ] Google Sheet exists and is accessible

### Still Having Issues?

1. **Check n8n Community**: [https://community.n8n.io](https://community.n8n.io)
2. **n8n Discord**: [https://discord.gg/n8n](https://discord.gg/n8n)
3. **Try the simplified version** (Respond to Webhook only) first
4. **Use Airtable** as an alternative to Google Sheets

---

## Working Example Configuration

Here's what a working configuration looks like:

### Webhook Node:
- **HTTP Method**: POST
- **Path**: track
- **Response Mode**: Respond When Last Node Finishes

### Google Sheets Node:
- **Operation**: Append
- **Spreadsheet ID**: `1abc123def456...` (your actual ID)
- **Sheet Name**: `Sheet1`
- **Values to Send**:
  ```
  timestamp: {{ $json.timestamp }}
  plugin: {{ $json.plugin }}
  command: {{ $json.command }}
  version: {{ $json.version }}
  ```

### Expected Response:
When working correctly, your curl command should return:
```json
{
  "success": true,
  "data": [...]
}
```

Or just a simple success message if you're using Respond to Webhook.
