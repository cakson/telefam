const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Listen for console messages and errors
  const messages = [];
  const errors = [];
  page.on('console', msg => {
    const text = msg.text();
    messages.push(`[${msg.type()}] ${text}`);
    if (msg.type() === 'error') {
      errors.push(text);
    }
  });
  
  // Listen for page errors
  page.on('pageerror', exception => {
    errors.push(`Page error: ${exception.message}`);
  });
  
  try {
    console.log('Navigating to http://localhost:1234...');
    
    // Set a short timeout and navigate
    await page.goto('http://localhost:1234', { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    console.log('Page loaded successfully!');
    
    // Wait a bit to see if there are any immediate errors
    await page.waitForTimeout(3000);
    
    // Check if there are any infinite re-render errors
    const hasReRenderError = errors.some(error => 
      error.includes('Too many re-renders') || 
      error.includes('infinite loop') ||
      error.includes('Maximum update depth exceeded')
    );
    
    // Show all console messages for debugging
    console.log('\n=== CONSOLE MESSAGES ===');
    messages.slice(-50).forEach(msg => console.log(msg)); // Show last 50 messages
    
    if (hasReRenderError) {
      console.log('\n❌ INFINITE RE-RENDER ERROR DETECTED:');
      errors.forEach(error => console.log('  -', error));
    } else if (errors.length > 0) {
      console.log('\n⚠️  Some errors detected but no infinite re-render:');
      errors.forEach(error => console.log('  -', error));
    } else {
      console.log('\n✅ NO INFINITE RE-RENDER ERRORS! Application loaded successfully.');
    }
    
    // Take a screenshot for verification
    await page.screenshot({ path: 'app-screenshot.png', fullPage: true });
    console.log('📸 Screenshot saved as app-screenshot.png');
    
  } catch (error) {
    console.log('❌ Error loading page:', error.message);
  } finally {
    await browser.close();
  }
})();