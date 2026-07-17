export interface Price {
  _id: string;
  size: string;
  amount: number;
  markupPrice: number;
  discount: number;
  skuCode: string;
  isAvailable: boolean;
  isFewLeft: boolean;
}

export interface ProductItem {
  _id: string;
  title: string;
  description: string;
  image: string;
  subImages: string[];
  color: string;
  category: string;
  subCategory: string;
  brand: string;
  gender: string;
  sizeType: string;
  averageRating: number;
  price: Price[];
}

export interface ProductTableProps {
  items: ProductItem[];
  search: string;
  onSearch: (value: string) => void;
  onEdit: (item: ProductItem) => void;
  onDelete: (item: ProductItem) => void;
}
