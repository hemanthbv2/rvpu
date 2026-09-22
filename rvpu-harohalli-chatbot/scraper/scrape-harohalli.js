const fs = require('fs');
const path = require('path');

const urls = [
  { key: 'home', url: 'https://hrh.rvpucollege.edu.in/home/' },
  { key: 'about', url: 'https://hrh.rvpucollege.edu.in/about-us/about_college/' },
  { key: 'board', url: 'https://hrh.rvpucollege.edu.in/about-us/board_of_management/' },
  { key: 'courses', url: 'https://hrh.rvpucollege.edu.in/academics/our_courses/' },
  { key: 'faculty', url: 'https://hrh.rvpucollege.edu.in/academics/faculty/' },
  { key: 'admissions', url: 'https://hrh.rvpucollege.edu.in/admissions/' },
  { key: 'facilities', url: 'https://hrh.rvpucollege.edu.in/facilities/' },
  { key: 'contact', url: 'https://hrh.rvpucollege.edu.in/contact_us/' },
  { key: 'principal', url: 'https://hrh.rvpucollege.edu.in/mr-umesh-k-n/' }
];

function cleanHtml(html) {
  // Strip scripts, styles, head, footer
  let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
                 .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
                 .replace(/<[^>]+>/g, ' ')
                 .replace(/&nbsp;/g, ' ')
                 .replace(/&amp;/g, '&')
                 .replace(/&#8211;/g, '-')
                 .replace(/&#8217;/g, "'")
                 .replace(/\s+/g, ' ')
                 .trim();
  return text;
}

async function run() {
  console.log('Fetching Harohalli pages...');
  const pageContents = {};

  for (const item of urls) {
    try {
      console.log(`Fetching ${item.key}: ${item.url}`);
      const res = await fetch(item.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      const html = await res.text();
      pageContents[item.key] = {
        url: item.url,
        text: cleanHtml(html),
        rawHtmlLength: html.length
      };
      console.log(`✓ Fetched ${item.key} (${pageContents[item.key].text.length} chars clean text)`);
    } catch (err) {
      console.error(`Error fetching ${item.url}:`, err.message);
    }
  }

  // Save intermediate raw page dumps
  const rawDumpPath = path.join(__dirname, '..', 'raw-data', 'page-dumps.json');
  fs.writeFileSync(rawDumpPath, JSON.stringify(pageContents, null, 2), 'utf8');
  console.log('Saved page dumps to', rawDumpPath);
}

run();
