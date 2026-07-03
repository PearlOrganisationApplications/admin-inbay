import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";

// Admin
import AdminDashboard from "../pages/admin/AdminDashboard";

// Auth
import RoleLogin from "../pages/auth/RoleLogin";
import NotFound from "../pages/notFound/NotFound";
import User from "../pages/admin/User/User";
import Attendance from "../pages/Hrms/Attendance";
import Dailyreports from "../pages/Hrms/Dailyreports";
import Visit from "../pages/Hrms/Visit";
import Setting from "../pages/Setting/Setting";
import Manager from "../pages/admin/Manager/Manager";
import AssignUser from "../pages/assignuser/AssignUser";
import Expenses from "../pages/expenses/Expenses";
import AddClientType from "../pages/add-client-type/AddClientType";
import ImageViewer from "../components/ImageViewer";
import PrivacyPolicy from '../pages/PrivacyPolicy/PrivacyPolicy'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Root */}
      <Route path="/" element={<RoleLogin />} />

      {/* Dashboard Layout */}
      <Route element={<DashboardLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="User" element={<User />} />
        <Route path="Manager" element={<Manager />} />
        <Route path="add-client-type" element={<AddClientType />} />
        <Route path="assign-user" element={<AssignUser />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="Attendance" element={<Attendance />} />
        <Route path="Dailyreports" element={<Dailyreports />} />
        <Route path="Visit" element={<Visit />} />
        <Route path="settings" element={<Setting />} />
       

        <Route path="/image-viewer" element={<ImageViewer />} />
      </Route>
       <Route path="privacy-policy" element={<PrivacyPolicy />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
