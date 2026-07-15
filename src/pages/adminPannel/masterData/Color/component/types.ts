export interface ColorItem {
  id: string;
  srNo: number;
  color: string;
  hexCode?: string;
  family: string; // family id
  familyName?: string;
}

export type ColorFormValues = {
  family: string;
  color: string;
  hexCode?: string;
};

export type ModalMode = 'add' | 'edit';
