import React, { useState, useEffect } from "react";
import {
  Shield,
  Activity,
  AlertTriangle,
  Server,
  Users,
  TrendingUp,
  TrendingDown,
  Eye,
  Globe,
  Clock,
  Cpu,
  HardDrive,
  Wifi,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Zap,
  BarChart3,
  PieChart,
  RefreshCw,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { BACKEND_COLORS } from "@/lib/backendTheme";
import { ThreatMetrics } from "@/components/dashboard/ThreatMetrics";
import { NetworkChart } from "@/components/dashboard/NetworkChart";
import { AlertsList } from "@/components/dashboard/AlertsList";
import { NetworkAnalysis } from "@/components/dashboard/NetworkAnalysis";
import { useSystemMetrics, useSystemStatus } from "@/hooks/useSystemMetrics";
import { useNetworkMetrics } from "@/hooks/useNetworkMetrics";
import { formatBytes, formatPercent } from "@/lib/apiConfig";

// 仪表板统计卡片组件
interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down";
  icon: React.ElementType;
  color: string;
  description?: string;
  isUpdating?: boolean;
  loading?: boolean;
  error?: boolean;
}

function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color,
  description,
  isUpdating = false,
  loading = false,
  error = false,
}: StatCardProps) {
  return (
    <div
      className="p-6 rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:-translate-y-1 relative overflow-hidden group"
      style={{
        background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
        border: `1px solid ${color}40`,
        boxShadow: `0 8px 32px ${color}20`,
      }}
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-32 h-32 opacity-10 transition-opacity duration-500 group-hover:opacity-20"
          style={{
            background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <Icon
              className="w-6 h-6 transition-all duration-300 group-hover:scale-110"
              style={{
                color: color,
                filter: `drop-shadow(0 0 8px ${color}60)`,
              }}
            />
            <h3
              className="text-sm font-medium"
              style={{ color: BACKEND_COLORS.text.secondary }}
            >
              {title}
            </h3>
          </div>

          {loading ? (
            <div className="flex items-center space-x-2 mb-2">
              <Loader2 className="w-6 h-6 animate-spin" style={{ color }} />
              <span
                className="text-sm"
                style={{ color: BACKEND_COLORS.text.muted }}
              >
                加载中...
              </span>
            </div>
          ) : error ? (
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle
                className="w-6 h-6"
                style={{ color: `rgb(var(--error))` }}
              />
              <span className="text-sm" style={{ color: `rgb(var(--error))` }}>
                数据获取失败
              </span>
            </div>
          ) : (
            <p
              className="text-3xl font-bold mb-2 transition-all duration-300"
              style={{
                color: color,
                textShadow: `0 0 16px ${color}40`,
              }}
            >
              {value}
            </p>
          )}

          {description && !loading && !error && (
            <p
              className="text-xs mb-2"
              style={{ color: BACKEND_COLORS.text.muted }}
            >
              {description}
            </p>
          )}

          {change !== undefined && !loading && !error && (
            <div className="flex items-center space-x-2">
              {trend === "up" ? (
                <TrendingUp
                  className="w-4 h-4"
                  style={{
                    color:
                      change > 0 ? `rgb(var(--error))` : `rgb(var(--success))`,
                    filter: `drop-shadow(0 0 6px ${change > 0 ? `rgba(var(--error), 0.6)` : `rgba(var(--success), 0.6)`})`,
                  }}
                />
              ) : (
                <TrendingDown
                  className="w-4 h-4"
                  style={{
                    color:
                      change < 0 ? `rgb(var(--success))` : `rgb(var(--error))`,
                    filter: `drop-shadow(0 0 6px ${change < 0 ? `rgba(var(--success), 0.6)` : `rgba(var(--error), 0.6)`})`,
                  }}
                />
              )}
              <span
                className="text-sm font-medium"
                style={{
                  color:
                    change > 0 ? `rgb(var(--error))` : `rgb(var(--success))`,
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

        {/* 右侧装饰图标 */}
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center relative group/icon"
          style={{
            background: `linear-gradient(135deg, ${color}30 0%, ${color}15 100%)`,
            border: `1px solid ${color}40`,
          }}
        >
          <Icon
            className="w-7 h-7 transition-all duration-300 group-hover/icon:scale-110 group-hover/icon:rotate-12"
            style={{
              color: color,
              filter: `drop-shadow(0 0 8px ${color}50)`,
            }}
          />

          {(isUpdating || loading) && (
            <div
              className="absolute inset-0 border-2 rounded-xl animate-pulse"
              style={{ borderColor: color }}
            />
          )}
        </div>
      </div>

      {/* 底部流动效果 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl overflow-hidden"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${color}40 50%, transparent 100%)`,
        }}
      >
        <div
          className="h-full"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
            animation: "slideRight 3s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}

// 系统状态组件
function SystemStatus() {
  const { formatted, loading, error, lastUpdated } = useSystemMetrics();
  const { summary } = useNetworkMetrics();
  const systemStatus = useSystemStatus();

  // 计算网络利用率（基于总流量的估算）
  const networkUtilization = summary?.totalTraffic
    ? Math.min(100, (summary.totalTraffic / (1024 * 1024 * 1024)) * 10) // 简化算法
    : 0;

  const getStatusColor = (
    value: number,
    type: "cpu" | "memory" | "disk" | "network",
    alert?: boolean,
  ) => {
    if (alert) return `rgb(var(--error))`;

    if (type === "network") {
      return value > 80
        ? `rgb(var(--success))`
        : value > 60
          ? `rgb(var(--warning))`
          : `rgb(var(--error))`;
    }
    return value > 80
      ? `rgb(var(--error))`
      : value > 60
        ? `rgb(var(--warning))`
        : `rgb(var(--success))`;
  };

  const getSystemStatusDisplay = () => {
    if (loading) return { status: "加载中...", color: `rgb(var(--info))` };
    if (error) return { status: "数据获取失败", color: `rgb(var(--error))` };
    if (!formatted)
      return { status: "数据不可用", color: `rgb(var(--warning))` };

    return {
      status: systemStatus.message,
      color: getStatusColor(systemStatus.score, "cpu"),
    };
  };

  const systemDisplayStatus = getSystemStatusDisplay();

  return (
    <div
      className="p-6 rounded-xl backdrop-blur-md relative overflow-hidden"
      style={{
        background: BACKEND_COLORS.backgrounds.card,
        border: `1px solid ${BACKEND_COLORS.borders.primary}`,
        boxShadow: BACKEND_COLORS.shadows.medium,
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3
          className="text-xl font-bold"
          style={{
            color: BACKEND_COLORS.text.primary,
            textShadow: `0 0 12px rgba(var(--brand-primary), 0.3)`,
          }}
        >
          系统状态监控
        </h3>
        <div className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded-full animate-pulse"
            style={{
              backgroundColor: systemDisplayStatus.color,
              boxShadow: `0 0 12px ${systemDisplayStatus.color}60`,
            }}
          />
          <span
            className="text-sm"
            style={{ color: BACKEND_COLORS.text.secondary }}
          >
            {systemDisplayStatus.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading ? (
          // 加载状态
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="p-4 rounded-lg animate-pulse"
              style={{
                background: `linear-gradient(135deg, rgba(var(--brand-primary), 0.1) 0%, rgba(var(--brand-primary), 0.05) 100%)`,
                border: `1px solid rgba(var(--brand-primary), 0.3)`,
              }}
            >
              <div className="h-5 bg-gray-600 rounded mb-2"></div>
              <div className="h-8 bg-gray-600 rounded"></div>
            </div>
          ))
        ) : error ? (
          // 错误状态
          <div
            className="col-span-4 p-4 rounded-lg text-center"
            style={{
              background: `linear-gradient(135deg, rgba(var(--error), 0.1) 0%, rgba(var(--error), 0.05) 100%)`,
              border: `1px solid rgba(var(--error), 0.3)`,
            }}
          >
            <p style={{ color: `rgb(var(--error))` }}>{error}</p>
          </div>
        ) : formatted ? (
          [
            {
              label: "CPU",
              value: formatted.cpu.percent,
              icon: Cpu,
              unit: "%",
              alert: formatted.cpu.alert,
            },
            {
              label: "内存",
              value: formatted.memory.percent,
              icon: HardDrive,
              unit: "%",
              alert: formatted.memory.alert,
            },
            {
              label: "磁盘",
              value: formatted.disk.percent,
              icon: HardDrive,
              unit: "%",
              alert: formatted.disk.alert,
            },
            {
              label: "网络",
              value: Math.round(networkUtilization),
              icon: Wifi,
              unit: "%",
              alert: false,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-lg transition-all duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${getStatusColor(item.value, item.label.toLowerCase() as any, item.alert)}15 0%, ${getStatusColor(item.value, item.label.toLowerCase() as any, item.alert)}05 100%)`,
                border: `1px solid ${getStatusColor(item.value, item.label.toLowerCase() as any, item.alert)}30`,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <item.icon
                  className="w-5 h-5"
                  style={{
                    color: getStatusColor(
                      item.value,
                      item.label.toLowerCase() as any,
                      item.alert,
                    ),
                    filter: `drop-shadow(0 0 6px ${getStatusColor(item.value, item.label.toLowerCase() as any, item.alert)}60)`,
                  }}
                />
                <span
                  className="text-xs font-medium"
                  style={{ color: BACKEND_COLORS.text.muted }}
                >
                  {item.label}
                </span>
              </div>
              <div className="text-2xl font-bold">
                <span
                  style={{
                    color: getStatusColor(
                      item.value,
                      item.label.toLowerCase() as any,
                      item.alert,
                    ),
                    textShadow: `0 0 8px ${getStatusColor(item.value, item.label.toLowerCase() as any, item.alert)}40`,
                  }}
                >
                  {item.value}
                </span>
                <span
                  className="text-sm ml-1"
                  style={{ color: BACKEND_COLORS.text.muted }}
                >
                  {item.unit}
                </span>
              </div>
              {item.alert && (
                <div className="flex items-center mt-2">
                  <AlertTriangle
                    className="w-4 h-4 mr-1"
                    style={{ color: `rgb(var(--error))` }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: `rgb(var(--error))` }}
                  >
                    警告
                  </span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div
            className="col-span-4 p-4 rounded-lg text-center"
            style={{
              background: `linear-gradient(135deg, rgba(var(--warning), 0.1) 0%, rgba(var(--warning), 0.05) 100%)`,
              border: `1px solid rgba(var(--warning), 0.3)`,
            }}
          >
            <p style={{ color: `rgb(var(--warning))` }}>数据不可用</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <div>
          <span style={{ color: BACKEND_COLORS.text.muted }}>运行时间: </span>
          <span style={{ color: BACKEND_COLORS.text.secondary }}>
            15天 7小时
          </span>
        </div>
        <div>
          <span style={{ color: BACKEND_COLORS.text.muted }}>最后更新: </span>
          <span style={{ color: BACKEND_COLORS.text.secondary }}>
            {lastUpdated ? lastUpdated.toLocaleTimeString() : "--:--:--"}
          </span>
        </div>
      </div>
    </div>
  );
}

// 快速操作组件
function QuickActions() {
  const quickActions = [
    {
      title: "安全扫描",
      description: "执行全系统安全扫描",
      icon: Shield,
      color: `rgb(var(--brand-primary))`,
      action: () => {},
    },
    {
      title: "威胁分析",
      description: "分析最新威胁情报",
      icon: BarChart3,
      color: `rgb(var(--info))`,
      action: () => {},
    },
    {
      title: "系统备份",
      description: "创建系统配置备份",
      icon: HardDrive,
      color: `rgb(var(--success))`,
      action: () => {},
    },
    {
      title: "用户审计",
      description: "查看用户活动日志",
      icon: Users,
      color: `rgb(var(--warning))`,
      action: () => {},
    },
  ];

  return (
    <div
      className="p-6 rounded-xl backdrop-blur-md"
      style={{
        background: BACKEND_COLORS.backgrounds.card,
        border: `1px solid ${BACKEND_COLORS.borders.primary}`,
        boxShadow: BACKEND_COLORS.shadows.medium,
      }}
    >
      <h3
        className="text-xl font-bold mb-6"
        style={{
          color: BACKEND_COLORS.text.primary,
          textShadow: `0 0 12px rgba(var(--brand-primary), 0.3)`,
        }}
      >
        快速操作
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="p-4 rounded-lg text-left transition-all duration-300 hover:scale-105 hover:-translate-y-1 group"
            style={{
              background: `linear-gradient(135deg, ${action.color}15 0%, ${action.color}05 100%)`,
              border: `1px solid ${action.color}30`,
            }}
          >
            <div className="flex items-start space-x-3">
              <action.icon
                className="w-6 h-6 transition-all duration-300 group-hover:scale-110"
                style={{
                  color: action.color,
                  filter: `drop-shadow(0 0 8px ${action.color}60)`,
                }}
              />
              <div className="flex-1">
                <h4
                  className="font-semibold mb-1"
                  style={{ color: action.color }}
                >
                  {action.title}
                </h4>
                <p
                  className="text-sm"
                  style={{ color: BACKEND_COLORS.text.muted }}
                >
                  {action.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// 主仪表板组件
export default function Dashboard() {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  // 使用系统和网络指标钩子
  const {
    summary: systemSummary,
    loading: systemLoading,
    error: systemError,
    refresh: refreshSystem,
  } = useSystemMetrics();

  const {
    summary: networkSummary,
    interfaces,
    loading: networkLoading,
    error: networkError,
    refresh: refreshNetwork,
  } = useNetworkMetrics();

  // 手动刷新所有数据
  const handleRefresh = async () => {
    setIsUpdating(true);
    try {
      await Promise.all([refreshSystem(), refreshNetwork()]);
    } catch (error) {
      console.error("刷新数据失败:", error);
    } finally {
      setTimeout(() => setIsUpdating(false), 2000);
    }
  };

  // ��于真实数据计算统计
  const getStatsFromData = () => {
    const hasError = systemError || networkError;
    const isLoading = systemLoading || networkLoading;

    return [
      {
        title: "威胁检测",
        value: hasError ? "--" : systemSummary?.alert_count || 0,
        change: -12,
        trend: "down" as const,
        icon: AlertTriangle,
        color: `rgb(var(--error))`,
        description: "过去24小时",
        loading: isLoading,
        error: !!hasError,
      },
      {
        title: "安全事件",
        value: hasError ? "--" : systemSummary?.has_alerts ? "活跃" : "正常",
        change: 8,
        trend: "up" as const,
        icon: Shield,
        color: `rgb(var(--warning))`,
        description: "今日状态",
        loading: isLoading,
        error: !!hasError,
      },
      {
        title: "在线设备",
        value: hasError ? "--" : networkSummary?.activeInterfaces || 0,
        change: 3,
        trend: "up" as const,
        icon: Server,
        color: `rgb(var(--success))`,
        description: "网络接口",
        loading: isLoading,
        error: !!hasError,
      },
      {
        title: "网络流量",
        value: hasError
          ? "--"
          : networkSummary
            ? formatBytes(networkSummary.totalTraffic)
            : "--",
        change: -5,
        trend: "down" as const,
        icon: Activity,
        color: `rgb(var(--info))`,
        description: "总流量",
        loading: isLoading,
        error: !!hasError,
      },
    ];
  };

  const stats = getStatsFromData();

  return (
    <div
      className="p-6 min-h-screen relative overflow-hidden"
      style={{
        background: BACKEND_COLORS.backgrounds.secondary,
      }}
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at 25% 25%, rgba(var(--brand-primary), 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 75% 75%, rgba(var(--brand-accent), 0.08) 0%, transparent 50%)`,
          }}
        />
      </div>

      <div className="relative z-10 space-y-8">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-3xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(45deg,
                  ${BACKEND_COLORS.text.primary} 0%,
                  ${BACKEND_COLORS.text.accent} 100%)`,
                textShadow: `0 0 20px rgba(var(--brand-primary), 0.3)`,
              }}
            >
              安全控制台
            </h1>
            <div className="flex items-center space-x-4 text-sm">
              <span style={{ color: BACKEND_COLORS.text.muted }}>
                欢迎回来，{user}
              </span>
              <div className="flex items-center space-x-2">
                <Clock
                  className="w-4 h-4"
                  style={{ color: BACKEND_COLORS.text.muted }}
                />
                <span style={{ color: BACKEND_COLORS.text.muted }}>
                  {new Date().toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isUpdating}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
            style={{
              background: BACKEND_COLORS.buttons.primary.background,
              color: BACKEND_COLORS.buttons.primary.text,
              boxShadow: BACKEND_COLORS.buttons.primary.shadow,
            }}
          >
            <RefreshCw
              className={`w-5 h-5 ${isUpdating ? "animate-spin" : ""}`}
            />
            <span>刷新数据</span>
          </button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} isUpdating={isUpdating} />
          ))}
        </div>

        {/* 威胁监控模块 */}
        <ThreatMetrics />

        {/* 系统状态和快速操作 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SystemStatus />
          <QuickActions />
        </div>

        {/* 网络分析和图表 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <NetworkChart />
          <AlertsList />
        </div>

        {/* 网络分析详情 */}
        <NetworkAnalysis />
      </div>
    </div>
  );
}
