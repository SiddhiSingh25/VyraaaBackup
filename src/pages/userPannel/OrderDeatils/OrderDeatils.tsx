import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { apiUrls } from '@/apis';
import useGetQuery from '@/hooks/getQuery.hook';
import { Package, MapPin, CreditCard, Gift, CheckCircle, Truck } from 'lucide-react';
import Navbar from '@/components/Header/Navbar';
import Footer from '@/components/Footer/Footer';
import PageLoader from '@/components/Loader/fullPageLoader';

const OrderDetails = () => {
    const location = useLocation();
    const { id } = location?.state || {};
    const { getQuery, loading } = useGetQuery();


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

    // --- Helper for Status Colors using Theme Variables ---
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Delivered':
                return 'bg-success/10 text-success border-success/30';
            case 'Shipped':
                return 'bg-primary-light/20 text-primary-dark border-primary-light/50';
            case 'Pending':
                return 'bg-warning/10 text-warning border-warning/30';
            default:
                return 'bg-card text-muted border-border';
        }
    };

    // --- Loading State ---
    if (!orderDetails) {
        return (
            <PageLoader loading={loading} text="Loading Details..." />
        );
    }

    const isDelivered = orderDetails.orderStatus === 'Delivered';
    const totalGifts = orderDetails.giftCount || (orderDetails.gifts?.length || 0);

    return (
        <div className="min-h-screen bg-background flex flex-col font-body text-body">
            <Navbar />

            {/* Main Content */}
            <main className="flex-grow max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-heading font-heading tracking-wide">
                            Order : <span className="text-sm text-muted">{orderDetails.orderId}</span>
                        </h1>
                        <p className="text-sm text-muted mt-1">
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
                        <div className="bg-surface rounded-2xl p-6 border border-border">
                            <h2 className="text-lg font-bold text-heading font-heading mb-4 flex items-center gap-2">
                                <Package className="text-primary" size={20} />
                                Order Items
                            </h2>
                            <div className="space-y-6">
                                {orderDetails.items?.map((item: any) => (
                                    <div key={item._id} className="flex flex-col sm:flex-row gap-4 pb-6 border-b border-border last:border-0 last:pb-0">
                                        <img
                                            src={item.product?.image}
                                            alt={item.product?.title}
                                            className="w-24 h-24 object-cover rounded-xl border border-border bg-card"
                                        />
                                        <div className="flex-grow">
                                            <h3 className="font-semibold text-heading">{item.product?.title}</h3>
                                            <p className="text-xs text-muted mb-2 uppercase tracking-wider">{item.product?.category?.category}</p>
                                            <div className="text-sm text-body flex flex-wrap gap-3">
                                                <span className="bg-card px-2.5 py-1 rounded-md border border-border">Size: <b className="text-heading">{item.size?.size}</b></span>
                                                <span className="bg-card px-2.5 py-1 rounded-md border border-border">Qty: <b className="text-heading">{item.quantity}</b></span>

                                                {/* Rendering individual item gift count */}
                                                {item.giftCount > 0 && (
                                                    <span className="bg-rose-gold/10 text-rose-gold px-2.5 py-1 rounded-md border border-rose-gold/20 flex items-center gap-1.5">
                                                        <Gift size={14} />
                                                        <b className="text-xs">+{item.giftCount} {item.giftCount === 1 ? 'Gift' : 'Gifts'}</b>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col justify-between">
                                            <p className="font-bold text-heading">₹{item.itemTotal}</p>
                                            <p className={`text-xs font-medium px-2 py-1 rounded-md border inline-block mt-2 ${getStatusColor(item.itemStatus)}`}>
                                                {item.itemStatus}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Address and Summary */}
                    <div className="space-y-6">

                        {/* --- SHIPPING ADDRESS --- */}
                        {orderDetails.shippingAddress && (
                            <div className="bg-surface rounded-2xl p-6 border border-border">
                                <h2 className="text-base font-bold text-heading font-heading mb-4 flex items-center gap-2">
                                    <MapPin className="text-primary" size={18} />
                                    Shipping Address
                                </h2>
                                <div className="text-sm text-body space-y-1.5">
                                    <p className="font-bold text-heading text-base mb-2">{orderDetails.shippingAddress.fullName}</p>
                                    <p>{orderDetails.shippingAddress.streetAddress}</p>
                                    {orderDetails.shippingAddress.landmark && <p>Landmark: {orderDetails.shippingAddress.landmark}</p>}
                                    <p>{orderDetails.shippingAddress.town}, {orderDetails.shippingAddress.city}</p>
                                    <p>{orderDetails.shippingAddress.state} - <span className="font-semibold text-heading">{orderDetails.shippingAddress.pinCode}</span></p>
                                    <p className="pt-3 mt-3 border-t border-border flex items-center gap-2 text-heading">
                                        <span className="text-xs font-semibold px-2 py-1 bg-card rounded text-muted uppercase tracking-wider">Phone</span>
                                        {orderDetails.shippingAddress.phoneNumber}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* --- PAYMENT & SUMMARY --- */}
                        <div className="bg-surface rounded-2xl p-6 border border-border">
                            <h2 className="text-base font-bold text-heading font-heading mb-4 flex items-center gap-2">
                                <CreditCard className="text-primary" size={18} />
                                Payment Details
                            </h2>

                            <div className="flex justify-between items-center text-sm mb-3">
                                <span className="text-muted">Method</span>
                                <span className="font-semibold text-heading">{orderDetails.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm mb-6">
                                <span className="text-muted">Status</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${orderDetails.paymentStatus === 'Completed'
                                    ? 'bg-success/10 text-success border border-success/20'
                                    : 'bg-warning/10 text-warning border border-warning/20'
                                    }`}>
                                    {orderDetails.paymentStatus || "Pending"}
                                </span>
                            </div>

                            <div className="border-t border-border pt-4 space-y-3">
                                <div className="flex justify-between text-sm text-body">
                                    <span>Subtotal ({orderDetails.items?.length || 0} items)</span>
                                    <span className="font-medium">
                                        ₹{Number(orderDetails.grandTotal || 0).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm text-body">
                                    <span>Shipping</span>
                                    <span className="text-success font-medium">Free</span>
                                </div>

                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                                    <span className="text-base font-bold text-heading">Grand Total</span>
                                    <span className="text-xl font-black text-primary">
                                        ₹{Number(orderDetails.grandTotal).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default OrderDetails;