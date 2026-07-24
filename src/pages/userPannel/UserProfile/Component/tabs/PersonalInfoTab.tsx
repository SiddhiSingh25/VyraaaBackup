import { useState } from "react";
import type { UserProfile } from "../account";
import { useToast } from "@/hooks/useToast.hook";
import { Input, Select, Button } from "@/components/ui/FormElements";

interface PersonalInfoTabProps {
  user: UserProfile;
  onSave: (
    updated: UserProfile,
    onSuccess?: () => void,
    onFail?: (err: any) => void
  ) => void;
}

export function PersonalInfoTab({ user, onSave }: PersonalInfoTabProps) {
  const [form, setForm] = useState(formStateFromUser(user));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  // Helper to ensure state matches the fresh user prop when it updates
  function formStateFromUser(u: UserProfile) {
    return { ...u };
  }

  const update = <K extends keyof UserProfile>(
    key: K,
    value: UserProfile[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
    if (errors[key as string]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    // Validate phone number
    const newErrors: { [key: string]: string } = {};
    const cleanPhone = form.phone ? form.phone.replace(/\D/g, "") : "";
    
    if (!form.phone || !form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^(?:91)?[6-9]\d{9}$/.test(cleanPhone)) {
      newErrors.phone = "Please enter a valid 10-digit mobile number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSaving(true);
    setSaved(false);

    onSave(
      form,
      () => {
        setSaved(true);
        toast("success", "Profile updated successfully");
        setSaving(false);
      },
      (err) => {
        toast("error", err?.data?.message || err?.message || "Failed to update profile");
        setSaving(false);
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          value={form.firstName}
          onChange={(e) => update("firstName", e.target.value)}
          disabled={saving}
          required
        />
        <Input
          label="Last Name"
          value={form.lastName}
          onChange={(e) => update("lastName", e.target.value)}
          disabled={saving}
          required
        />

        {/* Email */}
        <Input
          label="Email"
          type="email"
          value={form.email}
          disabled={true}
          readOnly
        />
      </div>

      {/* Phone + Gender */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="+91 9876543210"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          disabled={saving}
          required
          error={errors.phone}
        />

        <Select
          label="Gender"
          value={form.gender}
          onChange={(e) =>
            update("gender", e.target.value as UserProfile["gender"])
          }
          disabled={saving}
          options={[
            { label: "Female", value: "Female" },
            { label: "Male", value: "Male" },
            { label: "Non-binary", value: "Non-binary" },
            { label: "Prefer not to say", value: "Prefer not to say" },
          ]}
          placeholder="Select gender"
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          disabled={saving}
          variant="primary"
          className="bg-dark hover:bg-primary-dark text-background rounded-xl px-6 py-3"
        >
          {saving ? "Saving Changes..." : "Save Changes"}
          {!saving && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="ml-2"
            >
              <path d="M5 12h14" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          )}
        </Button>

        {saved && (
          <span className="text-sm text-success font-medium">Saved</span>
        )}
      </div>
    </form>
  );
}


