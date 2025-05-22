const express = require("express");
const cors = require("cors");
const scrapeAmazonPrice = require("./scraper");
const supabase = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/scrape", async (req, res) => {
  const { url } = req.body;

  try {
    // scrape product data
    const { price, title, imageUrl } = await scrapeAmazonPrice(url);

    // save to database
    const { data, error } = await supabase
      .from("tracked_products")
      .insert([
        {
          url,
          current_price: price,
          title,
          image_url: imageUrl,
        },
      ])
      .select();

    if (error) throw error;

    res.json({
      price,
      title,
      imageUrl,
      dbRecord: data[0],
    });
  } catch (error) {
    console.error("scraping error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`scraper api running on http://localhost:${PORT}`);
});
