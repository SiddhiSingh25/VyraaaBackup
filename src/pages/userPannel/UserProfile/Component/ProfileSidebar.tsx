import { motion } from "motion/react";
import { Link } from "react-router-dom";
import type { AccountTabConfig, AccountTabId } from "./account";

const TABS: AccountTabConfig[] = [
  { id: "personal-info", label: "Personal Information", icon: "user" },
  { id: "orders", label: "My Orders", icon: "bag" },
  { id: "addresses", label: "Manage Address", icon: "pin" },
  { id: "security", label: "Password & Security", icon: "lock" },
];

const ICONS: Record<string, React.ReactNode> = {
  user: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </svg>
  ),
  bag: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 8h12l1 13H5z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </svg>
  ),
  pin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  ),
  card: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10.5h18" />
    </svg>
  ),
  lock: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  ),
  logout: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M3 5h6" />
      <path d="M3 19h6" />
    </svg>
  ),
};

interface ProfileSidebarProps {
  activeTab: AccountTabId;
  onTabChange: (tab: AccountTabId) => void;
  onLogout: () => void;
}

export function ProfileSidebar({ activeTab, onTabChange, onLogout }: ProfileSidebarProps) {
  return (
    <aside className="flex flex-col rounded-2xl border border-border bg-surface overflow-hidden lg:sticky lg:top-24 lg:self-start">
      <nav className="p-3 flex flex-col gap-1" aria-label="Account navigation">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left ${isActive ? "text-background" : "text-body hover:bg-card"
                }`}
            >
              {isActive && (
                <motion.span
                  layoutId="account-tab-highlight"
                  className="absolute inset-0 rounded-xl bg-dark"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">{ICONS[tab.icon]}</span>
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}

        <div className="my-2 border-t border-border" />

        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-error hover:bg-card transition-colors text-left"
        >
          {ICONS.logout}
          Logout
        </button>
      </nav>

      {/* <div className="mt-auto m-3 rounded-xl bg-card px-5 py-6 relative overflow-hidden">
        <Link to="/" className="shrink-0 flex items-center">
              <img
                src="/logo.png"
                alt="VYRAAA"
                className="h-14 w-auto object-contain "
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </Link>
      </div> */}
    </aside>
  );
}
