export interface ColorFamily {
  id: string;
  srNo: number;
  colorFamily: string;
}

export type ColorFamilyFormValues = {
  colorFamily: string;
};

export type ModalMode = 'add' | 'edit';
