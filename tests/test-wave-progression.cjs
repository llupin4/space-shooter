const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting wave progression validation test...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  const results = {
    gameLoaded: false,
    waveStartsAtOne: false,
    waveTextCorrect: false,
    enemyCountPerWave: false,
    enemySpeedIncreases: false,
    enemySpeedNotTooFast: false,
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
            enemiesOnScreen: scene.enemiesOnScreen || 0
          };
        }
      }
      return null;
    });
  };
  
  const getEnemySpeeds = async () => {
    return await page.evaluate(() => {
      if (window.game) {
        const scene = window.game.scene.getScene('SpaceShooterScene');
        if (scene && scene.enemies && scene.enemies.children) {
          const speeds = [];
          scene.enemies.children.iterate(enemy => {
            if (enemy && enemy.body && enemy.body.velocity) {
              speeds.push(Math.abs(enemy.body.velocity.y));
            }
          });
          return speeds;
        }
      }
      return [];
    });
  };
  
  console.log('--- Checking initial wave ---');
  const initialState = await getGameState();
  console.log(`Wave: ${initialState.wave}`);
  console.log(`Lives: ${initialState.lives}`);
  console.log(`Target: ${initialState.waveEnemies}`);
  
  if (initialState.wave === 1 && initialState.lives === 3 && initialState.waveEnemies === 5) {
    results.waveStartsAtOne = true;
    console.log('✓ Wave starts correctly (wave 1, 3 lives, 5 enemies target)');
  } else {
    console.log('✗ Wave does not start correctly');
  }
  console.log('');
  
  console.log('--- Checking wave text ---');
  const waveTexts = await page.evaluate(() => {
    const texts = [];
    document.querySelectorAll('text').forEach(text => {
      const content = text.textContent;
      if (content && content.includes('WAVE')) {
        texts.push(content);
      }
    });
    return texts;
  });
  
  let waveTextCorrect = true;
  waveTexts.forEach(text => {
    const match = text.match(/WAVE\s+(\d+)/);
    if (!match || isNaN(parseInt(match[1]))) {
      waveTextCorrect = false;
      console.log(`✗ Invalid wave text: "${text}"`);
    }
  });
  
  if (waveTextCorrect && waveTexts.length === 0) {
    console.log('- No wave text displayed (normal for wave 1)');
  }
  
  results.waveTextCorrect = waveTextCorrect;
  console.log('');
  
  console.log('--- Checking enemy speed for wave 1 ---');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const wave1Speeds = await getEnemySpeeds();
  const avgWave1Speed = wave1Speeds.length > 0 
    ? wave1Speeds.reduce((a, b) => a + b, 0) / wave1Speeds.length 
    : 0;
  
  console.log(`Wave 1 enemy speeds: ${wave1Speeds.slice(0, 5).join(', ')}`);
  console.log(`Average speed: ${avgWave1Speed.toFixed(0)} px/s`);
  
  let speedNotTooFast = avgWave1Speed < 300;
  if (speedNotTooFast) {
    results.enemySpeedNotTooFast = true;
    console.log('✓ Enemy speed is reasonable (< 300 px/s)');
  } else {
    console.log('✗ Enemy speed is too fast');
  }
  console.log('');
  
  console.log('--- Checking enemy count per wave ---');
  const gameState = await getGameState();
  const hasCorrectCount = gameState.waveEnemies >= 5 && gameState.waveEnemies <= 10;
  
  if (hasCorrectCount) {
    results.enemyCountPerWave = true;
    console.log(`✓ Enemy count per wave is reasonable (${gameState.waveEnemies})`);
  } else {
    console.log(`✗ Enemy count per wave is unusual (${gameState.waveEnemies})`);
  }
  console.log('');
  
  console.log('--- Test Results ---');
  console.log(`Game loaded: ${results.gameLoaded ? '✓' : '✗'}`);
  console.log(`Wave starts at 1: ${results.waveStartsAtOne ? '✓' : '✗'}`);
  console.log(`Wave text correct: ${results.waveTextCorrect ? '✓' : '✗'}`);
  console.log(`Enemy count per wave: ${results.enemyCountPerWave ? '✓' : '✗'}`);
  console.log(`Enemy speed not too fast: ${results.enemySpeedNotTooFast ? '✓' : '✗'}`);
  console.log(`Errors: ${results.errors.length}`);
  
  const passed = results.gameLoaded && 
                 results.waveStartsAtOne && 
                 results.waveTextCorrect &&
                 results.enemyCountPerWave &&
                 results.enemySpeedNotTooFast;
  
  console.log(`\n${passed ? '✓ WAVE PROGRESSION TESTS PASSED' : '✗ WAVE PROGRESSION TESTS FAILED'}`);
  
  await browser.close();
  
  process.exit(passed ? 0 : 1);
})();
