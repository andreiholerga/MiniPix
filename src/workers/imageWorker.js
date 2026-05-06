self.onmessage = async (e) => {
  const { id, file, quality } = e.data;

  try {
    if (!file || !file.type?.startsWith("image/")) {
      self.postMessage({ id, error: "not-image" });
      return;
    }

    const bitmap = await createImageBitmap(file);

    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(bitmap, 0, 0);

    const safeQuality = Math.max(0.1, Math.min(quality, 0.8));

    const blob = await canvas.convertToBlob({
      type: "image/webp",
      quality: safeQuality,
    });

    // 🔥 KEY PART
    const isWebp = file.type === "image/webp";

    let finalBlob = blob;
    let finalSize = blob.size;
    let usedOriginal = false;

    if (blob.size >= file.size) {
      // ❌ worse result
      if (isWebp) {
        // NEVER upscale webp
        finalBlob = file;
        finalSize = file.size;
        usedOriginal = true;
      } else {
        // OPTIONAL: you can choose behavior here

        // 👉 OPTION A (recommended): NEVER allow bigger files
        finalBlob = file;
        finalSize = file.size;
        usedOriginal = true;

        // 👉 OPTION B (if you insist):
        // allow conversion anyway (comment above block)
      }
    }

    self.postMessage({
      id,
      result: {
        blob: finalBlob,
        size: finalSize,
        usedOriginal, // 👈 useful for UI
      },
    });
  } catch (err) {
    self.postMessage({
      id,
      error: err.message,
    });
  }
};
