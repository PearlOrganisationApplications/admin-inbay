// import { useEffect, useState } from "react";
// import { FaUsers, FaCheckCircle, FaClock, FaUserTimes } from "react-icons/fa";

// export default function Dashboard() {
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     const fetchAttendance = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         const res = await fetch(
//           "https://test.pearl-developer.com/Inbay_Innovations/public/api/attendance-report",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           },
//         );

//         const result = await res.json();
//         console.log("result", result)

//         if (result.success) {
//           setData(result);
//         }
//       } catch (error) {
//         console.error("Attendance API error:", error);
//       }
//     };

//     fetchAttendance();
//   }, []);

//   const stats = [
//     {
//       title: "Total Users",
//       value: data?.total_users || 0,
//       icon: FaUsers,
//     },
//     {
//       title: "Present",
//       value: data?.present_count || 0,
//       icon: FaCheckCircle,
//     },
//     {
//       title: "Late",
//       value: data?.late_count || 0,
//       icon: FaClock,
//     },
//     {
//       title: "Absent",
//       value: data?.absent_count || 0,
//       icon: FaUserTimes,
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Page Title */}
//       <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((item, index) => {
//           const Icon = item.icon;
//           return (
//             <div
//               key={index}
//               className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between hover:shadow-md transition"
//             >
//               <div>
//                 <p className="text-sm text-gray-400">{item.title}</p>
//                 <h2 className="text-2xl font-bold text-gray-800">
//                   {item.value}
//                 </h2>
//               </div>

//               <div className="h-12 w-12 flex items-center justify-center rounded-full bg-purple-100 text-purple-600">
//                 <Icon className="text-xl" />
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Bottom Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Present Users */}
//         <div className="bg-white rounded-xl shadow-sm p-6">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">
//             Present Users
//           </h2>

//           <ul className="space-y-4">
//             {data?.present_users?.map((user, i) => (
//               <li key={i} className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium">{user.name}</p>
//                   <p className="text-xs text-gray-400">
//                     Check In: {user.check_in_time}
//                   </p>
//                 </div>

//                 <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
//                   Present
//                 </span>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Late & Absent Users */}
//         <div className="bg-white rounded-xl shadow-sm p-6">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">
//             Late / Absent Users
//           </h2>

//           <ul className="space-y-4">
//             {data?.late_users?.map((user, i) => (
//               <li
//                 key={`late-${i}`}
//                 className="flex items-center justify-between"
//               >
//                 <div>
//                   <p className="text-sm font-medium">{user.name}</p>
//                   <p className="text-xs text-gray-400">
//                     Check In: {user.check_in_time}
//                   </p>
//                 </div>

//                 <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
//                   Late
//                 </span>
//               </li>
//             ))}

//             {data?.absent_users?.map((name, i) => (
//               <li
//                 key={`absent-${i}`}
//                 className="flex items-center justify-between"
//               >
//                 <p className="text-sm font-medium">{name}</p>

//                 <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
//                   Absent
//                 </span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { FaUsers, FaCheckCircle, FaClock, FaUserTimes } from "react-icons/fa";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "https://test.pearl-developer.com/Inbay_Innovations/public/api/admin/attendance-report",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await res.json();
        console.log("result", result);
        console.log(token)

        if (result) {
          setData(result);
        }
      } catch (error) {
        console.error("Attendance API error:", error);
      }
    };

    fetchAttendance();
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: data?.total_users || 0,
      icon: FaUsers,
    },
    {
      title: "Present",
      value: data?.present || 0,
      icon: FaCheckCircle,
    },
    {
      title: "Late",
      value: data?.late || 0,
      icon: FaClock,
    },
    {
      title: "Absent",
      value: data?.absent || 0,
      icon: FaUserTimes,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-800">Dashboard </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between hover:shadow-md transition"
            >
              <div>
                <p className="text-sm text-gray-400">{item.title}</p>
                <h2 className="text-2xl font-bold text-gray-800">
                  {item.value}
                </h2>
              </div>

              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <Icon className="text-xl" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Present Users */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Present Users
          </h2>

          <ul className="space-y-4">
            {data?.present_users?.length > 0 ? (
              data.present_users.map((user, i) => (
                <li key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-400">
                      Check In: {user.check_in_time}
                    </p>
                  </div>

                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                    Present
                  </span>
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-400">No Present Users</p>
            )}
          </ul>
        </div>

        {/* Late & Absent Users */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Late / Absent Users
          </h2>

          <ul className="space-y-4">
            {data?.late_users?.length > 0 &&
              data.late_users.map((user, i) => (
                <li
                  key={`late-${i}`}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-400">
                      Check In: {user.check_in_time}
                    </p>
                  </div>

                  <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
                    Late
                  </span>
                </li>
              ))}

            {data?.absent_users?.length > 0 &&
              data.absent_users.map((name, i) => (
                <li
                  key={`absent-${i}`}
                  className="flex items-center justify-between"
                >
                  <p className="text-sm font-medium">{name}</p>

                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                    Absent
                  </span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}