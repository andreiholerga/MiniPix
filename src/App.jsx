import { useEffect, useRef, useState } from "react";
import Dropzone from "./components/Dropzone";
import FileList from "./components/FileList";
import ExportButton from "./components/ExportButton";
import { WorkerPool } from "./utils/workerPool";
import ProgressBar from "./components/ProgressBar";
import BigStat from "./components/BigStat";
import TimeLeft from "./components/TimeLeft";
import QualityControl from "./components/QualityControl";
import About from "./components/About";
import Onboarding from "./components/Onboarding";
import ThemeToggle from "./components/ThemeToggle";
import DonateButton from "./components/DonateButton";

export default function App() {
  const [files, setFiles] = useState([]);
  const [processed, setProcessed] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [quality, setQuality] = useState(0.7);

  const poolRef = useRef(null);

  const [progress, setProgress] = useState({
    current: 0,
    total: 0,
    fileName: "",
  });

  // Init worker pool
  useEffect(() => {
    poolRef.current = new WorkerPool(4);

    return () => {
      poolRef.current?.terminate();
    };
  }, []);

  const isDone =
    files.length > 0 && processed.length === files.length && progress.total > 0;

  const totalOriginal = processed.reduce(
    (sum, f) => sum + (Number(f.originalSize) || 0),
    0,
  );

  const totalNew = processed.reduce(
    (sum, f) => sum + (Number(f.newSize) || 0),
    0,
  );

  const savedPercent =
    totalOriginal - totalNew > 0
      ? Math.round(100 - (totalNew / totalOriginal) * 100)
      : 0;

  // timeleft calculation

  let timeLeft = null;

  if (startTime && progress.current > 0) {
    const elapsed = Date.now() - startTime;
    const avgPerFile = elapsed / progress.current;
    const remaining = progress.total - progress.current;

    timeLeft = Math.max(0, Math.round((avgPerFile * remaining) / 1000));
  }

  // file handling
  const handleFiles = (newFiles) => {
    // filter non image files
    const validFiles = newFiles.filter((file) => {
      const isImageByType = file.type?.startsWith("image/");
      const isImageByName = /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(file.name);

      return isImageByType || isImageByName;
    });

    // setting file id
    const getId = (f) => f.webkitRelativePath || f.name;

    const uniqueFiles = validFiles.filter(
      (f) => !files.some((existing) => getId(existing) === getId(f)),
    );

    const updated = [...files, ...uniqueFiles];

    setFiles(updated);
    processFiles(updated);
  };

  const processFiles = async (filesToProcess) => {
    const pool = poolRef.current;

    // another filter for safety
    const validFiles = filesToProcess.filter((file) => {
      const isImageByType = file.type?.startsWith("image/");
      const isImageByName = /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(file.name);

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
        const result = await pool.addTask(file, quality);

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

  // UI
  return (
    <div className="app">
      <div className="container">
        <Onboarding />
        <img src="/minipix-dark.png" alt="MiniPix" className="logo" />
        <p className="subtitle">Fast WebP image optimizer for the web</p>
        <ThemeToggle />
        {/* HERO SECTION */}
        <div className="panel hero">
          <QualityControl value={quality} onChange={setQuality} />
          <Dropzone onFiles={handleFiles} />
          <div className="hint">
            *All images are converted to WebP for optimal web performance
          </div>

          <ProgressBar progress={progress} />

          <TimeLeft seconds={timeLeft} />
        </div>
        {/* RESULTS SECTION */}
        {isDone && (
          <div className="panel results">
            <BigStat savedPercent={savedPercent} />

            <ExportButton processed={processed} files={files} />

            <div className="donate-note">
              This tool is free and runs entirely in your browser.
            </div>
            <DonateButton />
          </div>
        )}
        {/* FILES SECTION */}
        {progress.current != 0 && (
          <div className="panel">
            <FileList files={files} processed={processed} />
          </div>
        )}
        <About />
        <a href="/privacy" className="link">
          Privacy Policy
        </a>
        <br />
        <br />
        &#169;Andrei Holerga 2026
      </div>
    </div>
  );
}
