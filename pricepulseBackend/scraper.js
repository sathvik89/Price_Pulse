const { chromium } = require("playwright");

async function scrapeAmazonPrice(url) {
  if (!url || !url.includes("amazon")) {
    throw new Error("invalid amazon url");
  }

  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
      locale: "en-US",
    });

    const page = await context.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });

    // get price
    const priceSelectors = [
      "#priceblock_ourprice",
      "#priceblock_dealprice",
      ".a-price .a-offscreen",
      "#corePriceDisplay_desktop_feature_div .a-offscreen",
    ];

    let price = null;
    for (const selector of priceSelectors) {
      const el = await page.$(selector);
      if (el) {
        price = (await el.textContent()).trim();
        break;
      }
    }

    if (!price) throw new Error("price not found");

    // get product title
    const title = await page.$eval("#productTitle", el => el.textContent.trim()) || null;

    // get product image
    const imageUrl = await page.$eval("#landingImage", el => el.src) || 
                     await page.$eval("#imgBlkFront", el => el.src) || null;

    return { price, title, imageUrl };
  } finally {
    await browser.close();
  }
}

module.exports = scrapeAmazonPrice;