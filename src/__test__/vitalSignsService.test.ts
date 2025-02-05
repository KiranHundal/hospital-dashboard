import VitalSignsService from '../services/VitalSignsService';
import { createAbnormalVitals, createPatientFixture } from './utils/patientTestUtils';

describe('VitalSignsService.analyzeVitals', () => {
  const service = VitalSignsService.getInstance();

  it('should correctly analyze normal vitals', () => {
    const patient = createPatientFixture();
    const vitals = patient.vitals;

    const analysis = service.analyzeVitals(vitals);
    expect(analysis.severityScore).toBe(0);
    expect(analysis.isBPHigh).toBe(false);
    expect(analysis.isBPLow).toBe(false);
    expect(analysis.isHRHigh).toBe(false);
    expect(analysis.isHRLow).toBe(false);
    expect(analysis.isO2Low).toBe(false);
  });

  it('should correctly analyze abnormal vitals', () => {
    const patient = createPatientFixture({
      vitals: createAbnormalVitals('high'),
    });

    const analysis = service.analyzeVitals(patient.vitals);
    expect(analysis.isBPHigh).toBe(true);
    expect(analysis.isHRHigh).toBe(true);
    expect(analysis.isO2Low).toBe(true);
    expect(analysis.severityScore).toBeGreaterThan(0);
  });
});
