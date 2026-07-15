export interface SizeTypeItem {
  id: string;
  srNo: number;
  sizeType: string;
}

export type SizeTypeFormValues = {
  sizeType: string;
};

export type ModalMode = 'add' | 'edit';
