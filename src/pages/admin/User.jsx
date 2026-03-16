import React, { useEffect, useState } from "react";
import { FaUserPlus } from "react-icons/fa";

const User = () => {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://test.pearl-developer.com/Inbay_Innovations/public/api/admin/get/user",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setUsers(data);

    } catch (error) {
      console.error("User API error:", error);
    }
  };

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <h1 className="text-2xl font-bold text-gray-800">
          Users
        </h1>

        <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
          <FaUserPlus />
          Add User
        </button>

      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100 text-left text-sm text-gray-600">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>

            {users.map((user) => (

              <tr
                key={user.id}
                className="border-t hover:bg-gray-50"
              >

                <td className="p-4 flex items-center gap-3">

                  <img
                    src={`https://i.pravatar.cc/40?img=${user.id}`}
                    className="h-10 w-10 rounded-full"
                    alt=""
                  />

                  <span className="font-medium">
                    {user.name}
                  </span>

                </td>

                <td className="p-4 text-gray-500">
                  {user.email}
                </td>

                <td className="p-4">
                  {user.role}
                </td>

                <td className="p-4">

                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      user.email_verified_at
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {user.email_verified_at ? "Active" : "Inactive"}
                  </span>

                </td>

                <td className="p-4 space-x-2">

                  <button className="text-sm text-blue-600 hover:underline">
                    View
                  </button>

                  <button className="text-sm text-purple-600 hover:underline">
                    Edit
                  </button>

                  <button className="text-sm text-red-500 hover:underline">
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Mobile Cards */}
      <div className="grid md:hidden gap-4">

        {users.map((user) => (

          <div
            key={user.id}
            className="bg-white rounded-xl shadow-sm p-4 space-y-3"
          >

            <div className="flex items-center gap-3">

              <img
                src={`https://i.pravatar.cc/40?img=${user.id}`}
                className="h-10 w-10 rounded-full"
                alt=""
              />

              <div>
                <p className="font-medium">
                  {user.name}
                </p>

                <p className="text-xs text-gray-400">
                  {user.email}
                </p>
              </div>

            </div>

            <div className="flex justify-between text-sm">

              <span>
                {user.role}
              </span>

              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  user.email_verified_at
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {user.email_verified_at ? "Active" : "Inactive"}
              </span>

            </div>

            <div className="flex gap-4 text-sm">

              <button className="text-blue-600">
                View
              </button>

              <button className="text-purple-600">
                Edit
              </button>

              <button className="text-red-500">
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default User;