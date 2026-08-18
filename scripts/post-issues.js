import fs from 'fs';
import path from 'path';

// Automated helper to publish the 5 markdown issue files to GitHub via GitHub API
// Usage: GITHUB_TOKEN=your_personal_access_token node scripts/post-issues.js

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'bytebinders';
const REPO_NAME = 'byteagrox';

if (!GITHUB_TOKEN) {
  console.log('\n❌ GITHUB_TOKEN environment variable not set.');
  console.log('To automatically publish issues via API, run:\n');
  console.log('  GITHUB_TOKEN=ghp_xxxx node scripts/post-issues.js\n');
  process.exit(1);
}

const issuesDir = path.join(process.cwd(), 'docs', 'issues');
const files = fs.readdirSync(issuesDir).filter(f => f.endsWith('.md'));

async function postIssue(file) {
  const content = fs.readFileSync(path.join(issuesDir, file), 'utf8');
  const lines = content.split('\n');
  const title = lines[0].replace(/^#\s*/, '').trim();
  const body = lines.slice(1).join('\n').trim();

  console.log(`Posting: "${title}"...`);

  const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, body }),
  });

  if (response.ok) {
    const data = await response.json();
    console.log(`✅ Success! Created issue #${data.number}: ${data.html_url}`);
  } else {
    const err = await response.text();
    console.error(`❌ Failed to create issue: ${err}`);
  }
}

async function main() {
  for (const file of files) {
    await postIssue(file);
  }
}

main();
