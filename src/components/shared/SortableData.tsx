import React from 'react';
import { Patient } from '../../types/patient';
import { StorageService } from '../../services/StorageService';
import VitalSignsService from '../../services/VitalSignsService';

export interface SortConfig<T> {
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
}

export class SortableData<T extends Record<string, any>> extends React.Component<
  SortableDataProps<T>,
  SortableDataState<T>
> {
  private storage: StorageService;
  private vitalService: VitalSignsService;

  constructor(props: SortableDataProps<T>) {
    super(props);
    this.storage = StorageService.getInstance();
    this.vitalService = VitalSignsService.getInstance();


    const savedConfig = this.storage.getSortConfig() as SortConfig<T> | null;
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

  getSortedData = () => {
    const { data } = this.props;
    const { sortConfig } = this.state;

    if (!sortConfig) return data;


    return [...data].sort((a, b) => {
        if (this.isPatientData(a) && this.isPatientData(b) && sortConfig.field === 'vitals') {
          const aStatus = this.vitalService.analyzeVitals(a.vitals);
          const bStatus = this.vitalService.analyzeVitals(b.vitals);
          return sortConfig.direction === 'asc'
            ? bStatus.severityScore - aStatus.severityScore
            : aStatus.severityScore - bStatus.severityScore;
        }

      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];

      const multiplier = sortConfig.direction === 'asc' ? 1 : -1;

      if (sortConfig.field === 'id' && typeof aValue === 'string' && typeof bValue === 'string') {
        const aNum = parseInt(aValue.replace(/\D/g, ''));
        const bNum = parseInt(bValue.replace(/\D/g, ''));
        return multiplier * (aNum - bNum);
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return multiplier * aValue.localeCompare(bValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return multiplier * (aValue - bValue);
      }

      return 0;
    });
  };

  private isPatientData(item: any): item is Patient {
    return (
      item &&
      typeof item === 'object' &&
      'vitals' in item &&
      typeof item.vitals === 'object' &&
      'oxygenLevel' in item.vitals
    );
  }

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
