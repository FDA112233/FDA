import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { BUSINESS_COLORS } from "@/lib/businessColors";

export function DebugAuth() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // 只在开发环境显示
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const statusColor = isAuthenticated
    ? BUSINESS_COLORS.status.success
    : BUSINESS_COLORS.status.error;

  return (
    <div
      className="fixed top-4 right-4 z-50 transition-all duration-300 ease-in-out transform"
      style={{
        transform: isHovered ? "scale(1.05)" : "scale(1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 主容器 */}
      <div
        className="relative overflow-hidden cursor-pointer select-none"
        style={{
          background: `linear-gradient(135deg,
            ${BUSINESS_COLORS.primary.darkest}f0 0%,
            ${BUSINESS_COLORS.primary.dark}f0 50%,
            ${BUSINESS_COLORS.primary.main}f0 100%)`,
          backdropFilter: "blur(12px)",
          border: `1px solid ${BUSINESS_COLORS.primary.accent}40`,
          borderRadius: "12px",
          padding: isExpanded ? "16px" : "12px",
          fontSize: "12px",
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          boxShadow: `0 8px 32px ${BUSINESS_COLORS.primary.main}30,
                      0 0 0 1px ${BUSINESS_COLORS.primary.accent}20`,
          minWidth: isExpanded ? "280px" : "140px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* 顶部状态指示器 */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {/* 状态点 */}
            <div
              className="w-3 h-3 rounded-full animate-pulse"
              style={{
                backgroundColor: statusColor,
                boxShadow: `0 0 8px ${statusColor}60`,
              }}
            />
            <span
              className="text-xs font-medium"
              style={{ color: BUSINESS_COLORS.primary.lightest }}
            >
              Debug
            </span>
          </div>

          {/* 展开/收起图标 */}
          <div
            className="w-4 h-4 transition-transform duration-300"
            style={{
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              color: BUSINESS_COLORS.primary.accent,
            }}
          >
            ▼
          </div>
        </div>

        {/* 简化状态（收起时） */}
        {!isExpanded && (
          <div
            className="text-xs"
            style={{ color: BUSINESS_COLORS.primary.lightest }}
          >
            <span
              className="inline-block px-2 py-1 rounded-full text-xs font-medium"
              style={{
                background: `${statusColor}20`,
                color: statusColor,
                border: `1px solid ${statusColor}40`,
              }}
            >
              {isAuthenticated ? "已登录" : "未登录"}
            </span>
          </div>
        )}

        {/* 详细信息（展开时） */}
        {isExpanded && (
          <div className="space-y-3">
            {/* 路径信息 */}
            <div>
              <div
                className="text-xs font-medium mb-1"
                style={{ color: BUSINESS_COLORS.primary.accent }}
              >
                当前路径
              </div>
              <div
                className="px-2 py-1 rounded text-xs font-mono break-all"
                style={{
                  background: `${BUSINESS_COLORS.primary.darkest}80`,
                  color: BUSINESS_COLORS.primary.lightest,
                  border: `1px solid ${BUSINESS_COLORS.primary.main}30`,
                }}
              >
                {location.pathname}
              </div>
            </div>

            {/* 认证状态 */}
            <div>
              <div
                className="text-xs font-medium mb-1"
                style={{ color: BUSINESS_COLORS.primary.accent }}
              >
                认证状态
              </div>
              <div
                className="inline-block px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
                style={{
                  background: `${statusColor}20`,
                  color: statusColor,
                  border: `1px solid ${statusColor}40`,
                  boxShadow: `0 2px 8px ${statusColor}20`,
                }}
              >
                {isAuthenticated ? "✓ 已登录" : "✗ 未登录"}
              </div>
            </div>

            {/* 用户信息 */}
            <div>
              <div
                className="text-xs font-medium mb-1"
                style={{ color: BUSINESS_COLORS.primary.accent }}
              >
                用户信息
              </div>
              <div
                className="px-2 py-1 rounded text-xs font-mono"
                style={{
                  background: `${BUSINESS_COLORS.primary.darkest}80`,
                  color: user
                    ? BUSINESS_COLORS.status.success
                    : BUSINESS_COLORS.neutral[500],
                  border: `1px solid ${BUSINESS_COLORS.primary.main}30`,
                }}
              >
                {user || "无"}
              </div>
            </div>

            {/* 本地存储 */}
            <div>
              <div
                className="text-xs font-medium mb-1"
                style={{ color: BUSINESS_COLORS.primary.accent }}
              >
                本地存储
              </div>
              <div
                className="px-2 py-1 rounded text-xs font-mono break-all"
                style={{
                  background: `${BUSINESS_COLORS.primary.darkest}80`,
                  color: localStorage.getItem("cyberguard_auth")
                    ? BUSINESS_COLORS.status.success
                    : BUSINESS_COLORS.neutral[500],
                  border: `1px solid ${BUSINESS_COLORS.primary.main}30`,
                  maxHeight: "60px",
                  overflowY: "auto",
                }}
              >
                {localStorage.getItem("cyberguard_auth") || "无"}
              </div>
            </div>

            {/* 操作按钮 */}
            <div
              className="flex space-x-2 pt-2 border-t border-opacity-20"
              style={{ borderColor: BUSINESS_COLORS.primary.main }}
            >
              <button
                className="px-3 py-1 rounded text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: `${BUSINESS_COLORS.status.warning}20`,
                  color: BUSINESS_COLORS.status.warning,
                  border: `1px solid ${BUSINESS_COLORS.status.warning}40`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  localStorage.clear();
                  window.location.reload();
                }}
              >
                清除缓存
              </button>

              <button
                className="px-3 py-1 rounded text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: `${BUSINESS_COLORS.status.info}20`,
                  color: BUSINESS_COLORS.status.info,
                  border: `1px solid ${BUSINESS_COLORS.status.info}40`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Debug Info:", {
                    path: location.pathname,
                    authenticated: isAuthenticated,
                    user,
                    localStorage: localStorage.getItem("cyberguard_auth"),
                  });
                }}
              >
                日志输出
              </button>
            </div>
          </div>
        )}

        {/* 背景装饰 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* 动态渐变背景 */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(circle at ${isHovered ? "30%" : "70%"} ${isHovered ? "70%" : "30%"},
                ${BUSINESS_COLORS.primary.accent}20 0%,
                transparent 50%)`,
              transition: "all 0.8s ease-in-out",
            }}
          />

          {/* 微小粒子效果 */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: "1px",
                height: "1px",
                backgroundColor: BUSINESS_COLORS.primary.lightest,
                borderRadius: "50%",
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
