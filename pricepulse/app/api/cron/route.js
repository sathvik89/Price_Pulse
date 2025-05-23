import { supabase } from "@/lib/supabaseClient";
import { scrapeAmazonPrice } from "../../../../pricepulseBackend/scraper";
import { sendPriceAlert } from "../../../../pricepulseBackend/emailService";

export async function POST(request) {
  //Check for valid authorization header
  const authHeader = request.headers.get("authorization");
  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // Fetch all tracked products from Supabase
    const { data: products, error } = await supabase
      .from("tracked_products")
      .select("*");

    if (error) throw error;

    //Process each product one by one
    for (const product of products) {
      try {
        // a. Scrape current price
        const { price: rawPrice } = await scrapeAmazonPrice(product.url);

        //Update product's current price
        await supabase
          .from("tracked_products")
          .update({ current_price: rawPrice })
          .eq("id", product.id);

        //Log price in history
        await supabase
          .from("price_history")
          .insert([{ product_id: product.id, price: rawPrice }]);

        //Convert to number for comparison
        const numericPrice = Number(rawPrice.replace(/[^0-9.]/g, ""));

        // Fetch untriggered alerts for this product
        const { data: alerts } = await supabase
          .from("price_alerts")
          .select("*")
          .eq("product_id", product.id)
          .eq("is_triggered", false);

        for (const alert of alerts) {
          const shouldTrigger = numericPrice <= alert.target_price;

          if (shouldTrigger) {
            //Send alert email
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
          }
        }
      } catch (err) {
        console.error(
          `⚠️ Error updating product ID ${product.id}:`,
          err.message
        );
      }
    }

    return Response.json({ success: true, message: "Price check complete" });
  } catch (err) {
    console.error("🚨 Cron job failed:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
