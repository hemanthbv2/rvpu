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

let totalTests = 0;
let passedTests = 0;

console.log('🧪 Universal Verification Across All 7 RVPU Chatbots:\n');

institutes.forEach(inst => {
  const assetsDir = path.join(__dirname, inst.dir, 'assets');
  const kb = JSON.parse(fs.readFileSync(path.join(assetsDir, 'knowledge-base.json'), 'utf8'));
  const kw = JSON.parse(fs.readFileSync(path.join(assetsDir, 'keywords.json'), 'utf8'));
  const { ChatbotEngine, INST_NAME } = require(path.join(assetsDir, 'chatbot-engine.js'));

  const bot = new ChatbotEngine(kb, kw);
  console.log(`📌 Checking ${INST_NAME}...`);

  // Test 1: Princi query
  totalTests++;
  const princiRes = bot.match('princi');
  const princiOk = princiRes.intent === 'principal' && princiRes.answer.includes(inst.expectedPrincipal);
  if (princiOk) passedTests++;
  console.log(`  ${princiOk ? '✅' : '❌'} 'princi' -> [${princiRes.intent}], mentions ${inst.expectedPrincipal}`);

  // Test 2: Our Campuses query
  totalTests++;
  const campusesRes = bot.match('our campuses');
  const campusesOk = campusesRes.intent === 'all_campuses' && campusesRes.campusCards && campusesRes.campusCards.length === 7;
  if (campusesOk) passedTests++;
  console.log(`  ${campusesOk ? '✅' : '❌'} 'our campuses' -> [${campusesRes.intent}], ${campusesRes.campusCards ? campusesRes.campusCards.length : 0} cards returned`);

  // Test 3: PCMB course query
  totalTests++;
  const pcmbRes = bot.match('pcmb');
  const pcmbOk = pcmbRes.intent === 'course_pcmb';
  if (pcmbOk) passedTests++;
  console.log(`  ${pcmbOk ? '✅' : '❌'} 'pcmb' -> [${pcmbRes.intent}]`);

  // Test 4: PCMC course query
  totalTests++;
  const pcmcRes = bot.match('pcmc');
  const pcmcOk = pcmcRes.intent === 'course_pcmc';
  if (pcmcOk) passedTests++;
  console.log(`  ${pcmcOk ? '✅' : '❌'} 'pcmc' -> [${pcmcRes.intent}]`);

  // Test 5: SEBA course query
  totalTests++;
  const sebaRes = bot.match('seba');
  const sebaOk = sebaRes.intent === 'course_seba';
  if (sebaOk) passedTests++;
  console.log(`  ${sebaOk ? '✅' : '❌'} 'seba' -> [${sebaRes.intent}]`);

  console.log('');
});

console.log(`========================================`);
console.log(`Total Checks: ${totalTests} | Passed: ${passedTests} (${((passedTests / totalTests) * 100).toFixed(1)}%)`);
if (passedTests === totalTests) {
  console.log('🎉 100% SUCCESS! All 7 RVPU chatbots passed all verification checks!');
}
