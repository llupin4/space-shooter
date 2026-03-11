const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting mouse shoot validation test...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  const results = {
    gameLoaded: false,
    clickShoots: false,
    errors: []
  };
  
  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error' && !text.includes('404') && !text.includes('GL Driver')) {
      results.errors.push(text);
    }
  });
  
  console.log('Loading http://localhost:5173...\n');
  
  await page.goto('http://localhost:5173', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  results.gameLoaded = true;
  console.log('✓ Game loaded\n');
  
const getBulletCount = async () => {
    return await page.evaluate(() => {
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (window.game) {
            const scene = window.game.scene.getScene('SpaceShooterScene');
            if (scene && scene.bullets) {
              clearInterval(checkInterval);
              resolve(scene.bullets.children ? scene.bullets.children.size : 0);
            }
          }
        }, 100);
        
        setTimeout(() => {
          clearInterval(checkInterval);
          resolve(0);
        }, 3000);
      });
    });
  };
  
  console.log('--- Testing Mouse Click to Shoot ---');
  
  const bulletsBefore = await getBulletCount();
  console.log(`Bullets before click: ${bulletsBefore}`);
  
  await page.mouse.click(400, 500);
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const bulletsAfterFirst = await getBulletCount();
  console.log(`Bullets after first click: ${bulletsAfterFirst}`);
  
  await page.mouse.click(400, 500);
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const bulletsAfterSecond = await getBulletCount();
  console.log(`Bullets after second click: ${bulletsAfterSecond}`);
  
  if (bulletsAfterSecond > bulletsBefore) {
    results.clickShoots = true;
    console.log(`✓ Click shoots: ${bulletsBefore} -> ${bulletsAfterSecond} bullets`);
  } else {
    console.log(`✗ Click did not shoot: ${bulletsBefore} -> ${bulletsAfterSecond} bullets`);
  }
  
  console.log('\n--- Test Results ---');
  console.log(`Game loaded: ${results.gameLoaded ? '✓' : '✗'}`);
  console.log(`Click shoots: ${results.clickShoots ? '✓' : '✗'}`);
  console.log(`Errors: ${results.errors.length}`);
  
  const passed = results.gameLoaded && results.clickShoots;
  
  console.log(`\n${passed ? '✓ MOUSE SHOOT TEST PASSED' : '✗ MOUSE SHOOT TEST FAILED'}`);
  
  await browser.close();
  
  process.exit(passed ? 0 : 1);
})();
