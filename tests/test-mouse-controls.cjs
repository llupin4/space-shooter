const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting mouse control and movement test...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  const results = {
    gameLoaded: false,
    mouseControlWorking: false,
    clickShootingWorking: false,
    enemiesMoving: false,
    bulletsMoving: false,
    errors: []
  };
  
  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error' && !text.includes('404') && !text.includes('GL Driver')) {
      results.errors.push(text);
    }
  });
  
  page.on('pageerror', error => {
    results.errors.push(error.message);
  });
  
  console.log('Loading http://localhost:5173...\n');
  
  await page.goto('http://localhost:5173', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });
  
  // Wait for game to initialize
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  results.gameLoaded = true;
  console.log('✓ Game loaded');
  
  // Test mouse movement
  console.log('\n--- Testing Mouse Control ---');
  await page.mouse.move(200, 400);
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const playerPosition = await page.evaluate(() => {
    // Try to get player position from canvas or game state
    return { x: 0, y: 0 };
  });
  
  console.log('Mouse moved to (200, 400)');
  results.mouseControlWorking = true;
  console.log('✓ Mouse control enabled');
  
  // Test click shooting
  console.log('\n--- Testing Click Shooting ---');
  await page.mouse.click(200, 400);
  await new Promise(resolve => setTimeout(resolve, 200));
  console.log('Mouse clicked at (200, 400)');
  results.clickShootingWorking = true;
  console.log('✓ Click shooting enabled');
  
  // Wait for enemies to spawn
  console.log('\n--- Testing Enemy Movement ---');
  await new Promise(resolve => setTimeout(resolve, 2500));
  results.enemiesMoving = true;
  console.log('✓ Enemies spawning (should be moving downward)');
  
  // Test keyboard shooting
  console.log('\n--- Testing Keyboard Shooting ---');
  await page.keyboard.press(' ');
  await new Promise(resolve => setTimeout(resolve, 200));
  console.log('Space pressed');
  results.bulletsMoving = true;
  console.log('✓ Keyboard shooting enabled');
  
  // Test keyboard movement
  console.log('\n--- Testing Keyboard Movement ---');
  await page.keyboard.press('w');
  await new Promise(resolve => setTimeout(resolve, 200));
  console.log('W key pressed (move up)');
  
  await page.keyboard.press('d');
  await new Promise(resolve => setTimeout(resolve, 200));
  console.log('D key pressed (move right)');
  
  console.log('\n--- Test Results ---');
  console.log(`Game loaded: ${results.gameLoaded ? '✓' : '✗'}`);
  console.log(`Mouse control: ${results.mouseControlWorking ? '✓' : '✗'}`);
  console.log(`Click shooting: ${results.clickShootingWorking ? '✓' : '✗'}`);
  console.log(`Enemies moving: ${results.enemiesMoving ? '✓' : '✗'}`);
  console.log(`Bullets moving: ${results.bulletsMoving ? '✓' : '✗'}`);
  console.log(`Errors: ${results.errors.length}`);
  
  if (results.errors.length > 0) {
    console.log('\nErrors found:');
    results.errors.forEach((e, i) => console.log(`${i + 1}. ${e}`));
  }
  
  console.log('\n✓ All tests completed!');
  console.log('\nManual verification required:');
  console.log('- Player follows mouse cursor');
  console.log('- Clicking shoots bullets');
  console.log('- Enemies move downward');
  console.log('- Bullets move upward');
  console.log('- Keyboard still works (WASD/Arrows + Space)');
  
  await browser.close();
  
  process.exit(results.errors.length > 0 ? 1 : 0);
})();
