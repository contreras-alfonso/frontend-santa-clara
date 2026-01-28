export interface ColumnTable {
  name: string;
  label: string;
  field: string;
  align?: 'left' | 'right' | 'center';
  sortable: boolean;
  format?: (val: any) => any;
}
