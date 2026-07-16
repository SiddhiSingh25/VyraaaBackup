import { useEffect, useState, useCallback } from "react";
import { MapPin, Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/useToast.hook";
import useGetQuery from "@/hooks/getQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook";
import { useAppSelector } from "@/redux/hooks";
import { apiUrls } from "@/apis";
import useDeleteQuery from "@/hooks/deleteQuery.hook";
import ConfirmDialog from "@/components/tableComponents/ConfirmDialog";
import * as yup from "yup";

const addressSchema = yup.object().shape({
  addressType: yup.string().required("Address type is required"),
  fullName: yup.string().trim().required("Full name is required"),
  town: yup.string().trim().required("Town / area is required"),
  streetAddress: yup.string().trim().required("Street address is required"),
  landmark: yup.string().trim().optional(),
  city: yup.string().trim().required("City is required"),
  state: yup.string().trim().required("State is required"),
  pinCode: yup
    .string()
    .trim()
    .required("Pin code is required")
    .matches(/^\d{6}$/, "Pin code must be exactly 6 digits"),
  country: yup.string().trim().required("Country is required"),
  phoneNumber: yup
    .string()
    .trim()
    .required("Phone number is required")
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  userId: yup.string().required(),
  isDefault: yup.boolean().required(),
});

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface Address {
  _id: string;
  // userId: string;
  addressType: string; // "Home" | "Work" | etc.
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

export type AddressFormData = Omit<Address, "_id">;

const EMPTY_FORM: AddressFormData = {
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

export interface AddressesTabProps { }

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function AddressesTab() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const { getQuery, loading } = useGetQuery();
  const { deleteQuery } = useDeleteQuery();
  const { postQuery } = usePostQuery();
  const { user } = useAppSelector((state: any) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAddresses = useCallback(() => {
    getQuery({
      url: apiUrls.Address.getByUserId,
      onSuccess: (res: any) => {
        setAddresses(res?.data ?? []);
      },
      onFail: (err: any) => {
        console.error("Failed to load addresses", err);
      },
    });
  }, [getQuery]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const openAddModal = () => {
    setEditingAddress(null);
    setFormData({
      ...EMPTY_FORM,
      userId: user?._id || user?.id || "",
    });
    setFormError(null);
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingAddress(addr);
    setFormData({
      addressType: addr.addressType,
      isDefault: addr.isDefault,
      fullName: addr.fullName,
      town: addr.town,
      streetAddress: addr.streetAddress,
      landmark: addr.landmark ?? "",
      city: addr.city,
      state: addr.state,
      pinCode: addr.pinCode,
      country: addr.country,
      phoneNumber: addr.phoneNumber,
      userId: user?._id || user?.id || "",
    });
    setFormError(null);
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setIsModalOpen(false);
    setEditingAddress(null);
    setFieldErrors({});
  };

  const handleFormChange = (
    field: keyof AddressFormData,
    value: string | boolean,
  ) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFieldErrors({});

    try {
      await addressSchema.validate(formData, { abortEarly: false });
    } catch (err: any) {
      if (err instanceof yup.ValidationError) {
        const errors: Record<string, string> = {};
        err.inner.forEach((validationError) => {
          if (validationError.path) {
            errors[validationError.path] = validationError.message;
          }
        });
        setFieldErrors(errors);
        setSubmitting(false);
        return;
      }
    }

    postQuery({
      url: apiUrls.Address.add,
      postData: editingAddress?._id
        ? { addressId: editingAddress._id, ...formData }
        : formData,
      onSuccess: () => {
        toast(
          "success",
          `Address ${editingAddress ? "updated" : "added"} successfully`,
        );
        setIsModalOpen(false);
        setEditingAddress(null);
        setSubmitting(false);
        fetchAddresses();
      },
      onFail: (err: any) => {
        setFormError(
          err?.data?.message || err?.message || "Failed to save address",
        );
        setSubmitting(false);
      },
    });
  };

  const handleDeleteClick = (addressId: string) => {
    setAddressToDelete(addressId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!addressToDelete) return;
    setDeleteConfirmOpen(false);
    setDeletingId(addressToDelete);
    deleteQuery({
      url: `${apiUrls.Address.delete}/${addressToDelete}`,
      onSuccess: () => {
        toast("success", "Address removed successfully");
        setAddresses((prev) => prev.filter((a) => a._id !== addressToDelete));
        setDeletingId(null);
        setAddressToDelete(null);
      },
      onFail: (err: any) => {
        toast(
          "error",
          err?.data?.message || err?.message || "Failed to delete address",
        );
        setDeletingId(null);
        setAddressToDelete(null);
      },
    });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setAddressToDelete(null);
  };

  return (
    <div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="h-[170px] animate-pulse rounded-xl border border-border bg-muted/40"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/30"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <MapPin size={16} className="text-muted-foreground" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-admin-text">
                      {addr.fullName}
                    </h3>
                    <p className="text-xs text-muted">{addr.addressType}</p>
                  </div>
                </div>

                {addr.isDefault && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary whitespace-nowrap">
                    Default
                  </span>
                )}
              </div>

              {/* Address */}
              <div className="mt-3 text-sm leading-5 text-body">
                <p>
                  {addr.streetAddress}
                  {addr.landmark && `, ${addr.landmark}`}
                </p>
                <p>
                  {addr.town}, {addr.city}
                </p>
                <p>
                  {addr.state} {addr.pinCode}, {addr.country}
                </p>
                <p>{addr.phoneNumber}</p>
              </div>

              {/* Actions */}
              <div className="mt-3 flex gap-2 border-t border-border pt-3">
                <button
                  type="button"
                  onClick={() => openEditModal(addr)}
                  className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-admin-text transition-colors hover:bg-muted"
                >
                  <Pencil size={14} />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteClick(addr._id)}
                  disabled={deletingId === addr._id}
                  className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                >
                  {deletingId === addr._id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Add Address */}
          <button
            type="button"
            onClick={openAddModal}
            className="flex min-h-[170px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface transition-colors hover:border-primary hover:bg-primary/5"
          >
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Plus size={18} className="text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-admin-text">
              Add Address
            </h3>
            <p className="mt-1 text-xs text-muted">
              Save a new delivery address
            </p>
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-surface p-5 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-admin-text">
                {editingAddress ? "Edit Address" : "Add Address"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-md p-1 text-muted-foreground hover:bg-muted"
              >
                <X size={16} />
              </button>
            </div>

            {formError && (
              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3" noValidate>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 flex flex-col gap-1">
                  <input
                    placeholder="Full name"
                    value={formData.fullName}
                    onChange={(e) => handleFormChange("fullName", e.target.value)}
                    className={`rounded-md border px-3 py-2 text-sm ${
                      fieldErrors.fullName ? "border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" : "border-border"
                    }`}
                  />
                  {fieldErrors.fullName && (
                    <span className="text-[11px] text-red-500 px-1">{fieldErrors.fullName}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <input
                    placeholder="Phone number"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleFormChange("phoneNumber", e.target.value)
                    }
                    className={`rounded-md border px-3 py-2 text-sm ${
                      fieldErrors.phoneNumber ? "border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" : "border-border"
                    }`}
                  />
                  {fieldErrors.phoneNumber && (
                    <span className="text-[11px] text-red-500 px-1">{fieldErrors.phoneNumber}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <select
                    value={formData.addressType}
                    onChange={(e) =>
                      handleFormChange("addressType", e.target.value)
                    }
                    className={`rounded-md border px-3 py-2 text-sm ${
                      fieldErrors.addressType ? "border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" : "border-border"
                    }`}
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                  {fieldErrors.addressType && (
                    <span className="text-[11px] text-red-500 px-1">{fieldErrors.addressType}</span>
                  )}
                </div>

                <div className="col-span-2 flex flex-col gap-1">
                  <input
                    placeholder="Street address"
                    value={formData.streetAddress}
                    onChange={(e) =>
                      handleFormChange("streetAddress", e.target.value)
                    }
                    className={`rounded-md border px-3 py-2 text-sm ${
                      fieldErrors.streetAddress ? "border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" : "border-border"
                    }`}
                  />
                  {fieldErrors.streetAddress && (
                    <span className="text-[11px] text-red-500 px-1">{fieldErrors.streetAddress}</span>
                  )}
                </div>

                <div className="col-span-2 flex flex-col gap-1">
                  <input
                    placeholder="Landmark (optional)"
                    value={formData.landmark}
                    onChange={(e) => handleFormChange("landmark", e.target.value)}
                    className={`rounded-md border px-3 py-2 text-sm ${
                      fieldErrors.landmark ? "border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" : "border-border"
                    }`}
                  />
                  {fieldErrors.landmark && (
                    <span className="text-[11px] text-red-500 px-1">{fieldErrors.landmark}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <input
                    placeholder="Town / area"
                    value={formData.town}
                    onChange={(e) => handleFormChange("town", e.target.value)}
                    className={`rounded-md border px-3 py-2 text-sm ${
                      fieldErrors.town ? "border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" : "border-border"
                    }`}
                  />
                  {fieldErrors.town && (
                    <span className="text-[11px] text-red-500 px-1">{fieldErrors.town}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <input
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => handleFormChange("city", e.target.value)}
                    className={`rounded-md border px-3 py-2 text-sm ${
                      fieldErrors.city ? "border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" : "border-border"
                    }`}
                  />
                  {fieldErrors.city && (
                    <span className="text-[11px] text-red-500 px-1">{fieldErrors.city}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <input
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => handleFormChange("state", e.target.value)}
                    className={`rounded-md border px-3 py-2 text-sm ${
                      fieldErrors.state ? "border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" : "border-border"
                    }`}
                  />
                  {fieldErrors.state && (
                    <span className="text-[11px] text-red-500 px-1">{fieldErrors.state}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <input
                    placeholder="Pin code"
                    value={formData.pinCode}
                    onChange={(e) => handleFormChange("pinCode", e.target.value)}
                    className={`rounded-md border px-3 py-2 text-sm ${
                      fieldErrors.pinCode ? "border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" : "border-border"
                    }`}
                  />
                  {fieldErrors.pinCode && (
                    <span className="text-[11px] text-red-500 px-1">{fieldErrors.pinCode}</span>
                  )}
                </div>

                <div className="col-span-2 flex flex-col gap-1">
                  <input
                    placeholder="Country"
                    value={formData.country}
                    onChange={(e) => handleFormChange("country", e.target.value)}
                    className={`rounded-md border px-3 py-2 text-sm ${
                      fieldErrors.country ? "border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" : "border-border"
                    }`}
                  />
                  {fieldErrors.country && (
                    <span className="text-[11px] text-red-500 px-1">{fieldErrors.country}</span>
                  )}
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-body">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    handleFormChange("isDefault", e.target.checked)
                  }
                />
                Set as default address
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="rounded-md px-3 py-2 text-sm font-medium text-admin-text hover:bg-muted disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  {editingAddress ? "Save changes" : "Add address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Remove Address"
        description="Are you sure you want to remove this address? This action cannot be undone."
        confirmLabel="Remove"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}