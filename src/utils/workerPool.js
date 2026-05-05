import ImageWorker from "../workers/imageWorker.js?worker";

export class WorkerPool {
  constructor(size = 4) {
    this.size = size;

    this.queue = [];
    this.idleWorkers = [];
    this.tasks = new Map();
    this.taskId = 0;

    this.workers = [];

    for (let i = 0; i < size; i++) {
      const worker = new ImageWorker();

      worker.onmessage = (e) => {
        const { id, result, error } = e.data;

        const task = this.tasks.get(id);
        if (!task) return;

        this.tasks.delete(id);

        if (error) task.reject(error);
        else task.resolve(result);

        this.idleWorkers.push(worker);
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
    while (this.queue.length > 0 && this.idleWorkers.length > 0) {
      const worker = this.idleWorkers.shift();
      const task = this.queue.shift();

      worker.postMessage({
        id: task.id,
        file: task.file,
        quality: task.quality,
      });
    }
  }

  terminate() {
    this.workers.forEach((w) => w.terminate());
  }
}