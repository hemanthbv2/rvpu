const path = require('path');
const fs = require('fs');

const institutes = [
  { id: 'harohalli', name: 'RVPU Harohalli', dir: 'rvpu-harohalli-chatbot' },
  { id: 'ssmrvpu', name: 'SSMRV PU', dir: 'ssmrvpu-chatbot' },
  { id: 'north', name: 'RVPU North', dir: 'rvpu-north-chatbot' },
  { id: 'south', name: 'RVPU South', dir: 'rvpu-south-chatbot' },
  { id: 'ecity', name: 'RVPU E-City', dir: 'rvpu-ecity-chatbot' },
  { id: 'nmkrvpu', name: 'NMKRV PU', dir: 'nmkrvpu-chatbot' },
  { id: 'mysore', name: 'RVPU Mysuru', dir: 'rvpu-mysore-chatbot' }
];

const testQueries = [
  'whether neet is in college',
  'is neet in college',
  'is neet coaching available in this college',
  'do you have neet in college',
  'is there neet coaching here',
  'can I prepare for neet at your college',
  'neet'
];

console.log('Testing NEET inquiries across institutes:\n');

institutes.forEach(inst => {
  const assetsDir = path.join(__dirname, inst.dir, 'assets');
  const kb = JSON.parse(fs.readFileSync(path.join(assetsDir, 'knowledge-base.json'), 'utf8'));
  const kw = JSON.parse(fs.readFileSync(path.join(assetsDir, 'keywords.json'), 'utf8'));
  const { ChatbotEngine } = require(path.join(assetsDir, 'chatbot-engine.js'));

  const bot = new ChatbotEngine(kb, kw);
  console.log(`=== ${inst.name} (${inst.id}) ===`);

  testQueries.forEach(q => {
    const res = bot.match(q);
    const isNeet = res.intent === 'course_neet_ug';
    console.log(`  "${q}" -> Intent: [${res.intent}] (Score: ${res.score}) ${isNeet ? '✅' : '⚠️'}`);
    if (!isNeet) {
      console.log(`     Answer Preview: ${res.answer.substring(0, 100)}...`);
    }
  });
  console.log('');
});
