export interface SortConfig<T = unknown> {
  field: keyof T;
  direction: 'asc' | 'desc';
}
