import { Route } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import User from "../pages/admin/User";
import Attendance from "../pages/Hrms/Attendance";

const AdminRoutes = () => (
  <Route path="/admin" element={<DashboardLayout />}>
    <Route path="User" element={<User />}>
    <Route path="Attendance" element={<Attendance />}></Route>
    </Route>
    <Route index element={<AdminDashboard />} />
    
  </Route>
);

export default AdminRoutes;
