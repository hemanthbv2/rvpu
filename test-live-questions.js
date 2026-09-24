const path = require('path');
const fs = require('fs');

const institutes = [
  { id: 'north', dir: 'rvpu-north-chatbot', expectedPrincipal: 'Kumar S.' },
  { id: 'south', dir: 'rvpu-south-chatbot', expectedPrincipal: 'A.S. Venkatesan' },
  { id: 'ecity', dir: 'rvpu-ecity-chatbot', expectedPrincipal: 'Suman G.V.' },
  { id: 'harohalli', dir: 'rvpu-harohalli-chatbot', expectedPrincipal: 'Umesh K.N.' },
  { id: 'ssmrvpu', dir: 'ssmrvpu-chatbot', expectedPrincipal: 'Anil Kumar' },
  { id: 'nmkrvpu', dir: 'nmkrvpu-chatbot', expectedPrincipal: 'Sheela Prakash' },
  { id: 'mysore', dir: 'rvpu-mysore-chatbot', expectedPrincipal: 'Ashwin Raj' }
];

const testQuestions = [
  {
    category: 'Cutoff & Eligibility',
    query: 'What is the cutoff percentage for admission?',
    expectedIntent: 'eligibility_cutoff',
    mustInclude: ['Eligibility & Admission Criteria', 'Karnataka SSLC', 'merit basis'],
    mustNotInclude: ['No Minimum Cutoff:', 'Cutoff Announcement:']
  },
  {
    category: 'Admissions Process',
    query: 'How to apply for 1st PUC admission?',
    expectedIntent: 'admissions_process',
    mustInclude: ['Admission Procedure at', 'Application form'],
    mustNotInclude: ['cutoff']
  },
  {
    category: 'Required Documents',
    query: 'What documents do I need to submit?',
    expectedIntent: 'admissions_documents',
    mustInclude: ['Documents Required for Admission', 'Marks Card', 'Transfer Certificate'],
    mustNotInclude: []
  },
  {
    category: 'Principal & Leadership',
    query: 'Who is the principal?',
    expectedIntent: 'principal',
    mustInclude: ['Principal of'],
    mustNotInclude: []
  },
  {
    category: 'Science Combinations',
    query: 'Tell me about PCMB combination',
    expectedIntent: 'course_pcmb',
    mustInclude: ['PCMB', 'Physics, Chemistry, Mathematics, Biology'],
    mustNotInclude: []
  },
  {
    category: 'Integrated Programmes',
    query: 'Tell me about NEET coaching',
    expectedIntent: 'course_neet_ug',
    mustInclude: ['NEET UG + KCET + PU Board', 'Medical entrance'],
    mustNotInclude: []
  },
  {
    category: 'Campus Facilities & Photos',
    query: 'Show me campus facilities and labs',
    expectedIntent: 'facilities',
    mustInclude: ['Campus Facilities at'],
    hasCards: 'facilityCards',
    minCards: 4
  },
  {
    category: 'Sister Campuses',
    query: 'What are your other campuses across Karnataka?',
    expectedIntent: 'all_campuses',
    mustInclude: ['7 premier Pre-University campuses'],
    hasCards: 'campusCards',
    minCards: 7
  },
  {
    category: 'Contact & Timings',
    query: 'Where is the college located and phone number?',
    expectedIntent: 'contact_location',
    mustInclude: ['Campus Address', 'Phone / Helpline', 'Official Website'],
    mustNotInclude: []
  }
];

let totalTests = 0;
let passedTests = 0;
const failures = [];

console.log('🧪 Comprehensive Question & Answer Evaluation Across All 7 RVPU Institutes\n');

institutes.forEach(inst => {
  const assetsDir = path.join(__dirname, inst.dir, 'assets');
  const kb = JSON.parse(fs.readFileSync(path.join(assetsDir, 'knowledge-base.json'), 'utf8'));
  const kw = JSON.parse(fs.readFileSync(path.join(assetsDir, 'keywords.json'), 'utf8'));
  const { ChatbotEngine, INST_NAME } = require(path.join(assetsDir, 'chatbot-engine.js'));

  const bot = new ChatbotEngine(kb, kw);
  console.log(`🏛️ Testing [${INST_NAME}] (${inst.id}):`);

  testQuestions.forEach(t => {
    totalTests++;
    const res = bot.match(t.query);
    const intentOk = res.intent === t.expectedIntent;

    let contentOk = true;
    const missing = [];
    (t.mustInclude || []).forEach(needle => {
      if (!res.answer.toLowerCase().includes(needle.toLowerCase())) {
        contentOk = false;
        missing.push(needle);
      }
    });

    let forbiddenOk = true;
    const forbiddenFound = [];
    (t.mustNotInclude || []).forEach(forbidden => {
      if (res.answer.toLowerCase().includes(forbidden.toLowerCase())) {
        forbiddenOk = false;
        forbiddenFound.push(forbidden);
      }
    });

    let cardsOk = true;
    if (t.hasCards) {
      cardsOk = Array.isArray(res[t.hasCards]) && res[t.hasCards].length >= t.minCards;
    }

    // Special check for principal name
    let principalOk = true;
    if (t.expectedIntent === 'principal') {
      if (!res.answer.includes(inst.expectedPrincipal)) {
        principalOk = false;
      }
    }

    const testPassed = intentOk && contentOk && forbiddenOk && cardsOk && principalOk;
    if (testPassed) {
      passedTests++;
      console.log(`  ✅ [${t.category}] "${t.query}" -> ${res.intent}`);
    } else {
      console.log(`  ❌ [${t.category}] "${t.query}" -> FAIL`);
      if (!intentOk) console.log(`     Expected intent: ${t.expectedIntent}, got: ${res.intent}`);
      if (!contentOk) console.log(`     Missing required text: ${missing.join(', ')}`);
      if (!forbiddenOk) console.log(`     Found forbidden text: ${forbiddenFound.join(', ')}`);
      if (!cardsOk) console.log(`     Missing or insufficient cards in ${t.hasCards}`);
      if (!principalOk) console.log(`     Principal did not match ${inst.expectedPrincipal}`);
      failures.push({ institute: inst.id, query: t.query, intent: res.intent, answer: res.answer });
    }
  });

  console.log('');
});

console.log('==================================================');
console.log(`Total Checks: ${totalTests} | Passed: ${passedTests} | Failed: ${totalTests - passedTests}`);
const passRate = ((passedTests / totalTests) * 100).toFixed(1);
console.log(`Pass Rate: ${passRate}%`);
if (passedTests === totalTests) {
  console.log('🎉 100% SUCCESS! All questions returned verified website data with zero cutoffs or hallucinations!');
} else {
  console.log('⚠️ Some checks failed. Review output above.');
}
