import { SearchableSelect } from "@/components/SearchableDropdown/SearchableDropdown";

interface Props {
  status: string;
  paymentStatus: string;
  paymentMethod: string;

  setStatus: (v: string) => void;
  setPaymentStatus: (v: string) => void;
  setPaymentMethod: (v: string) => void;
}

const statusOptions = [
  { label: "All", value: "" },
  { label: "Pending", value: "Pending" },
  { label: "Accepted", value: "Accepted" },
  { label: "Shipped", value: "Shipped" },
  { label: "In-Transit", value: "In-Transit" },
  { label: "Delivered", value: "Delivered" },
  { label: "Cancelled", value: "Cancelled" },
];

const paymentStatusOptions = [
  { label: "All", value: "" },
  { label: "Pending", value: "Pending" },
  { label: "Paid", value: "Paid" },
  { label: "Failed", value: "Failed" },
];

const paymentMethodOptions = [
  { label: "All", value: "" },
  { label: "UPI", value: "UPI" },
  { label: "COD", value: "COD" },
  { label: "Card", value: "Card" },
];

const OrderFilters = ({
  status,
  paymentStatus,
  paymentMethod,
  setStatus,
  setPaymentStatus,
  setPaymentMethod,
}: Props) => {
  return (
    <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
      <SearchableSelect
        label="Order Status"
        options={statusOptions}
        value={status}
        placeholder="Select Order Status"
        onChange={(e) => setStatus(String(e.target.value))}
      />

      {/* <SearchableSelect
        label="Payment Status"
        options={paymentStatusOptions}
        value={paymentStatus}
        placeholder="Select Payment Status"
        onChange={(e) => setPaymentStatus(String(e.target.value))}
      />

      <SearchableSelect
        label="Payment Method"
        options={paymentMethodOptions}
        value={paymentMethod}
        placeholder="Select Payment Method"
        onChange={(e) => setPaymentMethod(String(e.target.value))}
      /> */}
    </div>
  );
};

export default OrderFilters;
