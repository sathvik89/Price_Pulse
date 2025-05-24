require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const scrapeAmazonPrice = require("./scraper");
const supabase = require("./db");
const { sendPriceAlert } = require("./emailService");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.send("PricePulse Scraper API is running");
});

// Scrape endpoint
app.post("/api/scrape", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) throw new Error("URL is required");

    console.log("🔍 Scraping product:", url);
    const { price, title, imageUrl } = await scrapeAmazonPrice(url);

    // Insert product
    const { data, error } = await supabase
      .from("tracked_products")
      .insert([{ url, current_price: price, title, image_url: imageUrl }])
      .select();

    if (error) throw error;

    const product = data[0];

    // Add initial price to history
    await supabase
      .from("price_history")
      .insert([{ product_id: product.id, price: price }]);

    console.log("✅ Product tracked successfully:", product.id);
    res.json({ success: true, dbRecord: product });
  } catch (error) {
    console.error("❌ Scrape error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Set price alert endpoint
app.post("/api/alerts", async (req, res) => {
  try {
    const { productId, email, targetPrice } = req.body;

    if (!productId || !email || !targetPrice) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await supabase.from("price_alerts").insert([
      {
        product_id: productId,
        email,
        target_price: targetPrice,
      },
    ]);

    if (error) throw error;

    console.log(
      `✅ Price alert set for product ${productId} at ₹${targetPrice}`
    );
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Alert error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get price history for a product
app.get("/api/products/:id/history", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("price_history")
      .select("price, timestamp")
      .eq("product_id", id)
      .order("timestamp", { ascending: true });

    if (error) throw error;

    res.json({ history: data });
  } catch (error) {
    console.error("❌ History error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Cron job to update prices every hour
cron.schedule("0 * * * *", async () => {
  console.log("🔄 Running hourly price update job...");

  try {
    // Get all tracked products
    const { data: products, error } = await supabase
      .from("tracked_products")
      .select("*");

    if (error) throw error;

    console.log(`📦 Found ${products.length} products to update`);

    for (const product of products) {
      try {
        console.log(`🔍 Updating product ${product.id}...`);

        // Scrape current price
        const { price } = await scrapeAmazonPrice(product.url);

        // Update current price in products table
        await supabase
          .from("tracked_products")
          .update({ current_price: price })
          .eq("id", product.id);

        // Add to price history
        await supabase
          .from("price_history")
          .insert([{ product_id: product.id, price: price }]);

        // Check for price alerts
        await checkPriceAlerts(product.id, price, product);

        console.log(`✅ Updated product ${product.id}: ${price}`);

        // Add delay between requests to avoid being blocked
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (err) {
        console.error(
          `❌ Failed to update product ${product.id}:`,
          err.message
        );
      }
    }
  } catch (error) {
    console.error("❌ Cron job error:", error.message);
  }
});

// Check and send price alerts
async function checkPriceAlerts(productId, currentPrice, product) {
  try {
    // Convert price to number for comparison
    const numericPrice = parseFloat(currentPrice.replace(/[₹,]/g, ""));

    // Get all active alerts for this product
    const { data: alerts, error } = await supabase
      .from("price_alerts")
      .select("*")
      .eq("product_id", productId)
      .eq("is_triggered", false)
      .lte("target_price", numericPrice);

    if (error) throw error;

    // Send alerts
    for (const alert of alerts) {
      try {
        await sendPriceAlert(
          alert.email,
          product,
          numericPrice,
          alert.target_price
        );

        // Mark alert as triggered
        await supabase
          .from("price_alerts")
          .update({ is_triggered: true })
          .eq("id", alert.id);

        console.log(
          `📧 Price alert sent to ${alert.email} for product ${productId}`
        );
      } catch (emailError) {
        console.error(
          `❌ Failed to send alert to ${alert.email}:`,
          emailError.message
        );
      }
    }
  } catch (error) {
    console.error("❌ Error checking price alerts:", error.message);
  }
}

// Start server
const PORT = process.env.PORT || 4000;
app
  .listen(PORT, () => {
    console.log(`\n🚀 PricePulse API running on http://localhost:${PORT}`);
    console.log(`⏰ Price tracking cron job scheduled to run every hour`);
    console.log(`📡 Ready to accept requests...\n`);
  })
  .on("error", (err) => {
    console.error("❌ Server failed to start:", err.message);
    process.exit(1);
  });

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});
// Add this route to your existing index.js
app.post("/api/cron/update-prices", async (req, res) => {
  // Verify the request is from your frontend
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.BACKEND_API_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    console.log("🔄 Running price update job...");

    // Get all tracked products
    const { data: products, error } = await supabase
      .from("tracked_products")
      .select("*");

    if (error) throw error;

    console.log(`📦 Found ${products.length} products to update`);

    for (const product of products) {
      try {
        console.log(`🔍 Updating product ${product.id}...`);

        // Scrape current price
        const { price } = await scrapeAmazonPrice(product.url);

        // Update current price in products table
        await supabase
          .from("tracked_products")
          .update({ current_price: price })
          .eq("id", product.id);

        // Add to price history
        await supabase
          .from("price_history")
          .insert([{ product_id: product.id, price: price }]);

        // Check for price alerts
        await checkPriceAlerts(product.id, price, product);

        console.log(`✅ Updated product ${product.id}: ${price}`);

        // Add delay between requests to avoid being blocked
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (err) {
        console.error(
          `❌ Failed to update product ${product.id}:`,
          err.message
        );
      }
    }

    res.json({ success: true, message: "Price update completed" });
  } catch (error) {
    console.error("❌ Cron job error:", error.message);
    res.status(500).json({ error: error.message });
  }
});
