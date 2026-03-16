import {
  FaUsers,
  FaLayerGroup,
  FaUtensils,
  FaBook,
} from "react-icons/fa";

const stats = [
  {
    title: "Total Users",
    value: "12,450",
    icon: FaUsers,
  },
  {
    title: "Total Posts",
    value: "8,320",
    icon: FaLayerGroup,
  },
  {
    title: "Restaurants",
    value: "245",
    icon: FaUtensils,
  },
  {
    title: "Bookings",
    value: "1,120",
    icon: FaBook,
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-800">
        Dashboard
      </h1>

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
                <p className="text-sm text-gray-400">
                  {item.title}
                </p>
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

        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Users
          </h2>

          <ul className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <li
                key={i}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`https://i.pravatar.cc/40?img=${i}`}
                    className="h-10 w-10 rounded-full"
                    alt=""
                  />
                  <div>
                    <p className="text-sm font-medium">
                      User {i}
                    </p>
                    <p className="text-xs text-gray-400">
                      Joined today
                    </p>
                  </div>
                </div>
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                  Active
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Bookings
          </h2>

          <ul className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <li
                key={i}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium">
                    Restaurant {i}
                  </p>
                  <p className="text-xs text-gray-400">
                    Today • 7:00 PM
                  </p>
                </div>
                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                  Confirmed
                </span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}