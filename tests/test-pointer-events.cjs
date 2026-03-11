const puppeteer = require('puppeteer');

(async () => {
  console.log('Testing pointer events...\n');
  
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
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log('Clicking on canvas...\n');
  
  const clickResult = await page.evaluate(() => {
    return new Promise((resolve) => {
      const canvas = document.querySelector('canvas');
      if (!canvas) {
        resolve({ error: 'No canvas found' });
        return;
      }
      
      console.log('Canvas found, dimensions:', canvas.width, canvas.height);
      
      canvas.addEventListener('pointerdown', (e) => {
        console.log('Pointer down event received:', e);
        resolve({ success: true, event: 'pointerdown' });
      });
      
      canvas.addEventListener('click', (e) => {
        console.log('Click event received:', e);
        resolve({ success: true, event: 'click' });
      });
      
      canvas.addEventListener('mousedown', (e) => {
        console.log('Mouse down event received:', e);
        resolve({ success: true, event: 'mousedown' });
      });
      
      canvas.click();
      
      setTimeout(() => {
        resolve({ error: 'No event received' });
      }, 1000);
    });
  });
  
  console.log('Click result:', clickResult);
  
  await browser.close();
})();
