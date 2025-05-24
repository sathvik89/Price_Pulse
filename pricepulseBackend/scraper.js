const { chromium } = require("playwright");

async function scrapeAmazonPrice(url) {
  if (!url || !url.includes("amazon")) throw new Error("Invalid Amazon URL");

  // Clean the URL to remove query params after /ref=
  const cleanUrl = url.split("/ref=")[0];

  const browser = await chromium.launch({ headless: false });

  try {
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
      locale: "en-US",
      viewport: { width: 1280, height: 720 },
      timezoneId: "Asia/Kolkata",
      bypassCSP: true,
    });

    const page = await context.newPage();

    // Block fonts and stylesheets to speed loading
    await page.route("**/*", (route) => {
      const resourceType = route.request().resourceType();
      if (["font", "stylesheet"].includes(resourceType)) {
        route.abort();
      } else {
        route.continue();
      }
    });

    // Navigate to the cleaned URL with timeout and wait for DOM loaded
    await page.goto(cleanUrl, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    // List of selectors to look for price on page
    const priceSelectorToWaitFor = [
      ".priceToPay span.a-price-whole",
      "#priceblock_ourprice",
      "#priceblock_dealprice",
      "span.a-price:not(.a-text-price) .a-offscreen",
      "#corePriceDisplay_desktop_feature_div .a-offscreen",
    ];

    // Wait for any of the price selectors to appear, else throw error
    try {
      await page.waitForFunction(
        (selectors) => selectors.some((sel) => !!document.querySelector(sel)),
        priceSelectorToWaitFor,
        { timeout: 15000 }
      );
    } catch {
      throw new Error("Price selectors not found within timeout");
    }

    // Extract the price text from first matched selector
    const priceData = await page.evaluate((selectors) => {
      for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el && el.textContent) return el.textContent.trim();
      }
      return null;
    }, priceSelectorToWaitFor);

    if (!priceData) throw new Error("Price not found");

    // Title selectors to try in order
    const titleSelectors = [
      "#productTitle",
      "#title",
      "h1[id*='title']",
      "#btAsinTitle",
    ];

    // Extract product title
    const titleData = await page.evaluate((selectors) => {
      for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el && el.textContent) return el.textContent.trim();
      }
      return "Unknown Product";
    }, titleSelectors);

    // Image selectors to try
    const imageSelectors = [
      "#landingImage",
      "#imgBlkFront",
      "#main-image",
      ".a-dynamic-image",
    ];

    // Extract image URL
    const imageUrlData = await page.evaluate((selectors) => {
      for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el && el.src) return el.src;
      }
      return null;
    }, imageSelectors);

    // Clean the price string, convert to float
    const cleanedPrice = parseFloat(
      priceData.replace(/,/g, "").replace(/[^\d.]/g, "")
    );

    if (isNaN(cleanedPrice)) throw new Error("Price parsing failed");

    // Return scraped data with price formatted to 2 decimals
    return {
      price: cleanedPrice.toFixed(2),
      title: titleData,
      imageUrl: imageUrlData || null,
    };
  } finally {
    await browser.close();
  }
}

module.exports = scrapeAmazonPrice;
