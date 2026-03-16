import { Route } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import SuperAdminDashboard from "../pages/superAdmin/SuperAdminDashboard";

const SuperAdminRoutes = () => (
  <Route path="/super-admin" element={<DashboardLayout />}>
    <Route index element={<SuperAdminDashboard />} />
  </Route>
);

export default SuperAdminRoutes;
