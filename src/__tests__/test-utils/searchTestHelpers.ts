import { Patient } from "../../types/patient";

export const testSearchFunctionality = (
    searchFunction: (term: string) => Patient[],
    testCases: Array<{
      searchTerm: string,
      expectedResultCount: number,
      expectedValidator?: (results: Patient[]) => boolean
    }>
  ) => {
    testCases.forEach(({ searchTerm, expectedResultCount, expectedValidator }) => {
      const results = searchFunction(searchTerm);

      expect(results).toHaveLength(expectedResultCount);

      if (expectedValidator) {
        expect(expectedValidator(results)).toBe(true);
      }
    });
  };
