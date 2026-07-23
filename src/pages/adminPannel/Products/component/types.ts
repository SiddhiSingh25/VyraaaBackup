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

export interface Brand {
  _id: string;
  brand: string;
  image: string;
  category: string;
  createdAt: string;
  updatedAt: string;
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
  brand: Brand;
  gender: string;
  sizeType: string;
  averageRating: number;
  price: Price[];
}

export interface ProductTableProps {
  items: ProductItem[];
  search: string;
  onSearch: (value: string) => void;
  pagination: ProductPagination;
  onPageChange: (page: number) => void;
  onEdit: (item: ProductItem) => void;
  onDelete: (item: ProductItem) => void;
}

export interface ProductPagination {
  totalProducts: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}
