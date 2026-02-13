import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const config = {
    success: {
      accent: "from-emerald-500 to-green-500",
      glow: "shadow-[0_10px_30px_rgba(16,185,129,0.35)]",
      label: "Success",
    },
    error: {
      accent: "from-red-500 to-rose-500",
      glow: "shadow-[0_10px_30px_rgba(239,68,68,0.35)]",
      label: "Error",
    },
    info: {
      accent: "from-blue-500 to-indigo-500",
      glow: "shadow-[0_10px_30px_rgba(59,130,246,0.35)]",
      label: "Notice",
    },
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <AnimatePresence>
        {toast && (
          <Motion.div
            initial={{ opacity: 0, y: -30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.96 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed top-6 right-6 z-[999] w-[360px]"
          >
            <div
              className={`relative overflow-hidden rounded-md backdrop-blur-2xl bg-white/85 border border-white/50 p-5 ${config[toast.type].glow}`}
            >
              {/* Gradient Accent Line */}
              <div
                className={`absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b ${config[toast.type].accent}`}
              />

              {/* Close Button */}
              <button
                onClick={() => setToast(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition"
              >
                <X size={16} />
              </button>

              {/* Content */}
              <div className="pr-6">
                <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                  {config[toast.type].label}
                </h4>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {toast.message}
                </p>
              </div>

              {/* Progress Bar */}
              <Motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 3.5, ease: "linear" }}
                className={`absolute bottom-0 left-0 h-[3px] bg-gradient-to-r ${config[toast.type].accent}`}
              />
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
};
