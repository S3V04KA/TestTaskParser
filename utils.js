import puppeteer from "puppeteer";
import fs from "fs";

const main = async (url, region, outputPath) => {
  const browser = await puppeteer.launch({
    headless: false,
    // executablePath: '/Applications/Google Chrome.app'
    channel: "chrome",
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 720 });
  await page.goto(url);

  await page.waitForSelector("#iframe_flock_data_provider");
  await page.click('div[class*="Region_region_"]');

  await page.waitForSelector(`li[class*="UiRegionListBase_item_"]`);
  const lis = await page.$$(`li[class*="UiRegionListBase_item_"]`);

  for (const li of lis) {
    const regionName = await li.evaluate((el) => el.innerText);
    if (regionName === region) {
      await li.click();
      break;
    }
  }

  await page.waitForSelector('div[id=":r2:"]');

  await (
    await page.locator('div[id=":r2:"]').waitHandle()
  ).evaluate((el) => el.setAttribute("style", "display: none;"));
  await (
    await page.locator('div[id="bottomPortal"]').waitHandle()
  ).evaluate((el) => el.setAttribute("style", "display: none;"));

  await page.evaluate(() => window.stop());
  await page.waitForNavigation({waitUntil: 'load', timeout: 600}).catch(() => {});
  await page.screenshot({ path: `${outputPath}/screenshot.png`, fullPage: true });

  const oldPrice = await page
        .$('span[class*="Price_size_XS_"]')
  const price = await page
    .locator('span[class*="Price_size_XL_"]')
    .waitHandle();
  const rating = await page
    .locator('a[class*="ActionsRow_stars_"]')
    .waitHandle();
  const reviewCount = await page
    .locator('a[class*="ActionsRow_reviews_"]')
    .waitHandle();

  const result = `${oldPrice?.evaluate ? "oldPrice=" + (await oldPrice.evaluate((el) => el.textContent.split(" ")[0])) + "\n" : ""}price=${await price.evaluate((el) => el.textContent.split(" ")[0])}\nrating=${await rating.evaluate((el) => el.title.split(" ")[1])}\nreviewCount=${await reviewCount.evaluate((el) => el.textContent.split(" ")[0])}`;

  fs.writeFileSync(`${outputPath}/product.txt`, result);

  await browser.close();
};

export default main;
