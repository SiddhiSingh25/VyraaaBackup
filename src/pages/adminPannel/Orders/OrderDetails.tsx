import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Mail,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const dummyOrder = {
  _id: "6a5b4c759ebfa4e28e231d61",

  user: {
    _id: "6a573c909f733639de2260fa",
    email: "ankitwork440@gmail.com",
  },

  items: [
    {
      _id: "6a5b4c759ebfa4e28e231d62",

      product: {
        _id: "6a58d71161a7ee9ef7807c08",
        title: "Women Multicolor Shoulder Bag",

        image:
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300",

        category: "Women Bags",
      },

      size: "Medium",

      quantity: 2,

      purchasingPrice: 500,

      itemTotal: 1000,

      itemStatus: "Processing",
    },
  ],

  grandTotal: 1000,

  paymentMethod: "UPI",

  paymentStatus: "Pending",

  orderStatus: "Processing",

  createdAt: "2026-07-18T09:50:45.679Z",

  shippingAddress: {
    fullName: "Ankit Chaurasia",

    streetAddress: "Flat 402, Sunshine Apartments",

    town: "Sector 62",

    landmark: "Near Fortis Hospital",

    city: "Ballia",

    state: "Uttar Pradesh",

    pinCode: "201309",

    country: "India",

    phoneNumber: "9876543210",
  },
};

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

  const order = dummyOrder;

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

          <span
            className={`rounded-md px-4 py-2 text-sm font-semibold ${getBadgeColor(
              order.orderStatus,
            )}`}
          >
            {order.orderStatus}
          </span>
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
                {order.items.map((item) => (
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
                      {item.product.category}
                    </td>

                    <td className="px-4 py-3">{item.size}</td>

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
