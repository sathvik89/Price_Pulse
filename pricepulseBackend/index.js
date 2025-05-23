const express = require("express");
const cors = require("cors");
const cron = require("node-cron");

const scrapeAmazonPrice = require("./scraper");
const supabase = require("./db");
const { sendPriceAlert } = require("./emailService");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/scrape", async (req, res) => {
  const { url } = req.body;

  try {
    const { price, title, imageUrl } = await scrapeAmazonPrice(url);

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
    console.error("Error while scraping:", error.message);
    res.status(500).json({ error: error.message });
  }
});

cron.schedule("0 * * * *", async () => {
  console.log("Running hourly price tracking...");

  try {
    const { data: products, error } = await supabase
      .from("tracked_products")
      .select("*");

    if (error) throw error;

    for (const product of products) {
      try {
        const { price } = await scrapeAmazonPrice(product.url);

        await supabase
          .from("tracked_products")
          .update({ current_price: price })
          .eq("id", product.id);

        await supabase
          .from("price_history")
          .insert([{ product_id: product.id, price }]);

        const numericPrice = Number(price.replace(/[^0-9.]/g, ""));

        const { data: alerts } = await supabase
          .from("price_alerts")
          .select("*")
          .eq("product_id", product.id)
          .eq("is_triggered", false);

        for (const alert of alerts) {
          if (numericPrice <= alert.target_price) {
            await sendPriceAlert(
              alert.email,
              product,
              numericPrice,
              alert.target_price
            );

            await supabase
              .from("price_alerts")
              .update({ is_triggered: true })
              .eq("id", alert.id);
          }
        }
      } catch (productError) {
        console.error(
          `Error updating product ID ${product.id}:`,
          productError.message
        );
      }
    }
  } catch (cronError) {
    console.error("Error during scheduled tracking:", cronError.message);
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Scraper API is running at http://localhost:${PORT}`);
});
