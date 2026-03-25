import { Route } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import User from "../pages/admin/User";
import Attendance from "../pages/Hrms/Attendance";
import Dailyreports from "../pages/Hrms/Dailyreports";
import Visit from "../pages/Hrms/Visit";
import Manager from "../pages/admin/Manager";

const AdminRoutes = () => (
  <Route path="/admin" element={<DashboardLayout />}>
    <Route path="User" element={<User />}>
      <Route path="manager" element={<Manager/>}/>
      <Route path="Attendance" element={<Attendance />}></Route>
      <Route path="Dailyrepots" element={<Dailyreports />}></Route>
      <Route path="Visit" element={<Visit />}></Route>
    </Route>
    <Route index element={<AdminDashboard />} />
  </Route>
);

export default AdminRoutes;
