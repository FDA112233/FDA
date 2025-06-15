import * as React from "react";
import { cn } from "@/lib/utils";
import { X, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";
import { BUSINESS_COLORS } from "@/lib/businessColors";

interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose: (id: string) => void;
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastConfigs = {
  success: {
    mainColor: BUSINESS_COLORS.status.success,
    accentColor: BUSINESS_COLORS.threat.safe,
    gradient: `linear-gradient(135deg, ${BUSINESS_COLORS.status.success}20 0%, ${BUSINESS_COLORS.threat.safe}10 100%)`,
    glowColor: BUSINESS_COLORS.status.success,
  },
  error: {
    mainColor: BUSINESS_COLORS.status.error,
    accentColor: BUSINESS_COLORS.threat.critical,
    gradient: `linear-gradient(135deg, ${BUSINESS_COLORS.status.error}20 0%, ${BUSINESS_COLORS.threat.critical}10 100%)`,
    glowColor: BUSINESS_COLORS.status.error,
  },
  warning: {
    mainColor: BUSINESS_COLORS.status.warning,
    accentColor: BUSINESS_COLORS.threat.medium,
    gradient: `linear-gradient(135deg, ${BUSINESS_COLORS.status.warning}20 0%, ${BUSINESS_COLORS.threat.medium}10 100%)`,
    glowColor: BUSINESS_COLORS.status.warning,
  },
  info: {
    mainColor: BUSINESS_COLORS.status.info,
    accentColor: BUSINESS_COLORS.primary.accent,
    gradient: `linear-gradient(135deg, ${BUSINESS_COLORS.status.info}20 0%, ${BUSINESS_COLORS.primary.accent}10 100%)`,
    glowColor: BUSINESS_COLORS.status.info,
  },
};

export function Toast({
  id,
  title,
  description,
  type = "info",
  duration = 5000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = React.useState(true);
  const Icon = toastIcons[type];

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, onClose]);

  return (
    <div
      className={cn(
        "cyber-card border-2 p-4 min-w-[300px] max-w-[400px] transition-all duration-300 transform",
        toastStyles[type],
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
      )}
    >
      <div className="flex items-start space-x-3">
        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          {title && <h4 className="font-semibold text-sm mb-1">{title}</h4>}
          {description && <p className="text-sm opacity-90">{description}</p>}
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose(id), 300);
          }}
          className="text-current opacity-60 hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const addToast = React.useCallback(
    (toast: Omit<ToastProps, "id" | "onClose">) => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts((prev) => [...prev, { ...toast, id, onClose: removeToast }]);
    },
    [],
  );

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // 暴露给全局使用
  React.useEffect(() => {
    (window as any).showToast = addToast;
  }, [addToast]);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
}

// 全局Toast函数
declare global {
  interface Window {
    showToast: (toast: Omit<ToastProps, "id" | "onClose">) => void;
  }
}
