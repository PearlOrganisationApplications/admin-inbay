import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      {/* 
          - ml-0: No margin on mobile (so content fills screen)
          - md:ml-64: Adds 16rem (256px) margin on desktop to push content past the fixed sidebar
      */}
      <div className="flex-1 ml-0 md:ml-64 transition-all duration-300">
        <Header />

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;