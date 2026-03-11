const puppeteer = require('puppeteer');

(async () => {
  console.log('Debugging enemy physics...\n');
  
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
  
  console.log('--- Checking enemy physics ---\n');
  
  const enemyDebug = await page.evaluate(() => {
    if (window.game) {
      const scene = window.game.scene.getScene('SpaceShooterScene');
      if (scene && scene.enemies && scene.enemies.children) {
        const enemies = [];
        scene.enemies.children.iterate(enemy => {
          if (enemy) {
            enemies.push({
              x: enemy.x,
              y: enemy.y,
              hasBody: !!enemy.body,
              bodyExists: enemy.body !== undefined,
              velocityY: enemy.body && enemy.body.velocity ? enemy.body.velocity.y : 'N/A',
              spriteType: enemy.constructor.name,
              groupType: scene.enemies.constructor.name
            });
          }
        });
        return enemies;
      }
    }
    return [];
  });
  
  console.log('Enemy details:');
  enemyDebug.forEach((e, i) => {
    console.log(`  Enemy ${i + 1}:`);
    console.log(`    Position: (${e.x}, ${e.y})`);
    console.log(`    Has body: ${e.hasBody}`);
    console.log(`    Body exists: ${e.bodyExists}`);
    console.log(`    Velocity Y: ${e.velocityY}`);
    console.log(`    Sprite type: ${e.spriteType}`);
    console.log(`    Group type: ${e.groupType}`);
  });
  
  await browser.close();
})();
