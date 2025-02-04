# Hospital Patient Dashboard

A real-time patient monitoring dashboard built with React, TypeScript, and WebSocket.

## Features
- 📊 Real-time vital signs monitoring
- 🚨 Critical patient alerts
- 📱 Responsive layout (Grid/List views)
- 🌓 Dark mode support
- 🔄 Split screen comparison
- 🔍 Advanced filtering and sorting

## Tech Stack
- React 18
- TypeScript
- Redux Toolkit
- React Query
- WebSocket
- TailwindCSS
- Vite

## Getting Started

### Prerequisites
- Node.js >= 18
- npm or yarn

### Installation
```bash
# Clone repository
git clone https://github.com/yourusername/hospital-dashboard.git

# Install dependencies
npm install

# Start development server
npm run dev

# Start WebSocket test server
node test-server.js

# Start test client (optional)
node test-client.js
```

### Environment Variables
```env
VITE_WEBSOCKET_URL=ws://localhost:8080
VITE_VITAL_BP_SYSTOLIC_HIGH=140
VITE_VITAL_BP_SYSTOLIC_LOW=90
VITE_VITAL_BP_DIASTOLIC_HIGH=90
VITE_VITAL_BP_DIASTOLIC_LOW=60
VITE_VITAL_HR_HIGH=100
VITE_VITAL_HR_LOW=60
VITE_VITAL_O2_LOW=95
```

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run test`: Run tests
- `npm run lint`: Lint code
- `npm run format`: Format code

## Development

### File Structure
```
hospital-dashboard/
├── src/
|   |-- _test_
│   ├── components/     # React components
│   ├── services/     # Core services
│   ├── config/       # Config
│   ├── hocs/         # HOC
│   ├── context/      # Context
│   ├── hooks/         # Custom hooks
│   ├── store/         # Redux store
│   ├── types/         # TypeScript types
│   └── utils/         # Utilities
├── docs/             # Documentation
└── tests/            # Test files
```

### Key Concepts
1. Patient Data Structure
```typescript
interface Patient {
  id: string;
  name: string;
  vitals: VitalSigns;
  // ... etc
}
```

2. WebSocket Topics
- `vitals`: Real-time vital signs updates
- `admissions`: New patient admissions
- `discharges`: Patient discharges
- `room-{number}`: Room-specific updates

## CI/CD
- Git Actions

### Contributing
1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License
MIT

## Support
For issues and feature requests, please use the GitHub issue tracker.
