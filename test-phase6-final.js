/**
 * 🏁 PHASE 6: FINAL END-TO-END VALIDATION SUITE
 * Tests ALL 7 RVPU Institute Chatbots for Production Deployment Readiness.
 *
 * Validates:
 * - Phase 1: Data files exist & valid JSON
 * - Phase 2: Knowledge bases, keywords, engines
 * - Phase 3: Branded widget CSS/JS/HTML
 * - Phase 4: Comprehensive query coverage (50+ queries × 7 institutes = 350+ tests)
 * - Phase 5: Dashboard server, public assets
 * - Phase 6: Cross-cutting production checks
 */
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

// Comprehensive query battery — every kind of question a student might ask
const queryBattery = [
  // Greetings
  { q: 'hello', expectIntent: 'greeting' },
  { q: 'hi there', expectIntent: 'greeting' },
  { q: 'help', expectIntent: 'greeting' },
  { q: 'good morning', expectIntent: 'greeting' },
  { q: 'namaste', expectIntent: 'greeting' },

  // Courses & Combinations
  { q: 'What courses do you offer?', expectIntent: 'courses_all' },
  { q: 'tell me about combinations', expectIntent: 'courses_all' },
  { q: 'what streams are available?', expectIntent: 'courses_all' },
  { q: 'PCMB combination details', expectIntent: 'courses_science' },
  { q: 'is PCMC available?', expectIntent: 'courses_science' },
  { q: 'tell me about science stream', expectIntent: 'courses_science' },
  { q: 'physics chemistry maths biology', expectIntent: 'courses_science' },
  { q: 'I want to prepare for NEET', expectIntent: 'courses_science' },
  { q: 'JEE preparation available?', expectIntent: 'courses_science' },
  { q: 'engineering entrance coaching', expectIntent: 'courses_science' },
  { q: 'commerce stream combinations', expectIntent: 'courses_commerce' },
  { q: 'what about SEBA combination?', expectIntent: 'courses_commerce' },
  { q: 'is CA coaching available?', expectIntent: 'courses_commerce' },
  { q: 'business studies and accountancy', expectIntent: 'courses_commerce' },

  // Languages
  { q: 'what languages can I choose?', expectIntent: 'languages' },
  { q: 'is Hindi available as second language?', expectIntent: 'languages' },
  { q: 'is French offered?', expectIntent: 'languages' },
  { q: 'is Kannada compulsory?', expectIntent: 'languages' },

  // Admissions
  { q: 'how to apply for admission?', expectIntent: 'admissions_process' },
  { q: 'what is the admission procedure?', expectIntent: 'admissions_process' },
  { q: 'when does admission start?', expectIntent: 'admissions_process' },
  { q: 'how to enroll at this college?', expectIntent: 'admissions_process' },
  { q: 'is admission first come first served?', expectIntent: 'admissions_process' },

  // Documents
  { q: 'what documents are needed for admission?', expectIntent: 'admissions_documents' },
  { q: 'is transfer certificate required?', expectIntent: 'admissions_documents' },
  { q: 'do I need Aadhaar card?', expectIntent: 'admissions_documents' },
  { q: 'caste certificate needed?', expectIntent: 'admissions_documents' },
  { q: 'what marksheet to bring?', expectIntent: 'admissions_documents' },

  // Eligibility & Cutoffs
  { q: 'what is the cutoff percentage?', expectIntent: 'eligibility_cutoff' },
  { q: 'minimum marks for science?', expectIntent: 'eligibility_cutoff' },
  { q: 'eligibility criteria for PUC', expectIntent: 'eligibility_cutoff' },
  { q: 'SSLC percentage required?', expectIntent: 'eligibility_cutoff' },

  // About Us & Principal
  { q: 'About Us', expectIntent: 'about_us' },
  { q: 'who is the principal?', expectIntent: 'about_us' },
  { q: 'tell me about the management', expectIntent: 'about_us' },
  { q: 'who runs this college?', expectIntent: 'about_us' },
  { q: 'RSST trust information', expectIntent: 'about_us' },

  // Core Requested Action Buttons
  { q: 'Our Courses', expectIntent: 'courses_all' },
  { q: 'Facilities', expectIntent: 'facilities' },
  { q: 'Contact Us', expectIntent: 'contact_location' },
  { q: 'Events', expectIntent: 'events' },
  { q: 'what events and activities happen?', expectIntent: 'events' },

  // Facilities
  { q: 'what facilities does the campus have?', expectIntent: 'facilities' },
  { q: 'do you have science laboratories?', expectIntent: 'facilities' },
  { q: 'is there a library?', expectIntent: 'facilities' },
  { q: 'sports and playground facilities', expectIntent: 'facilities' },
  { q: 'computer lab available?', expectIntent: 'facilities' },

  // Contact & Location
  { q: 'what is the college address?', expectIntent: 'contact_location' },
  { q: 'give me the phone number', expectIntent: 'contact_location' },
  { q: 'email address of the college?', expectIntent: 'contact_location' },
  { q: 'working hours and timings', expectIntent: 'contact_location' },
  { q: 'how to reach the campus?', expectIntent: 'contact_location' },

  // Navigation Commands
  { q: 'take me to admission page', expectIntent: 'navigation_redirect' },
  { q: 'open courses page', expectIntent: 'navigation_redirect' },
  { q: 'go to contact page', expectIntent: 'navigation_redirect' },
  { q: 'go to facilities page', expectIntent: 'navigation_redirect' }
];

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = [];

function check(desc, condition, detail) {
  totalChecks++;
  if (condition) {
    passedChecks++;
  } else {
    failedChecks.push({ desc, detail });
    console.error(`  ❌ FAIL: ${desc}${detail ? ' — ' + detail : ''}`);
  }
}

console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║  🏁 PHASE 6: FINAL PRODUCTION READINESS VALIDATION SUITE   ║');
console.log('║  7 RVPU Institute Chatbots — End-to-End Testing            ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

for (const inst of institutes) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  🔍 Testing: ${inst.name} (${inst.dir})`);
  console.log(`${'═'.repeat(60)}`);

  const baseDir = path.join(__dirname, inst.dir);

  // ── PHASE 1: Data Files ──
  console.log('\n  📁 Phase 1: Data Structure & Scraped Data');
  const rawDataPath = path.join(baseDir, 'raw-data', 'scraped-data.json');
  check(`[${inst.id}] scraped-data.json exists`, fs.existsSync(rawDataPath));

  let rawData = null;
  try {
    rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));
    check(`[${inst.id}] scraped-data.json valid JSON`, true);
  } catch (e) {
    check(`[${inst.id}] scraped-data.json valid JSON`, false, e.message);
  }

  if (rawData) {
    check(`[${inst.id}] has institute info`, !!rawData.institute && !!rawData.institute.name);
    check(`[${inst.id}] has courses data`, !!rawData.courses && Array.isArray(rawData.courses.combinations));
    check(`[${inst.id}] has admissions data`, !!rawData.admissions);
    check(`[${inst.id}] has leadership data`, !!rawData.leadership);
    check(`[${inst.id}] has colors data`, !!rawData.colors && !!rawData.colors.primary);
    check(`[${inst.id}] has pages/links`, !!rawData.pages);
    check(`[${inst.id}] has facilities data`, !!rawData.facilities);
    check(`[${inst.id}] has faculty data`, !!rawData.faculty);
  }

  // ── PHASE 2: Knowledge Base & Engine ──
  console.log('  📚 Phase 2: Knowledge Base, Keywords & Engine');
  const kbPath = path.join(baseDir, 'assets', 'knowledge-base.json');
  const kwPath = path.join(baseDir, 'assets', 'keywords.json');
  const enginePath = path.join(baseDir, 'assets', 'chatbot-engine.js');

  check(`[${inst.id}] knowledge-base.json exists`, fs.existsSync(kbPath));
  check(`[${inst.id}] keywords.json exists`, fs.existsSync(kwPath));
  check(`[${inst.id}] chatbot-engine.js exists`, fs.existsSync(enginePath));

  let kb = null, kw = null, engine = null;
  try {
    kb = JSON.parse(fs.readFileSync(kbPath, 'utf8'));
    kw = JSON.parse(fs.readFileSync(kwPath, 'utf8'));
    check(`[${inst.id}] KB has ${kb.length} intents`, kb.length >= 10, `Expected >=10, got ${kb.length}`);
    check(`[${inst.id}] KW has ${Object.keys(kw).length} keywords`, Object.keys(kw).length >= 100, `Expected >=100, got ${Object.keys(kw).length}`);
  } catch (e) {
    check(`[${inst.id}] KB/KW parse error`, false, e.message);
  }

  try {
    // Clear require cache to avoid stale modules
    delete require.cache[require.resolve(enginePath)];
    const engineModule = require(enginePath);
    const bot = new engineModule.ChatbotEngine(kb, kw);
    engine = bot;
    check(`[${inst.id}] Engine instantiated`, true);
    check(`[${inst.id}] INST_NAME set`, !!engineModule.INST_NAME);
  } catch (e) {
    check(`[${inst.id}] Engine load error`, false, e.message);
  }

  // ── PHASE 3: Branded Widget Files ──
  console.log('  🎨 Phase 3: Branded UI Widget Files');
  const cssPath = path.join(baseDir, 'assets', 'chatbot-widget.css');
  const jsPath = path.join(baseDir, 'assets', 'chatbot-widget.js');
  const htmlPath = path.join(baseDir, 'index.html');

  check(`[${inst.id}] chatbot-widget.css exists`, fs.existsSync(cssPath));
  check(`[${inst.id}] chatbot-widget.js exists`, fs.existsSync(jsPath));
  check(`[${inst.id}] index.html preview exists`, fs.existsSync(htmlPath));

  if (fs.existsSync(cssPath) && rawData) {
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    check(`[${inst.id}] CSS uses brand color`, cssContent.includes(rawData.colors.primary), `Expected ${rawData.colors.primary}`);
  }

  // ── PHASE 4: Comprehensive Query Coverage ──
  console.log('  ⚡ Phase 4: Query Coverage Testing');
  let intentHits = 0;
  let intentMisses = 0;

  if (engine) {
    for (const testCase of queryBattery) {
      const res = engine.match(testCase.q);
      if (res.intent !== 'fallback') {
        intentHits++;
        // Verify answer is not empty
        check(`[${inst.id}] "${testCase.q}" → has answer`, !!res.answer && res.answer.length > 10);
      } else {
        intentMisses++;
        check(`[${inst.id}] "${testCase.q}" → matched`, false, `Got fallback (expected ${testCase.expectIntent})`);
      }
    }
    console.log(`  ✅ Intent coverage: ${intentHits}/${queryBattery.length} (${((intentHits / queryBattery.length) * 100).toFixed(1)}%)`);
  }

  // ── PHASE 5: Dashboard Files ──
  console.log('  📊 Phase 5: Dashboard Files');
  const serverPath = path.join(baseDir, 'dashboard', 'server.js');
  const dashHtmlPath = path.join(baseDir, 'dashboard', 'public', 'index.html');
  const dashCssPath = path.join(baseDir, 'dashboard', 'public', 'dashboard.css');
  const dashJsPath = path.join(baseDir, 'dashboard', 'public', 'dashboard.js');

  check(`[${inst.id}] dashboard/server.js exists`, fs.existsSync(serverPath));
  check(`[${inst.id}] dashboard/public/index.html exists`, fs.existsSync(dashHtmlPath));
  check(`[${inst.id}] dashboard/public/dashboard.css exists`, fs.existsSync(dashCssPath));
  check(`[${inst.id}] dashboard/public/dashboard.js exists`, fs.existsSync(dashJsPath));

  if (fs.existsSync(serverPath)) {
    const serverContent = fs.readFileSync(serverPath, 'utf8');
    check(`[${inst.id}] Server has correct port ${inst.port}`, serverContent.includes(String(inst.port)));
    check(`[${inst.id}] Server has telemetry endpoint`, serverContent.includes('/api/telemetry'));
    check(`[${inst.id}] Server has stats endpoint`, serverContent.includes('/api/dashboard/stats'));
    check(`[${inst.id}] Server has leads endpoint`, serverContent.includes('/api/dashboard/leads'));
    check(`[${inst.id}] Server has CORS headers`, serverContent.includes('Access-Control-Allow-Origin'));
  }

  // ── PHASE 6: Production Readiness Checks ──
  console.log('  🚀 Phase 6: Production Readiness');

  // Check quick chips are present on greeting
  if (engine) {
    const greeting = engine.getDefaultResponse();
    check(`[${inst.id}] Greeting has quick chips`, greeting.quickChips && greeting.quickChips.length >= 3);

    // Check every KB intent has an answer and quick chips
    if (kb) {
      for (const item of kb) {
        check(`[${inst.id}] Intent "${item.id}" has answer`, !!item.answer && item.answer.length > 20);
        check(`[${inst.id}] Intent "${item.id}" has chips`, !!item.quickChips && item.quickChips.length > 0);
      }
    }
  }
}

// ── FINAL REPORT ──
console.log('\n\n╔══════════════════════════════════════════════════════════════╗');
console.log('║                   📊 FINAL TEST REPORT                      ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

console.log(`Total Checks Run:     ${totalChecks}`);
console.log(`Checks Passed:        ${passedChecks} ✅`);
console.log(`Checks Failed:        ${failedChecks.length} ${failedChecks.length > 0 ? '❌' : '✅'}`);
console.log(`Pass Rate:            ${((passedChecks / totalChecks) * 100).toFixed(2)}%`);
console.log(`Institutes Tested:    7/7`);
console.log(`Queries per Institute: ${queryBattery.length}`);
console.log(`Total Query Tests:    ${queryBattery.length * 7}\n`);

if (failedChecks.length > 0) {
  console.log('── Failed Checks ──');
  failedChecks.forEach((f, i) => {
    console.log(`  ${i + 1}. ${f.desc}${f.detail ? ': ' + f.detail : ''}`);
  });
  console.log('');
  process.exit(1);
} else {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  🎉 ALL CHECKS PASSED — SYSTEM IS PRODUCTION READY!');
  console.log('  ✅ Phase 1: Data Extraction — COMPLETE');
  console.log('  ✅ Phase 2: Knowledge Bases & Engines — COMPLETE');
  console.log('  ✅ Phase 3: Branded UI Widgets — COMPLETE');
  console.log('  ✅ Phase 4: Query Coverage 100% — COMPLETE');
  console.log('  ✅ Phase 5: Dashboards — COMPLETE');
  console.log('  ✅ Phase 6: Production Validation — COMPLETE');
  console.log('═══════════════════════════════════════════════════════════\n');
  process.exit(0);
}
