const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting game diagnosis test...\n');
  
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
  
  await new Promise(resolve => setTimeout(resolve, 4000));
  
  console.log('\n--- Checking Canvas ---');
  const canvasInfo = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    return {
      exists: !!canvas,
      width: canvas ? canvas.width : 0,
      height: canvas ? canvas.height : 0,
      style: canvas ? canvas.style.display : 'none'
    };
  });
  
  console.log(`  Canvas exists: ${canvasInfo.exists}`);
  console.log(`  Canvas size: ${canvasInfo.width}x${canvasInfo.height}`);
  console.log(`  Canvas display: ${canvasInfo.style}`);
  
  console.log('\n--- Checking window.game ---');
  const gameInfo = await page.evaluate(() => {
    return {
      gameExists: !!window.game,
      scenes: window.game ? Object.keys(window.game.scene.scenes || {}) : [],
      sceneKeys: window.game ? Object.keys(window.game.scene.keys || {}) : []
    };
  });
  
  console.log(`  window.game exists: ${gameInfo.gameExists}`);
  console.log(`  Scene keys: ${gameInfo.sceneKeys.join(', ')}`);
  
  console.log('\n--- Trying to access player ---');
  const playerInfo = await page.evaluate(() => {
    if (!window.game) return null;
    
    try {
      const scene = window.game.scene.getScene('SpaceShooterScene');
      if (scene && scene.player) {
        return {
          found: true,
          x: scene.player.x,
          y: scene.player.y,
          visible: scene.player.visible
        };
      }
    } catch (e) {
      console.log(`  Error: ${e.message}`);
    }
    
    return { found: false };
  });
  
  console.log(`  Player found: ${playerInfo ? playerInfo.found : 'unknown'}`);
  if (playerInfo && playerInfo.found) {
    console.log(`  Player position: ${playerInfo.x}, ${playerInfo.y}`);
    console.log(`  Player visible: ${playerInfo.visible}`);
  }
  
  console.log('\n--- Checking DOM Elements ---');
  const domInfo = await page.evaluate(() => {
    return {
      gameContainer: !!document.getElementById('game-container'),
      children: document.getElementById('game-container') ? document.getElementById('game-container').children.length : 0
    };
  });
  
  console.log(`  Game container exists: ${domInfo.gameContainer}`);
  console.log(`  Container children: ${domInfo.children}`);
  
  await browser.close();
})();
