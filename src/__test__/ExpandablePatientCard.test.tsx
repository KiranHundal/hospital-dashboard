import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import { Patient, Gender } from "../types/patient";
import ExpandablePatientCard from "../components/patient/ExpandablePatientCard";

describe("ExpandablePatientCard component", () => {
  const patient: Patient = {
    id: "P0001",
    name: "Jane Doe",
    age: 60,
    room: "101",
    gender: Gender.Female,
    vitals: {
      bloodPressure: "130/85",
      heartRate: 75,
      oxygenLevel: 97,
      timestamp: 1630000000000,
      isBPHigh: false,
      isBPLow: false,
      isHRHigh: false,
      isHRLow: false,
      isO2Low: false,
      severityScore: 0,
    },
    fallRisk: false,
    isolation: false,
    npo: false,
  };

  it("renders patient info and toggles details", () => {
    render(<ExpandablePatientCard patient={patient} />);

    expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();

    const toggleButton = screen.getByRole("button", {
      name: /expand details/i,
    });
    expect(toggleButton).toBeInTheDocument();

    const expandableSection = screen.getByTestId("expandable-section");
    expect(expandableSection).toHaveClass("max-h-0");

    fireEvent.click(toggleButton);
    expect(expandableSection).toHaveClass("max-h-96");
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/Vital Trends/i)).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(expandableSection).toHaveClass("max-h-0");
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
  });


  it("displays critical status when severity score is high", () => {
    const criticalPatient = {
      ...patient,
      vitals: {
        ...patient.vitals,
        bloodPressure: "180/120",
        heartRate: 120,
        oxygenLevel: 88,
        severityScore: 3,
        isBPHigh: true,
        isHRHigh: true,
        isO2Low: true,
      },
    };

    render(<ExpandablePatientCard patient={criticalPatient} />);

    const criticalBadge = screen.getByText("Critical");
    expect(criticalBadge).toBeInTheDocument();
    expect(criticalBadge).toHaveClass("bg-red-100", "text-red-800");
  });
  it("shows vital status indicators correctly", () => {
    const criticalPatient = {
      ...patient,
      vitals: {
        ...patient.vitals,
        bloodPressure: "180/120",
        heartRate: 120,
        oxygenLevel: 88,
        severityScore: 3,
        isBPHigh: true,
        isHRHigh: true,
        isO2Low: true,
      },
    };

    render(<ExpandablePatientCard patient={criticalPatient} />);

    expect(screen.getByText("180/120")).toHaveClass("text-red-600");
    expect(screen.getByText(/120 bpm/)).toHaveClass("text-red-600");
    expect(screen.getByText(/88%/)).toHaveClass("text-red-600");
  });

  it("renders status icons when conditions are true", () => {
    const patientWithConditions = {
      ...patient,
      fallRisk: true,
      isolation: true,
      npo: true,
    };

    render(<ExpandablePatientCard patient={patientWithConditions} />);

    const fallRiskIcon = screen.getByLabelText("Fall Risk");
    const isolationIcon = screen.getByLabelText("Isolation Required");
    const npoIcon = screen.getByLabelText("NPO (Nothing by Mouth)");

    expect(fallRiskIcon).toBeInTheDocument();
    expect(isolationIcon).toBeInTheDocument();
    expect(npoIcon).toBeInTheDocument();
  });

  it("shows patient vitals information", () => {
    render(<ExpandablePatientCard patient={patient} />);

    expect(screen.getByText("130/85")).toBeInTheDocument();
    expect(screen.getByText(/75 bpm/)).toBeInTheDocument();
    expect(screen.getByText(/97%/)).toBeInTheDocument();
  });
});
