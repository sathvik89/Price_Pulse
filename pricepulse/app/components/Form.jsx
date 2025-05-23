"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Search from "./Search";

const Form = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedUrl = url.trim();

    // Clear previous states
    setError("");
    setSuccess(false);

    // Validate URL
    if (!trimmedUrl) {
      setError("Please enter a URL");
      return;
    }

    // Better Amazon URL validation
    if (!isValidAmazonUrl(trimmedUrl)) {
      setError("Please enter a valid Amazon product URL");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/scrape`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: trimmedUrl }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Failed to track product. Please try again or contact support."
        );
      }

      setSuccess(true);
      setUrl("");

      // Refresh data after 1.5s to allow backend processing
      setTimeout(() => router.refresh(), 1500);
    } catch (err) {
      // User-friendly error messages
      const errorMessage = err.message.includes("Failed to find element")
        ? "We're having trouble reading this product page. Amazon may have updated their layout."
        : err.message;

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Helper function for URL validation
  const isValidAmazonUrl = (url) => {
    try {
      const parsedUrl = new URL(url);
      return (
        parsedUrl.hostname.includes("amazon.") &&
        parsedUrl.pathname.includes("/dp/")
      );
    } catch {
      return false;
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="flex justify-around items-center w-full border border-gray-600 rounded-lg overflow-hidden"
      >
        <input
          type="url"
          placeholder="Paste Amazon product URL (e.g., https://www.amazon.in/dp/B0ABC123)..."
          className="w-full px-4 py-3 bg-transparent focus:outline-none placeholder:text-gray-400"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError(""); // Clear error when typing
          }}
          disabled={loading}
        />
        <Search loading={loading} />
      </form>

      {error && (
        <p className="text-red-500 text-sm mt-2 animate-fadeIn">⚠️ {error}</p>
      )}
      {success && (
        <p className="text-green-500 text-sm mt-2 animate-fadeIn">
          ✓ Product tracking started successfully! Updating your list...
        </p>
      )}
    </div>
  );
};

export default Form;
