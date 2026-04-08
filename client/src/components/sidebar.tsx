import React, { useState } from "react";
import {
  Upload,
  Eye,
  Home,
  FileCheck,
  Users,
  Files,
  UserCheck,
  LogOut,
  Book,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { extensionLogo } from "../assets";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import { useToast } from "@/context/toast";
import type { ActiveMenu } from "@/pages/Home";

type Role = string;

interface MenuItem {
  label: ActiveMenu;
  icon: LucideIcon;
  badge?: number;
}

interface User {
  fullname: string;
  role: string;
  avatar?: string;
}

interface SidebarProps {
  active: string;
  setActive: (label: ActiveMenu) => void;
  isOpen: boolean;
  toggleSidebar?: () => void;
  role: string;
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({
  active,
  setActive,
  isOpen,
  toggleSidebar,
  role,
  user,
}) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  const menuByRole: Record<Role, MenuItem[]> = {
    implementor: [
      { label: "View Proposal", icon: Eye },
      { label: "Create Proposal", icon: Upload },
      { label: "Drafts", icon: Book },
      { label: "Profile Overview", icon: Eye },
    ],
    reviewer: [
      { label: "Review Proposal", icon: FileCheck },
      { label: "Profile Overview", icon: Eye },
    ],
    admin: [
      { label: "Overview", icon: Home },
      { label: "Monitoring Proposal", icon: Eye },
      { label: "Review Documents", icon: Files },
      { label: "Assign to Review", icon: UserCheck },
      { label: "Create Cover Page", icon: FileCheck },
      { label: "Manage Account", icon: Users },
    ],
  };

  const menuItems = menuByRole[role] || [];

  const handleLogout = (): void => {
    logout();
    showToast("Logging Out Successfully!", "success");
    navigate("/auth", { replace: true });
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:static top-0 left-0 h-full z-40 w-[268px]
          flex flex-col
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
        style={{
          background: "linear-gradient(160deg, #0a8f3c 0%, #056b2b 60%, #044d1f 100%)",
        }}
      >
        {/* Decorative circles */}
        <div
          className="pointer-events-none absolute -top-14 -right-14 w-52 h-52 rounded-full"
          style={{ background: "rgba(255,255,255,0.05)" }}
        />
        <div
          className="pointer-events-none absolute bottom-16 -left-20 w-56 h-56 rounded-full"
          style={{ background: "rgba(255,255,255,0.04)" }}
        />

        {/* Brand */}
        <div
          className="relative z-10 flex items-center gap-3 px-5 py-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden bg-white"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
          >
            <img
              src={extensionLogo}
              alt="logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-white font-medium text-[13px] leading-snug">
              Extension Services Office
            </h1>
            <p
              className="text-[11px] mt-0.5 uppercase tracking-wider capitalize"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              {role} Panel
            </p>
          </div>
        </div>

        {/* Section Label */}
        <p
          className="relative z-10 px-5 pt-5 pb-2 text-[10px] font-medium uppercase tracking-widest"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          Main Menu
        </p>

        {/* Menu Items */}
        <ul className="relative z-10 flex-1 px-3 space-y-0.5 overflow-y-auto">
          {menuItems.map(({ label, icon: Icon, badge }) => {
            const isActive = active === label;
            return (
              <li
                key={label}
                onClick={() => {
                  setActive(label);
                  toggleSidebar?.();
                }}
                className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group"
                style={{
                  color: isActive ? "white" : "rgba(255,255,255,0.65)",
                  background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                  backdropFilter: isActive ? "blur(4px)" : undefined,
                  fontWeight: isActive ? 500 : 400,
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(255,255,255,0.08)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                {/* Active bar */}
                {isActive && (
                  <span
                    className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r-full"
                    style={{ background: "#5effa0" }}
                  />
                )}

                {/* Icon container */}
                <span
                  className="w-8 h-8 rounded-[9px] flex items-center justify-center flex-shrink-0 transition-all duration-200"
                  style={{
                    background: isActive
                      ? "rgba(94,255,160,0.18)"
                      : "rgba(255,255,255,0.08)",
                  }}
                >
                  <Icon className="w-[15px] h-[15px]" />
                </span>

                <span className="text-[13px] flex-1">{label}</span>

                {/* Optional badge */}
                {badge && (
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: "#5effa0", color: "#044d1f" }}
                  >
                    {badge}
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        {/* Divider */}
        <div
          className="relative z-10 mx-5 my-2"
          style={{ height: "1px", background: "rgba(255,255,255,0.08)" }}
        />

        {/* Bottom: User + Logout */}
        <div className="relative z-10 px-3 pb-4 space-y-2">
          {/* User Card */}
          {user && (
            <div
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-[14px] cursor-pointer transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <div
                className="w-[34px] h-[34px] rounded-full flex items-center justify-center flex-shrink-0 text-[13px] font-semibold overflow-hidden"
                style={{
                  background: "rgba(94,255,160,0.2)",
                  color: "#5effa0",
                }}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullname}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user.fullname?.charAt(0)?.toUpperCase() || "U"
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-[13px] font-medium truncate leading-none mb-0.5">
                  {user.fullname}
                </p>
                <p
                  className="text-[11px] capitalize"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {user.role}
                </p>
              </div>
              <ChevronRight
                className="w-3.5 h-3.5 flex-shrink-0"
                style={{ color: "rgba(255,255,255,0.35)" }}
              />
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-200"
            style={{
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "rgba(255,120,120,0.9)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(239,68,68,0.22)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(239,68,68,0.12)";
            }}
          >
            <LogOut className="w-[15px] h-[15px]" />
            <span>Sign out</span>
          </button>
        </div>
      </div>

      {/* ===== LOGOUT MODAL ===== */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
        >
          <div
            className="relative w-[360px] rounded-2xl bg-white p-8"
            style={{
              boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
              animation: "sidebarScaleIn 0.25s ease-out",
            }}
          >
            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: "#fef2f2" }}
              >
                <LogOut className="w-6 h-6 text-red-500" />
              </div>
            </div>

            <h2 className="text-center text-[18px] font-medium text-gray-900">
              Sign out?
            </h2>
            <p className="mt-2 text-center text-sm text-gray-500 leading-relaxed">
              You'll be signed out of your account and returned to the login screen.
            </p>

            <div className="mt-7 flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition"
                style={{
                  background: "linear-gradient(135deg, #ef4444, #dc2626)",
                  boxShadow: "0 4px 14px rgba(239,68,68,0.35)",
                }}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes sidebarScaleIn {
          from { opacity: 0; transform: scale(0.93) translateY(8px); }
          to   { opacity: 1; transform: scale(1)   translateY(0);    }
        }
      `}</style>
    </>
  );
};

export default Sidebar;