export interface SubCategory {
  id: string;
  srNo: number;
  subCategory: string;
  category: string; // category id
  categoryName?: string; // resolved category name for UI
}

export type SubCategoryFormValues = {
  category: string;
  subCategory: string;
};

export type ModalMode = 'add' | 'edit';
