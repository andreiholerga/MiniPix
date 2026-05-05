export class WorkerPool {
  constructor(workerPath, size = 4) {
    this.size = size;

    this.queue = [];
    this.idleWorkers = [];
    this.workers = [];

    this.tasks = new Map();
    this.taskId = 0;

    this.isProcessing = false; // ✅ IMPORTANT FIX

    for (let i = 0; i < size; i++) {
      const worker = new Worker(
        new URL(workerPath, import.meta.url),
        { type: "module" }
      );


      worker.onmessage = (e) => {
        console.log("POOL RECEIVED:", e.data);
        const { id, result, error } = e.data;

        const task = this.tasks.get(id);
        if (!task) return;

        this.tasks.delete(id);

        if (error) task.reject(error);
        else task.resolve(result);

        this.idleWorkers.push(worker);

        // re-trigger safely
        this.processQueue();
      };

      worker.onerror = (err) => {
        console.error("Worker error:", err);
      };

      this.workers.push(worker);
      this.idleWorkers.push(worker);
    }
  }

  addTask(file, quality = 0.75) {
    return new Promise((resolve, reject) => {
      const id = this.taskId++;

      this.queue.push({ id, file, quality });
      this.tasks.set(id, { resolve, reject });

      this.processQueue();
    });
  }

  processQueue() {
    // ✅ guard prevents re-entrant crashes
    if (this.isProcessing) return;

    this.isProcessing = true;

    try {
      while (this.queue.length > 0 && this.idleWorkers.length > 0) {
        const worker = this.idleWorkers.shift();
        const task = this.queue.shift();

        if (!task) continue;

        worker.postMessage({
          id: task.id,
          file: task.file,
          quality: task.quality,
        });
      }
    } finally {
      this.isProcessing = false;
    }
  }
  

  terminate() {
    this.workers.forEach((w) => w.terminate());
    this.workers = [];
    this.idleWorkers = [];
    this.queue = [];
    this.tasks.clear();
  }
}