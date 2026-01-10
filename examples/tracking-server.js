#!/usr/bin/env node
/**
 * Simple Usage Tracking Server for Claude Code Plugins
 * 
 * Tracks plugin command usage and provides basic analytics.
 * 
 * Usage:
 *   node tracking-server.js [port]
 * 
 * Endpoints:
 *   POST /track - Track a command execution
 *   GET /stats - Get usage statistics
 *   GET /health - Health check
 * 
 * Environment Variables:
 *   PORT - Server port (default: 3000)
 *   LOG_FILE - Path to log file (default: ./usage.log)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || process.argv[2] || 3000;
const LOG_FILE = process.env.LOG_FILE || path.join(__dirname, 'usage.log');

// Ensure log file exists
if (!fs.existsSync(LOG_FILE)) {
  fs.writeFileSync(LOG_FILE, '');
}

function logUsage(data) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    plugin: data.plugin || 'unknown',
    command: data.command || 'unknown',
    version: data.version || '1.0.0',
    ...(data.agent && { agent: data.agent })
  };
  
  fs.appendFileSync(LOG_FILE, JSON.stringify(logEntry) + '\n');
  return logEntry;
}

function getStats() {
  try {
    const logs = fs.readFileSync(LOG_FILE, 'utf8')
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        try {
          return JSON.parse(line);
        } catch (e) {
          return null;
        }
      })
      .filter(log => log !== null);
    
    const stats = {
      total: logs.length,
      byPlugin: {},
      byCommand: {},
      byAgent: {},
      recent: logs.slice(-20).reverse(),
      firstSeen: logs.length > 0 ? logs[0].timestamp : null,
      lastSeen: logs.length > 0 ? logs[logs.length - 1].timestamp : null
    };
    
    logs.forEach(log => {
      stats.byPlugin[log.plugin] = (stats.byPlugin[log.plugin] || 0) + 1;
      stats.byCommand[log.command] = (stats.byCommand[log.command] || 0) + 1;
      if (log.agent) {
        stats.byAgent[log.agent] = (stats.byAgent[log.agent] || 0) + 1;
      }
    });
    
    // Get daily stats
    const today = new Date().toISOString().split('T')[0];
    const todayLogs = logs.filter(log => log.timestamp.startsWith(today));
    stats.today = todayLogs.length;
    
    // Get weekly stats
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekLogs = logs.filter(log => new Date(log.timestamp) >= weekAgo);
    stats.last7Days = weekLogs.length;
    
    return stats;
  } catch (err) {
    return {
      total: 0,
      error: err.message,
      byPlugin: {},
      byCommand: {},
      recent: []
    };
  }
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (req.method === 'POST' && pathname === '/track') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const logEntry = logUsage(data);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true, 
          logged: logEntry 
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          error: 'Invalid JSON',
          message: err.message 
        }));
      }
    });
  } else if (req.method === 'GET' && pathname === '/stats') {
    const stats = getStats();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(stats, null, 2));
  } else if (req.method === 'GET' && pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'ok',
      timestamp: new Date().toISOString(),
      logFile: LOG_FILE
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Tracking server running on http://localhost:${PORT}`);
  console.log(`📝 Log file: ${LOG_FILE}`);
  console.log(`\nEndpoints:`);
  console.log(`  POST http://localhost:${PORT}/track - Track usage`);
  console.log(`  GET  http://localhost:${PORT}/stats - Get statistics`);
  console.log(`  GET  http://localhost:${PORT}/health - Health check`);
  console.log(`\nPress Ctrl+C to stop\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
