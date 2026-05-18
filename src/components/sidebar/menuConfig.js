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
      name: "Manager",
      icon: FaUserTie,
      path: "/manager",
    },
    {
      name: "Add Client Type",
      icon: PlusCircle,
      path: "/add-client-type",
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