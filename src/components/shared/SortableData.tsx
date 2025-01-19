import React from 'react';
import { Patient } from '../../types/patient';
import { analyzeVitals } from '../../utils/vitalUtils';

interface SortConfig<T> {
  field: keyof T;
  direction: 'asc' | 'desc';
}

interface SortableDataProps<T> {
  data: T[];
  defaultSortField?: keyof T;
  defaultSortDirection?: 'asc' | 'desc';
  children: (props: {
    sortedData: T[];
    sortConfig: SortConfig<T> | null;
    handleSort: (field: keyof T) => void;
    resetSort: () => void;
  }) => React.ReactNode;
}

interface SortableDataState<T> {
  sortConfig: SortConfig<T> | null;
  defaultConfig: SortConfig<T> | null;
}

export class SortableData<T extends Record<string, any>> extends React.Component<
  SortableDataProps<T>,
  SortableDataState<T>
> {
  constructor(props: SortableDataProps<T>) {
    super(props);
    const defaultConfig = props.defaultSortField ? {
      field: props.defaultSortField,
      direction: props.defaultSortDirection || 'asc'
    } : null;

    this.state = {
      sortConfig: defaultConfig,
      defaultConfig
    };
  }

  handleSort = (field: keyof T) => {
    this.setState((prevState: SortableDataState<T>) => ({
      sortConfig: {
        field,
        direction:
          prevState.sortConfig?.field === field &&
          prevState.sortConfig.direction === 'asc'
            ? 'desc'
            : 'asc'
      }
    }));
  };

  resetSort = () => {
    this.setState({ sortConfig: this.state.defaultConfig });
  };

  getSortedData = () => {
    const { data } = this.props;
    const { sortConfig } = this.state;

    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      if (this.isPatientData(a) && this.isPatientData(b) && sortConfig.field === 'vitals') {
        const aStatus = analyzeVitals(a.vitals);
        const bStatus = analyzeVitals(b.vitals);
        return sortConfig.direction === 'asc'
          ? aStatus.severityScore - bStatus.severityScore
          : bStatus.severityScore - aStatus.severityScore;
      }

      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];

      if (sortConfig.field === 'id' && typeof aValue === 'string' && typeof bValue === 'string') {
        const aNum = parseInt(aValue.replace(/\D/g, ''));
        const bNum = parseInt(bValue.replace(/\D/g, ''));
        return sortConfig.direction === 'asc'
          ? aNum - bNum
          : bNum - aNum;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });
  };

  private isPatientData(item: any): item is Patient {
    return item && 'vitals' in item;
  }

  render() {
    return this.props.children({
      sortedData: this.getSortedData(),
      sortConfig: this.state.sortConfig,
      handleSort: this.handleSort,
      resetSort: this.resetSort
    });
  }
}
