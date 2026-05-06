export default function BigStat({ savedPercent }) {
  return (
    <div className="stat-card">
      <div className="stat-label">Total saved</div>

      <div className="stat-value">
        {savedPercent}%
      </div>
    </div>
  );
}