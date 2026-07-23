export interface Category {
  id: string;
  srNo: number;
  image?: string;
  categoryName: string;
  categoryHead: string;
  fatherName: string;
  cast: string;
  contact: string;
  profileImageUrl?: string;
}

/** Shape used by the Add/Edit form — no id/srNo, those are managed by the table. */
export interface CategoryFormValues {
  categoryName: string;
  image: File | string | null;

  categoryHead: string;
  fatherName: string;
  cast: string;
  contact: string;
}

export type ModalMode = "add" | "edit";
