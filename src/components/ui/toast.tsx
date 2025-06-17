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
  const [isHovered, setIsHovered] = React.useState(false);
  const [progress, setProgress] = React.useState(100);
  const Icon = toastIcons[type];
  const config = toastConfigs[type];

  React.useEffect(() => {
    let progressTimer: NodeJS.Timeout;
    let closeTimer: NodeJS.Timeout;

    if (!isHovered) {
      const startTime = Date.now();
      progressTimer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, ((duration - elapsed) / duration) * 100);
        setProgress(remaining);

        if (remaining <= 0) {
          clearInterval(progressTimer);
        }
      }, 50);

      closeTimer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(id), 300);
      }, duration);
    }

    return () => {
      clearInterval(progressTimer);
      clearTimeout(closeTimer);
    };
  }, [duration, id, onClose, isHovered]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 300);
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden backdrop-blur-md min-w-[320px] max-w-[420px] transition-all duration-300 transform cursor-pointer select-none",
        isVisible
          ? "translate-x-0 opacity-100 scale-100"
          : "translate-x-full opacity-0 scale-95",
        isHovered ? "scale-105" : "scale-100",
      )}
      style={{
        background: config.gradient,
        backdropFilter: "blur(12px)",
        border: `1px solid ${config.mainColor}40`,
        borderRadius: "16px",
        boxShadow: `0 8px 32px ${config.glowColor}20,
                    0 4px 16px ${config.glowColor}10,
                    0 0 0 1px ${config.mainColor}20`,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 进度条 */}
      <div
        className="absolute top-0 left-0 h-1 transition-all duration-100 ease-linear"
        style={{
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${config.mainColor}, ${config.accentColor})`,
          borderRadius: "16px 16px 0 0",
        }}
      />

      {/* 背景装饰粒子 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              backgroundColor: config.mainColor,
              borderRadius: "50%",
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 2 + 1}s`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 p-5">
        <div className="flex items-start space-x-4">
          {/* 图标容器 */}
          <div
            className="flex-shrink-0 p-2 rounded-xl"
            style={{
              background: `${config.mainColor}20`,
              border: `1px solid ${config.mainColor}40`,
              boxShadow: `0 4px 12px ${config.glowColor}20`,
            }}
          >
            <Icon
              className="w-6 h-6 animate-pulse"
              style={{ color: config.mainColor }}
            />
          </div>

          {/* 文本内容 */}
          <div className="flex-1 min-w-0">
            {title && (
              <h4
                className="font-semibold text-base mb-2 leading-tight"
                style={{ color: config.mainColor }}
              >
                {title}
              </h4>
            )}
            {description && (
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: `${config.mainColor}E0`,
                  opacity: 0.9,
                }}
              >
                {description}
              </p>
            )}
          </div>

          {/* 关闭按钮 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="flex-shrink-0 p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
              color: config.mainColor,
              background: isHovered ? `${config.mainColor}20` : "transparent",
              border: `1px solid ${isHovered ? config.mainColor + "40" : "transparent"}`,
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 底部装饰线 */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${config.mainColor}60 50%, transparent 100%)`,
          }}
        />
      </div>

      {/* 浮动光效 */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.6 : 0.3,
          background: `radial-gradient(circle at ${isHovered ? "80%" : "20%"} ${isHovered ? "20%" : "80%"},
            ${config.glowColor}15 0%,
            transparent 50%)`,
        }}
      />
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
