import React, { useEffect, useRef, useState } from "react";
import { Bell, BellOff, Clock, X, CheckCheck } from "lucide-react";

// Notification type
export interface Notification {
  id: number;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  user: number;
}

interface NotificationBellProps {
  notifications?: Notification[];
  unreadCount?: number;
  show: boolean;
  onToggle: () => void;
  onClose: () => void;
  onRead: (id: string | number) => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  notifications = [],
  unreadCount = 0,
  show,
  onToggle,
  onClose,
  onRead,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  // Convert timestamp to time ago
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    const days = Math.floor(seconds / 86400);
    if (days > 0) return `${days} day(s) ago`;

    const hours = Math.floor(seconds / 3600);
    if (hours > 0) return `${hours} hour(s) ago`;

    const minutes = Math.floor(seconds / 60);
    return `${minutes} min(s) ago`;
  };

  const handleViewAll = () => {
    setShowModal(true);
    onClose();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFilter("all");
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.is_read;
    if (filter === "read") return n.is_read;
    return true;
  });

  const readCount = notifications.filter((n) => n.is_read).length;

  return (
    <>
      <div className="relative inline-block">
        {/* 🔔 Bell Button */}
        <button
          onClick={onToggle}
          className={`relative p-2.5 rounded-xl transition-all duration-200 group ${
            show
              ? "bg-gray-100 text-gray-900"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          }`}
        >
          <Bell
            className={`w-5 h-5 transition-transform duration-200 ${
              show ? "scale-110" : "group-hover:rotate-12"
            }`}
          />

          {/* 🔴 Red Badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1.5 flex items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-white text-[11px] font-bold shadow-lg shadow-red-500/30 ring-2 ring-white transition-transform group-hover:scale-110">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown */}
        {show && (
          <div
            ref={dropdownRef}
            className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 z-50 overflow-hidden ring-1 ring-black ring-opacity-5 animate-in fade-in zoom-in-95 duration-200 origin-top-right"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between bg-white/50 backdrop-blur-sm">
              <h3 className="font-bold text-gray-900 text-base">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[11px] font-bold rounded-full uppercase tracking-wider">
                  {unreadCount} New
                </span>
              )}
            </div>

            {/* Content */}
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                    <BellOff className="w-6 h-6 text-gray-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">All caught up!</p>
                  <p className="text-xs text-gray-500 mt-1">No new notifications at the moment.</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {notifications.map((notif) => (
                    <li
                      key={notif.id}
                      onClick={() => onRead(notif.id)}
                      className={`group relative px-5 py-4 cursor-pointer transition-colors ${
                        !notif.is_read
                          ? "bg-red-50/40 hover:bg-red-50"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Unread indicator dot */}
                        {!notif.is_read && (
                          <div className="mt-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                        )}

                        <div className="flex-1">
                          <p
                            className={`text-sm leading-relaxed ${
                              !notif.is_read ? "font-semibold text-gray-900" : "text-gray-600"
                            }`}
                          >
                            {notif.message}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1 uppercase font-medium tracking-tight">
                            <Clock className="w-3 h-3" />
                            {timeAgo(notif.created_at)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <button
                onClick={handleViewAll}
                className="w-full py-3 text-center text-xs font-semibold text-gray-500 border-t border-gray-50 hover:text-red-600 hover:bg-gray-50 transition-colors"
              >
                View all notifications
              </button>
            )}
          </div>
        )}
      </div>

      {/* ====== ALL NOTIFICATIONS MODAL ====== */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal();
          }}
        >
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-100">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">All Notifications</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {notifications.length} total · {unreadCount} unread · {readCount} read
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 mt-4 bg-gray-50 rounded-xl p-1">
                {(["all", "unread", "read"] as const).map((tab) => {
                  const tabCounts = {
                    all: notifications.length,
                    unread: unreadCount,
                    read: readCount,
                  };
                  return (
                    <button
                      key={tab}
                      onClick={() => setFilter(tab)}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold capitalize transition-all duration-150 ${
                        filter === tab
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab}
                      <span
                        className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                          filter === tab
                            ? tab === "unread"
                              ? "bg-red-100 text-red-600"
                              : "bg-gray-100 text-gray-600"
                            : "bg-transparent text-gray-400"
                        }`}
                      >
                        {tabCounts[tab]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <CheckCheck className="w-7 h-7 text-gray-300" />
                  </div>
                  <p className="text-sm font-semibold text-gray-800">Nothing here</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {filter === "unread"
                      ? "You've read all your notifications."
                      : filter === "read"
                      ? "No read notifications yet."
                      : "No notifications to show."}
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {filteredNotifications.map((notif) => (
                    <li
                      key={notif.id}
                      onClick={() => onRead(notif.id)}
                      className={`group relative px-6 py-4 cursor-pointer transition-colors ${
                        !notif.is_read
                          ? "bg-red-50/40 hover:bg-red-50/70"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex gap-3 items-start">
                        {/* ✅ FIXED: dot is red+pulsing for UNREAD, gray for READ */}
                        <div className="mt-1.5 shrink-0">
                          {!notif.is_read ? (
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                          ) : (
                            <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm leading-relaxed ${
                              !notif.is_read
                                ? "font-semibold text-gray-900"
                                : "font-normal text-gray-500"
                            }`}
                          >
                            {notif.message}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1 font-medium tracking-tight uppercase">
                            <Clock className="w-3 h-3" />
                            {timeAgo(notif.created_at)}
                          </p>
                        </div>

                        {/* Mark as read label — only on unread */}
                        {!notif.is_read && (
                          <span className="shrink-0 text-[10px] font-semibold text-red-400 group-hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 mt-0.5">
                            Mark read
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between bg-gray-50/50">
              <p className="text-xs text-gray-400">
                Showing {filteredNotifications.length} of {notifications.length}
              </p>
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationBell;