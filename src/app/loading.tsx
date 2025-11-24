export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="text-center space-y-4">
        {/* Spinner */}
        <div className="flex justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-indigo-600 dark:border-t-indigo-500"></div>
        </div>

        {/* Loading text */}
        <div className="space-y-2">
          <p className="text-lg font-medium text-slate-900 dark:text-white">
            Loading...
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Please wait while we load your content
          </p>
        </div>
      </div>
    </div>
  );
}
