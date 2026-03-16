import { NavLink, useLocation } from "react-router-dom";
import { menuConfig } from "./menuConfig";
import { ROLES } from "../../utils/roles";

export default function Sidebar() {
  const { pathname } = useLocation();

  // 🔥 TEMP ROLE LOGIC (later JWT / API se aayega)
  const role = pathname.startsWith("/super-admin")
    ? ROLES.SUPER_ADMIN
    : pathname.startsWith("/sub-admin")
    ? ROLES.SUB_ADMIN
    : ROLES.ADMIN;

  const menuItems = menuConfig[role];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-purple-700 to-purple-500 text-white shadow-xl">
      
      {/* ROLE HEADER */}
      <div className="h-20 flex flex-col items-center justify-center border-b border-white/20">
        <h1 className="text-2xl font-bold capitalize">
          {role.replace("-", " ")}
        </h1>
        <span className="text-xs tracking-widest opacity-80">
          PANEL
        </span>
      </div>

      {/* MENU */}
      <nav className="mt-6 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
                ${
                  isActive
                    ? "bg-white text-purple-700 shadow-md"
                    : "hover:bg-white/20 text-white"
                }`
              }
            >
              <Icon className="text-lg" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
