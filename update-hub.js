const fs = require('fs');
const path = require('path');

const HUB_FILE = 'D:\\hemanth bv\\RVPU\\hub.html';
let content = fs.readFileSync(HUB_FILE, 'utf8');

// Add styling for the 5 dashboard mini-tabs
const miniTabStyles = `
    /* Enterprise 5-Page Dashboard Mini-Tabs */
    .dash-pages-bar {
      display: flex;
      gap: 0.35rem;
      background: rgba(0, 0, 0, 0.25);
      padding: 0.35rem;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.06);
      margin-top: 0.5rem;
      flex-wrap: wrap;
    }
    .dash-page-link {
      flex: 1;
      min-width: 52px;
      text-align: center;
      font-size: 0.72rem;
      font-weight: 600;
      color: #94a3b8;
      text-decoration: none;
      padding: 0.25rem 0.35rem;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid transparent;
      transition: all 0.2s;
    }
    .dash-page-link:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.15);
      transform: translateY(-1px);
    }
    .master-banner {
      max-width: 1200px;
      margin: 0 auto 2.5rem;
      padding: 0 1.5rem;
    }
    .master-banner-inner {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(227, 6, 19, 0.12) 100%);
      border: 1px solid rgba(99, 102, 241, 0.35);
      border-radius: 20px;
      padding: 1.5rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1.5rem;
      backdrop-filter: blur(16px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
    }
    @media (max-width: 768px) {
      .master-banner-inner { flex-direction: column; text-align: center; }
    }
`;

if (!content.includes('Enterprise 5-Page Dashboard Mini-Tabs')) {
  content = content.replace('</style>', miniTabStyles + '\n</style>');
}

// Add Master Portal Banner right before Quick Command Bar
const masterBannerHtml = `
  <!-- Master Central Command Center Banner -->
  <div class="master-banner">
    <div class="master-banner-inner">
      <div>
        <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.4rem;">
          <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#10b981; box-shadow:0 0 10px #10b981;"></span>
          <span style="font-size:0.8rem; font-weight:700; color:#818cf8; text-transform:uppercase; letter-spacing:0.08em;">Unified Multi-Tenant System</span>
        </div>
        <h2 style="font-family:'Outfit', sans-serif; font-size:1.6rem; font-weight:800; color:#fff; margin-bottom:0.25rem;">Enterprise Command Center (D:\\hemanth bv\\Dashboard)</h2>
        <p style="font-size:0.9rem; color:#94a3b8; max-width:680px;">Centralized MongoDB Atlas management portal across all 7 RVPU campuses with lead management, interaction heatmaps, intent analytics, and live session tracking.</p>
      </div>
      <div style="display:flex; gap:0.75rem; flex-shrink:0;">
        <a href="http://localhost:3000" target="_blank" class="btn btn-primary" style="background:#6366f1; border-color:#818cf8; font-size:0.9rem; padding:0.75rem 1.4rem;">
          🚀 Open Master Portal
        </a>
      </div>
    </div>
  </div>
`;

if (!content.includes('Enterprise Command Center (D:\\hemanth bv\\Dashboard)')) {
  content = content.replace('<!-- Quick Command Bar -->', masterBannerHtml + '\n  <!-- Quick Command Bar -->');
}

// Function to generate the 5 mini-tabs HTML for any port and directory
function makeMiniTabs(port, dir) {
  return `
        <div class="dash-pages-bar" title="5-Page Enterprise Dashboard Suite">
          <a href="http://localhost:${port}/index.html" target="_blank" class="dash-page-link" title="Live Overview & Metrics">📊 Overview</a>
          <a href="http://localhost:${port}/analytics.html" target="_blank" class="dash-page-link" title="Funnel & Intent Analytics">📈 Analytics</a>
          <a href="http://localhost:${port}/interactions.html" target="_blank" class="dash-page-link" title="Conversation Logs Explorer">💬 Logs</a>
          <a href="http://localhost:${port}/leads.html" target="_blank" class="dash-page-link" title="Student Lead Management">👥 Leads</a>
          <a href="http://localhost:${port}/sessions.html" target="_blank" class="dash-page-link" title="Session Duration & Engagement">⏱️ Sessions</a>
        </div>`;
}

// Inject mini-tabs into each card if not already injected
const cardConfigs = [
  { id: 'card-north', port: 3001, dir: 'rvpu-north-chatbot' },
  { id: 'card-south', port: 3002, dir: 'rvpu-south-chatbot' },
  { id: 'card-ecity', port: 3003, dir: 'rvpu-ecity-chatbot' },
  { id: 'card-harohalli', port: 3004, dir: 'rvpu-harohalli-chatbot' },
  { id: 'card-ssmrv', port: 3006, dir: 'ssmrvpu-chatbot' },
  { id: 'card-mysore', port: 3005, dir: 'rvpu-mysore-chatbot' },
  { id: 'card-nmkrv', port: 3007, dir: 'nmkrvpu-chatbot' }
];

cardConfigs.forEach(cfg => {
  const cardStart = content.indexOf(`id="${cfg.id}"`);
  if (cardStart !== -1) {
    const cardEnd = content.indexOf('</div>\n    </div>', cardStart);
    if (cardEnd !== -1) {
      const cardSegment = content.slice(cardStart, cardEnd);
      if (!cardSegment.includes('dash-pages-bar')) {
        const replaceTarget = `<a href="http://localhost:${cfg.port}" target="_blank" class="action-btn btn-dash">📊 Dashboard</a>\n        </div>`;
        const replacement = `<a href="http://localhost:${cfg.port}" target="_blank" class="action-btn btn-dash">📊 Dashboard</a>\n        </div>${makeMiniTabs(cfg.port, cfg.dir)}`;
        content = content.replace(replaceTarget, replacement);
      }
    }
  }
});

fs.writeFileSync(HUB_FILE, content, 'utf8');
console.log('✓ Successfully enriched hub.html with Master Banner & 5-Page Dashboard Quick Navigation!');
