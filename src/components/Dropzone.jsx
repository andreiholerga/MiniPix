import { useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";

export default function Dropzone({ onFiles }) {
  const folderInputRef = useRef(null);

  // -----------------------------
  // DROPZONE (files only)
  // -----------------------------
  const onDrop = useCallback(
    (acceptedFiles) => {
      onFiles(acceptedFiles);
    },
    [onFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/*": [],
    },
  });

  // -----------------------------
  // FOLDER UPLOAD
  // -----------------------------
  const handleFolderUpload = (e) => {
    const files = Array.from(e.target.files || []);
    onFiles(files);

    // reset so same folder can be selected again
    e.target.value = null;
  };

  return (
    <div className="dropzone-wrapper">

      {/* ================= DROPZONE ================= */}
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "active" : ""}`}
      >
        <input {...getInputProps()} />

        {isDragActive ? (
          <p>Drop images here...</p>
        ) : (
          <p>Drag & drop images or use buttons below</p>
        )}
      </div>

      {/* ================= BUTTONS ================= */}
      <div className="dropzone-actions">

        {/* 📁 FOLDER */}
        <button
          onClick={() => folderInputRef.current?.click()}
          className="dropzone-btn"
        >
          📁 Upload Folder
        </button>

        <input
          ref={folderInputRef}
          type="file"
          multiple
          webkitdirectory="true"
          style={{ display: "none" }}
          onChange={handleFolderUpload}
        />
      </div>
    </div>
  );
}