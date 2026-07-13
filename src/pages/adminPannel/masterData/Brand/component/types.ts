export interface BrandItem {
  id: string;
  srNo: number;
  brandName: string;
  categoryId: string;
  categoryName: string;
}

export interface BrandFormValues {
  brandName: string;
  categoryId: string;
}

export type ModalMode = 'add' | 'edit';
