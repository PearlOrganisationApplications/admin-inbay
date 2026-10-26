
import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  Briefcase,
  Users,
  MapPin,
  IndianRupee,
  PhoneCall,
  CheckCircle,
  Save,
  Pencil,
} from "lucide-react";

import { updateAdminUser } from "./userPageApis";

const EditUser = ({
  isOpen,
  selectedUser,
  setIsEditModalOpen,
  showToast,
  setUsers,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_number: "",
    designation: "",
    team: "",
    hq: "",
    state: "",
    per_km_rate: "",
    role: "User",
    is_active: 1,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form whenever the selected user changes.
  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name ?? "",
        email: selectedUser.email ?? "",
        mobile_number: selectedUser.mobile_number ?? "",
        designation: selectedUser.designation ?? "",
        team: selectedUser.team ?? "",
        hq: selectedUser.hq ?? "",
        state: selectedUser.state ?? "",
        per_km_rate: selectedUser.per_km_rate ?? "",
        role: selectedUser.role ?? "User",
        is_active:
          selectedUser.is_active !== undefined &&
          selectedUser.is_active !== null
            ? Number(selectedUser.is_active)
            : 1,
      });
    }
  }, [selectedUser]);

  if (!isOpen || !selectedUser) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update user through the actual API.
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser?.id) {
      showToast?.("User ID is missing", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile_number: formData.mobile_number,
        designation: formData.designation,
        team: formData.team,
        hq: formData.hq,
        state: formData.state,
        per_km_rate:
          formData.per_km_rate === ""
            ? ""
            : Number(formData.per_km_rate),
        role: formData.role,
        is_active: Number(formData.is_active),
      };

      // POST /admin/user/update/{id}
      const response = await updateAdminUser(
        selectedUser.id,
        payload
      );

      const result = response?.data;

      // Check the API response.
      if (result?.success !== true) {
        throw new Error(
          result?.message || "Failed to update user"
        );
      }

      // Use the updated user returned by the API when available.
      const updatedUser = {
        ...selectedUser,
        ...payload,
        ...(result?.data || {}),
        is_active: Number(
          result?.data?.is_active ?? payload.is_active
        ),
      };

      // Update the existing users list.
      if (setUsers) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === selectedUser.id
              ? { ...user, ...updatedUser }
              : user
          )
        );
      }

      showToast?.(
        result?.message || "User details updated successfully!",
        "success"
      );

      setIsEditModalOpen(false);
    } catch (error) {
      console.error(
        "Update user error:",
        error?.response?.data || error
      );

      showToast?.(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update user",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-2 text-white">
            <Pencil size={18} />
            <h2 className="text-lg font-bold">
              Edit User Details
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsEditModalOpen(false)}
            className="text-white hover:bg-white/20 rounded-lg p-1.5 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Profile Card */}
        <div className="px-5 py-4 border-b bg-white">
          <div className="flex items-center gap-4">
            <img
              src={
                selectedUser.profile_image ||
                "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(
                    formData.name || selectedUser.name || "User"
                  )
              }
              alt={formData.name || selectedUser.name || "User"}
              className="w-16 h-16 rounded-full object-cover border-2 border-purple-100 shadow-sm"
            />

            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800">
                {formData.name || "Unnamed User"}
              </h3>

              <p className="text-sm text-gray-500 truncate">
                {formData.email || "No email provided"}
              </p>

              <div className="flex gap-2 mt-2 flex-wrap items-center">
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-semibold ${
                    Number(formData.is_active) === 1
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {Number(formData.is_active) === 1
                    ? "Active"
                    : "Inactive"}
                </span>

                <span className="px-3 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                  {formData.role || "User"}
                </span>

                <span className="text-xs text-gray-400">
                  ID: #{selectedUser.id}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[55vh] overflow-y-auto">

            {/* Full Name */}
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 focus-within:bg-white transition-all">
              <label className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1.5">
                <User size={14} className="text-purple-600" />
                Full Name
              </label>

              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className="w-full bg-transparent text-gray-800 font-medium text-sm outline-none placeholder:text-gray-400"
              />
            </div>

            {/* Email */}
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 focus-within:bg-white transition-all">
              <label className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1.5">
                <Mail size={14} className="text-purple-600" />
                Email Address
              </label>

              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                className="w-full bg-transparent text-gray-800 font-medium text-sm outline-none placeholder:text-gray-400"
              />
            </div>

            {/* Mobile Number */}
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 focus-within:bg-white transition-all">
              <label className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1.5">
                <PhoneCall size={14} className="text-purple-600" />
                Mobile Number
              </label>

              <input
                type="text"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleChange}
                placeholder="Enter mobile number"
                className="w-full bg-transparent text-gray-800 font-medium text-sm outline-none placeholder:text-gray-400"
              />
            </div>

            {/* Designation */}
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 focus-within:bg-white transition-all">
              <label className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1.5">
                <Briefcase size={14} className="text-purple-600" />
                Designation
              </label>

              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="Software Engineer, Manager, etc."
                className="w-full bg-transparent text-gray-800 font-medium text-sm outline-none placeholder:text-gray-400"
              />
            </div>

            {/* Team */}
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 focus-within:bg-white transition-all">
              <label className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1.5">
                <Users size={14} className="text-purple-600" />
                Team
              </label>

              <input
                type="text"
                name="team"
                value={formData.team}
                onChange={handleChange}
                placeholder="Sales, Operations, Dev, etc."
                className="w-full bg-transparent text-gray-800 font-medium text-sm outline-none placeholder:text-gray-400"
              />
            </div>

            {/* Headquarters */}
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 focus-within:bg-white transition-all">
              <label className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1.5">
                <MapPin size={14} className="text-purple-600" />
                Headquarters
              </label>

              <input
                type="text"
                name="hq"
                value={formData.hq}
                onChange={handleChange}
                placeholder="Enter headquarters location"
                className="w-full bg-transparent text-gray-800 font-medium text-sm outline-none placeholder:text-gray-400"
              />
            </div>

            {/* State */}
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 focus-within:bg-white transition-all">
              <label className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1.5">
                <MapPin size={14} className="text-purple-600" />
                State
              </label>

              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
                className="w-full bg-transparent text-gray-800 font-medium text-sm outline-none placeholder:text-gray-400"
              />
            </div>

            {/* Per KM Rate */}
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 focus-within:bg-white transition-all">
              <label className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1.5">
                <IndianRupee size={14} className="text-purple-600" />
                Per KM Rate (₹)
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                name="per_km_rate"
                value={formData.per_km_rate}
                onChange={handleChange}
                placeholder="e.g. 12.00"
                className="w-full bg-transparent text-gray-800 font-medium text-sm outline-none placeholder:text-gray-400"
              />
            </div>

            {/* Status */}
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 focus-within:bg-white transition-all">
              <label className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1.5">
                <CheckCircle size={14} className="text-purple-600" />
                Status
              </label>

              <select
                name="is_active"
                value={Number(formData.is_active)}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_active: Number(e.target.value),
                  }))
                }
                className="w-full bg-transparent text-gray-800 font-medium text-sm outline-none cursor-pointer"
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-3.5 border-t bg-gray-50 flex justify-end items-center gap-3">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-100 transition shadow-sm disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold hover:from-purple-700 hover:to-indigo-700 transition shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              {isSubmitting ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
