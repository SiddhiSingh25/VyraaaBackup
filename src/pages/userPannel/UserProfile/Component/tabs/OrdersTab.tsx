// import { motion } from "motion/react";
// import type { OrderItem, OrderStatus } from "../account";

// const STATUS_STYLES: Record<OrderStatus, string> = {
//   Delivered: "bg-[#e6f2e6] text-success",
//   Shipped: "bg-[#eaf1fb] text-[#1f5fa8]",
//   Processing: "bg-[#fdf2df] text-warning",
//   Cancelled: "bg-[#fbe8e8] text-error",
//   Returned: "bg-card text-muted",
// };

// interface OrdersTabProps {
//   orders: OrderItem[];
// }

// export function OrdersTab({ orders }: OrdersTabProps) {
//   if (orders.length === 0) {
//     return (
//       <div className="text-center py-16">
//         <p className="font-heading text-lg text-admin-text">No orders yet</p>
//         <p className="text-sm text-muted mt-1">Your future favorites are waiting in the shop.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col gap-3">
//       {orders.map((order, i) => (
//         <motion.div
//           key={order.id}
//           initial={{ opacity: 0, y: 8 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.35, delay: i * 0.05 }}
//           className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-border p-3 hover:border-primary-light transition-colors"
//         >
//           <img
//             src={order.thumbnailUrl}
//             alt=""
//             className="w-16 h-16 rounded-lg object-cover shrink-0 bg-card"
//           />

//           <div className="flex-1 min-w-0">
//             <div className="flex flex-wrap items-center gap-2">
//               <p className="font-medium text-admin-text text-sm">{order.orderNumber}</p>
//               <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[order.status]}`}>
//                 {order.status}
//               </span>
//             </div>
//             <p className="text-sm text-muted mt-1 truncate">{order.items.join(", ")}</p>
//             <p className="text-xs text-muted mt-1">
//               Placed on {order.placedOn} &middot; {order.itemCount} item{order.itemCount > 1 ? "s" : ""}
//             </p>
//           </div>

//           <div className="flex items-center justify-between sm:flex-col sm:items-end gap-1 sm:gap-2">
//             <p className="font-heading text-base text-admin-text">
//               &#8377;{order.total.toLocaleString("en-IN")}
//             </p>
//             <button
//               type="button"
//               className="text-xs font-medium text-primary-dark border border-border rounded-lg px-3 py-1.5 hover:bg-card transition-colors"
//             >
//               View details
//             </button>
//           </div>
//         </motion.div>
//       ))}
//     </div>
//   );
// }
import { motion } from "motion/react";
import {
  CheckCircle2,
  Truck,
  XCircle,
  ChevronRight,
  MapPinned,
  Headphones,
} from "lucide-react";
import type { OrderItem } from "../account";

interface OrdersTabProps {
  orders: OrderItem[];
}

export function OrdersTab({ orders }: OrdersTabProps) {
  if (!orders.length) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-12 text-center">
        <h3 className="font-heading text-xl text-admin-text">
          No Orders Yet
        </h3>
        <p className="text-sm text-muted mt-2">
          Your future purchases will appear here.
        </p>
      </div>
    );
  }

  const grouped = orders.reduce((acc, order) => {
    if (!acc[order.status]) acc[order.status] = [];
    acc[order.status].push(order);
    return acc;
  }, {} as Record<string, OrderItem[]>);

  const statusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return (
          <CheckCircle2
            size={18}
            className="text-green-600"
          />
        );

      case "Shipped":
        return (
          <Truck
            size={18}
            className="text-blue-600"
          />
        );

      case "Cancelled":
        return (
          <XCircle
            size={18}
            className="text-red-500"
          />
        );

      default:
        return (
          <Truck
            size={18}
            className="text-primary"
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([status, list]) => (
        <div
          key={status}
          className="rounded-2xl bg-card border border-border p-4"
        >
          {/* Section Heading */}

          <div className="flex items-center gap-2 mb-4">
            {statusIcon(status)}

            <div>
              <h3 className="font-semibold text-admin-text">{status}</h3>

              <p className="text-xs text-muted">
                {list.length} order{list.length > 1 && "s"}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {list.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.05,
                }}
                className="rounded-xl border border-border bg-background p-3 hover:border-primary-light transition"
              >
                {/* Date */}

                <p className="text-[11px] text-muted mb-3">
                  {order.placedOn}
                </p>

                {/* Product */}

                <div className="flex gap-3">
                  <img
                    src={order.thumbnailUrl}
                    alt=""
                    className="h-20 w-20 rounded-lg object-cover border border-border"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-3">
                      <div>
                        <h4 className="font-medium text-admin-text line-clamp-2">
                          {order.items[0]}
                        </h4>

                        <p className="text-xs text-muted mt-1">
                          {order.itemCount} item
                          {order.itemCount > 1 && "s"}
                        </p>

                        <p className="text-sm font-semibold mt-2 text-admin-text">
                          ₹{order.total.toLocaleString("en-IN")}
                        </p>
                      </div>

                      <ChevronRight
                        className="text-muted shrink-0"
                        size={18}
                      />
                    </div>
                  </div>
                </div>

                {/* Buttons */}

                <div className="mt-4 flex flex-wrap gap-2">
                  {status !== "Cancelled" && (
                    <>
                      <button className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium hover:bg-card transition">
                        <MapPinned size={14} />
                        Track Order
                      </button>

                      <button className="rounded-full border border-border px-4 py-2 text-xs font-medium hover:bg-card transition">
                        Cancel Order
                      </button>
                    </>
                  )}

                  <button className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium hover:bg-card transition">
                    <Headphones size={14} />
                    Need Help
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}