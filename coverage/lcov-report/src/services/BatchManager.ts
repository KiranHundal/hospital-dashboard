export class BatchManager {
    private batchSize: number;
    private batchTimeout: number;
    private batches: Map<string, any[]>;
    private timeoutIds: Map<string, NodeJS.Timeout>;

    constructor(batchSize = 100, batchTimeout = 1000) {
      this.batchSize = batchSize;
      this.batchTimeout = batchTimeout;
      this.batches = new Map();
      this.timeoutIds = new Map();
    }

    addToBatch(topic: string, item: any, callback: (batch: any[]) => void) {
      if (!this.batches.has(topic)) {
        this.batches.set(topic, []);
        this.setupTimeout(topic, callback);
      }

      const batch = this.batches.get(topic)!;
      batch.push(item);

      if (batch.length >= this.batchSize) {
        this.flushBatch(topic, callback);
      }
    }

    private setupTimeout(topic: string, callback: (batch: any[]) => void) {
      const timeoutId = setTimeout(() => {
        this.flushBatch(topic, callback);
      }, this.batchTimeout);

      this.timeoutIds.set(topic, timeoutId);
    }

    private flushBatch(topic: string, callback: (batch: any[]) => void) {
      const batch = this.batches.get(topic);
      if (batch && batch.length > 0) {
        callback(batch);
        this.batches.set(topic, []);
      }

      const timeoutId = this.timeoutIds.get(topic);
      if (timeoutId) {
        clearTimeout(timeoutId);
        this.timeoutIds.delete(topic);
      }

      this.setupTimeout(topic, callback);
    }

    clear() {
      this.timeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
      this.batches.clear();
      this.timeoutIds.clear();
    }
  }
