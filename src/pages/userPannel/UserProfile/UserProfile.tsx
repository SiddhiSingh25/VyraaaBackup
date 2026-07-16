import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { AccountTabId, UserProfile, AccountStats } from "./Component/account";
import { sampleAddresses, sampleOrders, samplePaymentMethods, sampleStats, sampleUser } from "./Component/sampleUser";
import Navbar from "../../../components/Header/Navbar";
import { ProfileSidebar } from "./Component/ProfileSidebar";
import { ProfileHeader } from "./Component/ProfileHeader";
import { PersonalInfoTab } from "./Component/tabs/PersonalInfoTab";
import { OrdersTab } from "./Component/tabs/OrdersTab";
import { AddressesTab } from "./Component/tabs/AddressesTab";
import type { Address } from "./Component/tabs/AddressesTab";
import { SecurityTab } from "./Component/tabs/SecurityTab";
import Footer from "../../../components/Footer/Footer";
import useGetQuery from "@/hooks/getQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";

const TAB_TITLES: Record<AccountTabId, string> = {
  "personal-info": "Personal Information",
  orders: "My Orders",
  addresses: "Manage Address",
  payment: "Payment Methods",
  security: "Password & Security",
};

const mapBackendGender = (backendGender: string): "Female" | "Male" | "Non-binary" | "Prefer not to say" => {
  if (backendGender === "Male") return "Male";
  if (backendGender === "Female") return "Female";
  if (backendGender === "Other") return "Non-binary";
  return "Prefer not to say";
};

const mapFrontendGender = (frontendGender: string): "Male" | "Female" | "Other" | "" => {
  if (frontendGender === "Male") return "Male";
  if (frontendGender === "Female") return "Female";
  if (frontendGender === "Non-binary") return "Other";
  return "";
};

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<AccountTabId>("personal-info");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<AccountStats>(sampleStats);
  const [addresses, setAddresses] = useState<Address[]>([]);

  let { getQuery } = useGetQuery();
  const { getQuery: getAddressesQuery, loading: loadingAddresses } = useGetQuery();
  let { postQuery } = usePostQuery();

  const fetchAddresses = useCallback(() => {
    getAddressesQuery({
      url: apiUrls.Address.getByUserId,
      onSuccess: (res) => {
        setAddresses(res?.data ?? []);
      },
      onFail: (err) => {
        console.error("Failed to load addresses", err);
      },
    });
  }, [getAddressesQuery]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleSaveAddress = (
    formData: any,
    addressId?: string,
    onSuccess?: () => void,
    onFail?: (err: any) => void
  ) => {
    postQuery({
      url: apiUrls.Address.add,
      postData: addressId ? { addressId, ...formData } : formData,
      onSuccess: () => {
        fetchAddresses();
        onSuccess?.();
      },
      onFail: (err: any) => {
        console.error("Save address failed", err);
        onFail?.(err);
      },
    });
  };

  const handleDeleteAddress = (
    addressId: string,
    onSuccess?: () => void,
    onFail?: (err: any) => void
  ) => {
    postQuery({
      url: apiUrls.Address.delete,
      postData: { addressId },
      onSuccess: () => {
        setAddresses((prev) => prev.filter((a) => a._id !== addressId));
        onSuccess?.();
      },
      onFail: (err: any) => {
        console.error("Delete address failed", err);
        onFail?.(err);
      },
    });
  };

  useEffect(() => {
    getQuery({
      url: apiUrls.Auth.profile,
      onSuccess: (res) => {
        const profile = res?.data;
        if (!profile) return;

        let formattedMemberSince = "July 2026";
        if (profile.createdAt) {
          try {
            const date = new Date(profile.createdAt);
            const monthNames = [
              "January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"
            ];
            formattedMemberSince = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
          } catch (e) {
            console.error("Error formatting date", e);
          }
        }

        setUser({
          id: profile._id || profile.id || "usr_default",
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
          email: profile.email || "",
          phone: profile.mobileNo || "",
          phoneCountryCode: profile.phoneCountryCode || "+91",
          gender: mapBackendGender(profile.gender || ""),
          avatarUrl: profile.profilePic || profile.avatarUrl || null,
          memberSince: formattedMemberSince,
          tier: profile.tier || "Clay",
          tierProgress: profile.tierProgress ?? 0,
          pointsToNextTier: profile.pointsToNextTier ?? 100,
        });

        setStats({
          totalOrders: profile.totalOrders ?? 0,
          wishlistCount: profile.totalWishlist ?? 0,
          loyaltyPoints: profile.totalReviews ?? 0,
        });
      },
      onFail: (err) => {
        console.log(err)
      }
    })
  }, [getQuery])

  const handleSaveProfile = (
    updated: UserProfile,
    onSuccess?: () => void,
    onFail?: (err: any) => void
  ) => {
    postQuery({
      url: apiUrls.Auth.updateProfile,
      postData: {
        firstName: updated.firstName,
        lastName: updated.lastName,
        mobileNo: updated.phone,
        gender: mapFrontendGender(updated.gender),
        profilePic: updated.avatarUrl || "",
      },
      onSuccess: (res: any) => {
        const profile = res?.data;
        if (profile) {
          setUser((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              firstName: profile.firstName || prev.firstName,
              lastName: profile.lastName || prev.lastName,
              phone: profile.mobileNo || prev.phone,
              gender: mapBackendGender(profile.gender || ""),
              avatarUrl: profile.profilePic || prev.avatarUrl || null,
            };
          });
          onSuccess?.();
        } else {
          onFail?.({ message: "Invalid payload received from response" });
        }
      },
      onFail: (err: any) => {
        console.error("Save profile failed", err);
        onFail?.(err);
      },
    });
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />

      <main className="px-6 md:px-10 py-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-admin-text">
              My Account
            </h1>

            <p className="text-sm text-muted mt-1">
              Home
              <span className="mx-2">/</span>
              <span className="text-admin-text">My Account</span>
            </p>
          </div>

          <div className="text-right">
            <p className="text-lg font-semibold text-admin-text">
              Hi, {user.firstName}
            </p>

            <p className="text-sm text-muted">
              Manage your account details.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
          <ProfileSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLogout={handleLogout}
          />

          <div className="flex flex-col gap-5 min-w-0">
            <ProfileHeader user={user} stats={stats} />

            <div className="rounded-2xl border border-border bg-surface p-4 md:p-5 min-h-[420px]">
              <h2 className="text-xl font-semibold text-admin-text mb-5">
                {TAB_TITLES[activeTab]}
              </h2>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  {activeTab === "personal-info" && (
                    <PersonalInfoTab
                      user={user}
                      onSave={handleSaveProfile}
                    />
                  )}

                  {activeTab === "orders" && (
                    <OrdersTab orders={sampleOrders} />
                  )}

                  {activeTab === "addresses" && (
                    <AddressesTab
                    // addresses={addresses}
                    // onSave={handleSaveAddress}
                    // onDelete={handleDeleteAddress}
                    // loading={loadingAddresses}
                    />
                  )}



                  {activeTab === "security" && (
                    <SecurityTab />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
