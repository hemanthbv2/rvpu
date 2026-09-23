/**
 * 🚀 RVPU MASTER LAUNCHER & HUB SERVER
 * Boots up all 7 Institute Command Center Dashboards (Ports 3001-3007)
 * and hosts the Central Launchpad Hub on Port 3000.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const INSTITUTES = [
  { id: 'north', name: 'RV PU College North', port: 3001, dir: 'rvpu-north-chatbot' },
  { id: 'south', name: 'RV PU College South', port: 3002, dir: 'rvpu-south-chatbot' },
  { id: 'ecity', name: 'RV PU College Electronic City', port: 3003, dir: 'rvpu-ecity-chatbot' },
  { id: 'harohalli', name: 'RV PU College Harohalli', port: 3004, dir: 'rvpu-harohalli-chatbot' },
  { id: 'ssmrv', name: 'SSMRV PU College', port: 3005, dir: 'ssmrvpu-chatbot' },
  { id: 'mysore', name: 'RV PU College Mysuru', port: 3006, dir: 'rvpu-mysore-chatbot' },
  { id: 'nmkrv', name: 'NMKRV PU College for Women', port: 3007, dir: 'nmkrvpu-chatbot' }
];

const HUB_PORT = process.env.PORT || 3000;
const processes = [];

console.log('==============================================================');
console.log('   🏛️  RV EDUCATIONAL INSTITUTIONS — MASTER LAUNCHER');
console.log('   Starting 7 Independent Dashboards & Central Hub');
console.log('==============================================================\n');

// 1. Launch all 7 institute dashboard servers
INSTITUTES.forEach(inst => {
  const serverPath = path.join(__dirname, inst.dir, 'dashboard', 'server.js');
  if (fs.existsSync(serverPath)) {
    const proc = spawn(process.execPath, [serverPath], {
      env: { ...process.env, PORT: inst.port },
      stdio: ['ignore', 'pipe', 'pipe']
    });

    proc.stdout.on('data', (d) => {
      // suppress verbose logs or log concisely
    });

    proc.stderr.on('data', (d) => {
      console.error(`[${inst.name} ERROR]:`, d.toString().trim());
    });

    proc.on('exit', (code) => {
      console.log(`[${inst.name}] Server exited with code ${code}`);
    });

    processes.push(proc);
    console.log(`  ✅ [Port ${inst.port}] ${inst.name} Dashboard Online -> http://localhost:${inst.port}`);
  } else {
    console.warn(`  ⚠️ Server file not found for ${inst.name} at ${serverPath}`);
  }
});

// 2. Central Hub HTTP Server
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const hubServer = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '/hub' || reqPath === '/index.html') {
    reqPath = '/hub.html';
  }

  // API endpoint for institutes list and status
  if (reqPath === '/api/institutes') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(INSTITUTES, null, 2));
  }

  // Serve static files from root or subfolders
  const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(__dirname, safePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

hubServer.listen(HUB_PORT, () => {
  console.log('\n==============================================================');
  console.log(`  🌟 CENTRAL LAUNCHPAD HUB IS LIVE AT:`);
  console.log(`  👉 http://localhost:${HUB_PORT}`);
  console.log('==============================================================');
  console.log('  Press Ctrl+C to stop all servers simultaneously.\n');
});

// Clean shutdown on SIGINT / SIGTERM
function cleanup() {
  console.log('\nShutting down all dashboard servers...');
  processes.forEach(p => {
    try { p.kill(); } catch (e) {}
  });
  hubServer.close(() => {
    console.log('All servers stopped.');
    process.exit(0);
  });
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
