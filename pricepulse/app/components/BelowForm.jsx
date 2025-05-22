import React from "react";

const BelowForm = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 mt-12 shadow-lg">
      <h2 className="text-xl font-semibold mb-4">
        Enter an Amazon product URL to get started
      </h2>
      <p className="mb-6 text-gray-400">
        Track price history, set alerts, and compare prices across multiple
        platforms
      </p>
      <div className="flex justify-around">
        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
          <span className="mr-2">•</span>
          Track prices
        </div>
        <div className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center">
          <span className="mr-2">•</span>
          Get alerts
        </div>
        <div className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center">
          <span className="mr-2">•</span>
          Compare platforms
        </div>
      </div>
    </div>
  );
};

export default BelowForm;
