const path = require('path');
const fs = require('fs');

console.log('Validating all 7 RVPU generated dashboards...');

const baseDir = 'D:\\hemanth bv\\Dashboard\\public';
const institutes = [
  'rvpu-north',
  'rvpu-south',
  'rvpu-ecity',
  'rvpu-harohalli',
  'ssmrvpu',
  'rvpu-mysore',
  'nmkrvpu'
];

const requiredFiles = [
  'index.html',
  'analytics.html',
  'interactions.html',
  'leads.html',
  'sessions.html'
];

let allValid = true;

institutes.forEach(id => {
  const dir = path.join(baseDir, `${id}-dashboard`);
  if (!fs.existsSync(dir)) {
    console.error(`Missing directory: ${dir}`);
    allValid = false;
    return;
  }
  requiredFiles.forEach(file => {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) {
      console.error(`Missing file: ${filePath}`);
      allValid = false;
    } else {
      const content = fs.readFileSync(filePath, 'utf8');
      if (!content.includes(id)) {
        console.warn(`File ${filePath} may not contain instituteId ${id}`);
      }
    }
  });
});

if (allValid) {
  console.log('✅ ALL 35 DASHBOARD FILES VALIDATED SUCCESSFULLY IN D:\\hemanth bv\\Dashboard\\public!');
} else {
  console.error('❌ Validation failed.');
  process.exit(1);
}
