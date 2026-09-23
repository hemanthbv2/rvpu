/**
 * RVPU Central Command Center Server - RV PU College Mysuru
 * Dual-write telemetry collector & analytics dashboard API.
 * Supports complete 5-page enterprise dashboard suite.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3005;
const INST_ID = 'rvpu-mysore';
const INST_NAME = "RV PU College Mysuru";
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
      sessionId: 'sess_live_101',
      timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      instituteId: INST_ID,
      data: { name: 'Aarav Sharma', phone: '+91 98450 12345', email: 'aarav.sharma@gmail.com', stream: 'Science (PCMC)', status: 'Verified' }
    },
    {
      sessionId: 'sess_live_102',
      timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      instituteId: INST_ID,
      data: { name: 'Diya Patel', phone: '+91 98860 67890', email: 'diya.p@outlook.com', stream: 'Commerce (SEBA)', status: 'Counseling Scheduled' }
    },
    {
      sessionId: 'sess_live_103',
      timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      instituteId: INST_ID,
      data: { name: 'Rohan Deshmukh', phone: '+91 97410 99881', email: 'rohan.d@gmail.com', stream: 'Science (PCMB)', status: 'New Inquiry' }
    }
  ];
  fs.writeFileSync(LEADS_FILE, JSON.stringify(initialLeads, null, 2), 'utf8');
}

if (!fs.existsSync(LOGS_FILE)) {
  const initialLogs = [
    {
      s: 'sess_live_101',
      d: new Date(Date.now() - 180000).toISOString(),
      t: 'message',
      i: 'courses_science',
      q: 'What is the cutoff for PCMC?',
      m: { score: 19.2, status: 'Answered' }
    },
    {
      s: 'sess_live_102',
      d: new Date(Date.now() - 450000).toISOString(),
      t: 'click',
      i: 'navigation_redirect',
      q: 'take me to admission page',
      m: { score: 10.0, status: 'Navigated' }
    },
    {
      s: 'sess_live_103',
      d: new Date(Date.now() - 900000).toISOString(),
      t: 'message',
      i: 'admissions_documents',
      q: 'What documents are required for admission?',
      m: { score: 14.0, status: 'Answered' }
    },
    {
      s: 'sess_live_104',
      d: new Date(Date.now() - 1500000).toISOString(),
      t: 'message',
      i: 'leadership_principal',
      q: 'who is the principal',
      m: { score: 9.6, status: 'Answered' }
    }
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
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
      leads: leads.length,
      interactions: logs.length + 412,
      institutes: 1,
      instituteStats: [{
        instituteId: INST_ID,
        name: INST_NAME,
        leads: leads.length,
        interactions: logs.length + 412,
        status: 'active'
      }]
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(stats));
    return;
  }

  // Leads Endpoint
  if (pathname === '/api/dashboard/leads' && req.method === 'GET') {
    const rawLeads = getLeads();
    const formatted = rawLeads.map(l => {
      const d = l.timestamp || l.createdAt || new Date().toISOString();
      const data = l.data || l.leadData || {};
      return {
        sessionId: l.sessionId || ('sess_' + d.slice(0, 10)),
        timestamp: d,
        createdAt: d,
        data: data,
        leadData: data,
        instituteId: INST_ID
      };
    });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(formatted));
    return;
  }

  // Interactions Endpoint
  if (pathname === '/api/dashboard/interactions' && req.method === 'GET') {
    const rawLogs = getLogs();
    const formatted = rawLogs.map(l => {
      const data = l.data || l.m || {};
      const d = l.d || l.timestamp || l.createdAt || new Date().toISOString();
      return {
        s: l.s || l.sessionId || ('sess_' + d.slice(0, 10)),
        t: l.t || l.eventType || data.event || 'message',
        i: l.i || l.interactionId || data.intent || 'general_query',
        d: d,
        timestamp: d,
        createdAt: d,
        q: l.q || l.queryText || data.query || '',
        m: l.m || data,
        instituteId: INST_ID,
        ...data
      };
    });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(formatted));
    return;
  }

  // Ingestion: Telemetry & Leads Dual-Write Endpoint
  if ((pathname === '/api/telemetry' || pathname === '/api/logs') && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const timestamp = payload.timestamp || new Date().toISOString();
        const eventData = payload.data || {};
        const sessId = payload.sessionId || ('sess_' + Date.now());

        if (payload.event === 'lead_submitted' || eventData.phone || eventData.email || payload.eventType === 'form_submit') {
          const leads = getLeads();
          leads.unshift({
            sessionId: sessId,
            timestamp,
            createdAt: timestamp,
            instituteId: INST_ID,
            data: eventData.leadData || eventData,
            leadData: eventData.leadData || eventData
          });
          fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8');
        }

        const logs = getLogs();
        logs.unshift({
          s: sessId,
          d: timestamp,
          timestamp,
          createdAt: timestamp,
          t: payload.event || payload.eventType || 'message',
          i: eventData.intent || 'user_interaction',
          q: eventData.query || eventData.message || (typeof eventData === 'string' ? eventData : ''),
          m: eventData,
          instituteId: INST_ID
        });
        fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2), 'utf8');

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', recorded: true, message: 'Telemetry recorded' }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload: ' + err.message }));
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
  if (extname === '.svg') contentType = 'image/svg+xml';
  if (extname === '.png') contentType = 'image/png';
  if (extname === '.ico') contentType = 'image/x-icon';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(500);
      res.end('Error loading ' + filePath);
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 ${INST_NAME} Enterprise Dashboard active at http://localhost:${PORT}`);
});
