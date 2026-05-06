import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useState } from "react";

export default function ExportButton({ processed, files }) {
  const [loading, setLoading] = useState(false);

  const hasFiles = files && files.length > 0;

  const downloadZip = async () => {
    if (!hasFiles || loading) return;

    setLoading(true);

    try {
      const zip = new JSZip();

      processed.forEach((file) => {
        const path = file.path || file.name;

        zip.file(
          path.replace(/\.[^/.]+$/, ".webp"),
          file.blob
        );
      });

      const content = await zip.generateAsync({ type: "blob" });

      saveAs(content, "images.zip");
    } finally {
      setLoading(false);
    }
  };

  const disabled = !hasFiles || loading;

 return (
  <div className="export">
    <button
      onClick={downloadZip}
      disabled={disabled}
      className={`export-btn ${disabled ? "disabled" : ""}`}
    >
      {loading ? "Packaging..." : "Download ZIP"}
    </button>

    <div className="export-subtext">
      {hasFiles
        ? `${files.length} files ready`
        : "No files uploaded"}
    </div>
  </div>
);
};