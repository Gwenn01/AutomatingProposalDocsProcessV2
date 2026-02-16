import React, { useState, useRef } from "react";
import { prmsuLogo } from "../assets";
import { BarChart3, Globe, ShieldCheck, Zap } from "lucide-react";
import { CustomButton, FormInput } from "../components";
import { useNavigate } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/context/toast";
import { loginUser, registerUser, storeTokens, getUserProfile } from "@/utils/auth-api";

// ================= TYPE DEFINITIONS =================

interface LoginData {
  identifier: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  campus: string;
  department: string;
  position: string;
  password: string;
  confirmPassword?: string;
}

interface User {
  user_id: number;
  email: string;
  username: string;
  fullname: string;
  role: "admin" | "implementor" | "reviewer";
  campus: string;
  department: string;
  position: string;
}

interface FeatureCardProps {
  icon: React.ReactElement;
  text: string;
}

interface SelectOption {
  label: string;
  value: string;
}

type AuthMode = "login" | "register";

// ================= COMPONENT =================

const Auth: React.FC = () => {
  const { showToast } = useToast();
  const [mode, setMode] = useState<AuthMode>("login");

  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [registerLoading, setRegisterLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>("");
  const [registerError, setRegisterError] = useState<string>("");
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [loginData, setLoginData] = useState<LoginData>({
    identifier: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState<RegisterData>({
    name: "",
    email: "",
    campus: "",
    department: "",
    position: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleLogin = async (): Promise<void> => {
    if (loginLoading) return;

    setLoginLoading(true);
    setLoginError("");

    try {
      // Step 1: Login and get tokens + basic user info
      const loginResponse = await loginUser(loginData.identifier, loginData.password);

      // Step 2: Store JWT tokens
      storeTokens(loginResponse.access, loginResponse.refresh);

      // Step 3: Fetch full user profile (includes UserProfile data)
      const userProfile = await getUserProfile(loginResponse.user_id);

      // Step 4: Create complete user object merging login response + profile
      const user = {
        user_id: userProfile.id,
        email: userProfile.email,
        username: userProfile.username,
        fullname: userProfile.profile.name || userProfile.username,
        role: userProfile.profile.role,
        campus: userProfile.profile.campus,
        department: userProfile.profile.department,
        position: userProfile.profile.position,
      };

      // Step 5: Store user data
      localStorage.setItem("user", JSON.stringify(user));

      // Success!
      showToast(
        `Login successful! Welcome back, ${user.fullname}!`,
        "success"
      );
      
      setTimeout(() => navigate("/home"), 800);
    } catch (error: any) {
      console.error("LOGIN ERROR:", error);
      setLoginError(error.message || "Login failed. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (): Promise<void> => {
    if (registerLoading) return;

    setRegisterLoading(true);
    setRegisterError("");

    try {
      // Basic validation
      if (!registerData.name || !registerData.email || !registerData.password) {
        setRegisterError("Please fill in all required fields");
        return;
      }

      if (registerData.password !== registerData.confirmPassword) {
        setRegisterError("Passwords do not match");
        return;
      }

      if (registerData.password.length < 6) {
        setRegisterError("Password must be at least 6 characters");
        return;
      }

      // Generate username from email (before @ symbol)
      const username = registerData.email.split('@')[0];

      // Prepare data for API
      const registrationData = {
        username: username,
        email: registerData.email,
        password: registerData.password,
        role: "implementor", // Default role
        name: registerData.name,
        campus: registerData.campus,
        department: registerData.department,
        position: registerData.position || "",
      };

      // Call register API
      const response = await registerUser(registrationData);

      // Success!
      showToast("Registration successful! Please login.", "success");

      // Reset form and switch to login
      setRegisterData({
        name: "",
        email: "",
        campus: "",
        department: "",
        position: "",
        password: "",
        confirmPassword: "",
      });

      setMode("login");
    } catch (error: any) {
      console.error("REGISTER ERROR:", error);
      setRegisterError(error.message || "Registration failed. Please try again.");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 antialiased overflow-hidden">
      {/* LEFT SIDE - The Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 lg:p-10 bg-white z-20 shadow-2xl min-h-screen">
        <div className="w-full max-w-md">
          {/* Logo Section - Premium Minimalist Style */}
          <Motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-5 mb-10 pb-2 border-b border-slate-50"
          >
            {/* Clean Logo Container - No BG color, just soft depth */}
            <div className="relative group">
              <div className="relative z-10 transition-transform duration-500 group-hover:scale-110">
                <img
                  src={prmsuLogo}
                  alt="PRMSU Logo"
                  className="w-12 h-12 object-contain"
                />
              </div>

              {/* Subtle Glow Ring - Replaces the box background */}
              <div className="absolute inset-0 bg-emerald-400/10 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              {/* Refined Status Indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-[0_2px_5px_rgba(0,0,0,0.05)] border border-slate-50">
                <div className="w-2 h-2 bg-emerald-500 rounded-full">
                  <div className="w-full h-full bg-emerald-500 rounded-full animate-ping opacity-40" />
                </div>
              </div>
            </div>

            {/* Typography Section */}
            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                  {mode === "login" ? "Welcome" : "Register"}
                </h1>

                {/* Professional Divider */}
                <div className="h-4 w-[1px] bg-slate-200" />

                {/* Professional Phase Label */}
                <span className="text-[9px] font-black text-emerald-600 tracking-[0.15em] uppercase">
                  {mode === "login" ? "Authorized Access" : "Staff Registration"}
                </span>
              </div>

              <div className="flex items-center">
                <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase flex items-center">
                  Extension Office
                  <span className="mx-2 text-emerald-300">•</span>
                  <span className="text-slate-300 font-medium italic">
                    PRMSU System
                  </span>
                </p>
              </div>
            </div>
          </Motion.div>

          {/* Demo Credentials Info */}
          {mode === "login" && (
            <Motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl"
            >
              <p className="text-xs font-bold text-emerald-800 mb-2">
                Demo Account:
              </p>
              <ul className="space-y-1 text-xs text-emerald-700">
                <li>• <strong>Email:</strong> arnel@university.edu</li>
                <li>• <strong>Password:</strong> arnel123</li>
              </ul>
            </Motion.div>
          )}

          {/* Form Container - Wrapped in a <form> tag for Enter shortcut */}
          <form
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              mode === "login" ? handleLogin() : handleRegister();
            }}
          >
            <Motion.div layout className="space-y-4">
              <AnimatePresence mode="wait">
                {mode === "login" ? (
                  <Motion.div
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
                        Email Address
                      </label>
                      <FormInput
                        ref={emailRef}
                        type="email"
                        placeholder="name@university.edu"
                        value={loginData.identifier}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setLoginData({
                            ...loginData,
                            identifier: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
                        Password
                      </label>
                      <FormInput
                        ref={passwordRef}
                        type="password"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setLoginData({
                            ...loginData,
                            password: e.target.value,
                          })
                        }
                      />
                    </div>
                  </Motion.div>
                ) : (
                  <Motion.div
                    key="register"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="grid grid-cols-2 gap-x-3 gap-y-3"
                  >
                    {/* Full Name */}
                    <div className="space-y-1 col-span-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
                        Full Name
                      </label>
                      <FormInput
                        placeholder="John Doe"
                        value={registerData.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setRegisterData({
                            ...registerData,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    {/* Email */}
                    <div className="space-y-1 col-span-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
                        Email Address
                      </label>
                      <FormInput
                        type="email"
                        placeholder="you@example.com"
                        value={registerData.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setRegisterData({
                            ...registerData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    {/* Campus & Department Row */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
                        Campus
                      </label>
                      <FormInput
                        type="select"
                        options={[
                          { label: "Select Campus", value: "" },
                          { label: "Iba", value: "Iba Campus" },
                          { label: "Botolan", value: "Botolan Campus" },
                        ]}
                        value={registerData.campus}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setRegisterData({
                            ...registerData,
                            campus: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
                        Dept.
                      </label>
                      <FormInput
                        type="select"
                        options={[
                          { label: "Select Dept.", value: "" },
                          { label: "CCIT", value: "CCIT" },
                          { label: "CTHM", value: "CTHM" },
                        ]}
                        value={registerData.department}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setRegisterData({
                            ...registerData,
                            department: e.target.value,
                          })
                        }
                      />
                    </div>
                    {/* Position */}
                    <div className="space-y-1 col-span-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
                        Position
                      </label>
                      <FormInput
                        placeholder="Instructor I"
                        value={registerData.position}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setRegisterData({
                            ...registerData,
                            position: e.target.value,
                          })
                        }
                      />
                    </div>
                    {/* Password Row */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
                        Password
                      </label>
                      <FormInput
                        type="password"
                        placeholder="••••••"
                        value={registerData.password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setRegisterData({
                            ...registerData,
                            password: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
                        Confirm
                      </label>
                      <FormInput
                        type="password"
                        placeholder="••••••"
                        value={registerData.confirmPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setRegisterData({
                            ...registerData,
                            confirmPassword: e.target.value,
                          })
                        }
                      />
                    </div>
                  </Motion.div>
                )}
              </AnimatePresence>

              {/* Error Messages */}
              {(loginError || registerError) && (
                <Motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-xl text-[11px] font-medium"
                >
                  {mode === "login" ? loginError : registerError}
                </Motion.div>
              )}

              {/* Action Button - Note: type="submit" enables the Enter key trigger */}
              <CustomButton
                type="submit"
                title={mode === "login" ? "Sign In" : "Create Account"}
                containerStyles={`
                  w-full py-4 mt-6 relative overflow-hidden bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-widest uppercase
                  rounded-2xl shadow-[0_10px_25px_-5px_rgba(16,185,129,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(16,185,129,0.5)]
                  transition-all duration-300 transform hover:-translate-y-1 active:scale-[0.98] border-t border-white/20
                `}
                isLoading={loginLoading || registerLoading}
              />

              <p className="text-center text-slate-500 font-medium text-xs">
                {mode === "login" ? "New here?" : "Joined already?"}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === "login" ? "register" : "login");
                    setLoginError("");
                    setRegisterError("");
                  }}
                  className="ml-2 text-emerald-600 font-bold hover:text-emerald-700 underline-offset-2 hover:underline transition-all"
                >
                  {mode === "login" ? "Create account" : "Sign in"}
                </button>
              </p>
            </Motion.div>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE - Premium Saturated Green Panel */}
      <div className="hidden lg:flex lg:w-[55%] h-screen sticky top-0 bg-gradient-to-br from-emerald-600 via-emerald-500 to-green-600 overflow-hidden items-center justify-center p-12">
        {/* Saturated Mesh Glows - Standard Green/Emerald focus */}
        <div className="absolute top-[-10%] left-[-10%] w-[700px] h-[700px] bg-emerald-400/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-green-400/40 rounded-full blur-[100px]"></div>
        <div className="absolute top-[20%] right-[5%] w-[400px] h-[400px] bg-lime-300/20 rounded-full blur-[80px]"></div>

        {/* Content Wrapper */}
        <div className="relative z-10 w-full max-w-lg">
          {/* Main Glassmorphism Container - Lighter "Frosted Ice" Style */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative backdrop-blur-3xl bg-white/[0.15] border border-white/30 p-10 pt-24 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.2)] overflow-visible"
          >
            {/* ATTACHED FLOATING CARD */}
            <Motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 bg-white/80 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/40 shadow-[0_20px_40px_rgba(0,0,0,0.08)] z-20 overflow-hidden"
            >
              {/* Subtle Inner Bevel for that "Apple Glass" look */}
              <div className="absolute inset-0 border border-white/50 rounded-[2.5rem] pointer-events-none" />

              {/* Top Navigation / Status Bar Style */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="h-3 w-16 bg-slate-200/50 rounded-full animate-pulse" />
                </div>
                <div className="text-[10px] font-semibold text-slate-400 tabular-nums tracking-tight">
                  99%
                </div>
              </div>

              <div className="space-y-4">
                {/* iOS Style Segmented Progress Bar */}
                <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <Motion.div
                    initial={{ width: "10%" }}
                    animate={{ width: "85%" }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: [0.65, 0, 0.35, 1],
                    }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>

                {/* Metadata Row */}
                <div className="flex justify-between items-end">
                  <div className="space-y-1.5">
                    <div className="h-1 w-20 bg-slate-200/60 rounded-full" />
                    <div className="h-1 w-12 bg-slate-100/80 rounded-full" />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-bold text-emerald-600 tracking-wide uppercase font-sans">
                      Active Sync
                    </span>
                    <span className="text-[8px] text-slate-400 font-medium">
                      prmsu-server-01
                    </span>
                  </div>
                </div>
              </div>

              {/* Apple-style Bottom Reflection Light */}
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />
            </Motion.div>

            {/* Content Section - Premium Refined Layout */}
            <div className="relative z-10 text-center lg:text-left px-4">
              {/* Modern Minimalist Badge */}
              <Motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center space-x-3 px-4 py-1.5 mb-8 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-sm"
              >
                <span className="flex h-2 w-2 rounded-full bg-white animate-pulse shadow-[0_0_10px_#fff]" />
                <span className="text-[11px] font-bold text-white/90 tracking-[0.3em] uppercase">
                  Institutional System
                </span>
              </Motion.div>

              {/* Premium Typography Layout */}
              <div className="mb-10 space-y-2">
                <h2 className="text-6xl font-black text-white tracking-tighter leading-[0.9] drop-shadow-2xl">
                  Extension <br />
                  <span className="text-emerald-200/90 font-light italic">
                    Office.
                  </span>
                </h2>
                <div className="h-1 w-20 bg-gradient-to-r from-emerald-300 to-transparent rounded-full mt-4" />
              </div>

              {/* Refined Description */}
              <p className="text-white/80 text-base leading-relaxed mb-12 max-w-md font-normal tracking-tight">
                {mode === "login"
                  ? "Direct access to the unified infrastructure for community engagement and institutional outreach metrics."
                  : "Empowering faculty through streamlined data management for sustainable community development."}
              </p>

              {/* Feature Grid - Ultra Premium Milky Glass (70% Opacity) */}
              <div className="grid grid-cols-2 gap-4 max-w-lg">
                <FeatureCard
                  icon={<BarChart3 size={20} strokeWidth={1.5} />}
                  text="Analytics"
                />
                <FeatureCard
                  icon={<Globe size={20} strokeWidth={1.5} />}
                  text="Network"
                />
                <FeatureCard
                  icon={<ShieldCheck size={20} strokeWidth={1.5} />}
                  text="Security"
                />
                <FeatureCard
                  icon={<Zap size={20} strokeWidth={1.5} />}
                  text="Export"
                />
              </div>
            </div>
          </Motion.div>
        </div>

        {/* Professional Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.15] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, text }) => (
  <Motion.div
    whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.95)" }}
    whileTap={{ scale: 0.98 }}
    className="flex items-center px-4 h-12 rounded-2xl bg-white/70 backdrop-blur-2xl border border-white/40 shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-300 cursor-pointer group"
  >
    {/* Compact Icon Container */}
    <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-600/50 text-white group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
      {/* Icon scales slightly on hover */}
      <div className="group-hover:scale-110 transition-transform duration-300">
        {React.cloneElement(icon, { size: 14, strokeWidth: 2.5 })}
      </div>
    </div>

    {/* Text - Turns Emerald on Hover */}
    <span className="ml-3 text-emerald-500 font-bold text-[13px] tracking-tight whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-emerald-600 transition-colors duration-300">
      {text}
    </span>
  </Motion.div>
);

export default Auth;