export const SnapshotLoadingOverlay: React.FC = () => (
<div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/70 backdrop-blur-md">
  
  {/* Glow Pulse Background */}
  <div className="absolute w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl animate-pulse" />

  {/* Spinner */}
  <div className="relative flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin" />
    
  </div>

  {/* Text */}
  <p className="mt-4 text-sm font-semibold text-gray-600 tracking-wide animate-pulse">
    Loading version…
  </p>

  {/* Subtext */}
  <span className="text-xs text-gray-400 mt-1">
    Please wait while we fetch the latest data
  </span>
</div>
);