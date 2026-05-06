import DonateButton from "./DonateButton";

export default function About() {
  return (
    <div className="panel about">
      <h2 className="about-title">About this tool</h2>

      <p className="about-text">
        This image optimizer is designed to be fast, simple, and
        privacy-friendly. You can upload individual images or entire folders,
        and everything is processed directly in your browser — your files never
        leave your device.
      </p>

      <p className="about-text">
        The goal is to give you a lightweight tool that just works, without
        requiring uploads, accounts, or complicated settings. Whether you're
        optimizing images for a website, a project, or just saving space, you
        get instant results with minimal effort.
      </p>

      {/* highlight block */}
      <div className="about-highlight">
        <strong>🔒 Privacy first:</strong> your images are never uploaded.
        Everything happens locally in your browser.
      </div>

      <h3 className="about-subtitle">How it works</h3>

      <p className="about-text">
        Images are processed using modern browser APIs and optimized using Webp
        workers, which means multiple images can be handled in parallel without
        slowing down your device. The result is a fast and responsive experience
        even with large folders.
      </p>

      <h3 className="about-subtitle">Supported features</h3>

      <ul className="about-list">
        <li>Upload single images or entire folders</li>
        <li>Adjust compression quality</li>
        <li>Batch processing with parallel workers</li>
        <li>Download everything as a ZIP file</li>
      </ul>

      <p className="about-footer">
        This project is free to use. If it helped you, consider supporting it.
      </p>
      <DonateButton />
    </div>
  );
}
