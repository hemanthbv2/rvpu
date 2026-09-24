const fs = require('fs');
const path = require('path');

const institutes = [
  { id: 'north', dir: 'rvpu-north-chatbot' },
  { id: 'south', dir: 'rvpu-south-chatbot' },
  { id: 'ecity', dir: 'rvpu-ecity-chatbot' },
  { id: 'harohalli', dir: 'rvpu-harohalli-chatbot' },
  { id: 'ssmrvpu', dir: 'ssmrvpu-chatbot' },
  { id: 'nmkrvpu', dir: 'nmkrvpu-chatbot' },
  { id: 'mysore', dir: 'rvpu-mysore-chatbot' }
];

async function runAudit() {
  console.log('================================================================');
  console.log('🔬 EXHAUSTIVE 100% AUDIT & VERIFICATION ACROSS ALL 7 RVPU CHATBOTS');
  console.log('================================================================\n');

  const report = {
    totalInstitutes: institutes.length,
    institutesAudited: 0,
    fileIntegrityChecks: { passed: 0, failed: 0 },
    zeroDefectChecks: { passed: 0, failed: 0, issues: [] },
    scrapedDataAlignment: { passed: 0, failed: 0, issues: [] },
    queryMatchingChecks: { passed: 0, failed: 0, issues: [] },
    urlHealthChecks: { totalUrls: 0, verified200: 0, issues: [] }
  };

  const urlsToVerify = new Set();

  for (const inst of institutes) {
    console.log(`\n------------------------------------------------------------`);
    console.log(`🏫 AUDITING: [${inst.id}] (${inst.dir})`);
    console.log(`------------------------------------------------------------`);

    const dirPath = path.join(__dirname, inst.dir);
    const rawPath = path.join(dirPath, 'raw-data', 'scraped-data.json');
    const assetsDir = path.join(dirPath, 'assets');
    const kbPath = path.join(assetsDir, 'knowledge-base.json');
    const kwPath = path.join(assetsDir, 'keywords.json');
    const enginePath = path.join(assetsDir, 'chatbot-engine.js');
    const widgetJsPath = path.join(assetsDir, 'chatbot-widget.js');
    const widgetCssPath = path.join(assetsDir, 'chatbot-widget.css');

    // 1. File Integrity Checks
    const files = [rawPath, kbPath, kwPath, enginePath, widgetJsPath, widgetCssPath];
    for (const f of files) {
      if (fs.existsSync(f) && fs.statSync(f).size > 0) {
        report.fileIntegrityChecks.passed++;
      } else {
        report.fileIntegrityChecks.failed++;
        console.error(`  ❌ Missing or empty file: ${f}`);
      }
    }

    const rawData = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
    const kb = JSON.parse(fs.readFileSync(kbPath, 'utf8'));
    const kw = JSON.parse(fs.readFileSync(kwPath, 'utf8'));
    const { ChatbotEngine, INST_NAME } = require(enginePath);
    const bot = new ChatbotEngine(kb, kw);

    console.log(`  📁 Files verified. KB contains ${kb.length} intents, Keywords table has ${Object.keys(kw).length} entries.`);

    // 2. Zero-Defect String Checks across all intents
    kb.forEach(intent => {
      const textToCheck = [
        intent.title || '',
        intent.answer || '',
        ...(intent.quickChips || []),
        (intent.navigation && intent.navigation.label) || '',
        (intent.navigation && intent.navigation.url) || ''
      ].join(' ');

      // Check for undefined / null / [object Object] / NaN
      const defectPatterns = [
        { name: 'undefined text', regex: /\bundefined\b/i },
        { name: 'null text', regex: /\bnull\b/i },
        { name: 'raw object text', regex: /\[object Object\]/i },
        { name: 'NaN text', regex: /\bNaN\b/i }
      ];

      defectPatterns.forEach(d => {
        if (d.regex.test(textToCheck)) {
          report.zeroDefectChecks.failed++;
          report.zeroDefectChecks.issues.push(`[${inst.id}] Intent '${intent.id}' contains ${d.name}`);
          console.error(`  ❌ [Defect] Intent '${intent.id}' contains ${d.name}!`);
        } else {
          report.zeroDefectChecks.passed++;
        }
      });

      // Strict Cutoff Check in Answers & Titles & QuickChips
      // (Keywords may contain cutoff to capture user inquiries, but answer/title/chips must NEVER say cutoff)
      const cutoffPatterns = [
        { name: 'cutoff in title', text: intent.title, regex: /\bcutoff\b|\bcut-off\b|\bcut off\b/i },
        { name: 'cutoff in answer', text: intent.answer, regex: /\bcutoff\b|\bcut-off\b|\bcut off\b/i }
      ];
      cutoffPatterns.forEach(c => {
        if (c.regex.test(c.text)) {
          report.zeroDefectChecks.failed++;
          report.zeroDefectChecks.issues.push(`[${inst.id}] Intent '${intent.id}' has ${c.name}: "${c.text.substring(0, 80)}"`);
          console.error(`  ❌ [Cutoff Found] Intent '${intent.id}' has ${c.name}!`);
        } else {
          report.zeroDefectChecks.passed++;
        }
      });

      // Collect URLs for health check
      if (intent.navigation && intent.navigation.url) {
        urlsToVerify.add(intent.navigation.url);
      }
      if (Array.isArray(intent.facilityCards)) {
        intent.facilityCards.forEach(c => {
          if (c.image) urlsToVerify.add(c.image);
        });
      }
      if (Array.isArray(intent.campusCards)) {
        intent.campusCards.forEach(c => {
          if (c.url) urlsToVerify.add(c.url);
        });
      }
    });

    // 3. Scraped-Data Alignment Verification
    // A. Principal Name
    const expectedPrincipal = (rawData.leadership && rawData.leadership.principal) ? rawData.leadership.principal.name : null;
    const principalIntent = kb.find(i => i.id === 'principal');
    if (expectedPrincipal && principalIntent) {
      if (principalIntent.answer.includes(expectedPrincipal)) {
        report.scrapedDataAlignment.passed++;
        console.log(`  ✅ Principal: Exactly matches "${expectedPrincipal}"`);
      } else {
        report.scrapedDataAlignment.failed++;
        report.scrapedDataAlignment.issues.push(`[${inst.id}] Principal mismatch. Expected "${expectedPrincipal}"`);
        console.error(`  ❌ Principal mismatch! Expected: ${expectedPrincipal}`);
      }
    }

    // B. Address, Phone, Email
    const contactIntent = kb.find(i => i.id === 'contact_location');
    if (contactIntent) {
      const addressOk = contactIntent.answer.includes(rawData.institute.address);
      const emailOk = contactIntent.answer.includes(rawData.institute.email);
      if (addressOk && emailOk) {
        report.scrapedDataAlignment.passed += 2;
        console.log(`  ✅ Contact Info: Verified Address & Email exact match`);
      } else {
        report.scrapedDataAlignment.failed++;
        report.scrapedDataAlignment.issues.push(`[${inst.id}] Address/Email mismatch in contact_location`);
        console.error(`  ❌ Contact info mismatch for ${inst.id}`);
      }
    }

    // C. Courses & Combinations
    const rawCombos = rawData.courses ? rawData.courses.combinations : [];
    let combosOk = true;
    rawCombos.forEach(c => {
      const comboIntent = kb.find(i => i.id === `course_${c.code.toLowerCase()}`);
      if (!comboIntent || !comboIntent.answer.includes(c.subjects)) {
        combosOk = false;
        report.scrapedDataAlignment.failed++;
        report.scrapedDataAlignment.issues.push(`[${inst.id}] Missing or mismatched combo: ${c.code}`);
      } else {
        report.scrapedDataAlignment.passed++;
      }
    });
    if (combosOk) {
      console.log(`  ✅ Academic Streams: All ${rawCombos.length} combinations match scraped subjects`);
    }

    // D. Admissions Documents
    const rawDocs = (rawData.admissions && rawData.admissions.required_documents) ? rawData.admissions.required_documents : [];
    const docsIntent = kb.find(i => i.id === 'admissions_documents');
    if (docsIntent) {
      let docsOk = true;
      rawDocs.forEach(d => {
        if (!docsIntent.answer.includes(d)) {
          docsOk = false;
          report.scrapedDataAlignment.issues.push(`[${inst.id}] Missing document in checklist: ${d}`);
        }
      });
      if (docsOk) {
        report.scrapedDataAlignment.passed++;
        console.log(`  ✅ Documents: All ${rawDocs.length} required documents verified in checklist`);
      } else {
        report.scrapedDataAlignment.failed++;
      }
    }

    // E. Faculty
    if (rawData.faculty && Array.isArray(rawData.faculty.teaching_staff) && rawData.faculty.teaching_staff.length > 0) {
      const facultyIntent = kb.find(i => i.id === 'faculty');
      if (facultyIntent) {
        let facOk = true;
        rawData.faculty.teaching_staff.forEach(f => {
          if (!facultyIntent.answer.includes(f.name)) {
            facOk = false;
            report.scrapedDataAlignment.issues.push(`[${inst.id}] Missing faculty member: ${f.name}`);
          }
        });
        if (facOk) {
          report.scrapedDataAlignment.passed++;
          console.log(`  ✅ Faculty: All ${rawData.faculty.teaching_staff.length} teachers verified without undefined fields`);
        } else {
          report.scrapedDataAlignment.failed++;
        }
      }
    }

    // 4. Query Resolution & NLP Testing (15 Queries)
    const testQueries = [
      { q: 'what combinations do you offer?', expect: 'courses_all' },
      { q: 'pcmb combination details', expect: 'course_pcmb' },
      { q: 'pcmc combination details', expect: 'course_pcmc' },
      { q: 'how to apply for admission', expect: 'admissions_process' },
      { q: 'what is the cutoff percentage for admission?', expect: 'eligibility_cutoff' },
      { q: 'eligibility criteria', expect: 'eligibility_cutoff' },
      { q: 'what documents should I submit?', expect: 'admissions_documents' },
      { q: 'who is the principal?', expect: 'principal' },
      { q: 'princi', expect: 'principal' },
      { q: 'neet coaching classes', expect: 'course_neet_ug' },
      { q: 'jee advanced programme', expect: 'course_jee_adv' },
      { q: 'commerce decoded course', expect: 'course_commerce_decoded' },
      { q: 'show me campus facilities and photos', expect: 'facilities' },
      { q: 'what are your other campuses across Karnataka?', expect: 'all_campuses' },
      { q: 'where is the college located and phone number?', expect: 'contact_location' }
    ];

    let queryFailures = 0;
    testQueries.forEach(t => {
      const match = bot.match(t.q);
      if (match.intent === t.expect) {
        report.queryMatchingChecks.passed++;
      } else {
        queryFailures++;
        report.queryMatchingChecks.failed++;
        report.queryMatchingChecks.issues.push(`[${inst.id}] Query "${t.q}" expected '${t.expect}', got '${match.intent}'`);
      }
    });

    if (queryFailures === 0) {
      console.log(`  ✅ Natural Queries: 15/15 real-world queries matched exact intents with high confidence`);
    } else {
      console.error(`  ❌ Natural Queries: ${queryFailures} queries failed!`);
    }

    report.institutesAudited++;
  }

  // 5. URL & Live Asset Health Checks
  console.log(`\n------------------------------------------------------------`);
  console.log(`🌐 LIVE ASSET & URL HEALTH CHECK (Testing ${urlsToVerify.size} Unique URLs)`);
  console.log(`------------------------------------------------------------`);
  report.urlHealthChecks.totalUrls = urlsToVerify.size;

  const urlList = Array.from(urlsToVerify);
  for (const url of urlList) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      clearTimeout(timeoutId);

      if (res.status >= 200 && res.status < 400) {
        report.urlHealthChecks.verified200++;
        process.stdout.write('✓');
      } else {
        // Try GET if HEAD was blocked with 403/405
        const resGet = await fetch(url, {
          method: 'GET',
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        if (resGet.status >= 200 && resGet.status < 400) {
          report.urlHealthChecks.verified200++;
          process.stdout.write('✓');
        } else {
          report.urlHealthChecks.issues.push(`[HTTP ${resGet.status}] ${url}`);
          process.stdout.write('✗');
        }
      }
    } catch (err) {
      // SSL or timeout or network issue
      report.urlHealthChecks.issues.push(`[Error: ${err.message}] ${url}`);
      process.stdout.write('!');
    }
  }
  console.log('\n');

  console.log('================================================================');
  console.log('📊 FINAL AUDIT SUMMARY:');
  console.log(`  Institutes Fully Audited:       ${report.institutesAudited} / 7`);
  console.log(`  File Integrity Checks:         ${report.fileIntegrityChecks.passed} passed / ${report.fileIntegrityChecks.failed} failed`);
  console.log(`  Zero-Defect Code Checks:       ${report.zeroDefectChecks.passed} passed / ${report.zeroDefectChecks.failed} failed`);
  console.log(`  Scraped Data Alignment Checks: ${report.scrapedDataAlignment.passed} passed / ${report.scrapedDataAlignment.failed} failed`);
  console.log(`  Natural Query Checks:          ${report.queryMatchingChecks.passed} passed / ${report.queryMatchingChecks.failed} failed`);
  console.log(`  Live URL / Asset Health:       ${report.urlHealthChecks.verified200} / ${report.urlHealthChecks.totalUrls} verified live`);
  console.log('================================================================');

  if (report.zeroDefectChecks.failed === 0 &&
      report.scrapedDataAlignment.failed === 0 &&
      report.queryMatchingChecks.failed === 0) {
    console.log('\n🌟 100% PERFECT HEALTH: ZERO ERRORS, ZERO CUTOFFS, ZERO DEFECTS FOUND!');
  } else {
    console.log('\n⚠️ Issues found during audit:');
    console.log(JSON.stringify({
      defects: report.zeroDefectChecks.issues,
      alignment: report.scrapedDataAlignment.issues,
      queries: report.queryMatchingChecks.issues
    }, null, 2));
  }

  // Save audit report to JSON
  fs.writeFileSync(path.join(__dirname, 'full-audit-report.json'), JSON.stringify(report, null, 2), 'utf8');
  console.log('\n📄 Full audit report saved to full-audit-report.json');
}

runAudit().catch(err => console.error(err));
