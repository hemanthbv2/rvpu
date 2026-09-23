const fs = require('fs');
const path = require('path');

const DASHBOARD_DIR = 'D:\\hemanth bv\\Dashboard';
const TEMPLATE_DIR = path.join(DASHBOARD_DIR, 'public', 'rvcn-dashboard');
const PUBLIC_DIR = path.join(DASHBOARD_DIR, 'public');
const RVPU_DIR = 'D:\\hemanth bv\\RVPU';

const institutes = [
  {
    id: 'rvpu-north',
    folder: 'rvpu-north-chatbot',
    name: 'RV PU College North',
    shortName: 'RVPU North',
    initial: 'N',
    color: '#E30613',
    glow: 'rgba(227, 6, 19, 0.4)',
    key: 'rvpu_north_key_12345',
    port: 3001
  },
  {
    id: 'rvpu-south',
    folder: 'rvpu-south-chatbot',
    name: 'RV PU College South',
    shortName: 'RVPU South',
    initial: 'S',
    color: '#8B0000',
    glow: 'rgba(139, 0, 0, 0.4)',
    key: 'rvpu_south_key_12345',
    port: 3002
  },
  {
    id: 'rvpu-ecity',
    folder: 'rvpu-ecity-chatbot',
    name: 'RV PU College Electronic City',
    shortName: 'RVPU E-City',
    initial: 'E',
    color: '#0B2545',
    glow: 'rgba(11, 37, 69, 0.4)',
    key: 'rvpu_ecity_key_12345',
    port: 3003
  },
  {
    id: 'rvpu-harohalli',
    folder: 'rvpu-harohalli-chatbot',
    name: 'RV PU College Harohalli',
    shortName: 'RVPU Harohalli',
    initial: 'H',
    color: '#C8102E',
    glow: 'rgba(200, 16, 46, 0.4)',
    key: 'rvpu_harohalli_key_12345',
    port: 3004
  },
  {
    id: 'ssmrvpu',
    folder: 'ssmrvpu-chatbot',
    name: 'SSMRV PU College',
    shortName: 'SSMRV PU',
    initial: 'S',
    color: '#7A0000',
    glow: 'rgba(122, 0, 0, 0.4)',
    key: 'ssmrvpu_key_12345',
    port: 3006
  },
  {
    id: 'rvpu-mysore',
    folder: 'rvpu-mysore-chatbot',
    name: 'RV PU College Mysuru',
    shortName: 'RVPU Mysuru',
    initial: 'M',
    color: '#E30613',
    glow: 'rgba(227, 6, 19, 0.4)',
    key: 'rvpu_mysore_key_12345',
    port: 3005
  },
  {
    id: 'nmkrvpu',
    folder: 'nmkrvpu-chatbot',
    name: 'NMKRV PU College for Women',
    shortName: 'NMKRV PU',
    initial: 'W',
    color: '#EE9B54',
    glow: 'rgba(238, 155, 84, 0.4)',
    key: 'nmkrvpu_key_12345',
    port: 3007
  }
];

const filesToProcess = ['index.html', 'analytics.html', 'interactions.html', 'leads.html', 'sessions.html'];

console.log('=== Generating Dashboards for 7 RVPU Institutes ===');

institutes.forEach(inst => {
  const destDir = path.join(PUBLIC_DIR, `${inst.id}-dashboard`);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const rvpuDestDir = path.join(RVPU_DIR, inst.folder, 'dashboard', 'public');
  if (!fs.existsSync(rvpuDestDir)) {
    fs.mkdirSync(rvpuDestDir, { recursive: true });
  }

  filesToProcess.forEach(file => {
    const srcFile = path.join(TEMPLATE_DIR, file);
    if (!fs.existsSync(srcFile)) {
      console.warn(`Warning: Template file not found: ${srcFile}`);
      return;
    }

    let content = fs.readFileSync(srcFile, 'utf8');

    // 1. Replace Colors & Styling
    content = content.replace(/--primary:\s*#[A-Fa-f0-9]{3,6};/g, `--primary: ${inst.color};`);
    content = content.replace(/--primary-glow:\s*rgba\([^)]+\);/g, `--primary-glow: ${inst.glow};`);
    content = content.replace(/background:\s*#E31E24/g, `background: ${inst.color}`);
    content = content.replace(/rgba\(227,\s*30,\s*36,\s*0\.4\)/g, inst.glow);
    content = content.replace(/rgba\(227,\s*30,\s*36,\s*0\.08\)/g, inst.glow.replace('0.4', '0.08'));

    // 2. Replace Institute ID in API endpoints
    content = content.replace(/instituteId=rvcn/g, `instituteId=${inst.id}`);
    content = content.replace(/instituteId=rvghs/g, `instituteId=${inst.id}`);

    // 3. Replace Titles and Branding
    content = content.replace(/RVCN Chatbot\s+Command Center/g, `${inst.shortName} Command Center`);
    content = content.replace(/Analytics\s+Command Center/g, `${inst.shortName} Analytics`);
    content = content.replace(/Interactions\s+Command Center/g, `${inst.shortName} Interactions`);
    content = content.replace(/Leads\s+Command Center/g, `${inst.shortName} Leads`);
    content = content.replace(/Sessions\s+Command Center/g, `${inst.shortName} Sessions`);
    content = content.replace(/RV College of Nursing/g, inst.name);
    content = content.replace(/RVCN/g, inst.shortName);

    // 4. Replace Logo box letter
    content = content.replace(/<div class="logo-box">R<\/div>/g, `<div class="logo-box">${inst.initial}</div>`);
    content = content.replace(/<div class="logo-box">RVCN<\/div>/g, `<div class="logo-box">${inst.initial}</div>`);

    // 5. Replace Export Filenames
    content = content.replace(/RVCN_chatbot_logs_/g, `${inst.id}_chatbot_logs_`);
    content = content.replace(/RVCN_Analytics_/g, `${inst.id}_Analytics_`);

    // 6. Token redirect check gracefully handles local/preview mode
    content = content.replace(
      /if \(!token\) window\.location\.href = '\/';/g,
      `// Graceful auth check: allow preview mode or master login
        if (!token && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            window.location.href = '/';
        }`
    );

    // 7. Ensure Back to Master navigation button exists
    const backBtn = `
        <div style="margin-top: auto; padding-bottom: 20px;">
            <a href="/" style="display:flex; align-items:center; gap:10px; padding:12px; color:var(--text); text-decoration:none; background:var(--primary); border-radius:8px; font-size:14px; font-weight:600; justify-content:center; transition:0.2s;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                Master Portal
            </a>
        </div>`;

    if (!content.includes('Master Portal') && !content.includes('Back to Master')) {
      if (content.includes('<div class="sidebar-footer">')) {
        content = content.replace('<div class="sidebar-footer">', backBtn + '<div class="sidebar-footer">');
      } else if (content.includes('<div class="sf">')) {
        content = content.replace('<div class="sf">', backBtn + '<div class="sf">');
      }
    }

    // Write to central Dashboard public
    fs.writeFileSync(path.join(destDir, file), content, 'utf8');

    // Write to RVPU individual chatbot folder
    fs.writeFileSync(path.join(rvpuDestDir, file), content, 'utf8');
  });

  console.log(`✓ Created 5-page dashboard for ${inst.name} (${inst.id}) in both locations`);
});

console.log('=== All 7 Dashboards Successfully Generated! ===');
