import { useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";

export default function Dropzone({ onFiles }) {
  const folderInputRef = useRef(null);

   const onDrop = useCallback((acceptedFiles) => {
    onFiles(acceptedFiles);
  }, [onFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
  onDrop,
  multiple: true,
  accept: {
    "image/*": [],
  },
});

  const handleFolderUpload = (e) => {
    onFiles(Array.from(e.target.files));
  };

  return (
    <div style={{ marginBottom: 20 }}>

      {/* ================= DROPZONE ================= */}
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #444",
          padding: 40,
          textAlign: "center",
          borderRadius: 12,
          cursor: "pointer",
          background: "#111",
          color: "#eee",
        }}
      >
        <input {...getInputProps()} type="file"
          multiple
          accept="image/*" />

        {isDragActive ? (
          <p>Drop files here...</p>
        ) : (
          <p>Drag & drop images or use buttons below</p>
        )}
      </div>

      {/* ================= INPUTS ================= */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 12,
          justifyContent: "center",
        }}
      >

        {/* 📁 FOLDER INPUT */}
        <button
          onClick={() => folderInputRef.current?.click()}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #333",
            background: "#161616",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          📁 Upload Folder
        </button>

        <input {...getInputProps()}
          ref={folderInputRef}
          type="file"
          multiple
          accept="image/*"
          webkitdirectory="true"
          style={{ display: "none" }}
          onChange={handleFolderUpload}
        />
      </div>
    </div>
  );
}