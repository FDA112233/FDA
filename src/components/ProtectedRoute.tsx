import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { BUSINESS_COLORS } from "@/lib/businessColors";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 给一点时间让AuthContext初始化
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg,
            ${BUSINESS_COLORS.primary.darkest} 0%,
            ${BUSINESS_COLORS.primary.dark} 25%,
            ${BUSINESS_COLORS.primary.main} 50%,
            ${BUSINESS_COLORS.primary.accent} 75%,
            ${BUSINESS_COLORS.primary.light} 100%)`,
        }}
      >
        {/* 动态背景粒子效果 */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                backgroundColor: BUSINESS_COLORS.primary.lightest,
                borderRadius: "50%",
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
              }}
            />
          ))}
        </div>

        {/* 加载内容 */}
        <div
          className="text-center relative z-10 p-8 rounded-2xl backdrop-blur-md transform transition-all duration-300 hover:scale-105"
          style={{
            background: `rgba(255, 255, 255, 0.1)`,
            border: `1px solid rgba(255, 255, 255, 0.2)`,
            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3)`,
          }}
        >
          {/* 多彩旋转加载器 */}
          <div className="relative mb-6">
            <div
              className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-transparent"
              style={{
                borderTopColor: BUSINESS_COLORS.primary.lightest,
                borderRightColor: BUSINESS_COLORS.primary.accent,
                borderBottomColor: BUSINESS_COLORS.status.info,
                borderLeftColor: BUSINESS_COLORS.status.success,
                filter: `drop-shadow(0 0 12px ${BUSINESS_COLORS.primary.accent}40)`,
              }}
            />
            <div
              className="absolute inset-2 animate-spin rounded-full h-12 w-12 border-4 border-transparent"
              style={{
                borderTopColor: BUSINESS_COLORS.status.warning,
                borderRightColor: BUSINESS_COLORS.status.processing,
                borderBottomColor: BUSINESS_COLORS.primary.light,
                borderLeftColor: BUSINESS_COLORS.primary.main,
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            />
            <div
              className="absolute inset-4 animate-pulse rounded-full h-8 w-8"
              style={{
                background: `radial-gradient(circle, ${BUSINESS_COLORS.primary.accent} 0%, transparent 70%)`,
              }}
            />
          </div>

          {/* 渐变文字 */}
          <p
            className="text-xl font-semibold mb-2 animate-pulse"
            style={{
              background: `linear-gradient(45deg,
                ${BUSINESS_COLORS.primary.lightest},
                ${BUSINESS_COLORS.primary.accent},
                ${BUSINESS_COLORS.status.info})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            正在验证身份...
          </p>

          <div className="flex justify-center space-x-1 mt-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full animate-bounce"
                style={{
                  backgroundColor: [
                    BUSINESS_COLORS.primary.lightest,
                    BUSINESS_COLORS.primary.accent,
                    BUSINESS_COLORS.status.success,
                  ][i],
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* 底部装饰波浪 */}
        <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
          <svg
            className="absolute bottom-0 w-full h-full"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,120 C300,80 600,20 1200,60 L1200,120 Z"
              fill={`url(#wave-gradient)`}
            />
            <defs>
              <linearGradient
                id="wave-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  stopColor={BUSINESS_COLORS.primary.accent}
                  stopOpacity={0.3}
                />
                <stop
                  offset="50%"
                  stopColor={BUSINESS_COLORS.status.info}
                  stopOpacity={0.2}
                />
                <stop
                  offset="100%"
                  stopColor={BUSINESS_COLORS.primary.light}
                  stopOpacity={0.3}
                />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
