import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Truck,
  XCircle,
  ChevronRight,
  MapPinned,
  Headphones,
  Star,
  X,
  Package,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import useGetQuery from "@/hooks/getQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook"; // <-- Added
import { apiUrls } from "@/apis";

export function OrdersTab() {
  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery(); // <-- Added
  const [orders, setOrders] = useState<any[]>([]);

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewImages, setReviewImages] = useState<File[]>([]);
  const [rating, setRating] = useState<number>(5); // <-- Added Rating State
  const [isSubmitting, setIsSubmitting] = useState(false); // <-- Added loading state

  useEffect(() => {
    getQuery({
      url: apiUrls.Orders.getByUserId,
      onSuccess: (res: any) => {
        const formattedOrders = res.data.flatMap((order: any) =>
          order.items.map((item: any) => ({
            id: item._id, // This is the orderItemId
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
      const newFiles = Array.from(e.target.files);
      setReviewImages((prev) => {
        const combined = [...prev, ...newFiles];
        // Enforce maximum 2 images limit
        if (combined.length > 2) {
          alert("You can only upload a maximum of 2 images.");
          return combined.slice(0, 2);
        }
        return combined;
      });
    }
  };

  const uploadImages = async (files: File[]) => {
    const imageUrls: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      // Using a Promise to wrap the postQuery for async/await behavior
      const uploadResponse = await new Promise((resolve, reject) => {
        postQuery({
          url: apiUrls.Image.upload, // Make sure this matches your APIs config
          postData: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onSuccess: (res: any) => resolve(res),
          onFail: (err: any) => reject(err),
        });
      });

      if (!(uploadResponse as any)?.data) {
        throw new Error("Image upload failed");
      }

      imageUrls.push((uploadResponse as any).data);
    }
    return imageUrls;
  };

  const handleSubmitReview = async () => {
    if (!selectedOrder) return;
    setIsSubmitting(true);

    try {
      // 1. Upload Images (if any)
      let uploadedImageUrls: string[] = [];
      if (reviewImages.length > 0) {
        uploadedImageUrls = await uploadImages(reviewImages);
      }

      // 2. Prepare Payload matching your controller expectations
      const payload = {
        orderItemId: selectedOrder.id,
        productId: selectedOrder.productId,
        rating: Number(rating),
        message: reviewText,
        images: uploadedImageUrls,
      };

      // 3. Submit Review and wait for callback
      await new Promise((resolve, reject) => {
        postQuery({
          url: apiUrls.Review.add,
          postData: payload,
          onSuccess: (res: any) => {
            // Update local orders state to mark this item as reviewed
            setOrders((prev) =>
              prev.map((o) =>
                o.id === selectedOrder.id ? { ...o, review: res?.data || true } : o,
              ),
            );

            // Reset Modal States
            setIsReviewModalOpen(false);
            setReviewText("");
            setReviewImages([]);
            setRating(5);
            setSelectedOrder(null);
            resolve(res);
          },
          onFail: (err: any) => {
            console.error("Failed to submit review:", err);
            alert(err?.response?.data?.message || "Failed to submit review.");
            reject(err);
          },
        });
      });
    } catch (error: any) {
      console.error("Error during submission:", error);
      alert("An error occurred while uploading images or submitting the review.");
    } finally {
      setIsSubmitting(false);
    }
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
                {list?.length} item{list?.length > 1 && "s"}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {list?.map((order: any, index: any) => (
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
                      disabled={!!order.review} // Disable if review exists
                      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition ${order.review
                        ? "border-muted text-muted bg-surface cursor-not-allowed"
                        : "border-primary text-primary hover:bg-primary/5"
                        }`}
                    >
                      <Star size={14} />
                      {order.review ? "Review Submitted" : "Write a Review"}
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

              {/* Added Rating Stars UI */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-admin-text mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`${star <= rating ? "text-yellow-400" : "text-gray-300"
                        } hover:scale-110 transition-transform`}
                    >
                      <Star size={24} fill={star <= rating ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-admin-text mb-2">
                  Review Details
                </label>
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
                  Add Photos (Max 2)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  disabled={reviewImages.length >= 2}
                  className="block w-full text-sm text-muted file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer cursor-pointer disabled:opacity-50"
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
                          onClick={() =>
                            setReviewImages(
                              reviewImages.filter((_, idx) => idx !== i)
                            )
                          }
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
                disabled={isSubmitting || !reviewText.trim()}
                className="w-full rounded-full bg-primary py-3 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}