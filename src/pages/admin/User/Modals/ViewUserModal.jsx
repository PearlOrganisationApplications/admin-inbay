import React from "react";
import { X } from "lucide-react";

const ViewUserModal = ({
  isOpen,
  selectedUser,
  setIsViewModalOpen,
}) => {
  if (!isOpen || !selectedUser) return null;

  return (
    // <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm">
    //   <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
    //     {/* Header */}
    //     <div className="flex items-center justify-between px-6 py-4 border-b bg-purple-50">
    //       <h2 className="text-lg font-bold text-gray-800">User Details</h2>

    //       <button
    //         onClick={() => setIsViewModalOpen(false)}
    //         className="text-gray-400 hover:text-gray-600"
    //       >
    //         <X size={20} />
    //       </button>
    //     </div>

    //     {/* Body */}
    //     <div className="p-6 space-y-4 text-sm">
    //       <div className="flex items-center gap-4">
    //         <img
    //           src={selectedUser.profile_image}
    //           alt="profile"
    //           className="w-14 h-14 rounded-full border object-cover"
    //         />

    //         <div>
    //           <p className="font-bold text-gray-800">
    //             {selectedUser.name}
    //           </p>

    //           <p className="text-gray-500 text-xs">
    //             {selectedUser.email}
    //           </p>
    //         </div>
    //       </div>

    //       <div className="grid grid-cols-2 gap-4 pt-4 border-t">
    //         <div>
    //           <p className="text-gray-500 text-xs">User ID</p>
    //           <p className="font-semibold text-gray-800">
    //             {selectedUser.id}
    //           </p>
    //         </div>

    //         <div>
    //           <p className="text-gray-500 text-xs">Manager ID</p>
    //           <p className="font-semibold text-gray-800">
    //             {selectedUser.manager_id || "N/A"}
    //           </p>
    //         </div>

    //         <div>
    //           <p className="text-gray-500 text-xs">Role</p>
    //           <p className="font-semibold text-gray-800">
    //             {selectedUser.role}
    //           </p>
    //         </div>

    //         <div>
    //           <p className="text-gray-500 text-xs">Status</p>

    //           <span
    //             className={`px-2 py-1 rounded-full text-xs font-bold ${
    //               selectedUser.is_active === 1
    //                 ? "bg-green-100 text-green-700"
    //                 : "bg-red-100 text-red-700"
    //             }`}
    //           >
    //             {selectedUser.is_active === 1
    //               ? "Active"
    //               : "Inactive"}
    //           </span>
    //         </div>

    //         <div>
    //           <p className="text-gray-500 text-xs">Rate</p>
    //           <p className="font-semibold text-gray-800">
    //             ₹{selectedUser.per_km_rate}
    //           </p>
    //         </div>

    //         <div>
    //           <p className="text-gray-500 text-xs">Designation</p>
    //           <p className="font-semibold text-gray-800">
    //             {selectedUser.designation || "N/A"}
    //           </p>
    //         </div>

    //         <div>
    //           <p className="text-gray-500 text-xs">Team</p>
    //           <p className="font-semibold text-gray-800">
    //             {selectedUser.team || "N/A"}
    //           </p>
    //         </div>

    //         <div>
    //           <p className="text-gray-500 text-xs">State</p>
    //           <p className="font-semibold text-gray-800">
    //             {selectedUser.state || "N/A"}
    //           </p>
    //         </div>

    //         <div>
    //           <p className="text-gray-500 text-xs">Created At</p>
    //           <p className="font-semibold text-gray-800">
    //             {new Date(selectedUser.created_at).toLocaleString()}
    //           </p>
    //         </div>

    //         <div>
    //           <p className="text-gray-500 text-xs">Updated At</p>
    //           <p className="font-semibold text-gray-800">
    //             {new Date(selectedUser.updated_at).toLocaleString()}
    //           </p>
    //         </div>
    //       </div>
    //     </div>

    //     {/* Footer */}
    //     <div className="px-6 py-4 border-t">
    //       <button
    //         onClick={() => setIsViewModalOpen(false)}
    //         className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition"
    //       >
    //         Close
    //       </button>
    //     </div>
    //   </div>
    // </div>

    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 animate-fadeIn">
  <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100/80 relative">
    
    {/* Decorative Top Accent */}
    <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500" />

    {/* Header */}
    <div className="flex items-center justify-between px-6 pt-6 pb-4">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">
          Management
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">User Dossier</h2>
      </div>
      <button
        onClick={() => setIsViewModalOpen(false)}
        className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 transition-all duration-200"
      >
        <X size={18} />
      </button>
    </div>

    {/* Body */}
    <div className="px-6 pb-6 space-y-6">
      
      {/* Premium Hero Card */}
      <div className="relative flex items-center gap-4 p-5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl text-white shadow-lg overflow-hidden">
        {/* Subtle background glow effect */}
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-500/20 rounded-full blur-xl" />
        
        <img
          src={selectedUser.profile_image}
          alt={selectedUser.name}
          className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/10 shadow-md bg-slate-700"
        />
        
        <div className="min-w-0 flex-1">
          <p className="font-bold text-lg leading-snug truncate">
            {selectedUser.name}
          </p>
          <p className="text-xs text-slate-300/90 truncate mt-0.5 font-light">
            {selectedUser.email}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[11px] bg-white/15 px-2 py-0.5 rounded-md backdrop-blur-sm text-slate-200">
              ID: {selectedUser.id}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                selectedUser.is_active === 1
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
              }`}
            >
              {selectedUser.is_active === 1 ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Info Grid */}
      <div className="space-y-4">
        {/* Row 1: Role & Designation */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Designation</p>
            <p className="font-semibold text-slate-800 mt-1 truncate">{selectedUser.designation || "—"}</p>
          </div>
          <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">System Role</p>
            <p className="font-semibold text-slate-800 mt-1 truncate">{selectedUser.role}</p>
          </div>
        </div>

        {/* Row 2: Team, State, Manager */}
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="text-center p-2.5 bg-slate-50/40 rounded-xl border border-slate-100/70">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Team</p>
            <p className="font-medium text-slate-700 mt-1 truncate">{selectedUser.team || "—"}</p>
          </div>
          <div className="text-center p-2.5 bg-slate-50/40 rounded-xl border border-slate-100/70">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">State</p>
            <p className="font-medium text-slate-700 mt-1 truncate">{selectedUser.state || "—"}</p>
          </div>
          <div className="text-center p-2.5 bg-slate-50/40 rounded-xl border border-slate-100/70">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Manager ID</p>
            <p className="font-medium text-slate-700 mt-1 truncate">{selectedUser.manager_id || "—"}</p>
          </div>
        </div>

        {/* Row 3: Highlighted Rate Callout */}
        <div className="flex items-center justify-between p-4 bg-indigo-50/40 rounded-xl border border-indigo-100/60">
          <div>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Reimbursement Rate</p>
            <p className="text-xs text-slate-500 mt-0.5">Per kilometer travel rate</p>
          </div>
          <div className="text-right">
            <span className="text-xl font-black text-indigo-600">₹{selectedUser.per_km_rate}</span>
            <span className="text-[11px] text-indigo-400 font-medium ml-1">/ km</span>
          </div>
        </div>
      </div>

      {/* Meta Timestamps */}
      <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400">
        <div>
          <span>Created: </span>
          <span className="font-medium text-slate-600">
            {new Date(selectedUser.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
          </span>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
        <div>
          <span>Updated: </span>
          <span className="font-medium text-slate-600">
            {new Date(selectedUser.updated_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
          </span>
        </div>
      </div>

    </div>

    {/* Footer */}
    <div className="px-6 py-4 bg-slate-50 flex gap-3 justify-end border-t border-slate-100">
      <button
        onClick={() => setIsViewModalOpen(false)}
        className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 active:scale-95 transition-all shadow-sm"
      >
        Done
      </button>
    </div>

  </div>
</div>
  );
};

export default ViewUserModal;