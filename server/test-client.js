import WebSocket from 'ws';

class WebSocketTestClient {
    constructor(url = 'ws://localhost:8080') {
        this.ws = new WebSocket(url);
        this.existingPatients = [];
        this.updateInterval = null;
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.ws.on('open', () => {
            this.runTests();
        });

        this.ws.on('message', (data) => {
            try {
                const message = JSON.parse(data);

                if (message.data?.type === 'BATCH_NEW_PATIENTS') {
                    this.existingPatients = message.data.patients.map(p => p.patient.id);
                }
            } catch (error) {
                console.error('Error processing message:', error);
            }
        });

        this.ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
        this.ws.on('close', () => {
            this.stopContinuousUpdates();
        });
    }

    async runTests() {
        this.subscribe('vitals');
        this.subscribe('admissions');
        this.subscribe('room-102');

        await this.delay(1000);

        this.generatePatients(500);

        await this.delay(2000);

        if (this.existingPatients.length > 0) {
            this.sendVitalsUpdate(this.existingPatients[0]);
            await this.delay(500);

            if (this.existingPatients[1]) {
                this.sendVitalsUpdate(this.existingPatients[1]);
            }
        } else {
            console.log('No existing patients to update');
        }

        await this.delay(2000);

        if (this.existingPatients.length > 0) {
            this.sendRoomUpdate(this.existingPatients[0]);
        }
        await this.delay(2000);
        this.startContinuousUpdates();
    }
    startContinuousUpdates(interval = 5000) {

        const updateLoop = async () => {
            if (this.existingPatients.length > 0) {
                const batchSize = Math.floor(Math.random() * this.existingPatients.length) + 1;
                const selectedPatients = [...this.existingPatients]
                    .sort(() => Math.random() - 0.5)
                    .slice(0, batchSize);

                selectedPatients.forEach(patientId => {
                    this.sendVitalsUpdate(patientId);
                });

                if (Math.random() < 0.3) {
                    const randomPatient = selectedPatients[0];
                    const newRoom = Math.floor(100 + Math.random() * 900);
                    this.sendRoomUpdate(randomPatient, newRoom);
                }
            }
        };

        this.updateInterval = setInterval(updateLoop, interval);
    }

    stopContinuousUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }


    subscribe(topic) {
        this.ws.send(JSON.stringify({
            type: 'SUBSCRIBE',
            topic
        }));
    }

    generatePatients(count) {
        this.ws.send(JSON.stringify({
            type: 'GENERATE_PATIENTS',
            count
        }));
    }

    sendVitalsUpdate(patientId) {
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

    sendRoomUpdate(patientId, roomNumber = 101) {
        this.ws.send(JSON.stringify({
            topic: `room-${roomNumber}`,
            data: {
                type: 'ROOM_UPDATE',
                roomNumber: roomNumber,
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

const testClient = new WebSocketTestClient();
process.on('SIGINT', () => {
    testClient.stopContinuousUpdates();
    process.exit();
});
