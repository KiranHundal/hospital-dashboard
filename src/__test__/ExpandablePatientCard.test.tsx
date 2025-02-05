import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import ExpandablePatientCard from "../components/patient/ExpandablePatientCard";
import { createPatientFixture } from "./utils/patientTestUtils";

describe("ExpandablePatientCard", () => {
  const defaultPatient = createPatientFixture({
    name: 'Jane Doe',
    age: 45,
    room: '101'
  });

  describe('Basic Rendering', () => {
    it("displays patient basic information", () => {
        render(<ExpandablePatientCard patient={defaultPatient} />);

        expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
        expect(screen.getByText(/45/)).toBeInTheDocument();

        expect(screen.getByText("101")).toBeInTheDocument();
    });

    it("shows patient vitals information", () => {
      render(<ExpandablePatientCard patient={defaultPatient} />);

      expect(screen.getByText("120/80")).toBeInTheDocument();
      expect(screen.getByText(/70 bpm/)).toBeInTheDocument();
      expect(screen.getByText(/98%/)).toBeInTheDocument();
    });
  });

  describe('Expandable Functionality', () => {
    it("toggles expandable section correctly", () => {
      render(<ExpandablePatientCard patient={defaultPatient} />);

      const toggleButton = screen.getByRole("button", { name: /expand details/i });
      const expandableSection = screen.getByTestId("expandable-section");

      expect(expandableSection).toHaveClass("max-h-0");
      expect(toggleButton).toHaveAttribute("aria-expanded", "false");

      fireEvent.click(toggleButton);
      expect(expandableSection).toHaveClass("max-h-96");
      expect(toggleButton).toHaveAttribute("aria-expanded", "true");

      fireEvent.click(toggleButton);
      expect(expandableSection).toHaveClass("max-h-0");
      expect(toggleButton).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe('Critical Status Indicators', () => {
    it("shows critical badge and red indicators for high severity", () => {
      const criticalPatient = createPatientFixture({
        vitals: {
          bloodPressure: "180/120",
          heartRate: 110,
          oxygenLevel: 88,
          severityScore: 3,
          isBPHigh: true,
          isBPLow: false,
          isHRHigh: true,
          isHRLow: false,
          isO2Low: true,
          timestamp: 1630000000000,
        }
      });

      render(<ExpandablePatientCard patient={criticalPatient} />);

      const criticalBadge = screen.getByText("Critical");
      expect(criticalBadge).toHaveClass("bg-red-100", "text-red-800");

      expect(screen.getByText("180/120")).toHaveClass("text-red-600");
      expect(screen.getByText(/110 bpm/)).toHaveClass("text-red-600");
      expect(screen.getByText(/88%/)).toHaveClass("text-red-600");
    });

    it("renders status icons when conditions are present", () => {
      const complexPatient = createPatientFixture({
        fallRisk: true,
        isolation: true,
        npo: true
      });

      render(<ExpandablePatientCard patient={complexPatient} />);

      expect(screen.getByLabelText("Fall Risk")).toBeInTheDocument();
      expect(screen.getByLabelText("Isolation Required")).toBeInTheDocument();
      expect(screen.getByLabelText("NPO (Nothing by Mouth)")).toBeInTheDocument();
    });
  });
});
