import {
  FaHome,
  FaUsers,
  FaLayerGroup,
  FaCog,
  FaClipboardCheck,
  FaFileAlt,
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
      name: "Settings",
      icon: FaCog,
      path: "/settings",
    },
  ],
};