"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Search from "./Search";

const Form = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim whitespace and validate URL
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError("please enter a url");
      return;
    }

    // Better Amazon URL validation
    if (!trimmedUrl.includes("amazon.")) {
      setError("please enter a valid Amazon URL");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/scrape`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: trimmedUrl }), // Use trimmed URL
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "failed to fetch price");
      }

      const { price } = await res.json();
      alert(`success! price: ${price}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex justify-around items-center w-full border border-gray-600 rounded-lg overflow-hidden"
      >
        <input
          type="url"
          placeholder="Enter Amazon product URL..."
          className="w-full px-4 py-3 bg-transparent focus:outline-none placeholder:text-gray-400"
          value={url}
          onChange={(e) => setUrl(e.target.value)} // This was missing!
        />
        <Search loading={loading} />
      </form>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </>
  );
};

export default Form;
