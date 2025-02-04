import { patientAdapter } from "../services/patientAdapter";

describe('patientAdapter.transformPostToPatient', () => {
  it('should transform a valid post into a patient object with required vital sign properties', () => {
    const fixedTimestamp = 1630000000000;
    jest.spyOn(Date, 'now').mockReturnValue(fixedTimestamp);

    const post = {
      userId: 1,
      id: 1,
      title: 'Test Patient Title',
      body: 'Sample body content',
    };

    const patient = patientAdapter.transformPostToPatient(post);

    expect(patient).toHaveProperty('id', 'P0001');
    expect(patient).toHaveProperty('name');
    expect(patient).toHaveProperty('age');
    expect(patient).toHaveProperty('room');
    expect(patient).toHaveProperty('gender');
    expect(patient).toHaveProperty('vitals');

    const vitals = patient.vitals;
    expect(typeof vitals.bloodPressure).toBe('string');
    expect(typeof vitals.heartRate).toBe('number');
    expect(typeof vitals.oxygenLevel).toBe('number');
    expect(vitals.timestamp).toBe(fixedTimestamp);

    expect(typeof vitals.isBPHigh).toBe('boolean');
    expect(typeof vitals.isBPLow).toBe('boolean');
    expect(typeof vitals.isHRHigh).toBe('boolean');
    expect(typeof vitals.isHRLow).toBe('boolean');
    expect(typeof vitals.isO2Low).toBe('boolean');
    expect(typeof vitals.severityScore).toBe('number');


    jest.restoreAllMocks();
  });
});
