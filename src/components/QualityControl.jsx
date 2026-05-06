import { useState, useEffect } from "react";

export default function QualityControl({ value, onChange }) {
  const [quality, setQuality] = useState(value ?? 0.7);

  useEffect(() => {
    onChange?.(quality);
  }, [quality]);

  const presets = [
    { label: "Low", value: 0.5 },
    { label: "Medium", value: 0.7 },
    { label: "High", value: 0.85 },
  ];

  return (
    <div className="quality">
      <div className="quality-header">
        <span>Quality</span>
        <span className="quality-value">
          {(quality * 100).toFixed(0)}%
        </span>
      </div>

      {/* Slider */}
      <input
        type="range"
        min="0.4"
        max="0.9"
        step="0.01"
        value={quality}
        onChange={(e) => setQuality(Number(e.target.value))}
        className="quality-slider"
        style={{
          "--value": `${((quality - 0.4) / 0.5) * 100}%`
        }}  
      />

      {/* Presets */}
      <div className="quality-presets">
        {presets.map((p) => {
          const active = Math.abs(quality - p.value) < 0.01;

          return (
            <button
              key={p.label}
              onClick={() => setQuality(p.value)}
              className={`preset-btn ${active ? "active" : ""}`}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}