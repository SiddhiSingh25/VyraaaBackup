export interface SizeItem {
  id: string;
  srNo: number;
  size: string;
  sizeType: string; // id
  sizeTypeName?: string;
}

export type SizeFormValues = {
  sizeType: string;
  size: string;
};

export type ModalMode = 'add' | 'edit';
