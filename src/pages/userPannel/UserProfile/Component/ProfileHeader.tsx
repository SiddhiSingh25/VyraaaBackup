import { motion } from "motion/react";
import { LoyaltyAvatar } from "./LoyaltyAvatar";
import { StatChip } from "./StatChip";
import type { AccountStats, UserProfile } from "./account";

interface ProfileHeaderProps {
  user: UserProfile;
  stats: AccountStats;
}

export function ProfileHeader({ user, stats }: ProfileHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-surface p-3 md:p-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <LoyaltyAvatar user={user} />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-2xl text-admin-text">
              {user.firstName} {user.lastName}
            </h1>
          
          </div>
          <p className="text-body mt-1">{user.email}</p>
          <p className="text-xs text-muted mt-1">
            Member since {user.memberSince} 
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <StatChip
          label="Orders placed"
          value={String(stats.totalOrders)}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 8h12l1 13H5z" />
              <path d="M9 8a3 3 0 0 1 6 0" />
            </svg>
          }
        />
        <StatChip
          label="Wishlist items"
          value={String(stats.wishlistCount)}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 20s-7-4.4-9.4-8.8C1.2 8 2.6 5 5.8 5c1.9 0 3.3 1 4.2 2.3C11 6 12.4 5 14.3 5c3.2 0 4.6 3 3.2 6.2C15 15.6 12 20 12 20z" />
            </svg>
          }
        />
        <StatChip
          label="Reviews"
          value={stats.loyaltyPoints.toLocaleString("en-IN")}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 2l2.7 6.6L21 9.3l-5 4.5 1.5 7.2L12 17.3l-5.5 3.7L8 13.8l-5-4.5 6.3-.7z" />
            </svg>
          }
        />
      </div>
    </motion.div>
  );
}
