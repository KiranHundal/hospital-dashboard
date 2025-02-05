import patientReducer, {
    updatePatient,
    clearUpdateHighlight,
    setPatients,
} from '../store/slices/patientSlice';
import { Patient } from '../types/patient';
import { createPatientFixture } from './utils/patientTestUtils';

describe('patientSlice reducer', () => {
    const initialState = {
        patients: [] as Patient[],
        loading: false,
        error: undefined,
        updatedPatientId: undefined,
        lastUpdate: undefined,
    };

    const samplePatient = createPatientFixture();

    describe('setPatients action', () => {
        it('should initialize patients correctly', () => {
            const patients = [samplePatient, createPatientFixture({ id: 'P0002' })];
            const newState = patientReducer(initialState, setPatients(patients));

            expect(newState.patients).toHaveLength(2);
            expect(newState.loading).toBe(false);
            expect(newState.error).toBeUndefined();
        });
    });

    describe('updatePatient action', () => {
        it('should update patient vitals and tracking metadata', () => {
            const state = {
                ...initialState,
                patients: [samplePatient],
                loading: false,
            };

            const updateAction = updatePatient({
                patientId: samplePatient.id,
                vitals: { heartRate: 80 },
                isUpdated: true,
                lastUpdateTime: 1630001000000,
            });

            const newState = patientReducer(state, updateAction);

            expect(newState.patients[0].vitals.heartRate).toBe(80);
            expect(newState.updatedPatientId).toBe(samplePatient.id);
        });

        it('should handle multiple patient updates', () => {
            const patient1 = createPatientFixture({ id: 'P0001' });
            const patient2 = createPatientFixture({ id: 'P0002' });

            const state = {
                ...initialState,
                patients: [patient1, patient2],
                loading: false,
            };

            const updateAction = updatePatient({
                patientId: 'P0002',
                vitals: { heartRate: 90 },
                isUpdated: true,
                lastUpdateTime: 1630001000000,
            });

            const newState = patientReducer(state, updateAction);

            expect(newState.patients.find(p => p.id === 'P0002')?.vitals.heartRate).toBe(90);
            expect(newState.updatedPatientId).toBe('P0002');
        });
    });

    describe('clearUpdateHighlight action', () => {
        it('should reset update-related state', () => {
            const state = {
                patients: [
                    {...samplePatient, isUpdated: true}
                ],
                loading: false,
                error: undefined,
                updatedPatientId: samplePatient.id,
                lastUpdate: '2021-08-26T00:00:00.000Z',
            };

            const newState = patientReducer(state, clearUpdateHighlight());

            expect(newState.updatedPatientId).toBeUndefined();
            newState.patients.forEach(patient => {
                expect(patient.isUpdated).toBeFalsy();
            });
        });
    });
});
