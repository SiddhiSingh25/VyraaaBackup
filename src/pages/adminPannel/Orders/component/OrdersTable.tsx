import { Eye } from "lucide-react";
import type { OrdersTableProps } from "./types";

const OrdersTable = ({ items, onView }: OrdersTableProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E7D8CC] bg-[#FFF8F2]">
      <table className="min-w-full">
        <thead>
          <tr className="border-b text-left text-sm text-[#8B5E49]">
            <th className="px-4 py-3">Order Id</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Products</th>
            <th className="px-4 py-3">Items</th>
            <th className="px-4 py-3">Grand Total</th>
            <th className="px-4 py-3">Payment</th>
            <th className="px-4 py-3">Order Status</th>
            <th className="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {items.map((order) => (
            <tr key={order._id} className="border-b">
              <td className="px-4 py-3">#{order._id.slice(-6)}</td>

              <td className="px-4 py-3">{order.user.email}</td>

              <td className="px-4 py-3">
                {order.items.map((x) => x.product.title).join(", ")}
              </td>

              <td className="px-4 py-3">{order.items.length}</td>

              <td className="px-4 py-3">₹{order.grandTotal}</td>

              <td className="px-4 py-3">
                <div>
                  <div>{order.paymentMethod}</div>
                  <div className="text-xs text-slate-500">
                    {order.paymentStatus}
                  </div>
                </div>
              </td>

              <td className="px-4 py-3">
                <span className="rounded bg-yellow-100 px-2 py-1 text-xs">
                  {order.orderStatus}
                </span>
              </td>

              <td className="px-4 py-3">
                <div className="flex justify-center">
                  <button
                    onClick={() => onView?.(order)}
                    className="rounded border p-2"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
