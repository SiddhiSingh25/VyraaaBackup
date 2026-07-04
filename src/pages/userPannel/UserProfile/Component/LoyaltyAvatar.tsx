import { useRef, useState } from "react";
import { motion } from "motion/react";
import type { UserProfile } from "./account";

interface LoyaltyAvatarProps {
  user: UserProfile;
  size?: number;
  onUpload?: (file: File) => void;
}

const RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function LoyaltyAvatar({ user, size = 104, onUpload }: LoyaltyAvatarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(user.avatarUrl);

  const initials = `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onUpload?.(file);
  };

  const offset = CIRCUMFERENCE * (1 - user.tierProgress / 100);

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      aria-label={`${user.tier} member, ${user.tierProgress}% to next tier`}
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 -rotate-90"
        width={size}
        height={size}
      >
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="3"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke="var(--color-rose-gold)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}
        />
      </svg>

      <div
        className="absolute rounded-full overflow-hidden bg-card border border-border flex items-center justify-center"
        style={{ inset: 10 }}
      >
        {preview ? (
          <img src={preview} alt={`${user.firstName} ${user.lastName}`} className="w-full h-full object-cover" />
        ) : (
          <span className="font-heading text-2xl text-heading">{initials}</span>
        )}
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-dark text-background flex items-center justify-center border-2 border-background hover:bg-primary-dark transition-colors"
        aria-label="Change profile photo"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
