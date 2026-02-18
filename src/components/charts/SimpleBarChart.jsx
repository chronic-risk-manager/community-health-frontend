import { useEffect, useState } from "react";

const SimpleBarChart = ({ data = [], labels = [], height = 220 }) => {
  const [animatedData, setAnimatedData] = useState(data.map(() => 0));
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const max = Math.max(...data, 1);

  useEffect(() => {
    setAnimatedData(data);
  }, [data]);

  return (
    <div
      className="relative w-full"
      style={{ height }}
    >
      {/* Gridlines only (no numbers) */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute left-0 right-0 border-t border-slate-200"
          style={{ bottom: `${(i / 4) * 100}%` }}
        />
      ))}

      {/* Bars */}
      <div className="absolute inset-0 flex items-end justify-around px-4">
        {animatedData.map((val, i) => {
          const barHeight = (val / max) * height;

          return (
            <div
              key={i}
              className="flex flex-col items-center justify-end h-full relative"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Tooltip */}
              {hoveredIndex === i && (
                <div className="absolute -top-8 bg-slate-900 text-white text-xs px-2 py-1 rounded shadow-md">
                  {val}
                </div>
              )}

              {/* Bar */}
              <div
                className="w-10 rounded-t-lg transition-all duration-700 ease-out bg-gradient-to-t from-blue-600 to-blue-400"
                style={{
                  height: `${barHeight}px`,
                }}
              />

              {/* Label */}
              <span className="text-xs mt-3 text-slate-600 font-medium">
                {labels[i]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SimpleBarChart;
