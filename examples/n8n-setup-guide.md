# n8n.io Setup Guide for Plugin Usage Tracking

This guide walks you through setting up n8n.io to track usage of your Claude Code plugins. n8n is a free workflow automation tool that's perfect for collecting usage data.

## Prerequisites

- A free n8n.io account (cloud version)
- Basic understanding of webhooks
- 10-15 minutes

---

## Step 1: Create Your n8n Account

1. Go to [https://n8n.io](https://n8n.io)
2. Click **"Start Free"** or **"Sign Up"**
3. Choose **"Sign up with Email"** or use Google/GitHub
4. Verify your email if required
5. You'll be taken to your n8n dashboard

**Note**: The free cloud plan includes:
- Unlimited workflows
- 1,000 workflow executions per month
- Webhook support
- Google Sheets integration

---

## Step 2: Create a New Workflow

1. In your n8n dashboard, click **"+ Add workflow"** (top right)
2. You'll see a blank workflow canvas
3. Name your workflow: Click the workflow name at the top and rename it to **"Plugin Usage Tracker"**

---

## Step 3: Add Webhook Node

1. Click the **"+"** button in the canvas (or press `+`)
2. Search for **"Webhook"** in the node search
3. Click on **"Webhook"** to add it
4. The Webhook node will appear on your canvas

### Configure the Webhook Node

1. Click on the **Webhook** node to open its settings
2. Configure the following:

   **Settings Tab:**
   - **HTTP Method**: Select `POST`
   - **Path**: Enter `track` (this creates the endpoint `/track`)
   - **Response Mode**: Select `Respond When Last Node Finishes`
   - **Response Code**: `200`
   - **Response Data**: Select `All Input Items`

   **Authentication Tab:**
   - Leave as **None** (we'll keep it simple for now)
   - You can add authentication later if needed

3. Click **"Execute Node"** button (bottom right of the node settings)
   - This activates the webhook and generates a URL
   - **Copy the Webhook URL** - it will look like:
     ```
     https://your-workflow-name.n8n.io/webhook/track
     ```
   - **Save this URL** - you'll need it in Step 7

---

## Step 4: Add Data Storage Node

Now we'll add a node to store the usage data. We'll use Google Sheets (easiest) or you can use a database.

### Option A: Google Sheets (Recommended for Beginners)

1. Click the **"+"** button after the Webhook node
2. Search for **"Google Sheets"**
3. Select **"Google Sheets"** → **"Append"** (to add rows)

#### Connect Google Sheets:

1. Click **"Connect your Google account"** or **"Create new credential"**
2. Sign in with your Google account
3. Grant n8n permission to access Google Sheets
4. Click **"Save"**

#### Configure Google Sheets Node:

1. **Operation**: `Append`
2. **Spreadsheet ID**: 
   - Create a new Google Sheet: [https://sheets.google.com](https://sheets.google.com)
   - Name it "Plugin Usage Tracker"
   - Copy the Sheet ID from the URL:
     ```
     https://docs.google.com/spreadsheets/d/[THIS_IS_THE_ID]/edit
     ```
   - Paste the ID into the field
3. **Sheet Name**: `Sheet1` (or your sheet name)
4. **Columns**: 
   - Click **"Set Value for 'Columns'"**
   - Add these columns (one per line):
     ```
     timestamp
     plugin
     command
     version
     ```
   - Click **"Execute Node"** to test

#### Map Data to Columns:

1. In the **"Values to Send"** section, map the data:
   - **timestamp**: `{{ $json.timestamp }}`
   - **plugin**: `{{ $json.plugin }}`
   - **command**: `{{ $json.command }}`
   - **version**: `{{ $json.version }}`

2. Click **"Execute Node"** to test

### Option B: Database (Alternative)

If you prefer a database, you can use:
- **PostgreSQL** node (if you have a database)
- **MySQL** node
- **Airtable** node (free tier available)

---

## Step 5: Connect the Nodes

1. The Webhook node should automatically connect to the Google Sheets node
2. If not, drag from the output dot of the Webhook node to the input dot of the Google Sheets node
3. Your workflow should look like:
   ```
   [Webhook] → [Google Sheets]
   ```

---

## Step 6: Activate the Workflow

1. Click the **"Active"** toggle at the top right of the workflow (it should turn green)
2. This makes your webhook live and ready to receive data
3. **Important**: The webhook only works when the workflow is active

---

## Step 7: Test Your Webhook

1. Open a terminal or use a tool like Postman/curl
2. Test with this command:

```bash
curl -X POST "https://your-workflow-name.n8n.io/webhook/track" \
  -H "Content-Type: application/json" \
  -d '{
    "plugin": "test-plugin",
    "command": "test-command",
    "version": "1.0.0",
    "timestamp": "2024-01-15T10:30:00Z"
  }'
```

3. Check your Google Sheet - you should see a new row with the test data
4. Check the n8n workflow execution log (bottom panel) - you should see a successful execution

---

## Step 8: Update Your Command Files

Now that your webhook is working, update all your command files with the actual webhook URL:

1. Replace `https://daksmith.app.n8n.cloud/webhook/track` in all command files with your actual webhook URL
2. The URL format is: `https://your-workflow-name.n8n.io/webhook/track`

### Quick Find & Replace

You can use your editor's find & replace:
- **Find**: `https://daksmith.app.n8n.cloud/webhook/track`
- **Replace**: `https://your-actual-webhook-url.n8n.io/webhook/track`

Files to update:
- All `plugins/*/commands/*.md` files (12 files total)

---

## Step 9: View Your Usage Data

### In Google Sheets

1. Open your Google Sheet
2. You'll see columns: timestamp, plugin, command, version
3. Each command execution creates a new row
4. You can:
   - Sort by timestamp
   - Filter by plugin or command
   - Create charts/graphs
   - Export to CSV

### In n8n

1. Go to your workflow
2. Click on **"Executions"** tab (bottom panel)
3. See all webhook calls with:
   - Timestamp
   - Input data
   - Execution status
   - Execution time

---

## Step 10: Create Analytics (Optional)

### In Google Sheets

Create a summary sheet with formulas:

**Usage Summary:**
```
=COUNTIF(Sheet1!B:B, "sitecore-classic-analyzer")
=COUNTIF(Sheet1!B:B, "xm-cloud-analyzer")
=COUNTIF(Sheet1!B:B, "umbraco-analyzer")
```

**Command Breakdown:**
```
=COUNTIFS(Sheet1!B:B, "sitecore-classic-analyzer", Sheet1!C:C, "analyze")
```

**Daily Usage:**
```
=COUNTIFS(Sheet1!A:A, ">="&TODAY(), Sheet1!A:A, "<"&TODAY()+1)
```

### In n8n (Advanced)

You can add more nodes to:
- Aggregate data
- Send weekly reports via email
- Create dashboards
- Set up alerts for high usage

---

## Troubleshooting

### Webhook Not Receiving Data

1. **Check workflow is active**: Toggle should be green
2. **Check webhook URL**: Make sure it matches exactly
3. **Check n8n executions**: Look for errors in the Executions tab
4. **Test manually**: Use curl to test the webhook directly

### Google Sheets Not Updating

1. **Check credentials**: Re-authenticate Google Sheets connection
2. **Check Sheet ID**: Make sure it's correct
3. **Check column mapping**: Verify field names match
4. **Check permissions**: Ensure n8n has edit access to the sheet

### Rate Limits

- Free tier: 1,000 executions/month
- If you exceed this, upgrade to a paid plan or use local logging instead

---

## Security Considerations

### Add Authentication (Recommended for Production)

1. In Webhook node settings, go to **Authentication** tab
2. Select **"Header Auth"** or **"Query Auth"**
3. Add a secret token
4. Update your command files to include the token:
   ```bash
   curl -X POST "https://your-webhook.com/track" \
     -H "Authorization: Bearer YOUR_SECRET_TOKEN" \
     -H "Content-Type: application/json" \
     -d "{...}"
   ```

### IP Whitelisting (Advanced)

- n8n cloud doesn't support IP whitelisting
- Consider self-hosting n8n if you need this feature

---

## Next Steps

1. ✅ Test your webhook with a few commands
2. ✅ Monitor usage for a few days
3. ✅ Set up weekly reports (optional)
4. ✅ Share analytics with your team
5. ✅ Consider upgrading if you exceed free tier limits

---

## Alternative: Self-Hosted n8n

If you prefer to self-host:

1. Install n8n: `npm install -g n8n`
2. Run: `n8n start`
3. Access at: `http://localhost:5678`
4. Follow the same steps above

Benefits:
- No rate limits
- Full control
- Can add IP whitelisting
- Free (just server costs)

---

## Support

- **n8n Documentation**: [https://docs.n8n.io](https://docs.n8n.io)
- **n8n Community**: [https://community.n8n.io](https://community.n8n.io)
- **n8n Discord**: [https://discord.gg/n8n](https://discord.gg/n8n)

---

## Quick Reference

**Your Webhook URL Format:**
```
https://[workflow-name].n8n.io/webhook/track
```

**Test Command:**
```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"plugin":"test","command":"test","version":"1.0.0","timestamp":"2024-01-15T10:30:00Z"}'
```

**Expected Response:**
```json
{
  "success": true,
  "data": [...]
}
```

---

That's it! Your usage tracking is now set up. Every time someone runs a plugin command, it will be logged to your Google Sheet (or database) automatically.
