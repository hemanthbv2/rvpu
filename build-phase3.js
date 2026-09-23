const fs = require('fs');
const path = require('path');

const institutes = [
  { id: 'north', dir: 'rvpu-north-chatbot', title: 'RV PU College North' },
  { id: 'south', dir: 'rvpu-south-chatbot', title: 'RV PU College South' },
  { id: 'ecity', dir: 'rvpu-ecity-chatbot', title: 'RV PU College Electronic City' },
  { id: 'harohalli', dir: 'rvpu-harohalli-chatbot', title: 'RV PU College Harohalli' },
  { id: 'mysore', dir: 'rvpu-mysore-chatbot', title: 'RV PU College Mysuru' },
  { id: 'ssmrvpu', dir: 'ssmrvpu-chatbot', title: 'SSMRV PU College' },
  { id: 'nmkrvpu', dir: 'nmkrvpu-chatbot', title: 'NMKRV PU College' }
];

function generateWidgetCSS(colors, instName) {
  const primary = colors.primary || '#E30613';
  const primaryAlt = colors.primary_alt || '#C00000';
  const accent = (colors.accent && colors.accent !== '#FFFFFF') ? colors.accent : (colors.secondary || '#46B3CA');
  const accentLight = colors.accent_light || '#55C3DC';
  const dark = colors.footer || colors.secondary_dark || colors.secondary || '#1A1A1A';
  const bgLight = colors.background || '#F9FAFB';

  return `/* RVPU Chatbot Design System — ${instName} */
:root {
  --rv-primary: ${primary};
  --rv-primary-alt: ${primaryAlt};
  --rv-accent: ${accent};
  --rv-accent-light: ${accentLight};
  --rv-dark: ${dark};
  --rv-bg-light: ${bgLight};
  --rv-card-bg: rgba(255, 255, 255, 0.96);
  --rv-shadow: 0 12px 36px rgba(0, 0, 0, 0.22);
  --rv-radius: 16px;
  --rv-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

#rv-chatbot-widget {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 999999;
  font-family: var(--rv-font);
  box-sizing: border-box;
}

#rv-chatbot-widget * {
  box-sizing: border-box;
}

/* Floating Launcher Button */
.rv-chat-launcher {
  width: 62px;
  height: 62px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--rv-primary), var(--rv-primary-alt));
  color: #ffffff;
  border: none;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25), 0 0 0 0 var(--rv-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  animation: rv-pulse 2.5s infinite;
}

.rv-chat-launcher:hover {
  transform: scale(1.08) translateY(-2px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
}

@keyframes rv-pulse {
  0% { box-shadow: 0 0 0 0 rgba(227, 6, 19, 0.45); }
  70% { box-shadow: 0 0 0 16px rgba(227, 6, 19, 0); }
  100% { box-shadow: 0 0 0 0 rgba(227, 6, 19, 0); }
}

.rv-chat-launcher svg {
  width: 30px;
  height: 30px;
  fill: currentColor;
  transition: transform 0.2s ease;
}

/* Chat Window */
.rv-chat-window {
  position: absolute;
  bottom: 78px;
  right: 0;
  width: 400px;
  max-width: calc(100vw - 32px);
  height: 620px;
  max-height: calc(100vh - 110px);
  background: var(--rv-card-bg);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: var(--rv-radius);
  box-shadow: var(--rv-shadow);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  opacity: 0;
  transform: scale(0.92) translateY(20px);
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.rv-chat-window.rv-open {
  opacity: 1;
  transform: scale(1) translateY(0);
  pointer-events: all;
}

/* Header */
.rv-chat-header {
  background: linear-gradient(135deg, var(--rv-dark), var(--rv-primary));
  color: #ffffff;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top-left-radius: var(--rv-radius);
  border-top-right-radius: var(--rv-radius);
}

.rv-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rv-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #ffffff;
  color: var(--rv-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  border: 2px solid var(--rv-accent);
}

.rv-header-title h4 {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.2px;
}

.rv-status-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #A3E635;
  margin-top: 2px;
}

.rv-status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #A3E635;
  box-shadow: 0 0 6px #A3E635;
}

.rv-header-actions {
  display: flex;
  gap: 6px;
}

.rv-header-btn {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: #ffffff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: background 0.2s;
}

.rv-header-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Messages Stream */
.rv-chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--rv-bg-light);
}

.rv-message {
  display: flex;
  flex-direction: column;
  max-width: 85%;
  animation: rv-fade-in 0.25s ease forwards;
}

@keyframes rv-fade-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.rv-message.rv-bot {
  align-self: flex-start;
}

.rv-message.rv-user {
  align-self: flex-end;
}

.rv-msg-bubble {
  padding: 12px 15px;
  border-radius: 14px;
  font-size: 13.5px;
  line-height: 1.5;
  word-break: break-word;
}

.rv-bot .rv-msg-bubble {
  background: #ffffff;
  color: #1f2937;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  border-bottom-left-radius: 4px;
}

.rv-user .rv-msg-bubble {
  background: var(--rv-primary);
  color: #ffffff;
  border-bottom-right-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

/* Interactive Keyword Chips & Navigation Buttons */
.rv-chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.rv-chip-btn {
  background: #ffffff;
  color: var(--rv-primary);
  border: 1px solid var(--rv-primary);
  border-radius: 18px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.rv-chip-btn:hover {
  background: var(--rv-primary);
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

.rv-nav-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, var(--rv-accent), var(--rv-accent-light));
  color: #ffffff;
  text-decoration: none;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 700;
  margin-top: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  transition: all 0.2s;
}

.rv-nav-action-btn:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

/* Input Bar */
.rv-chat-input-area {
  padding: 12px 14px;
  background: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 8px;
  align-items: center;
}

.rv-chat-input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 24px;
  font-size: 13.5px;
  outline: none;
  transition: border 0.2s;
}

.rv-chat-input:focus {
  border-color: var(--rv-primary);
  box-shadow: 0 0 0 2px rgba(227, 6, 19, 0.15);
}

.rv-send-btn {
  background: var(--rv-primary);
  color: #ffffff;
  border: none;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.rv-send-btn:hover {
  background: var(--rv-primary-alt);
  transform: scale(1.05);
}

.rv-send-btn svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

/* Lead Capture Card */
.rv-lead-card {
  background: #ffffff;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 12px;
  padding: 12px;
  margin-top: 8px;
}

.rv-lead-card input, .rv-lead-card select {
  width: 100%;
  padding: 8px 10px;
  margin-bottom: 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 12px;
}

.rv-lead-submit {
  width: 100%;
  background: var(--rv-primary);
  color: #fff;
  border: none;
  padding: 8px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
}
`;
}

function generateWidgetJS(inst, data) {
  return `/**
 * RVPU Front-End Chatbot Widget Component
 * Campus: ${data.institute.name}
 * Features: Branded UI, Keyword Chips, Deep Website Navigation, Dual-Write Telemetry.
 */
(function() {
  'use strict';

  const INST_ID = '${inst.id}';
  const INST_NAME = ${JSON.stringify(data.institute.name)};
  const INST_SHORT = ${JSON.stringify(data.institute.shortName || data.institute.name)};
  const WP_REST_URL = '${data.institute.website}wp-json/rvpu/v1/telemetry';
  const VERCEL_URL = 'http://localhost:3000/api/telemetry'; // Local or deployed Node dashboard

  let engine = null;
  let kb = null;
  let kw = null;

  function loadDependencies(callback) {
    if (window.RVPUChatbot && window.RVPUChatbot[INST_ID]) {
      callback();
      return;
    }
    // Load local json/engine
    Promise.all([
      fetch('assets/knowledge-base.json').then(r => r.json()),
      fetch('assets/keywords.json').then(r => r.json())
    ]).then(([loadedKb, loadedKw]) => {
      kb = loadedKb;
      kw = loadedKw;
      if (window.RVPUChatbot && window.RVPUChatbot[INST_ID]) {
        engine = new window.RVPUChatbot[INST_ID].ChatbotEngine(kb, kw);
      }
      callback();
    }).catch(err => {
      console.error('Error initializing RVPU Chatbot:', err);
    });
  }

  function renderWidget() {
    const container = document.createElement('div');
    container.id = 'rv-chatbot-widget';
    container.innerHTML = \`
      <button class="rv-chat-launcher" id="rv-launcher-btn" aria-label="Open Admissions Chat">
        <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
      </button>

      <div class="rv-chat-window" id="rv-window">
        <div class="rv-chat-header">
          <div class="rv-header-left">
            <div class="rv-avatar">RV</div>
            <div class="rv-header-title">
              <h4>\${INST_SHORT} Assistant</h4>
              <div class="rv-status-badge">
                <span class="rv-status-dot"></span>
                <span>Online • RSST Official</span>
              </div>
            </div>
          </div>
          <div class="rv-header-actions">
            <button class="rv-header-btn" id="rv-reset-btn" title="Restart Chat">↺</button>
            <button class="rv-header-btn" id="rv-close-btn" title="Close Chat">✕</button>
          </div>
        </div>

        <div class="rv-chat-messages" id="rv-messages"></div>

        <div class="rv-chat-input-area">
          <input type="text" class="rv-chat-input" id="rv-input" placeholder="Ask about combinations, admissions..." autocomplete="off"/>
          <button class="rv-send-btn" id="rv-send-btn" aria-label="Send">
            <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>
    \`;
    document.body.appendChild(container);

    attachEvents();
    showWelcome();
  }

  function attachEvents() {
    const launcher = document.getElementById('rv-launcher-btn');
    const windowEl = document.getElementById('rv-window');
    const closeBtn = document.getElementById('rv-close-btn');
    const resetBtn = document.getElementById('rv-reset-btn');
    const input = document.getElementById('rv-input');
    const sendBtn = document.getElementById('rv-send-btn');

    launcher.addEventListener('click', () => {
      windowEl.classList.toggle('rv-open');
      if (windowEl.classList.contains('rv-open')) {
        input.focus();
        sendTelemetry('chat_opened');
      }
    });

    closeBtn.addEventListener('click', () => windowEl.classList.remove('rv-open'));
    resetBtn.addEventListener('click', () => {
      document.getElementById('rv-messages').innerHTML = '';
      showWelcome();
    });

    sendBtn.addEventListener('click', () => handleUserSend());
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleUserSend();
    });
  }

  function showWelcome() {
    const defaultResp = engine ? engine.getDefaultResponse() : {
      answer: "👋 Welcome to **" + INST_NAME + "** Official AI Assistant! How may I assist you today?",
      quickChips: ['Courses & Combinations', 'Admission Process', 'Required Documents', 'Campus Facilities', 'Contact & Location']
    };
    appendMessage('bot', defaultResp.answer, defaultResp.quickChips, null, defaultResp.navigationMenu);
  }

  function handleUserSend() {
    const input = document.getElementById('rv-input');
    const text = input.value.trim();
    if (!text) return;

    appendMessage('user', text);
    input.value = '';

    sendTelemetry('query_sent', { query: text });

    setTimeout(() => {
      if (engine) {
        const res = engine.match(text);
        appendMessage('bot', res.answer, res.quickChips, res.navigation, res.navigationMenu);
        sendTelemetry('bot_response', { intent: res.intent, score: res.score });
      } else {
        appendMessage('bot', 'Connecting to admissions database...');
      }
    }, 300);
  }

  function appendMessage(sender, text, chips, navigation, navMenu) {
    const container = document.getElementById('rv-messages');
    const msgEl = document.createElement('div');
    msgEl.className = 'rv-message rv-' + sender;

    let formattedText = text.replace(/\\n/g, '<br/>')
                            .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
                            .replace(/•/g, '&bull;');

    let html = '<div class="rv-msg-bubble">' + formattedText;

    // Direct Website Navigation button
    if (navigation) {
      html += '<br/><a href="' + navigation.url + '" target="_blank" class="rv-nav-action-btn">🧭 ' + navigation.label + ' →</a>';
    }

    // Direct Navigation Menu Links
    if (navMenu && Array.isArray(navMenu)) {
      html += '<div style="margin-top: 10px; display: flex; flex-direction: column; gap: 4px;">';
      navMenu.forEach(item => {
        html += '<a href="' + item.url + '" target="_blank" style="color: var(--rv-primary); font-size: 12.5px; font-weight: 600; text-decoration: none;">' + item.title + ' ↗</a>';
      });
      html += '</div>';
    }

    html += '</div>';

    // Interactive Keyword Buttons
    if (chips && chips.length > 0) {
      html += '<div class="rv-chips-container">';
      chips.forEach(chip => {
        html += '<button class="rv-chip-btn" data-chip="' + chip + '">' + chip + '</button>';
      });
      html += '</div>';
    }

    msgEl.innerHTML = html;
    container.appendChild(msgEl);
    container.scrollTop = container.scrollHeight;

    // Attach click listener for chips
    msgEl.querySelectorAll('.rv-chip-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const chipText = this.getAttribute('data-chip');
        document.getElementById('rv-input').value = chipText;
        handleUserSend();
      });
    });
  }

  function sendTelemetry(eventType, eventData) {
    const payload = {
      instituteId: INST_ID,
      instituteName: INST_NAME,
      event: eventType,
      data: eventData || {},
      timestamp: new Date().toISOString()
    };

    // Dual-write: Send to Node/MongoDB backend
    try {
      fetch(VERCEL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});
    } catch(e) {}
  }

  // Self init on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    loadDependencies(() => {
      renderWidget();
    });
  });
})();
`;
}

function generatePreviewHTML(inst, data) {
  const colors = data.colors || {};
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.institute.name} — Chatbot Preview</title>
  <link rel="stylesheet" href="assets/chatbot-widget.css">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: ${colors.background || '#F9FAFB'};
      color: #1f2937;
    }
    header {
      background: linear-gradient(135deg, ${colors.secondary || '#1A1A1A'}, ${colors.primary || '#E30613'});
      color: white;
      padding: 30px 20px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .badge {
      display: inline-block;
      background: ${colors.accent || '#46B3CA'};
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 10px;
    }
    .container {
      max-width: 900px;
      margin: 40px auto;
      padding: 0 20px;
    }
    .card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      border-left: 5px solid ${colors.primary || '#E30613'};
    }
    h2 { margin-top: 0; color: ${colors.primary || '#E30613'}; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
    .color-swatch {
      padding: 16px;
      border-radius: 8px;
      color: white;
      font-weight: 700;
      font-size: 13px;
      text-align: center;
    }
    .instructions {
      background: #EFF6FF;
      border: 1px solid #BFDBFE;
      padding: 16px;
      border-radius: 8px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <header>
    <div class="badge">RSST / RVEI OFFICIAL CHATBOT</div>
    <h1>${data.institute.name}</h1>
    <p>Live AI Chatbot Widget with Website Theming & Dual-Write Telemetry</p>
  </header>

  <div class="container">
    <div class="card">
      <h2>🎨 Website Color Palette Applied</h2>
      <div class="grid">
        <div class="color-swatch" style="background: ${colors.primary || '#E30613'};">Primary<br>${colors.primary}</div>
        <div class="color-swatch" style="background: ${colors.secondary || '#1A1A1A'};">Dark Secondary<br>${colors.secondary}</div>
        <div class="color-swatch" style="background: ${colors.accent || '#46B3CA'}; color: #111;">Accent<br>${colors.accent}</div>
        <div class="color-swatch" style="background: #E5E7EB; color: #111;">Card Light<br>${colors.background}</div>
      </div>
    </div>

    <div class="card">
      <h2>📋 Campus Fast Facts</h2>
      <p><strong>Campus Address:</strong> ${data.institute.address}</p>
      <p><strong>Phone:</strong> ${Array.isArray(data.institute.phone) ? data.institute.phone.join(', ') : data.institute.phone}</p>
      <p><strong>Email:</strong> ${data.institute.email}</p>
      <p><strong>Official Website:</strong> <a href="${data.institute.website}" target="_blank">${data.institute.website}</a></p>
    </div>

    <div class="instructions">
      <h3>👉 How to Test This Chatbot:</h3>
      <ol>
        <li>Click the floating round launcher button at the <strong>bottom-right corner</strong>.</li>
        <li>Tap on any of the <strong>interactive keyword chips</strong> (e.g., <em>Courses & Combinations</em>, <em>Admission Process</em>, <em>Campus Facilities</em>).</li>
        <li>Try typing navigation commands like: <code>take me to admission page</code> or <code>go to courses</code>.</li>
        <li>Notice the deep website links and custom branded theme matching ${data.institute.shortName || data.institute.name}!</li>
      </ol>
    </div>
  </div>

  <!-- Chatbot Widget Integration -->
  <script src="assets/chatbot-engine.js"></script>
  <script src="assets/chatbot-widget.js"></script>
</body>
</html>
`;
}

function run() {
  console.log('🎨 Compiling Phase 3 Custom Branded UI Widgets for all 7 RVPU Institutes...\n');

  for (const inst of institutes) {
    const rawDataPath = path.join(__dirname, inst.dir, 'raw-data', 'scraped-data.json');
    const rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));

    const colors = rawData.colors || {};
    const cssCode = generateWidgetCSS(colors, inst.title);
    const jsCode = generateWidgetJS(inst, rawData);
    const htmlCode = generatePreviewHTML(inst, rawData);

    const assetsDir = path.join(__dirname, inst.dir, 'assets');
    fs.writeFileSync(path.join(assetsDir, 'chatbot-widget.css'), cssCode, 'utf8');
    fs.writeFileSync(path.join(assetsDir, 'chatbot-widget.js'), jsCode, 'utf8');
    fs.writeFileSync(path.join(__dirname, inst.dir, 'index.html'), htmlCode, 'utf8');

    console.log(`✅ [${inst.title}] Branded Widget Created:`);
    console.log(`   - CSS: assets/chatbot-widget.css (Primary: ${colors.primary}, Accent: ${colors.accent})`);
    console.log(`   - JS: assets/chatbot-widget.js (Dual-write telemetry + Navigation)`);
    console.log(`   - Preview Page: ${inst.dir}/index.html\n`);
  }

  console.log('🎉 Phase 3 build complete for all 7 institutes!');
}

run();
