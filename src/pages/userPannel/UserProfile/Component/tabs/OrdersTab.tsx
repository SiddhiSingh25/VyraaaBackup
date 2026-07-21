import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  Truck,
  XCircle,
  ChevronRight,
  MapPinned,
  Headphones,
  Star,
  X,
  Package
} from "lucide-react";
import { useEffect, useState } from "react";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";

export function OrdersTab() {
  const { getQuery } = useGetQuery();
  const [orders, setOrders] = useState<any[]>([]);

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewImages, setReviewImages] = useState<File[]>([]);

  useEffect(() => {
    getQuery({
      url: apiUrls.Orders.getByUserId,
      onSuccess: (res: any) => {
        // Flatten orders because status and product info live inside the items array
        const formattedOrders = res.data.flatMap((order: any) =>
          order.items.map((item: any) => ({
            id: item._id,
            orderId: order._id,
            placedOn: new Date(order.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            title: item.product?.title || "Product",
            thumbnailUrl: item.product?.image || "",
            status: item.itemStatus || "Pending",
            itemCount: item.quantity,
            total: item.itemTotal,
            productId: item.product?._id,
            review: item.review,
          }))
        );
        setOrders(formattedOrders);
      },
      onFail: (err: any) => {
        console.log("Failed to fetch orders:", err);
      },
    });
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setReviewImages((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleSubmitReview = () => {
    console.log("Submitting review for item:", selectedOrder?.id);
    console.log("Message:", reviewText);
    console.log("Images:", reviewImages);
    // Add API call here (e.g., postQuery to submit the review)

    setIsReviewModalOpen(false);
    setReviewText("");
    setReviewImages([]);
    setSelectedOrder(null);
  };

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

  // Group items by their individual itemStatus
  const grouped = orders.reduce((acc, order) => {
    if (!acc[order.status]) acc[order.status] = [];
    acc[order.status].push(order);
    return acc;
  }, {} as Record<string, any[]>);

  const statusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle2 size={18} className="text-green-600" />;
      case "Shipped":
      case "In-Transit":
        return <Truck size={18} className="text-blue-600" />;
      case "Cancelled":
      case "Return Requested":
      case "Refunded":
        return <XCircle size={18} className="text-red-500" />;
      default:
        return <Package size={18} className="text-primary" />;
    }
  };

  return (
    <div className="space-y-6 relative">
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
                {list.length} item{list.length > 1 && "s"}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {list.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-xl border border-border bg-background p-3 hover:border-primary-light transition"
              >
                {/* Date */}
                <p className="text-[11px] text-muted mb-3">
                  Placed on: {order.placedOn}
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
                          {order.title}
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
                        className="text-muted shrink-0 cursor-pointer hover:text-admin-text"
                        size={18}
                      />
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {status === "Delivered" ? (
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsReviewModalOpen(true);
                      }}
                      className="flex items-center gap-2 rounded-full border border-primary px-4 py-2 text-xs font-medium text-primary hover:bg-primary/5 transition"
                    >
                      <Star size={14} />
                      Write a Review
                    </button>
                  ) : (
                    status !== "Cancelled" &&
                    status !== "Refunded" && (
                      <>
                        <button className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium hover:bg-surface transition text-admin-text">
                          <MapPinned size={14} />
                          Track Order
                        </button>

                        <button className="rounded-full border border-border px-4 py-2 text-xs font-medium hover:bg-surface transition text-admin-text">
                          Cancel Item
                        </button>
                      </>
                    )
                  )}

                  <button className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium hover:bg-surface transition text-admin-text">
                    <Headphones size={14} />
                    Need Help
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      {/* Review Modal */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-admin-text">
                  Write a Review
                </h3>
                <button
                  onClick={() => setIsReviewModalOpen(false)}
                  className="text-muted hover:text-admin-text transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex gap-3 mb-6 bg-background rounded-lg p-3 border border-border">
                <img
                  src={selectedOrder?.thumbnailUrl}
                  alt=""
                  className="h-16 w-16 rounded-md object-cover border border-border"
                />
                <div>
                  <p className="font-medium text-admin-text line-clamp-2 text-sm">
                    {selectedOrder?.title}
                  </p>
                  <p className="text-xs text-muted mt-1">
                    Delivered &bull; {selectedOrder?.placedOn}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <textarea
                  className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary text-admin-text resize-none"
                  rows={4}
                  placeholder="What did you like or dislike about this product?"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-admin-text mb-2">
                  Add Photos
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="block w-full text-sm text-muted file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer cursor-pointer"
                />

                {reviewImages.length > 0 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2 custom-scrollbar">
                    {reviewImages.map((file, i) => (
                      <div key={i} className="relative shrink-0">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          className="h-16 w-16 rounded-lg object-cover border border-border"
                        />
                        <button
                          onClick={() => setReviewImages(reviewImages.filter((_, idx) => idx !== i))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-sm hover:bg-red-600"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleSubmitReview}
                className="w-full rounded-full bg-primary py-3 text-sm font-medium text-white hover:opacity-90 transition-opacity"
              >
                Submit Review
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}