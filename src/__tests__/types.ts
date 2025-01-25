import { Patient } from "../types/patient";

// __tests__/types.ts
export interface SortConfig<T = any> {
    field: keyof T;
    direction: 'asc' | 'desc';
  }
  export type SortFunction = (field: keyof Patient) => void;
  export type ResetFunction = () => void;
