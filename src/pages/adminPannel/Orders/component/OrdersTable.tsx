import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
// Make sure to import or define OrdersTableProps to include `totalOrders` and `onPageChange`

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

const OrdersTable = ({
  items,
  onView,
  page = 1,
  limit = 10,
  totalOrders = 0,
  onPageChange
}: any) => {

  // Exact pagination math used in ProductTable
  const totalPages = Math.max(1, Math.ceil(totalOrders / limit));
  const safeCurrentPage = Math.max(1, Math.min(page || 1, totalPages));
  const firstEntry = totalOrders === 0 ? 0 : (safeCurrentPage - 1) * limit + 1;
  const lastEntry = Math.min(safeCurrentPage * limit, totalOrders);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E7D8CC] bg-[#FFF8F2]">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-[#D8C4B5] bg-[#FFF8F2] text-left text-sm font-semibold text-[#8B5E49]">
              <th className="px-4 py-3 whitespace-nowrap w-20">Sr. no.</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3 min-w-[150px]">Products</th>
              <th className="px-4 py-3 whitespace-nowrap">Items</th>
              <th className="px-4 py-3 whitespace-nowrap">Total</th>
              <th className="px-4 py-3 whitespace-nowrap">Payment</th>
              <th className="px-4 py-3 whitespace-nowrap">Status</th>
              <th className="px-4 py-3 text-center whitespace-nowrap">Action</th>
            </tr>
          </thead>

          <tbody>
            {items.map((order: any, index: number) => {
              const srNo = (safeCurrentPage - 1) * limit + index + 1;

              return (
                <tr
                  key={order._id}
                  className="border-b border-[#EFE4DB] hover:bg-[#FFFDFB] transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-[#5E4637]">
                    {srNo}
                  </td>

                  <td className="px-4 py-3 text-sm text-[#3F322B] break-all min-w-[120px]">
                    {order.user?.email || "N/A"}
                  </td>

                  <td className="px-4 py-3 text-sm text-[#5E4637] line-clamp-2">
                    {order.items.map((x: any) => x.product?.title).join(", ")}
                  </td>

                  <td className="px-4 py-3 text-sm font-medium text-center">
                    {order.items.length}
                  </td>

                  <td className="px-4 py-3 text-sm font-semibold text-[#6F4A36] whitespace-nowrap">
                    ₹{order.grandTotal}
                  </td>

                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    <div className="font-medium text-[#3F322B]">{order.paymentMethod}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {order.paymentStatus}
                    </div>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`rounded-md border px-2 py-1 text-xs font-medium ${getBadgeColor(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        aria-label="View Order"
                        onClick={() => onView?.(order)}
                        className="rounded-md border border-[#E4D8CE] bg-white p-2 hover:bg-[#F8F3EF]"
                        title="View Order"
                      >
                        <Eye size={15} className="text-[#7A5442]" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Identical Footer to ProductTable */}
      <div className="flex items-center justify-between border-t border-[#E8D8CC] px-4 py-3 text-sm text-[#8B5E49]">
        <p>
          Showing{" "}
          <b>
            {firstEntry}-{lastEntry}
          </b>{" "}
          of <b>{totalOrders}</b> entries
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous page"
            disabled={safeCurrentPage <= 1}
            onClick={() => onPageChange(safeCurrentPage - 1)}
            className="rounded border border-[#E5D7CC] p-1 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>

          <button className="rounded bg-[#7B523B] px-3 py-1 text-white">
            {safeCurrentPage}
          </button>

          <button
            type="button"
            aria-label="Next page"
            disabled={safeCurrentPage >= totalPages}
            onClick={() => onPageChange(safeCurrentPage + 1)}
            className="rounded border border-[#E5D7CC] p-1 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>

          <span className="text-xs text-[#9B7B69]">of {totalPages}</span>
        </div>
      </div>

    </div>
  );
};

export default OrdersTable;