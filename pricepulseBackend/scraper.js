// backend/scraper.js
const { chromium } = require("playwright");

async function scrapeAmazonPrice(url) {
  if (!url || !url.includes("amazon")) {
    throw new Error("Invalid Amazon URL");
  }

  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
      locale: "en-US",
    });

    const page = await context.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });

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

    if (!price) throw new Error("Price not found. Layout may have changed.");
    return price;
  } finally {
    await browser.close();
  }
}

module.exports = scrapeAmazonPrice;
