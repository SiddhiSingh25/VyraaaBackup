import { useState } from "react";
import type { UserProfile } from "../account";


interface PersonalInfoTabProps {
  user: UserProfile;
  onSave: (updated: UserProfile) => void;
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
      <label className="text-sm font-medium text-heading">
        {label} {required && <span className="text-error">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClasses =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-body placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary transition-shadow";

export function PersonalInfoTab({ user, onSave }: PersonalInfoTabProps) {
  const [form, setForm] = useState(user);
  const [saved, setSaved] = useState(false);

  const update = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    setSaved(true);
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
        required
      />
    </Field>

      {/* Email */}
  <Field label="Email" required>
    <input
      type="email"
      className={inputClasses}
      value={form.email}
      onChange={(e) => update("email", e.target.value)}
      required
    />
  </Field>
  </div>



  {/* Phone + Gender */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Field label="Phone" required>
      <div className="flex gap-2">
        <select
          className={`${inputClasses} w-24 shrink-0`}
          value={form.phoneCountryCode}
          onChange={(e) => update("phoneCountryCode", e.target.value)}
        >
          <option value="+91">+91</option>
          <option value="+1">+1</option>
          <option value="+44">+44</option>
        </select>

        <input
          className={inputClasses}
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
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
      className="inline-flex items-center gap-2 rounded-xl bg-dark px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-primary-dark"
    >
      Save Changes
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
    </button>

    {saved && <span className="text-sm text-success">Saved</span>}
  </div>
</form>
  );
}
