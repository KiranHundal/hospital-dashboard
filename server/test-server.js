server.on('connection', (ws) => {
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      if (data.type === 'SUBSCRIBE') {
        console.log('Client subscribed to:', data.topic);
      }
      server.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
          client.send(message.toString());
        }
      });
    } catch (err) {
      console.error('Error processing message:', err);
    }
  });
});
