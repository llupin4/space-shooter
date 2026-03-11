const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting WASD controls validation test...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  const results = {
    gameLoaded: false,
    wKeyMovesUp: false,
    aKeyMovesLeft: false,
    sKeyMovesDown: false,
    dKeyMovesRight: false,
    combinedMovement: false,
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
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  results.gameLoaded = true;
  console.log('✓ Game loaded\n');
  
  const getPlayerPosition = async () => {
    return await page.evaluate(() => {
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (window.game && window.game.scene.get('SpaceShooterScene')) {
            const scene = window.game.scene.get('SpaceShooterScene')[0];
            if (scene && scene.player) {
              clearInterval(checkInterval);
              resolve({
                x: Math.round(scene.player.x),
                y: Math.round(scene.player.y)
              });
            }
          }
        }, 50);
        
        setTimeout(() => {
          clearInterval(checkInterval);
          resolve({ x: 0, y: 0 });
        }, 2000);
      });
    });
  };
  
  const startPos = await getPlayerPosition();
  console.log(`Starting position: (${startPos.x}, ${startPos.y})\n`);
  
  console.log('--- Testing W key (move up) ---');
  await page.keyboard.down('w');
  await new Promise(resolve => setTimeout(resolve, 300));
  const afterW = await getPlayerPosition();
  await page.keyboard.up('w');
  
  if (afterW.y < startPos.y - 10) {
    results.wKeyMovesUp = true;
    console.log(`✓ W key works: moved from ${startPos.y} to ${afterW.y} (delta: ${afterW.y - startPos.y})`);
  } else {
    console.log(`✗ W key failed: moved from ${startPos.y} to ${afterW.y} (delta: ${afterW.y - startPos.y})`);
  }
  console.log('');
  
  console.log('--- Testing A key (move left) ---');
  await page.keyboard.down('a');
  await new Promise(resolve => setTimeout(resolve, 300));
  const afterA = await getPlayerPosition();
  await page.keyboard.up('a');
  
  if (afterA.x < afterW.x - 10) {
    results.aKeyMovesLeft = true;
    console.log(`✓ A key works: moved from ${afterW.x} to ${afterA.x} (delta: ${afterA.x - afterW.x})`);
  } else {
    console.log(`✗ A key failed: moved from ${afterW.x} to ${afterA.x} (delta: ${afterA.x - afterW.x})`);
  }
  console.log('');
  
  console.log('--- Testing S key (move down) ---');
  await page.keyboard.down('s');
  await new Promise(resolve => setTimeout(resolve, 300));
  const afterS = await getPlayerPosition();
  await page.keyboard.up('s');
  
  if (afterS.y > afterA.y + 10) {
    results.sKeyMovesDown = true;
    console.log(`✓ S key works: moved from ${afterA.y} to ${afterS.y} (delta: ${afterS.y - afterA.y})`);
  } else {
    console.log(`✗ S key failed: moved from ${afterA.y} to ${afterS.y} (delta: ${afterS.y - afterA.y})`);
  }
  console.log('');
  
  console.log('--- Testing D key (move right) ---');
  await page.keyboard.down('d');
  await new Promise(resolve => setTimeout(resolve, 300));
  const afterD = await getPlayerPosition();
  await page.keyboard.up('d');
  
  if (afterD.x > afterS.x + 10) {
    results.dKeyMovesRight = true;
    console.log(`✓ D key works: moved from ${afterS.x} to ${afterD.x} (delta: ${afterD.x - afterS.x})`);
  } else {
    console.log(`✗ D key failed: moved from ${afterS.x} to ${afterD.x} (delta: ${afterD.x - afterS.x})`);
  }
  console.log('');
  
  console.log('--- Testing Combined Movement (W+D) ---');
  await page.keyboard.down('w');
  await page.keyboard.down('d');
  await new Promise(resolve => setTimeout(resolve, 300));
  const afterCombined = await getPlayerPosition();
  await page.keyboard.up('d');
  await page.keyboard.up('w');
  
  const movedUp = afterCombined.y < afterD.y - 10;
  const movedRight = afterCombined.x > afterD.x + 10;
  
  if (movedUp && movedRight) {
    results.combinedMovement = true;
    console.log(`✓ Combined movement works: moved diagonally up-right`);
    console.log(`  Y: ${afterD.y} -> ${afterCombined.y} (delta: ${afterCombined.y - afterD.y})`);
    console.log(`  X: ${afterD.x} -> ${afterCombined.x} (delta: ${afterCombined.x - afterD.x})`);
  } else {
    console.log(`✗ Combined movement failed`);
    console.log(`  Moved up: ${movedUp}, Moved right: ${movedRight}`);
  }
  console.log('');
  
  console.log('--- Test Results ---');
  console.log(`Game loaded: ${results.gameLoaded ? '✓' : '✗'}`);
  console.log(`W key moves up: ${results.wKeyMovesUp ? '✓' : '✗'}`);
  console.log(`A key moves left: ${results.aKeyMovesLeft ? '✓' : '✗'}`);
  console.log(`S key moves down: ${results.sKeyMovesDown ? '✓' : '✗'}`);
  console.log(`D key moves right: ${results.dKeyMovesRight ? '✓' : '✗'}`);
  console.log(`Combined movement: ${results.combinedMovement ? '✓' : '✗'}`);
  console.log(`Errors: ${results.errors.length}`);
  
  const allPassed = results.gameLoaded && 
                    results.wKeyMovesUp && 
                    results.aKeyMovesLeft && 
                    results.sKeyMovesDown && 
                    results.dKeyMovesRight && 
                    results.combinedMovement;
  
  console.log(`\n${allPassed ? '✓ ALL WASD TESTS PASSED' : '✗ SOME WASD TESTS FAILED'}`);
  
  await browser.close();
  
  process.exit(allPassed ? 0 : 1);
})();
