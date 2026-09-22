/**
 * RVPU Intelligent Chatbot Engine — RV Pre-University College South, Bengaluru
 * Dual-write compatible, TF-IDF weighted scoring, intent matching, website navigation & telemetry.
 */
(function(window) {
  'use strict';

  const INST_ID = 'south';
  const INST_NAME = "RV Pre-University College South, Bengaluru";
  const INST_SHORT = "RVPU South";
  const BRAND_COLORS = {"primary":"#6EC195","primary_alt":"#72C597","secondary":"#4E8F67","secondary_dark":"#3A7550","alert":"#E00000","footer":"#2B2B2B","background":"#F0EFEB"};

  // Common stop words to filter
  const STOP_WORDS = new Set([
    'a', 'an', 'the', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'about', 'like', 'through', 'over', 'before', 'between', 'after', 'since', 'without',
    'under', 'within', 'along', 'following', 'across', 'behind', 'beyond', 'plus', 'except',
    'but', 'up', 'out', 'around', 'down', 'off', 'above', 'near', 'i', 'you', 'he', 'she',
    'it', 'we', 'they', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those',
    'am', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'can', 'could', 'should',
    'would', 'may', 'might', 'must', 'tell', 'me', 'please', 'know', 'want', 'give', 'college', 'rv', 'pu', 'rvpu'
  ]);

  class ChatbotEngine {
    constructor(knowledgeBase, keywordMap) {
      this.kb = knowledgeBase;
      this.keywordMap = keywordMap;
      this.history = [];
    }

    tokenize(text) {
      if (!text) return [];
      return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(token => token.length > 1 && !STOP_WORDS.has(token));
    }

    match(userQuery) {
      const raw = (userQuery || '').toLowerCase().trim();
      if (!raw) {
        return this.getDefaultResponse();
      }

      // Check direct navigation commands
      const navMatch = this.detectNavigationIntent(raw);
      if (navMatch) {
        return navMatch;
      }

      const tokens = this.tokenize(raw);
      const scores = new Map();

      // Initialize scores
      this.kb.forEach(item => scores.set(item.id, 0));

      // 1. Phrase / exact substring match boost
      this.kb.forEach(item => {
        for (const kw of item.keywords) {
          if (raw === kw) {
            scores.set(item.id, scores.get(item.id) + (item.weight * 5.0));
          } else if (raw.includes(kw)) {
            scores.set(item.id, scores.get(item.id) + (item.weight * 2.5));
          }
        }
      });

      // 2. Token / keyword occurrence scoring
      tokens.forEach(token => {
        if (this.keywordMap[token]) {
          this.keywordMap[token].forEach(entry => {
            scores.set(entry.id, scores.get(entry.id) + (entry.weight * 1.5));
          });
        }

        // Fuzzy prefix match
        Object.keys(this.keywordMap).forEach(kw => {
          if (kw.length >= 4 && (token.startsWith(kw) || kw.startsWith(token))) {
            this.keywordMap[kw].forEach(entry => {
              scores.set(entry.id, scores.get(entry.id) + (entry.weight * 0.8));
            });
          }
        });
      });

      // Find highest scoring intent
      let highestId = null;
      let maxScore = 0;
      scores.forEach((score, id) => {
        if (score > maxScore) {
          maxScore = score;
          highestId = id;
        }
      });

      // Threshold check
      if (highestId && maxScore >= 1.2) {
        const item = this.kb.find(i => i.id === highestId);
        return {
          intent: item.id,
          category: item.category,
          score: maxScore,
          answer: item.answer,
          quickChips: item.quickChips || [],
          navigation: item.navigation || null,
          navigationMenu: item.navigationMenu || null
        };
      }

      // Fallback
      return {
        intent: 'fallback',
        category: 'fallback',
        score: 0,
        answer: `I'm sorry, I couldn't find exact details for "${userQuery}".\n\nHere are some popular topics you can explore at **${INST_SHORT}**:`,
        quickChips: ['Courses & Combinations', 'Admission Process', 'Required Documents', 'Campus Facilities', 'Contact & Location', 'Navigate Website']
      };
    }

    detectNavigationIntent(raw) {
      const navTriggers = {
        admission: ['take me to admission', 'open admission', 'go to admission', 'admission page', 'apply online', 'portal'],
        courses: ['take me to courses', 'open courses', 'go to courses', 'courses page', 'syllabus page'],
        facilities: ['take me to facilities', 'open facilities', 'go to facilities', 'facilities page', 'campus tour'],
        contact: ['take me to contact', 'open contact', 'go to contact', 'contact page', 'reach us'],
        about: ['take me to about', 'about page', 'who we are']
      };

      for (const [key, triggers] of Object.entries(navTriggers)) {
        for (const trigger of triggers) {
          if (raw.includes(trigger)) {
            const item = this.kb.find(i => i.id.includes(key));
            if (item && item.navigation) {
              return {
                intent: 'navigation_redirect',
                category: 'navigation',
                score: 10.0,
                answer: `🧭 Taking you directly to **${item.navigation.label}**:\n\n[${item.navigation.label}](${item.navigation.url})\n\nClick the button below or link above to proceed.`,
                quickChips: ['Courses & Combinations', 'Admission Process', 'Campus Facilities'],
                navigation: item.navigation
              };
            }
          }
        }
      }
      return null;
    }

    getDefaultResponse() {
      const greeting = this.kb.find(i => i.id === 'greeting');
      return {
        intent: 'greeting',
        category: 'general',
        score: 1.0,
        answer: greeting ? greeting.answer : 'Hello! How can I assist you with admissions or courses?',
        quickChips: greeting ? greeting.quickChips : []
      };
    }
  }

  // Export to window or module
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ChatbotEngine, INST_ID, INST_NAME, INST_SHORT, BRAND_COLORS };
  } else {
    window.RVPUChatbot = window.RVPUChatbot || {};
    window.RVPUChatbot[INST_ID] = { ChatbotEngine, INST_ID, INST_NAME, INST_SHORT, BRAND_COLORS };
  }
})(typeof window !== 'undefined' ? window : global);
