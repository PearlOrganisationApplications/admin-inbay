import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";

// Admin
import AdminDashboard from "../pages/admin/AdminDashboard";

// Auth
import RoleLogin from "../pages/auth/RoleLogin";
import NotFound from "../pages/notFound/NotFound";
import User from "../pages/admin/User";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Root */}
      <Route path="/" element={<RoleLogin />} />

      {/* Dashboard Layout */}
      <Route element={<DashboardLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="User" element={<User />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
