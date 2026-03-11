const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting mouse follow behavior validation test...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  const results = {
    gameLoaded: false,
    playerFollowsMouse: false,
    smoothMouseMovement: false,
    mouseDoesNotLockPlayer: false,
    mouseClickShoots: false,
    keyboardWorksDuringMouseFollow: false,
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
  
  console.log('--- Testing Mouse Follow (move to 200, 200) ---');
  await page.mouse.move(200, 200);
  await new Promise(resolve => setTimeout(resolve, 500));
  const afterMouse = await getPlayerPosition();
  
  const dx = Math.abs(afterMouse.x - 200);
  const dy = Math.abs(afterMouse.y - 200);
  
  if (dx < 100 && dy < 100) {
    results.playerFollowsMouse = true;
    console.log(`✓ Player follows mouse: moved from (${startPos.x}, ${startPos.y}) to (${afterMouse.x}, ${afterMouse.y})`);
    console.log(`  Distance from mouse: ${Math.round(Math.sqrt(dx * dx + dy * dy))} pixels`);
  } else {
    console.log(`✗ Player did not follow mouse properly`);
    console.log(`  Expected near (200, 200), got (${afterMouse.x}, ${afterMouse.y})`);
  }
  console.log('');
  
  console.log('--- Testing Smooth Mouse Movement (multiple positions) ---');
  const positions = [
    [600, 300],
    [100, 500],
    [700, 100],
    [300, 400]
  ];
  
  let previousPos = afterMouse;
  let smoothMoves = 0;
  
  for (const [targetX, targetY] of positions) {
    await page.mouse.move(targetX, targetY);
    await new Promise(resolve => setTimeout(resolve, 300));
    const currentPos = await getPlayerPosition();
    
    const distanceTraveled = Math.sqrt(
      Math.pow(currentPos.x - previousPos.x, 2) + 
      Math.pow(currentPos.y - previousPos.y, 2)
    );
    
    if (distanceTraveled > 20) {
      smoothMoves++;
    }
    previousPos = currentPos;
  }
  
  if (smoothMoves >= positions.length - 1) {
    results.smoothMouseMovement = true;
    console.log(`✓ Smooth mouse movement: ${smoothMoves}/${positions.length} successful moves`);
  } else {
    console.log(`✗ Smooth mouse movement failed: ${smoothMoves}/${positions.length} successful moves`);
  }
  console.log('');
  
  console.log('--- Testing Mouse Does Not Lock Player ---');
  await page.mouse.move(400, 300);
  await new Promise(resolve => setTimeout(resolve, 200));
  await page.keyboard.down('w');
  await new Promise(resolve => setTimeout(resolve, 300));
  const positionWithKeyboard = await getPlayerPosition();
  await page.keyboard.up('w');
  
  if (positionWithKeyboard.y < previousPos.y - 10) {
    results.mouseDoesNotLockPlayer = true;
    console.log(`✓ Keyboard works during mouse follow: moved from ${previousPos.y} to ${positionWithKeyboard.y}`);
  } else {
    console.log(`✗ Mouse may be locking player: position unchanged`);
  }
  console.log('');
  
  console.log('--- Testing Mouse Click Shoots ---');
  const getBulletCount = async () => {
    return await page.evaluate(() => {
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (window.game && window.game.scene.get('SpaceShooterScene')) {
            const scene = window.game.scene.get('SpaceShooterScene')[0];
            if (scene && scene.bullets) {
              clearInterval(checkInterval);
              resolve(scene.bullets.children.values ? 
                Array.from(scene.bullets.children.values()).length : 0);
            }
          }
        }, 50);
        
        setTimeout(() => {
          clearInterval(checkInterval);
          resolve(0);
        }, 2000);
      });
    });
  };
  
  const bulletsBefore = await getBulletCount();
  await page.mouse.click(400, 300);
  await new Promise(resolve => setTimeout(resolve, 200));
  const bulletsAfter = await getBulletCount();
  
  if (bulletsAfter > bulletsBefore) {
    results.mouseClickShoots = true;
    console.log(`✓ Mouse click shoots: ${bulletsBefore} -> ${bulletsAfter} bullets`);
  } else {
    console.log(`✗ Mouse click may not shoot: ${bulletsBefore} -> ${bulletsAfter} bullets`);
  }
  console.log('');
  
  console.log('--- Testing Keyboard Works During Mouse Follow ---');
  await page.mouse.move(200, 400);
  await new Promise(resolve => setTimeout(resolve, 200));
  const beforeKey = await getPlayerPosition();
  
  await page.keyboard.down('d');
  await new Promise(resolve => setTimeout(resolve, 300));
  const afterKey = await getPlayerPosition();
  await page.keyboard.up('d');
  
  if (afterKey.x > beforeKey.x + 10) {
    results.keyboardWorksDuringMouseFollow = true;
    console.log(`✓ Keyboard works during mouse follow: moved from ${beforeKey.x} to ${afterKey.x}`);
  } else {
    console.log(`✗ Keyboard may not work during mouse follow`);
  }
  console.log('');
  
  console.log('--- Test Results ---');
  console.log(`Game loaded: ${results.gameLoaded ? '✓' : '✗'}`);
  console.log(`Player follows mouse: ${results.playerFollowsMouse ? '✓' : '✗'}`);
  console.log(`Smooth mouse movement: ${results.smoothMouseMovement ? '✓' : '✗'}`);
  console.log(`Mouse does not lock player: ${results.mouseDoesNotLockPlayer ? '✓' : '✗'}`);
  console.log(`Mouse click shoots: ${results.mouseClickShoots ? '✓' : '✗'}`);
  console.log(`Keyboard works during mouse follow: ${results.keyboardWorksDuringMouseFollow ? '✓' : '✗'}`);
  console.log(`Errors: ${results.errors.length}`);
  
  const allPassed = results.gameLoaded && 
                    results.playerFollowsMouse && 
                    results.smoothMouseMovement && 
                    results.mouseDoesNotLockPlayer &&
                    results.keyboardWorksDuringMouseFollow;
  
  console.log(`\n${allPassed ? '✓ ALL MOUSE FOLLOW TESTS PASSED' : '✗ SOME MOUSE FOLLOW TESTS FAILED'}`);
  
  await browser.close();
  
  process.exit(allPassed ? 0 : 1);
})();
