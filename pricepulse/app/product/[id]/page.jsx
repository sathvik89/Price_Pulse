import { supabase } from "@/lib/supabaseClient";
import ProductDetails from "@/app/components/ProductDetails";
import PriceHistory from "@/app/components/PriceHistory";
import PriceAlert from "@/app/components/PriceAlert";
import PriceComparison from "@/app/components/PriceComparison";
import BackButton from "@/app/components/BackButton";

export const revalidate = 0; // disable caching

export default async function ProductPage({ params }) {
  // Fetch product details
  const { data: product, error: productError } = await supabase
    .from("tracked_products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (productError) {
    console.error("Error fetching product:", productError);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0e0e20] to-[#000333] text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-400">
            The product you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  // Fetch price history
  const { data: priceHistory, error: historyError } = await supabase
    .from("price_history")
    .select("*")
    .eq("product_id", params.id)
    .order("timestamp", { ascending: true });

  if (historyError) {
    console.error("Error fetching price history:", historyError);
  }

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-[#0e0e20] to-[#000333] p-8 sm:p-20 gap-8 font-sans text-white">
      <div className="flex items-center">
        <BackButton />
        <h1 className="text-4xl font-bold ml-4 text-blue-500">pricepulse</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Product details */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 h-full">
            <ProductDetails product={product} />
          </div>
        </div>

        {/* Right column - Price history and comparison */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">
              price history
            </h2>
            <PriceHistory priceHistory={priceHistory || []} />
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <PriceAlert product={product} />
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <PriceComparison product={product} />
          </div>
        </div>
      </div>
    </main>
  );
}
