import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Users,
  UserCheck,
  UserPlus,
  ShieldCheck,
  Search,
  CheckCircle2,
  Loader2,
  Mail,
  Briefcase,
  Check,
  XCircle,
  AlertTriangle,
  X,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

import api from "../../API/axios";
import { getUsersByManagerId } from "../../API/dashboardApis";

/* -------------------------------------------------------------------------- */
/*  Constants                                                                  */
/* -------------------------------------------------------------------------- */

const BASE_URL = "https://test.pearl-developer.com/Inbay_Innovations/public/api";

const DEFAULT_COUNTS = {
  total_users: 0,
  active_users: 0,
  inactive_users: 0,
};

const MODAL_CONFIG = {
  success: {
    ring: "bg-purple-100",
    iconColor: "text-purple-600",
    icon: <CheckCircle2 size={30} strokeWidth={2.5} />,
    btn: "bg-[#8b2cf5] hover:bg-[#7a26d9]",
  },
  error: {
    ring: "bg-red-100",
    iconColor: "text-red-600",
    icon: <XCircle size={30} strokeWidth={2.5} />,
    btn: "bg-red-600 hover:bg-red-700",
  },
  warning: {
    ring: "bg-amber-100",
    iconColor: "text-amber-600",
    icon: <AlertTriangle size={30} strokeWidth={2.5} />,
    btn: "bg-amber-500 hover:bg-amber-600",
  },
};

/* -------------------------------------------------------------------------- */
/*  Utilities                                                                  */
/* -------------------------------------------------------------------------- */

function useDebouncedValue(value, delayMs = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

function initials(name, fallback = "U") {
  return name?.charAt(0)?.toUpperCase() || fallback;
}

function extractList(payload, keys = ["data", "users"]) {
  if (Array.isArray(payload)) return payload;
  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key];
    if (Array.isArray(payload?.data?.[key])) return payload.data[key];
  }
  return [];
}

/* -------------------------------------------------------------------------- */
/*  Data hooks                                                                 */
/* -------------------------------------------------------------------------- */

function useManagersAndUsers(onError) {
  const [managers, setManagers] = useState([]);
  const [users, setUsers] = useState([]);
  const [counts, setCounts] = useState(DEFAULT_COUNTS);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const [mgrRes, userRes] = await Promise.all([
        api.get(`${BASE_URL}/admin/managers`),
        api.get(`${BASE_URL}/admin/get/user`),
      ]);

      if (mgrRes.data?.status) setManagers(mgrRes.data.data || []);
      if (userRes.data?.status) {
        setUsers(userRes.data.data || []);
        setCounts(userRes.data.counts || DEFAULT_COUNTS);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      onError?.(
        "Failed to Load Data",
        error?.response?.data?.message || "Unable to fetch managers and users."
      );
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { managers, users, counts, loading, refetch };
}

function useAssignedUsers(managerId, onError) {
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const refetch = useCallback(async () => {
    if (!managerId) {
      setAssignedUsers([]);
      return;
    }
    setLoading(true);
    setAssignedUsers([]);
    try {
      const response = await getUsersByManagerId(managerId);
      const result = response?.data || response;
      setAssignedUsers(extractList(result));
    } catch (error) {
      console.error("Error fetching assigned users:", error);
      setAssignedUsers([]);
      onError?.(
        "Failed to Load Assigned Users",
        error?.response?.data?.message ||
          "Unable to fetch users assigned to this manager."
      );
    } finally {
      setLoading(false);
    }
  }, [managerId, onError]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { assignedUsers, loading, refetch };
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

const AssignUser = () => {
  const [selectedManager, setSelectedManager] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [managerSearch, setManagerSearch] = useState("");
  const [activeTab, setActiveTab] = useState("available"); // "available" | "assigned"
  const [assigning, setAssigning] = useState(false);
  const [modal, setModal] = useState({ show: false, type: "success", title: "", message: "" });

  const debouncedUserSearch = useDebouncedValue(userSearch, 250);

  const showModal = useCallback((type, title, message) => {
    setModal({ show: true, type, title, message });
  }, []);
  const showError = useCallback((title, message) => showModal("error", title, message), [showModal]);
  const closeModal = useCallback(() => setModal((prev) => ({ ...prev, show: false })), []);

  const { managers, users, counts, loading, refetch: refetchAll } = useManagersAndUsers(showError);
  const {
    assignedUsers,
    loading: assignedLoading,
    refetch: refetchAssigned,
  } = useAssignedUsers(selectedManager?.id, showError);

  const isAlreadyAssigned = useCallback(
    (userId) => assignedUsers.some((u) => String(u.id) === String(userId)),
    [assignedUsers]
  );

  const handleManagerSelect = useCallback((manager) => {
    setSelectedManager(manager);
    setSelectedUsers([]);
    setUserSearch("");
    setActiveTab("available");
  }, []);

  const handleUserSelect = useCallback(
    (user) => {
      if (isAlreadyAssigned(user.id)) return;
      setSelectedUsers((prev) =>
        prev.some((u) => u.id === user.id)
          ? prev.filter((u) => u.id !== user.id)
          : [...prev, user]
      );
    },
    [isAlreadyAssigned]
  );

  const filteredManagers = useMemo(() => {
    const search = managerSearch.toLowerCase().trim();
    if (!search) return managers;
    return managers.filter(
      (m) =>
        m.name?.toLowerCase().includes(search) || m.email?.toLowerCase().includes(search)
    );
  }, [managers, managerSearch]);

  const filteredUsers = useMemo(() => {
    const search = debouncedUserSearch.toLowerCase().trim();
    if (!search) return users;
    return users.filter((user) => {
      const name = user.name?.toLowerCase() || "";
      const email = user.email?.toLowerCase() || "";
      const role = user.role?.toLowerCase() || "";
      return name.includes(search) || email.includes(search) || role.includes(search);
    });
  }, [users, debouncedUserSearch]);

  const availableUsers = useMemo(
    () => filteredUsers.filter((u) => !isAlreadyAssigned(u.id)),
    [filteredUsers, isAlreadyAssigned]
  );

  const isUserSelected = useCallback(
    (userId) => selectedUsers.some((u) => u.id === userId),
    [selectedUsers]
  );

  const allAvailableSelected =
    availableUsers.length > 0 && availableUsers.every((u) => isUserSelected(u.id));

  const handleSelectAll = useCallback(() => {
    if (!selectedManager || availableUsers.length === 0) return;

    setSelectedUsers((prev) => {
      const allSelected = availableUsers.every((u) => isUserSelected(u.id));
      if (allSelected) {
        return prev.filter((selected) => !availableUsers.some((u) => u.id === selected.id));
      }
      const existingIds = new Set(prev.map((u) => u.id));
      const newUsers = availableUsers.filter((u) => !existingIds.has(u.id));
      return [...prev, ...newUsers];
    });
  }, [selectedManager, availableUsers, isUserSelected]);

  const handleAssign = useCallback(async () => {
    if (!selectedManager || selectedUsers.length === 0) return;

    setAssigning(true);
    try {
      const response = await api.post(`${BASE_URL}/assign-user-to-manager`, {
        manager_id: selectedManager.id,
        user_ids: selectedUsers.map((user) => user.id),
      });
      const result = response.data;

      showModal(
        "success",
        "Users Assigned",
        result.message ||
          `${selectedUsers.length} users assigned successfully to ${selectedManager.name}.`
      );

      setSelectedUsers([]);
      setActiveTab("assigned");
      await refetchAssigned();
      await refetchAll();
    } catch (error) {
      console.error("Assignment error:", error);
      showModal(
        "error",
        "Assignment Failed",
        error?.response?.data?.message || "Assignment failed. Please try again."
      );
    } finally {
      setAssigning(false);
    }
  }, [selectedManager, selectedUsers, refetchAssigned, refetchAll, showModal]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f9fafb]">
        <Loader2 className="w-9 h-9 text-[#8b2cf5] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] font-sans">
      <TopBar counts={counts} managersCount={managers.length} />

      <div className="flex flex-col lg:flex-row">
        <ManagerRail
          managers={filteredManagers}
          totalManagers={managers.length}
          search={managerSearch}
          onSearchChange={setManagerSearch}
          selectedManager={selectedManager}
          onSelect={handleManagerSelect}
        />

        <main className="flex-1 min-w-0 p-5 md:p-8 pb-36">
          {!selectedManager ? (
            <NoManagerState />
          ) : (
            <>
              <WorkspaceHeader manager={selectedManager} />

              <TabSwitcher
                activeTab={activeTab}
                onChange={setActiveTab}
                assignedCount={assignedUsers.length}
                availableCount={availableUsers.length}
              />

              {activeTab === "assigned" ? (
                <AssignedTable
                  users={assignedUsers}
                  loading={assignedLoading}
                  onRefresh={refetchAssigned}
                />
              ) : (
                <AvailableTable
                  users={filteredUsers}
                  availableUsers={availableUsers}
                  search={userSearch}
                  onSearchChange={setUserSearch}
                  isUserSelected={isUserSelected}
                  isAlreadyAssigned={isAlreadyAssigned}
                  onToggle={handleUserSelect}
                  allSelected={allAvailableSelected}
                  onToggleAll={handleSelectAll}
                  selectedCount={selectedUsers.length}
                />
              )}
            </>
          )}
        </main>
      </div>

      {selectedManager && selectedUsers.length > 0 && (
        <AssignmentBar
          manager={selectedManager}
          selectedCount={selectedUsers.length}
          assigning={assigning}
          onAssign={handleAssign}
        />
      )}

      <ResultModal modal={modal} onClose={closeModal} />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Top bar — editorial metric strip instead of stat cards                    */
/* -------------------------------------------------------------------------- */

const TopBar = ({ counts, managersCount }) => (
  <div className="border-b border-[#e5e7eb] bg-white">
    <div className="px-5 md:px-8 py-6 flex flex-col md:flex-row md:items-end justify-between gap-5">
      <div>
        <div className="flex items-center gap-2 text-[11px] font-bold text-[#8b2cf5] tracking-wide mb-1">
          <UserPlus size={14} />
          HIERARCHY
        </div>
        <h1 className="text-[28px] leading-tight font-black text-[#111827]">
          Assign field executives to managers
        </h1>
      </div>

      <div className="flex items-stretch divide-x divide-[#e5e7eb] border border-[#e5e7eb] rounded-xl overflow-hidden self-start">
        <Metric label="Total users" value={counts.total_users} />
        <Metric label="Active" value={counts.active_users} valueClass="text-emerald-600" />
        <Metric label="Managers" value={managersCount} valueClass="text-[#8b2cf5]" />
      </div>
    </div>
  </div>
);

const Metric = ({ label, value, valueClass = "text-[#111827]" }) => (
  <div className="px-5 py-3 min-w-[110px]">
    <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider mb-0.5">
      {label}
    </p>
    <p className={`text-xl font-black ${valueClass}`}>{value}</p>
  </div>
);

/* -------------------------------------------------------------------------- */
/*  Manager rail — dark, distinct from the working area                       */
/* -------------------------------------------------------------------------- */

const ManagerRail = ({
  managers,
  totalManagers,
  search,
  onSearchChange,
  selectedManager,
  onSelect,
}) => (
  <aside className="lg:w-[300px] flex-shrink-0 bg-white border-r border-[#e5e7eb] lg:h-[calc(100vh-97px)] lg:sticky lg:top-0 flex flex-col">
    <div className="p-4 border-b border-[#e5e7eb]">
      <p className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider mb-3">
        Managers · {totalManagers}
      </p>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6b7280]" />
        <input
          type="text"
          placeholder="Find a manager..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg text-sm text-[#111827] placeholder-[#6b7280] outline-none focus:border-[#8b2cf5] transition-colors"
        />
      </div>
    </div>

    <div className="flex-1 overflow-y-auto custom-scrollbar px-2 py-2">
      {managers.length === 0 ? (
        <p className="text-xs text-[#6b7280] text-center py-8 px-4">No managers match your search.</p>
      ) : (
        managers.map((mgr) => (
          <ManagerRow
            key={mgr.id}
            manager={mgr}
            isSelected={selectedManager?.id === mgr.id}
            onSelect={onSelect}
          />
        ))
      )}
    </div>
  </aside>
);

const ManagerRow = ({ manager, isSelected, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(manager)}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-left transition-colors border-2 ${
      isSelected
        ? "bg-purple-50 border-[#8b2cf5]"
        : "border-transparent hover:bg-gray-50"
    }`}
  >
    <div
      className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${
        isSelected ? "bg-[#8b2cf5] text-white" : "bg-gray-100 text-gray-500"
      }`}
    >
      {initials(manager.name)}
    </div>
    <div className="min-w-0 flex-1">
      <p className={`text-sm font-bold truncate ${isSelected ? "text-[#8b2cf5]" : "text-gray-800"}`}>
        {manager.name}
      </p>
      <p className="text-[11px] truncate text-gray-400">{manager.email}</p>
    </div>
    {isSelected && <ArrowRight size={15} className="text-[#8b2cf5] flex-shrink-0" />}
  </button>
);

/* -------------------------------------------------------------------------- */
/*  Empty / workspace header                                                  */
/* -------------------------------------------------------------------------- */

const NoManagerState = () => (
  <div className="flex flex-col items-center justify-center text-center py-28">
    <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#8b2cf5] flex items-center justify-center mb-4">
      <ShieldCheck size={26} />
    </div>
    <h3 className="font-black text-[#111827] text-lg">Pick a manager to get started</h3>
    <p className="text-sm text-[#6b7280] mt-1 max-w-xs">
      Choose someone from the list on the left to see and manage their assigned users.
    </p>
  </div>
);

const WorkspaceHeader = ({ manager }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="w-11 h-11 rounded-xl bg-[#111827] text-white flex items-center justify-center font-black">
      {initials(manager.name)}
    </div>
    <div>
      <h2 className="text-lg font-black text-[#111827] leading-tight">{manager.name}</h2>
      <p className="text-xs text-[#6b7280] flex items-center gap-1">
        <Mail size={11} />
        {manager.email}
      </p>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*  Tab switcher                                                              */
/* -------------------------------------------------------------------------- */

const TabSwitcher = ({ activeTab, onChange, assignedCount, availableCount }) => (
  <div className="flex items-center gap-6 border-b border-[#e5e7eb] mb-5">
    <TabButton
      label="Select users"
      count={availableCount}
      isActive={activeTab === "available"}
      onClick={() => onChange("available")}
    />
    <TabButton
      label="Currently assigned"
      count={assignedCount}
      isActive={activeTab === "assigned"}
      onClick={() => onChange("assigned")}
    />
  </div>
);

const TabButton = ({ label, count, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`pb-3 -mb-px text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
      isActive
        ? "border-[#8b2cf5] text-[#111827]"
        : "border-transparent text-[#6b7280] hover:text-[#111827]"
    }`}
  >
    {label}
    <span
      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
        isActive ? "bg-purple-100 text-[#8b2cf5]" : "bg-gray-100 text-[#6b7280]"
      }`}
    >
      {count}
    </span>
  </button>
);

/* -------------------------------------------------------------------------- */
/*  Available users — compact selectable table                                */
/* -------------------------------------------------------------------------- */

const AvailableTable = ({
  users,
  availableUsers,
  search,
  onSearchChange,
  isUserSelected,
  isAlreadyAssigned,
  onToggle,
  allSelected,
  onToggleAll,
  selectedCount,
}) => (
  <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-[#e5e7eb]">
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
        <input
          type="text"
          placeholder="Search by name, email or role..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg text-sm outline-none focus:border-[#8b2cf5] transition-colors"
        />
      </div>

      <div className="flex items-center gap-4 text-xs">
        <span className="text-[#6b7280] font-medium">
          {selectedCount > 0 ? (
            <span className="text-[#8b2cf5] font-bold">{selectedCount} selected</span>
          ) : (
            `${availableUsers.length} available`
          )}
        </span>
        <button
          type="button"
          onClick={onToggleAll}
          disabled={availableUsers.length === 0}
          className="font-bold text-[#8b2cf5] hover:underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
        >
          {allSelected ? "Deselect all" : "Select all"}
        </button>
      </div>
    </div>

    {users.length === 0 ? (
      <div className="py-16 text-center">
        <Users className="w-10 h-10 text-gray-200 mx-auto mb-2" />
        <p className="text-sm font-bold text-[#111827]">No users found</p>
        <p className="text-xs text-[#6b7280] mt-0.5">Try a different search.</p>
      </div>
    ) : (
      <div className="max-h-[520px] overflow-y-auto custom-scrollbar">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-[#f3f4f6]">
            {users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                selected={isUserSelected(user.id)}
                alreadyAssigned={isAlreadyAssigned(user.id)}
                onToggle={onToggle}
              />
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

const UserRow = ({ user, selected, alreadyAssigned, onToggle }) => (
  <tr
    onClick={() => onToggle(user)}
    className={`transition-colors ${
      alreadyAssigned
        ? "bg-emerald-50/50 cursor-default"
        : selected
        ? "bg-purple-50 cursor-pointer"
        : "hover:bg-[#f9fafb] cursor-pointer"
    }`}
  >
    <td className="pl-4 py-3 w-10">
      <div
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
          alreadyAssigned
            ? "bg-emerald-500 border-emerald-500 text-white"
            : selected
            ? "bg-[#8b2cf5] border-[#8b2cf5] text-white"
            : "border-gray-300"
        }`}
      >
        {(selected || alreadyAssigned) && <Check size={13} strokeWidth={3} />}
      </div>
    </td>

    <td className="py-3 pr-3">
      <div className="flex items-center gap-3">
        {user.profile_image ? (
          <img
            src={user.profile_image}
            alt={user.name || "User"}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-100 text-[#6b7280] flex items-center justify-center text-xs font-bold flex-shrink-0">
            {initials(user.name)}
          </div>
        )}
        <div className="min-w-0">
          <p className="font-bold text-[#111827] truncate">{user.name}</p>
          <p className="text-xs text-[#6b7280] truncate">{user.email}</p>
        </div>
      </div>
    </td>

    <td className="py-3 pr-3 hidden md:table-cell">
      <span className="text-xs text-[#6b7280] flex items-center gap-1">
        <Briefcase size={11} />
        {user.role || "User"}
      </span>
    </td>

    <td className="py-3 pr-3 hidden sm:table-cell">
      <span
        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
          user.is_active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
        }`}
      >
        {user.is_active ? "Active" : "Inactive"}
      </span>
    </td>

    <td className="py-3 pr-4 text-right">
      {alreadyAssigned ? (
        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold whitespace-nowrap">
          Assigned
        </span>
      ) : user.manager_id ? (
        <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold whitespace-nowrap">
          Managed
        </span>
      ) : (
        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-bold whitespace-nowrap">
          Unassigned
        </span>
      )}
    </td>
  </tr>
);

/* -------------------------------------------------------------------------- */
/*  Assigned users — read-only table                                          */
/* -------------------------------------------------------------------------- */

const AssignedTable = ({ users, loading, onRefresh }) => (
  <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden">
    <div className="flex items-center justify-between p-4 border-b border-[#e5e7eb]">
      <p className="text-xs font-bold text-[#6b7280] uppercase tracking-wider">
        {users.length} users assigned
      </p>
      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        className="flex items-center gap-1.5 text-xs font-bold text-[#8b2cf5] hover:underline disabled:opacity-50"
      >
        <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
        Refresh
      </button>
    </div>

    {loading ? (
      <div className="py-16 flex flex-col items-center justify-center">
        <Loader2 className="w-7 h-7 text-[#8b2cf5] animate-spin" />
        <p className="text-sm text-[#6b7280] mt-3">Loading assigned users...</p>
      </div>
    ) : users.length === 0 ? (
      <div className="py-16 text-center">
        <Users className="w-10 h-10 text-gray-200 mx-auto mb-2" />
        <p className="text-sm font-bold text-[#111827]">No users assigned yet</p>
        <p className="text-xs text-[#6b7280] mt-0.5">
          Switch to "Select users" to assign some.
        </p>
      </div>
    ) : (
      <div className="max-h-[520px] overflow-y-auto custom-scrollbar">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-[#f3f4f6]">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="py-3 pl-4 pr-3">
                  <div className="flex items-center gap-3">
                    {user.profile_image ? (
                      <img
                        src={user.profile_image}
                        alt={user.name || "User"}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {initials(user.name)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-[#111827] truncate">
                        {user.name || "Unknown User"}
                      </p>
                      <p className="text-xs text-[#6b7280] truncate">
                        {user.email || "No email"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-3 hidden md:table-cell">
                  <span className="text-xs text-[#6b7280] flex items-center gap-1">
                    <Briefcase size={11} />
                    {user.role || "—"}
                  </span>
                </td>
                <td className="py-3 pr-4 text-right">
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold inline-flex items-center gap-1">
                    <CheckCircle2 size={11} />
                    Assigned
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

/* -------------------------------------------------------------------------- */
/*  Sticky assignment bar                                                     */
/* -------------------------------------------------------------------------- */

const AssignmentBar = ({ manager, selectedCount, assigning, onAssign }) => (
  <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[94%] max-w-2xl bg-[#111827] rounded-2xl p-3.5 shadow-2xl flex items-center justify-between gap-4 z-50">
    <div className="flex items-center gap-3 text-white min-w-0 pl-1.5">
      <div className="w-9 h-9 rounded-full bg-[#8b2cf5] flex items-center justify-center font-bold text-sm flex-shrink-0">
        {selectedCount}
      </div>
      <p className="text-sm font-bold truncate">
        Assign {selectedCount} user{selectedCount > 1 ? "s" : ""} to{" "}
        <span className="text-white/70">{manager.name}</span>
      </p>
    </div>

    <button
      onClick={onAssign}
      disabled={assigning}
      className="flex-shrink-0 bg-[#8b2cf5] hover:bg-[#7a26d9] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {assigning ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Assigning
        </>
      ) : (
        <>
          <UserCheck size={16} />
          Assign
        </>
      )}
    </button>
  </div>
);

/* -------------------------------------------------------------------------- */
/*  Result modal                                                              */
/* -------------------------------------------------------------------------- */

const ResultModal = ({ modal, onClose }) => {
  if (!modal.show) return null;
  const { ring, iconColor, icon, btn } = MODAL_CONFIG[modal.type] || MODAL_CONFIG.success;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1.5 transition-all"
        >
          <X size={17} />
        </button>

        <div className="flex flex-col items-center text-center pt-2">
          <div className={`w-14 h-14 rounded-2xl ${ring} ${iconColor} flex items-center justify-center mb-4`}>
            {icon}
          </div>
          <h3 className="text-lg font-black text-[#111827]">{modal.title}</h3>
          <p className="text-sm text-[#6b7280] mt-2 leading-relaxed">{modal.message}</p>
        </div>

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

export default AssignUser;