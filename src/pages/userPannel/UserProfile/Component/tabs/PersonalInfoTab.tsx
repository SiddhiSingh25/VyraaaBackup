import { useState } from "react";
import type { UserProfile } from "../account";
import { useToast } from "@/hooks/useToast.hook";

interface PersonalInfoTabProps {
  user: UserProfile;
  onSave: (updated: UserProfile) => Promise<boolean>;
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-admin-text">
        {label} {required && <span className="text-error">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClasses =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-body placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary transition-shadow disabled:opacity-60 disabled:cursor-not-allowed";

export function PersonalInfoTab({ user, onSave }: PersonalInfoTabProps) {
  const [form, setForm] = useState(formStateFromUser(user));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setSaved(false);

    try {
      const success = await onSave(form);
      if (success) {
        setSaved(true);
        toast("success", "Profile updated successfully");
      } else {
        toast("error", "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      toast("error", "Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="First Name" required>
          <input
            className={inputClasses}
            value={form.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            disabled={saving}
            required
          />
        </Field>
        <Field label="Last Name" required>
          <input
            className={inputClasses}
            value={form.lastName}
            onChange={(e) => update("lastName", e.target.value)}
            disabled={saving}
            required
          />
        </Field>

        {/* Email */}
        <Field label="Email">
          <input
            type="email"
            className={inputClasses}
            value={form.email}
            disabled={true}
            readOnly
          />
        </Field>
      </div>

      {/* Phone + Gender */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Phone" required>
          <div className="flex items-center gap-3">
         

            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="+91 9876543210"
              className={`${inputClasses} flex-1 min-w-0`}
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              disabled={saving}
              required
            />
          </div>
        </Field>

        <Field label="Gender">
          <select
            className={inputClasses}
            value={form.gender}
            onChange={(e) =>
              update("gender", e.target.value as UserProfile["gender"])
            }
            disabled={saving}
          >
            <option>Female</option>
            <option>Male</option>
            <option>Non-binary</option>
            <option>Prefer not to say</option>
          </select>
        </Field>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-dark px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed"
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
            >
              <path d="M5 12h14" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          )}
        </button>

        {saved && (
          <span className="text-sm text-success font-medium">Saved</span>
        )}
      </div>
    </form>
  );
}

