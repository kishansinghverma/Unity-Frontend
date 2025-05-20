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
  [key: string]: any;
}

export interface ListColumn {
  id: string;
  label: string;
  accessor: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (item: any) => React.ReactNode;
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