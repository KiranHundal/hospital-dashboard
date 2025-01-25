// test-utils/testHelpers.ts
import { screen } from "@testing-library/react";

export const verifyRenderedPatients = (expectedPatients: string[]) => {
  expectedPatients.forEach((name) => {
    expect(screen.getByText(name)).toBeInTheDocument();
  });
};

export const verifyAbsentPatients = (unexpectedPatients: string[]) => {
  unexpectedPatients.forEach((name) => {
    expect(screen.queryByText(name)).not.toBeInTheDocument();
  });
};
