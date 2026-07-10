export interface PropertyItem {
  id: string;
  srNo: number;
  property: string;
  subCategory: string; // id
  subCategoryName?: string;
}

export type PropertyFormValues = {
  subCategory: string;
  property: string;
};

export type ModalMode = 'add' | 'edit';
