import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { AccountTabId, UserProfile } from "./Component/account";
import { sampleAddresses, sampleOrders, samplePaymentMethods, sampleStats, sampleUser } from "./Component/sampleUser";
import Navbar from "../../../components/Header/Navbar";
import { ProfileSidebar } from "./Component/ProfileSidebar";
import { ProfileHeader } from "./Component/ProfileHeader";
import { PersonalInfoTab } from "./Component/tabs/PersonalInfoTab";
import { OrdersTab } from "./Component/tabs/OrdersTab";
import { AddressesTab } from "./Component/tabs/AddressesTab";
import { SecurityTab } from "./Component/tabs/SecurityTab";
import { PaymentTab } from "./Component/tabs/PaymentTab";
import Footer from "../../../components/Footer/Footer";




const TAB_TITLES: Record<AccountTabId, string> = {
  "personal-info": "Personal Information",
  orders: "My Orders",
  addresses: "Manage Address",
  payment: "Payment Methods",
  security: "Password & Security",
};

export default function Profile() {
  const [activeTab, setActiveTab] = useState<AccountTabId>("personal-info");
  const [user, setUser] = useState<UserProfile>(sampleUser);

  const handleSaveProfile = (updated: UserProfile) => {
    setUser(updated);
    // TODO: wire up to PATCH /api/account
  };

  const handleLogout = () => {
    // TODO: wire up to auth sign-out
  };

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar/>

<main className="max-w-[1400px] mx-auto px-6 md:px-10 py-6">
  <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-heading">
        My Account
      </h1>

      <p className="text-sm text-muted mt-1">
        Home
        <span className="mx-2">/</span>
        <span className="text-heading">My Account</span>
      </p>
    </div>

    <div className="text-right">
      <p className="text-lg font-semibold text-heading">
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
      <ProfileHeader user={user} stats={sampleStats} />

      <div className="rounded-2xl border border-border bg-surface p-4 md:p-5 min-h-[420px]">
        <h2 className="text-xl font-semibold text-heading mb-5">
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
                addresses={sampleAddresses}
                onAddNew={() => {}}
              />
            )}

            {activeTab === "payment" && (
              <PaymentTab
                methods={samplePaymentMethods}
                onAddNew={() => {}}
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

      <Footer/>
    </div>
  );
}
