const SimpleLineChart = ({ data, color = "#3b82f6", height = 60 }) => {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min

  const points = data
    .map((val, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((val - min) / range) * 100
      return `${x},${y}`
    })
    .join(" ")

  return (
    <div className="w-full" style={{ height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        <polyline fill="none" stroke={color} strokeWidth="3" points={points} />
        <polygon fill={color} fillOpacity="0.1" points={`0,100 ${points} 100,100`} />
      </svg>
    </div>
  )
}

export default SimpleLineChart
