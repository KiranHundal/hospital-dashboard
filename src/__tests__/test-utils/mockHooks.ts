
import { usePatients } from "../../hooks/queries";
import { Patient } from "../../types/patient";

export const mockUsePatients = ({
  data = [] as Patient[],
  isLoading = false,
  isError = false,
  error = null,
}: {
  data?: Patient[];
  isLoading?: boolean;
  isError?: boolean;
  error?: { message: string } | null;
}) => {
  (usePatients as jest.Mock).mockReturnValue({
    data,
    isLoading,
    isError,
    error,
    dataUpdatedAt: new Date().toISOString(),
  });
};
