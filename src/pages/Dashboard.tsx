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

          <p
            className="text-3xl font-bold mb-2 transition-all duration-300"
            style={{
              color: color,
              textShadow: `0 0 16px ${color}40`,
            }}
          >
            {value}
          </p>

          {description && (
            <p
              className="text-xs mb-2"
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

          {isUpdating && (
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
  const [systemData, setSystemData] = useState({
    cpu: 23,
    memory: 67,
    disk: 45,
    network: 89,
    uptime: "15天 7小时",
    lastUpdate: new Date(),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemData((prev) => ({
        ...prev,
        cpu: Math.max(10, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(
          30,
          Math.min(95, prev.memory + (Math.random() - 0.5) * 5),
        ),
        network: Math.max(
          50,
          Math.min(100, prev.network + (Math.random() - 0.5) * 8),
        ),
        lastUpdate: new Date(),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (
    value: number,
    type: "cpu" | "memory" | "disk" | "network",
  ) => {
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
              backgroundColor: `rgb(var(--success))`,
              boxShadow: `0 0 12px rgba(var(--success), 0.6)`,
            }}
          />
          <span
            className="text-sm"
            style={{ color: BACKEND_COLORS.text.secondary }}
          >
            ��统正常
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "CPU", value: systemData.cpu, icon: Cpu, unit: "%" },
          {
            label: "内存",
            value: systemData.memory,
            icon: HardDrive,
            unit: "%",
          },
          { label: "磁盘", value: systemData.disk, icon: HardDrive, unit: "%" },
          { label: "网络", value: systemData.network, icon: Wifi, unit: "%" },
        ].map((item, index) => (
          <div
            key={index}
            className="p-4 rounded-lg transition-all duration-300 hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${getStatusColor(item.value, item.label.toLowerCase() as any)}15 0%, ${getStatusColor(item.value, item.label.toLowerCase() as any)}05 100%)`,
              border: `1px solid ${getStatusColor(item.value, item.label.toLowerCase() as any)}30`,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <item.icon
                className="w-5 h-5"
                style={{
                  color: getStatusColor(
                    item.value,
                    item.label.toLowerCase() as any,
                  ),
                  filter: `drop-shadow(0 0 6px ${getStatusColor(item.value, item.label.toLowerCase() as any)}60)`,
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
                  ),
                  textShadow: `0 0 8px ${getStatusColor(item.value, item.label.toLowerCase() as any)}40`,
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
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm">
        <div>
          <span style={{ color: BACKEND_COLORS.text.muted }}>运行时间: </span>
          <span style={{ color: BACKEND_COLORS.text.secondary }}>
            {systemData.uptime}
          </span>
        </div>
        <div>
          <span style={{ color: BACKEND_COLORS.text.muted }}>最后更新: </span>
          <span style={{ color: BACKEND_COLORS.text.secondary }}>
            {systemData.lastUpdate.toLocaleTimeString()}
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
      action: () => console.log("启动安全扫描"),
    },
    {
      title: "威胁分析",
      description: "分析最新威胁情报",
      icon: BarChart3,
      color: `rgb(var(--info))`,
      action: () => console.log("启动威胁分析"),
    },
    {
      title: "系统备份",
      description: "创建系统配置备份",
      icon: HardDrive,
      color: `rgb(var(--success))`,
      action: () => console.log("启动系统备份"),
    },
    {
      title: "用户审计",
      description: "查看用户活动日志",
      icon: Users,
      color: `rgb(var(--warning))`,
      action: () => console.log("启动用户审计"),
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

export default function Dashboard() {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  // 模拟数据更新
  const handleRefresh = () => {
    setIsUpdating(true);
    setTimeout(() => setIsUpdating(false), 2000);
  };

  // 主要统计数据
  const stats = [
    {
      title: "威胁检测",
      value: "1,247",
      change: -12,
      trend: "down" as const,
      icon: AlertTriangle,
      color: `rgb(var(--error))`,
      description: "过去24小时",
    },
    {
      title: "安全事件",
      value: "342",
      change: 8,
      trend: "up" as const,
      icon: Shield,
      color: `rgb(var(--warning))`,
      description: "今日新增",
    },
    {
      title: "在线设备",
      value: "2,856",
      change: 3,
      trend: "up" as const,
      icon: Server,
      color: `rgb(var(--success))`,
      description: "当前连接",
    },
    {
      title: "活跃用户",
      value: "1,892",
      change: -5,
      trend: "down" as const,
      icon: Users,
      color: `rgb(var(--info))`,
      description: "过去1小时",
    },
  ];

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
                欢迎回��，{user}
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
