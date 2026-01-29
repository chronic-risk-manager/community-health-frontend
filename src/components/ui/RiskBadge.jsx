const RiskBadge = ({ level }) => {
  const styles = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-orange-100 text-orange-700",
    Low: "bg-emerald-100 text-emerald-700",
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${styles[level]}`}>
      {level} Risk
    </span>
  )
}

export default RiskBadge
