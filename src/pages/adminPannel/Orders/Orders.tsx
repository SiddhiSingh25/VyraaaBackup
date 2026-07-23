import { useEffect, useState } from "react";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";

import OrdersTable from "./component/OrdersTable";
import OrderFilters from "./component/OrderFilters";
import type { Order } from "./component/types";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const { getQuery } = useGetQuery();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);

  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  // 1. Pagination States
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0); // Store total count

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Reset to page 1 whenever filters or search term changes
  useEffect(() => {
    setPage(1);
  }, [status, paymentStatus, paymentMethod, debouncedSearch]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  const fetchOrders = () => {
    const params = new URLSearchParams();

    if (status) params.append("status", status);
    if (paymentStatus) params.append("paymentStatus", paymentStatus);
    if (paymentMethod) params.append("paymentMethod", paymentMethod);
    if (debouncedSearch) params.append("search", debouncedSearch);

    params.append("page", page.toString());
    params.append("limit", limit.toString());

    getQuery({
      url: `${apiUrls.Orders.getAllOrders}?${params.toString()}`,
      onSuccess: (res: any) => {
        setOrders(res.data);
        // 2. Set the total orders from the API response
        setTotalOrders(res.totalOrders || 0);
      },
      onFail: (err: any) => {
        console.log(err);
      },
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, paymentStatus, paymentMethod, page, debouncedSearch]);

  // 3. Calculate Total Pages
  const totalPages = Math.ceil(totalOrders / limit);

  return (
    <div className="min-h-screen bg-slate-50 overflow-y-auto font-admin-text pb-10">
      <div className="mx-auto max-w-7xl px-3 py-3 sm:px-4">
        {/* Header Section */}
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Order Management</h1>
          <p className="mt-1 text-xs text-slate-500">
            Manage all customer orders efficiently.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-4 flex flex-col sm:flex-row gap-3 items-center">
          <div className="w-full sm:w-48 lg:w-56 shrink-0">
            <OrderFilters
              status={status}
              paymentStatus={paymentStatus}
              paymentMethod={paymentMethod}
              setStatus={setStatus}
              setPaymentStatus={setPaymentStatus}
              setPaymentMethod={setPaymentMethod}
            />
          </div>

          <div className="w-full sm:flex-1 pt-5">
            
            <input
              className="w-full rounded-md border border-[#E7D8CC] bg-white px-3 py-2.5 text-xs sm:text-sm text-[#3F322B] transition-colors focus:border-[#8B5E49] focus:outline-none focus:ring-1 focus:ring-[#8B5E49]"
              placeholder="Search orders by Order ID..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Passed Page & Limit to calculate exact Sr No. */}
        <OrdersTable
          items={orders}
          page={page}
          limit={limit}
          onView={(order) => navigate(`/admin/orders/${order._id}`)}
        />

        {/* 4. Pagination UI Component */}
        {totalPages > 1 && (
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border border-[#E7D8CC] bg-white px-4 py-2.5 rounded-xl shadow-sm">
            <div className="w-full sm:w-auto text-center sm:text-left">
              <p className="text-[11px] sm:text-xs text-slate-500">
                Showing <span className="font-medium text-slate-700">{((page - 1) * limit) + 1}</span> to{" "}
                <span className="font-medium text-slate-700">{Math.min(page * limit, totalOrders)}</span> of{" "}
                <span className="font-medium text-slate-700">{totalOrders}</span> results
              </p>
            </div>

            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="relative inline-flex items-center rounded-l-md px-2.5 py-1.5 text-xs text-slate-400 ring-1 ring-inset ring-[#E7D8CC] hover:bg-[#FFF8F2] hover:text-[#8B5E49] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`relative inline-flex items-center px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ring-[#E7D8CC] transition-colors ${page === num
                      ? "bg-[#8B5E49] text-white z-10"
                      : "text-slate-700 hover:bg-[#FFF8F2]"
                    }`}
                >
                  {num}
                </button>
              ))}

              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="relative inline-flex items-center rounded-r-md px-2.5 py-1.5 text-xs text-slate-400 ring-1 ring-inset ring-[#E7D8CC] hover:bg-[#FFF8F2] hover:text-[#8B5E49] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;