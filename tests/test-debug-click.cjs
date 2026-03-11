const puppeteer = require('puppeteer');

(async () => {
  console.log('Debugging click to shoot...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  page.on('console', msg => {
    const text = msg.text();
    console.log(`  [${msg.type()}] ${text}`);
  });
  
  console.log('Loading http://localhost:5173...\n');
  
  await page.goto('http://localhost:5173', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log('--- Checking handleMouseClick method ---\n');
  
  const methodExists = await page.evaluate(() => {
    if (window.game) {
      const scene = window.game.scene.getScene('SpaceShooterScene');
      if (scene) {
        return {
          hasMethod: typeof scene.handleMouseClick === 'function',
          mouseControlEnabled: scene.mouseControlEnabled,
          isGameOver: scene.isGameOver
        };
      }
    }
    return { error: 'Scene not found' };
  });
  
  console.log('Method check:', methodExists);
  
  console.log('\n--- Clicking and checking for bullets ---\n');
  
  await page.mouse.click(400, 500);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const afterClick = await page.evaluate(() => {
    if (window.game) {
      const scene = window.game.scene.getScene('SpaceShooterScene');
      if (scene) {
        const bullets = scene.bullets.children.values ? 
          Array.from(scene.bullets.children.values()) : [];
        return {
          bulletCount: bullets.length,
          lastFired: scene.lastFired
        };
      }
    }
    return { error: 'Scene not found' };
  });
  
  console.log('After click:', afterClick);
  
  await browser.close();
})();
