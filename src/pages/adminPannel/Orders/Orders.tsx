import { useEffect, useState } from "react";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";

import OrdersTable from "./component/OrdersTable";
import OrderFilters from "./component/OrderFilters";
import type { Order } from "./component/types";
import { useNavigate } from "react-router-dom";
import PageLoader from "@/components/Loader/fullPageLoader";

const Orders = () => {
  const { getQuery, loading } = useGetQuery();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);

  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  // 1. Pagination States
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // Changed to 10 for standard display
  const [totalOrders, setTotalOrders] = useState(0);

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

  return (
    <div className="min-h-screen bg-slate-50 overflow-y-auto font-admin-text pb-10">
      {loading && <PageLoader loading={loading} text="Loading Orders..." />}
      <div className="mx-auto max-w-7xl px-3 py-3 sm:px-4">
        {/* Header Section */}
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Order Management
          </h1>
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

        {/* Table seamlessly handles pagination now */}
        <OrdersTable
          items={orders}
          page={page}
          limit={limit}
          totalOrders={totalOrders}
          onPageChange={setPage}
          onView={(order: any) => navigate(`/admin/orders/${order._id}`)}
        />
      </div>
    </div>
  );
};

export default Orders;
