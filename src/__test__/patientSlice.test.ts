import patientReducer, {
    updatePatient,
    clearUpdateHighlight,
    setPatients,
} from '../store/slices/patientSlice';
import { Patient, Gender } from '../types/patient';

describe('patientSlice reducer', () => {
    const initialState = {
        patients: [] as Patient[],
        loading: false,
        error: undefined,
        updatedPatientId: undefined,
        lastUpdate: undefined,
    };

    const samplePatient: Patient = {
        id: 'P0001',
        name: 'John Doe',
        age: 50,
        room: '101',
        gender: Gender.Male, 
        vitals: {
            bloodPressure: "120/80",
            heartRate: 70,
            oxygenLevel: 98,
            timestamp: 1630000000000,
            isBPHigh: false,
            isBPLow: false,
            isHRHigh: false,
            isHRLow: false,
            isO2Low: false,
            severityScore: 0,
        },
        fallRisk: false,
        isolation: false,
        npo: false,
    };

    it('should handle setPatients', () => {
        const patients: Patient[] = [samplePatient];
        const newState = patientReducer(initialState, setPatients(patients));
        expect(newState.patients).toHaveLength(1);
        expect(newState.loading).toBe(false);
    });

    it('should handle updatePatient', () => {
        const state = {
            patients: [samplePatient],
            loading: false,
            error: undefined,
            updatedPatientId: undefined,
            lastUpdate: undefined,
        };

        const updateAction = updatePatient({
            patientId: 'P0001',
            vitals: { heartRate: 80 },
            isUpdated: true,
            lastUpdateTime: 1630001000000,
        });

        const newState = patientReducer(state, updateAction);
        expect(newState.patients[0].vitals.heartRate).toBe(80);
        expect(newState.updatedPatientId).toBe('P0001');
    });

    it('should handle clearUpdateHighlight', () => {
        const state = {
            patients: [{
                ...samplePatient,
                isUpdated: true,
            }],
            loading: false,
            error: undefined,
            updatedPatientId: 'P0001',
            lastUpdate: '2021-08-26T00:00:00.000Z',
        };

        const newState = patientReducer(state, clearUpdateHighlight());
        expect(newState.updatedPatientId).toBeUndefined();
        newState.patients.forEach(patient => {
            expect(patient.isUpdated).toBeFalsy();
        });
    });
});
