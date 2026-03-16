import { Route } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import SubAdminDashboard from "../pages/superAdmin/SuperAdminDashboard";

const SubAdminRoutes = () => (
  <Route path="/sub-admin" element={<DashboardLayout />}>
    <Route index element={<SubAdminDashboard />} />
  </Route>
);

export default SubAdminRoutes;
