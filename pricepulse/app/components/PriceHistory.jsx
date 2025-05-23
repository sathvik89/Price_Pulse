"use client";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const PriceHistory = ({ priceHistory }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    
    if (!priceHistory || priceHistory.length < 1) {
      return;
    }
    
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    // date labels
    const labels = priceHistory.map((entry) => {
      const date = new Date(entry.timestamp);
      return date.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    });

    const prices = priceHistory.map((entry) => {
      const priceString = entry.price;
      const numericPrice = Number.parseFloat(
        priceString.replace(/[^0-9.]/g, "")
      );
      return numericPrice;
    });

    // formattingg the numbers like ₹12,345.67
    const formatRupees = (value) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }).format(value);

    // building the chart
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Price",
            data: prices,
            borderColor: "#3B82F6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderWidth: 2,
            tension: 0.3,
            pointBackgroundColor: "#3B82F6",
            pointRadius: 4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#111827",
            titleColor: "#D1D5DB",
            bodyColor: "#FFFFFF",
            borderColor: "#4B5563",
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
              label: (context) => `Price: ${formatRupees(context.parsed.y)}`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: "rgba(75, 85, 99, 0.2)" },
            ticks: {
              color: "#9CA3AF",
              maxRotation: 45,
              minRotation: 45,
            },
          },
          y: {
            grid: { color: "rgba(75, 85, 99, 0.2)" },
            ticks: {
              color: "#9CA3AF",
              callback: (value) => formatRupees(value),
            },
            beginAtZero: false,
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [priceHistory]);

//fallowup
  if (!priceHistory || priceHistory.length < 1) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] bg-gray-800 rounded-xl p-6 shadow-md">
        <p className="text-gray-300 text-base">no price history available</p>
        <p className="text-gray-500 text-sm mt-2">
          price updates are collected hourly
        </p>
      </div>
    );
  }

  // render chart
  return (
    <div className="h-[300px] bg-gray-800 p-4 rounded-xl shadow-md relative">
      <canvas ref={chartRef} />
    </div>
  );
};

export default PriceHistory;
