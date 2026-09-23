const http = require('http');
const path = require('path');

// Test the server logic in memory or via launch
const instDir = 'rvpu-north-chatbot';
const serverPath = path.join(__dirname, instDir, 'dashboard', 'server.js');
console.log('Validating server script syntax for:', serverPath);
require(serverPath);

setTimeout(async () => {
  try {
    console.log('Testing GET http://localhost:3001/api/dashboard/stats ...');
    const res = await fetch('http://localhost:3001/api/dashboard/stats');
    const stats = await res.json();
    console.log('✅ Stats response:', stats);

    console.log('Testing POST http://localhost:3001/api/telemetry ...');
    const postRes = await fetch('http://localhost:3001/api/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instituteId: 'north',
        event: 'lead_submitted',
        data: { name: 'Pooja Hegde', phone: '+91 99001 22334', stream: 'Science (PCMB)' }
      })
    });
    const postData = await postRes.json();
    console.log('✅ Telemetry POST response:', postData);

    const leadsRes = await fetch('http://localhost:3001/api/dashboard/leads');
    const leads = await leadsRes.json();
    console.log(`✅ Leads count after ingestion: ${leads.length} leads. First lead:`, leads[0]);

    console.log('\n🎉 Standalone Dashboard API & Dual-Write Sink verified successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  }
}, 1000);
