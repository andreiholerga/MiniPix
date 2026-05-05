import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function Dropzone({ onFiles }) {
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

  return (
    <div
      {...getRootProps()}
      style={{
        border: "2px dashed #aaa",
        padding: "40px",
        textAlign: "center",
        borderRadius: "10px",
        cursor: "pointer",
      }}
    >
      <input
  {...getInputProps({
    webkitdirectory: "true",
    directory: "",
  })}
/>
      {isDragActive ? (
        <p>Drop files here...</p>
      ) : (
        <p>Drag & drop images here, or click to select folder</p>
      )}
    </div>
  );
}