import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { menuConfig } from "./menuConfig";

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(null);

  const menuItems = menuConfig.admin;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-purple-700 to-purple-500 text-white shadow-xl">
      {/* HEADER */}
      <div className="h-20 flex flex-col items-center justify-center border-b border-white/20">
        <h1 className="text-2xl font-bold">Admin</h1>
        <span className="text-xs tracking-widest opacity-80">PANEL</span>
      </div>

      {/* MENU */}
      <nav className="mt-6 px-3 space-y-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon;

          // 👉 HRMS (with dropdown)
          if (item.children) {
            return (
              <div key={item.name}>
                {/* Parent */}
                <div
                  onClick={() => setOpenMenu(openMenu === index ? null : index)}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer hover:bg-white/20"
                >
                  <Icon className="text-lg" />
                  <span>{item.name}</span>
                </div>

                {/* Dropdown */}
                {openMenu === index && (
                  <div className="ml-10 mt-1 space-y-1">
                    {item.children.map((sub) => {
                      const SubIcon = sub.icon; // 👈 important

                      return (
                        <div
                          key={sub.name}
                          onClick={() => navigate(sub.path)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer transition
                            ${
                              pathname.includes(sub.path)
                                ? "bg-white text-purple-700"
                                : "hover:bg-white/20"
                            }`}
                        >
                          {SubIcon && <SubIcon className="text-sm" />}{" "}
                          {/* 👈 icon */}
                          <span>{sub.name}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // 👉 Normal menu
          return (
            <div
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition
                ${
                  pathname.includes(item.path)
                    ? "bg-white text-purple-700 shadow-md"
                    : "hover:bg-white/20"
                }`}
            >
              <Icon className="text-lg" />
              <span>{item.name}</span>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
