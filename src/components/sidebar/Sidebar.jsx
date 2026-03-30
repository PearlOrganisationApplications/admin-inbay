import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { menuConfig } from "./menuConfig";
import logo from "../../assets/logo.bmp";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // Mobile state

  const menuItems = menuConfig.admin;

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false); // Close sidebar on mobile after click
  };

  return (
    <>
      {/* --- MOBILE TOGGLE BUTTON --- */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden fixed top-4 left-4 z-[60] bg-purple-700 text-white p-2.5 rounded-lg shadow-lg hover:bg-purple-800 transition-all"
        >
          <FaBars size={20} />
        </button>
      )}

      {/* --- BACKDROP --- */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-purple-700 to-purple-500 text-white shadow-2xl z-50 transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* HEADER SECTION (Fixed Height) */}
        <div className="h-20 flex flex-col items-center justify-center border-b border-white/20 relative flex-shrink-0">
          {/* Close button for mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden absolute right-4 top-6 text-white/80 hover:text-white"
          >
            <FaTimes size={22} />
          </button>

          <img src={logo} alt="logo" className="h-10 w-auto object-contain" />
          <span className="text-[10px] font-bold tracking-[0.2em] opacity-70 mt-1 uppercase">
            Admin Panel
          </span>
        </div>

        {/* MENU SECTION (Scrollable) */}
        <nav className="flex-1 overflow-y-auto mt-4 px-3 space-y-2 custom-scrollbar">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            // 👉 HRMS (Dropdown Style)
            if (item.children) {
              const isChildActive = item.children.some(child => pathname === child.path);
              
              return (
                <div key={item.name} className="space-y-1">
                  <div
                    onClick={() => setOpenMenu(openMenu === index ? null : index)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all
                    ${isChildActive ? "bg-white/10" : "hover:bg-white/10"}`}
                  >
                    <div className="flex items-center gap-4">
                      <Icon className="text-lg" />
                      <span>{item.name}</span>
                    </div>
                    {/* Simple arrow indicator */}
                    <span className={`transition-transform duration-200 ${openMenu === index ? 'rotate-180' : ''}`}>
                      ▾
                    </span>
                  </div>

                  {openMenu === index && (
                    <div className="ml-6 space-y-1 animate-fadeIn">
                      {item.children.map((sub) => {
                        const SubIcon = sub.icon;
                        return (
                          <div
                            key={sub.name}
                            onClick={() => handleNavigation(sub.path)}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm cursor-pointer transition-all
                            ${
                              pathname === sub.path
                                ? "bg-white text-purple-700 font-bold shadow-sm"
                                : "hover:bg-white/20"
                            }`}
                          >
                            {SubIcon && <SubIcon className="text-sm" />}
                            <span>{sub.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // 👉 Normal Item
            return (
              <div
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all
                ${
                  isActive
                    ? "bg-white text-purple-700 shadow-lg font-bold scale-[1.02]"
                    : "hover:bg-white/10"
                }`}
              >
                <Icon className="text-lg" />
                <span>{item.name}</span>
              </div>
            );
          })}
        </nav>

        {/* Optional Footer (e.g., Logout) */}
        <div className="p-4 border-t border-white/10">
            <p className="text-[10px] text-center opacity-50">© 2024 Inbay Innovations</p>
        </div>
      </aside>

      {/* Added some CSS for a clean scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}