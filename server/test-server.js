import { WebSocketServer } from 'ws';

const server = new WebSocketServer({ port: 8080 });
const clientSubscriptions = new Map();
const usedIds = new Set();

const generatePatientId = () => {
  let id;
  do {
    id = 'P' + Math.floor(1000 + Math.random() * 9000);
  } while (usedIds.has(id));
  usedIds.add(id);
  return id;
};

const generateVitals = () => ({
  heartRate: Math.floor(60 + Math.random() * 40),
  bloodPressure: `${Math.floor(110 + Math.random() * 20)}/${Math.floor(70 + Math.random() * 20)}`,
  oxygenLevel: Math.floor(95 + Math.random() * 5)
});

const generatePatient = () => ({
  type: 'NEW_PATIENT',
  patient: {
    id: generatePatientId(),
    name: `Patient ${Math.floor(Math.random() * 1000)}`,
    room: `${Math.floor(100 + Math.random() * 900)}`,
    age: Math.floor(20 + Math.random() * 60),
    gender: Math.random() > 0.5 ? 'Male' : 'Female',
    vitals: generateVitals()
  }
});

server.on('connection', (ws) => {
  console.log('New client connected');
  clientSubscriptions.set(ws, new Set());

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === 'SUBSCRIBE') {
        const subscriptions = clientSubscriptions.get(ws);
        subscriptions.add(data.topic);
        console.log('Client subscribed to:', data.topic);
        return;
      }

      if (data.type === 'UNSUBSCRIBE') {
        const subscriptions = clientSubscriptions.get(ws);
        subscriptions.delete(data.topic);
        console.log('Client unsubscribed from:', data.topic);
        return;
      }

      if (data.type === 'GENERATE_PATIENTS') {
        const subscriptions = clientSubscriptions.get(ws);
        if (!subscriptions.has('admissions')) {
          subscriptions.add('admissions');
          console.log('Client auto-subscribed to: admissions');
        }

        const batchMessage = {
          topic: 'admissions',
          data: {
            type: 'BATCH_NEW_PATIENTS',
            patients: Array.from({ length: data.count || 5 }, () => generatePatient())
          }
        };
        broadcastToSubscribers('admissions', batchMessage);
        return;
      }

      if (data.topic === 'vitals' && Array.isArray(data.data)) {
        broadcastToSubscribers('vitals', {
          topic: 'vitals',
          data: {
            type: 'BATCH_UPDATE_VITALS',
            updates: data.data
          }
        });
        return;
      }

      if (data.topic.startsWith('room-') && data.data?.type === 'ROOM_UPDATE') {
        const roomTopic = `room-${data.data.roomNumber}`;
        broadcastToSubscribers(roomTopic, {
          topic: roomTopic,
          data: {
            type: 'ROOM_UPDATE',
            roomNumber: data.data.roomNumber,
            patients: Array.isArray(data.data.patients) ? data.data.patients : [data.data.patients]
          }
        });
        return;
      }

      broadcastToSubscribers(data.topic, data);

    } catch (err) {
      console.error('Error processing message:', err);
      ws.send(JSON.stringify({ error: 'Invalid message format' }));
    }
  });

  ws.on('close', () => {
    clientSubscriptions.delete(ws);
    console.log('Client disconnected');
  });
});

function broadcastToSubscribers(topic, message) {
  server.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && clientSubscriptions.get(client)?.has(topic)) {
      client.send(JSON.stringify(message));
    }
  });
}

console.log('WebSocket server running on ws://localhost:8080');
