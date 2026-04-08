export const EmptyState: React.FC<{
  icon: React.ReactNode;
  message: string;
  subtitle?: string;
  fullHeight?: boolean;
}> = ({ icon, message, subtitle, fullHeight }) => (
  <div
    className={`flex flex-col items-center justify-center text-gray-400 gap-3 ${
      fullHeight ? "h-[60vh]" : "h-64"
    }`}
  >
    {icon}
    <p className="font-medium text-gray-500">{message}</p>
    {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
  </div>
);