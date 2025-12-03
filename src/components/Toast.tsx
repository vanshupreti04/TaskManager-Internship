'use client';

import { useEffect, useState } from 'react';
import {
  CheckCircle,
  Error,
  Info,
  Warning,
  Close,
} from '@mui/icons-material';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

export function Toast({ toast, onRemove }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <Error className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <Warning className="w-5 h-5" />,
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };

  const iconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    info: 'text-blue-500',
    warning: 'text-yellow-500',
  };

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg
        ${colors[toast.type]}
        transition-all duration-300 transform
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
      `}
    >
      <div className={`${iconColors[toast.type]}`}>
        {icons[toast.type]}
      </div>
      <div className="flex-1 text-sm font-medium">{toast.message}</div>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-2 text-gray-400 hover:text-gray-600"
      >
        <Close className="w-4 h-4" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}