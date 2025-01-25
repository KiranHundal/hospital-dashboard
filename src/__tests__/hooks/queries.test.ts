import { renderHook, act } from "@testing-library/react-hooks";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePatients, usePatient, useUpdatePatientVitals } from "../../hooks/queries";
import { PatientService } from "../../services/patientService";
import { createMockPatients } from "../test-utils/mockData";

jest.mock("../../services/patientService");
type MyQueryClientProvider = typeof QueryClientProvider;

const queryClient = new QueryClient();

// const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
//     <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
//   );


describe("queries.ts hooks", () => {
  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  describe("usePatients", () => {
    const mockPatients = createMockPatients();

    it("fetches and returns patient data successfully", async () => {
      (PatientService.getInstance().fetchPatients as jest.Mock).mockResolvedValue({
        patients: mockPatients,
        error: null,
      });

      const { result, waitFor } = renderHook(() => usePatients(), { wrapper });

      await waitFor(() => result.current.isSuccess);

      expect(result.current.data).toEqual(mockPatients);
      expect(PatientService.getInstance().fetchPatients).toHaveBeenCalledTimes(1);
    });

    it("handles errors gracefully", async () => {
      (PatientService.getInstance().fetchPatients as jest.Mock).mockRejectedValue(new Error("Failed to fetch"));

      const { result, waitFor } = renderHook(() => usePatients(), { wrapper });

      await waitFor(() => result.current.isError);

      expect(result.current.error).toEqual(expect.objectContaining({ message: "Failed to fetch" }));
    });

    it("reads initial data from localStorage", async () => {
      localStorage.setItem("patients", JSON.stringify(mockPatients));

      const { result } = renderHook(() => usePatients(), { wrapper });

      expect(result.current.data).toEqual(mockPatients);
    });
  });

  describe("usePatient", () => {
    const mockPatients = createMockPatients();
    const mockPatient = mockPatients[0];

    it("fetches a patient by ID successfully", async () => {
      (PatientService.getInstance().getPatientById as jest.Mock).mockResolvedValue(mockPatient);

      const { result, waitFor } = renderHook(() => usePatient(mockPatient.id), { wrapper });

      await waitFor(() => result.current.isSuccess);

      expect(result.current.data).toEqual(mockPatient);
      expect(PatientService.getInstance().getPatientById).toHaveBeenCalledWith(mockPatient.id);
    });

    it("throws an error when the patient is not found", async () => {
      (PatientService.getInstance().getPatientById as jest.Mock).mockResolvedValue(null);

      const { result, waitFor } = renderHook(() => usePatient("invalid-id"), { wrapper });

      await waitFor(() => result.current.isError);

      expect(result.current.error).toEqual(expect.objectContaining({ message: "Patient not found" }));
    });

    it("reads initial data from localStorage", async () => {
      localStorage.setItem(`patient-${mockPatient.id}`, JSON.stringify(mockPatient));

      const { result } = renderHook(() => usePatient(mockPatient.id), { wrapper });

      expect(result.current.data).toEqual(mockPatient);
    });
  });

  describe("useUpdatePatientVitals", () => {
    const mockPatient = createMockPatients()[0];
    const updatedVitals = { bloodPressure: "130/90" };

    it("updates patient vitals and caches successfully", async () => {
      const updatedPatient = { ...mockPatient, vitals: updatedVitals };

      (PatientService.getInstance().updatePatientVitals as jest.Mock).mockResolvedValue(updatedPatient);

      const { result } = renderHook(() => useUpdatePatientVitals(), { wrapper });

      await act(async () =>
        result.current.mutateAsync({ patientId: mockPatient.id, vitals: updatedVitals })
      );

      expect(PatientService.getInstance().updatePatientVitals).toHaveBeenCalledWith(mockPatient.id, updatedVitals);
      expect(queryClient.getQueryData(["patient", mockPatient.id])).toEqual(updatedPatient);
    });

    it("handles errors when updating fails", async () => {
      (PatientService.getInstance().updatePatientVitals as jest.Mock).mockRejectedValue(new Error("Update failed"));

      const { result } = renderHook(() => useUpdatePatientVitals(), { wrapper });

      await expect(
        act(async () =>
          result.current.mutateAsync({ patientId: "invalid-id", vitals: { heartRate: 75 } })
        )
      ).rejects.toThrow("Update failed");
    });
  });
});
