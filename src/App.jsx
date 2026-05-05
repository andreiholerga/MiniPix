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
    files.length === progress.total;

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
    const uniqueFiles = newFiles.filter(
      (f) => !files.some((existing) => existing.name === f.name)
    );

    const updated = [...files, ...uniqueFiles];

    setFiles(updated);
    processFiles(updated);
  };

  const processFiles = async (filesToProcess) => {
    const pool = poolRef.current;
    if (!pool) return;

    setStartTime(Date.now());

    const total = filesToProcess.length;

    setProgress({
      current: 0,
      total,
      fileName: "",
    });

    const results = [];

    for (let i = 0; i < filesToProcess.length; i++) {
      const file = filesToProcess[i];

      setProgress({
        current: i,
        total,
        fileName: file.webkitRelativePath || file.name,
      });

      const result = await pool.addTask(file, 0.75);

      results.push({
        name: file.name,
        path: file.webkitRelativePath,

        blob: result.blob,

        originalSize: file.size,
        newSize: result.newSize ?? result.size ?? result.originalSize ?? 0,
      });

      setProcessed([...results]);
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
      <h1>Image Optimizer</h1><br/>

      <Dropzone onFiles={handleFiles} />

      {/* BIG STATS ONLY WHEN DONE */}
      {isDone && <BigStat savedPercent={savedPercent} />}

      <ProgressBar progress={progress} />

      <TimeLeft seconds={timeLeft} />

      <ExportButton processed={processed} files={files} />

      <FileList files={files} processed={processed} />
    </div>
  );
}