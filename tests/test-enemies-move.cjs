const puppeteer = require('puppeteer');

(async () => {
  console.log('Testing if enemies actually move...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  page.on('console', msg => {
    const text = msg.text();
    // Filter out spawn logs
    if (!text.includes('Spawned') && !text.includes('Actual velocity')) {
      console.log(`  [${msg.type()}] ${text}`);
    }
  });
  
  console.log('Loading http://localhost:5173...\n');
  
  await page.goto('http://localhost:5173', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
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
                y: Math.round(enemy.y)
              });
            }
          });
          return positions;
        }
      }
      return [];
    });
  };
  
  const positions1 = await getEnemyPositions();
  console.log('Positions at t=0:');
  positions1.forEach(p => console.log(`  (${p.x}, ${p.y})`));
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const positions2 = await getEnemyPositions();
  console.log('\nPositions at t=1s:');
  positions2.forEach(p => console.log(`  (${p.x}, ${p.y})`));
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const positions3 = await getEnemyPositions();
  console.log('\nPositions at t=2s:');
  positions3.forEach(p => console.log(`  (${p.x}, ${p.y})`));
  
  // Check if any enemy moved
  let moved = false;
  if (positions1.length > 0) {
    for (let i = 0; i < positions1.length; i++) {
      if (i < positions3.length) {
        if (positions3[i].y > positions1[i].y + 50) {
          moved = true;
          console.log(`\n✓ Enemy ${i + 1} moved from ${positions1[i].y} to ${positions3[i].y}`);
        }
      }
    }
  }
  
  if (!moved) {
    console.log('\n✗ No enemies moved');
  }
  
  await browser.close();
})();
