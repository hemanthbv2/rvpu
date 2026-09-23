const fs = require('fs');
const path = require('path');

const SERVER_FILE = 'D:\\hemanth bv\\Dashboard\\server.js';
const INDEX_FILE = 'D:\\hemanth bv\\Dashboard\\public\\index.html';

// 1. Update server.js
let serverCode = fs.readFileSync(SERVER_FILE, 'utf8');

// A. Update setup institutes list
const institutesConfig = `        const institutes = [
            { id: 'rvcn', name: 'RV College of Nursing', key: 'rvcn_key_12345' },
            { id: 'rvce', name: 'RV College of Engineering', key: 'rvce_key_12345' },
            { id: 'rvps', name: 'RV Public School', key: 'rvps_key_12345' },
            { id: 'rvghs', name: 'RV Girls High School', key: 'rvghs_key_12345' },
            { id: 'rvpu-north', name: 'RV PU College North', key: 'rvpu_north_key_12345' },
            { id: 'rvpu-south', name: 'RV PU College South', key: 'rvpu_south_key_12345' },
            { id: 'rvpu-ecity', name: 'RV PU College Electronic City', key: 'rvpu_ecity_key_12345' },
            { id: 'rvpu-harohalli', name: 'RV PU College Harohalli', key: 'rvpu_harohalli_key_12345' },
            { id: 'ssmrvpu', name: 'SSMRV PU College', key: 'ssmrvpu_key_12345' },
            { id: 'rvpu-mysore', name: 'RV PU College Mysuru', key: 'rvpu_mysore_key_12345' },
            { id: 'nmkrvpu', name: 'NMKRV PU College for Women', key: 'nmkrvpu_key_12345' }
        ];`;

serverCode = serverCode.replace(/const institutes = \[\s*\{ id: 'rvcn'[\s\S]*?\{ id: 'rvghs', name: 'RV Girls High School', key: 'rvghs_key_12345' \}\s*\];/m, institutesConfig);

// B. Update seed response message
serverCode = serverCode.replace(
  "res.json({ message: 'Seed data generated successfully for all 5 institutes.' });",
  "res.json({ message: 'Seed data generated successfully for all 11 institutes (including all 7 RVPU campuses).' });"
);

// C. Update school email regex
serverCode = serverCode.replace(
  "/@(rvei\\.edu\\.in|rvcn\\.edu\\.in|rvce\\.edu\\.in|rvghs\\.edu\\.in|rvps\\.edu\\.in)/i",
  "/@(rvei\\.edu\\.in|rvcn\\.edu\\.in|rvce\\.edu\\.in|rvghs\\.edu\\.in|rvps\\.edu\\.in|rvpucollege\\.edu\\.in|ssmrv\\.edu\\.in|nmkrv\\.edu\\.in)/i"
);

// D. Add /api/telemetry endpoint if not already added
if (!serverCode.includes("app.post('/api/telemetry'")) {
  const telemetryRoute = `
// 2.1 Direct Telemetry Route (For real-time widget stream dual-write)
app.post('/api/telemetry', async (req, res) => {
    try {
        const { instituteId, instituteName, event, data, timestamp, sessionId } = req.body;
        const targetInst = instituteId || 'rvpu-north';
        const sessId = sessionId || ('sess_' + Date.now());

        const TenantInteraction = getTenantModel(targetInst, 'Interaction');
        const interactionDoc = {
            instituteId: targetInst,
            sessionId: sessId,
            eventType: event || 'interaction',
            queryText: data ? (data.query || data.message || (typeof data === 'string' ? data : '')) : '',
            metaData: data || {},
            createdAt: timestamp ? new Date(timestamp) : new Date()
        };
        await TenantInteraction.create(interactionDoc);

        // Auto capture leads
        if (event === 'lead_submitted' || (data && (data.phone || data.email || data.leadData))) {
            const TenantLead = getTenantModel(targetInst, 'Lead');
            await TenantLead.create({
                instituteId: targetInst,
                sessionId: sessId,
                leadData: data.leadData || data,
                createdAt: timestamp ? new Date(timestamp) : new Date()
            });
        }

        res.json({ success: true, message: 'Telemetry successfully logged to Atlas' });
    } catch (err) {
        console.error('Telemetry ingestion error:', err.message);
        res.status(500).json({ error: err.message });
    }
});
`;

  serverCode = serverCode.replace(
    "// 3. Dashboard Data Routes (Protected)",
    telemetryRoute + "\n// 3. Dashboard Data Routes (Protected)"
  );
}

fs.writeFileSync(SERVER_FILE, serverCode, 'utf8');
console.log('✓ Successfully updated D:\\hemanth bv\\Dashboard\\server.js');

// 2. Update D:\hemanth bv\Dashboard\public\index.html colors map
let indexCode = fs.readFileSync(INDEX_FILE, 'utf8');

const colorsMap = `            const colors = {
                'rvcn': '#6366f1',
                'rvghs': '#10b981',
                'rvce': '#f59e0b',
                'rvps': '#ec4899',
                'rvpu-north': '#E30613',
                'rvpu-south': '#8B0000',
                'rvpu-ecity': '#0B2545',
                'rvpu-harohalli': '#C8102E',
                'ssmrvpu': '#7A0000',
                'rvpu-mysore': '#E30613',
                'nmkrvpu': '#EE9B54'
            };`;

indexCode = indexCode.replace(/const colors = \{\s*'rvcn':[\s\S]*?'rvps': '#ec4899'\s*\};/m, colorsMap);

fs.writeFileSync(INDEX_FILE, indexCode, 'utf8');
console.log('✓ Successfully updated D:\\hemanth bv\\Dashboard\\public\\index.html');
