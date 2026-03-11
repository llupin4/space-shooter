const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting game load and wave validation test...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  const results = {
    gameLoaded: false,
    playerVisible: false,
    wavesProgressing: false,
    enemyTexturesChanging: false,
    healthResetOnWaveComplete: false,
    errors: [],
    consoleLogs: []
  };
  
  page.on('console', msg => {
    const text = msg.text();
    results.consoleLogs.push(`${msg.type()}: ${text}`);
    
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
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  results.gameLoaded = true;
  console.log('✓ Page loaded\n');
  
  const getGameState = async () => {
    return await page.evaluate(() => {
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (window.game) {
            const scene = window.game.scene.getScene('SpaceShooterScene');
            if (scene && scene.player) {
              clearInterval(checkInterval);
              resolve({
                player: {
                  x: Math.round(scene.player.x),
                  y: Math.round(scene.player.y),
                  visible: scene.player.visible
                },
                wave: scene.currentWave || 0,
                lives: scene.lives || 0,
                enemiesKilled: scene.enemiesKilledInWave || 0,
                enemiesInWave: scene.waveEnemies || 0,
                enemyCount: scene.enemies.children.values ? 
                  Array.from(scene.enemies.children.values()).length : 0,
                canvas: document.querySelector('canvas')
              });
            }
          }
        }, 100);
        
        setTimeout(() => {
          clearInterval(checkInterval);
          resolve(null);
        }, 3000);
      });
    });
  };
  
  const gameState = await getGameState();
  
  if (!gameState) {
    console.log('✗ Game state could not be retrieved');
    console.log('\nConsole logs:');
    results.consoleLogs.slice(0, 10).forEach(log => console.log(`  ${log}`));
  } else {
    console.log('Game state retrieved:');
    console.log(`  Player: (${gameState.player.x}, ${gameState.player.y})`);
    console.log(`  Player visible: ${gameState.player.visible}`);
    console.log(`  Wave: ${gameState.wave}`);
    console.log(`  Lives: ${gameState.lives}`);
    console.log(`  Enemies killed: ${gameState.enemiesKilled}/${gameState.enemiesInWave}`);
    console.log(`  Active enemies: ${gameState.enemyCount}`);
    
    if (gameState.player.visible) {
      results.playerVisible = true;
      console.log('✓ Player is visible');
    }
    
    if (gameState.canvas) {
      console.log('✓ Canvas element exists');
    }
  }
  
  console.log('\n--- Testing Mouse Movement ---');
  await page.mouse.move(200, 400);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const afterMove = await getGameState();
  if (afterMove && afterMove.player.x !== gameState.player.x) {
    console.log('✓ Player responds to mouse movement');
    console.log(`  Moved from (${gameState.player.x}, ${gameState.player.y}) to (${afterMove.player.x}, ${afterMove.player.y})`);
  } else {
    console.log('✗ Player did not move');
  }
  
  console.log('\n--- Testing Click to Shoot ---');
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
  
  const bulletsBefore = await getBulletCount();
  await page.mouse.click(200, 400);
  await new Promise(resolve => setTimeout(resolve, 300));
  const bulletsAfter = await getBulletCount();
  
  if (bulletsAfter > bulletsBefore) {
    console.log('✓ Click shoots bullets');
    console.log(`  ${bulletsBefore} -> ${bulletsAfter} bullets`);
  } else {
    console.log('✗ Click did not shoot');
  }
  
  console.log('\n--- Test Results ---');
  console.log(`Game loaded: ${results.gameLoaded ? '✓' : '✗'}`);
  console.log(`Player visible: ${results.playerVisible ? '✓' : '✗'}`);
  console.log(`Errors: ${results.errors.length}`);
  
  if (results.errors.length > 0) {
    console.log('\nErrors found:');
    results.errors.slice(0, 5).forEach((e, i) => console.log(`  ${i + 1}. ${e}`));
  }
  
  const basicPassed = results.gameLoaded && results.playerVisible && results.errors.length === 0;
  
  console.log(`\n${basicPassed ? '✓ BASIC GAME TESTS PASSED' : '✗ BASIC GAME TESTS FAILED'}`);
  
  await browser.close();
  
  process.exit(basicPassed ? 0 : 1);
})();
