export default function ProgressBar({ progress }) {
  const { current, total, fileName } = progress;

  if (!total) return null;

  const percent = Math.round((current / total) * 100);

  return (
    <div className="progress">
      <div className="progress-top">
        <span>
          Processing {current} / {total}
        </span>

        <span className="progress-percent">
          {percent}%
        </span>
      </div>

      {fileName && (
        <div className="progress-file">
          {fileName}
        </div>
      )}

      <div className="progress-bar-bg">
        <div
          className="progress-bar"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}