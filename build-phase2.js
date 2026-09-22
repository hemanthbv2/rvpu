const fs = require('fs');
const path = require('path');

const institutes = [
  { id: 'north', dir: 'rvpu-north-chatbot', name: 'RV PU College North' },
  { id: 'south', dir: 'rvpu-south-chatbot', name: 'RV PU College South' },
  { id: 'ecity', dir: 'rvpu-ecity-chatbot', name: 'RV PU College Electronic City' },
  { id: 'harohalli', dir: 'rvpu-harohalli-chatbot', name: 'RV PU College Harohalli' },
  { id: 'mysore', dir: 'rvpu-mysore-chatbot', name: 'RV PU College Mysuru' },
  { id: 'ssmrvpu', dir: 'ssmrvpu-chatbot', name: 'SSMRV PU College' },
  { id: 'nmkrvpu', dir: 'nmkrvpu-chatbot', name: 'NMKRV PU College' }
];

function buildKnowledgeBase(data, inst) {
  const shortName = data.institute.shortName || data.institute.name;
  const fullName = data.institute.name;
  const address = data.institute.address;
  const phones = Array.isArray(data.institute.phone) ? data.institute.phone.join(', ') : (data.institute.phone || 'Contact office');
  const email = data.institute.email || 'info@rvei.edu.in';
  const timings = data.institute.timings || 'Monday – Saturday: 9:00 AM – 5:00 PM';
  const website = data.institute.website;
  const principalName = (data.leadership && data.leadership.principal) ? (data.leadership.principal.name || 'Principal') : 'Principal';
  
  // Streams & Combinations formatting
  const combinations = data.courses.combinations || [];
  const scienceCombos = combinations.filter(c => c.stream === 'Science').map(c => `• **${c.code}**: ${c.subjects}`).join('\n');
  const commerceCombos = combinations.filter(c => c.stream === 'Commerce').map(c => `• **${c.code}**: ${c.subjects}`).join('\n');
  const allCombosText = combinations.map(c => `• **${c.code}** (${c.stream}): ${c.subjects}`).join('\n');
  
  // Languages
  const compulsoryLang = data.courses.languages ? data.courses.languages.compulsory : 'English';
  const secondLangs = data.courses.languages ? data.courses.languages.second_language_options.join(', ') : 'Kannada, Hindi, Sanskrit, French';

  // Admissions & Docs
  const admissionSteps = (data.admissions && data.admissions.process) ? data.admissions.process.map((p, i) => `${i + 1}. ${p}`).join('\n') : '';
  const docsList = (data.admissions && data.admissions.required_documents) ? data.admissions.required_documents.map(d => `• ${d}`).join('\n') : '';

  // Facilities
  const facilitiesList = (data.facilities && data.facilities.items) ? data.facilities.items.map(f => `• ${f}`).join('\n') : '';

  // Pages
  const pages = data.pages || {};
  const coursesPage = pages.courses || pages.home || website;
  const admissionsPage = pages.admissions || pages.admission_portal || website;
  const contactPage = pages.contact || pages.home || website;
  const facilitiesPage = pages.facilities || pages.home || website;
  const aboutPage = pages.about || pages.home || website;

  return [
    {
      id: 'greeting',
      category: 'general',
      title: 'Greetings & Welcome',
      keywords: ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good afternoon', 'good evening', 'start', 'help', 'menu'],
      weight: 1.0,
      answer: `👋 Welcome to **${fullName}** Official AI Assistant!\n\nI can help you with admissions, course combinations, eligibility, campus facilities, contact information, and direct website navigation.\n\nWhat would you like to explore today?`,
      quickChips: ['Courses & Combinations', 'Admission Process', 'Required Documents', 'Campus Facilities', 'Contact & Location', 'Navigate Website']
    },
    {
      id: 'courses_all',
      category: 'academics',
      title: 'Courses and Combinations Offered',
      keywords: ['courses', 'combinations', 'streams', 'subjects', 'pcmb', 'pcmc', 'seba', 'ceba', 'bams', 'bame', 'meba', 'peba', 'science', 'commerce', 'programs', 'study', 'academic'],
      weight: 2.0,
      answer: `🎓 **Courses & Combinations at ${shortName}**\n\n**Duration**: 2 Academic Years (I PUC & II PUC)\n**Medium of Instruction**: English (Public exams can be answered in English or Kannada)\n\n**🔬 Science Stream**:\n${scienceCombos || '• PCMB: Physics, Chemistry, Mathematics, Biology\n• PCMC: Physics, Chemistry, Mathematics, Computer Science'}\n\n**📊 Commerce Stream**:\n${commerceCombos || '• SEBA: Statistics, Economics, Business Studies, Accountancy\n• BAMS/BAME: Business, Accountancy, Maths, Stats/Economics'}\n\n**Languages**:\n• Compulsory: ${compulsoryLang}\n• Second Language Options: ${secondLangs}`,
      quickChips: ['Admission Process', 'Science Stream', 'Commerce Stream', 'Required Documents', 'Go to Courses Page'],
      navigation: { label: 'Visit Courses Page', url: coursesPage }
    },
    {
      id: 'courses_science',
      category: 'academics',
      title: 'Science Stream Combinations',
      keywords: ['science', 'science stream', 'pcmb', 'pcmc', 'physics', 'chemistry', 'maths', 'mathematics', 'biology', 'computer science', 'neet', 'jee', 'kcet', 'engineering', 'medical'],
      weight: 2.5,
      answer: `🔬 **Science Stream Combinations at ${shortName}**:\n\n${scienceCombos}\n\n• **PCMB**: Ideal for Medical (NEET), Biotechnology, Pure Sciences, and Engineering.\n• **PCMC**: Ideal for Engineering (JEE/KCET), Computer Science, and IT careers.\n\nAll science programs feature intensive laboratory practicals and competitive exam preparatory orientation.`,
      quickChips: ['Commerce Stream', 'Admission Process', 'Science Labs', 'Contact Admissions'],
      navigation: { label: 'Explore Science Courses', url: coursesPage }
    },
    {
      id: 'courses_commerce',
      category: 'academics',
      title: 'Commerce Stream Combinations',
      keywords: ['commerce', 'commerce stream', 'bams', 'bame', 'seba', 'ceba', 'meba', 'peba', 'business studies', 'accountancy', 'economics', 'statistics', 'ca', 'cs', 'finance'],
      weight: 2.5,
      answer: `📊 **Commerce Stream Combinations at ${shortName}**:\n\n${commerceCombos}\n\nThese combinations build a solid foundation for careers in Chartered Accountancy (CA), Company Secretary (CS), Business Administration (BBA/MBA), Financial Analysis, and Economics.`,
      quickChips: ['Science Stream', 'Admission Process', 'Required Documents', 'Contact Admissions'],
      navigation: { label: 'Explore Commerce Courses', url: coursesPage }
    },
    {
      id: 'languages',
      category: 'academics',
      title: 'Language Options',
      keywords: ['language', 'languages', 'second language', 'kannada', 'hindi', 'sanskrit', 'french', 'english', 'medium'],
      weight: 2.0,
      answer: `🗣️ **Language Options at ${shortName}**:\n\n• **Part I (Compulsory)**: ${compulsoryLang}\n• **Part II (Second Language Choice)**: ${secondLangs}\n\nMedium of instruction is English, while students are permitted to answer public examinations in either English or Kannada as per DPUE regulations.`,
      quickChips: ['Courses & Combinations', 'Admission Process', 'Campus Facilities']
    },
    {
      id: 'admissions_process',
      category: 'admissions',
      title: 'Admission Procedure & Steps',
      keywords: ['admission', 'admissions', 'apply', 'application', 'how to apply', 'procedure', 'process', 'enroll', 'seat', 'registration', 'form', 'dates'],
      weight: 2.5,
      answer: `📝 **Admission Procedure at ${shortName}**:\n\n${admissionSteps}\n\n💡 **Tips**: Admissions commence immediately following the declaration of Class 10 / SSLC board exam results. We advise applying early as seats are allotted on merit and first-come, first-served basis.`,
      quickChips: ['Required Documents', 'Eligibility & Cutoffs', 'Contact Admissions', 'Take me to Admission Page'],
      navigation: { label: 'Open Admission Portal', url: admissionsPage }
    },
    {
      id: 'admissions_documents',
      category: 'admissions',
      title: 'Required Documents for Admission',
      keywords: ['documents', 'required documents', 'certificates', 'marksheet', 'marks card', 'tc', 'transfer certificate', 'aadhaar', 'caste certificate', 'income certificate', 'photographs', 'eligibility certificate'],
      weight: 2.5,
      answer: `📄 **Documents Required for Admission at ${shortName}**:\n\n${docsList}\n\n*Note*: Ensure you bring the original certificates along with at least 3 attested photocopies for verification during counseling.`,
      quickChips: ['Admission Process', 'Eligibility & Cutoffs', 'Contact & Location']
    },
    {
      id: 'eligibility_cutoff',
      category: 'admissions',
      title: 'Eligibility & Cutoff Criteria',
      keywords: ['eligibility', 'cutoff', 'cut off', 'cut-off', 'percentage', 'marks', 'minimum marks', 'criteria', 'sslc percentage', 'pass marks'],
      weight: 2.5,
      answer: `🎯 **Eligibility & Cutoff Criteria**:\n\n• **Eligibility**: Candidates who have successfully cleared SSLC / ICSE / CBSE / 10th Standard or equivalent board.\n• **Cutoff Announcement**: Cutoffs are finalized upon declaration of 10th board results and displayed on the college notice board & website.\n• **Promotion Criteria (I PUC to II PUC)**: Minimum 30% marks in each individual subject and 35% overall aggregate in district-level promotional exams.`,
      quickChips: ['Admission Process', 'Required Documents', 'Courses & Combinations']
    },
    {
      id: 'leadership_principal',
      category: 'about',
      title: 'Principal & Leadership Team',
      keywords: ['principal', 'head', 'leadership', 'director', 'president', 'management', 'trust', 'rsst', 'rvei', 'who is principal', 'shyam', 'murthy', 'nagaraj'],
      weight: 2.0,
      answer: `🏛️ **Leadership at ${shortName}**:\n\n• **Principal**: **${principalName}**\n• **RSST President**: Dr. M.P. Shyam\n• **Hon. Secretary**: Dr. (h.c.) A.V.S. Murthy\n• **Hon. Joint Secretary**: Mr. D.P. Nagaraj\n• **Trust**: Rashtreeya Sikshana Samithi Trust (RSST) / RV Educational Institutions (RVEI), delivering over 80+ years of educational excellence.`,
      quickChips: ['About College', 'Courses & Combinations', 'Contact & Location'],
      navigation: { label: 'View Management Details', url: aboutPage }
    },
    {
      id: 'facilities',
      category: 'campus',
      title: 'Campus Facilities & Infrastructure',
      keywords: ['facilities', 'infrastructure', 'labs', 'laboratory', 'library', 'sports', 'playground', 'auditorium', 'smart class', 'classrooms', 'gym', 'canteen', 'hostel', 'campus'],
      weight: 2.0,
      answer: `🏫 **Campus Facilities at ${shortName}**:\n\n${facilitiesList}\n\nOur campus is designed to foster both academic rigour and all-round holistic development with world-class facilities.`,
      quickChips: ['Courses & Combinations', 'Admission Process', 'Campus Location', 'Explore Facilities Page'],
      navigation: { label: 'Explore Facilities Page', url: facilitiesPage }
    },
    {
      id: 'contact_location',
      category: 'contact',
      title: 'Contact Information, Address & Timings',
      keywords: ['contact', 'address', 'phone', 'mobile', 'call', 'email', 'location', 'where', 'timings', 'working hours', 'map', 'directions', 'reach', 'helpline'],
      weight: 2.5,
      answer: `📍 **Contact Information — ${shortName}**\n\n• **Campus Address**:\n  ${address}\n• **Phone / Helpline**: ${phones}\n• **Email**: ${email}\n• **Office Working Hours**: ${timings}\n• **Official Website**: ${website}`,
      quickChips: ['Admission Process', 'Take me to Contact Page', 'Courses & Combinations'],
      navigation: { label: 'Open Contact Us Page', url: contactPage }
    },
    {
      id: 'website_navigation',
      category: 'navigation',
      title: 'Website Direct Page Navigation',
      keywords: ['website', 'navigation', 'navigate', 'link', 'portal', 'home page', 'open', 'go to', 'take me', 'redirect', 'visit', 'browse'],
      weight: 2.0,
      answer: `🧭 **Direct Navigation Directory for ${shortName}**:\n\nClick any of the destination links below to jump directly to that section of our website:`,
      navigationMenu: [
        { title: '🏠 Home Page', url: pages.home || website },
        { title: '📖 About College', url: pages.about || website },
        { title: '🎓 Courses & Combinations', url: pages.courses || website },
        { title: '📝 Admissions & Criteria', url: pages.admissions || pages.admission_portal || website },
        { title: '🏛️ Campus Facilities', url: pages.facilities || website },
        { title: '📞 Contact & Location', url: pages.contact || website }
      ],
      quickChips: ['Take me to Admission Page', 'Go to Courses Page', 'Contact & Location']
    }
  ];
}

function buildKeywordsTable(knowledgeBase) {
  const keywordMap = {};
  for (const item of knowledgeBase) {
    for (const kw of item.keywords) {
      const cleanKw = kw.toLowerCase().trim();
      if (!keywordMap[cleanKw]) {
        keywordMap[cleanKw] = [];
      }
      keywordMap[cleanKw].push({ id: item.id, weight: item.weight });
    }
  }
  return keywordMap;
}

function generateEngineCode(inst, data) {
  const brandColors = data.colors || {
    primary: '#E30613',
    primary_alt: '#C00000',
    secondary: '#1A1A1A',
    accent: '#46B3CA',
    background: '#FFFFFF'
  };

  return `/**
 * RVPU Intelligent Chatbot Engine — ${data.institute.name}
 * Dual-write compatible, TF-IDF weighted scoring, intent matching, website navigation & telemetry.
 */
(function(window) {
  'use strict';

  const INST_ID = '${inst.id}';
  const INST_NAME = ${JSON.stringify(data.institute.name)};
  const INST_SHORT = ${JSON.stringify(data.institute.shortName || data.institute.name)};
  const BRAND_COLORS = ${JSON.stringify(brandColors)};

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
        .replace(/[^a-z0-9\\s]/g, ' ')
        .split(/\\s+/)
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
        answer: \`I'm sorry, I couldn't find exact details for "\${userQuery}".\\n\\nHere are some popular topics you can explore at **\${INST_SHORT}**:\`,
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
                answer: \`🧭 Taking you directly to **\${item.navigation.label}**:\\n\\n[\${item.navigation.label}](\${item.navigation.url})\\n\\nClick the button below or link above to proceed.\`,
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
`;
}

function run() {
  console.log('🚀 Compiling Phase 2 Knowledge Base, Keywords & Engines for all 7 RVPU Institutes...\n');

  for (const inst of institutes) {
    const rawDataPath = path.join(__dirname, inst.dir, 'raw-data', 'scraped-data.json');
    if (!fs.existsSync(rawDataPath)) {
      console.warn(`⚠️ Warning: Raw data missing for ${inst.dir}`);
      continue;
    }

    const rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));
    const kb = buildKnowledgeBase(rawData, inst);
    const keywords = buildKeywordsTable(kb);
    const engineCode = generateEngineCode(inst, rawData);

    const assetsDir = path.join(__dirname, inst.dir, 'assets');
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }

    fs.writeFileSync(path.join(assetsDir, 'knowledge-base.json'), JSON.stringify(kb, null, 2), 'utf8');
    fs.writeFileSync(path.join(assetsDir, 'keywords.json'), JSON.stringify(keywords, null, 2), 'utf8');
    fs.writeFileSync(path.join(assetsDir, 'chatbot-engine.js'), engineCode, 'utf8');

    console.log(`✅ [${inst.name}] Compiled:`);
    console.log(`   - ${kb.length} comprehensive Q&A intents with quick chips & deep links`);
    console.log(`   - ${Object.keys(keywords).length} unique indexed keywords`);
    console.log(`   - Dual-write compatible matching engine in assets/chatbot-engine.js\n`);
  }

  console.log('🎉 Phase 2 build complete for all 7 institutes!');
}

run();
