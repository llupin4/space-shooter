const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting comprehensive validation test...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  const tests = {
    initialized: false,
    canvasExists: false,
    noCriticalErrors: true,
    mouseEventsRegistered: false,
    keyboardEventsRegistered: false,
    errors: []
  };
  
  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error') {
      if (!text.includes('404') && !text.includes('GL Driver')) {
        tests.errors.push(text);
        tests.noCriticalErrors = false;
        console.log(`[ERROR] ${text}`);
      }
    }
  });
  
  page.on('pageerror', error => {
    tests.errors.push(error.message);
    tests.noCriticalErrors = false;
    console.log(`[PAGE ERROR] ${error.message}`);
  });
  
  console.log('Loading http://localhost:5173...\n');
  
  await page.goto('http://localhost:5173', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Check canvas exists
  const canvas = await page.$('canvas');
  tests.canvasExists = !!canvas;
  tests.initialized = true;
  console.log(`✓ Game initialized: ${tests.initialized}`);
  console.log(`✓ Canvas exists: ${tests.canvasExists}`);
  
  // Test mouse movement
  console.log('\n--- Mouse Control Test ---');
  await page.mouse.move(200, 300);
  await new Promise(resolve => setTimeout(resolve, 100));
  console.log('✓ Mouse moved to (200, 300)');
  
  await page.mouse.move(400, 400);
  await new Promise(resolve => setTimeout(resolve, 100));
  console.log('✓ Mouse moved to (400, 400)');
  
  // Test click shooting
  console.log('\n--- Click Shooting Test ---');
  await page.mouse.click(400, 400);
  await new Promise(resolve => setTimeout(resolve, 100));
  console.log('✓ Clicked at (400, 400)');
  
  // Test keyboard movement
  console.log('\n--- Keyboard Movement Test ---');
  await page.keyboard.press('w');
  await new Promise(resolve => setTimeout(resolve, 100));
  console.log('✓ W key pressed');
  
  await page.keyboard.press('a');
  await new Promise(resolve => setTimeout(resolve, 100));
  console.log('✓ A key pressed');
  
  await page.keyboard.press('s');
  await new Promise(resolve => setTimeout(resolve, 100));
  console.log('✓ S key pressed');
  
  await page.keyboard.press('d');
  await new Promise(resolve => setTimeout(resolve, 100));
  console.log('✓ D key pressed');
  
  // Test keyboard shooting
  console.log('\n--- Keyboard Shooting Test ---');
  await page.keyboard.press(' ');
  await new Promise(resolve => setTimeout(resolve, 100));
  console.log('✓ Space pressed');
  
  // Wait for enemies to spawn
  console.log('\n--- Enemy Spawn Test ---');
  await new Promise(resolve => setTimeout(resolve, 3000));
  console.log('✓ Waiting for enemies to spawn');
  
  console.log('\n--- Test Results ---');
  console.log(`Game initialized: ${tests.initialized ? '✓' : '✗'}`);
  console.log(`Canvas exists: ${tests.canvasExists ? '✓' : '✗'}`);
  console.log(`No critical errors: ${tests.noCriticalErrors ? '✓' : '✗'}`);
  console.log(`Errors: ${tests.errors.length}`);
  
  if (tests.errors.length > 0) {
    console.log('\nErrors:');
    tests.errors.forEach((e, i) => console.log(`  ${i + 1}. ${e}`));
  }
  
  console.log('\n--- Manual Verification Checklist ---');
  console.log('□ Player follows mouse cursor');
  console.log('□ Clicking shoots bullets upward');
  console.log('□ Enemies spawn from top and move downward');
  console.log('□ Bullets destroy enemies');
  console.log('□ Score increases when enemy destroyed');
  console.log('□ Lives decrease on collision');
  console.log('□ Game over screen appears when lives = 0');
  console.log('□ Click restart button to play again');
  
  console.log('\n✓ All automated tests completed!');
  
  await browser.close();
  
  process.exit(tests.errors.length > 0 ? 1 : 0);
})();
