export default function TimeLeft({ seconds }) {
  if (!seconds && seconds !== 0) return null;

  const format = (s) => {
    if (s < 60) return `${s}s`;
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}m ${sec}s`;
  };

  return (
    <div className="time-left">
      ⏳ Time left: <span className="time-value">{format(seconds)}</span>
    </div>
  );
}
