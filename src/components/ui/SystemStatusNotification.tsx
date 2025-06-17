// 系统状态通知组件 - 显示 API 连接状态和模拟数据提示

import { useState, useEffect } from "react";
import { X, AlertTriangle, Wifi, WifiOff, Database } from "lucide-react";
import { mockApiService } from "@/services/mockApiService";
import { BACKEND_COLORS } from "@/lib/backendTheme";

interface SystemStatusNotificationProps {
  className?: string;
}

export function SystemStatusNotification({
  className = "",
}: SystemStatusNotificationProps) {
  const [isVisible, setIsVisible] = useState(true); // 默认显示
  const [isMockMode, setIsMockMode] = useState(true); // 默认模拟模式
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // 检查模拟模式状态
    const checkMockMode = () => {
      const mockActive = mockApiService.isActive();
      setIsMockMode(mockActive);
      // 只有明确关闭时才隐藏通知
    };

    // 初始检查
    checkMockMode();

    // 定期检查状态
    const interval = setInterval(checkMockMode, 5000);

    return () => clearInterval(interval);
  }, []);

  // 如果用户已关闭，不显示
  if (!isVisible) {
    return null;
  }

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm transition-all duration-300 ${
        isMinimized ? "translate-x-80" : "translate-x-0"
      } ${className}`}
    >
      <div
        className="rounded-xl backdrop-blur-md border shadow-lg overflow-hidden"
        style={{
          background: `linear-gradient(135deg, rgba(var(--warning), 0.15) 0%, rgba(var(--info), 0.1) 100%)`,
          border: `1px solid rgba(var(--warning), 0.3)`,
          boxShadow: `0 8px 32px rgba(var(--warning), 0.2)`,
        }}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between p-3 bg-black bg-opacity-10">
          <div className="flex items-center space-x-2">
            <Database
              className="w-5 h-5"
              style={{
                color: `rgb(var(--warning))`,
                filter: `drop-shadow(0 0 6px rgba(var(--warning), 0.6))`,
              }}
            />
            <h3
              className="text-sm font-semibold"
              style={{ color: BACKEND_COLORS.text.primary }}
            >
              模拟数据模式
            </h3>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={handleMinimize}
              className="p-1 rounded transition-colors hover:bg-white hover:bg-opacity-10"
              style={{ color: BACKEND_COLORS.text.secondary }}
            >
              <div className="w-3 h-3 border-b-2 border-current"></div>
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 rounded transition-colors hover:bg-white hover:bg-opacity-10"
              style={{ color: BACKEND_COLORS.text.secondary }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 内容 */}
        {!isMinimized && (
          <div className="p-4 space-y-3">
            <div className="flex items-start space-x-3">
              <AlertTriangle
                className="w-5 h-5 mt-0.5 flex-shrink-0"
                style={{
                  color: `rgb(var(--warning))`,
                  filter: `drop-shadow(0 0 6px rgba(var(--warning), 0.6))`,
                }}
              />
              <div className="space-y-2">
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: BACKEND_COLORS.text.secondary }}
                >
                  后端服务器暂时不可用，系统正在使用模拟数据进行演示。
                </p>
                <p
                  className="text-xs"
                  style={{ color: BACKEND_COLORS.text.muted }}
                >
                  当后端服务恢复时，系统将自动切换到真实数据。
                </p>
              </div>
            </div>

            {/* 状态指示器 */}
            <div className="flex items-center justify-between pt-2 border-t border-white border-opacity-10">
              <div className="flex items-center space-x-2">
                <WifiOff
                  className="w-4 h-4"
                  style={{ color: `rgb(var(--error))` }}
                />
                <span
                  className="text-xs"
                  style={{ color: BACKEND_COLORS.text.muted }}
                >
                  后端连接: 离线
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{
                    backgroundColor: `rgb(var(--success))`,
                    boxShadow: `0 0 6px rgba(var(--success), 0.6)`,
                  }}
                />
                <span
                  className="text-xs"
                  style={{ color: BACKEND_COLORS.text.muted }}
                >
                  模拟数据: 活跃
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 最小化状态的小指示器 */}
      {isMinimized && (
        <div
          className="absolute top-0 left-0 w-full h-full cursor-pointer"
          onClick={handleMinimize}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, rgba(var(--warning), 0.2) 0%, rgba(var(--info), 0.1) 100%)`,
              border: `1px solid rgba(var(--warning), 0.4)`,
            }}
          >
            <Database
              className="w-6 h-6"
              style={{
                color: `rgb(var(--warning))`,
                filter: `drop-shadow(0 0 6px rgba(var(--warning), 0.6))`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
