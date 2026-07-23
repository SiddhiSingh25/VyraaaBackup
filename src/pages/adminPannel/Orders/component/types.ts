export interface OrderUser {
  _id: string;
  email: string;
}

export interface OrderProduct {
  _id: string;
  title: string;
  category: string;
}

export interface OrderItem {
  _id: string;
  product: OrderProduct;
  size: string;
  quantity: number;
  purchasingPrice: number;
  itemTotal: number;
  itemStatus: string;
  refundAmount: number;
}

export interface Order {
  orderId: string;
  _id: string;
  user: OrderUser;
  items: OrderItem[];
  grandTotal: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
}

export interface OrdersTableProps {
  items: Order[];
  page: Number;
  limit: Number;
  onView?: (order: Order) => void;
}
