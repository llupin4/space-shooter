const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting browser test...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Capture console messages
  const errors = [];
  const logs = [];
  
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') {
      errors.push(text);
      console.log(`[ERROR] ${text}`);
    } else {
      logs.push(`${type}: ${text}`);
      console.log(`[${type.toUpperCase()}] ${text}`);
    }
  });
  
  // Capture page errors
  page.on('pageerror', error => {
    errors.push(error.message);
    console.log(`[PAGE ERROR] ${error.message}`);
  });
  
  console.log('\nLoading http://localhost:5173...\n');
  
  await page.goto('http://localhost:5173', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });
  
  console.log('\n--- Test Results ---');
  console.log(`Console errors: ${errors.length}`);
  console.log(`Console logs: ${logs.length}`);
  
  if (errors.length > 0) {
    console.log('\nErrors found:');
    errors.forEach((e, i) => console.log(`${i + 1}. ${e}`));
  } else {
    console.log('\n✓ No console errors!');
  }
  
  await browser.close();
  
  process.exit(errors.length > 0 ? 1 : 0);
})();
