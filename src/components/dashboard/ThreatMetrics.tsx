import {
  TrendingUp,
  TrendingDown,
  Shield,
  AlertTriangle,
  Eye,
  Zap,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BACKEND_COLORS } from "@/lib/backendTheme";
import { useSystemMetrics, useSystemAlerts } from "@/hooks/useSystemMetrics";
import { useNetworkMetrics } from "@/hooks/useNetworkMetrics";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down";
  icon: React.ElementType;
  threatLevel?: "critical" | "high" | "medium" | "low" | "info";
  description?: string;
  isUpdating?: boolean;
}

function MetricCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  threatLevel,
  description,
  isUpdating = false,
}: MetricCardProps) {
  const getThreatStyle = (level?: string) => {
    switch (level) {
      case "critical":
        return {
          background: `linear-gradient(135deg, rgba(var(--threat-critical), 0.15) 0%, rgba(var(--error), 0.1) 100%)`,
          border: `1px solid rgba(var(--threat-critical), 0.4)`,
          color: `rgb(var(--threat-critical))`,
          boxShadow: `0 8px 32px rgba(var(--threat-critical), 0.2)`,
        };
      case "high":
        return {
          background: `linear-gradient(135deg, rgba(var(--threat-high), 0.15) 0%, rgba(var(--warning), 0.1) 100%)`,
          border: `1px solid rgba(var(--threat-high), 0.4)`,
          color: `rgb(var(--threat-high))`,
          boxShadow: `0 8px 32px rgba(var(--threat-high), 0.2)`,
        };
      case "medium":
        return {
          background: `linear-gradient(135deg, rgba(var(--threat-medium), 0.15) 0%, rgba(var(--warning), 0.1) 100%)`,
          border: `1px solid rgba(var(--threat-medium), 0.4)`,
          color: `rgb(var(--threat-medium))`,
          boxShadow: `0 8px 32px rgba(var(--threat-medium), 0.2)`,
        };
      case "low":
        return {
          background: `linear-gradient(135deg, rgba(var(--threat-low), 0.15) 0%, rgba(var(--success), 0.1) 100%)`,
          border: `1px solid rgba(var(--threat-low), 0.4)`,
          color: `rgb(var(--threat-low))`,
          boxShadow: `0 8px 32px rgba(var(--threat-low), 0.2)`,
        };
      case "info":
        return {
          background: `linear-gradient(135deg, rgba(var(--info), 0.15) 0%, rgba(var(--brand-accent), 0.1) 100%)`,
          border: `1px solid rgba(var(--info), 0.4)`,
          color: `rgb(var(--info))`,
          boxShadow: `0 8px 32px rgba(var(--info), 0.2)`,
        };
      default:
        return {
          background: BACKEND_COLORS.backgrounds.card,
          border: BACKEND_COLORS.borders.primary,
          color: BACKEND_COLORS.text.primary,
          boxShadow: BACKEND_COLORS.shadows.medium,
        };
    }
  };

  const threatStyle = getThreatStyle(threatLevel);

  return (
    <div
      className="p-6 rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:-translate-y-1 relative overflow-hidden"
      style={{
        background: threatStyle.background,
        border: threatStyle.border,
        boxShadow: threatStyle.boxShadow,
      }}
    >
      {/* 背景装饰效果 */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-32 h-32 opacity-10"
          style={{
            background: `radial-gradient(circle at center, ${threatStyle.color} 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <Icon
              className="w-6 h-6 transition-all duration-300"
              style={{
                color: threatStyle.color,
                filter: `drop-shadow(0 0 8px ${threatStyle.color}60)`,
              }}
            />
            <h3
              className="text-sm font-medium"
              style={{ color: BACKEND_COLORS.text.secondary }}
            >
              {title}
            </h3>
          </div>

          <div className="space-y-2">
            <p
              className="text-3xl font-bold transition-all duration-300"
              style={{
                color: threatStyle.color,
                textShadow: `0 0 16px ${threatStyle.color}40`,
              }}
            >
              {value}
            </p>

            {description && (
              <p
                className="text-xs"
                style={{ color: BACKEND_COLORS.text.muted }}
              >
                {description}
              </p>
            )}

            {change !== undefined && (
              <div className="flex items-center space-x-2">
                {trend === "up" ? (
                  <TrendingUp
                    className="w-4 h-4"
                    style={{
                      color: `rgb(var(--error))`,
                      filter: `drop-shadow(0 0 6px rgba(var(--error), 0.6))`,
                    }}
                  />
                ) : (
                  <TrendingDown
                    className="w-4 h-4"
                    style={{
                      color: `rgb(var(--success))`,
                      filter: `drop-shadow(0 0 6px rgba(var(--success), 0.6))`,
                    }}
                  />
                )}
                <span
                  className="text-sm font-medium"
                  style={{
                    color:
                      trend === "up"
                        ? `rgb(var(--error))`
                        : `rgb(var(--success))`,
                  }}
                >
                  {change > 0 ? "+" : ""}
                  {change}%
                </span>
                <span
                  className="text-xs"
                  style={{ color: BACKEND_COLORS.text.muted }}
                >
                  较昨日
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 右侧装饰图标 */}
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center relative group"
          style={{
            background: `linear-gradient(135deg, ${threatStyle.color}20 0%, ${threatStyle.color}10 100%)`,
            border: `1px solid ${threatStyle.color}30`,
          }}
        >
          <Icon
            className="w-7 h-7 transition-all duration-300 group-hover:scale-110"
            style={{
              color: threatStyle.color,
              filter: `drop-shadow(0 0 8px ${threatStyle.color}50)`,
            }}
          />

          {isUpdating && (
            <div
              className="absolute inset-0 border-2 rounded-xl animate-pulse"
              style={{ borderColor: threatStyle.color }}
            />
          )}
        </div>
      </div>

      {/* 底部数据流动效果 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl overflow-hidden"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${threatStyle.color}40 50%, transparent 100%)`,
        }}
      >
        <div
          className="h-full animate-pulse"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${threatStyle.color} 50%, transparent 100%)`,
            animation: "slideRight 3s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}

export function ThreatMetrics() {
  const {
    data: realTimeData,
    isUpdating,
    updateData,
  } = useRealTimeData(generateThreatMetrics, {
    interval: 5000,
    enabled: true,
  });

  const metrics = [
    {
      title: "实时威胁检测",
      value: realTimeData.realTimeThreats.toString(),
      change: Math.floor(Math.random() * 30) - 10,
      trend: Math.random() > 0.5 ? ("up" as const) : ("down" as const),
      icon: AlertTriangle,
      threatLevel:
        realTimeData.realTimeThreats > 45
          ? ("critical" as const)
          : ("high" as const),
      description: "过去1小时",
    },
    {
      title: "活跃连接监控",
      value: realTimeData.activeConnections.toLocaleString(),
      change: Math.floor(Math.random() * 10) - 5,
      trend: Math.random() > 0.5 ? ("up" as const) : ("down" as const),
      icon: Eye,
      threatLevel: "info" as const,
      description: "当前连接数",
    },
    {
      title: "防火墙拦截",
      value: realTimeData.blockedAttacks.toString(),
      change: Math.floor(Math.random() * 20) - 5,
      trend: "up" as const,
      icon: Shield,
      threatLevel: "medium" as const,
      description: "今日拦截次数",
    },
    {
      title: "系统性能",
      value: `${realTimeData.systemHealth}%`,
      change: Math.floor(Math.random() * 3),
      trend: "up" as const,
      icon: Zap,
      threatLevel:
        realTimeData.systemHealth > 96 ? ("low" as const) : ("medium" as const),
      description: "运行稳定性",
    },
  ];

  return (
    <div
      className="space-y-6 p-6 rounded-xl backdrop-blur-md relative overflow-hidden"
      style={{
        background: BACKEND_COLORS.backgrounds.panel,
        border: `1px solid ${BACKEND_COLORS.borders.primary}`,
        boxShadow: BACKEND_COLORS.shadows.large,
      }}
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-64 h-64 opacity-5"
          style={{
            background: `radial-gradient(circle at center, rgb(var(--brand-primary)) 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* 控制区域 */}
      <div className="flex items-center justify-between relative z-10">
        <h2
          className="text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
          style={{
            backgroundImage: `linear-gradient(45deg,
              ${BACKEND_COLORS.text.primary} 0%,
              ${BACKEND_COLORS.text.accent} 100%)`,
            textShadow: `0 0 20px rgba(var(--brand-primary), 0.3)`,
          }}
        >
          实时威胁监控
        </h2>

        <button
          onClick={updateData}
          disabled={isUpdating}
          className="flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: isUpdating
              ? BACKEND_COLORS.buttons.secondary.background
              : BACKEND_COLORS.buttons.primary.background,
            color: BACKEND_COLORS.buttons.primary.text,
            border: `1px solid ${BACKEND_COLORS.borders.accent}`,
            boxShadow: isUpdating
              ? BACKEND_COLORS.buttons.secondary.shadow
              : BACKEND_COLORS.buttons.primary.shadow,
          }}
        >
          <RefreshCw
            className={cn(
              "w-5 h-5 transition-transform duration-300",
              isUpdating && "animate-spin",
            )}
            style={{
              filter: `drop-shadow(0 0 6px ${BACKEND_COLORS.text.glow}60)`,
            }}
          />
          <span className="font-medium">
            {isUpdating ? "更新中..." : "手动刷新"}
          </span>
        </button>
      </div>

      {/* 指标卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} isUpdating={isUpdating} />
        ))}
      </div>
    </div>
  );
}
