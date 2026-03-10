const puppeteer = require('puppeteer');

(async () => {
  console.log('Testing smooth mouse movement...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  console.log('Loading http://localhost:5173...\n');
  
  await page.goto('http://localhost:5173', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('--- Testing Smooth Mouse Movement ---');
  
  // Start at center
  await page.mouse.move(400, 300);
  await new Promise(resolve => setTimeout(resolve, 100));
  console.log('✓ Mouse at center (400, 300)');
  
  // Move to far corner
  await page.mouse.move(700, 500);
  await new Promise(resolve => setTimeout(resolve, 200));
  console.log('✓ Mouse moved to corner (700, 500)');
  
  // Move back to center
  await page.mouse.move(400, 300);
  await new Promise(resolve => setTimeout(resolve, 200));
  console.log('✓ Mouse moved back to center (400, 300)');
  
  // Quick movement test
  console.log('\n--- Testing Quick Mouse Movement ---');
  await page.mouse.move(200, 200);
  await new Promise(resolve => setTimeout(resolve, 50));
  console.log('✓ Quick move to (200, 200)');
  
  await page.mouse.move(600, 500);
  await new Promise(resolve => setTimeout(resolve, 50));
  console.log('✓ Quick move to (600, 500)');
  
  console.log('\n--- Testing Keyboard Override ---');
  await page.keyboard.press('w');
  await new Promise(resolve => setTimeout(resolve, 100));
  console.log('✓ W key pressed (should override mouse)');
  
  console.log('\n✓ Mouse movement test completed!');
  console.log('\nManual verification:');
  console.log('□ Player moves smoothly toward cursor');
  console.log('□ Player does NOT snap to cursor');
  console.log('□ Player has a maximum movement speed');
  console.log('□ Keyboard overrides mouse control');
  
  await browser.close();
})();
