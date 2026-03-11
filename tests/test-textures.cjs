const puppeteer = require('puppeteer');

(async () => {
  console.log('Checking enemy texture generation...\n');
  
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
  
  const textures = await page.evaluate(() => {
    if (window.game) {
      const scene = window.game.scene.getScene('SpaceShooterScene');
      if (scene) {
        const textures = {};
        ['enemy', 'enemy1', 'enemy2', 'enemy3', 'enemy4', 'enemy5'].forEach(key => {
          textures[key] = scene.textures.exists(key);
        });
        return textures;
      }
    }
    return {};
  });
  
  console.log('\nTexture check:');
  Object.keys(textures).forEach(key => {
    console.log(`  ${key}: ${textures[key] ? 'exists' : 'missing'}`);
  });
  
  await browser.close();
})();
