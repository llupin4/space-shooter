const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting comprehensive enemy movement validation test...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  const results = {
    gameLoaded: false,
    enemiesSpawn: false,
    enemiesMoveDown: false,
    enemiesHaveSideMovement: false,
    enemiesDisappearAtBottom: false,
    enemySpeedReasonable: false,
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
  
  const getEnemyPositions = async () => {
    return await page.evaluate(() => {
      if (window.game) {
        const scene = window.game.scene.getScene('SpaceShooterScene');
        if (scene && scene.enemies && scene.enemies.children) {
          const positions = [];
          scene.enemies.children.iterate(enemy => {
            if (enemy) {
              positions.push({
                x: Math.round(enemy.x),
                y: Math.round(enemy.y),
                velocityY: enemy.body && enemy.body.velocity ? Math.round(enemy.body.velocity.y) : 0,
                velocityX: enemy.body && enemy.body.velocity ? Math.round(enemy.body.velocity.x) : 0
              });
            }
          });
          return positions;
        }
      }
      return [];
    });
  };
  
  console.log('--- Waiting for enemies to spawn ---');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const positions1 = await getEnemyPositions();
  console.log(`Enemies at t=0: ${positions1.length}`);
  
  if (positions1.length > 0) {
    results.enemiesSpawn = true;
    console.log('✓ Enemies are spawning');
    positions1.forEach(p => console.log(`  (${p.x}, ${p.y}) velY:${p.velocityY} velX:${p.velocityX}`));
  } else {
    console.log('✗ No enemies spawned');
  }
  console.log('');
  
  console.log('--- Waiting 1 second for enemies to move ---');
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const positions2 = await getEnemyPositions();
  console.log(`Enemies at t=1s: ${positions2.length}`);
  positions2.forEach(p => console.log(`  (${p.x}, ${p.y}) velY:${p.velocityY} velX:${p.velocityX}`));
  console.log('');
  
  console.log('--- Checking if enemies move down ---');
  let movedDown = false;
  
  // Check if average Y position increased (enemies moving down)
  if (positions1.length > 0 && positions2.length > 0) {
    const avgY1 = positions1.reduce((sum, p) => sum + p.y, 0) / positions1.length;
    const avgY2 = positions2.reduce((sum, p) => sum + p.y, 0) / positions2.length;
    const avgDelta = avgY2 - avgY1;
    
    if (avgDelta > 50) {
      movedDown = true;
      console.log(`✓ Enemies moved down on average: ${avgY1.toFixed(0)} -> ${avgY2.toFixed(0)} (delta: ${avgDelta.toFixed(0)})`);
    } else {
      console.log(`- Average Y change: ${avgDelta.toFixed(0)} (may be new enemies spawning)`);
    }
  }
  
  // Also check individual enemy movement
  for (let i = 0; i < positions1.length; i++) {
    for (let j = 0; j < positions2.length; j++) {
      // If x positions are similar (within 50 pixels), likely same enemy
      if (Math.abs(positions1[i].x - positions2[j].x) < 50) {
        const deltaY = positions2[j].y - positions1[i].y;
        if (deltaY > 50) {
          movedDown = true;
          console.log(`✓ Enemy at x=${positions1[i].x} moved down: ${positions1[i].y} -> ${positions2[j].y} (delta: ${deltaY})`);
        }
      }
    }
  }
  
  results.enemiesMoveDown = movedDown;
  if (!movedDown) {
    console.log('✗ No enemies moved down significantly');
  }
  console.log('');
  
  console.log('--- Checking side movement ---');
  let hasSideMovement = false;
  positions2.forEach(p => {
    if (Math.abs(p.velocityX) > 0) {
      hasSideMovement = true;
    }
  });
  
  results.enemiesHaveSideMovement = hasSideMovement;
  if (hasSideMovement) {
    console.log('✓ Enemies have side-to-side movement');
  } else {
    console.log('- No side movement detected (may be straight pattern)');
  }
  console.log('');
  
  console.log('--- Checking enemy speed is reasonable ---');
  let speedReasonable = true;
  positions2.forEach(p => {
    if (Math.abs(p.velocityY) > 300) {
      speedReasonable = false;
      console.log(`✗ Enemy too fast: velY=${p.velocityY}`);
    }
  });
  
  results.enemySpeedReasonable = speedReasonable;
  if (speedReasonable) {
    console.log('✓ Enemy speeds are reasonable (< 300 px/s)');
  }
  console.log('');
  
  console.log('--- Waiting 5 more seconds for enemies to reach bottom ---');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  const positions3 = await getEnemyPositions();
  console.log(`Enemies at t=4s: ${positions3.length}`);
  positions3.forEach(p => console.log(`  (${p.x}, ${p.y}) velY:${p.velocityY}`));
  
  const disappeared = positions2.length > positions3.length;
  if (disappeared) {
    results.enemiesDisappearAtBottom = true;
    console.log(`✓ Enemies disappeared at bottom: ${positions2.length} -> ${positions3.length}`);
  } else {
    console.log('- No enemies reached bottom yet');
  }
  console.log('');
  
  console.log('--- Test Results ---');
  console.log(`Game loaded: ${results.gameLoaded ? '✓' : '✗'}`);
  console.log(`Enemies spawn: ${results.enemiesSpawn ? '✓' : '✗'}`);
  console.log(`Enemies move down: ${results.enemiesMoveDown ? '✓' : '✗'}`);
  console.log(`Enemies have side movement: ${results.enemiesHaveSideMovement ? '✓' : '✗'}`);
  console.log(`Enemies disappear at bottom: ${results.enemiesDisappearAtBottom ? '✓' : '✗'}`);
  console.log(`Enemy speed reasonable: ${results.enemySpeedReasonable ? '✓' : '✗'}`);
  console.log(`Errors: ${results.errors.length}`);
  
  const passed = results.gameLoaded && 
                 results.enemiesSpawn && 
                 results.enemiesMoveDown &&
                 results.enemySpeedReasonable;
  
  console.log(`\n${passed ? '✓ ENEMY MOVEMENT TESTS PASSED' : '✗ ENEMY MOVEMENT TESTS FAILED'}`);
  
  await browser.close();
  
  process.exit(passed ? 0 : 1);
})();
