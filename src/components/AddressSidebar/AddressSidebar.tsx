import React, { useState, useEffect } from "react";
import { X, MapPin, Plus, Edit2, Trash2, CheckCircle2 } from "lucide-react";                 // Update path as needed
import useGetQuery from "../../hooks/getQuery.hook";
import usePostQuery from "../../hooks/postQuery.hook";
import { apiUrls } from "../../apis";
import useDeleteQuery from "../../hooks/deleteQuery.hook";

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
}

interface AddressSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    // Note: We removed the functions and addresses array from props!
}

export default function AddressSidebar({ isOpen, onClose }: AddressSidebarProps) {
    const [view, setView] = useState<"list" | "form">("list");
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);

    const { getQuery } = useGetQuery();
    const { postQuery } = usePostQuery();
    const { deleteQuery } = useDeleteQuery();

    // Fetch Addresses Function
    const fetchAddresses = () => {
        getQuery({
            url: apiUrls.Address.getByUserId,
            onSuccess: (res: any) => {
                setAddresses(res.data);
                console.log("Fetched Addresses:", res.data);
            },
            onFail: (err: any) => {
                console.log("Failed to fetch addresses:", err);
            },
        });
    };

    // Run whenever the sidebar is opened
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            fetchAddresses(); // Fetch fresh data every time modal opens
        } else {
            document.body.style.overflow = "unset";
            // Reset view with a slight delay to allow exit animation to finish smoothly
            setTimeout(() => setView("list"), 300);
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Open Form Handler
    const handleOpenForm = (address?: Address) => {
        setEditingAddress(address || null);
        setView("form");
    };

    // Add or Update Form Submit
    const handleFormSubmit = (formData: Address) => {
        // Determine if we are Updating or Adding based on the presence of _id
        const isUpdating = !!formData._id;

        // Construct the payload as JSON body (no FormData/multipart needed)
        const payload: any = { ...formData,userId : addresses[0].userId };

        let url = apiUrls.Address.add; // Ensure this endpoint exists in your apiUrls

        if (isUpdating) {
            url = apiUrls.Address.add;
            payload.addressId = formData._id;
        } else {
            // NOTE: If your backend needs the userId explicitly when adding, add it here.
            // Usually, it's grabbed from the token, but if not: 
            // payload.userId = "6a573c909f733639de2260fa"; 
        }

        postQuery({
            url: url,
            postData: payload,
            onSuccess: (res: any) => {
                console.log(isUpdating ? "Address updated!" : "Address added!", res);
                fetchAddresses(); // Refresh the list
                setView("list");  // Go back to the list view
            },
            onFail: (err: any) => {
                console.log("Failed to save address", err);
            },
        });
    };

    // Delete Address
    const handleDeleteAddress = (id: string) => {

        deleteQuery({
            url: `${apiUrls.Address.delete}/${id}`,
            onSuccess: (res: any) => {
                fetchAddresses();
            },
            onFail: (err: any) => {
                console.log("Failed to delete address", err);
            },
        })
    };

    // Set Address as Default
    const handleSetDefault = (addr: Address) => {
        const payload = {
            ...addr,
            addressId: addr._id,
            isDefault: true,
        };

        postQuery({
            url: apiUrls.Address.add,
            postData: payload,
            onSuccess: () => {
                fetchAddresses();
            },
            onFail: (err: any) => {
                console.log("Failed to set default", err);
            },
        });
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-out ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                onClick={onClose}
            />

            {/* Sidebar Panel */}
            <aside
                className={`fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-background shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
                    <h2 className="text-lg font-semibold text-admin-text flex items-center gap-2">
                        <MapPin size={20} className="text-primary-dark" />
                        {view === "list" ? "Select Delivery Address" : editingAddress ? "Edit Address" : "Add New Address"}
                    </h2>
                    <button
                        onClick={() => (view === "form" ? setView("list") : onClose())}
                        className="p-2 rounded-full hover:bg-border/50 text-admin-text/70 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    {view === "list" ? (
                        <div className="space-y-4">
                            <button
                                onClick={() => handleOpenForm()}
                                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-primary-dark/40 rounded-xl text-primary-dark font-medium hover:bg-primary-dark/5 transition-colors"
                            >
                                <Plus size={18} />
                                Add New Address
                            </button>

                            {addresses.map((addr) => (
                                <div
                                    key={addr._id}
                                    className={`relative p-4 rounded-xl border-2 transition-all ${addr.isDefault
                                        ? "border-primary-dark bg-primary-dark/5"
                                        : "border-border/50 hover:border-primary-dark/40 bg-surface"
                                        }`}
                                >
                                    {addr.isDefault && (
                                        <span className="absolute top-4 right-4 flex items-center gap-1 text-xs font-semibold text-primary-dark bg-primary-dark/10 px-2 py-1 rounded-md">
                                            <CheckCircle2 size={14} /> Default
                                        </span>
                                    )}
                                    <div className="mb-1 flex items-center gap-2">
                                        <span className="font-semibold text-admin-text">{addr.fullName}</span>
                                        <span className="text-[10px] uppercase tracking-wider bg-border/50 px-2 py-0.5 rounded-full text-admin-text/70">
                                            {addr.addressType}
                                        </span>
                                    </div>
                                    <p className="text-sm text-admin-text/80 leading-relaxed mb-3 pr-16">
                                        {addr.streetAddress}, {addr.landmark && `${addr.landmark}, `}
                                        <br />
                                        {addr.town}, {addr.city}, {addr.state} - {addr.pinCode}
                                    </p>
                                    <p className="text-sm font-medium text-admin-text mb-4">
                                        Phone: {addr.phoneNumber}
                                    </p>

                                    <div className="flex items-center gap-3 pt-3 border-t border-border/50">
                                        {!addr.isDefault && (
                                            <button
                                                onClick={() => handleSetDefault(addr)}
                                                className="text-sm font-medium text-primary-dark hover:underline"
                                            >
                                                Deliver Here
                                            </button>
                                        )}
                                        <div className="flex-1" />
                                        <button
                                            onClick={() => handleOpenForm(addr)}
                                            className="p-1.5 text-admin-text/60 hover:text-primary-dark hover:bg-primary-dark/10 rounded-md transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => addr._id && handleDeleteAddress(addr._id)}
                                            className="p-1.5 text-admin-text/60 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <AddressForm
                            initialData={editingAddress}
                            onSubmit={handleFormSubmit}
                            onCancel={() => setView("list")}
                        />
                    )}
                </div>
            </aside>
        </>
    );
}








interface AddressFormProps {
    initialData?: Address | null;
    onSubmit: (address: Address) => void;
    onCancel: () => void;
}

const INITIAL_FORM_STATE: Address = {
    addressType: "Home",
    isDefault: false,
    fullName: "",
    town: "",
    streetAddress: "",
    landmark: "",
    city: "",
    state: "",
    pinCode: "",
    country: "India",
    phoneNumber: "",
};

function AddressForm({ initialData, onSubmit, onCancel }: AddressFormProps) {
    const [formData, setFormData] = useState<Address>(INITIAL_FORM_STATE);

    // Populate form if we are editing an existing address
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData(INITIAL_FORM_STATE);
        }
    }, [initialData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-xs font-medium text-admin-text/70 mb-1">Full Name</label>
                <input
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-surface border border-border/50 rounded-lg focus:outline-none focus:border-primary-dark text-sm"
                />
            </div>
            <div>
                <label className="block text-xs font-medium text-admin-text/70 mb-1">Phone Number</label>
                <input
                    required
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-surface border border-border/50 rounded-lg focus:outline-none focus:border-primary-dark text-sm"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-admin-text/70 mb-1">Pincode</label>
                    <input
                        required
                        name="pinCode"
                        value={formData.pinCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-surface border border-border/50 rounded-lg focus:outline-none focus:border-primary-dark text-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-admin-text/70 mb-1">Town/Locality</label>
                    <input
                        required
                        name="town"
                        value={formData.town}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-surface border border-border/50 rounded-lg focus:outline-none focus:border-primary-dark text-sm"
                    />
                </div>
            </div>
            <div>
                <label className="block text-xs font-medium text-admin-text/70 mb-1">Street Address</label>
                <input
                    required
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-surface border border-border/50 rounded-lg focus:outline-none focus:border-primary-dark text-sm"
                />
            </div>
            <div>
                <label className="block text-xs font-medium text-admin-text/70 mb-1">Landmark (Optional)</label>
                <input
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-surface border border-border/50 rounded-lg focus:outline-none focus:border-primary-dark text-sm"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-admin-text/70 mb-1">City</label>
                    <input
                        required
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-surface border border-border/50 rounded-lg focus:outline-none focus:border-primary-dark text-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-admin-text/70 mb-1">State</label>
                    <input
                        required
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-surface border border-border/50 rounded-lg focus:outline-none focus:border-primary-dark text-sm"
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-admin-text/70 mb-1">Address Type</label>
                    <select
                        name="addressType"
                        value={formData.addressType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-surface border border-border/50 rounded-lg focus:outline-none focus:border-primary-dark text-sm"
                    >
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>
            <div className="pt-4 flex items-center gap-2">
                <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary-dark border-border/50 rounded focus:ring-primary-dark"
                />
                <label htmlFor="isDefault" className="text-sm text-admin-text">
                    Make this my default address
                </label>
            </div>

            <div className="pt-6 mt-6 border-t border-border/50 flex gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-border text-admin-text text-sm font-medium hover:bg-border/50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 rounded-lg bg-primary-dark text-white text-sm font-medium hover:bg-primary-dark/90 transition-colors shadow-lg shadow-primary-dark/20"
                >
                    {initialData ? "Update Address" : "Save Address"}
                </button>
            </div>
        </form>
    );
}