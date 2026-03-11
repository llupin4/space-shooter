const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting enemy spawn test...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  page.on('console', msg => {
    const text = msg.text();
    console.log(`[${msg.type()}] ${text}`);
  });
  
  console.log('Loading http://localhost:5173...\n');
  
  await page.goto('http://localhost:5173', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });
  
  console.log('\nWaiting for enemies to spawn (3 seconds)...\n');
  
  // Wait 3 seconds for at least one enemy to spawn
  await new Promise(resolve => setTimeout(resolve, 3500));
  
  console.log('\n--- Test Complete ---');
  
  await browser.close();
})();
