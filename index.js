// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra');

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const ObjectsToCsv = require('objects-to-csv');

puppeteer.use(StealthPlugin());

// puppeteer usage as normal
puppeteer.launch({ headless: false }).then(async (browser) => {
  console.log('Running..');
  const page = await browser.newPage();
  await page.goto('https://betfury.io/dapps/crash');

  let result = [];

  while (1) {
    if (result.length === 100) {
      console.log('go here')
      await page.evaluate(() => {
        location.reload(true)
     })
    }
    await page.waitForSelector('button[type="submit"] > div', {
      timeout: 120000,
    });

    const value = await page.evaluate(() => {
      const temp = document.querySelector(
        'div.last-results > div:nth-child(2) > div'
      );
      if (temp) {
        return temp.textContent;
      }

      return '';
    });

    await page.waitForSelector('button[type="submit"] > span', {
      timeout: 120000,
    });

    result.push({ value });
    const csv = new ObjectsToCsv(result);
    // Save to file:
    await csv.toDisk('./output.csv', {append: true});
  }

  await browser.close();
});
