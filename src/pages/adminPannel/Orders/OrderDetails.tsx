import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  CreditCard,
  Mail,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const orderStatuses = [
  "Pending",
  "Processing",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const getBadgeColor = (status: string) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-700";

    case "Cancelled":
      return "bg-red-100 text-red-700";

    case "Pending":
      return "bg-yellow-100 text-yellow-700";

    default:
      return "bg-[#F6ECE5] text-[#8B5E49]";
  }
};

const OrderDetails = () => {
  const navigate = useNavigate();
  const { getQuery } = useGetQuery();
  const { id } = useParams();
  console.log("order id ", id);
  const [order, setOrder] = useState<any>(null);
  console.log("Order", order);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const GetOrderById = async () => {
    getQuery({
      url: `${apiUrls.Orders.getOrderById}/${id}`,
      onSuccess: (res: any) => {
        console.log(res);
        setOrder(res.data);
        console.log(res.data);
        setSelectedStatus(res.data.orderStatus);
      },
      onFail: (err: any) => {
        console.log(err, "Error fetching colors");
      },
    });
  };

  useEffect(() => {
    GetOrderById();
  }, []);

  if (!order) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-medium text-[#8B5E49]">Loading Order...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 font-admin-text text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-4">
        {/* Header */}

        <div className="mb-5 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="mb-4 flex items-center gap-2 rounded-lg border border-[#E5D7CC] bg-white px-4 py-2 text-sm text-[#5E4637] hover:bg-[#FFF8F2]"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <h1 className="text-3xl font-bold">Order Details</h1>

            <p className="mt-2 text-sm text-slate-500">
              Order #{order._id.slice(-6)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Current Status */}

            <span
              className={`rounded-md px-3 py-2 text-sm font-semibold ${getBadgeColor(
                order.orderStatus,
              )}`}
            >
              {order.orderStatus}
            </span>

            {/* Status Dropdown */}

            <div className="relative w-56">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex h-10 w-full items-center justify-between rounded-lg border border-[#E3D3C4] bg-white px-3 text-sm text-[#5E4637] transition hover:border-[#8B5E49]"
              >
                <span>{selectedStatus}</span>

                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showDropdown && (
                <div className="absolute left-0 top-11 z-20 w-full overflow-hidden rounded-xl border border-[#E3D3C4] bg-[#FFF8F2] shadow-lg">
                  {orderStatuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setSelectedStatus(status);
                        setShowDropdown(false);
                        setShowConfirm(status !== order.orderStatus);
                      }}
                      className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition hover:bg-[#F6ECE5]
            ${
              selectedStatus === status
                ? "bg-[#F6ECE5] font-semibold text-[#7B523B]"
                : "text-[#5E4637]"
            }`}
                    >
                      {status}

                      {selectedStatus === status && (
                        <div className="h-2 w-2 rounded-full bg-[#7B523B]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Update Button */}

            {showConfirm && (
              <button
                onClick={() => {
                  console.log(selectedStatus);
                }}
                className="rounded-lg bg-[#7B523B] px-4 py-2 text-sm font-medium text-white hover:bg-[#684534]"
              >
                Update
              </button>
            )}
          </div>
        </div>

        {/* Summary */}

        <div className="mb-5 grid grid-cols-4 gap-4">
          <div className="rounded-2xl border border-[#E7D8CC] bg-[#FFF8F2] p-5">
            <ShoppingBag size={24} className="mb-3 text-[#8B5E49]" />

            <p className="text-sm text-slate-500">Total Items</p>

            <h2 className="mt-1 text-2xl font-bold text-[#3F322B]">
              {order.items.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-[#E7D8CC] bg-[#FFF8F2] p-5">
            <CreditCard size={24} className="mb-3 text-[#8B5E49]" />

            <p className="text-sm text-slate-500">Payment</p>

            <h2 className="mt-1 text-lg font-semibold text-[#3F322B]">
              {order.paymentMethod}
            </h2>

            <span
              className={`mt-2 inline-block rounded-md px-2 py-1 text-xs font-medium ${getBadgeColor(
                order.paymentStatus,
              )}`}
            >
              {order.paymentStatus}
            </span>
          </div>

          <div className="rounded-2xl border border-[#E7D8CC] bg-[#FFF8F2] p-5">
            <Package size={24} className="mb-3 text-[#8B5E49]" />

            <p className="text-sm text-slate-500">Grand Total</p>

            <h2 className="mt-1 text-2xl font-bold text-[#3F322B]">
              ₹{order.grandTotal}
            </h2>
          </div>

          <div className="rounded-2xl border border-[#E7D8CC] bg-[#FFF8F2] p-5">
            <Calendar size={24} className="mb-3 text-[#8B5E49]" />

            <p className="text-sm text-slate-500">Order Date</p>

            <h2 className="mt-1 font-semibold text-[#3F322B]">
              {new Date(order.createdAt).toLocaleDateString()}
            </h2>
          </div>
        </div>

        {/* Customer + Shipping */}

        <div className="mb-5 grid grid-cols-3 gap-5">
          {/* Customer */}

          <div className="overflow-hidden rounded-2xl border border-[#E7D8CC] bg-[#FFF8F2]">
            <div className="border-b border-[#D8C4B5] px-5 py-4">
              <div className="flex items-center gap-2">
                <User size={18} className="text-[#8B5E49]" />

                <h2 className="font-semibold text-[#5E4637]">
                  Customer Information
                </h2>
              </div>
            </div>

            <div className="space-y-5 p-5">
              <div className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 text-[#8B5E49]" />

                <div>
                  <p className="text-xs text-slate-500">Email</p>

                  <p className="font-medium text-[#3F322B]">
                    {order.user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 text-[#8B5E49]" />

                <div>
                  <p className="text-xs text-slate-500">Phone Number</p>

                  <p className="font-medium text-[#3F322B]">
                    {order.shippingAddress.phoneNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CreditCard size={18} className="mt-0.5 text-[#8B5E49]" />

                <div>
                  <p className="text-xs text-slate-500">Payment Method</p>

                  <p className="font-medium text-[#3F322B]">
                    {order.paymentMethod}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Shipping Address */}

          <div className="col-span-2 overflow-hidden rounded-2xl border border-[#E7D8CC] bg-[#FFF8F2]">
            <div className="border-b border-[#D8C4B5] px-5 py-4">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-[#8B5E49]" />

                <h2 className="font-semibold text-[#5E4637]">
                  Shipping Address
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-10 gap-y-6 p-5">
              <div>
                <p className="text-xs text-slate-500">Full Name</p>

                <p className="mt-1 font-medium text-[#3F322B]">
                  {order.shippingAddress.fullName}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Phone Number</p>

                <p className="mt-1 font-medium text-[#3F322B]">
                  {order.shippingAddress.phoneNumber}
                </p>
              </div>

              <div className="col-span-2">
                <p className="text-xs text-slate-500">Address</p>

                <p className="mt-1 font-medium text-[#3F322B]">
                  {order.shippingAddress.streetAddress},{" "}
                  {order.shippingAddress.town}, {order.shippingAddress.landmark}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">City</p>

                <p className="mt-1 font-medium text-[#3F322B]">
                  {order.shippingAddress.city}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">State</p>

                <p className="mt-1 font-medium text-[#3F322B]">
                  {order.shippingAddress.state}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Country</p>

                <p className="mt-1 font-medium text-[#3F322B]">
                  {order.shippingAddress.country}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Pin Code</p>

                <p className="mt-1 font-medium text-[#3F322B]">
                  {order.shippingAddress.pinCode}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ordered Products */}

        <div className="overflow-hidden rounded-2xl border border-[#E7D8CC] bg-[#FFF8F2]">
          <div className="border-b border-[#D8C4B5] px-5 py-4">
            <h2 className="font-semibold text-[#5E4637]">Ordered Products</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-[#D8C4B5] bg-[#FFF8F2] text-left text-sm font-semibold text-[#8B5E49]">
                  <th className="w-87.5 px-4 py-3">Product</th>

                  <th className="px-4 py-3">Category</th>

                  <th className="px-4 py-3">Size</th>

                  <th className="px-4 py-3">Qty</th>

                  <th className="px-4 py-3">Price</th>

                  <th className="px-4 py-3">Total</th>

                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {order.items.map((item: any) => (
                  <tr
                    key={item._id}
                    className="border-b border-[#EFE4DB] transition-colors hover:bg-[#FFFDFB]"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="h-12 w-12 rounded-lg border border-[#E4D6CB] object-cover"
                        />

                        <div>
                          <p className="font-medium text-[#3F322B]">
                            {item.product.title}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm text-[#5E4637]">
                      {item.product.category.category}
                    </td>

                    <td className="px-4 py-3">{item.size.size}</td>

                    <td className="px-4 py-3">{item.quantity}</td>

                    <td className="px-4 py-3 font-medium">
                      ₹{item.purchasingPrice}
                    </td>

                    <td className="px-4 py-3 font-semibold text-[#6F4A36]">
                      ₹{item.itemTotal}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-md px-2 py-1 text-xs font-medium ${getBadgeColor(
                          item.itemStatus,
                        )}`}
                      >
                        {item.itemStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Summary */}

        <div className="mt-5 flex justify-end">
          <div className="w-95 overflow-hidden rounded-2xl border border-[#E7D8CC] bg-[#FFF8F2]">
            <div className="border-b border-[#D8C4B5] px-5 py-4">
              <h2 className="font-semibold text-[#5E4637]">Order Summary</h2>
            </div>

            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>

                <span className="font-medium">₹{order.grandTotal}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Shipping</span>

                <span className="font-medium">₹0</span>
              </div>

              <div className="border-t border-[#D8C4B5] pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-[#3F322B]">
                    Grand Total
                  </span>

                  <span className="text-2xl font-bold text-[#6F4A36]">
                    ₹{order.grandTotal}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
