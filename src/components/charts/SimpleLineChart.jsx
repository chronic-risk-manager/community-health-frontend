import { useEffect, useState } from "react";

const SimpleLineChart = ({ data = [], color = "#ef4444" }) => {
  const [animatedData, setAnimatedData] = useState(data.map(() => 0));
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedData(data), 150);
    return () => clearTimeout(timeout);
  }, [data]);

  if (!data.length) return null;

  const max = Math.max(...animatedData);
  const min = Math.min(...animatedData);
  const range = max - min || 1;

  const points = animatedData
    .map((val, index) => {
      const x = (index / (animatedData.length - 1)) * 100;
      const y = 100 - ((val - min) / range) * 90 - 5; // padding top bottom
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="w-full h-64 relative">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Gradient fill */}
        <polygon
          fill={`url(#gradient-${color})`}
          points={`0,100 ${points} 100,100`}
        />

        {/* Line */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          style={{ animation: "drawLine 1.2s ease-out forwards" }}
          points={points}
        />
      </svg>

      {/* Data Points */}
      {animatedData.map((val, idx) => {
        const x = (idx / (animatedData.length - 1)) * 100;
        const y = 100 - ((val - min) / range) * 90 - 5;

        return (
          <div
            key={idx}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: "translate(-50%, -50%)",
            }}
            className="absolute w-3 h-3 rounded-full bg-white shadow-md cursor-pointer"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              className="w-full h-full rounded-full border-2"
              style={{ borderColor: color }}
            />

            {hoveredIndex === idx && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-xs rounded-md shadow-md whitespace-nowrap">
                {val}
              </div>
            )}
          </div>
        );
      })}

      <style>
        {`
          @keyframes drawLine {
            to {
              stroke-dashoffset: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default SimpleLineChart;
