import { SortableData } from "../../../components/shared/SortableData";
import { Patient } from "../../../types/patient";
import { render, screen, fireEvent, waitFor } from "../../test-utils";
import { act } from "@testing-library/react";
import { createMockPatients } from "../../test-utils/mockData";
import { ResetFunction, SortConfig, SortFunction } from "../../types";

interface SortableRenderProps {
  sortedData: Patient[];
  sortConfig: SortConfig | null;
  handleSort: SortFunction;
  resetSort: ResetFunction;
}

describe("SortableData", () => {
  const mockPatients = createMockPatients();

  it("renders child content", () => {
    render(
      <SortableData data={mockPatients}>
        {({ sortedData }: SortableRenderProps) => (
          <div>
            {sortedData.map((patient) => (
              <div key={patient.id}>{patient.name}</div>
            ))}
          </div>
        )}
      </SortableData>
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
  });

  it("sorts data by id in ascending order when defaultSortField is provided", async () => {
    const state = {
      sortedData: [] as Patient[],
    };

    render(
      <SortableData
        data={mockPatients}
        defaultSortField="id"
        defaultSortDirection="asc"
      >
        {({ sortedData }: SortableRenderProps) => {
          state.sortedData = sortedData;
          return (
            <div>
              {sortedData.map((patient) => (
                <div key={patient.id} data-testid="patient-id">
                  {patient.id}
                </div>
              ))}
            </div>
          );
        }}
      </SortableData>
    );

    await waitFor(() => {
      expect(screen.getAllByTestId("patient-id")[0]).toHaveTextContent("P001");
    });
  });

  it("handles sort direction toggle", async () => {
    const state = {
      handleSort: undefined as SortFunction | undefined,
    };

    render(
      <SortableData data={mockPatients}>
        {({ handleSort, sortedData }: SortableRenderProps) => {
          state.handleSort = handleSort;
          return (
            <div>
              {sortedData.map((patient) => (
                <div key={patient.id} data-testid="patient-id">
                  {patient.id}
                </div>
              ))}
            </div>
          );
        }}
      </SortableData>
    );

    expect(state.handleSort).toBeDefined();
    if (state.handleSort) {
      await act(async () => {
        state.handleSort!("id");
      });

      await waitFor(() => {
        expect(screen.getAllByTestId("patient-id")[0]).toHaveTextContent(
          "P001"
        );
        expect(screen.getAllByTestId("patient-id")[1]).toHaveTextContent(
          "P002"
        );
      });

      await act(async () => {
        state.handleSort!("id");
      });

      await waitFor(() => {
        expect(screen.getAllByTestId("patient-id")[0]).toHaveTextContent(
          "P002"
        );
        expect(screen.getAllByTestId("patient-id")[1]).toHaveTextContent(
          "P001"
        );
      });
    }
  });

  it("sorts patients by vitals severity", async () => {
    const state = {
      handleSort: undefined as SortFunction | undefined,
    };

    render(
      <SortableData data={mockPatients}>
        {({ handleSort, sortedData }: SortableRenderProps) => {
          state.handleSort = handleSort;
          return (
            <div>
              {sortedData.map((patient) => (
                <div key={patient.id} data-testid="patient-id">
                  {patient.id}
                </div>
              ))}
            </div>
          );
        }}
      </SortableData>
    );

    expect(state.handleSort).toBeDefined();
    if (state.handleSort) {
      await act(async () => {
        state.handleSort!("vitals");
      });

      await waitFor(() => {
        const ids = screen.getAllByTestId("patient-id");
        expect(ids[0]).toHaveTextContent("P001");
        expect(ids[1]).toHaveTextContent("P002");
      });
    }
  });

  it("maintains sort state when data updates", async () => {
    const TestComponent = ({ patients }: { patients: Patient[] }) => (
      <SortableData data={patients}>
        {({ sortedData, handleSort }: SortableRenderProps) => (
          <div>
            {sortedData.map((patient) => (
              <div key={patient.id} data-testid="patient-name">
                {patient.name}
              </div>
            ))}
            <button onClick={() => handleSort("name")}>Sort by name</button>
          </div>
        )}
      </SortableData>
    );

    const { rerender } = render(<TestComponent patients={mockPatients} />);

    await act(async () => {
      fireEvent.click(screen.getByText("Sort by name"));
    });

    const newPatient: Patient = {
      id: "P003",
      name: "Bob Wilson",
      age: 50,
      gender: "male",
      room: "103",
      vitals: {
        bloodPressure: "130/85",
        heartRate: 70,
        oxygenLevel: 96,
      },
    };

    const updatedPatients: Patient[] = [...mockPatients, newPatient];

    await act(async () => {
      rerender(<TestComponent patients={updatedPatients} />);
    });

    await waitFor(() => {
      const names = screen.getAllByTestId("patient-name");
      expect(names[0]).toHaveTextContent("Alice Smith");
      expect(names[1]).toHaveTextContent("Bob Wilson");
      expect(names[2]).toHaveTextContent("John Doe");
    });
  });
});
