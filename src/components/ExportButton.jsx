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
    <div style={styles.wrapper}>
      <button
        onClick={downloadZip}
        disabled={disabled}
        style={{
          ...styles.button,
          ...(disabled ? styles.disabled : {}),
        }}
      >
        {loading ? "Packaging..." : "Download ZIP"}
      </button>

      <div style={styles.subtext}>
        {hasFiles
          ? `${files.length} files ready`
          : "No files uploaded"}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    fontFamily: "sans-serif",
  },

  button: {
    padding: "10px 16px",
    background: "#111",
    color: "white",
    border: "1px solid #333",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },

  disabled: {
    opacity: 0.4,
    cursor: "not-allowed",
    background: "#1a1a1a",
    border: "1px solid #222",
  },

  subtext: {
    fontSize: "11px",
    opacity: 0.6,
  },
};