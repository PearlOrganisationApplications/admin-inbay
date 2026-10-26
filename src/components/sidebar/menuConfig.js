import { PlusCircle, User } from "lucide-react";
import {
  FaHome,
  FaUsers,
  FaLayerGroup,
  FaCog,
  FaClipboardCheck,
  FaFileAlt,
  FaUserTie,
  FaMoneyBill,
  FaMapMarkerAlt,
  FaClipboardList,
} from "react-icons/fa";


export const menuConfig = {
  admin: [
    {
      name: "Dashboard",
      icon: FaHome,
      path: "/admin",
    },
    {
      name: "User",
      icon: FaUsers,
      path: "/user",
    },
    {
      name: "Customer",
      path: "/customer",
      icon: FaUserTie,
    },
    {
      name: "Manager",
      icon: FaUserTie,
      children: [
        {
          name: "All Manager",
          path: "/manager",
          icon: FaUsers,
        },
        {
          name: "Leave Management",
          path: "/leave-management",
          icon: FaClipboardCheck,
        },
        {
          name: "Today's Leave Overview",
          path: "/todays-leave-summary",
          icon: FaClipboardList,
        },
      ],
    },
    {
      name: "HRMS",
      icon: FaLayerGroup,
      children: [
        {
          name: "Attendance",
          path: "/attendance",
          icon: FaClipboardCheck,
        },
        {
          name: "Daily Report",
          path: "/Dailyreports",
          icon: FaFileAlt, // 📄 report icon
        },
        {
          name: "Visit",
          path: "/Visit",
          icon: FaMapMarkerAlt, // 📍 visit icon
        },
      ],
    },
    {
      name: "Expenses",
      icon: FaMoneyBill,
      path: "/expenses",
    },
    {
      name: "Assign User",
      icon: User,
      path: "/assign-user",
    },
    {
      name: "Settings",
      icon: FaCog,
      path: "/settings",
    },
  ],
};