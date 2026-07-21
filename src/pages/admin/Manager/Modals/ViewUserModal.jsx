import React from "react";
import { X } from "lucide-react";

const ViewUserModal = ({
    isOpen,
    displayUser,
    setViewModalOpen,
    selectedManagerData,
}) => {
    if (!isOpen || !selectedManagerData) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
    <div className="w-full max-w-lg max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b bg-slate-50">
            <div>
                <h2 className="text-lg font-bold text-slate-900">
                    {selectedManagerData?.manager_name}
                </h2>
                <p className="text-xs text-slate-500">
                    Manager ID : {selectedManagerData?.manager_id}
                </p>
            </div>

            <button
                onClick={() => setViewModalOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-200 transition"
            >
                <X size={18} />
            </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4">

            {/* Manager Summary */}
            <div className="mb-4 rounded-xl bg-purple-50 border border-purple-100 p-3">
                <h3 className="font-semibold text-slate-900 text-base">
                    {selectedManagerData?.manager_name}
                </h3>

                <div className="flex justify-between mt-2 text-sm">
                    <span className="text-slate-600">
                        <strong>ID:</strong> {selectedManagerData?.manager_id}
                    </span>

                    <span className="text-slate-600">
                        <strong>Users:</strong>{" "}
                        {selectedManagerData?.assigned_users?.length || 0}
                    </span>
                </div>
            </div>

            {/* Assigned Users */}
            <div className="space-y-3">

                {selectedManagerData?.assigned_users?.length > 0 ? (

                    selectedManagerData.assigned_users.map((user) => (

                        <div
                            key={user.id}
                            className="border rounded-xl p-3 bg-white shadow-sm"
                        >

                            {/* Top */}
                            <div className="flex gap-3">

                                <img
                                    src={
                                        user?.profile_image
                                            ? `https://test.pearl-developer.com/Inbay_Innovations/public/${user.profile_image}`
                                            : "https://via.placeholder.com/80"
                                    }
                                    alt={user.name}
                                    className="w-12 h-12 rounded-lg object-cover border"
                                    onError={(e) => {
                                        e.target.src =
                                            "https://via.placeholder.com/80";
                                    }}
                                />

                                <div className="flex-1 min-w-0">

                                    <h3 className="font-semibold text-slate-900 truncate">
                                        {user.name}
                                    </h3>

                                    <p className="text-xs text-slate-500 truncate">
                                        {user.email}
                                    </p>

                                    <div className="flex items-center gap-2 mt-2 flex-wrap">

                                        <span
                                            className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                                                Number(user.is_active) === 1
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {Number(user.is_active) === 1
                                                ? "Active"
                                                : "Inactive"}
                                        </span>

                                        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">
                                            {user.role || "N/A"}
                                        </span>

                                    </div>

                                </div>

                            </div>

                            {/* Details */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-xs">

                                <div>
                                    <p className="text-slate-400">User ID</p>
                                    <p className="font-medium">{user.id}</p>
                                </div>

                                <div>
                                    <p className="text-slate-400">Designation</p>
                                    <p className="font-medium">
                                        {user.designation || "—"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-slate-400">Team</p>
                                    <p className="font-medium">
                                        {user.team || "—"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-slate-400">State</p>
                                    <p className="font-medium">
                                        {user.state || "—"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-slate-400">Rate</p>
                                    <p className="font-medium">
                                        ₹{user.per_km_rate || 0}/km
                                    </p>
                                </div>

                                <div>
                                    <p className="text-slate-400">Created</p>
                                    <p className="font-medium truncate">
                                        {user.created_at
                                            ? new Date(
                                                  user.created_at
                                              ).toLocaleDateString()
                                            : "—"}
                                    </p>
                                </div>

                            </div>

                        </div>

                    ))

                ) : (

                    <div className="text-center py-10 text-slate-500 text-sm">
                        No assigned users found.
                    </div>

                )}

            </div>

        </div>

        {/* Footer */}
        <div className="border-t bg-white p-4">
            <button
                onClick={() => setViewModalOpen(false)}
                className="w-full py-2.5 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
            >
                Close
            </button>
        </div>

    </div>
</div>
    );
};

export default ViewUserModal;