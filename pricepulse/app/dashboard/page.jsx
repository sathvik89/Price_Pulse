import Form from "../components/Form";
import BelowForm from "../components/BelowForm";
import InstrumentsList from "../components/InstrumentsList";
import { supabase } from "../../lib/supabaseClient";

const Page = async () => {
  // fetching instruments from Supabase (server-side)
  const { data: instruments, error } = await supabase
    .from("instruments")
    .select("*");

  if (error) {
    console.error("Supabase error:", error);
  }

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-[#0e0e20] to-[#000333] items-center justify-center p-8 sm:p-20 gap-12 font-sans text-white">
      <h1 className="text-5xl font-bold mb-4 text-blue-500">PricePulse</h1>
      <h3 className="text-lg text-gray-300 mb-8 text-center">
        Track, compare, and save on your favorite Amazon products
      </h3>

      <div className="w-full max-w-5xl bg-gray-800 rounded-lg shadow-lg p-6">
        <Form />
      </div>

      <BelowForm />

      {/* instruments list for testing the connection of database with the app */}
      <div className="w-full max-w-5xl bg-gray-900 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-blue-400 mb-4">
          Instruments List
        </h2>
        <InstrumentsList instruments={instruments} />
      </div>
    </main>
  );
};

export default Page;
