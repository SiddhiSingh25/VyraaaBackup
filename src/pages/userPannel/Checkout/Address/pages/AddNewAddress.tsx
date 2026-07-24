import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Plus, Edit2, Trash2, ChevronDown, Star } from "lucide-react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

import AddressForm from "../components/AddressForm";
import CheckoutSidebar from "../components/CheckoutSidebar";
import useGetQuery from "@/hooks/getQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook";
import useDeleteQuery from "@/hooks/deleteQuery.hook";
import { apiUrls } from "@/apis";

export interface Address {
  _id?: string;
  addressType: "Home" | "Work" | "Other";
  isDefault: boolean;
  fullName: string;
  town: string;
  streetAddress: string;
  landmark?: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  phoneNumber: string;
  userId: string;
}

function formatINR(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

// ==========================================
// SHIMMER SKELETON COMPONENT
// ==========================================
const AddressShimmer = () => (
  <div className="relative p-5 rounded-xl border-2 border-border/30 bg-surface animate-pulse">
    {/* Top Right Badges Shimmer */}
    <div className="absolute top-5 right-5 flex flex-col items-end gap-2">
      <div className="h-6 w-20 bg-border/40 rounded-md"></div>
    </div>

    {/* Name and Type Badge Shimmer */}
    <div className="mb-4 flex items-center gap-3">
      <div className="h-6 w-32 bg-border/40 rounded-md"></div>
      <div className="h-5 w-16 bg-border/40 rounded-full"></div>
    </div>

    {/* Address Text Shimmer */}
    <div className="space-y-2 mb-6">
      <div className="h-4 w-3/4 bg-border/30 rounded"></div>
      <div className="h-4 w-1/2 bg-border/30 rounded"></div>
    </div>

    {/* Bottom Actions Shimmer */}
    <div className="flex items-center gap-4 pt-4 border-t border-border/50 flex-wrap">
      <div className="h-5 w-24 bg-border/40 rounded"></div>
      <div className="h-5 w-24 bg-border/40 rounded"></div>
      <div className="flex-1" />
      <div className="h-8 w-8 bg-border/40 rounded-lg"></div>
      <div className="h-8 w-8 bg-border/40 rounded-lg"></div>
    </div>
  </div>
);
// ==========================================

export default function AddNewAddress() {
  const cartItems = useSelector((state: any) => state.cart.items);

  const cartTotalAmount = cartItems.reduce(
    (total: number, item: any) => total + (item.price || 0),
    0
  );

  const [view, setView] = useState<"list" | "form">("list");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [expandedAddresses, setExpandedAddresses] = useState<Record<string, boolean>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(cartTotalAmount);

  // State to store the currently SELECTED address for this checkout session
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const { getQuery, loading } = useGetQuery();
  const { postQuery, loading: addLoading } = usePostQuery();
  const { deleteQuery } = useDeleteQuery();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    from,
    productId,
    size
  } = location?.state || {};
  const { user } = useSelector((state: any) => state.auth);

  // Fetch Addresses
  const fetchAddresses = () => {
    getQuery({
      url: apiUrls.Address.getByUserId,
      onSuccess: (res: any) => {
        const fetchedAddresses = res.data || [];
        setAddresses(fetchedAddresses);

        // Auto-select the default address initially if one exists
        const defaultAddr = fetchedAddresses.find((a: Address) => a.isDefault);
        if (defaultAddr && defaultAddr._id && !selectedAddressId) {
          setSelectedAddressId(defaultAddr._id);
        }
      },
      onFail: (err: any) => {
        console.error("Failed to fetch addresses:", err);
      },
    });
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const toggleAddressExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedAddresses((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ACTION 1: ONLY updates local state for selection (No API call)
  const handleSelectAddress = (addr: Address) => {
    if (addr._id) {
      setSelectedAddressId(addr._id);
    }
  };

  // ACTION 2: ONLY calls API to set as default (Does not force selection)
  const handleSetDefault = (addr: Address, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click from firing
    if (!addr.isDefault) {
      const payload = { ...addr, addressId: addr._id, isDefault: true };
      postQuery({
        url: apiUrls.Address.add,
        postData: payload,
        onSuccess: () => {
          showSuccess("Address set as default!");
          fetchAddresses();
        },
        onFail: (err: any) => console.error("Failed to set default", err),
      });
    }
  };

  const handleDeleteAddress = (id: string) => {
    deleteQuery({
      url: `${apiUrls.Address.delete}/${id}`,
      onSuccess: () => {
        showSuccess("Address deleted!");
        fetchAddresses();
      },
      onFail: (err: any) => console.error("Failed to delete address", err),
    });
  };

  const handleFormSubmit = (formData: Address) => {
    const isUpdating = !!formData._id;
    const payload: any = { ...formData, userId: addresses[0]?.userId || user?._id };

    if (isUpdating) {
      payload.addressId = formData._id;
    }

    postQuery({
      url: apiUrls.Address.add,
      postData: payload,
      onSuccess: () => {
        showSuccess(isUpdating ? "Address updated successfully" : "Address added successfully");
        fetchAddresses();
        setView("list");
      },
      onFail: (err: any) => console.error("Failed to save address", err),
    });
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleOpenForm = (address?: Address) => {
    setEditingAddress(address || null);
    setView("form");
  };

  return (
    <div className="min-h-screen bg-background font-body">
      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mx-auto max-w-6xl px-4 pb-28 pt-8 sm:px-6 sm:pb-16"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          <div className="rounded-2xl border border-border bg-card/40 p-6 shadow-[0_2px_24px_-8px_rgba(59,48,42,0.12)] sm:p-9">
            {view === "list" ? (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h1 className="text-2xl font-bold tracking-tight text-admin-text">
                    Select Delivery Address
                  </h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleOpenForm()}
                      className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
                    >
                      <Plus size={16} /> Add New
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* --- CONDITIONAL RENDERING FOR SHIMMER vs EMPTY vs LIST --- */}
                  {loading ? (
                    <>
                      <AddressShimmer />
                      <AddressShimmer />
                    </>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-10 text-admin-text/60">
                      No addresses saved yet. Add a new one to proceed.
                    </div>
                  ) : (
                    addresses.map((addr) => {
                      const isExpanded = !!expandedAddresses[addr._id!];
                      const isSelected = selectedAddressId === addr._id;

                      return (
                        <div
                          key={addr._id}
                          onClick={() => handleSelectAddress(addr)}
                          className={`relative p-5 rounded-xl border-2 transition-all cursor-pointer select-none hover:shadow-sm ${isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border/50 hover:border-primary/40 bg-surface"
                            }`}
                        >
                          {/* Top Right Badges */}
                          <div className="absolute top-5 right-5 flex flex-col items-end gap-2">
                            {isSelected && (
                              <span className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                                <CheckCircle2 size={14} /> Selected
                              </span>
                            )}
                            {addr.isDefault && (
                              <span className="flex items-center gap-1 text-xs font-bold text-admin-text/60 bg-border/50 px-2.5 py-1 rounded-md">
                                <Star size={12} className="fill-current" /> Default
                              </span>
                            )}
                          </div>

                          <div className="mb-2 flex items-center gap-3">
                            <span className="font-semibold text-admin-text text-lg">
                              {addr.fullName}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-border/80 px-2.5 py-1 rounded-full text-admin-text/70">
                              {addr.addressType}
                            </span>
                          </div>

                          {isExpanded ? (
                            <>
                              <p className="text-sm text-admin-text/80 leading-relaxed mb-3 pr-24 transition-all duration-200">
                                {addr.streetAddress}, {addr.landmark && `${addr.landmark}, `}
                                <br />
                                {addr.town}, {addr.city}, {addr.state} - {addr.pinCode}
                              </p>
                              <p className="text-sm font-medium text-admin-text mb-4 transition-all duration-200">
                                Phone: {addr.phoneNumber}
                              </p>
                            </>
                          ) : (
                            <p className="text-sm text-admin-text/70 truncate pr-24 mb-4 transition-all duration-200">
                              {addr.streetAddress}, {addr.city} - {addr.pinCode}
                            </p>
                          )}

                          <div className="flex items-center gap-4 pt-4 border-t border-border/50 flex-wrap">
                            {/* <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectAddress(addr);
                                navigate('/checkout/payment', {
                                  state: {
                                    from,
                                    selectedAddressId: addr._id,
                                    totalPrice: totalPrice || cartTotalAmount,
                                  }
                                });
                              }}
                              className="text-sm font-bold text-primary hover:underline"
                            >
                              Deliver Here
                            </button> */}

                            {/* SEPARATE BUTTON TO SET AS DEFAULT */}
                            {!addr.isDefault && (
                              <button
                                onClick={(e) => handleSetDefault(addr, e)}
                                className="text-sm font-semibold text-admin-text/60 hover:text-primary hover:underline transition-colors"
                              >
                                Make Default
                              </button>
                            )}

                            <button
                              onClick={(e) => addr._id && toggleAddressExpand(addr._id, e)}
                              className="text-sm font-semibold text-admin-text/70 hover:text-primary hover:underline flex items-center gap-1"
                            >
                              {isExpanded ? "Show Less" : "Show More"}
                              <ChevronDown size={16} className={`transform transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                            </button>

                            <div className="flex-1" />

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenForm(addr);
                              }}
                              className="p-2 text-admin-text/60 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                              title="Edit Address"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addr._id && handleDeleteAddress(addr._id);
                              }}
                              className="p-2 text-admin-text/60 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Address"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              <AddressForm
                initialData={editingAddress}
                onSubmit={handleFormSubmit}
                onCancel={() => setView("list")}
              />
            )}
          </div>

          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="lg:sticky lg:top-8 lg:self-start">
              <CheckoutSidebar
                from={from}
                productId={productId}
                size={size}
                quantity={1}
                selectedAddressId={selectedAddressId}
                totalPrice={totalPrice || cartTotalAmount}
                onTotalChange={setTotalPrice}
              />
            </div>
          </div>
        </div>
      </motion.main>

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-4 py-3 backdrop-blur sm:hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-muted">Total</p>
            <p className="font-heading text-base text-admin-text">
              {formatINR(totalPrice || cartTotalAmount)}
            </p>
          </div>
          <button
            onClick={() => {
              if (!selectedAddressId) {
                alert("Please select an address first!");
                return;
              }
              navigate(`/checkout/payment`, {
                state: {
                  from,
                  selectedAddressId,
                  totalPrice: totalPrice || cartTotalAmount,
                }
              });
            }}
            type="button"
            className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white"
          >
            Continue to Payment
          </button>
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-20 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-dark px-5 py-3 text-sm text-white shadow-lg sm:bottom-8"
          >
            <CheckCircle2 size={16} className="text-success" />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}