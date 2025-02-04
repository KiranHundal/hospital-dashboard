# WebSocket Testing Guide

## WebSocket Testing Setup

### Test Server
```bash
# Start WebSocket test server
node test-server.js
```

Server Features:
- Port: 8080
- Subscription management
- Simulated patient data
- Real-time updates

### Test Client
```bash
# Start test client
node test-client.js
```

Client Features:
- Automatic reconnection
- Multi-topic subscription
- Simulated updates

Test client adds 5 new patients and updates the vitals optients every few seconds when running. The number of new admissions can be changed here `this.generatePatients(5)`

## Testing with Postman

### 1. Connect to WebSocket
```
ws://localhost:8080
```

### 2. Subscribe to Topics
```json
{
  "type": "SUBSCRIBE",
  "topic": "vitals"
}
```

### 3. Generate Test Data
```json
{
  "type": "GENERATE_PATIENTS",
  "count": 5
}
```

### 4. Send Vital Updates
```json
{
  "topic": "vitals",
  "data": {
    "type": "UPDATE_VITALS",
    "patientId": "P0001",
    "vitals": {
      "heartRate": 75,
      "bloodPressure": "120/80",
      "oxygenLevel": 98
    }
  }
}
```

### 5. Room Updates
```json
{
  "topic": "room-101",
  "data": {
    "type": "ROOM_UPDATE",
    "roomNumber": 101,
    "patients": [{
      "patientId": "P0001",
      "vitals": {
        "heartRate": 80,
        "bloodPressure": "120/80",
        "oxygenLevel": 98
      }
    }]
  }
}
```
