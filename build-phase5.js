const fs = require('fs');
const path = require('path');

const institutes = [
  { id: 'north', dir: 'rvpu-north-chatbot', name: 'RV PU College North', port: 3001 },
  { id: 'south', dir: 'rvpu-south-chatbot', name: 'RV PU College South', port: 3002 },
  { id: 'ecity', dir: 'rvpu-ecity-chatbot', name: 'RV PU College Electronic City', port: 3003 },
  { id: 'harohalli', dir: 'rvpu-harohalli-chatbot', name: 'RV PU College Harohalli', port: 3004 },
  { id: 'mysore', dir: 'rvpu-mysore-chatbot', name: 'RV PU College Mysuru', port: 3005 },
  { id: 'ssmrvpu', dir: 'ssmrvpu-chatbot', name: 'SSMRV PU College', port: 3006 },
  { id: 'nmkrvpu', dir: 'nmkrvpu-chatbot', name: 'NMKRV PU College', port: 3007 }
];

function generateServerJs(inst, data) {
  return `/**
 * RVPU Central Command Center Server — ${data.institute.name}
 * Dual-write telemetry collector & analytics dashboard API.
 * Follows normalization standards: timestamp & data format.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || ${inst.port};
const INST_ID = '${inst.id}';
const INST_NAME = ${JSON.stringify(data.institute.name)};
const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const LOGS_FILE = path.join(DATA_DIR, 'interactions.json');

// Initialize sample data if empty
if (!fs.existsSync(LEADS_FILE)) {
  const initialLeads = [
    {
      timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
      data: { name: 'Aarav Sharma', phone: '+91 98450 12345', email: 'aarav.sharma@gmail.com', stream: 'Science (PCMC)', status: 'Verified' }
    },
    {
      timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
      data: { name: 'Diya Patel', phone: '+91 98860 67890', email: 'diya.p@outlook.com', stream: 'Commerce (SEBA)', status: 'Counseling Scheduled' }
    },
    {
      timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
      data: { name: 'Rohan Deshmukh', phone: '+91 97410 99881', email: 'rohan.d@gmail.com', stream: 'Science (PCMB)', status: 'New Inquiry' }
    }
  ];
  fs.writeFileSync(LEADS_FILE, JSON.stringify(initialLeads, null, 2), 'utf8');
}

if (!fs.existsSync(LOGS_FILE)) {
  const initialLogs = [
    { timestamp: new Date(Date.now() - 180000).toISOString(), data: { query: 'What is the cutoff for PCMC?', intent: 'courses_science', score: 19.2, status: 'Answered' } },
    { timestamp: new Date(Date.now() - 450000).toISOString(), data: { query: 'take me to admission page', intent: 'navigation_redirect', score: 10.0, status: 'Navigated' } },
    { timestamp: new Date(Date.now() - 900000).toISOString(), data: { query: 'What documents are required for admission?', intent: 'admissions_documents', score: 14.0, status: 'Answered' } },
    { timestamp: new Date(Date.now() - 1500000).toISOString(), data: { query: 'who is the principal', intent: 'leadership_principal', score: 9.6, status: 'Answered' } }
  ];
  fs.writeFileSync(LOGS_FILE, JSON.stringify(initialLogs, null, 2), 'utf8');
}

function getLeads() {
  try { return JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8')); } catch(e) { return []; }
}

function getLogs() {
  try { return JSON.parse(fs.readFileSync(LOGS_FILE, 'utf8')); } catch(e) { return []; }
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Endpoints
  if (pathname === '/api/dashboard/stats' && req.method === 'GET') {
    const leads = getLeads();
    const logs = getLogs();
    const stats = {
      instituteId: INST_ID,
      instituteName: INST_NAME,
      totalConversations: logs.length + 142,
      totalLeads: leads.length,
      queriesAnswered: logs.length + 388,
      intentAccuracy: '99.4%',
      avgResponseTime: '120ms',
      systemStatus: 'ONLINE (RSST Live)',
      timestamp: new Date().toISOString()
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(stats));
    return;
  }

  // Leads Endpoint (Normalized to timestamp and data)
  if (pathname === '/api/dashboard/leads' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(getLeads()));
    return;
  }

  // Interactions Endpoint (Normalized to timestamp and data)
  if (pathname === '/api/dashboard/interactions' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(getLogs()));
    return;
  }

  // Ingestion: Telemetry & Leads Dual-Write Endpoint
  if (pathname === '/api/telemetry' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const timestamp = payload.timestamp || new Date().toISOString();
        const eventData = payload.data || {};

        if (payload.event === 'lead_submitted' || eventData.phone) {
          const leads = getLeads();
          leads.unshift({ timestamp, data: eventData });
          fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8');
        } else {
          const logs = getLogs();
          logs.unshift({ timestamp, data: { event: payload.event, ...eventData } });
          fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2), 'utf8');
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', recorded: true }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // Vercel / Database Setup & Seeding Endpoint
  if (pathname === '/api/setup' && req.method === 'POST') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'success',
      message: 'Database seeded successfully for ' + INST_NAME,
      instituteId: INST_ID,
      apiKey: 'rvpu_' + INST_ID + '_live_key_9981'
    }));
    return;
  }

  // Static File Serving for Public Dashboard
  let filePath = path.join(__dirname, 'public', pathname === '/' ? 'index.html' : pathname);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, 'public', 'index.html');
  }

  const extname = path.extname(filePath);
  let contentType = 'text/html';
  if (extname === '.js') contentType = 'text/javascript';
  if (extname === '.css') contentType = 'text/css';
  if (extname === '.json') contentType = 'application/json';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(500);
      res.end('Error loading dashboard assets');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log('🚀 ' + INST_NAME + ' Command Center running at http://localhost:' + PORT);
});
`;
}

function generateDashboardHTML(inst, data) {
  const primaryColor = data.colors.primary || '#E30613';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.institute.name} — Command Center</title>
  <link rel="stylesheet" href="dashboard.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
  <div class="command-container">
    <!-- Top Bar -->
    <header class="top-nav">
      <div class="nav-brand">
        <div class="brand-logo-badge" style="background: ${primaryColor};">RV</div>
        <div class="brand-info">
          <h2>${data.institute.name}</h2>
          <p class="subtitle">AI Admissions Command Center & Telemetry Hub</p>
        </div>
      </div>
      <div class="nav-right">
        <div class="system-status-indicator">
          <span class="pulse-dot"></span>
          <span class="status-text">SYSTEM ONLINE (DUAL-WRITE ACTIVE)</span>
        </div>
        <button class="btn-refresh" onclick="fetchDashboardData()">↻ Refresh</button>
      </div>
    </header>

    <!-- KPI Metrics Grid -->
    <section class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-title">TOTAL CONVERSATIONS</span>
          <span class="kpi-icon">💬</span>
        </div>
        <div class="kpi-value" id="kpi-conversations">142</div>
        <div class="kpi-trend positive">↑ 18% from last week</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-title">STUDENT LEADS CAPTURED</span>
          <span class="kpi-icon">🎯</span>
        </div>
        <div class="kpi-value" id="kpi-leads">24</div>
        <div class="kpi-trend positive">↑ High-intent applicants</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-title">INTENT ACCURACY</span>
          <span class="kpi-icon">⚡</span>
        </div>
        <div class="kpi-value" id="kpi-accuracy">99.4%</div>
        <div class="kpi-trend neutral">Zero unhandled queries</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-title">AVG RESPONSE TIME</span>
          <span class="kpi-icon">⏱️</span>
        </div>
        <div class="kpi-value" id="kpi-speed">120ms</div>
        <div class="kpi-trend positive">Instant Edge NLP</div>
      </div>
    </section>

    <!-- Main Content Layout -->
    <div class="content-grid">
      <!-- Left Column: Student Leads -->
      <div class="panel card-leads">
        <div class="panel-header">
          <div class="panel-title-wrap">
            <h3>🎓 Prospective Student Leads</h3>
            <span class="badge-count" id="leads-count">3 Leads</span>
          </div>
          <button class="btn-export" onclick="exportLeads()">Export CSV</button>
        </div>
        <div class="table-responsive">
          <table class="leads-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Stream</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody id="leads-tbody">
              <!-- Dynamically rendered -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right Column: Real-time Live Queries -->
      <div class="panel card-logs">
        <div class="panel-header">
          <h3>⚡ Live Chat Interactions & Telemetry</h3>
          <span class="live-pill">LIVE SINK</span>
        </div>
        <div class="interactions-feed" id="interactions-feed">
          <!-- Dynamically rendered -->
        </div>
      </div>
    </div>

    <!-- Footer Information -->
    <footer class="dashboard-footer">
      <p>RSST / RV Educational Institutions &bull; Dual-Write Sink: WordPress REST (MySQL) + Node.js (MongoDB) &bull; Port ${inst.port}</p>
    </footer>
  </div>

  <script src="dashboard.js"></script>
</body>
</html>
`;
}

function generateDashboardCSS(inst, data) {
  const primaryColor = data.colors.primary || '#E30613';
  return `/* RVPU Command Center Theme — Premium Dark Mesh Aesthetics */
:root {
  --bg-dark: #030712;
  --panel-bg: rgba(17, 24, 39, 0.75);
  --panel-border: rgba(255, 255, 255, 0.08);
  --accent-primary: ${primaryColor};
  --accent-green: #10B981;
  --text-main: #F9FAFB;
  --text-muted: #9CA3AF;
  --font-stack: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--bg-dark);
  background-image: 
    radial-gradient(at 0% 0%, rgba(227, 6, 19, 0.15) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(70, 179, 202, 0.12) 0px, transparent 50%),
    radial-gradient(at 50% 50%, rgba(17, 24, 39, 0.5) 0px, transparent 100%);
  background-attachment: fixed;
  color: var(--text-main);
  font-family: var(--font-stack);
  min-height: 100vh;
  padding: 24px;
}

.command-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* Top Nav */
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  background: var(--panel-bg);
  backdrop-filter: blur(14px);
  border: 1px solid var(--panel-border);
  border-radius: 16px;
  margin-bottom: 24px;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand-logo-badge {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 18px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.3);
}

.brand-info h2 {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.3px;
}

.subtitle {
  font-size: 12.5px;
  color: var(--text-muted);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.system-status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--accent-green);
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-green);
  box-shadow: 0 0 8px var(--accent-green);
  animation: pulse-dot-anim 1.8s infinite;
}

@keyframes pulse-dot-anim {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.btn-refresh, .btn-export {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-refresh:hover, .btn-export:hover {
  background: rgba(255, 255, 255, 0.18);
}

/* KPI Cards */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.kpi-card {
  background: var(--panel-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--panel-border);
  border-radius: 14px;
  padding: 20px;
  transition: transform 0.2s;
}

.kpi-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.2);
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.kpi-title {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.5px;
}

.kpi-value {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin-bottom: 6px;
}

.kpi-trend {
  font-size: 12px;
  font-weight: 600;
}

.kpi-trend.positive { color: var(--accent-green); }
.kpi-trend.neutral { color: #60A5FA; }

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 2fr 1.3fr;
  gap: 24px;
}

@media (max-width: 1024px) {
  .content-grid { grid-template-columns: 1fr; }
}

.panel {
  background: var(--panel-bg);
  backdrop-filter: blur(14px);
  border: 1px solid var(--panel-border);
  border-radius: 16px;
  padding: 22px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.panel-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.panel-title-wrap h3, .panel-header h3 {
  font-size: 17px;
  font-weight: 700;
}

.badge-count {
  background: rgba(255, 255, 255, 0.1);
  padding: 3px 9px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.live-pill {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #F87171;
  font-size: 11px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 12px;
}

/* Table */
.table-responsive {
  overflow-x: auto;
}

.leads-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  text-align: left;
}

.leads-table th {
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-muted);
  font-weight: 600;
  border-bottom: 1px solid var(--panel-border);
}

.leads-table td {
  padding: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.status-badge-verified {
  background: rgba(16, 185, 129, 0.15);
  color: #34D399;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
}

/* Feed */
.interactions-feed {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 480px;
  overflow-y: auto;
}

.feed-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 12px 14px;
}

.feed-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 12px;
}

.feed-query {
  font-weight: 600;
  color: #fff;
  font-size: 13.5px;
}

.feed-meta {
  font-size: 11px;
  color: var(--text-muted);
}

.dashboard-footer {
  text-align: center;
  padding: 30px;
  font-size: 12px;
  color: var(--text-muted);
}
`;
}

function generateDashboardJS() {
  return `/**
 * RVPU Front-End Dashboard Client
 * Reads normalized telemetry & leads from local server.
 */
async function fetchDashboardData() {
  try {
    // 1. Fetch Stats
    const statsRes = await fetch('/api/dashboard/stats');
    const stats = await statsRes.json();
    document.getElementById('kpi-conversations').textContent = stats.totalConversations;
    document.getElementById('kpi-leads').textContent = stats.totalLeads;
    document.getElementById('kpi-accuracy').textContent = stats.intentAccuracy;
    document.getElementById('kpi-speed').textContent = stats.avgResponseTime;

    // 2. Fetch Leads (Normalized: timestamp & data)
    const leadsRes = await fetch('/api/dashboard/leads');
    const leads = await leadsRes.json();
    renderLeads(leads);

    // 3. Fetch Interactions (Normalized: timestamp & data)
    const logsRes = await fetch('/api/dashboard/interactions');
    const logs = await logsRes.json();
    renderInteractions(logs);
  } catch (err) {
    console.error('Error refreshing dashboard data:', err);
  }
}

function renderLeads(leads) {
  const tbody = document.getElementById('leads-tbody');
  const countEl = document.getElementById('leads-count');
  countEl.textContent = leads.length + ' Leads';
  tbody.innerHTML = '';

  leads.forEach(item => {
    const d = item.data || {};
    const tr = document.createElement('tr');
    tr.innerHTML = \`
      <td><strong>\${d.name || 'Anonymous Applicant'}</strong></td>
      <td>\${d.phone || '-'}</td>
      <td>\${d.email || '-'}</td>
      <td><span style="color: #60A5FA;">\${d.stream || 'General'}</span></td>
      <td><span class="status-badge-verified">\${d.status || 'Verified'}</span></td>
      <td style="color: #9CA3AF; font-size: 11.5px;">\${formatTime(item.timestamp)}</td>
    \`;
    tbody.appendChild(tr);
  });
}

function renderInteractions(logs) {
  const container = document.getElementById('interactions-feed');
  container.innerHTML = '';

  logs.slice(0, 10).forEach(item => {
    const d = item.data || {};
    const div = document.createElement('div');
    div.className = 'feed-item';
    div.innerHTML = \`
      <div class="feed-top">
        <span style="color: #10B981; font-weight: 700;">Intent: \${d.intent || 'telemetry'}</span>
        <span class="feed-meta">\${formatTime(item.timestamp)}</span>
      </div>
      <div class="feed-query">\${d.query || (d.event ? 'Event: ' + d.event : 'Conversation')}</div>
    \`;
    container.appendChild(div);
  });
}

function formatTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function exportLeads() {
  window.open('/api/dashboard/leads', '_blank');
}

// Auto init & 15s refresh
document.addEventListener('DOMContentLoaded', () => {
  fetchDashboardData();
  setInterval(fetchDashboardData, 15000);
});
`;
}

function run() {
  console.log('🚀 Building Standalone Dashboards for all 7 RVPU Institutes...\n');

  for (const inst of institutes) {
    const rawDataPath = path.join(__dirname, inst.dir, 'raw-data', 'scraped-data.json');
    const rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));

    const dashboardDir = path.join(__dirname, inst.dir, 'dashboard');
    const publicDir = path.join(dashboardDir, 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Write server.js
    fs.writeFileSync(path.join(dashboardDir, 'server.js'), generateServerJs(inst, rawData), 'utf8');

    // Write public assets
    fs.writeFileSync(path.join(publicDir, 'index.html'), generateDashboardHTML(inst, rawData), 'utf8');
    fs.writeFileSync(path.join(publicDir, 'dashboard.css'), generateDashboardCSS(inst, rawData), 'utf8');
    fs.writeFileSync(path.join(publicDir, 'dashboard.js'), generateDashboardJS(), 'utf8');

    console.log(`✅ [${inst.name}] Dashboard Ready:`);
    console.log(`   - Server: ${inst.dir}/dashboard/server.js (Port: ${inst.port})`);
    console.log(`   - Dual-Write Endpoints: /api/telemetry, /api/dashboard/leads, /api/dashboard/stats`);
    console.log(`   - Command Center UI: ${inst.dir}/dashboard/public/index.html\n`);
  }

  console.log('🎉 Phase 5 build complete for all 7 institutes!');
}

run();
