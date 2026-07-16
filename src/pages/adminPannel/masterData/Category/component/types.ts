export interface Category {
  id: string;
  srNo: number;
  categoryName: string;
  categoryHead: string;
  fatherName: string;
  cast: string;
  contact: string;
  profileImageUrl?: string;
}

/** Shape used by the Add/Edit form — no id/srNo, those are managed by the table. */
export type CategoryFormValues = Omit<Category, 'id' | 'srNo' | 'profileImageUrl'>;

export type ModalMode = 'add' | 'edit';
