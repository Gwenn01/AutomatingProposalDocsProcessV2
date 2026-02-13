import React, { useState } from "react";
import {
  Upload,
  Eye,
  Home,
  FileCheck,
  Users,
  Files,
  UserCheck,
  ClipboardList,
  LogOut,
} from "lucide-react";
import { prmsuLogo } from "../assets";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import { useToast } from "../context/ToastContext";

const Sidebar = ({ active, setActive, isOpen, toggleSidebar, role, user }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuByRole = {
    implementor: [
      { label: "View Proposal", icon: Eye },
      { label: "Create Proposal", icon: Upload },
      { label: "Profile Overview", icon: Eye },
    ],
    reviewer: [
      { label: "Review Proposal", icon: FileCheck },
      { label: "Profile Overview", icon: Eye },
    ],
    admin: [
      { label: "Overview", icon: Home },
      { label: "Assign to Review", icon: UserCheck },
      { label: "Manage Account", icon: Users },
      { label: "Manage Documents", icon: Files },
    ],
  };

  const menuItems = menuByRole[role] || [];

const handleLogout = () => {
  logout();
  showToast("Logging Out Successfully!", "success")
  setTimeout(() => {
    navigate("/auth", { replace: true });
  }, 1000); 
};


  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full z-40 w-72
        bg-gradient-to-b from-[#0a8f3c] to-[#056b2b]
        shadow-2xl transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 flex flex-col`}
      >
        {/* Brand */}
        <div className="relative p-6 flex items-center gap-4 overflow-hidden border-b-[1px] border-gray-300">
          {/* Wavy Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-800 via-green-700 to-green-900 opacity-90 " />

          {/* Wave Overlay */}
          <svg
            className="absolute bottom-0 left-0 w-full h-16"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="rgba(255,255,255,0.15)"
              d="M0,192L60,170.7C120,149,240,107,360,112C480,117,600,171,720,186.7C840,203,960,181,1080,160C1200,139,1320,117,1380,106.7L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
            />
          </svg>

          {/* Content */}
          <div className="relative z-10 flex items-center gap-4">
            <div className="bg-white p-1 rounded-full w-16 h-16 shadow-lg ring-2 ring-white/40">
              <img
                src={prmsuLogo}
                alt="logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>

            <div>
              <h1 className="text-white font-bold text-sm tracking-wide">
                Extension Office
              </h1>
              <p className="text-white/80 text-xs capitalize">
                {role} Panel
              </p>
            </div>
          </div>
        </div>


        {/* Menu */}
        <ul className="flex-1 px-4 mt-8 space-y-3">
          {menuItems.map(({ label, icon: Icon }) => (
            <li
              key={label}
              onClick={() => {
                setActive(label);
                toggleSidebar?.();
              }}
              className={`group relative flex items-center gap-4 px-6 py-3 rounded-xl cursor-pointer
                transition-all duration-300 overflow-hidden
                ${
                  active === label
                    ? "bg-white text-green-700 shadow-lg"
                    : "text-white/80 hover:bg-white/10"
                }`}
            >
              {/* Active Indicator */}
              {active === label && (
                <span className="absolute left-0 top-0 h-full w-1 bg-green-500 rounded-r" />
              )}

              <Icon
                className={`w-5 h-5 transition-transform duration-300 
                group-hover:scale-110`}
              />
              <span className="text-sm font-semibold tracking-wide">
                {label}
              </span>
            </li>
          ))}
        </ul>

        {/* Logout */}
        {/* User Info + Logout */}
        <div className="px-4 pb-6 space-y-4">

          {/* User Profile Card */}
          {user && (
            <div className="flex items-center space-x-3 bg-white p-2 rounded-full shadow-sm border border-gray-200">
              <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullname}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-blue-600 font-bold">
                    {user.fullname?.charAt(0) || "U"}
                  </div>
                )}
              </div>

              <div className="pr-2 min-w-0">
                <div className="font-semibold text-gray-700 text-sm truncate">
                  {user.fullname}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {user.role}
                </div>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center justify-center gap-4 px-6 py-3 rounded-xl
            text-white/90 hover:bg-white hover:text-primaryGreen transition-all duration-300
            hover:translate-x-1"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-xs font-semibold">Logout</span>
          </button>
        </div>

      </div>

      {/* ================= LOGOUT MODAL ================= */}
      {showLogoutModal && (
  <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-md">
    <div
      className="
        relative w-[380px] rounded-2xl bg-white p-8
        shadow-[0_20px_50px_rgba(0,0,0,0.25)]
        ring-1 ring-black/5
        animate-[scaleIn_0.35s_ease-out]
      "
    >
      {/* Icon */}
      <div className="mb-5 flex justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <LogOut className="h-7 w-7 text-red-500" />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-center text-xl font-semibold text-gray-900">
        Confirm Logout
      </h2>

      {/* Description */}
      <p className="mt-2 text-center text-sm text-gray-500">
        You will be signed out of your account. This action cannot be undone.
      </p>

      {/* Actions */}
      <div className="mt-8 flex gap-3">
        <button
          onClick={() => setShowLogoutModal(false)}
          className="
            flex-1 rounded-xl border border-gray-200
            px-4 py-2.5 text-sm font-medium text-gray-700
            hover:bg-gray-100 transition
          "
        >
          Cancel
        </button>

        <button
          onClick={handleLogout}
          className="
            flex-1 rounded-xl
            bg-gradient-to-r from-red-500 to-red-600
            px-4 py-2.5 text-sm font-medium text-white
            hover:from-red-600 hover:to-red-700
            shadow-lg shadow-red-500/30
            transition
          "
        >
          Logout
        </button>
      </div>
    </div>
  </div>
      )}

      {/* Modal Animation */}
      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
