import { Eye } from "lucide-react";
import type { OrdersTableProps } from "./types";

const getBadgeColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Accepted":
      return "bg-sky-100 text-sky-700 border-sky-200";
    case "Processing":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "Shipped":
      return "bg-indigo-100 text-indigo-700 border-indigo-200";
    case "In-Transit":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Delivered":
      return "bg-green-100 text-green-700 border-green-200";
    case "Cancelled":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const OrdersTable = ({ items, onView, page = 1, limit = 10 }: OrdersTableProps) => {
  return (
    <div className="overflow-hidden rounded-xl border border-[#E7D8CC] bg-[#FFF8F2]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="border-b border-[#D8C4B5] text-left font-semibold text-[#8B5E49]">
              <th className="px-3 py-2.5 whitespace-nowrap">Sr. no.</th>
              <th className="px-3 py-2.5">Customer</th>
              <th className="px-3 py-2.5 min-w-[150px]">Products</th>
              <th className="px-3 py-2.5 whitespace-nowrap">Items</th>
              <th className="px-3 py-2.5 whitespace-nowrap">Total</th>
              <th className="px-3 py-2.5 whitespace-nowrap">Payment</th>
              <th className="px-3 py-2.5 whitespace-nowrap">Status</th>
              <th className="px-3 py-2.5 text-center whitespace-nowrap">Action</th>
            </tr>
          </thead>

          <tbody>
            {items.map((order: any, index: number) => {
              // Calculate accurate serial number based on page (removed stray backticks)
              const srNo = (page - 1) * limit + index + 1;

              return (
                <tr key={order._id} className="border-b border-[#EFE4DB] transition-colors hover:bg-[#FFFDFB]">
                  <td className="px-3 py-2.5 text-slate-500 font-medium">{srNo}</td>

                  <td className="px-3 py-2.5 text-[#3F322B] break-all min-w-[120px]">
                    {order.user?.email || "N/A"}
                  </td>

                  <td className="px-3 py-2.5 text-[#5E4637] line-clamp-2">
                    {order.items.map((x: any) => x.product?.title).join(", ")}
                  </td>

                  <td className="px-3 py-2.5 font-medium text-center">
                    {order.items.length}
                  </td>

                  <td className="px-3 py-2.5 font-semibold text-[#6F4A36] whitespace-nowrap">
                    ₹{order.grandTotal}
                  </td>

                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <div className="font-medium text-[#3F322B]">{order.paymentMethod}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {order.paymentStatus}
                    </div>
                  </td>

                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <span className={`rounded-md border px-2 py-1 text-[10px] font-medium ${getBadgeColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </td>

                  <td className="px-3 py-2.5">
                    <div className="flex justify-center">
                      <button
                        onClick={() => onView?.(order)}
                        className="rounded-md border border-[#E7D8CC] p-1.5 text-[#8B5E49] transition hover:bg-[#FFF8F2] hover:border-[#8B5E49]"
                        title="View Order"
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;