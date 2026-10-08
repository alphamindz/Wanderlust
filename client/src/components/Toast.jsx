import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const Toast = () => {
  const { toast } = useAuth();

  if (!toast) return null;

  return (
    <div className="toast-container">
      <div className={`toast ${toast.type}`}>
        {toast.type === 'error' ? (
          <AlertCircle size={20} className="text-red-400" />
        ) : (
          <CheckCircle2 size={20} className="text-emerald-400" />
        )}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

export default Toast;
