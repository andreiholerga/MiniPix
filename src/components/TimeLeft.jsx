export default function TimeLeft({ seconds }) {
  if (!seconds && seconds !== 0) return null;

  const format = (s) => {
    if (s < 60) return `${s}s`;
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}m ${sec}s`;
  };

  return (
    <div style={styles.box}>
      ⏳ Time left: {format(seconds)}
    </div>
  );
}

const styles = {
  box: {
    marginTop: "8px",
    fontSize: "12px",
    opacity: 0.7,
    fontFamily: "sans-serif",
  },
};