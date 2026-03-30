import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaSearch, FaChevronDown } from "react-icons/fa";
import toast from "react-hot-toast";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://test.pearl-developer.com/Inbay_Innovations/public/api/admin-profile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        if (data.user) setUser(data.user);
      } catch (error) {
        console.error("Profile error:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://test.pearl-developer.com/Inbay_Innovations/public/api/admin-Logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success(data.message || "Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shadow-sm">
      
      {/* --- Left Side --- */}
      <div className="flex items-center gap-3 flex-1">
        {/* 
           This Spacer (ml-12) is only for Mobile. 
           It prevents the search bar from going under your Sidebar Toggle button.
        */}
        <div className="ml-12 md:ml-0 flex items-center w-full max-w-[320px]">
          <div className="relative w-full">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              // On very small screens, we hide the placeholder to save space
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-1.5 md:py-2 rounded-lg bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm transition-all"
            />
          </div>
        </div>
      </div>

      {/* --- Right Side --- */}
      <div className="flex items-center gap-3 md:gap-6">
        
        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
          <FaBell className="text-gray-600 text-lg" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Profile Dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 md:gap-3 focus:outline-none p-1 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <img
              src="https://i.pravatar.cc/40"
              alt="admin"
              className="h-8 w-8 md:h-9 md:w-9 rounded-full border-2 border-purple-500 object-cover"
            />

            {/* Hidden Name on Mobile */}
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-700 leading-none">
                {user?.name || "Admin"}
              </p>
              <p className="text-[10px] md:text-xs text-gray-400 mt-1 uppercase tracking-wider">
                {user?.role || "Admin"}
              </p>
            </div>

            <FaChevronDown className={`text-gray-400 text-[10px] transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */} 
          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="px-4 py-3 border-b border-gray-50 sm:hidden">
                <p className="text-sm font-bold text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
              
              <button className="w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-700 transition-colors">
                My Profile
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
              >
                Logout Account
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}