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
        <div className="fixed  inset-0 z-[100] flex items-center justify-center bg-slate-950/40 backdrop-blur-md p-4 animate-fadeIn">
            <div className="w-full m-10 max-w-md rounded-3xl overflow-hidden shadow-2xl bg-white border border-slate-100">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
                    <div>
                        <h2 className="text-lg font-bold">
                            {selectedManagerData?.manager_name}
                        </h2>

                        <p className="text-sm text-gray-500">
                            Manager ID : {selectedManagerData?.manager_id}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setViewModalOpen(false)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6">
                    {/* Manager Info */}
                    <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                        <h2 className="text-lg font-bold text-slate-900">
                            {selectedManagerData?.manager_name || "Manager"}
                        </h2>

                        <div className="mt-2 flex gap-6 text-sm text-slate-600">
                            <p>
                                <span className="font-semibold">Manager ID :</span>{" "}
                                {selectedManagerData?.manager_id ?? "—"}
                            </p>

                            <p>
                                <span className="font-semibold">Assigned Users :</span>{" "}
                                {selectedManagerData?.assigned_users?.length || 0}
                            </p>
                        </div>
                    </div>

                    {/* Assigned Users */}
                    <div className="space-y-5 max-h-[500px] overflow-y-auto pr-2">

                        {selectedManagerData?.assigned_users?.length > 0 ? (

                            selectedManagerData.assigned_users.map((user) => (

                                <div
                                    key={user.id}
                                    className="border rounded-2xl p-4 bg-white shadow-sm"
                                >

                                    <div className="flex gap-4">

                                        <img
                                            src={
                                                user?.profile_image
                                                    ? `https://test.pearl-developer.com/Inbay_Innovations/public/${user.profile_image}`
                                                    : ""
                                            }
                                            alt={user.name}
                                            className="w-16 h-16 rounded-xl object-cover border"
                                            onError={(e) => {
                                                e.target.src = "https://via.placeholder.com/120";
                                            }}
                                        />

                                        <div className="flex-1">

                                            <h3 className="font-bold text-slate-900">
                                                {user.name}
                                            </h3>

                                            <p className="text-sm text-slate-500">
                                                {user.email}
                                            </p>

                                            <span
                                                className={`inline-block mt-2 px-2 py-1 rounded-md text-xs font-semibold ${Number(user.is_active) === 1
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {Number(user.is_active) === 1
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>

                                        </div>

                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mt-5 text-sm">

                                        <div>
                                            <p className="text-slate-400">User ID</p>
                                            <p className="font-semibold">{user.id}</p>
                                        </div>

                                        <div>
                                            <p className="text-slate-400">Role</p>
                                            <p className="font-semibold">
                                                {user.role || "—"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-slate-400">Designation</p>
                                            <p className="font-semibold">
                                                {user.designation || "—"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-slate-400">Team</p>
                                            <p className="font-semibold">
                                                {user.team || "—"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-slate-400">State</p>
                                            <p className="font-semibold">
                                                {user.state || "—"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-slate-400">Per KM Rate</p>
                                            <p className="font-semibold">
                                                ₹{user.per_km_rate || 0}/km
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-slate-400">Created</p>
                                            <p className="font-semibold">
                                                {user.created_at || "—"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-slate-400">Updated</p>
                                            <p className="font-semibold">
                                                {user.updated_at || "—"}
                                            </p>
                                        </div>

                                    </div>

                                </div>

                            ))

                        ) : (

                            <div className="text-center py-10 text-slate-500">
                                No assigned users found.
                            </div>

                        )}

                    </div>

                    <button
                        onClick={() => setViewModalOpen(false)}
                        className="w-full mt-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
                    >
                        Close
                    </button>

                </div>
            </div>
        </div>
    );
};

export default ViewUserModal;