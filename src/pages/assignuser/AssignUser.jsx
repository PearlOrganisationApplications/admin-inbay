import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  UserPlus,
  ShieldCheck,
  Search,
  ChevronRight,
  CheckCircle2,
  Loader2,
  Mail,
  Briefcase,
  Check,
  XCircle,
  AlertTriangle,
  X,
} from "lucide-react";

import api from "../../API/axios";

const AssignUser = () => {
  const [managers, setManagers] = useState([]);
  const [users, setUsers] = useState([]);
  const [counts, setCounts] = useState({
    total_users: 0,
    active_users: 0,
    inactive_users: 0,
  });

  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  // Selection States
  const [selectedManager, setSelectedManager] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  // ================= CUSTOM MODAL STATE =================
  const [modal, setModal] = useState({
    show: false,
    type: "success", // "success" | "error" | "warning"
    title: "",
    message: "",
  });

  const showModal = (type, title, message) => {
    setModal({ show: true, type, title, message });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, show: false }));
  };

  const BASE_URL =
    "https://test.pearl-developer.com/Inbay_Innovations/public/api";

  useEffect(() => {
    fetchData();
  }, []);

  // ============================
  // FETCH MANAGERS + USERS
  // ============================
  const fetchData = async () => {
    setLoading(true);

    try {
      const [mgrRes, userRes] = await Promise.all([
        api.get(`${BASE_URL}/admin/managers`),
        api.get(`${BASE_URL}/admin/get/user`),
      ]);

      const mgrData = mgrRes.data;
      const userData = userRes.data;

      if (mgrData.status) {
        setManagers(mgrData.data || []);
      }

      if (userData.status) {
        setUsers(userData.data || []);

        setCounts(
          userData.counts || {
            total_users: 0,
            active_users: 0,
            inactive_users: 0,
          }
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);

      showModal(
        "error",
        "Failed to Load Data",
        error?.response?.data?.message ||
          "Unable to fetch managers and users."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // SELECT MANAGER
  // ============================
  const handleManagerSelect = (manager) => {
    setSelectedManager(manager);

    // Reset selected users when manager changes
    setSelectedUsers([]);
  };

  // ============================
  // SELECT / UNSELECT USER
  // ============================
  const handleUserSelect = (user) => {
    setSelectedUsers((prev) => {
      const alreadySelected = prev.some(
        (selected) => selected.id === user.id
      );

      if (alreadySelected) {
        return prev.filter((selected) => selected.id !== user.id);
      }

      return [...prev, user];
    });
  };

  // ============================
  // SELECT ALL FILTERED USERS
  // ============================
  const handleSelectAll = () => {
    if (!selectedManager || filteredUsers.length === 0) return;

    const allSelected = filteredUsers.every((user) =>
      selectedUsers.some((selected) => selected.id === user.id)
    );

    if (allSelected) {
      // Remove filtered users
      setSelectedUsers((prev) =>
        prev.filter(
          (selected) =>
            !filteredUsers.some((user) => user.id === selected.id)
        )
      );
    } else {
      // Add filtered users
      setSelectedUsers((prev) => {
        const existingIds = new Set(prev.map((user) => user.id));

        const newUsers = filteredUsers.filter(
          (user) => !existingIds.has(user.id)
        );

        return [...prev, ...newUsers];
      });
    }
  };

  // ============================
  // ASSIGN MULTIPLE USERS
  // ============================
  const handleAssign = async () => {
    if (!selectedManager) {
      showModal("warning", "No Manager Selected", "Please select a manager first.");
      return;
    }

    if (selectedUsers.length === 0) {
      showModal("warning", "No Users Selected", "Please select at least one user.");
      return;
    }

    setAssigning(true);

    try {
      /*
       * IMPORTANT:
       *
       * Token is NOT hardcoded here.
       * Axios interceptor will automatically attach:
       *
       * Authorization: Bearer <token>
       *
       * Backend payload:
       *
       * {
       *   manager_id: 123,
       *   user_ids: [1, 2, 3, 4]
       * }
       */

      const response = await api.post(
        `${BASE_URL}/assign-user-to-manager`,
        {
          manager_id: selectedManager.id,
          user_ids: selectedUsers.map((user) => user.id),
        }
      );

      const result = response.data;

      showModal(
        "success",
        "Users Assigned",
        result.message ||
          `${selectedUsers.length} users assigned successfully to ${selectedManager.name}!`
      );

      // Reset selected users
      setSelectedUsers([]);

      // Refresh data
      await fetchData();
    } catch (error) {
      console.error("Assignment error:", error);

      showModal(
        "error",
        "Assignment Failed",
        error?.response?.data?.message ||
          "Assignment failed. Please try again."
      );
    } finally {
      setAssigning(false);
    }
  };

  // ============================
  // FILTER USERS
  // ============================
  const filteredUsers = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) {
      return users;
    }

    return users.filter((user) => {
      const name = user.name?.toLowerCase() || "";
      const email = user.email?.toLowerCase() || "";
      const role = user.role?.toLowerCase() || "";

      return (
        name.includes(search) ||
        email.includes(search) ||
        role.includes(search)
      );
    });
  }, [users, searchTerm]);

  // ============================
  // SELECTION HELPERS
  // ============================
  const isUserSelected = (userId) => {
    return selectedUsers.some((user) => user.id === userId);
  };

  const areAllFilteredSelected =
    filteredUsers.length > 0 &&
    filteredUsers.every((user) => isUserSelected(user.id));

  // ============================
  // LOADING
  // ============================
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-[#8b2cf5] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans pb-32">
      {/* ================= HEADER ================= */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <UserPlus className="text-[#8b2cf5] w-8 h-8" />
            Assign Hierarchy
          </h1>

          <p className="text-gray-500 font-medium mt-1">
            Assign multiple field executives to a manager
          </p>
        </div>

        <div className="flex gap-4 overflow-x-auto w-full md:w-auto pb-2">
          <StatCard
            label="Total Users"
            value={counts.total_users}
            color="bg-blue-600"
            icon={<Users size={18} />}
          />

          <StatCard
            label="Active"
            value={counts.active_users}
            color="bg-green-600"
            icon={<UserCheck size={18} />}
          />

          <StatCard
            label="Managers"
            value={managers.length}
            color="bg-purple-600"
            icon={<ShieldCheck size={18} />}
          />
        </div>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ================= MANAGERS ================= */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              Step 1: Select Manager
            </h3>

            <span className="text-xs bg-purple-100 text-[#8b2cf5] px-2 py-1 rounded-full font-bold">
              {managers.length} Available
            </span>
          </div>

          <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
            {managers.map((mgr) => {
              const isSelected = selectedManager?.id === mgr.id;

              return (
                <div
                  key={mgr.id}
                  onClick={() => handleManagerSelect(mgr)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? "border-[#8b2cf5] bg-purple-50 shadow-md"
                      : "border-white bg-white hover:border-purple-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm ${
                        isSelected
                          ? "bg-[#8b2cf5] text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {mgr.name?.charAt(0)?.toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 leading-tight">
                        {mgr.name}
                      </h4>

                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 truncate">
                        <Mail size={12} />
                        {mgr.email}
                      </p>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="text-[#8b2cf5] w-6 h-6" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= USERS ================= */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
            <div>
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                Step 2: Select Users
              </h3>

              {selectedManager && (
                <p className="text-xs text-gray-500 mt-1">
                  Assigning users to{" "}
                  <span className="font-bold text-[#8b2cf5]">
                    {selectedManager.name}
                  </span>
                </p>
              )}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

              <input
                type="text"
                placeholder="Search user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              />
            </div>
          </div>

          {/* ================= SELECT ALL BAR ================= */}
          <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-100 text-[#8b2cf5] flex items-center justify-center">
                <Users size={18} />
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900">
                  {selectedUsers.length} Users Selected
                </p>

                <p className="text-xs text-gray-400">
                  {filteredUsers.length} users showing
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSelectAll}
              disabled={!selectedManager || filteredUsers.length === 0}
              className="text-xs font-bold text-[#8b2cf5] hover:bg-purple-50 px-3 py-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {areAllFilteredSelected ? "Deselect All" : "Select All"}
            </button>
          </div>

          {/* ================= USER LIST ================= */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {!selectedManager ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <ShieldCheck className="w-12 h-12 text-gray-300 mb-3" />

                <h3 className="font-bold text-gray-700">
                  Select a Manager First
                </h3>

                <p className="text-sm text-gray-400 mt-1">
                  Choose a manager from the left to select users.
                </p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Users className="w-12 h-12 text-gray-300 mb-3" />

                <h3 className="font-bold text-gray-700">
                  No Users Found
                </h3>

                <p className="text-sm text-gray-400 mt-1">
                  Try changing your search.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100 max-h-[calc(100vh-320px)] overflow-y-auto custom-scrollbar">
                {filteredUsers.map((user) => {
                  const selected = isUserSelected(user.id);

                  return (
                    <div
                      key={user.id}
                      onClick={() => handleUserSelect(user)}
                      className={`p-4 flex items-center gap-4 cursor-pointer transition-all relative ${
                        selected
                          ? "bg-purple-50"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      {/* CHECKBOX */}
                      <div
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          selected
                            ? "bg-[#8b2cf5] border-[#8b2cf5] text-white"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {selected && <Check size={15} strokeWidth={3} />}
                      </div>

                      {/* PROFILE */}
                      <div className="relative flex-shrink-0">
                        {user.profile_image ? (
                          <img
                            src={user.profile_image}
                            className={`w-12 h-12 rounded-full object-cover border-2 shadow-sm ${
                              selected
                                ? "border-[#8b2cf5]"
                                : "border-white"
                            }`}
                            alt=""
                          />
                        ) : (
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                              selected
                                ? "bg-purple-100 text-[#8b2cf5]"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {user.name?.charAt(0)?.toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* USER INFO */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-gray-900 text-sm truncate">
                            {user.name}
                          </h4>

                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase flex-shrink-0 ${
                              user.is_active
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {user.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          {user.email}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                            <Briefcase size={10} />
                            {user.role}
                          </span>

                          {user.manager_id && (
                            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-bold">
                              Managed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= FLOATING ACTION BAR ================= */}
      {selectedManager && selectedUsers.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-3xl bg-gray-900 rounded-2xl p-4 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-white/10 z-50">
          <div className="flex items-center gap-3 text-white min-w-0">
            <div className="flex -space-x-3 flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#8b2cf5] border-2 border-gray-900 flex items-center justify-center font-bold">
                {selectedManager.name?.charAt(0)?.toUpperCase()}
              </div>

              <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-gray-900 flex items-center justify-center font-bold">
                {selectedUsers.length}
              </div>
            </div>

            <div className="text-sm min-w-0">
              <p className="font-medium opacity-70">
                Assigning {selectedUsers.length} Users
              </p>

              <p className="font-bold flex items-center gap-1 truncate">
                {selectedUsers.length} Users
                <ChevronRight size={14} className="opacity-50" />
                {selectedManager.name}
              </p>
            </div>
          </div>

          <button
            onClick={handleAssign}
            disabled={assigning}
            className="w-full md:w-auto bg-[#8b2cf5] hover:bg-[#7a26d9] text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {assigning ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Assigning...
              </>
            ) : (
              <>
                <UserCheck size={20} />
                Assign {selectedUsers.length} Users
              </>
            )}
          </button>
        </div>
      )}

      {/* ================= CUSTOM RESULT MODAL ================= */}
      <ResultModal modal={modal} onClose={closeModal} />
    </div>
  );
};

// ============================
// RESULT MODAL (Success / Error / Warning)
// ============================
const ResultModal = ({ modal, onClose }) => {
  if (!modal.show) return null;

  const config = {
    success: {
      ring: "bg-purple-100",
      iconColor: "text-[#8b2cf5]",
      icon: <CheckCircle2 size={32} strokeWidth={2.5} />,
      btn: "bg-[#8b2cf5] hover:bg-[#7a26d9]",
    },
    error: {
      ring: "bg-red-100",
      iconColor: "text-red-600",
      icon: <XCircle size={32} strokeWidth={2.5} />,
      btn: "bg-red-600 hover:bg-red-700",
    },
    warning: {
      ring: "bg-amber-100",
      iconColor: "text-amber-600",
      icon: <AlertTriangle size={32} strokeWidth={2.5} />,
      btn: "bg-amber-500 hover:bg-amber-600",
    },
  };

  const { ring, iconColor, icon, btn } = config[modal.type] || config.success;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 relative animate-scaleIn"
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1.5 transition-all"
        >
          <X size={18} />
        </button>

        {/* ICON */}
        <div className="flex flex-col items-center text-center pt-2">
          <div
            className={`w-16 h-16 rounded-2xl ${ring} ${iconColor} flex items-center justify-center mb-4`}
          >
            {icon}
          </div>

          <h3 className="text-lg font-black text-gray-900">
            {modal.title}
          </h3>

          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            {modal.message}
          </p>
        </div>

        {/* ACTION */}
        <button
          onClick={onClose}
          className={`w-full mt-6 ${btn} text-white font-bold py-3 rounded-xl transition-all active:scale-95`}
        >
          Got it
        </button>
      </div>
    </div>
  );
};

// ============================
// STAT CARD
// ============================
const StatCard = ({ label, value, color, icon }) => (
  <div className="bg-white p-3 md:p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 min-w-[140px]">
    <div
      className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center text-white`}
    >
      {icon}
    </div>

    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">
        {label}
      </p>

      <p className="text-xl font-black text-gray-900 leading-none">
        {value}
      </p>
    </div>
  </div>
);

export default AssignUser;