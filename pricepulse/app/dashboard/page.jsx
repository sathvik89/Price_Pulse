import Form from "../components/Form";
import BelowForm from "../components/BelowForm";
import AllTrackedProducts from "../components/AllTrackedProducts";
import { supabase } from "@/lib/supabaseClient";

export const revalidate = 0; // disable caching

export default async function Dashboard() {
  // fetch tracked products server-side
  const { data: products, error } = await supabase
    .from("tracked_products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("supabase error:", error);
  }

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-[#0e0e20] to-[#000333] items-center justify-center p-8 sm:p-20 gap-12 font-sans text-white">
      <h1 className="text-5xl font-bold mb-4 text-blue-500">pricepulse</h1>
      <h3 className="text-lg text-gray-300 mb-8 text-center">
        track, compare, and save on your favorite amazon products
      </h3>

      <div className="w-full max-w-5xl bg-gray-800 rounded-lg shadow-lg p-6">
        <Form />
      </div>

      <BelowForm />

      {/* tracked products section */}
      <div className="w-full max-w-5xl bg-gray-900 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-blue-400 mb-4">
          your tracked products
        </h2>
        <AllTrackedProducts serverProducts={products || []} />
      </div>
    </main>
  );
}
