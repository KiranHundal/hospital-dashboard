import { Gender, Patient, VitalSigns } from "../../types/patient";

export function createPatientFixture(overrides: Partial<Patient> = {}): Patient {
  const defaultVitals: VitalSigns = {
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

  return {
    id: 'P0001',
    name: 'John Doe',
    age: 30,
    room: '101',
    gender: Gender.Male,
    vitals: { ...defaultVitals, ...overrides.vitals },
    fallRisk: false,
    isolation: false,
    npo: false,
    ...overrides
  };
}

export function createPatientFixtures(overrides: Partial<Patient>[] = []): Patient[] {
  return overrides.length > 0
    ? overrides.map(override => createPatientFixture(override))
    : [createPatientFixture()];
}

export function createAbnormalVitals(severity: 'borderline' | 'high' = 'borderline'): VitalSigns {
  if (severity === 'borderline') {
    return {
      bloodPressure: "140/90",
      heartRate: 100,
      oxygenLevel: 92,
      timestamp: Date.now(),
      isBPHigh: false,
      isBPLow: false,
      isHRHigh: false,
      isHRLow: false,
      isO2Low: false,
      severityScore: 0,
    };
  }

  return {
    bloodPressure: "160/110",
    heartRate: 120,
    oxygenLevel: 88,
    timestamp: Date.now(),
    isBPHigh: false,
    isBPLow: false,
    isHRHigh: false,
    isHRLow: false,
    isO2Low: false,
    severityScore: 0,
  };
}
