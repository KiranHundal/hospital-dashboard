import { SortConfig } from '../components/shared/SortableData';

export type SortFunction = <T>(field: keyof T) => void;
export type ResetFunction = () => void;

export interface SortableRenderProps<T> {
  sortedData: T[];
  sortConfig: SortConfig<T> | null;
  handleSort: SortFunction;
  resetSort: ResetFunction;
}
