self.onmessage = async (e) => {
  const { id, file, quality = 0.75 } = e.data;

  try {
    const bitmap = await createImageBitmap(file);

    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(bitmap, 0, 0);

    const blob = await canvas.convertToBlob({
      type: "image/webp",
      quality,
    });

    const originalSize = file.size;
    const newSize = blob.size;

    const improved = newSize < originalSize;

    self.postMessage({
      id,
      result: {
        name: file.name,
        blob: improved ? blob : blob, // always blob (IMPORTANT)
        originalSize,
        newSize: improved ? newSize : originalSize,
        improved,
      },
    });

  } catch (err) {
    self.postMessage({
      id,
      error: err.message,
    });
  }
};