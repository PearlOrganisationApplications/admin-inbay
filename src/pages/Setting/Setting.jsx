import React, { useState, useRef } from "react";
import {
  User,
  Lock,
  Bell,
  Save,
  Camera,
  Mail,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  X,
} from "lucide-react";

const Setting = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const fileInputRef = useRef(null);

  // Profile fields (controlled)
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    bio: "",
    avatar: "https://i.pravatar.cc/150?img=32",
  });

  // Password fields
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  // Mock states for interactive toggles
  const [toggles, setToggles] = useState({
    emailAlerts: true,
    pushNotifications: false,
    weeklyReport: true,
    twoFactor: true,
  });

  // Toast
  const [toast, setToast] = useState(null); // { type: "success" | "error", message: string }

  const handleToggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleProfileChange = (key) => (e) => {
    setProfile((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 3000);
  };

  // Avatar upload — reads the chosen file into a data URL and keeps it in memory (React state)
  const handleAvatarPick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please choose an image file.", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("Image must be under 5MB.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfile((prev) => ({ ...prev, avatar: reader.result }));
      showToast("Profile picture updated.");
    };
    reader.onerror = () => showToast("Couldn't read that image.", "error");
    reader.readAsDataURL(file);

    // allow re-selecting the same file later
    e.target.value = "";
  };

  const handleRemoveAvatar = () => {
    setProfile((prev) => ({ ...prev, avatar: "" }));
    showToast("Profile picture removed.");
  };

  const handleSave = () => {
    if (activeTab === "profile") {
      if (!profile.firstName.trim() || !profile.lastName.trim()) {
        showToast("First and last name can't be empty.", "error");
        return;
      }
      showToast("Profile changes saved.");
    } else if (activeTab === "security") {
      if (passwords.next || passwords.confirm || passwords.current) {
        if (passwords.next !== passwords.confirm) {
          showToast("New passwords don't match.", "error");
          return;
        }
        if (passwords.next && passwords.next.length < 8) {
          showToast("New password must be at least 8 characters.", "error");
          return;
        }
      }
      showToast("Security settings saved.");
      setPasswords({ current: "", next: "", confirm: "" });
    } else {
      showToast("Notification preferences saved.");
    }
  };

  // Reusable Toggle Switch Component
  const ToggleSwitch = ({ checked, onChange }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 ${
        checked ? "bg-purple-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );

  return (
    <div className="bg-gray-50 h-screen flex flex-col font-sans overflow-hidden relative">
      {/* TOAST */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-fade-in">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium ${
              toast.type === "error"
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-white border-gray-200 text-gray-800"
            }`}
          >
            {toast.type === "error" ? (
              <X size={18} className="text-red-500 flex-shrink-0" />
            ) : (
              <CheckCircle2 size={18} className="text-purple-600 flex-shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-white px-6 py-4 shadow-sm border-b border-gray-200 flex justify-between items-center z-10 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800">Settings</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your account preferences and settings</p>
        </div>

        <button
          onClick={handleSave}
          className="bg-purple-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-700 active:bg-purple-800 transition-colors shadow-sm flex items-center gap-2"
        >
          <Save size={16} />
          <span className="hidden sm:inline">Save Changes</span>
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
          {/* LEFT SIDEBAR NAVIGATION */}
          <div className="w-full md:w-64 flex-shrink-0">
            <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 hide-scrollbar">
              {[
                { id: "profile", label: "My Profile", icon: User },
                { id: "security", label: "Security", icon: Lock },
                { id: "notifications", label: "Notifications", icon: Bell },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-purple-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-purple-50 hover:text-purple-700 bg-transparent md:bg-white md:border md:border-gray-100"
                    }`}
                  >
                    <Icon size={18} className={isActive ? "text-white" : "text-gray-400"} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* RIGHT CONTENT AREA */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* --- TAB 1: PROFILE --- */}
            {activeTab === "profile" && (
              <div className="p-6 md:p-8 animate-fade-in">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h3>

                {/* Hidden file input used by both Upload New + camera icon */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />

                {/* Avatar Section */}
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                  <div className="relative">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-purple-50 shadow-sm"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full border-4 border-purple-50 shadow-sm bg-purple-100 flex items-center justify-center text-purple-500">
                        <User size={32} />
                      </div>
                    )}
                    <button
                      onClick={handleAvatarPick}
                      className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full border-2 border-white shadow-sm hover:bg-purple-700 transition-colors"
                    >
                      <Camera size={14} />
                    </button>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-gray-800">Profile Picture</h4>
                    <p className="text-sm text-gray-500 mt-1 mb-3">PNG, JPEG under 5MB</p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAvatarPick}
                        className="px-4 py-1.5 bg-purple-50 text-purple-700 text-sm font-medium rounded-lg hover:bg-purple-100 transition-colors border border-purple-100"
                      >
                        Upload New
                      </button>
                      <button
                        onClick={handleRemoveAvatar}
                        className="px-4 py-1.5 bg-gray-50 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">First Name</label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={handleProfileChange("firstName")}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Last Name</label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={handleProfileChange("lastName")}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-gray-400" size={16} />
                      <input
                        type="email"
                        value={profile.email}
                        onChange={handleProfileChange("email")}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={handleProfileChange("phone")}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700">Bio</label>
                    <textarea
                      rows="3"
                      value={profile.bio}
                      onChange={handleProfileChange("bio")}
                      placeholder="Write a few sentences about yourself..."
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition-all text-sm resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* --- TAB 2: SECURITY --- */}
            {activeTab === "security" && (
              <div className="p-6 md:p-8 animate-fade-in">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Security Settings</h3>

                {/* 2FA Section */}
                <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-2.5 rounded-lg text-purple-600">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">Two-Factor Authentication (2FA)</h4>
                      <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account.</p>
                    </div>
                  </div>
                  <ToggleSwitch checked={toggles.twoFactor} onChange={() => handleToggle("twoFactor")} />
                </div>

                {/* Password Change Form */}
                <div className="space-y-5 max-w-md">
                  <h4 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">Change Password</h4>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={passwords.current}
                      onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">New Password</label>
                    <input
                      type="password"
                      placeholder="Create a new password"
                      value={passwords.next}
                      onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="Confirm your new password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition-all text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="mt-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {/* --- TAB 3: NOTIFICATIONS --- */}
            {activeTab === "notifications" && (
              <div className="p-6 md:p-8 animate-fade-in">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Notification Preferences</h3>

                <div className="space-y-6">
                  {/* Email Alerts */}
                  <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                    <div className="flex gap-4">
                      <div className="mt-1 text-gray-400">
                        <Mail size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-800">Email Notifications</h4>
                        <p className="text-sm text-gray-500 mt-0.5">Receive daily summaries and system alerts via email.</p>
                      </div>
                    </div>
                    <ToggleSwitch checked={toggles.emailAlerts} onChange={() => handleToggle("emailAlerts")} />
                  </div>

                  {/* Push Notifications */}
                  <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                    <div className="flex gap-4">
                      <div className="mt-1 text-gray-400">
                        <Smartphone size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-800">Push Notifications</h4>
                        <p className="text-sm text-gray-500 mt-0.5">Get real-time alerts pushed to your mobile device.</p>
                      </div>
                    </div>
                    <ToggleSwitch checked={toggles.pushNotifications} onChange={() => handleToggle("pushNotifications")} />
                  </div>

                  {/* Weekly Report */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <div className="mt-1 text-gray-400">
                        <Bell size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-800">Weekly Performance Report</h4>
                        <p className="text-sm text-gray-500 mt-0.5">A weekly rundown of your attendance and statistics.</p>
                      </div>
                    </div>
                    <ToggleSwitch checked={toggles.weeklyReport} onChange={() => handleToggle("weeklyReport")} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Setting;