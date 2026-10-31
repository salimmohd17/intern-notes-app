import React from 'react';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

export default function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-live="polite">
      {toasts.map((toast) => {
        let icon = <Info size={18} className="toast-icon text-info" />;
        let borderClass = 'toast-info';

        if (toast.type === 'success') {
          icon = <CheckCircle2 size={18} className="toast-icon text-success" />;
          borderClass = 'toast-success';
        } else if (toast.type === 'error') {
          icon = <AlertCircle size={18} className="toast-icon text-error" />;
          borderClass = 'toast-error';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle size={18} className="toast-icon text-warning" />;
          borderClass = 'toast-warning';
        }

        return (
          <div key={toast.id} className={`toast-card ${borderClass} animate-slide-in`}>
            <div className="toast-body">
              {icon}
              <div className="toast-content">
                {toast.title && <div className="toast-title">{toast.title}</div>}
                <div className="toast-message">{toast.message}</div>
              </div>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="toast-close"
              aria-label="Close notification"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
