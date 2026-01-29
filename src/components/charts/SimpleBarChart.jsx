const SimpleBarChart = ({ data, labels }) => {
  const max = Math.max(...data)

  return (
    <div className="flex items-end justify-between h-40 w-full gap-2 pt-6">
      {data.map((val, idx) => (
        <div key={idx} className="flex flex-col items-center flex-1">
          <div
            className="w-full max-w-[30px] rounded-t-sm"
            style={{ height: `${(val / max) * 100}%` }}
          />
          <span className="text-xs mt-2">{labels[idx]}</span>
        </div>
      ))}
    </div>
  )
}

export default SimpleBarChart
