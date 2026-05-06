self.onmessage = async (e) => {
  const { id, file, options } = e.data;

  try {
    if (!file || !file.type?.startsWith("image/")) {
      self.postMessage({ id, error: "not-image" });
      return;
    }

    const bitmap = await createImageBitmap(file);

    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(bitmap, 0, 0);

    const mode = options?.mode || "quality";

    // -----------------------------
    // QUALITY MODE
    // -----------------------------
    if (mode === "quality") {
      const quality = Math.max(0.1, Math.min(options.quality ?? 0.7, 0.9));

      const blob = await canvas.convertToBlob({
        type: "image/webp",
        quality,
      });

      self.postMessage({
        id,
        result: {
          blob,
          size: blob.size,
        },
      });

      return;
    }

    // -----------------------------
    // TARGET SIZE MODE
    // -----------------------------
     const targetBytes = (options.targetSize || 300) * 1024;

    // skip processing if target > file size
    if (targetBytes >= file.size) {
      self.postMessage({
        id,
        result: {
          blob: file,
          size: file.size,
          skipped: true,
        },
      });
      return;
    }

    let minQ = 0.1;
    let maxQ = 0.95;

    let bestBlob = null;
    let bestSize = Infinity;

    // binary search
    for (let i = 0; i < 8; i++) {
      const q = (minQ + maxQ) / 2;

      const blob = await canvas.convertToBlob({
        type: "image/webp",
        quality: q,
      });

      const size = blob.size;

      if (Math.abs(size - targetBytes) < Math.abs(bestSize - targetBytes)) {
        bestBlob = blob;
        bestSize = size;
      }

      // adjust search range
      if (size > targetBytes) {
        maxQ = q;
      } else {
        minQ = q;
      }
    }

    self.postMessage({
      id,
      result: {
        blob: bestBlob,
        size: bestSize,
      },
    });
  } catch (err) {
    self.postMessage({
      id,
      error: err.message,
    });
  }
};