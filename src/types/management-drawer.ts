import type { TypeManagement } from './type-management';

export interface ManagementDrawer<T> {
  isOpen: boolean;
  type: TypeManagement;
  entity: T | null;
}
