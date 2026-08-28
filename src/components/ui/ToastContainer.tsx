import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useData();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
            case 'danger':
              return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
            case 'warning':
              return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
            default:
              return <Info className="w-5 h-5 text-blue-500 shrink-0" />;
          }
        };

        const getBorderColor = () => {
          switch (toast.type) {
            case 'success':
              return 'border-emerald-200 bg-white';
            case 'danger':
              return 'border-rose-200 bg-white';
            case 'warning':
              return 'border-amber-200 bg-white';
            default:
              return 'border-blue-200 bg-white';
          }
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border shadow-xl flex items-start gap-3 transition-all animate-in slide-in-from-bottom-4 duration-200 ${getBorderColor()}`}
          >
            {getIcon()}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-[#0F172A]">{toast.title}</h4>
              <p className="text-xs text-[#64748B] mt-0.5">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#64748B] hover:text-[#0F172A] p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
