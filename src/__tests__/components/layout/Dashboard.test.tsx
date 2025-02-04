import { render, screen, fireEvent, waitFor } from "../../test-utils";
import { Dashboard } from "../../../components/layout/Dashboard/Dashboard";
import { createMockPatients } from "../../test-utils/mockData";
import { mockUsePatients } from "../../test-utils/mockHooks";
import {
  verifyAbsentPatients,
  verifyRenderedPatients,
} from "../../test-utils/testHelpers";
import { useSearch } from "../../../hooks/useSearch";
// import { Patient } from "../../../types/patient";

const mockPatients = createMockPatients();

jest.mock("../../../hooks/queries", () => ({
  usePatients: jest.fn().mockReturnValue({
    data: [],
    isLoading: false,
    isError: false,
    error: null,
  }),
}));

jest.mock("../../../hooks/useWebSocket", () => ({
  useWebSocket: jest.fn(),
}));

jest.mock("../../../hooks/useSearch", () => ({
  useSearch: jest.fn().mockReturnValue({
    searchTerm: "", // Default search term
    setSearchTerm: jest.fn(),
    setExactSearchTerm: jest.fn(),
    filteredPatients: [], // Default empty filtered patients
  }),
}));

describe("Dashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePatients({ data: mockPatients });
  });

  it("renders all patients when no search term is applied", async () => {
    (useSearch as jest.Mock).mockReturnValue({
      setSearchTerm: jest.fn(),
      setExactSearchTerm: jest.fn(),
      filteredPatients: mockPatients,
    });

    render(<Dashboard />);
    await waitFor(() => verifyRenderedPatients(["John Doe", "Alice Smith"]));
  });

  it("renders loading state when patients are being fetched", () => {
    mockUsePatients({ isLoading: true });

    render(<Dashboard />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders error state when fetching patients fails", () => {
    mockUsePatients({ isError: true, error: { message: "Failed to fetch" } });

    render(<Dashboard />);
    expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
  });

  it("filters patients by search term using useSearch", async () => {
    (useSearch as jest.Mock).mockReturnValue({
      setSearchTerm: jest.fn(),
      setExactSearchTerm: jest.fn(),
      filteredPatients: [mockPatients[0]], // Mock returning only "John Doe"
    });

    render(<Dashboard />);
    await waitFor(() => verifyRenderedPatients(["John Doe"]));
    await waitFor(() => verifyAbsentPatients(["Alice Smith"]));
  });

  // it("clears search term when reset button is clicked", async () => {
  //   const setSearchTerm = jest.fn();
  //   (useSearch as jest.Mock).mockReturnValue({
  //     setSearchTerm,
  //     setExactSearchTerm: jest.fn(),
  //     filteredPatients: mockPatients,
  //   });

  //   render(<Dashboard />);

  //   const searchInput = screen.getByPlaceholderText(/search/i);
  //   fireEvent.change(searchInput, { target: { value: "john" } });
  //   fireEvent.click(screen.getByText(/reset/i));

  //   await waitFor(() => {
  //     expect(searchInput).toHaveValue("");
  //     expect(setSearchTerm).toHaveBeenCalledWith("");
  //   });
  // });

  it("updates search term when user types in search input", async () => {
    const setSearchTerm = jest.fn();
    (useSearch as jest.Mock).mockReturnValue({
      setSearchTerm,
      setExactSearchTerm: jest.fn(),
      filteredPatients: [],
    });

    render(<Dashboard />);
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "john" } });

    await waitFor(() => {
      expect(setSearchTerm).toHaveBeenCalledWith("john");
    });
  });
});
