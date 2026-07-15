import { useState } from "react";

const inputClasses =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-body placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary transition-shadow";

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-border last:border-b-0">
      <div>
        <p className="text-sm font-medium text-admin-text">{label}</p>
        <p className="text-xs text-muted mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
          checked ? "bg-primary" : "bg-border"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export function SecurityTab() {
  const [twoFactor, setTwoFactor] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);

  return (
    <div className="flex flex-col gap-8">
      <form className="flex flex-col gap-5">
        <h2 className="font-heading text-lg text-admin-text">Change password</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <input type="password" placeholder="Current password" className={inputClasses} />
          <div />
          <input type="password" placeholder="New password" className={inputClasses} />
          <input type="password" placeholder="Confirm new password" className={inputClasses} />
        </div>
        <div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-dark text-background px-6 py-3 rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            Update password
          </button>
        </div>
      </form>

      <div>
        <h2 className="font-heading text-lg text-admin-text mb-1">Account protection</h2>
        <Toggle
          checked={twoFactor}
          onChange={setTwoFactor}
          label="Two-factor authentication"
          description="Require an OTP each time you sign in from a new device."
        />
        <Toggle
          checked={loginAlerts}
          onChange={setLoginAlerts}
          label="Login alerts"
          description="Get an email whenever your account is accessed."
        />
      </div>
    </div>
  );
}
