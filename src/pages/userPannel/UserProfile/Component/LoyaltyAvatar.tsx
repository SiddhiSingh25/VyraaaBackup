import { useRef, useState } from "react";
import { motion } from "motion/react";
import type { UserProfile } from "./account";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import { Loader2 } from "lucide-react";

interface LoyaltyAvatarProps {
  user: UserProfile;
  size?: number;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

const RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function LoyaltyAvatar({ user, size = 104, setUser }: LoyaltyAvatarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  // Fallback to profilePic if avatarUrl is undefined in your schema
  const [preview, setPreview] = useState<string | null>(user.avatarUrl || user.profilePic);
  const [isUploading, setIsUploading] = useState(false);

  const { postQuery } = usePostQuery();

  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  // 1. The Promise.all upload function adapted for your callback-based postQuery
  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", file);

        postQuery({
          url: apiUrls.Image.upload,
          postData: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onSuccess: (res: any) => {
            if (res?.data) {
              resolve(res.data); // Resolves the promise with the S3 URL
            } else {
              reject(new Error(`Image upload failed for file: ${file.name}`));
            }
          },
          onFail: (err: any) => {
            reject(err);
          },
        });
      });
    });

    // Execute all uploads concurrently
    return await Promise.all(uploadPromises);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optimistic UI update: Show the local file instantly
    setPreview(URL.createObjectURL(file));
    setIsUploading(true);

    try {
      // 2. Upload the file using your array function
      const imageUrls = await uploadImages([file]);
      const uploadedUrl = imageUrls[0]; // Get the string URL for the single avatar

      if (uploadedUrl) {
        // 3. Update the user profile with the new URL
        postQuery({
          url: apiUrls.Auth.updateProfile,
          postData: {
            profilePic: uploadedUrl,
          },
          onSuccess: (profileRes: any) => {
            const profile = profileRes?.data;
            if (profile) {
              setUser((prev: any) => {
                if (!prev) return null;
                return {
                  ...prev,
                  profilePic: profile.profilePic || uploadedUrl,
                  avatarUrl: profile.profilePic || uploadedUrl, // Safely mapping to both names
                };
              });
            }
            setIsUploading(false);
          },
          onFail: (err: any) => {
            console.error("Save profile failed", err);
            setIsUploading(false);
          },
        });
      }
    } catch (error) {
      console.error("Upload process failed:", error);
      setIsUploading(false);
      // Revert the preview image if the AWS upload failed
      setPreview(user.avatarUrl || user.profilePic || null);
    }
  };

  const offset = CIRCUMFERENCE * (1 - (user.tierProgress || 0) / 100);

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      aria-label={`${user.tier || 'Member'} tier, ${user.tierProgress || 0}% to next tier`}
    >
      {/* Outer SVG Ring */}
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

      {/* Avatar Container */}
      <div
        className="absolute rounded-full overflow-hidden bg-card border border-border flex items-center justify-center group"
        style={{ inset: 10 }}
      >
        {preview ? (
          <img
            src={preview}
            alt={`${user.firstName} ${user.lastName}`}
            className={`w-full h-full object-cover transition-opacity ${isUploading ? 'opacity-40' : 'opacity-100'}`}
          />
        ) : (
          <span className="font-heading text-2xl text-admin-text">{initials}</span>
        )}

        {/* Loading overlay during upload */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <Loader2 className="animate-spin text-white w-6 h-6 drop-shadow-md" />
          </div>
        )}
      </div>

      {/* Upload Button */}
      <button
        type="button"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
        className="absolute bottom-0 right-0 w-7 h-7 z-10 rounded-full bg-dark text-background flex items-center justify-center border-2 border-background hover:bg-primary-dark disabled:opacity-50 transition-colors cursor-pointer"
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
        accept="image/png, image/jpeg, image/jpg, image/webp"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}