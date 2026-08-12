import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaUserShield } from "react-icons/fa";
import toast from "react-hot-toast";
import { adminLogin } from "../../API/adminAuth";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      // const response = await fetch(
      //   "https://test.pearl-developer.com/Inbay_Innovations/public/api/admin-login",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       email: email,
      //       password: password,
      //     }),
      //   }
      // );
      const response = await adminLogin({ email, password });
      const data = await response.data;

      if (data.success) {

        // token save
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        toast.success("Login Successful 🚀");

        setTimeout(() => {
          navigate("/admin");
        }, 800);

      } else {
        toast.error(data.message || "Login failed");
      }

    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 text-white">

        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-purple-600 flex items-center justify-center">
            <FaUserShield className="text-2xl" />
          </div>

          <h1 className="text-2xl font-bold">Welcome Back</h1>

          <p className="text-sm text-white/70">
            Login to your dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="text-sm text-white/70">Email</label>

            <form autoComplete="off">
              {/* Fake fields */}
              <input
                type="text"
                name="username"
                autoComplete="username"
                className="absolute opacity-0 w-0 h-0 pointer-events-none"
                tabIndex={-1}
              />

              <input
                type="password"
                name="password"
                autoComplete="current-password"
                className="absolute opacity-0 w-0 h-0 pointer-events-none"
                tabIndex={-1}
              />

              <div className="relative mt-1">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />

                <input
                  type="email"
                  name={`email_${Math.random()}`}
                  autoComplete="new-password"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </form>
          </div>

          <div>
            <label className="text-sm text-white/70">Password</label>

            <div className="relative mt-1">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition font-semibold shadow-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-center text-xs text-white/50 mt-6">
          © 2026 Admin Dashboard
        </p>

      </div>
    </div>
  );
};

export default Login;