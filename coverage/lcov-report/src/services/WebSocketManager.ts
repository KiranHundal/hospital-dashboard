import { WebSocketServer, WebSocket } from 'ws';
import { BatchManager } from './BatchManager';
import { OPEN } from 'ws';

class WebSocketManager {
  private wss!: WebSocketServer;
  private batchManager: BatchManager;
  private clientSubscriptions = new Map();
  private updateBuffer = new Map<string, any[]>();
  private batchInterval = 1000; 

  constructor(port: number) {
    this.wss = new WebSocketServer({ port });
    this.batchManager = new BatchManager();
    this.setupServer();
    this.setupBatchProcessing();
  }

  private setupServer() {
    this.wss.on('connection', (ws) => {
      this.clientSubscriptions.set(ws, new Set());

      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message);
          this.handleMessage(ws, data);
        } catch (error) {
          console.error('Error processing message:', error);
        }
      });

      ws.on('close', () => {
        this.clientSubscriptions.delete(ws);
      });
    });
  }

  private setupBatchProcessing() {
    setInterval(() => {
      this.processBatches();
    }, this.batchInterval);
  }

  private processBatches() {
    for (const [topic, updates] of this.updateBuffer.entries()) {
      if (updates.length > 0) {
        const batchMessage = this.createBatchMessage(topic, updates);
        this.broadcastToSubscribers(topic, batchMessage);
        this.updateBuffer.set(topic, []);
      }
    }
  }

  private createBatchMessage(topic: string, updates: any[]) {
    switch (topic) {
      case 'vitals':
        return {
          topic,
          data: {
            type: 'BATCH_UPDATE_VITALS',
            updates
          }
        };
      case 'admissions':
        return {
          topic,
          data: {
            type: 'BATCH_NEW_PATIENTS',
            patients: updates
          }
        };
      case 'discharges':
        return {
          topic,
          data: {
            type: 'BATCH_DISCHARGES',
            discharges: updates
          }
        };
      default:
        return {
          topic,
          data: updates
        };
    }
  }

  private handleMessage(ws: WebSocket, data: any) {
    const { type, topic } = data;

    switch (type) {
      case 'SUBSCRIBE':
        this.handleSubscribe(ws, topic);
        break;
      case 'UNSUBSCRIBE':
        this.handleUnsubscribe(ws, topic);
        break;
      default:
        this.bufferUpdate(topic, data);
    }
  }

  private handleSubscribe(ws: WebSocket, topic: string) {
    const subscriptions = this.clientSubscriptions.get(ws);
    subscriptions.add(topic);
  }

  private handleUnsubscribe(ws: WebSocket, topic: string) {
    const subscriptions = this.clientSubscriptions.get(ws);
    subscriptions.delete(topic);
  }

  private bufferUpdate(topic: string, update: any) {
    if (!this.updateBuffer.has(topic)) {
      this.updateBuffer.set(topic, []);
    }
    this.updateBuffer.get(topic)?.push(update);
  }

  private broadcastToSubscribers(topic: string, message: any) {
    this.wss.clients.forEach((client: WebSocket) => {
      if (client.readyState === OPEN && this.clientSubscriptions.get(client)?.has(topic)) {
        client.send(JSON.stringify(message));
      }

    });
  }
}

export { WebSocketManager };
