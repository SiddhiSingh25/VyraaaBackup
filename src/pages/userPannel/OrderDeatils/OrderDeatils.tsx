import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { apiUrls } from '@/apis';
import useGetQuery from '@/hooks/getQuery.hook';
import { Package, MapPin, CreditCard, Gift, CheckCircle, Truck } from 'lucide-react';
import Navbar from '@/components/Header/Navbar';
import Footer from '@/components/Footer/Footer';

const OrderDetails = () => {
    const location = useLocation();
    const { id } = location?.state || {};
    const { getQuery } = useGetQuery();

    // Changed to null because the API returns a single order object, not an array.
    const [orderDetails, setOrderDetails] = useState<any>(null);

    const getDetails = () => {
        getQuery({
            url: `${apiUrls.Orders.getOrderById}/${id}`,
            onSuccess: (res: any) => {
                setOrderDetails(res?.data);
            },
            onFail: (err: any) => {
                console.error("Failed to fetch order details:", err);
            },
        });
    }

    useEffect(() => {
        if (id) {
            getDetails();
        }
    }, [id]);

    // --- Helper for Status Colors ---
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Delivered':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'Shipped':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    // --- Loading State ---
    if (!orderDetails) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-pulse text-indigo-600 font-semibold flex items-center gap-2">
                    <Package className="animate-spin" /> Loading Order Details...
                </div>
            </div>
        );
    }

    const isDelivered = orderDetails.orderStatus === 'Delivered';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* ======================= */}
            {/* Navbar Placeholder      */}
            {/* ======================= */}

            {/* <Navbar /> */}
            <Navbar />

            {/* Main Content */}
            <main className="flex-grow max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Order #{orderDetails.orderId}</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Placed on {new Date(orderDetails.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                        </p>
                    </div>
                    <div className={`px-4 py-2 rounded-full border text-sm font-semibold flex items-center gap-2 w-max ${getStatusColor(orderDetails.orderStatus)}`}>
                        {isDelivered ? <CheckCircle size={18} /> : <Truck size={18} />}
                        {orderDetails.orderStatus}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Items and Gifts */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* --- ORDER ITEMS --- */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Package className="text-indigo-500" size={20} />
                                Order Items
                            </h2>
                            <div className="space-y-6">
                                {orderDetails.items?.map((item: any) => (
                                    <div key={item._id} className="flex flex-col sm:flex-row gap-4 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                                        <img
                                            src={item.product?.image}
                                            alt={item.product?.title}
                                            className="w-24 h-24 object-cover rounded-xl border border-gray-200"
                                        />
                                        <div className="flex-grow">
                                            <h3 className="font-semibold text-gray-800">{item.product?.title}</h3>
                                            <p className="text-xs text-gray-500 mb-2">{item.product?.category?.category}</p>
                                            <div className="text-sm text-gray-600 flex flex-wrap gap-4">
                                                <span className="bg-gray-100 px-2 py-1 rounded-md">Size: <b>{item.size?.size}</b></span>
                                                <span className="bg-gray-100 px-2 py-1 rounded-md">Qty: <b>{item.quantity}</b></span>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col justify-between">
                                            <p className="font-bold text-gray-900">₹{item.itemTotal}</p>
                                            <p className={`text-xs font-medium px-2 py-1 rounded-md border inline-block mt-2 ${getStatusColor(item.itemStatus)}`}>
                                                {item.itemStatus}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* --- GIFT SECTION --- */}
                        {orderDetails.gifts && orderDetails.gifts.length > 0 && (
                            <>
                                {!isDelivered ? (
                                    /* EXCITING ANIMATED TEASER (Not Delivered) */
                                    <div className="relative overflow-hidden rounded-2xl p-8 shadow-lg bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 text-white border border-pink-400 transform hover:scale-[1.01] transition-transform duration-300">
                                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10 blur-2xl"></div>
                                        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-white opacity-10 blur-2xl"></div>

                                        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 text-center sm:text-left">
                                            <div className="bg-white/20 p-4 rounded-full animate-pulse">
                                                <Gift size={40} className="text-white drop-shadow-md" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-extrabold tracking-tight mb-2 drop-shadow-sm">
                                                    Surprise Gifts are Waiting! 🎉
                                                </h2>
                                                <p className="text-pink-100 text-sm font-medium">
                                                    We've packed some special exclusive gifts with your order.
                                                    The details will be revealed once your order is successfully delivered.
                                                    Hold tight, it's going to be amazing!
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* ACTUAL GIFT DETAILS (Delivered) */
                                    <div className="bg-gradient-to-b from-pink-50 to-white rounded-2xl p-6 shadow-sm border border-pink-100">
                                        <h2 className="text-lg font-bold text-pink-600 mb-4 flex items-center gap-2">
                                            <Gift size={20} />
                                            Your Complimentary Gifts
                                        </h2>
                                        <div className="space-y-4">
                                            {orderDetails.gifts.map((gift: any) => (
                                                <div key={gift._id} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-pink-100 relative overflow-hidden">
                                                    <div className="absolute -right-6 top-3 bg-pink-500 text-white text-[10px] font-bold px-8 py-1 rotate-45 shadow-sm">
                                                        FREE
                                                    </div>
                                                    <img
                                                        src={gift.product?.image}
                                                        alt={gift.product?.title}
                                                        className="w-20 h-20 object-cover rounded-lg border border-pink-50"
                                                    />
                                                    <div className="flex flex-col justify-center">
                                                        <h3 className="font-bold text-gray-800 text-sm">{gift.product?.title}</h3>
                                                        <p className="text-xs text-gray-500 mt-1">Size: {gift.size?.size} | Qty: {gift.quantity}</p>
                                                        <p className="text-sm font-bold text-pink-500 mt-2 line-through opacity-70">
                                                            ₹{gift.product?.price?.[0]?.amount || 0}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Right Column: Address and Summary */}
                    <div className="space-y-6">

                        {/* --- SHIPPING ADDRESS --- */}
                        {orderDetails.shippingAddress && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <MapPin className="text-indigo-500" size={18} />
                                    Shipping Address
                                </h2>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p className="font-bold text-gray-800 text-base mb-2">{orderDetails.shippingAddress.fullName}</p>
                                    <p>{orderDetails.shippingAddress.streetAddress}</p>
                                    {orderDetails.shippingAddress.landmark && <p>Landmark: {orderDetails.shippingAddress.landmark}</p>}
                                    <p>{orderDetails.shippingAddress.town}, {orderDetails.shippingAddress.city}</p>
                                    <p>{orderDetails.shippingAddress.state} - <span className="font-semibold text-gray-800">{orderDetails.shippingAddress.pinCode}</span></p>
                                    <p className="pt-2 flex items-center gap-2 text-gray-800">
                                        <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded">Phone</span>
                                        {orderDetails.shippingAddress.phoneNumber}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* --- PAYMENT & SUMMARY --- */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <CreditCard className="text-indigo-500" size={18} />
                                Payment Details
                            </h2>

                            <div className="flex justify-between items-center text-sm mb-3">
                                <span className="text-gray-500">Method</span>
                                <span className="font-semibold text-gray-800">{orderDetails.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm mb-6">
                                <span className="text-gray-500">Status</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${orderDetails.paymentStatus === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {orderDetails.paymentStatus || "Pending"}
                                </span>
                            </div>

                            <div className="border-t border-gray-100 pt-4 space-y-2">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal ({orderDetails.items?.length || 0} items)</span>
                                    <span>₹{orderDetails.grandTotal}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>

                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                    <span className="text-base font-bold text-gray-900">Grand Total</span>
                                    <span className="text-xl font-black text-indigo-600">₹{orderDetails.grandTotal}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* ======================= */}
            {/* Footer Placeholder      */}
            {/* ======================= */}

            {/* <Footer /> */}
            <Footer />

        </div>
    );
};

export default OrderDetails;