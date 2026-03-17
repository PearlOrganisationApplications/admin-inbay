import React from "react";

const Attendance = () => {
  const data = [
    {
      date: "2026-03-17",
      day: "Monday",
      name: "John Doe",
      email: "john@test.com",
      group: "A",
      department: "Sales",
      attendance: "Present",
      scheduledStart: "09:00 AM",
      scheduledEnd: "06:00 PM",
      actualStart: "09:10 AM",
      actualEnd: "05:50 PM",
      totalHours: "8h 40m",
      location: "Office",
      endLocation: "Home",
      remarks: "-",
      distance: "12",
      morningRemark: "On Time",
      eveningRemark: "Left Early",
      morningOdo: "1200",
      eveningOdo: "1212",
      totalOdo: "12",
    },
  ];

  // ✅ Export CSV
  const handleExport = () => {
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((obj) => Object.values(obj).join(",")).join("\n");
    const csv = headers + "\n" + rows;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance.csv";
    a.click();
  };

  return (
    <div className="p-4 md:p-6 h-screen overflow-hidden flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Attendance</h2>

        <button
          onClick={handleExport}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700"
        >
          Export
        </button>
      </div>

      {/* TABLE WRAPPER */}
      <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden">
        {/* ✅ ONLY vertical scroll */}
        <div className="h-full overflow-y-auto">
          <table className="w-full table-fixed text-xs">
            {/* HEADER */}
            <thead className="bg-purple-600 text-white sticky top-0 z-10">
              <tr>
                {[
                  "Date",
                  "Day",
                  "Name",
                  "Email",
                  "Group",
                  "Department",
                  "Attendance",
                  "Scheduled Start",
                  "Scheduled End",
                  "Actual Start",
                  "Actual End",
                  "Total Hours",
                  "Location",
                  "End Location",
                  "Remarks",
                  "KM",
                  "Morning Remark",
                  "Evening Remark",
                  "Morning Odo",
                  "Evening Odo",
                  "Total Odo",
                ].map((head) => (
                  <th key={head} className="px-2 py-2 break-words">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b hover:bg-purple-50">
                  {Object.values(item).map((val, i) => (
                    <td key={i} className="px-2 py-2 break-words">
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
