/**
 * RVPU Front-End Chatbot Widget Component
 * Campus: RV Pre-University College South, Bengaluru
 * Features: Branded UI, Keyword Chips, Horizontal Campus Cards, Deep Navigation, Dual-Write Telemetry.
 */
(function() {
  'use strict';

  const INST_ID = 'south';
  const INST_NAME = "RV Pre-University College South, Bengaluru";
  const INST_SHORT = "RVPU South";
  const WP_REST_URL = "https://south.rvpucollege.edu.in/wp-json/rvpu/v1/telemetry";
  const VERCEL_URL = "http://localhost:3000/api/telemetry";

  let engine = (typeof window !== 'undefined' && window.RVPUChatbot && window.RVPUChatbot[INST_ID] && window.RVPUChatbot[INST_ID].engine)
    ? window.RVPUChatbot[INST_ID].engine
    : null;
  let kb = null;
  let kw = null;

  function loadDependencies(callback) {
    if (!engine && typeof window !== 'undefined' && window.RVPUChatbot && window.RVPUChatbot[INST_ID]) {
      if (window.RVPUChatbot[INST_ID].engine) {
        engine = window.RVPUChatbot[INST_ID].engine;
      } else if (window.RVPUChatbot[INST_ID].ChatbotEngine) {
        engine = new window.RVPUChatbot[INST_ID].ChatbotEngine();
      }
    }
    if (engine) {
      callback();
      return;
    }
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
      console.warn('Local file fallback:', err);
      callback();
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
      quickChips: ['About Us', 'Our Courses', 'Our Campuses', 'Facilities', 'Contact Us', 'Events']
    };
    appendMessage('bot', defaultResp.answer, defaultResp.quickChips, null, defaultResp.navigationMenu, defaultResp.campusCards);
  }

  function handleUserSend() {
    const input = document.getElementById('rv-input');
    const text = input.value.trim();
    if (!text) return;

    appendMessage('user', text);
    input.value = '';

    sendTelemetry('query_sent', { query: text });

    setTimeout(() => {
      if (!engine && typeof window !== 'undefined' && window.RVPUChatbot && window.RVPUChatbot[INST_ID]) {
        engine = window.RVPUChatbot[INST_ID].engine || (window.RVPUChatbot[INST_ID].ChatbotEngine ? new window.RVPUChatbot[INST_ID].ChatbotEngine() : null);
      }
      if (engine) {
        const res = engine.match(text);
        appendMessage('bot', res.answer, res.quickChips, res.navigation, res.navigationMenu, res.campusCards);
        sendTelemetry('bot_response', { intent: res.intent, score: res.score });
      } else {
        appendMessage('bot', 'Connecting to admissions database...');
      }
    }, 200);
  }

  function appendMessage(sender, text, chips, navigation, navMenu, campusCards) {
    const container = document.getElementById('rv-messages');
    const msgEl = document.createElement('div');
    msgEl.className = 'rv-message rv-' + sender;

    let formattedText = text.replace(/\n/g, '<br/>')
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/•/g, '&bull;')
                            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color: var(--rv-primary); font-weight: 600; text-decoration: underline;">$1 ↗</a>');

    let html = '<div class="rv-msg-bubble">' + formattedText;

    if (navigation) {
      html += '<br/><a href="' + navigation.url + '" target="_blank" class="rv-nav-action-btn">🧭 ' + navigation.label + ' →</a>';
    }

    if (navMenu && Array.isArray(navMenu) && (!campusCards || campusCards.length === 0)) {
      html += '<div style="margin-top: 10px; display: flex; flex-direction: column; gap: 4px;">';
      navMenu.forEach(item => {
        html += '<a href="' + item.url + '" target="_blank" style="color: var(--rv-primary); font-size: 12.5px; font-weight: 600; text-decoration: none;">' + item.title + ' ↗</a>';
      });
      html += '</div>';
    }

    html += '</div>';

    if (chips && chips.length > 0) {
      html += '<div class="rv-chips-container">';
      chips.forEach(chip => {
        html += '<button class="rv-chip-btn" data-chip="' + chip + '">' + chip + '</button>';
      });
      html += '</div>';
    }

    msgEl.innerHTML = html;

    if (campusCards && Array.isArray(campusCards) && campusCards.length > 0) {
      const bubble = msgEl.querySelector('.rv-msg-bubble');
      const carouselWrapper = document.createElement('div');
      carouselWrapper.className = 'rv-carousel-wrapper';

      const scrollContainer = document.createElement('div');
      scrollContainer.className = 'rv-cards-scroll';

      campusCards.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.className = 'rv-campus-card';
        const tagsHtml = (card.streams || []).map(s => `<span class="rv-tag">${s}</span>`).join('');

        cardEl.innerHTML = `
          <div class="rv-card-top">
            <div class="rv-campus-card-title">${card.title}</div>
            <div class="rv-campus-card-loc">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              <span>${card.location}</span>
            </div>
          </div>
          <div class="rv-card-tags">
            ${tagsHtml}
          </div>
          <a href="${card.url}" target="_blank" class="rv-campus-btn">
            <span>Explore Campus</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </a>
        `;
        scrollContainer.appendChild(cardEl);
      });

      carouselWrapper.appendChild(scrollContainer);

      const controls = document.createElement('div');
      controls.className = 'rv-carousel-controls';
      controls.innerHTML = `
        <button type="button" class="rv-carousel-arrow prev" title="Scroll left">‹</button>
        <span class="rv-carousel-counter">${campusCards.length} Campuses Available</span>
        <button type="button" class="rv-carousel-arrow next" title="Scroll right">›</button>
      `;
      controls.querySelector('.prev').addEventListener('click', (e) => {
        e.stopPropagation();
        scrollContainer.scrollBy({ left: -240, behavior: 'smooth' });
      });
      controls.querySelector('.next').addEventListener('click', (e) => {
        e.stopPropagation();
        scrollContainer.scrollBy({ left: 240, behavior: 'smooth' });
      });
      carouselWrapper.appendChild(controls);

      bubble.appendChild(carouselWrapper);
    }

    container.appendChild(msgEl);

    if (sender === 'bot') {
      setTimeout(() => {
        const targetScroll = Math.max(0, msgEl.offsetTop - container.offsetTop - 8);
        container.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }, 50);
    } else {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }

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
    try {
      fetch(VERCEL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});
    } catch(e) {}
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadDependencies(() => {
      renderWidget();
    });
  });
})();
