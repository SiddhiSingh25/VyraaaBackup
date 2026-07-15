export interface SubCategoryType {
  id: string;
  srNo: number;
  subCategory: string; // subcategory id
  type: string;
  subCategoryName?: string;
}

export type SubCategoryTypeFormValues = {
  subCategory: string;
  type: string;
};

export type ModalMode = 'add' | 'edit';
