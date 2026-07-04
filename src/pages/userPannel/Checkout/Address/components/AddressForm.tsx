import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { AddressInput } from "./AddressInput";
import { AddressTypeSelector } from "./AddressTypeSelector";
import { DefaultCheckbox } from "./DefaultCheckbox";
import { DeliveryInfoCard } from "./DeliveryInfoCard";
import { PageHeader } from "./PageHeader";
import { emptyAddress, lookupPinCode } from "../data/dummyData";
import type { AddressFormData, AddressType, FieldErrors } from "../types/address";
import {Link} from 'react-router-dom';

interface AddressFormProps {
  onSave: (address: AddressFormData) => void;
  onCancel: () => void;
}

const REQUIRED_FIELDS: (keyof AddressFormData)[] = [
  "fullName",
  "mobileNumber",
  "pinCode",
  "houseNumber",
  "streetAddress",
  "area",
  "city",
  "state",
  "country",
];

function validate(data: AddressFormData): FieldErrors {
  const errors: FieldErrors = {};

  for (const field of REQUIRED_FIELDS) {
    if (!String(data[field]).trim()) {
      errors[field] = "This field is required";
    }
  }

  if (data.mobileNumber && !/^\d{10}$/.test(data.mobileNumber)) {
    errors.mobileNumber = "Enter a valid 10-digit mobile number";
  }

  if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.email = "Enter a valid email address";
  }

  if (data.pinCode && !/^\d{6}$/.test(data.pinCode)) {
    errors.pinCode = "PIN code must be 6 digits";
  }

  return errors;
}

export function AddressForm({ onSave, onCancel }: AddressFormProps) {
  const [formData, setFormData] = useState<AddressFormData>(emptyAddress);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pinResolved, setPinResolved] = useState(false);
  const [isLookingUpPin, setIsLookingUpPin] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const setField = <K extends keyof AddressFormData>(field: K, value: AddressFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePinChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
    setField("pinCode", digitsOnly);
    setPinResolved(false);

    if (digitsOnly.length === 6) {
      setIsLookingUpPin(true);
      // Simulated network latency for the auto-fill lookup
      window.setTimeout(() => {
        const result = lookupPinCode(digitsOnly);
        if (result) {
          setFormData((prev) => ({ ...prev, city: result.city, state: result.state }));
          setPinResolved(true);
        }
        setIsLookingUpPin(false);
      }, 600);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSaving(true);
    // Simulated save — no backend, state only
    window.setTimeout(() => {
      setIsSaving(false);
      onSave(formData);
    }, 900);
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-border bg-card/40 p-6 shadow-[0_2px_24px_-8px_rgba(59,48,42,0.12)] sm:p-9"
    >
      <PageHeader
        title="Add New Address"
        subtitle="Save your delivery details for faster checkout."
      />

      {/* Contact Details */}
      <section>
        <h2 className="mb-4 text-xs font-semibold tracking-[0.1em] text-muted uppercase">
          Contact Details
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <AddressInput
            label="Full Name"
            required
            value={formData.fullName}
            onChange={(v) => setField("fullName", v)}
            error={errors.fullName}
          />
          <AddressInput
            label="Mobile Number"
            required
            inputMode="numeric"
            value={formData.mobileNumber}
            onChange={(v) => setField("mobileNumber", v.replace(/\D/g, "").slice(0, 10))}
            error={errors.mobileNumber}
          />
          <div className="sm:col-span-2">
            <AddressInput
              label="Email (optional)"
              type="email"
              value={formData.email}
              onChange={(v) => setField("email", v)}
              error={errors.email}
            />
          </div>
        </div>
      </section>

      <div className="stitch-rule my-8" aria-hidden />

      {/* Delivery Address */}
      <section>
        <h2 className="mb-4 text-xs font-semibold tracking-[0.1em] text-muted uppercase">
          Delivery Address
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <AddressInput
              label="PIN Code"
              required
              inputMode="numeric"
              value={formData.pinCode}
              onChange={handlePinChange}
              error={errors.pinCode}
              success={pinResolved}
              hint={isLookingUpPin ? "Looking up your area…" : undefined}
            />
          </div>
          <AddressInput
            label="House No / Flat / Building"
            required
            value={formData.houseNumber}
            onChange={(v) => setField("houseNumber", v)}
            error={errors.houseNumber}
          />
          <div className="sm:col-span-2">
            <AddressInput
              label="Street Address"
              required
              value={formData.streetAddress}
              onChange={(v) => setField("streetAddress", v)}
              error={errors.streetAddress}
            />
          </div>
          <AddressInput
            label="Area / Locality"
            required
            value={formData.area}
            onChange={(v) => setField("area", v)}
            error={errors.area}
          />
          <AddressInput
            label="Landmark (optional)"
            value={formData.landmark}
            onChange={(v) => setField("landmark", v)}
          />
          <AddressInput
            label="City"
            required
            value={formData.city}
            onChange={(v) => setField("city", v)}
            error={errors.city}
            success={pinResolved}
          />
          <AddressInput
            label="State"
            required
            value={formData.state}
            onChange={(v) => setField("state", v)}
            error={errors.state}
            success={pinResolved}
          />
          <div className="sm:col-span-2">
            <AddressInput
              label="Country"
              required
              value={formData.country}
              onChange={(v) => setField("country", v)}
              error={errors.country}
            />
          </div>
        </div>
      </section>

      <div className="stitch-rule my-8" aria-hidden />

      <section className="space-y-6">
        <AddressTypeSelector
          value={formData.addressType}
          onChange={(v: AddressType) => setField("addressType", v)}
        />
        <DefaultCheckbox
          checked={formData.isDefault}
          onChange={(v) => setField("isDefault", v)}
        />
        <DeliveryInfoCard />
      </section>

      <div className="mt-9 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-border px-7 py-3 text-sm font-medium text-body transition-colors hover:border-primary hover:text-primary"
        >
          Cancel
        </button>
        <Link to="/checkout/payment">
        <motion.button
          type="submit"
          disabled={isSaving}
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-medium text-white shadow-[0_8px_20px_-8px_rgba(131,82,64,0.55)] transition-shadow hover:shadow-[0_12px_28px_-8px_rgba(131,82,64,0.6)] disabled:opacity-70"
        >
          {isSaving && <Loader2 size={16} className="animate-spin" />}
          {isSaving ? "Saving Address…" : "Save Address"}
        </motion.button>
        </Link>
      </div>
    </form>
  );
}
