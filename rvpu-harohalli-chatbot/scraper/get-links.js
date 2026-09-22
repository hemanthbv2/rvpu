const fs = require('fs');

const rawHtml = fs.readFileSync('C:\\Users\\HP\\.gemini\\antigravity-ide\\brain\\e82963c1-d580-4b7f-9f32-da33b16da950\\.system_generated\\steps\\54\\content.md', 'utf8');

const regex = /href="(https:\/\/hrh\.rvpucollege\.edu\.in\/[^"#]+)"/g;
let match;
const links = new Set();
while ((match = regex.exec(rawHtml)) !== null) {
  links.add(match[1]);
}
console.log('Unique links found on Harohalli:');
console.log(Array.from(links));
