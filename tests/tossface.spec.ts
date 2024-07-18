import { test, expect } from '@playwright/test';
import Jimp from 'jimp';

test('Can Display ✅ Emoji', async ({ page, browserName }, testInfo) => {
    
  await page.goto('localhost:3000');
  await page.waitForLoadState('networkidle');

  const screenshotFileName = `screenshot_${browserName}_${Date.now()}.png`;
  const screenshot = await page.screenshot({ path: screenshotFileName });
  await testInfo.attach(screenshotFileName, { contentType: 'image/png', body: screenshot });

  const image = await Jimp.read(screenshot);

  // Define what we consider as "green"
  const isGreen = (r, g, b) => g > 100 && g > r * 1.4 && g > b * 1.4;

  // Scan the image
  let hasGreen = false;
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
    const r = image.bitmap.data[idx + 0];
    const g = image.bitmap.data[idx + 1];
    const b = image.bitmap.data[idx + 2];
    if (isGreen(r, g, b)) {
      hasGreen = true;
      return false;
    }
  });

  // Assert that green is present
  expect(hasGreen).toBeTruthy();
});
