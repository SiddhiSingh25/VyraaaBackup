import { useEffect, useState } from "react";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";

import OrdersTable from "./component/OrdersTable";
import OrderFilters from "./component/OrderFilters";
import type { Order } from "./component/types";

const Orders = () => {
  const { getQuery } = useGetQuery();

  const [orders, setOrders] = useState<Order[]>([]);

  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const [page] = useState(1);
  const [limit] = useState(10);

  const fetchOrders = () => {
    const params = new URLSearchParams();

    if (status) params.append("status", status);

    if (paymentStatus) params.append("paymentStatus", paymentStatus);

    if (paymentMethod) params.append("paymentMethod", paymentMethod);

    params.append("page", page.toString());
    params.append("limit", limit.toString());

    getQuery({
      url: `${apiUrls.Orders.getAllOrders}?${params.toString()}`,

      onSuccess: (res: any) => {
        console.log("Orders", res.data);
        setOrders(res.data);
      },

      onFail: (err: any) => {
        console.log(err);
      },
    });
  };

  useEffect(() => {
    fetchOrders();
  }, [status, paymentStatus, paymentMethod, page]);

  return (
    <div className="h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <h1 className="text-3xl font-bold">Order Management</h1>

        <p className="mb-5 mt-2 text-sm text-slate-500">
          Manage all customer orders
        </p>

        <OrderFilters
          status={status}
          paymentStatus={paymentStatus}
          paymentMethod={paymentMethod}
          setStatus={setStatus}
          setPaymentStatus={setPaymentStatus}
          setPaymentMethod={setPaymentMethod}
        />

        <OrdersTable items={orders} onView={(order) => console.log(order)} />
      </div>
    </div>
  );
};

export default Orders;
