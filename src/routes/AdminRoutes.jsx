import { Route } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";

const AdminRoutes = () => (
  <Route path="/admin" element={<DashboardLayout />}>
    <Route index element={<AdminDashboard />} />
  </Route>
);

export default AdminRoutes;
