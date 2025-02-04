# Design Process & Technical Decisions

## Design Process

### Initial Architecture Decisions

When designing the Hospital Dashboard, I prioritized three key aspects:

1. **Real-time Data Handling**
   - Chose WebSocket for real-time vital signs updates over polling
   - Implemented a singleton WebSocket service with automatic reconnection
   - Designed a pub/sub system for efficient data distribution

2. **State Management Strategy**
   - Combined Redux and React Query for different state types:
     ```typescript
     // Redux for UI and WebSocket state
     interface RootState {
       patients: PatientState;
       websocket: WebSocketState;
     }

     // React Query for server/cache state
     const QUERY_KEYS = {
       patients: ['patients'],
       patient: (id: string) => ['patient', id]
     };
     ```

3. **Component Architecture**
   - Implemented a modular design with atomic components
   - Used HOCs for cross-cutting concerns:
     ```typescript
     export function withLoading<P extends object>(
       WrappedComponent: React.ComponentType<P>
     ) {
       return function WithLoadingComponent(
         props: P & WithLoadingProps
       ) {
         if (loading) return <LoadingSpinner />;
         return <WrappedComponent {...props} />;
       };
     }
     ```

### Scalability & Maintainability

1. **Service Layer Abstraction**
   - Created singleton services for core functionalities
     ```typescript
     class WebSocketService {
       private static instance: WebSocketService | null = null;
       public static getInstance(): WebSocketService {
         if (!WebSocketService.instance) {
           WebSocketService.instance = new WebSocketService();
         }
         return WebSocketService.instance;
       }
     }
     ```

2. **Type Safety**
   - Comprehensive TypeScript interfaces for all data structures
   - Custom error types for better error handling:
     ```typescript
     export class APIError extends Error {
       constructor(
         message: string,
         public statusCode?: number
       ) {
         super(message);
         this.name = 'APIError';
       }
     }
     ```

3. **Performance Optimization**
   - Implemented batch updates for vital signs
   - Used memoization for expensive calculations:
     ```typescript
     const vitalStatus = useMemo(() =>
       vitalService.analyzeVitals(vitals),
       [vitals]
     );
     ```

## Tools & Libraries Justification

### Core Technologies

1. **React 18**
   - Chose for its concurrent rendering features
   - Leveraged new hooks and Suspense
   - Strong community support

2. **TypeScript**
   - Essential for large-scale application maintainability
   - Enhanced IDE support and type safety
   - Interface-first development:
     ```typescript
     interface Patient {
       id: string;
       name: string;
       vitals: VitalSigns;
       lastUpdateTime?: number;
     }
     ```

3. **Redux Toolkit**
   - Simplified Redux boilerplate
   - Efficient slice pattern:
     ```typescript
     const patientSlice = createSlice({
       name: 'patients',
       initialState,
       reducers: {
         updatePatient(state, action: PayloadAction<UpdatePatientPayload>) {
           const patient = state.patients.find(p => p.id === action.payload.patientId);
           if (patient) {
             patient.vitals = { ...patient.vitals, ...action.payload.vitals };
           }
         }
       }
     });
     ```

4. **React Query**
   - Efficient server state management
   - Built-in caching and invalidation
   - Optimistic updates support

5. **TailwindCSS**
   - Rapid UI development
   - Built-in dark mode support
   - Consistent design system:
     ```tsx
     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
       {patients.map(patient => (
         <ExpandablePatientCard
           key={patient.id}
           patient={patient}
           isUpdated={patient.id === updatedPatientId}
         />
       ))}
     </div>
     ```

## Scaling Considerations

### Data Management
1. **Pagination**
   - Paginated API responses
   - Efficient data caching(React Query)

2. **WebSocket Optimization**
   - Batch updates to reduce message frequency
   - Message compression
   - Reconnection strategy with exponential backoff:
     ```typescript
     private attemptReconnection() {
       if (this.reconnectAttempts < this.maxRetries) {
         setTimeout(() => {
           this.connect();
           this.reconnectAttempts++;
         }, this.retryDelay * Math.pow(2, this.reconnectAttempts));
       }
     }
     ```

3. **Performance Under Load**
   - Implemented debouncing for frequent updates
   - Used web workers for complex calculations
   - Optimized rendering with React.memo:
     ```typescript
     export const ExpandablePatientCard = memo(PatientCardBase,
       (prev, next) => prev.patient.id === next.patient.id
     );
     ```

## Future Enhancements

### 1. Technical Improvements
- Service Worker implementation for offline support
- GraphQL or similar integration for more efficient data fetching
- Implement WebAssembly for complex vital signs analysis

### 2. Feature Enhancements
- Real-time vital signs graphs and trends
- AI-powered patient risk assessment
- Mobile application development

### 3. Performance Optimizations
```typescript
// data streaming for large datasets
interface StreamConfig {
  batchSize: number;
  interval: number;
  maxConcurrent: number;
}

class DataStreamService {
  private streamData(config: StreamConfig) {
    return new Observable(subscriber => {
      // ..
    });
  }
}
```

### 4. Architecture
- Microservices architecture for better scalability
- Event-driven architecture for real-time features
- Implementation of CQRS pattern for complex data operations

### 5. Monitoring & Analytics
- Performance monitoring implementation
- User behavior analytics
- Error tracking and reporting system

### 5. More Enhanced Testing
- More enhance testing to cover everything
- Code coverage
