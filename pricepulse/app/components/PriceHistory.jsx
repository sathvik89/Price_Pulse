"use client";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const PriceHistory = ({ priceHistory }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!priceHistory?.length) {
      return null;
    }

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    // convert timestamps to readable date strings for labels
    const labels = priceHistory.map((entry) =>
      new Date(entry.timestamp).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    );

    // convert price strings to numbers for plotting
    const data = priceHistory.map((entry) => Number(entry.price));

    // create a new line chart with price data
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Price",
            data,
            borderColor: "#3B82F6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderWidth: 2,
            tension: 0.1,
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
            callbacks: {
              label: (ctx) => `₹${ctx.parsed.y.toLocaleString("en-IN")}`,
            },
          },
        },
        scales: {
          y: {
            ticks: {
              callback: (value) => `₹${value.toLocaleString("en-IN")}`,
            },
          },
        },
      },
    });

    // cleanup chart when component unmounts or before re-creating
    return () => chartInstance.current?.destroy();
  }, [priceHistory]);

  if (!priceHistory) return <div>loading...</div>;
  if (!priceHistory.length) return <div>no data yet</div>;

  return (
    <div className="h-80 w-full">
      <canvas ref={chartRef} />
    </div>
  );
};

export default PriceHistory;
