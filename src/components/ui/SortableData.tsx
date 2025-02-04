import React from 'react';
import { Patient } from '../../types/patient';
import { StorageService } from '../../services/StorageService';
import { SortConfig } from '../../types/sorting';
import { sortPatients } from '../../utils/sortHelpers';

interface SortableDataProps<T extends Patient> {
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
}

export class SortableData<T extends Patient> extends React.Component<
  SortableDataProps<T>,
  SortableDataState<T>
> {
  private storage: StorageService;

  constructor(props: SortableDataProps<T>) {
    super(props);
    this.storage = StorageService.getInstance();

    const savedConfig = this.storage.getSortConfig<T>();
    this.state = {
      sortConfig: savedConfig || (props.defaultSortField
        ? {
            field: props.defaultSortField,
            direction: props.defaultSortDirection || 'asc',
          }
        : null),
    };
  }

  handleSort = (field: keyof T) => {
    this.setState((prevState) => {
      const newConfig: SortConfig<T> = {
        field,
        direction:
          prevState.sortConfig?.field === field && prevState.sortConfig.direction === 'asc'
            ? 'desc'
            : 'asc',
      };
      this.storage.saveSortConfig(newConfig);
      return { sortConfig: newConfig };
    });
  };

  resetSort = () => {
    const { defaultSortField, defaultSortDirection } = this.props;
    const newConfig: SortConfig<T> | null = defaultSortField
      ? {
          field: defaultSortField,
          direction: defaultSortDirection || 'asc',
        }
      : null;
    this.setState({ sortConfig: newConfig });
    if (newConfig) {
      this.storage.saveSortConfig(newConfig);
    }
  };

  getSortedData = (): T[] => {
    const { data } = this.props;
    const { sortConfig } = this.state;
    if (!sortConfig) return data;
    return sortPatients(data, sortConfig);
  };

  render() {
    return (
      <div className="transition-colors duration-300">
        {this.props.children({
          sortedData: this.getSortedData(),
          sortConfig: this.state.sortConfig,
          handleSort: this.handleSort,
          resetSort: this.resetSort,
        })}
      </div>
    );
  }
}
