import { useEffect, useRef, useState } from "react";
import Dropzone from "./components/Dropzone";
import FileList from "./components/FileList";
import ExportButton from "./components/ExportButton";
import { WorkerPool } from "./utils/workerPool";
import ProgressBar from "./components/ProgressBar";
import BigStat from "./components/BigStat";
import TimeLeft from "./components/TimeLeft";

export default function App() {
  const [files, setFiles] = useState([]);
  const [processed, setProcessed] = useState([]);
  const [startTime, setStartTime] = useState(null);

  const poolRef = useRef(null);

  const [progress, setProgress] = useState({
    current: 0,
    total: 0,
    fileName: "",
  });

  // -----------------------------
  // Worker Pool init
  // -----------------------------
  useEffect(() => {
    poolRef.current = new WorkerPool(4);

    return () => {
      poolRef.current?.terminate();
    };
  }, []);

  // -----------------------------
  // Derived state
  // -----------------------------
  const isDone =
    files.length > 0 &&
    processed.length === files.length &&
    progress.total > 0;

  const totalOriginal = processed.reduce(
    (sum, f) => sum + (Number(f.originalSize) || 0),
    0
  );

  const totalNew = processed.reduce(
    (sum, f) => sum + (Number(f.newSize) || 0),
    0
  );

  const savedPercent =
    totalOriginal > 0
      ? Math.round(100 - (totalNew / totalOriginal) * 100)
      : 0;

  // -----------------------------
  // Time left calc
  // -----------------------------
  let timeLeft = null;

  if (startTime && progress.current > 0) {
    const elapsed = Date.now() - startTime;
    const avgPerFile = elapsed / progress.current;
    const remaining = progress.total - progress.current;

    timeLeft = Math.max(
      0,
      Math.round((avgPerFile * remaining) / 1000)
    );
  }

  // -----------------------------
  // File handling
  // -----------------------------
  const handleFiles = (newFiles) => {
    // ✅ FILTER FIRST (critical fix)
    const validFiles = newFiles.filter((file) => {
      const isImageByType = file.type?.startsWith("image/");
      const isImageByName =
        /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(file.name);

      return isImageByType || isImageByName;
    });

    // ✅ proper dedupe (folder-safe)
    const getId = (f) =>
      f.webkitRelativePath || f.name;

    const uniqueFiles = validFiles.filter(
      (f) =>
        !files.some(
          (existing) =>
            getId(existing) === getId(f)
        )
    );

    const updated = [...files, ...uniqueFiles];

    setFiles(updated);
    processFiles(updated);
  };

  const processFiles = async (filesToProcess) => {
    const pool = poolRef.current;

    // keep ONLY valid files here too (safety layer)
    const validFiles = filesToProcess.filter((file) => {
      const isImageByType = file.type?.startsWith("image/");
      const isImageByName =
        /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(file.name);

      return isImageByType || isImageByName;
    });

    const total = validFiles.length;

    setStartTime(Date.now());

    setProgress({
      current: 0,
      total,
      fileName: "",
    });

    const results = [];

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];

      setProgress({
        current: i,
        total,
        fileName: file.webkitRelativePath || file.name,
      });

      try {
        const result = await pool.addTask(file, 0.75);

        results.push({
          name: file.name,
          path: file.webkitRelativePath || file.name,
          blob: result.blob,
          originalSize: file.size,
          newSize: result.size,
        });

        setProcessed([...results]);
      } catch (err) {
        console.error("Failed file:", file.name, err);
      }
    }

    setProgress({
      current: total,
      total,
      fileName: "",
    });
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Image Optimizer</h1>
      <br />

      <Dropzone onFiles={handleFiles} />
      <form action="https://www.paypal.com/donate" method="post" target="_top">
<input type="hidden" name="hosted_button_id" value="PC59QRDDGWREY" />
<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
<img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
</form>

      {isDone && <BigStat savedPercent={savedPercent} />}

      <ProgressBar progress={progress} />

      <TimeLeft seconds={timeLeft} />

      <ExportButton processed={processed} files={files} />

      <FileList files={files} processed={processed} />
      


      <a
        href="/privacy"
        style={{
          fontSize: 12,
          color: "gray",
          marginTop: 20,
          display: "inline-block",
        }}
      >
        Privacy Policy
      </a>
    </div>
  );
}