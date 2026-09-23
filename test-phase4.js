const fs = require('fs');
const path = require('path');

const institutes = [
  'rvpu-north-chatbot',
  'rvpu-south-chatbot',
  'rvpu-ecity-chatbot',
  'rvpu-harohalli-chatbot',
  'rvpu-mysore-chatbot',
  'ssmrvpu-chatbot',
  'nmkrvpu-chatbot'
];

const comprehensiveQueries = [
  // Greetings & General
  'hello',
  'hi there',
  'help me with information',

  // Academics & Combinations
  'what courses do you offer?',
  'tell me about pcmb combination',
  'is computer science available in science stream?',
  'what commerce combinations are there?',
  'can I study seba?',
  'which second languages can I choose?',
  'is kannada compulsory or optional?',

  // Admissions & Eligibility
  'how to apply for admission?',
  'what is the eligibility criteria?',
  'what is the minimum cutoff percentage?',
  'when does admission start after sslc?',
  'is admission first come first served?',

  // Documents
  'what documents are required for admission?',
  'is transfer certificate tc needed?',
  'do I need caste certificate?',
  'do I need aadhaar card?',

  // Facilities & Campus
  'tell me about college facilities',
  'do you have science and computer laboratories?',
  'is there a library on campus?',
  'what sports facilities are available?',

  // Leadership & Principal
  'who is the principal of the college?',
  'tell me about the management and rsst trust',

  // Contact & Location
  'what is the campus address and location?',
  'give me the contact phone number and email',
  'what are the college office timings?',

  // Website Navigation Commands
  'take me to admission page',
  'open courses page',
  'go to contact page'
];

console.log('🧪 Running Comprehensive Phase 4 Test Suite across all 7 RVPU Institutes...\n');

let totalTests = 0;
let passedTests = 0;
let fallbackCount = 0;

for (const dir of institutes) {
  const kb = JSON.parse(fs.readFileSync(path.join(__dirname, dir, 'assets', 'knowledge-base.json'), 'utf8'));
  const kw = JSON.parse(fs.readFileSync(path.join(__dirname, dir, 'assets', 'keywords.json'), 'utf8'));
  const { ChatbotEngine, INST_SHORT } = require(path.join(__dirname, dir, 'assets', 'chatbot-engine.js'));
  const bot = new ChatbotEngine(kb, kw);

  console.log(`\n========================================`);
  console.log(`Checking ${INST_SHORT}`);
  console.log(`========================================`);

  for (const q of comprehensiveQueries) {
    totalTests++;
    const res = bot.match(q);
    if (res.intent !== 'fallback') {
      passedTests++;
    } else {
      fallbackCount++;
      console.warn(`⚠️ Low score / Fallback on "${q}" for ${INST_SHORT}`);
    }
  }
}

console.log('\n========================================');
console.log(`📊 Phase 4 Testing Results:`);
console.log(`Total Queries Evaluated: ${totalTests}`);
console.log(`Directly Matched Intents: ${passedTests} / ${totalTests} (${((passedTests/totalTests)*100).toFixed(1)}%)`);
console.log(`Fallbacks: ${fallbackCount}`);
console.log('========================================\n');
