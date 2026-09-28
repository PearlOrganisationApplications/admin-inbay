import React from "react";
import {
  X,
  User,
  Mail,
  Briefcase,
  Users,
  MapPin,
  IndianRupee,
  Shield,
  Calendar,
  BadgeCheck,
} from "lucide-react";

const ViewUserModal = ({
  isOpen,
  selectedUser,
  setIsViewModalOpen,
}) => {
  if (!isOpen || !selectedUser) return null;

  const Item = ({ icon, label, value }) => (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
      <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wide mb-2">
        {icon}
        {label}
      </div>

      <p className="text-gray-800 font-semibold break-words">
        {value || "N/A"}
      </p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3.5 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">
            User Details
          </h2>

          <button
            onClick={() => setIsViewModalOpen(false)}
            className="text-white hover:bg-white/20 rounded-lg p-1.5 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Profile */}
        <div className="px-5 py-4 border-b">
          <div className="flex items-center gap-4">

            <img
              src={
                selectedUser.profile_image ||
                "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(selectedUser.name)
              }
              alt={selectedUser.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-purple-100"
            />

            <div className="flex-1">

              <h3 className="text-lg font-bold text-gray-800">
                {selectedUser.name}
              </h3>

              <p className="text-sm text-gray-500 truncate">
                {selectedUser.email}
              </p>

              <div className="flex gap-2 mt-2 flex-wrap">

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedUser.is_active === 1
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                    }`}
                >
                  {selectedUser.is_active === 1
                    ? "Active"
                    : "Inactive"}
                </span>

                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                  {selectedUser.role}
                </span>

              </div>

            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-4 grid grid-cols-2 gap-3">

          <Item
            icon={<BadgeCheck size={14} />}
            label="User ID"
            value={selectedUser.id}
          />

          <Item
            icon={<Shield size={14} />}
            label="Manager ID"
            value={selectedUser.manager_id}
          />

          <Item
            icon={<Briefcase size={14} />}
            label="Designation"
            value={selectedUser.designation}
          />

          <Item
            icon={<Users size={14} />}
            label="Team"
            value={selectedUser.team}
          />

          <Item
            icon={<MapPin size={14} />}
            label="State"
            value={selectedUser.state}
          />

          <Item
            icon={<IndianRupee size={14} />}
            label="Rate"
            value={`₹ ${selectedUser.per_km_rate}`}
          />

          <Item
            icon={<Calendar size={14} />}
            label="Created"
            value={new Date(selectedUser.created_at).toLocaleDateString()}
          />

          <Item
            icon={<Calendar size={14} />}
            label="Updated"
            value={new Date(selectedUser.updated_at).toLocaleDateString()}
          />

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t bg-gray-50 flex justify-end">

          <button
            onClick={() => setIsViewModalOpen(false)}
            className="px-5 py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default ViewUserModal;