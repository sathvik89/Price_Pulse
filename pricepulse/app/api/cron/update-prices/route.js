import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET(request) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    console.log("🔄 Running Vercel cron job...");

    // Call your backend API to update prices
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cron/update-prices`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.BACKEND_API_SECRET}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const result = await response.json();
    console.log("✅ Cron job completed:", result);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("❌ Cron job failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
