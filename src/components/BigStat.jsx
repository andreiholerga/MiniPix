export default function BigStat({ savedPercent }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.label}>Total saved</div>

      <div style={styles.value}>
        {savedPercent}%
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    marginTop: "10px",
    marginBottom: "15px",
    padding: "12px 16px",
    background: "#111",
    border: "1px solid #333",
    borderRadius: "10px",
    display: "inline-block",
    fontFamily: "sans-serif",
  },

  label: {
    fontSize: "11px",
    opacity: 0.6,
    marginBottom: "4px",
  },

  value: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#4ade80",
  },
};