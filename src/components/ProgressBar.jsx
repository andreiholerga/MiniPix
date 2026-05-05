export default function ProgressBar({ progress }) {
  const { current, total, fileName } = progress;

  if (!total) return null;

  const percent = Math.round((current / total) * 100);

  return (
    <div style={styles.wrapper}>
      <div style={styles.top}>
        <span>
          Processing: {current} / {total}
        </span>

        <span style={styles.percent}>{percent}%</span>
      </div>

      {fileName && (
        <div style={styles.file}>
          {fileName}
        </div>
      )}

      <div style={styles.barBg}>
        <div
          style={{
            ...styles.bar,
            width: `${percent}%`,
          }}
        />
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    marginTop: "10px",
    marginBottom: "15px",
    fontFamily: "sans-serif",
    fontSize: "12px",
  },

  top: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "4px",
  },

  percent: {
    opacity: 0.7,
  },

  file: {
    fontSize: "11px",
    opacity: 0.6,
    marginBottom: "6px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  barBg: {
    height: "6px",
    background: "#222",
    borderRadius: "4px",
    overflow: "hidden",
  },

  bar: {
    height: "100%",
    background: "#4ade80",
    transition: "width 0.2s ease",
  },
};