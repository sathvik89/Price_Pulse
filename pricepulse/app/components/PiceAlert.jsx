"use client";
import { useState } from "react";

const PriceAlert = ({ product }) => {
  const [email, setEmail] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !targetPrice) {
      setError("Please fill in all fields");
      return;
    }

    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid price");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/alerts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: product.id,
            email,
            targetPrice: price,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to set alert");
      }

      setSuccess(true);
      setEmail("");
      setTargetPrice("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Extract numeric value from current price
  const currentPriceText = product.current_price || "0";
  const numericCurrentPrice = parseFloat(currentPriceText.replace(/[₹,]/g, ""));

  return (
    <div>
      <h2 className="text-2xl font-semibold text-blue-400 mb-4">
        price alerts
      </h2>

      {success && (
        <div className="mb-4 p-3 bg-green-900 border border-green-600 rounded text-green-300">
          ✅ Alert set successfully! You'll receive an email when the price
          drops.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            placeholder="your-email@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Target Price (₹)
          </label>
          <input
            type="number"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            placeholder={`Less than ₹${numericCurrentPrice.toFixed(2)}`}
            min="1"
            step="0.01"
            required
          />
        </div>

        {error && <div className="text-red-400 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Setting Alert..." : "Set Price Alert"}
        </button>

        <p className="text-xs text-gray-400">
          You'll receive an email when the price drops below ₹
          {targetPrice || "your target"}
        </p>
      </form>
    </div>
  );
};

export default PriceAlert;
