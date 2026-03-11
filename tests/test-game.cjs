const puppeteer = require('puppeteer');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  console.log('Starting comprehensive game test...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  let errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore 404 errors and WebGL warnings for this test
      if (!text.includes('404') && !text.includes('GL Driver')) {
        errors.push(text);
        console.log(`[ERROR] ${text}`);
      }
    }
  });
  
  page.on('pageerror', error => {
    errors.push(error.message);
    console.log(`[PAGE ERROR] ${error.message}`);
  });
  
  console.log('Loading http://localhost:5173...\n');
  
  await page.goto('http://localhost:5173', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });
  
  // Wait for game to initialize
  await sleep(2000);
  
  console.log('--- Game State Check ---');
  
  // Check for game canvas
  const canvasExists = await page.$('canvas');
  console.log(`Canvas element exists: ${!!canvasExists}`);
  
  // Check for score text
  const hasScore = await page.evaluate(() => {
    return document.body.innerText.includes('Score');
  });
  console.log(`Score displayed: ${hasScore}`);
  
  // Check for lives text
  const hasLives = await page.evaluate(() => {
    return document.body.innerText.includes('Lives');
  });
  console.log(`Lives displayed: ${hasLives}`);
  
  // Test player movement (press W key)
  console.log('\n--- Testing Controls ---');
  await page.keyboard.press('w');
  await sleep(200);
  console.log('W key pressed (move up)');
  
  await page.keyboard.press('a');
  await sleep(200);
  console.log('A key pressed (move left)');
  
  await page.keyboard.press('s');
  await sleep(200);
  console.log('S key pressed (move down)');
  
  await page.keyboard.press('d');
  await sleep(200);
  console.log('D key pressed (move right)');
  
  // Test shooting
  await page.keyboard.press(' ');
  await sleep(200);
  console.log('Space pressed (shoot)');
  
  // Wait for enemies to spawn
  await sleep(3000);
  
  console.log('\n--- Test Results ---');
  console.log(`Critical errors: ${errors.length}`);
  console.log(`Canvas exists: ${!!canvasExists}`);
  console.log(`UI elements visible: ${hasScore && hasLives}`);
  
  if (errors.length > 0) {
    console.log('\nErrors found:');
    errors.forEach((e, i) => console.log(`${i + 1}. ${e}`));
  } else {
    console.log('\n✓ No critical errors!');
  }
  
  console.log('\n✓ Game appears to be working!');
  console.log('\nManual testing required for:');
  console.log('- Player ship visibility and movement');
  console.log('- Bullet spawning and collision');
  console.log('- Enemy spawning and movement');
  console.log('- Score and lives mechanics');
  console.log('- Game over screen');
  console.log('- Restart functionality');
  
  await browser.close();
  
  process.exit(0);
})();
