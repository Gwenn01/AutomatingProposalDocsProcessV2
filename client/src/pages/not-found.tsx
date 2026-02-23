import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, SearchX } from "lucide-react";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50 px-4">

      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,0,0,0.08),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(255,100,0,0.08),transparent_40%)] animate-pulse" />

      {/* Floating Decorative Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      {/* Main Card */}
      <div className="relative backdrop-blur-xl bg-white/70 border border-white/40 shadow-2xl rounded-3xl max-w-2xl w-full p-10 md:p-14 text-center animate-fade-in">

        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500" />
            <div className="relative bg-gradient-to-br from-green-500 to-green-700 p-6 rounded-full shadow-xl">
              <SearchX className="w-16 h-16 md:w-20 md:h-20 text-white" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* 404 */}
        <h1 className="text-7xl md:text-8xl font-extrabold bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent tracking-tight">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-4 text-2xl md:text-3xl font-bold text-gray-800">
          Oops! Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-3 text-gray-600 max-w-md mx-auto leading-relaxed">
          The page you’re looking for might have been moved, deleted,
          or never existed.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">

          <button
            onClick={() => navigate(-1)}
            className="group flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-300 bg-white/70 backdrop-blur-md text-gray-700 font-semibold hover:bg-gray-100 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            Go Back
          </button>

          <button
            onClick={() => navigate("/", { replace: true })}
            className="group flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-400 to-green-500 text-white font-semibold shadow-lg hover:shadow-red-400/40 hover:scale-105 transition-all duration-300"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            Go Home
          </button>

        </div>

        {/* Small hint */}
        <p className="text-sm text-gray-500 mt-8">
          Try checking the URL or navigating from the homepage.
        </p>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        .animate-blob {
          animation: blob 10s infinite ease-in-out;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default NotFound;