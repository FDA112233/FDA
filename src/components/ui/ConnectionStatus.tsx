// 简化的连接状态显示组件

import { useState, useEffect } from "react";
import { Wifi, WifiOff, Database, RefreshCw, CheckCircle } from "lucide-react";
import { mockApiService } from "@/services/mockApiService";
import { httpClient } from "@/services/apiService";
import { API_CONFIG } from "@/lib/apiConfig";
import { BACKEND_COLORS } from "@/lib/backendTheme";

export function ConnectionStatus() {
  const [isMockMode, setIsMockMode] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      setIsMockMode(mockApiService.isActive());
    };

    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const success = await httpClient.tryConnectToBackend();
      if (success) {
        console.log("✅ 连接成功！");
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      console.warn("连接失败:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div
      className="fixed top-4 right-4 z-50 transition-all duration-300"
      style={{ width: showDetails ? "320px" : "auto" }}
    >
      <div
        className="backdrop-blur-md rounded-xl border shadow-lg overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${
            isMockMode
              ? "rgba(var(--warning), 0.15)"
              : "rgba(var(--success), 0.15)"
          } 0%, rgba(var(--brand-primary), 0.1) 100%)`,
          border: `1px solid ${
            isMockMode
              ? "rgba(var(--warning), 0.3)"
              : "rgba(var(--success), 0.3)"
          }`,
          boxShadow: `0 8px 32px ${
            isMockMode
              ? "rgba(var(--warning), 0.2)"
              : "rgba(var(--success), 0.2)"
          }`,
        }}
      >
        {/* 简化状态栏 */}
        <div
          className="flex items-center justify-between p-3 cursor-pointer"
          onClick={() => setShowDetails(!showDetails)}
        >
          <div className="flex items-center space-x-2">
            {isMockMode ? (
              <Database
                className="w-5 h-5"
                style={{
                  color: `rgb(var(--warning))`,
                  filter: `drop-shadow(0 0 6px rgba(var(--warning), 0.6))`,
                }}
              />
            ) : (
              <CheckCircle
                className="w-5 h-5"
                style={{
                  color: `rgb(var(--success))`,
                  filter: `drop-shadow(0 0 6px rgba(var(--success), 0.6))`,
                }}
              />
            )}
            <span
              className="text-sm font-medium"
              style={{ color: BACKEND_COLORS.text.primary }}
            >
              {isMockMode ? "模拟数据" : "后端连接"}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            {isMockMode ? (
              <WifiOff
                className="w-4 h-4"
                style={{ color: `rgb(var(--error))` }}
              />
            ) : (
              <Wifi
                className="w-4 h-4"
                style={{ color: `rgb(var(--success))` }}
              />
            )}
          </div>
        </div>

        {/* 详细信息面板 */}
        {showDetails && (
          <div className="px-3 pb-3 space-y-3 border-t border-white border-opacity-10">
            <div className="text-xs space-y-1">
              <div style={{ color: BACKEND_COLORS.text.muted }}>
                目标: {API_CONFIG.BASE_URL.replace("http://", "")}
              </div>
              <div style={{ color: BACKEND_COLORS.text.muted }}>
                状态: {isMockMode ? "演示模式" : "真实数据"}
              </div>
            </div>

            {isMockMode && (
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
                style={{
                  background: `linear-gradient(135deg, rgba(var(--success), 0.2) 0%, rgba(var(--info), 0.1) 100%)`,
                  border: `1px solid rgba(var(--success), 0.3)`,
                }}
              >
                <RefreshCw
                  className={`w-4 h-4 ${isConnecting ? "animate-spin" : ""}`}
                  style={{ color: `rgb(var(--success))` }}
                />
                <span
                  className="text-xs font-medium"
                  style={{ color: `rgb(var(--success))` }}
                >
                  {isConnecting ? "连接中..." : "连接后端"}
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
