export default function DashboardLoading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
        <p className="text-on-surface-variant text-sm font-body-md italic opacity-70 animate-pulse">
          Opening the workshop...
        </p>
      </div>
    </div>
  );
}
