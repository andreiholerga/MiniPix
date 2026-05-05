import JSZip from "jszip";

export async function createZip(files) {
  const zip = new JSZip();

  files.forEach((file) => {
    zip.file(file.name.replace(/\.[^/.]+$/, ".webp"), file.blob);
  });

  const blob = await zip.generateAsync({ type: "blob" });

  return blob;
}