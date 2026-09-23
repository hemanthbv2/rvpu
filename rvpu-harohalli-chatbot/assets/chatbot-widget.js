/**
 * RVPU Front-End Chatbot Widget Component
 * Campus: RV Pre-University College Harohalli
 * Features: Branded UI, Keyword Chips, Deep Website Navigation, Dual-Write Telemetry.
 */
(function() {
  'use strict';

  const INST_ID = 'harohalli';
  const INST_NAME = "RV Pre-University College Harohalli";
  const INST_SHORT = "RVPU Harohalli";
  const WP_REST_URL = 'https://hrh.rvpucollege.edu.in/wp-json/rvpu/v1/telemetry';
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
    container.innerHTML = `
      <button class="rv-chat-launcher" id="rv-launcher-btn" aria-label="Open Admissions Chat">
        <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
      </button>

      <div class="rv-chat-window" id="rv-window">
        <div class="rv-chat-header">
          <div class="rv-header-left">
            <div class="rv-avatar">RV</div>
            <div class="rv-header-title">
              <h4>${INST_SHORT} Assistant</h4>
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
    `;
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

    let formattedText = text.replace(/\n/g, '<br/>')
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
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
