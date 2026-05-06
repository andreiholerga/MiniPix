# MiniPix

Free in-browser image optimizer that converts images to WebP and reduces file size instantly, with no uploads, no backend, and no tracking.

---

## What is MiniPix

MiniPix is a fast, privacy-focused image optimization tool that runs entirely in the browser.

It allows you to:
- Convert images to WebP
- Compress images for web use
- Process folders of images in bulk
- Optimize using either quality or target file size
- Download results as a ZIP archive

All processing happens locally on your device. No files are uploaded to any server.

---

## Features

### Core functionality
- WebP conversion as output format
- Image compression with adjustable quality
- Target file size compression mode
- Batch processing with folder support
- Preserves folder structure
- Parallel processing using Web Workers

### Controls
- Quality slider
- Quality presets
- Target file size input mode
- Real-time progress tracking

### User experience
- Live progress bar
- Time remaining estimation
- Before/after file size comparison
- Total savings summary

### Privacy
- No uploads
- No external API calls
- No image storage
- No tracking

---

## How it works

MiniPix is built using a multi-layer architecture:

- React handles the user interface
- A worker pool distributes tasks across multiple Web Workers
- OffscreenCanvas performs image processing and encoding
- A binary search algorithm is used for target file size optimization

### Architecture overview

React UI  
→ Worker Pool (task distribution)  
→ Web Workers (image processing)  
→ OffscreenCanvas (encoding and compression)  
→ Results returned to UI  

---

## Target file size mode

In addition to quality-based compression, MiniPix supports target-based compression.

Instead of selecting a quality value, the user specifies a desired output size (for example 300KB), and the system automatically adjusts compression to reach the closest possible result.

This is achieved using an iterative binary search over WebP quality levels.

---

## Use cases

- Website image optimization
- SEO performance improvements
- Blog and CMS image preparation
- Portfolio and design asset optimization
- Bulk conversion of image libraries

---

## Technology stack

- React
- Web Workers
- OffscreenCanvas API
- WebP encoding
- JSZip for file export
- React Dropzone for file input

---

## Performance

MiniPix uses a worker pool system to process images in parallel without blocking the main thread.

Key characteristics:
- Non-blocking UI
- Parallel image processing
- Efficient task queue system
- Scalable worker architecture

---

## Privacy

MiniPix is fully client-side.

- No images are uploaded
- No server-side processing
- No analytics or tracking
- No data persistence

---

## Installation

```bash
npm install
npm run dev
