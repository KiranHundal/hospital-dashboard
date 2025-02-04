# Real-Time Hospital Patient Dashboard

## Project Overview

This project is a real-time, responsive dashboard designed for a nurse administrator at a hospital. It displays a list of current patients along with both static (name, age, room, etc.) and dynamic data (blood pressure, heart rate, oxygen levels). The dashboard aggregates data to provide summary statistics and supports advanced features like real-time updates via WebSockets, sorting, filtering, and user preference persistence. It also supports drag-n-drop summary cards, dark/light them, different layout, split screen for comparing patients and adding comparison notes.

## Features

- **Initial Data Fetch:**
  Fetches patient data from a mock API (`https://jsonplaceholder.typicode.com/posts`), transforms it using a patient adapter, and caches it locally.

- **Real-Time Updates:**
  Utilizes a configurable WebSocket connection to receive live updates (vitals, admissions, discharges, room changes). These updates are merged into the UI in real time. Using built in test server that runs at `ws://localhost:8080`

- **Responsive Design:**
  Built with TailwindCSS to ensure the dashboard is accessible and responsive on mobile, tablet, and desktop devices.

- **Data Display:**
  Patient data is presented in both grid and tabular formats. Expandable cards offer detailed views of patient information.

- **Data Summary and Analytics:**
  Provides summary cards for total patients, average age, gender distribution, and critical vital sign counts. Supports drag-and-drop reordering of summary cards.

- **Sorting and Filtering:**
  Advanced sorting and filtering are implemented with custom hooks and components. User preferences are persisted via localStorage.

- **Performance Optimizations:**
  Uses memoization, React Query caching, and custom performance hooks to ensure smooth updates even with large datasets.

- **Build-Time Enhancements:**
  Integrates `vite-plugin-generate-file` for build metadata and `vite-plugin-qrcode` for additional build-time functionality.

## Design Process

1. **Architecture and Modularity:**
   The project is structured in a modular fashion with separate directories for components, hooks, services, types, and state management (Redux and React Query). This separation of concerns allows for scalable growth and maintainability.

2. **State Management:**
   Global state is managed using Redux, while data fetching and caching are handled by React Query. Custom hooks encapsulate business logic such as filtering, sorting, and WebSocket management.

3. **Real-Time Data Integration:**
   The `WebSocketService` establishes a connection to a WebSocket endpoint and dispatches updates to both the Redux store and React Query cache. This ensures the UI reflects real-time changes instantly.

4. **User Preferences Persistence:**
   User settings for sorting, filtering, and layout are stored in localStorage. This persistence allows the dashboard to retain user preferences across sessions.

5. **Performance Considerations:**
   The application uses memoization (e.g., `React.memo`) and lazy updates to minimize re-renders. Custom performance hooks log render and sort times in development for ongoing optimization.

## Tools and Libraries

- **React & TypeScript:** For robust, type-safe component-based UI development.
- **Redux:** For centralized state management.
- **React Query:** To handle server state, caching, and data synchronization.
- **TailwindCSS:** Provides utility-first CSS classes for rapid and responsive styling.
- **Vite:** Fast build tool and development server that supports modern ES modules.
- **vite-plugin-generate-file & vite-plugin-qrcode:** Build-time plugins that add metadata generation and QR code features.

## Scaling Considerations

- **Large Datasets:**
  React Query’s caching and pagination (via custom hooks) allow the app to handle large datasets efficiently.
- **Concurrent Users:**
  Redux and WebSocket services are designed to support real-time updates without reloading the entire state.
- **Performance Optimizations:**
  Use of memoization and custom hooks ensures that re-renders are minimized, keeping the application responsive under heavy load.

## Future Enhancements

- **Enhanced Data Visualization:**
  Integration of charting libraries (e.g., Chart.js or D3) for more detailed trend analysis.
- **User Authentication and Authorization:**
  Secure access and role-based views for different types of users.
- **Adding more features used by nurses:**
  Adding real time features used by nurses at the hospital
- **Progressive Web App (PWA):**
  Offline capabilities and improved performance on mobile devices.
- **Improved Testing:**
  More comprehensive unit and integration tests using Jest and React Testing Library.

## Running Real-Time Updates
This project includes a test WebSocket server (test-server.js) and a test client (test-client.ts) to simulate real-time updates.
- **To run the test server**
`cd server`
`npm run start-server`

package.json should have a script entry similar to:
`"start-server": "node test-server.js"`

- **To run the test client**
`cd server`
`npm run start-client`

package.json should have a script entry similar to:
`"start-client": "ts-node test-client.ts"`
Test client adds 5 new patients and updates the vitals optients every few seconds when running. The number of new admissions can be changed here `this.generatePatients(5)`

- **Sending Updates Through Postman**
Connect via WebSocket in Postman:

Open Postman and create a new WebSocket Request.
Enter the WebSocket server URL `ws://localhost:8080` and click Connect.
Send a JSON Message:

Update Patient Vitals:
```
{
  "topic": "vitals",
  "data": {
    "type": "UPDATE_VITALS",
    "patientId": "P0001",
    "vitals": {
      "heartRate": 85,
      "bloodPressure": "125/80",
      "oxygenLevel": 97
    }
  }
}`
Room Update:
`{
  "topic": "room-101",
  "data": {
    "type": "ROOM_UPDATE",
    "roomNumber": 101,
    "patients": [
      {
        "patientId": "P0001",
        "vitals": {
          "heartRate": 85,
          "bloodPressure": "125/80",
          "oxygenLevel": 97
        }
      }
    ]
  }
}`
New Patient Admission:
`{
  "topic": "admissions",
  "data": {
    "type": "NEW_PATIENT",
    "patient": {
      "id": "P0100",
      "name": "John Doe",
      "age": 45,
      "room": "102",
      "gender": "male",
      "vitals": {
        "bloodPressure": "120/80",
        "heartRate": 78,
        "oxygenLevel": 98,
        "timestamp": 1630000000000
      }
    }
  }
}`


## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/)

### Installation

```bash
git clone https://github.com/KiranHundal/hospital-dashboard.git (HTTPS)
git clone git@github.com:KiranHundal/hospital-dashboard.git (SSH)
cd hospital-dashboard
npm install
npm run dev
npm run build
npm run preview
