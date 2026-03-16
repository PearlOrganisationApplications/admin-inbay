import {
  FaHome,
  FaUsers,
  FaLayerGroup,
  FaStore,
  FaChartBar,
  FaUtensils,
  FaBook,
  FaComments,
  FaBell,
  FaCog,
} from "react-icons/fa";

import { ROLES } from "../../utils/roles";

export const menuConfig = {
  [ROLES.ADMIN]: [
    { name: "Dashboard", icon: FaHome, path: "/admin" },
    { name: "User", icon: FaUsers, path: "User" },
    { name: "Posts", icon: FaLayerGroup, path: "/admin/posts" },
    { name: "Settings", icon: FaCog, path: "/admin/settings" },
  ],

  [ROLES.SUPER_ADMIN]: [
    { name: "Dashboard", icon: FaHome, path: "/super-admin" },
    { name: "Business", icon: FaStore, path: "/super-admin/business" },
    { name: "Network", icon: FaChartBar, path: "/super-admin/network" },
    { name: "Notifications", icon: FaBell, path: "/super-admin/notifications" },
    { name: "Settings", icon: FaCog, path: "/super-admin/settings" },
  ],

  [ROLES.SUB_ADMIN]: [
    { name: "Dashboard", icon: FaHome, path: "/sub-admin" },
    { name: "Students", icon: FaUsers, path: "/sub-admin/students" },
    { name: "Communities", icon: FaLayerGroup, path: "/sub-admin/communities" },
    { name: "Restaurants", icon: FaUtensils, path: "/sub-admin/restaurants" },
    { name: "Bookings", icon: FaBook, path: "/sub-admin/bookings" },
    { name: "Chats", icon: FaComments, path: "/sub-admin/chats" },
  ],
};
