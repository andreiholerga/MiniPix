self.onmessage = async (e) => {
  const { id, file, quality } = e.data;

  try {
    const bitmap = await createImageBitmap(file);

    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(bitmap, 0, 0);

    // 🔥 CLAMP HERE (IMPORTANT)
    const safeQuality = Math.max(0.1, Math.min(quality, 0.8));

    const blob = await canvas.convertToBlob({
      type: "image/webp",
      quality: safeQuality,
    });

    const buffer = await blob.arrayBuffer();

    self.postMessage({
      id,
      result: {
        blob: new Blob([buffer], { type: "image/webp" }),
        size: buffer.byteLength,
      },
    });

  } catch (err) {
    self.postMessage({
      id,
      error: err.message,
    });
  }
};