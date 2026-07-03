import React from "react";
import { X } from "lucide-react";

const ViewUserModal = ({
    isOpen,
    displayUser,
    setViewModalOpen,
    selectedManagerData,
}) => {
    if (!isOpen || !displayUser) return null;

    return (
        // <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

        //   <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl bg-white">

        //     {/* Header */}
        //     <div className="p-5 border-b flex justify-between items-center bg-[#F9F5FF]">
        //       <h2 className="text-xl font-bold text-[#101828]">
        //         User Details
        //       </h2>

        //       <button
        //         type="button"
        //         onClick={() => setViewModalOpen(false)}
        //         className="text-gray-400 hover:text-gray-600"
        //       >
        //         <X size={24} />
        //       </button>
        //     </div>

        //     <div className="p-6">

        //       {/* Profile */}
        //       <div className="flex items-center gap-4 mb-6">

        //         <div className="w-20 h-20 rounded-full border-2 border-gray-200 overflow-hidden">
        //           <img
        //             src={`https://test.pearl-developer.com/Inbay_Innovations/public/${displayUser.profile_image}`}
        //             alt="profile"
        //             className="w-full h-full object-cover"
        //             onError={(e) => {
        //               e.target.src = "https://via.placeholder.com/150";
        //             }}
        //           />
        //         </div>

        //         <div>
        //           <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight">
        //             {displayUser.name}
        //           </h3>
        //           <p className="text-sm text-gray-500 font-medium">
        //             {displayUser.email}
        //           </p>
        //         </div>

        //       </div>

        //       <hr className="border-gray-200 mb-6" />

        //       {/* Details */}
        //       <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-8">

        //         <div>
        //           <p className="text-[#667085] text-sm mb-1">User ID</p>
        //           <p className="font-bold text-[#101828] text-lg">
        //             {displayUser.id}
        //           </p>
        //         </div>

        //         <div>
        //           <p className="text-[#667085] text-sm mb-1">Manager ID</p>
        //           <p className="font-bold text-[#101828] text-lg">
        //             {selectedManagerData?.manager_id || "N/A"}
        //           </p>
        //         </div>

        //         <div>
        //           <p className="text-[#667085] text-sm mb-1">Role</p>
        //           <p className="font-bold text-[#101828] text-lg">
        //             {displayUser.role}
        //           </p>
        //         </div>

        //         <div>
        //           <p className="text-[#667085] text-sm mb-1">Status</p>
        //           <span
        //             className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
        //               displayUser.is_active
        //                 ? "bg-[#ECFDF3] text-[#027A48]"
        //                 : "bg-[#FEF3F2] text-[#B42318]"
        //             }`}
        //           >
        //             {displayUser.is_active ? "Active" : "Inactive"}
        //           </span>
        //         </div>

        //         <div>
        //           <p className="text-[#667085] text-sm mb-1">Rate</p>
        //           <p className="font-bold text-[#101828] text-lg">
        //             ₹{displayUser.per_km_rate}
        //           </p>
        //         </div>

        //         <div>
        //           <p className="text-[#667085] text-sm mb-1">Designation</p>
        //           <p className="font-bold text-[#101828] text-lg">
        //             {displayUser.designation || "N/A"}
        //           </p>
        //         </div>

        //         <div>
        //           <p className="text-[#667085] text-sm mb-1">Team</p>
        //           <p className="font-bold text-[#101828] text-lg">
        //             {displayUser.team || "N/A"}
        //           </p>
        //         </div>

        //         <div>
        //           <p className="text-[#667085] text-sm mb-1">State</p>
        //           <p className="font-bold text-[#101828] text-lg">
        //             {displayUser.state || "N/A"}
        //           </p>
        //         </div>

        //         <div>
        //           <p className="text-[#667085] text-sm mb-1">Created At</p>
        //           <p className="font-bold text-[#475467] text-sm">
        //             {displayUser.created_at}
        //           </p>
        //         </div>

        //         <div>
        //           <p className="text-[#667085] text-sm mb-1">Updated At</p>
        //           <p className="font-bold text-[#475467] text-sm">
        //             {displayUser.updated_at}
        //           </p>
        //         </div>

        //       </div>

        //       {/* Button */}
        //       <button
        //         type="button"
        //         onClick={() => setViewModalOpen(false)}
        //         className="w-full py-4 rounded-xl bg-[#9333ea] text-white font-bold text-lg hover:bg-[#7e22ce] transition-colors shadow-lg"
        //       >
        //         Close
        //       </button>

        //     </div>

        //   </div>
        // </div>

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 backdrop-blur-md p-4 animate-fadeIn">
            <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl bg-white border border-slate-100">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900">User Dossier</h2>
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
                    {/* Profile Header Card */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6">
                        <div className="w-16 h-16 rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm bg-white shrink-0">
                            <img
                                src={`https://test.pearl-developer.com/Inbay_Innovations/public/${displayUser.profile_image}`}
                                alt="profile"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/150";
                                }}
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h3 className="text-base font-bold text-slate-900 truncate">
                                {displayUser.name}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                                {displayUser.email}
                            </p>
                            <div className="mt-2">
                                <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${displayUser.is_active
                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/40"
                                            : "bg-rose-50 text-rose-700 border border-rose-200/40"
                                        }`}
                                >
                                    {displayUser.is_active ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Structured Details Matrix */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-6 text-sm">
                        <div className="p-3 rounded-xl border border-slate-100 bg-white shadow-sm/5">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">User ID</p>
                            <p className="font-semibold text-slate-800 mt-1">{displayUser.id}</p>
                        </div>

                        <div className="p-3 rounded-xl border border-slate-100 bg-white shadow-sm/5">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Manager ID</p>
                            <p className="font-semibold text-slate-800 mt-1">{selectedManagerData?.manager_id || "—"}</p>
                        </div>

                        <div className="p-3 rounded-xl border border-slate-100 bg-white shadow-sm/5">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role</p>
                            <p className="font-semibold text-slate-800 mt-1">{displayUser.role}</p>
                        </div>

                        <div className="p-3 rounded-xl border border-slate-100 bg-white shadow-sm/5">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Designation</p>
                            <p className="font-semibold text-slate-800 mt-1 truncate">{displayUser.designation || "—"}</p>
                        </div>

                        <div className="p-3 rounded-xl border border-slate-100 bg-white shadow-sm/5">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Team</p>
                            <p className="font-semibold text-slate-800 mt-1 truncate">{displayUser.team || "—"}</p>
                        </div>

                        <div className="p-3 rounded-xl border border-slate-100 bg-white shadow-sm/5">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">State</p>
                            <p className="font-semibold text-slate-800 mt-1 truncate">{displayUser.state || "—"}</p>
                        </div>

                        {/* Full-width Rate Callout Row */}
                        <div className="col-span-2 p-3.5 rounded-xl border border-purple-100 bg-purple-50/40 flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">Allowance Rate</p>
                                <p className="text-xs text-slate-400 mt-0.5">Calculated per kilometer</p>
                            </div>
                            <p className="text-lg font-bold text-purple-700">
                                ₹{displayUser.per_km_rate}<span className="text-xs font-normal text-purple-400 ml-0.5">/km</span>
                            </p>
                        </div>
                    </div>

                    {/* Metadata Timestamps */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400 mb-6">
                        <div>
                            <p className="font-medium text-slate-400">Created At</p>
                            <p className="text-slate-600 mt-0.5">{displayUser.created_at}</p>
                        </div>
                        <div>
                            <p className="font-medium text-slate-400">Updated At</p>
                            <p className="text-slate-600 mt-0.5">{displayUser.updated_at}</p>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        type="button"
                        onClick={() => setViewModalOpen(false)}
                        className="w-full py-3 rounded-xl bg-purple-600 text-white font-semibold text-sm hover:bg-purple-700 active:scale-[0.98] transition-all shadow-sm shadow-purple-200"
                    >
                        Dismiss
                    </button>

                </div>
            </div>
        </div>
    );
};

export default ViewUserModal;