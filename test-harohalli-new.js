const path = require('path');
const fs = require('fs');

const { ChatbotEngine, INST_NAME } = require(path.join(__dirname, 'rvpu-harohalli-chatbot', 'assets', 'chatbot-engine.js'));
const kb = JSON.parse(fs.readFileSync(path.join(__dirname, 'rvpu-harohalli-chatbot', 'assets', 'knowledge-base.json'), 'utf8'));
const kw = JSON.parse(fs.readFileSync(path.join(__dirname, 'rvpu-harohalli-chatbot', 'assets', 'keywords.json'), 'utf8'));

const bot = new ChatbotEngine(kb, kw);

const queries = [
  { q: 'princi', expectedIntent: 'principal' },
  { q: 'who is principal', expectedIntent: 'principal' },
  { q: 'principal sir name', expectedIntent: 'principal' },
  { q: 'pcmb', expectedIntent: 'course_pcmb' },
  { q: 'tell me about pcmb combination', expectedIntent: 'course_pcmb' },
  { q: 'pcmc', expectedIntent: 'course_pcmc' },
  { q: 'is computer science pcmc available', expectedIntent: 'course_pcmc' },
  { q: 'bams', expectedIntent: 'course_bams' },
  { q: 'bame', expectedIntent: 'course_bame' },
  { q: 'seba', expectedIntent: 'course_seba' },
  { q: 'our campuses', expectedIntent: 'all_campuses' },
  { q: 'show campuses', expectedIntent: 'all_campuses' },
  { q: 'all rv colleges', expectedIntent: 'all_campuses' },
  { q: 'who are the teachers', expectedIntent: 'faculty' },
  { q: 'is hostel available', expectedIntent: 'hostel_residential' },
  { q: 'admission procedure', expectedIntent: 'admissions_process' }
];

console.log(`🧪 Running Harohalli Dedicated Verification for: ${INST_NAME}`);
let passed = 0;

queries.forEach(({ q, expectedIntent }) => {
  const res = bot.match(q);
  const ok = res.intent === expectedIntent;
  if (ok) passed++;
  console.log(`${ok ? '✅' : '❌'} Q: "${q}" -> Matched: [${res.intent}] (Expected: [${expectedIntent}], Score: ${res.score})`);
});

console.log(`\nResults: ${passed} / ${queries.length} passed (${((passed / queries.length) * 100).toFixed(1)}%)`);
if (passed === queries.length) {
  console.log('🎉 100% SUCCESS! All custom intents and slang queries matched flawlessly!');
}
