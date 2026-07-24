import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook";
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
  "Accepted",
  "Processing",
  "Shipped",
  "In-Transit",
  "Delivered",
  "Cancelled",
];

const getBadgeColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Accepted":
      return "bg-sky-100 text-sky-700";
    case "Processing":
      return "bg-orange-100 text-orange-700";
    case "Shipped":
      return "bg-indigo-100 text-indigo-700";
    case "In-Transit":
      return "bg-blue-100 text-blue-700";
    case "Delivered":
      return "bg-green-100 text-green-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    case "Return Requested":
      return "bg-purple-100 text-purple-700";
    case "Refunded":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const OrderDetails = () => {
  const navigate = useNavigate();
  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();
  const { id } = useParams<{ id: string }>();

  const [order, setOrder] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');

  const GetOrderById = () => {
    getQuery({
      url: `${apiUrls.Orders.getOrderById}/${id}`,
      onSuccess: (res: any) => {
        setOrder(res.data);
        setSelectedStatus(res.data.orderStatus);
      },
      onFail: (err: any) => {
        console.log(err, "Error fetching order");
      },
    });
  };

  useEffect(() => {
    GetOrderById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenModal = (item: any) => {
    setSelectedItem(item);
    setNewStatus(item.itemStatus);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleUpdate = () => {
    postQuery({
      url: apiUrls.Orders.updateOrderStatus,
      postData:
        selectedItem === null
          ? { orderId: id, status: selectedStatus }
          : { orderId: id, status: newStatus, orderItemId: selectedItem?._id },
      onSuccess: () => {
        setSelectedItem(null);
        setNewStatus("");
        GetOrderById();
      },
      onFail: (err: any) => {
        console.log(err, "Error updating status");
      },
    });
  };

  if (!order) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-sm font-medium text-[#8B5E49]">Loading Order...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-admin-text text-slate-900 pb-10">
      <div className="mx-auto max-w-7xl px-3 py-3">
        {/* Header */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="mb-2 sm:mb-3 flex items-center gap-1.5 rounded-md border border-[#E5D7CC] bg-white px-3 py-1.5 text-xs text-[#5E4637] hover:bg-[#FFF8F2]"
            >
              <ArrowLeft size={14} />
              Back
            </button>

            <h1 className="text-xl sm:text-2xl font-bold">Order Details</h1>

            <p className="mt-1 text-xs text-slate-500">
              OrderId : {order.orderId}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Current Status */}
            <span
              className={`rounded-md px-2.5 py-1.5 text-xs font-semibold ${getBadgeColor(
                order.orderStatus,
              )}`}
            >
              {order.orderStatus}
            </span>

            {/* Status Dropdown */}
            <div className="relative w-44 sm:w-48">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex h-8 w-full items-center justify-between rounded-md border border-[#E3D3C4] bg-white px-2.5 text-xs text-[#5E4637] transition hover:border-[#8B5E49]"
              >
                <span>{selectedStatus}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${showDropdown ? "rotate-180" : ""
                    }`}
                />
              </button>

              {showDropdown && (
                <div className="absolute left-0 top-9 z-20 w-full overflow-hidden rounded-lg border border-[#E3D3C4] bg-[#FFF8F2] shadow-lg">
                  {orderStatuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setSelectedStatus(status);
                        setShowDropdown(false);
                        setShowConfirm(status !== order.orderStatus);
                      }}
                      className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs transition hover:bg-[#F6ECE5]
            ${selectedStatus === status
                          ? "bg-[#F6ECE5] font-semibold text-[#7B523B]"
                          : "text-[#5E4637]"
                        }`}
                    >
                      {status}
                      {selectedStatus === status && (
                        <div className="h-1.5 w-1.5 rounded-full bg-[#7B523B]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Update Button */}
            {showConfirm && (
              <button
                onClick={() => handleUpdate()}
                className="rounded-md bg-[#7B523B] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#684534]"
              >
                Update
              </button>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="mb-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-[#E7D8CC] bg-[#FFF8F2] p-3 sm:p-4">
            <ShoppingBag size={18} className="mb-2 text-[#8B5E49]" />
            <p className="text-xs text-slate-500">Total Items</p>
            <h2 className="mt-1 text-base sm:text-lg font-bold text-[#3F322B]">
              {order.items.length}
            </h2>
          </div>

          <div className="rounded-xl border border-[#E7D8CC] bg-[#FFF8F2] p-3 sm:p-4">
            <CreditCard size={18} className="mb-2 text-[#8B5E49]" />
            <p className="text-xs text-slate-500">Payment</p>
            <h2 className="mt-1 text-sm sm:text-base font-semibold text-[#3F322B] truncate">
              {order.paymentMethod}
            </h2>
            <span
              className={`mt-1.5 inline-block rounded text-[10px] font-medium px-1.5 py-0.5 ${getBadgeColor(
                order.paymentStatus,
              )}`}
            >
              {order.paymentStatus}
            </span>
          </div>

          <div className="rounded-xl border border-[#E7D8CC] bg-[#FFF8F2] p-3 sm:p-4">
            <Package size={18} className="mb-2 text-[#8B5E49]" />
            <p className="text-xs text-slate-500">Grand Total</p>
            <h2 className="mt-1 text-base sm:text-xl font-bold text-[#3F322B]">
              ₹{Number(order.grandTotal || 0).toFixed(2)}
            </h2>
          </div>

          <div className="rounded-xl border border-[#E7D8CC] bg-[#FFF8F2] p-3 sm:p-4">
            <Calendar size={18} className="mb-2 text-[#8B5E49]" />
            <p className="text-xs text-slate-500">Order Date</p>
            <h2 className="mt-1 text-sm sm:text-base font-semibold text-[#3F322B]">
              {new Date(order.createdAt).toLocaleDateString()}
            </h2>
          </div>
        </div>

        {/* Customer + Shipping */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Customer */}
          <div className="overflow-hidden rounded-xl border border-[#E7D8CC] bg-[#FFF8F2]">
            <div className="border-b border-[#D8C4B5] px-4 py-3">
              <div className="flex items-center gap-2">
                <User size={16} className="text-[#8B5E49]" />
                <h2 className="text-sm font-semibold text-[#5E4637]">
                  Customer Info
                </h2>
              </div>
            </div>

            <div className="space-y-4 p-4">
              <div className="flex items-start gap-2.5">
                <Mail size={16} className="mt-0.5 text-[#8B5E49]" />
                <div>
                  <p className="text-[11px] text-slate-500">Email</p>
                  <p className="text-sm font-medium text-[#3F322B] break-all">
                    {order.user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone size={16} className="mt-0.5 text-[#8B5E49]" />
                <div>
                  <p className="text-[11px] text-slate-500">Phone</p>
                  <p className="text-sm font-medium text-[#3F322B]">
                    {order.shippingAddress?.phoneNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CreditCard size={16} className="mt-0.5 text-[#8B5E49]" />
                <div>
                  <p className="text-[11px] text-slate-500">Payment Method</p>
                  <p className="text-sm font-medium text-[#3F322B]">
                    {order.paymentMethod}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="md:col-span-2 overflow-hidden rounded-xl border border-[#E7D8CC] bg-[#FFF8F2]">
            <div className="border-b border-[#D8C4B5] px-4 py-3">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#8B5E49]" />
                <h2 className="text-sm font-semibold text-[#5E4637]">
                  Shipping Address
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 p-4">
              <div>
                <p className="text-[11px] text-slate-500">Full Name</p>
                <p className="text-sm font-medium text-[#3F322B]">
                  {order.shippingAddress?.fullName}
                </p>
              </div>

              <div>
                <p className="text-[11px] text-slate-500">Phone Number</p>
                <p className="text-sm font-medium text-[#3F322B]">
                  {order.shippingAddress?.phoneNumber}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-[11px] text-slate-500">Address</p>
                <p className="text-sm font-medium text-[#3F322B]">
                  {order.shippingAddress?.streetAddress},{" "}
                  {order.shippingAddress?.town},{" "}
                  {order.shippingAddress?.landmark}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:col-span-2">
                <div>
                  <p className="text-[11px] text-slate-500">City</p>
                  <p className="text-sm font-medium text-[#3F322B]">
                    {order.shippingAddress?.city}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500">State</p>
                  <p className="text-sm font-medium text-[#3F322B]">
                    {order.shippingAddress?.state}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500">Country</p>
                  <p className="text-sm font-medium text-[#3F322B]">
                    {order.shippingAddress?.country}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500">Pin Code</p>
                  <p className="text-sm font-medium text-[#3F322B]">
                    {order.shippingAddress?.pinCode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ordered Products */}
        <div className="mb-4 overflow-hidden rounded-xl border border-[#E7D8CC] bg-[#FFF8F2]">
          <div className="border-b border-[#D8C4B5] px-4 py-3">
            <h2 className="text-sm font-semibold text-[#5E4637]">Ordered Products</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="border-b border-[#D8C4B5] bg-[#FFF8F2] text-left font-semibold text-[#8B5E49]">
                  <th className="px-3 py-2.5">Product</th>
                  <th className="px-3 py-2.5">Category</th>
                  <th className="px-3 py-2.5">Size</th>
                  <th className="px-3 py-2.5">Qty</th>
                  <th className="px-3 py-2.5">Price</th>
                  <th className="px-3 py-2.5">Total</th>
                  <th className="px-3 py-2.5">Status</th>
                </tr>
              </thead>

              <tbody>
                {order.items.map((item: any) => (
                  <tr
                    key={item._id}
                    className="border-b border-[#EFE4DB] transition-colors hover:bg-[#FFFDFB]"
                  >
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="h-10 w-10 rounded border border-[#E4D6CB] object-cover"
                        />
                        <div className="max-w-[150px] sm:max-w-xs">
                          <p className="font-medium text-[#3F322B] truncate">
                            {item.product.title}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-2 text-[#5E4637]">
                      {item.product.category.category}
                    </td>

                    <td className="px-3 py-2">{item.size.size}</td>

                    <td className="px-3 py-2">{item.quantity}</td>

                    <td className="px-3 py-2 font-medium whitespace-nowrap">
                      ₹{Number(item.purchasingPrice || 0).toFixed(2)}
                    </td>

                    <td className="px-3 py-2 font-semibold text-[#6F4A36] whitespace-nowrap">
                      ₹{Number(item.itemTotal || 0).toFixed(2)}
                    </td>

                    <td className="px-3 py-2">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className={`rounded px-2 py-1 text-[10px] font-medium cursor-pointer transition-transform hover:scale-105 whitespace-nowrap ${getBadgeColor(
                          item.itemStatus
                        )}`}
                        title="Click to update status"
                      >
                        {item.itemStatus} ✏️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl border border-[#D8C4B5]">
              <h3 className="text-base font-bold text-[#3F322B] mb-2">Update Item Status</h3>
              <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                Product: <span className="font-medium text-[#8B5E49]">{selectedItem?.product?.title}</span>
              </p>

              <div className="mb-5">
                <label className="block text-[10px] font-semibold text-[#5E4637] uppercase tracking-wider mb-1.5">
                  Select New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full rounded-md border border-[#D8C4B5] bg-[#FFF8F2] px-3 py-2 text-xs text-[#3F322B] focus:outline-none focus:ring-1 focus:ring-[#8B5E49]"
                >
                  {orderStatuses?.map((status: string) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="rounded-md px-3 py-1.5 text-xs font-semibold text-white bg-[#8B5E49] hover:bg-[#6F4A36] transition-colors"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Gifts section */}
        {order.gifts && order.gifts.length > 0 && (
          <div className="mb-4 p-4 rounded-xl border border-[#E7D8CC] bg-[#FFF8F2]">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-semibold text-[#8B5E49]">Free Gifts Included</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {order.gifts.map((gift: any) => (
                <div key={gift._id} className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-green-50 shadow-sm">
                  <img
                    src={gift.product?.image}
                    alt={gift.product?.title}
                    className="w-10 h-10 object-cover rounded border border-gray-100"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-[#3F322B] text-xs line-clamp-1">{gift.product?.title}</h4>
                    <p className="text-[10px] text-gray-500">
                      Size: {gift.size?.size} | Qty: {gift.quantity}
                    </p>
                    <p className="text-xs font-bold mt-0.5">
                      ₹0 <span className="line-through text-gray-400 text-[10px] font-normal">₹{gift.product?.price?.[0]?.markupPrice || ''}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="flex justify-end">
          <div className="w-full sm:w-80 overflow-hidden rounded-xl border border-[#E7D8CC] bg-[#FFF8F2]">
            <div className="border-b border-[#D8C4B5] px-4 py-3">
              <h2 className="text-sm font-semibold text-[#5E4637]">Order Summary</h2>
            </div>

            <div className="space-y-3 p-4 text-xs">
              {/* <div className="flex items-center justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium text-[#3F322B]">
                  ₹{Number(order.grandTotal || 0).toFixed(2)}
                </span>
              </div> */}
{/* 
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Shipping</span>
                <span className="font-medium text-[#3F322B]">₹0</span>
              </div> */}

              <div className=" border-[#D8C4B5] pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#3F322B]">
                    Grand Total
                  </span>
                  <span className="text-lg font-bold text-[#6F4A36]">
                    ₹{Number(order.grandTotal || 0).toFixed(2)}
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