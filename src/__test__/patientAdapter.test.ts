import { patientAdapter } from "../services/patientAdapter";
import { createTestPost, expectValidPatient } from "./utils/patientTestUtils";

describe("patientAdapter.transformPostToPatient", () => {
  const fixedTimestamp = 1630000000000;

  beforeEach(() => {
    jest.spyOn(Date, "now").mockReturnValue(fixedTimestamp);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Transformation Validation", () => {
    it("transforms a valid post into a complete patient object", () => {
      const post = createTestPost();

      const patient = patientAdapter.transformPostToPatient(post);

      expectValidPatient(patient, fixedTimestamp);
    });

    it("generates unique patient IDs", () => {
      const post1 = createTestPost({ id: 1, title: "Patient 1" });
      const post2 = createTestPost({ id: 2, title: "Patient 2" });

      const patient1 = patientAdapter.transformPostToPatient(post1);
      const patient2 = patientAdapter.transformPostToPatient(post2);

      expect(patient1.id).toBe("P0001");
      expect(patient2.id).toBe("P0002");
    });
  });

  describe("Error Handling", () => {
    it("handles minimal post data with all required properties", () => {
      const minimalPost = createTestPost({ id: 999, title: "Minimal Patient", body: "Minimal content" });
      const patient = patientAdapter.transformPostToPatient(minimalPost);

      expectValidPatient(patient, fixedTimestamp);
    });
  });
});
