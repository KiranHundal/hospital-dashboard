import { patientAdapter } from "../services/patientAdapter";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

describe('patientAdapter.transformPostToPatient', () => {
  const fixedTimestamp = 1630000000000;

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(fixedTimestamp);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Transformation Validation', () => {
    it('transforms a valid post into a complete patient object', () => {
      const post = {
        userId: 1,
        id: 1,
        title: 'Test Patient Title',
        body: 'Sample body content',
      };

      const patient = patientAdapter.transformPostToPatient(post);

      expect(patient).toEqual(
        expect.objectContaining({
          id: expect.stringContaining('P'),
          name: expect.any(String),
          age: expect.any(Number),
          room: expect.any(String),
          gender: expect.any(String),
          vitals: expect.objectContaining({
            bloodPressure: expect.any(String),
            heartRate: expect.any(Number),
            oxygenLevel: expect.any(Number),
            timestamp: fixedTimestamp,
          })
        })
      );
    });

    it('generates unique patient IDs', () => {
      const post1: Post = {
        userId: 1,
        id: 1,
        title: 'Patient 1',
        body: 'Content 1'
      };
      const post2: Post = {
        userId: 2,
        id: 2,
        title: 'Patient 2',
        body: 'Content 2'
      };

      const patient1 = patientAdapter.transformPostToPatient(post1);
      const patient2 = patientAdapter.transformPostToPatient(post2);

      expect(patient1.id).toBe('P0001');
      expect(patient2.id).toBe('P0002');
    });
  });

  describe('Error Handling', () => {
    it('handles minimal post data with all required properties', () => {
      const minimalPost: Post = {
        id: 999,
        userId: 1,
        title: 'Minimal Patient',
        body: 'Minimal content'
      };
      const patient = patientAdapter.transformPostToPatient(minimalPost);

      expect(patient).toEqual(
        expect.objectContaining({
          id: expect.stringMatching(/^P\d+$/),
          name: expect.any(String),
          age: expect.any(Number),
          room: expect.any(String),
          gender: expect.any(String),
          vitals: expect.objectContaining({
            bloodPressure: expect.any(String),
            heartRate: expect.any(Number),
            oxygenLevel: expect.any(Number),
            timestamp: expect.any(Number),
          }),
        })
      );

    });
  });
});
