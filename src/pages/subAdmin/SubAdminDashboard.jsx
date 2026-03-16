const SubAdminDashboard = () => {
  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Sub Admin Dashboard
        </h1>
        <p className="text-sm text-slate-500">
          Manage your assigned tasks and overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm text-slate-500">Assigned Tasks</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">18</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm text-slate-500">Completed</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">12</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm text-slate-500">Pending</h3>
          <p className="text-3xl font-bold text-orange-500 mt-2">6</p>
        </div>

      </div>

      {/* Task Table */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Recent Tasks
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b">
                <th className="py-3">Task</th>
                <th>Status</th>
                <th>Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-3">Verify User Profiles</td>
                <td className="text-orange-500 font-medium">Pending</td>
                <td>12 Feb 2026</td>
              </tr>
              <tr>
                <td className="py-3">Approve Documents</td>
                <td className="text-green-600 font-medium">Completed</td>
                <td>10 Feb 2026</td>
              </tr>
              <tr>
                <td className="py-3">Review Reports</td>
                <td className="text-orange-500 font-medium">Pending</td>
                <td>15 Feb 2026</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default SubAdminDashboard;
