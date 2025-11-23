import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastType } from '../types';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'border-emerald-100 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-900';
      case 'error':
        return 'border-rose-100 bg-rose-50 dark:bg-rose-900/20 dark:border-rose-900';
      case 'info':
        return 'border-blue-100 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-900';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg transition-all duration-300 animate-in slide-in-from-top-2 ${getStyles()}`}
    >
      {getIcon()}
      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
