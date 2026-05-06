import QualityControl from "./QualityControl";

export default function CompressionControls({
  mode,
  setMode,
  quality,
  setQuality,
  targetSize,
  setTargetSize,
}) {
  return (
    <div className="panel">
      <div className="quality">

        {/* MODE SELECTOR */}
        <div className="quality-header">
          <span>Compression Mode</span>
        </div>

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="button"
        >
          <option value="quality">Quality mode</option>
          <option value="target">Target file size</option>
        </select>

        {/* CONDITIONAL UI */}
        {mode === "quality" ? (
          <QualityControl value={quality} onChange={setQuality} />
        ) : (
          <div style={{ marginTop: 12 }}>
            <div className="quality-header">
              <span>Target size (KB)</span>
            </div>
            <div style={{ marginTop: 12 }}>
                <input
                type="number"
                value={targetSize}
                onChange={(e) => setTargetSize(Number(e.target.value))}
                className="button"
                style={{ width: "100%" }}
                min={50}
                max={5000}
                />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}