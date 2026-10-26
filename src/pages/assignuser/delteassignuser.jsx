import React, { useState } from "react";
import {
  Trash2,
  X,
  AlertTriangle,
  Loader2,
  User,
  Shield,
  Briefcase,
} from "lucide-react";
import api from "../../API/axios";
import { removeUserFromManager } from "../../API/dashboardApis";
const DeleteAssignUser = ({
  isOpen,
  onClose,
  user,
  manager,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen || !user) return null;

const handleDelete = async () => {
  setLoading(true);
  setErrorMsg("");

  try {
    await removeUserFromManager({
      manager_id: manager?.id,
      user_id: user.id,
    });

    if (onSuccess) {
      await onSuccess(user);
    }

    onClose();
  } catch (err) {
    console.error("Delete assigned user failed:", err);

    setErrorMsg(
      err?.response?.data?.message ||
        "Failed to remove assigned user. Please try again."
    );
  } finally {
    setLoading(false);
  }
};
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1.5 transition"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-3">
            <Trash2 size={28} />
          </div>

          <h3 className="text-lg font-black text-[#111827]">
            Remove Assigned User
          </h3>
          <p className="text-xs text-[#6b7280] mt-1">
            Are you sure you want to unassign this user from the manager?
          </p>
        </div>

        {/* User & Manager Info Card */}
        <div className="mt-5 p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900 truncate">
                {user.name || "Unknown User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.email || "No email"}
              </p>
            </div>
            <span className="text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-semibold whitespace-nowrap">
              {user.role || "User"}
            </span>
          </div>

          {manager && (
            <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
              <span className="flex items-center gap-1 font-medium text-gray-500">
                <Shield size={12} className="text-[#8b2cf5]" />
                Assigned to:
              </span>
              <span className="font-bold text-gray-800 truncate max-w-[180px]">
                {manager.name}
              </span>
            </div>
          )}
        </div>

        {/* Warning Note */}
        <div className="mt-3.5 flex items-start gap-2 p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-800 text-xs">
          <AlertTriangle size={15} className="flex-shrink-0 mt-0.5 text-amber-600" />
          <p>
            This user will be unlinked from <strong>{manager?.name || "this manager"}</strong> and become available for reassignment.
          </p>
        </div>

        {/* Error message if any */}
        {errorMsg && (
          <p className="mt-3 text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200 text-center">
            {errorMsg}
          </p>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold text-sm transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Removing...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAssignUser;
