import React, { useState, useEffect } from "react";
import type { Address } from "../pages/AddNewAddress"; // Adjust path to where Address interface lives

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
  userId: "",
};

export default function AddressForm({ initialData, onSubmit, onCancel }: AddressFormProps) {
  const [formData, setFormData] = useState<Address>(INITIAL_FORM_STATE);

  // Populate form if we are editing an existing address
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(INITIAL_FORM_STATE);
    }
  }, [initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-admin-text">
          {initialData ? "Edit Address" : "Add New Address"}
        </h2>
        <p className="mt-1 text-sm text-muted">
          Save your delivery details for faster checkout.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            Full Name
          </label>
          <input
            required
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-surface border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-shadow"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            Phone Number
          </label>
          <input
            required
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-surface border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-shadow"
            placeholder="10-digit mobile number"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
              Pincode
            </label>
            <input
              required
              name="pinCode"
              value={formData.pinCode}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-surface border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-shadow"
              placeholder="e.g. 110001"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
              Town/Locality
            </label>
            <input
              required
              name="town"
              value={formData.town}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-surface border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-shadow"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            Street Address / House No.
          </label>
          <input
            required
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-surface border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-shadow"
            placeholder="House/Flat No., Building name, Street"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            Landmark (Optional)
          </label>
          <input
            name="landmark"
            value={formData.landmark || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-surface border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-shadow"
            placeholder="e.g. Near Apollo Hospital"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
              City
            </label>
            <input
              required
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-surface border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-shadow"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
              State
            </label>
            <input
              required
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-surface border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-shadow"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            Address Type
          </label>
          <select
            name="addressType"
            value={formData.addressType}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-surface border border-border/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-shadow appearance-none"
          >
            <option value="Home">Home (7 AM - 9 PM delivery)</option>
            <option value="Work">Work (10 AM - 6 PM delivery)</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <input
            type="checkbox"
            id="isDefault"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleInputChange}
            className="w-5 h-5 text-primary border-border/60 rounded focus:ring-primary"
          />
          <label htmlFor="isDefault" className="text-sm font-medium text-admin-text cursor-pointer select-none">
            Make this my default delivery address
          </label>
        </div>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-6 border-t border-border/50">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-border px-7 py-3 text-sm font-medium text-body transition-colors hover:border-primary hover:text-primary"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-medium text-white shadow-md transition-shadow hover:shadow-lg hover:shadow-primary/30"
        >
          {initialData ? "Update Address" : "Save Address"}
        </button>
      </div>
    </form>
  );
}