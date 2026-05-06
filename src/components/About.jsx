export default function About() {
  return (
    <div className="panel about">
      <h2 className="about-title">About this tool</h2>

      <p className="about-text">
        Image Optimizer compresses your images locally in the browser using Web Workers.
        No uploads, no server processing.
      </p>

      <div className="about-grid">
        <div>
          <div className="about-label">Privacy</div>
          <div className="about-value">All processing is client-side</div>
        </div>

        <div>
          <div className="about-label">Formats</div>
          <div className="about-value">JPG, PNG, WebP, AVIF</div>
        </div>

        <div>
          <div className="about-label">Speed</div>
          <div className="about-value">Multi-threaded Web Workers</div>
        </div>
      </div>
    </div>
  );
}