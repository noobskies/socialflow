import React from "react";

export const PaymentMethodCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
      <h3 className="font-bold text-slate-900 dark:text-white mb-4">
        Payment Method
      </h3>
      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-8 bg-slate-200 dark:bg-slate-600 rounded flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-300">
            VISA
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              Visa ending in 4242
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Expires 12/24
            </p>
          </div>
        </div>
        <button className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline">
          Edit
        </button>
      </div>
    </div>
  );
};
