import WebSocket from 'ws';

class WebSocketTestClient {
    constructor(url = 'ws://localhost:8080') {
        this.ws = new WebSocket(url);
        this.existingPatients = [];  // Track existing patients
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.ws.on('open', () => {
            console.log('Connected to WebSocket server');
            this.runTests();
        });

        this.ws.on('message', (data) => {
            const message = JSON.parse(data);
            console.log('Received:', message);

            // Track patients from batch admissions
            if (message.data?.type === 'BATCH_NEW_PATIENTS') {
                this.existingPatients = message.data.patients.map(p => p.patient.id);
                console.log('Tracked patients:', this.existingPatients);
            }
        });

        this.ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
    }

    async runTests() {
        // Subscribe to topics
        console.log('\n1. Testing Subscriptions...');
        this.subscribe('vitals');
        this.subscribe('admissions');
        this.subscribe('room-101');

        // Wait a bit before sending updates
        await this.delay(1000);

        // Test patient generation
        console.log('\n2. Testing Patient Generation...');
        this.generatePatients(5);

        // Wait for patients to be generated and tracked
        await this.delay(2000);

        // Test vitals updates for existing patients
        console.log('\n3. Testing Vitals Updates...');
        if (this.existingPatients.length > 0) {
            // Update first patient
            this.sendVitalsUpdate(this.existingPatients[0]);
            await this.delay(500);

            // Update second patient if exists
            if (this.existingPatients[1]) {
                this.sendVitalsUpdate(this.existingPatients[1]);
            }
        } else {
            console.log('No existing patients to update');
        }

        await this.delay(2000);

        // Test room updates
        console.log('\n4. Testing Room Updates...');
        if (this.existingPatients.length > 0) {
            this.sendRoomUpdate(this.existingPatients[0]);
        }
    }

    subscribe(topic) {
        console.log(`Subscribing to ${topic}...`);
        this.ws.send(JSON.stringify({
            type: 'SUBSCRIBE',
            topic
        }));
    }

    generatePatients(count) {
        console.log(`Generating ${count} patients...`);
        this.ws.send(JSON.stringify({
            type: 'GENERATE_PATIENTS',
            count
        }));
    }

    sendVitalsUpdate(patientId) {
        console.log(`Sending vitals update for patient ${patientId}...`);
        this.ws.send(JSON.stringify({
            topic: 'vitals',
            data: {
                type: 'UPDATE_VITALS',
                patientId,
                vitals: {
                    heartRate: Math.floor(60 + Math.random() * 40),
                    bloodPressure: `${Math.floor(110 + Math.random() * 20)}/${Math.floor(70 + Math.random() * 20)}`,
                    oxygenLevel: Math.floor(95 + Math.random() * 5)
                }
            }
        }));
    }

    sendRoomUpdate(patientId) {
        console.log('Sending room update...');
        this.ws.send(JSON.stringify({
            topic: 'room-101',
            data: {
                type: 'ROOM_UPDATE',
                roomNumber: 101,
                patients: [{
                    patientId,
                    vitals: {
                        heartRate: 80,
                        bloodPressure: '120/80',
                        oxygenLevel: 98
                    }
                }]
            }
        }));
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Create and run the test client
const testClient = new WebSocketTestClient();
