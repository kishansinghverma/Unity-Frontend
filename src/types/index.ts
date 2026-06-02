import type { ReactNode } from 'react';

export interface AppInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'select' | 'date' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
}

export interface Record {
  id: string;
  [key: string]: unknown;
}

export interface ListColumn<T = Record> {
  id: string;
  label: string;
  accessor: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (item: T) => ReactNode;
  alignment?: 'left' | 'center' | 'right';
}

export interface Filter {
  field: string;
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan';
  value: string;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}
