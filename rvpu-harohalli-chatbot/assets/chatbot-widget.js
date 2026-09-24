/**
 * RVPU Front-End Chatbot Widget Component
 * Campus: RV Pre-University College Harohalli
 * Features: Branded UI, Smart Auto-complete, Proactive Nudge, Facility Photo Carousel, Campus Cards, Dual-Write Telemetry.
 */
(function() {
  'use strict';

  const INST_ID = 'harohalli';
  const INST_NAME = "RV Pre-University College Harohalli";
  const INST_SHORT = "RVPU Harohalli";
  const WP_REST_URL = "https://hrh.rvpucollege.edu.in/wp-json/rvpu/v1/telemetry";
  const VERCEL_URL = "http://localhost:3000/api/telemetry";

  // Persistent Session Continuity
  let sessionId = 'sess_' + Date.now();
  try {
    sessionId = sessionStorage.getItem('rv_chat_session') || ('sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6));
    sessionStorage.setItem('rv_chat_session', sessionId);
  } catch(e) {}

  let engine = (typeof window !== 'undefined' && window.RVPUChatbot && window.RVPUChatbot[INST_ID] && window.RVPUChatbot[INST_ID].engine)
    ? window.RVPUChatbot[INST_ID].engine
    : null;
  let kb = null;
  let kw = null;

  const suggestionsData = [{"text":"Admission Process & Steps","icon":"📝","query":"admission process","tag":"Admissions"},{"text":"Required Documents for Admission","icon":"📄","query":"required documents","tag":"Admissions"},{"text":"Eligibility & Admission Criteria","icon":"🎯","query":"eligibility criteria","tag":"Admissions"},{"text":"How to Apply post SSLC / 10th","icon":"✍️","query":"how to apply","tag":"Admissions"},{"text":"PCMB (Science Stream)","icon":"🔬","query":"PCMB","tag":"Science"},{"text":"PCMC (Science Stream)","icon":"🔬","query":"PCMC","tag":"Science"},{"text":"BAMS (Commerce Stream)","icon":"📊","query":"BAMS","tag":"Commerce"},{"text":"BAME (Commerce Stream)","icon":"📊","query":"BAME","tag":"Commerce"},{"text":"SEBA (Commerce Stream)","icon":"📊","query":"SEBA","tag":"Commerce"},{"text":"Science Stream Overview","icon":"🔬","query":"science stream","tag":"Academics"},{"text":"Commerce Stream Overview","icon":"📊","query":"commerce stream","tag":"Academics"},{"text":"JEE Advanced (Main + KCET Decoded)","icon":"🚀","query":"JEE Advanced","tag":"Integrated"},{"text":"JEE (Main + KCET Decoded)","icon":"📐","query":"JEE Main","tag":"Integrated"},{"text":"NEET UG + KCET Medical Track","icon":"🩺","query":"NEET UG","tag":"Medical"},{"text":"Commerce Decoded (CA + CLAT)","icon":"⚖️","query":"Commerce Decoded","tag":"Commerce"},{"text":"Campus Facilities & Photo Tour","icon":"🏫","query":"facilities","tag":"Campus"},{"text":"Science & Computer Laboratories","icon":"🔬","query":"labs","tag":"Campus"},{"text":"Sports Complex, Gym & Pool","icon":"⚽","query":"sports","tag":"Campus"},{"text":"Library & Digital Resource Center","icon":"📚","query":"library","tag":"Campus"},{"text":"Principal & Leadership Desk","icon":"👨‍🏫","query":"principal","tag":"Leadership"},{"text":"About RVPU Harohalli & RSST Trust","icon":"🏛️","query":"about us","tag":"About"},{"text":"Our 7 Sister Campuses Across Karnataka","icon":"🌐","query":"our campuses","tag":"Campuses"},{"text":"Contact Us & Campus Location","icon":"📍","query":"contact us","tag":"Contact"},{"text":"College Events & Cultural Fests","icon":"🎉","query":"events","tag":"Campus"}];

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
      <!-- Proactive Welcome Nudge -->
      <div class="rv-chat-nudge" id="rv-chat-nudge" role="button" aria-label="Open Admissions Chat">
        <button type="button" class="rv-nudge-close" id="rv-nudge-close" title="Dismiss" aria-label="Dismiss">✕</button>
        <div class="rv-nudge-avatar">👋</div>
        <div class="rv-nudge-body">
          <div class="rv-nudge-title">Planning for I PUC admissions?</div>
          <div class="rv-nudge-text">Ask me about combinations, admissions &amp; campus life!</div>
        </div>
      </div>

      <!-- Floating Launcher Button -->
      <button class="rv-chat-launcher" id="rv-launcher-btn" aria-label="Open Admissions Chat">
        <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
      </button>

      <!-- Main Chat Window -->
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

        <!-- Smart Auto-complete Suggestions Dropdown -->
        <div class="rv-autocomplete-dropdown" id="rv-autocomplete-dropdown"></div>

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

  function highlightMatch(text, query) {
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return text.substring(0, idx) + '<strong>' + text.substring(idx, idx + query.length) + '</strong>' + text.substring(idx + query.length);
  }

  function attachEvents() {
    const launcher = document.getElementById('rv-launcher-btn');
    const windowEl = document.getElementById('rv-window');
    const closeBtn = document.getElementById('rv-close-btn');
    const resetBtn = document.getElementById('rv-reset-btn');
    const input = document.getElementById('rv-input');
    const sendBtn = document.getElementById('rv-send-btn');
    const nudge = document.getElementById('rv-chat-nudge');
    const nudgeClose = document.getElementById('rv-nudge-close');
    const autocomplete = document.getElementById('rv-autocomplete-dropdown');

    // 1. Proactive Welcome Nudge (Triggers after 5 seconds)
    setTimeout(() => {
      if (windowEl && !windowEl.classList.contains('rv-open') && nudge) {
        let dismissed = false;
        try { dismissed = sessionStorage.getItem('rv_nudge_dismissed') === 'true'; } catch(e) {}
        if (!dismissed) {
          nudge.classList.add('rv-nudge-visible');
        }
      }
    }, 5000);

    if (nudge) {
      nudge.addEventListener('click', (e) => {
        if (e.target.closest('#rv-nudge-close')) return;
        nudge.classList.remove('rv-nudge-visible');
        windowEl.classList.add('rv-open');
        input.focus();
        sendTelemetry('chat_opened', { source: 'welcome_nudge' });
      });
    }

    if (nudgeClose) {
      nudgeClose.addEventListener('click', (e) => {
        e.stopPropagation();
        if (nudge) nudge.classList.remove('rv-nudge-visible');
        try { sessionStorage.setItem('rv_nudge_dismissed', 'true'); } catch(err) {}
      });
    }

    // 2. Launcher & Window Toggle
    launcher.addEventListener('click', () => {
      if (nudge) nudge.classList.remove('rv-nudge-visible');
      windowEl.classList.toggle('rv-open');
      if (windowEl.classList.contains('rv-open')) {
        input.focus();
        sendTelemetry('chat_opened', { source: 'launcher_button' });
      }
    });

    closeBtn.addEventListener('click', () => windowEl.classList.remove('rv-open'));
    resetBtn.addEventListener('click', () => {
      document.getElementById('rv-messages').innerHTML = '';
      if (autocomplete) {
        autocomplete.innerHTML = '';
        autocomplete.classList.remove('rv-show');
      }
      showWelcome();
    });

    sendBtn.addEventListener('click', () => handleUserSend());

    // 3. Smart Search & Auto-complete Suggestions
    input.addEventListener('input', () => {
      const val = input.value.trim().toLowerCase();
      if (!autocomplete) return;

      if (val.length < 2) {
        autocomplete.innerHTML = '';
        autocomplete.classList.remove('rv-show');
        return;
      }

      const matches = suggestionsData.filter(item =>
        item.text.toLowerCase().includes(val) ||
        item.query.toLowerCase().includes(val) ||
        item.tag.toLowerCase().includes(val)
      ).slice(0, 5);

      if (matches.length === 0) {
        autocomplete.innerHTML = '';
        autocomplete.classList.remove('rv-show');
        return;
      }

      autocomplete.innerHTML = matches.map(m => `
        <div class="rv-suggestion-item" data-query="${m.query}">
          <span class="rv-suggestion-icon">${m.icon}</span>
          <span class="rv-suggestion-label">${highlightMatch(m.text, val)}</span>
          <span class="rv-suggestion-badge">${m.tag}</span>
        </div>
      `).join('');
      autocomplete.classList.add('rv-show');

      autocomplete.querySelectorAll('.rv-suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
          const q = this.getAttribute('data-query');
          input.value = q;
          autocomplete.innerHTML = '';
          autocomplete.classList.remove('rv-show');
          handleUserSend();
        });
      });
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (autocomplete) {
          autocomplete.innerHTML = '';
          autocomplete.classList.remove('rv-show');
        }
        handleUserSend();
      } else if (e.key === 'Escape') {
        if (autocomplete) {
          autocomplete.innerHTML = '';
          autocomplete.classList.remove('rv-show');
        }
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.rv-chat-input-area') && !e.target.closest('.rv-autocomplete-dropdown')) {
        if (autocomplete) {
          autocomplete.classList.remove('rv-show');
        }
      }
    });
  }

  function showWelcome() {
    const defaultResp = engine ? engine.getDefaultResponse() : {
      answer: "👋 Welcome to **" + INST_NAME + "** Official AI Assistant! How may I assist you today?",
      quickChips: ['About Us', 'Our Courses', 'Our Campuses', 'Facilities', 'Contact Us', 'Events']
    };
    appendMessage('bot', defaultResp.answer, defaultResp.quickChips, null, defaultResp.navigationMenu, defaultResp.campusCards, defaultResp.facilityCards);
  }

  function handleUserSend() {
    const input = document.getElementById('rv-input');
    const text = input.value.trim();
    if (!text) return;

    appendMessage('user', text);
    input.value = '';

    const autocomplete = document.getElementById('rv-autocomplete-dropdown');
    if (autocomplete) {
      autocomplete.innerHTML = '';
      autocomplete.classList.remove('rv-show');
    }

    sendTelemetry('query_sent', { query: text });

    setTimeout(() => {
      if (!engine && typeof window !== 'undefined' && window.RVPUChatbot && window.RVPUChatbot[INST_ID]) {
        engine = window.RVPUChatbot[INST_ID].engine || (window.RVPUChatbot[INST_ID].ChatbotEngine ? new window.RVPUChatbot[INST_ID].ChatbotEngine() : null);
      }
      if (engine) {
        const res = engine.match(text);
        appendMessage('bot', res.answer, res.quickChips, res.navigation, res.navigationMenu, res.campusCards, res.facilityCards);
        sendTelemetry('bot_response', {
          intent: res.intent,
          score: res.score,
          confidence: res.confidence,
          confidencePercent: res.confidencePercent,
          matchQuality: res.matchQuality
        });
      } else {
        appendMessage('bot', 'Connecting to admissions database...');
      }
    }, 200);
  }

  function appendMessage(sender, text, chips, navigation, navMenu, campusCards, facilityCards) {
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

    if (navMenu && Array.isArray(navMenu) && (!campusCards || campusCards.length === 0) && (!facilityCards || facilityCards.length === 0)) {
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

    // A. Render Campus Cards Carousel
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

    // B. Render Campus Photo & Facility Carousel
    if (facilityCards && Array.isArray(facilityCards) && facilityCards.length > 0) {
      const bubble = msgEl.querySelector('.rv-msg-bubble');
      const carouselWrapper = document.createElement('div');
      carouselWrapper.className = 'rv-carousel-wrapper';

      const scrollContainer = document.createElement('div');
      scrollContainer.className = 'rv-cards-scroll';

      facilityCards.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.className = 'rv-facility-card';

        cardEl.innerHTML = `
          <div class="rv-facility-card-img-wrap">
            <img src="${card.image}" alt="${card.title}" class="rv-facility-card-img" loading="lazy" />
            <span class="rv-facility-card-badge">${card.badge}</span>
          </div>
          <div class="rv-facility-card-body">
            <div class="rv-facility-card-title">${card.title}</div>
            <div class="rv-facility-card-desc">${card.description}</div>
          </div>
        `;
        scrollContainer.appendChild(cardEl);
      });

      carouselWrapper.appendChild(scrollContainer);

      const controls = document.createElement('div');
      controls.className = 'rv-carousel-controls';
      controls.innerHTML = `
        <button type="button" class="rv-carousel-arrow prev" title="Scroll left">‹</button>
        <span class="rv-carousel-counter">${facilityCards.length} Facilities • Swipe ›</span>
        <button type="button" class="rv-carousel-arrow next" title="Scroll right">›</button>
      `;
      controls.querySelector('.prev').addEventListener('click', (e) => {
        e.stopPropagation();
        scrollContainer.scrollBy({ left: -250, behavior: 'smooth' });
      });
      controls.querySelector('.next').addEventListener('click', (e) => {
        e.stopPropagation();
        scrollContainer.scrollBy({ left: 250, behavior: 'smooth' });
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
      sessionId: sessionId,
      instituteId: INST_ID,
      instituteName: INST_NAME,
      event: eventType,
      data: eventData || {},
      timestamp: new Date().toISOString()
    };
    try {
      // 1. Dual-Write to Vercel/Node backend
      fetch(VERCEL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});

      // 2. Dual-Write to WordPress REST API
      fetch(WP_REST_URL, {
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
