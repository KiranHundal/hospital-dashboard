import VitalSignsService from '../services/VitalSignsService';
import { VitalSigns } from '../types/patient';

describe('VitalSignsService.analyzeVitals', () => {
  const service = VitalSignsService.getInstance();

  it('should correctly analyze normal vitals', () => {
    const vitals: VitalSigns = {
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
    };

    const analysis = service.analyzeVitals(vitals);
    expect(analysis.severityScore).toBe(0);
    expect(analysis.isBPHigh).toBe(false);
    expect(analysis.isBPLow).toBe(false);
    expect(analysis.isHRHigh).toBe(false);
    expect(analysis.isHRLow).toBe(false);
    expect(analysis.isO2Low).toBe(false);
  });

  it('should correctly analyze abnormal vitals', () => {
    const vitals: VitalSigns = {
      bloodPressure: "150/100",
      heartRate: 110,
      oxygenLevel: 90,         
      timestamp: 1630000000000,
      isBPHigh: false,
      isBPLow: false,
      isHRHigh: false,
      isHRLow: false,
      isO2Low: false,
      severityScore: 0,
    };

    const analysis = service.analyzeVitals(vitals);
    expect(analysis.isBPHigh).toBe(true);
    expect(analysis.isHRHigh).toBe(true);
    expect(analysis.isO2Low).toBe(true);
    expect(analysis.severityScore).toBeGreaterThan(0);
  });
});
