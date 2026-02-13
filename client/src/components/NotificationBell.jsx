import { useEffect, useRef } from "react";
import { Bell, BellOff, Clock } from "lucide-react";

const NotificationBell = ({
  notifications = [],
  unreadCount = 0,
  show,
  onToggle,
  onClose,
  onRead,
}) => {
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const seconds = Math.floor((Date.now() - date) / 1000);

    const days = Math.floor(seconds / 86400);
    if (days > 0) return `${days} day(s) ago`;

    const hours = Math.floor(seconds / 3600);
    if (hours > 0) return `${hours} hour(s) ago`;

    const minutes = Math.floor(seconds / 60);
    return `${minutes} min(s) ago`;
  };

  return (
    <div className="relative inline-block">
      {/* 🔔 Bell Button */}
      <button
        onClick={onToggle}
        className={`
          relative p-2.5 rounded-xl transition-all duration-200 group
          ${
            show
              ? "bg-gray-100 text-gray-900"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          }
        `}
      >
        <Bell
          className={`w-5 h-5 transition-transform duration-200 ${
            show ? "scale-110" : "group-hover:rotate-12"
          }`}
        />

        {/* 🔴 Red Number Badge */}
        {unreadCount > 0 && (
          <span
            className="
              absolute -top-1 -right-1
              min-w-[20px] h-[20px]
              px-1.5
              flex items-center justify-center
              rounded-full
              bg-gradient-to-br from-red-500 to-rose-600
              text-white text-[11px] font-bold
              shadow-lg shadow-red-500/30
              ring-2 ring-white
              transition-transform
              group-hover:scale-110
            "
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* 📦 Dropdown */}
      {show && (
        <div
          ref={dropdownRef}
          className="
            absolute right-0 mt-3 w-96 bg-white rounded-2xl
            shadow-[0_20px_50px_rgba(0,0,0,0.15)]
            border border-gray-100 z-50 overflow-hidden
            ring-1 ring-black ring-opacity-5
            animate-in fade-in zoom-in-95 duration-200 origin-top-right
          "
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
                <p className="text-sm font-medium text-gray-900">
                  All caught up!
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  No new notifications at the moment.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {notifications.map((notif) => (
                  <li
                    key={notif.id}
                    onClick={() => onRead(notif.id)}
                    className={`
                      group relative px-5 py-4 cursor-pointer transition-colors
                      ${
                        notif.is_read === 0
                          ? "bg-red-50/40 hover:bg-red-50"
                          : "bg-white hover:bg-gray-50"
                      }
                    `}
                  >
                    <div className="flex gap-3">
                      {/* 🔴 Unread Indicator */}
                      {notif.is_read === 0 && (
                        <div className="mt-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                      )}

                      <div className="flex-1">
                        <p
                          className={`text-sm leading-relaxed ${
                            notif.is_read === 0
                              ? "font-semibold text-gray-900"
                              : "text-gray-600"
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
            <button className="w-full py-3 text-center text-xs font-semibold text-gray-500 border-t border-gray-50 hover:text-red-600 hover:bg-gray-50 transition-colors">
              View all notifications
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
