import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";

// Admin
import AdminDashboard from "../pages/admin/AdminDashboard";

// Super Admin
import SuperAdminDashboard from "../pages/superAdmin/SuperAdminDashboard";

// Sub Admin
import SubAdminDashboard from "../pages/subAdmin/SubAdminDashboard";

// Auth
import RoleLogin from "../pages/auth/RoleLogin";
import NotFound from "../pages/notFound/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Root */}
      <Route path="/" element={<RoleLogin />} />

      {/* Dashboard Layout */}
      <Route element={<DashboardLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/super-admin" element={<SuperAdminDashboard />} />
        <Route path="/sub-admin" element={<SubAdminDashboard />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
