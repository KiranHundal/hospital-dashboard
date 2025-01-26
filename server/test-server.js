const { WebSocketServer } = require('ws');

const CONFIG = {
  batchSize: 100,
  batchWindow: 1000, // 1 second
  maxRetries: 3,
  retryDelay: 1000
};

class EnhancedWSServer {
  constructor(port) {
    this.server = new WebSocketServer({ port });
    this.clientSubscriptions = new Map();
    this.usedIds = new Set();
    this.batchBuffers = new Map();
    this.batchTimers = new Map();
    this.setupServer();
  }

  setupServer() {
    this.server.on('connection', (ws) => {
      console.log('New client connected');
      this.clientSubscriptions.set(ws, new Set());
      this.setupConnectionHandlers(ws);
    });
  }

  setupConnectionHandlers(ws) {
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        await this.handleMessage(ws, data);
      } catch (err) {
        console.error('Error processing message:', err);
        this.handleError(ws, err);
      }
    });

    ws.on('close', () => this.cleanup(ws));
  }

  async handleMessage(ws, data) {
    switch (data.type) {
      case 'SUBSCRIBE':
        this.handleSubscribe(ws, data.topic);
        break;
      case 'UNSUBSCRIBE':
        this.handleUnsubscribe(ws, data.topic);
        break;
      case 'GENERATE_PATIENTS':
        await this.handleGeneratePatients(ws, data);
        break;
      default:
        await this.bufferMessage(data.topic, data);
    }
  }

  bufferMessage(topic, message) {
    if (!this.batchBuffers.has(topic)) {
      this.batchBuffers.set(topic, []);
      this.setupBatchTimer(topic);
    }

    const buffer = this.batchBuffers.get(topic);
    buffer.push(message);

    if (buffer.length >= CONFIG.batchSize) {
      this.flushBuffer(topic);
    }
  }

  setupBatchTimer(topic) {
    if (this.batchTimers.has(topic)) {
      clearTimeout(this.batchTimers.get(topic));
    }

    const timerId = setTimeout(() => {
      this.flushBuffer(topic);
    }, CONFIG.batchWindow);

    this.batchTimers.set(topic, timerId);
  }

  async flushBuffer(topic) {
    const buffer = this.batchBuffers.get(topic) || [];
    if (buffer.length === 0) return;

    const batchMessage = this.createBatchMessage(topic, buffer);
    await this.broadcastWithRetry(topic, batchMessage);

    this.batchBuffers.set(topic, []);
    this.setupBatchTimer(topic);
  }

  createBatchMessage(topic, messages) {
    switch (topic) {
      case 'vitals':
        return {
          topic,
          data: {
            type: 'BATCH_UPDATE_VITALS',
            updates: messages
          }
        };
      case 'admissions':
        return {
          topic,
          data: {
            type: 'BATCH_NEW_PATIENTS',
            patients: messages
          }
        };
      default:
        return { topic, data: messages };
    }
  }

  async broadcastWithRetry(topic, message, attempt = 1) {
    try {
      await this.broadcast(topic, message);
    } catch (error) {
      if (attempt < CONFIG.maxRetries) {
        await new Promise(resolve => setTimeout(resolve, CONFIG.retryDelay));
        await this.broadcastWithRetry(topic, message, attempt + 1);
      } else {
        console.error(`Failed to broadcast after ${CONFIG.maxRetries} attempts:`, error);
      }
    }
  }

  broadcast(topic, message) {
    return new Promise((resolve, reject) => {
      try {
        this.server.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN &&
              this.clientSubscriptions.get(client)?.has(topic)) {
            client.send(JSON.stringify(message));
          }
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  generatePatientId() {
    let id;
    do {
      id = 'P' + Math.floor(1000 + Math.random() * 9000);
    } while (this.usedIds.has(id));
    this.usedIds.add(id);
    return id;
  }

  generateVitals() {
    return {
      heartRate: Math.floor(60 + Math.random() * 40),
      bloodPressure: `${Math.floor(110 + Math.random() * 20)}/${Math.floor(70 + Math.random() * 20)}`,
      oxygenLevel: Math.floor(95 + Math.random() * 5)
    };
  }

  generatePatient() {
    return {
      type: 'NEW_PATIENT',
      patient: {
        id: this.generatePatientId(),
        name: `Patient ${Math.floor(Math.random() * 1000)}`,
        room: `${Math.floor(100 + Math.random() * 900)}`,
        age: Math.floor(20 + Math.random() * 60),
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        vitals: this.generateVitals()
      }
    };
  }

  cleanup(ws) {
    this.clientSubscriptions.delete(ws);
    console.log('Client disconnected');
  }

  handleSubscribe(ws, topic) {
    const subscriptions = this.clientSubscriptions.get(ws);
    subscriptions.add(topic);
    console.log('Client subscribed to:', topic);
  }

  handleUnsubscribe(ws, topic) {
    const subscriptions = this.clientSubscriptions.get(ws);
    subscriptions.delete(topic);
    console.log('Client unsubscribed from:', topic);
  }

  async handleGeneratePatients(ws, data) {
    const subscriptions = this.clientSubscriptions.get(ws);
    if (!subscriptions.has('admissions')) {
      subscriptions.add('admissions');
      console.log('Client auto-subscribed to: admissions');
    }

    const patients = Array.from(
      { length: data.count || 5 },
      () => this.generatePatient()
    );

    await this.bufferMessage('admissions', patients);
  }

  handleError(ws, error) {
    ws.send(JSON.stringify({
      error: 'Invalid message format',
      details: error.message
    }));
  }
}

const port = 8080;
const server = new EnhancedWSServer(port);
console.log(`WebSocket server running on ws://localhost:${port}`);
