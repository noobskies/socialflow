"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        {/* 404 Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/20 p-4">
            <svg
              className="h-12 w-12 text-indigo-600 dark:text-indigo-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* 404 Message */}
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-slate-900 dark:text-white">
            404
          </h1>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Page Not Found
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors"
          >
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
