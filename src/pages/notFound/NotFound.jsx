import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      
      {/* Floating Glow */}
      <div className="absolute w-72 h-72 bg-purple-600/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-300" />

      {/* Card */}
      <div className="relative z-10 text-center px-8 py-10 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 max-w-md w-full">
        
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-purple-600 animate-bounce">
            <FaExclamationTriangle className="text-3xl text-white" />
          </div>
        </div>

        {/* Text */}
        <h1 className="text-6xl text-error font-extrabold tracking-wider mb-2">
          404
        </h1>
        <h2 className="text-xl font-semibold mb-2">
          Page Not Found
        </h2>
        <p className="text-sm text-white/70 mb-8">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition font-medium shadow-lg"
          >
            Go to Login
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full py-3 rounded-xl border border-white/30 hover:bg-white/10 transition font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
