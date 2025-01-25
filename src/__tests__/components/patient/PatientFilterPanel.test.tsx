import { render, screen, fireEvent } from "@testing-library/react";
import { PatientFilterPanel } from "../../../components/patient/PatientFilterPanel";

describe("PatientFilterPanel", () => {
  const mockOnClose = jest.fn();
  const mockOnFilterChange = jest.fn();

  const setup = () =>
    render(
      <PatientFilterPanel onClose={mockOnClose} onFilterChange={mockOnFilterChange} />
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all input fields and buttons", () => {
    setup();

    // Check for inputs and labels
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/age range/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/room/i)).toBeInTheDocument();
    expect(screen.getByText(/critical vitals/i)).toBeInTheDocument();
    expect(screen.getByText(/recent updates/i)).toBeInTheDocument();

    // Check for buttons
    expect(screen.getByRole("button", { name: /apply filters/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", () => {
    setup();

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onFilterChange with correct criteria on apply", () => {
    setup();

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText(/min/i), { target: { value: "20" } });
    fireEvent.change(screen.getByPlaceholderText(/max/i), { target: { value: "40" } });
    fireEvent.change(screen.getByLabelText(/gender/i), { target: { value: "male" } });
    fireEvent.change(screen.getByLabelText(/room/i), { target: { value: "101" } });

    // Check some critical vitals
    fireEvent.click(screen.getByLabelText(/high blood pressure/i));
    fireEvent.click(screen.getByLabelText(/low oxygen/i));

    // Check recent updates
    fireEvent.click(screen.getByLabelText(/recent updates/i));

    const applyButton = screen.getByRole("button", { name: /apply filters/i });
    fireEvent.click(applyButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      name: "John",
      ageRange: [20, 40],
      gender: "male",
      room: "101",
      criticalVitals: {
        highBP: true,
        lowOxygen: true,
        abnormalHeartRate: false,
      },
      recentUpdates: true,
    });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("handles empty inputs and unchecked checkboxes gracefully", () => {
    setup();

    const applyButton = screen.getByRole("button", { name: /apply filters/i });
    fireEvent.click(applyButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      name: "",
      ageRange: undefined,
      gender: undefined,
      room: "",
      criticalVitals: {
        highBP: false,
        lowOxygen: false,
        abnormalHeartRate: false,
      },
      recentUpdates: false,
    });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("parses age range correctly when partially filled", () => {
    setup();

    fireEvent.change(screen.getByPlaceholderText(/min/i), { target: { value: "20" } });

    const applyButton = screen.getByRole("button", { name: /apply filters/i });
    fireEvent.click(applyButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ ageRange: undefined }) // Incomplete range
    );
  });
  it("handles edge cases for age range input", () => {
    setup();

    // Non-numeric input (should ignore)
    fireEvent.change(screen.getByPlaceholderText(/min/i), { target: { value: "abc" } });
    fireEvent.change(screen.getByPlaceholderText(/max/i), { target: { value: "xyz" } });

    const applyButton = screen.getByRole("button", { name: /apply filters/i });
    fireEvent.click(applyButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ ageRange: undefined }) // Non-numeric values should result in undefined
    );

    // Out-of-bound input (negative and large values)
    fireEvent.change(screen.getByPlaceholderText(/min/i), { target: { value: "-10" } });
    fireEvent.change(screen.getByPlaceholderText(/max/i), { target: { value: "1000" } });

    fireEvent.click(applyButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ ageRange: [-10, 1000] }) // Out-of-bound values should be passed as-is
    );

    // Invalid range (min > max)
    fireEvent.change(screen.getByPlaceholderText(/min/i), { target: { value: "50" } });
    fireEvent.change(screen.getByPlaceholderText(/max/i), { target: { value: "20" } });

    fireEvent.click(applyButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ ageRange: undefined }) // Invalid range should result in undefined
    );
  });

});
