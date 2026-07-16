export interface PropertyValueItem {
  id: string;
  srNo: number;
  property: string; // id
  propertyName?: string;
  value: string;
}

export type PropertyValueFormValues = {
  property: string;
  value: string;
};

export type ModalMode = 'add' | 'edit';
