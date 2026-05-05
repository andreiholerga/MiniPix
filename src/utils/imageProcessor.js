export async function convertToWebP(file, quality = 75) {
  const imagePool = new ImagePool();

  const arrayBuffer = await file.arrayBuffer();
  const image = imagePool.ingestImage(arrayBuffer);

  await image.encode({
    webp: {
      quality,
    },
  });

  const encoded = await image.encodedWith.webp;

  await imagePool.close();

  return {
    blob: new Blob([encoded.binary], { type: "image/webp" }),
    size: encoded.binary.byteLength,
  };
}