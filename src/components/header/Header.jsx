import { useState } from "react";
import { FaBell, FaSearch, FaChevronDown } from "react-icons/fa";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      
      {/* Left - Search */}
      <div className="flex items-center gap-3 w-[320px]">
        <div className="relative w-full">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search users, posts, restaurants..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">
        
        {/* Notifications */}
        <button className="relative">
          <FaBell className="text-gray-600 text-lg" />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 focus:outline-none"
          >
            <img
              src="https://i.pravatar.cc/40"
              alt="admin"
              className="h-9 w-9 rounded-full border-2 border-purple-500"
            />
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-700">
                Admin
              </p>
              <p className="text-xs text-gray-400">Super Admin</p>
            </div>
            <FaChevronDown className="text-gray-400 text-sm" />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-3 w-44 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <button className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100">
                Profile
              </button>
              <button className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100">
                Settings
              </button>
              <hr />
              <button className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}