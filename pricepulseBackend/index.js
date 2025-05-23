require("dotenv").config();
const express = require("express");
const cors = require("cors");
const scrapeAmazonPrice = require("./scraper");
const supabase = require("./db");

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

    const { price, title, imageUrl } = await scrapeAmazonPrice(url);

    const { data, error } = await supabase
      .from("tracked_products")
      .insert([{ url, current_price: price, title, image_url: imageUrl }])
      .select();

    if (error) throw error;

    res.json({ success: true, product: data[0] });
  } catch (error) {
    console.error("Scrape error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 4000;
app
  .listen(PORT, () => {
    console.log(`\nScraper API running on http://localhost:${PORT}`);
    console.log(`📡 Ready to accept requests...\n`);
  })
  .on("error", (err) => {
    console.error("Server failed to start:", err.message);
    process.exit(1);
  });

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
