const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting wave system validation test...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  const results = {
    gameLoaded: false,
    waveStartsAtOne: false,
    enemiesSpawn: false,
    enemiesHaveDifferentTextures: false,
    enemiesStayOnScreen: false,
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
  
  const getGameState = async () => {
    return await page.evaluate(() => {
      if (window.game) {
        const scene = window.game.scene.getScene('SpaceShooterScene');
        if (scene) {
          return {
            wave: scene.currentWave || 0,
            lives: scene.lives || 0,
            enemiesKilled: scene.enemiesKilledInWave || 0,
            waveEnemies: scene.waveEnemies || 0,
            enemiesOnScreen: scene.enemiesOnScreen || 0,
            enemyCount: scene.enemies.children ? scene.enemies.children.size : 0
          };
        }
      }
      return null;
    });
  };
  
  const getEnemyDetails = async () => {
    return await page.evaluate(() => {
      if (window.game) {
        const scene = window.game.scene.getScene('SpaceShooterScene');
        if (scene && scene.enemies && scene.enemies.children) {
          const enemies = [];
          scene.enemies.children.iterate(enemy => {
            if (enemy) {
              enemies.push({
                texture: enemy.texture ? enemy.texture.key : 'unknown',
                x: Math.round(enemy.x),
                y: Math.round(enemy.y)
              });
            }
          });
          return enemies;
        }
      }
      return [];
    });
  };
  
  console.log('--- Checking Wave Starts at 1 ---');
  const initialState = await getGameState();
  console.log(`  Current wave: ${initialState.wave}`);
  console.log(`  Wave target: ${initialState.waveEnemies}`);
  console.log(`  Lives: ${initialState.lives}`);
  
  if (initialState.wave === 1 && initialState.lives === 3) {
    results.waveStartsAtOne = true;
    console.log('✓ Wave starts at 1 with 3 lives');
  } else {
    console.log('✗ Wave does not start correctly');
  }
  console.log('');
  
  console.log('--- Waiting for Enemies to Spawn ---');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  const afterSpawn = await getGameState();
  const enemies = await getEnemyDetails();
  
  console.log(`  Enemies on screen: ${afterSpawn.enemiesOnScreen}`);
  console.log(`  Enemy count: ${afterSpawn.enemyCount}`);
  console.log(`  Enemies killed: ${afterSpawn.enemiesKilled}/${afterSpawn.waveEnemies}`);
  console.log(`  Detailed enemy count: ${enemies.length}`);
  
  if (enemies.length > 0) {
    results.enemiesSpawn = true;
    console.log('✓ Enemies are spawning');
  } else {
    console.log('✗ No enemies spawned');
  }
  console.log('');
  
  console.log('--- Checking Enemy Textures ---');
  if (enemies.length > 0) {
    const textures = [...new Set(enemies.map(e => e.texture))];
    console.log(`  Unique textures: ${textures.join(', ')}`);
    
    const hasEnemy1 = textures.includes('enemy1');
    
    if (hasEnemy1) {
      results.enemiesHaveDifferentTextures = true;
      console.log('✓ Enemies have correct textures for wave 1');
    } else {
      console.log('✗ Enemies do not have expected texture');
    }
  }
  console.log('');
  
  console.log('--- Checking Enemies Stay On Screen ---');
  let allOnScreen = true;
  enemies.forEach(enemy => {
    if (enemy.x < 0 || enemy.x > 800) {
      allOnScreen = false;
      console.log(`  ✗ Enemy at x=${enemy.x} is off screen`);
    }
  });
  
  if (allOnScreen) {
    results.enemiesStayOnScreen = true;
    console.log('✓ All enemies are on screen');
  } else {
    console.log('✗ Some enemies are off screen');
  }
  console.log('');
  
  console.log('--- Test Results ---');
  console.log(`Game loaded: ${results.gameLoaded ? '✓' : '✗'}`);
  console.log(`Wave starts at 1: ${results.waveStartsAtOne ? '✓' : '✗'}`);
  console.log(`Enemies spawn: ${results.enemiesSpawn ? '✓' : '✗'}`);
  console.log(`Enemies have textures: ${results.enemiesHaveDifferentTextures ? '✓' : '✗'}`);
  console.log(`Enemies stay on screen: ${results.enemiesStayOnScreen ? '✓' : '✗'}`);
  console.log(`Errors: ${results.errors.length}`);
  
  const passed = results.gameLoaded && 
                 results.waveStartsAtOne && 
                 results.enemiesSpawn &&
                 results.enemiesHaveDifferentTextures &&
                 results.enemiesStayOnScreen;
  
  console.log(`\n${passed ? '✓ WAVE SYSTEM TESTS PASSED' : '✗ WAVE SYSTEM TESTS FAILED'}`);
  
  await browser.close();
  
  process.exit(passed ? 0 : 1);
})();
