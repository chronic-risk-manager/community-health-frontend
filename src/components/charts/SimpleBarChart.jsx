const SimpleBarChart = ({ data, labels }) => {
  // Use 1 as fallback to prevent division by zero if data is empty
  const max = Math.max(...data, 1);

  return (
    <div className="flex items-end justify-between h-40 w-full gap-2 pt-6">
      {data.map((val, idx) => (
        <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end">
          <div className="w-full flex items-end justify-center h-full">
            <div
              // Added 'bg-indigo-500' so the bar is visible
              className="w-full max-w-[30px] rounded-t-sm bg-indigo-500 hover:bg-indigo-600 transition-colors"
              style={{ height: `${(val / max) * 100}%` }}
              title={`${labels[idx]}: ${val}`}
            />
          </div>
          <span className="text-xs mt-2 text-slate-500 font-medium">{labels[idx]}</span>
        </div>
      ))}
    </div>
  )
}

export default SimpleBarChart