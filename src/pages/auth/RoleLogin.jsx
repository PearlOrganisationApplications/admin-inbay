import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUserShield } from "react-icons/fa";

const roles = [
  { label: "Admin", value: "admin" },
  { label: "Super Admin", value: "super-admin" },
  { label: "Sub Admin", value: "sub-admin" },
];

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");

  const handleLogin = (e) => {
    e.preventDefault();

    // 🔥 Abhi dummy login (later API / JWT)
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    navigate(`/${role}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      
      {/* Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 text-white">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-purple-600 flex items-center justify-center">
            <FaUserShield className="text-2xl" />
          </div>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-sm text-white/70">
            Login to your dashboard
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex bg-white/10 rounded-xl p-1 mb-6">
          {roles.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRole(r.value)}
              className={`flex-1 py-2 text-sm rounded-lg transition-all
                ${
                  role === r.value
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-white/70 hover:bg-white/10"
                }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Email */}
          <div>
            <label className="text-sm text-white/70">Email</label>
            <div className="relative mt-1">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
              <input
                type="email"
                placeholder="admin@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-white/70">Password</label>
            <div className="relative mt-1">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition font-semibold shadow-lg"
          >
            Login as {roles.find(r => r.value === role).label}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-white/50 mt-6">
          © 2026 Admin Dashboard
        </p>
      </div>
    </div>
  );
};

export default Login;
