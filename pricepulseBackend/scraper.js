// const { chromium } = require("playwright");

// async function scrapeAmazonPrice(url) {
//   if (!url || !url.includes("amazon")) throw new Error("invalid amazon url");

//   const browser = await chromium.launch({ headless: true });

//   try {
//     const context = await browser.newContext({
//       userAgent:
//         "mozilla/5.0 (windows nt 10.0; win64; x64) applewebkit/537.36 " +
//         "(khtml, like gecko) chrome/117.0.0.0 safari/537.36",
//       locale: "en-us",
//     });

//     const page = await context.newPage();
//     await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });

//     const priceSelectors = [
//       "#priceblock_ourprice",
//       "#priceblock_dealprice",
//       ".a-price .a-offscreen",
//       "#corepricedisplay_desktop_feature_div .a-offscreen",
//     ];

//     let price = null;
//     for (const selector of priceSelectors) {
//       const el = await page.$(selector);
//       if (el) {
//         price = (await el.textContent()).trim();
//         break;
//       }
//     }
//     if (!price) throw new Error("price not found");

//     const title =
//       (await page.$eval("#producttitle", (el) => el.textContent.trim())) ||
//       null;

//     const imageurl =
//       (await page.$eval("#landingimage", (el) => el.src)) ||
//       (await page.$eval("#imgblkfront", (el) => el.src)) ||
//       null;

//     return {
//       price: price.replace(/[^\d.]/g, ""),
//       title,
//       imageUrl: imageurl,
//     };
//   } finally {
//     await browser.close();
//   }
// }

// module.exports = scrapeAmazonPrice;
const { chromium } = require("playwright");

async function scrapeAmazonPrice(url) {
  if (!url || !url.includes("amazon")) throw new Error("invalid amazon url");

  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
      locale: "en-US",
    });

    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

    // Wait for critical elements to load
    await page.waitForSelector("body", { timeout: 10000 });

    // Improved price scraping
    const price = await page.evaluate(() => {
      const priceSelectors = [
        ".priceToPay span.a-price-whole", // New Amazon layout
        "#priceblock_ourprice",
        "#priceblock_dealprice",
        "span.a-price:not(.a-text-price) .a-offscreen",
        "#corePriceDisplay_desktop_feature_div .a-offscreen",
      ];

      for (const selector of priceSelectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent) {
          return element.textContent.trim();
        }
      }
      return null;
    });

    if (!price) throw new Error("price not found");

    // Improved title scraping
    const title = await page.evaluate(() => {
      const titleSelectors = [
        "#productTitle", // Standard selector
        "#title", // Alternate selector
        "h1[id*='title']", // Fallback
        "#btAsinTitle", // Old layout
      ];

      for (const selector of titleSelectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent) {
          return element.textContent.trim();
        }
      }
      return "Unknown Product";
    });

    // Improved image scraping
    const imageUrl = await page.evaluate(() => {
      const imageSelectors = [
        "#landingImage",
        "#imgBlkFront",
        "#main-image",
        ".a-dynamic-image",
      ];

      for (const selector of imageSelectors) {
        const element = document.querySelector(selector);
        if (element && element.src) {
          return element.src;
        }
      }
      return null;
    });

    return {
      price: price.replace(/[^\d.]/g, ""),
      title,
      imageUrl,
    };
  } finally {
    await browser.close();
  }
}

module.exports = scrapeAmazonPrice;
