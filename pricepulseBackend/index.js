const express = require("express");
const cors = require("cors");
const scrapeAmazonPrice = require("./scraper");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/scrape", async (req, res) => {
  const { url } = req.body;

  try {
    const price = await scrapeAmazonPrice(url);
    res.json({ price });
  } catch (error) {
    console.error("Scraping error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Scraper API running on http://localhost:${PORT}`);
});
