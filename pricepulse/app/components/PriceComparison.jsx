"use client";
import { useState, useEffect } from "react";

const PriceComparison = ({ product }) => {
  const [comparisons, setComparisons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate price comparison data
    // In a real app, this would call an API to search other platforms
    const simulateComparison = () => {
      const basePrice = parseFloat(
        product.current_price?.replace(/[₹,]/g, "") || "0"
      );

      const mockComparisons = [
        {
          platform: "Flipkart",
          price: (basePrice * (0.95 + Math.random() * 0.1)).toFixed(2),
          url: `https://www.flipkart.com/search?q=${encodeURIComponent(
            product.title || ""
          )}`,
          available: true,
        },
        {
          platform: "Meesho",
          price: (basePrice * (0.85 + Math.random() * 0.2)).toFixed(2),
          url: `https://www.meesho.com/search?q=${encodeURIComponent(
            product.title || ""
          )}`,
          available: true,
        },
        {
          platform: "Croma",
          price: (basePrice * (1.05 + Math.random() * 0.1)).toFixed(2),
          url: `https://www.croma.com/searchB?q=${encodeURIComponent(
            product.title || ""
          )}`,
          available: Math.random() > 0.3,
        },
      ];

      setComparisons(mockComparisons);
      setLoading(false);
    };

    const timer = setTimeout(simulateComparison, 2000);
    return () => clearTimeout(timer);
  }, [product]);

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-blue-400 mb-4">
          price comparison
        </h2>
        <div className="text-center py-8 text-gray-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
          <p>Searching other platforms...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-blue-400 mb-4">
        price comparison
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="pb-2 text-gray-300">Platform</th>
              <th className="pb-2 text-gray-300">Price</th>
              <th className="pb-2 text-gray-300">Status</th>
              <th className="pb-2 text-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-700">
              <td className="py-3 font-medium text-orange-400">Amazon</td>
              <td className="py-3 text-green-400">{product.current_price}</td>
              <td className="py-3 text-green-400">✓ Available</td>
              <td className="py-3">
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  View →
                </a>
              </td>
            </tr>
            {comparisons.map((comp, index) => (
              <tr key={index} className="border-b border-gray-700">
                <td className="py-3 font-medium">{comp.platform}</td>
                <td className="py-3 text-green-400">
                  {comp.available ? `₹${comp.price}` : "-"}
                </td>
                <td className="py-3">
                  {comp.available ? (
                    <span className="text-green-400">✓ Available</span>
                  ) : (
                    <span className="text-gray-400">✗ Not found</span>
                  )}
                </td>
                <td className="py-3">
                  {comp.available && (
                    <a
                      href={comp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Search →
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        * Prices are estimates and may not reflect actual availability. Click
        links to verify.
      </p>
    </div>
  );
};

export default PriceComparison;
