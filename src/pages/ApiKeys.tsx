import React, { useState, useEffect } from "react";
import {
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  AlertTriangle,
  Wifi,
  WifiOff,
  Server,
  Database,
  Shield,
  Users,
  Globe,
  Zap,
} from "lucide-react";
import {
  BusinessCard,
  StatusCard,
  DataTableCard,
} from "@/components/ui/BusinessCard";
import { BUSINESS_COLORS } from "@/lib/businessColors";
import { API_CONFIG, API_ENDPOINTS } from "@/lib/apiConfig";

interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  method: string;
  category: string;
  description: string;
  status: "online" | "offline" | "slow" | "error" | "checking";
  responseTime?: number;
  lastChecked?: string;
  uptime: number;
  errorCount: number;
  avgResponseTime: number;
}

export default function ApiStatusMonitor() {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [lastGlobalCheck, setLastGlobalCheck] = useState<Date | null>(null);

  // 初始化API端点数据
  useEffect(() => {
    const initialEndpoints: ApiEndpoint[] = [
      {
        id: "health",
        name: "健康检查",
        url: "/health",
        method: "GET",
        category: "核心服务",
        description: "系统健康状态检查",
        status: "checking",
        uptime: 99.9,
        errorCount: 1,
        avgResponseTime: 45,
      },
      {
        id: "metrics-summary",
        name: "系统指标摘要",
        url: "/api/v1/metrics/summary/",
        method: "GET",
        category: "监控数据",
        description: "获取系统指标摘要信息",
        status: "checking",
        uptime: 98.5,
        errorCount: 12,
        avgResponseTime: 120,
      },
      {
        id: "metrics-current",
        name: "当前系统指标",
        url: "/api/v1/metrics/current/",
        method: "GET",
        category: "监控数据",
        description: "获取当前实时系统指标",
        status: "checking",
        uptime: 97.8,
        errorCount: 25,
        avgResponseTime: 180,
      },
      {
        id: "network-interfaces",
        name: "网络接口状态",
        url: "/api/v1/metrics/network-interfaces/current/",
        method: "GET",
        category: "网络监控",
        description: "获取当前网络接口状态",
        status: "checking",
        uptime: 99.2,
        errorCount: 8,
        avgResponseTime: 95,
      },
      {
        id: "processes",
        name: "进程监控",
        url: "/api/v1/system/processes",
        method: "GET",
        category: "系统监控",
        description: "获取系统进程信息",
        status: "checking",
        uptime: 96.5,
        errorCount: 35,
        avgResponseTime: 250,
      },
      {
        id: "network-connections",
        name: "网络连接",
        url: "/api/v1/system/network",
        method: "GET",
        category: "网络监控",
        description: "获取网络连接状态",
        status: "checking",
        uptime: 95.1,
        errorCount: 48,
        avgResponseTime: 320,
      },
      {
        id: "services",
        name: "服务状态",
        url: "/api/v1/system/services",
        method: "GET",
        category: "系统监控",
        description: "获取系统服务状态",
        status: "checking",
        uptime: 98.9,
        errorCount: 5,
        avgResponseTime: 85,
      },
      {
        id: "auth-me",
        name: "用户认证",
        url: "/api/v1/auth/auth/me",
        method: "GET",
        category: "认证服务",
        description: "获取当前用户信息",
        status: "checking",
        uptime: 99.7,
        errorCount: 2,
        avgResponseTime: 65,
      },
      {
        id: "log-levels",
        name: "日志管理",
        url: "/api/v1/logs/log-levels",
        method: "GET",
        category: "系统管理",
        description: "获取日志级别配置",
        status: "checking",
        uptime: 99.1,
        errorCount: 6,
        avgResponseTime: 75,
      },
    ];

    setEndpoints(initialEndpoints);
  }, []);

  // 检查单个端点状态
  const checkEndpoint = async (endpoint: ApiEndpoint): Promise<ApiEndpoint> => {
    const startTime = Date.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 减少超时时间

      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint.url}`, {
        method: endpoint.method,
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      let status: ApiEndpoint["status"];
      if (response.ok) {
        status = responseTime > 1000 ? "slow" : "online";
      } else {
        status = "error";
      }

      return {
        ...endpoint,
        status,
        responseTime,
        lastChecked: new Date().toISOString(),
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;

      // 静默处理错误，不输出到控制台
      return {
        ...endpoint,
        status: "offline",
        responseTime,
        lastChecked: new Date().toISOString(),
      };
    }
  };

  // 检查所有端点状态
  const checkAllEndpoints = async () => {
    if (isChecking) return; // 防止重复检查

    setIsChecking(true);
    console.log(`🔍 开始检查 ${endpoints.length} 个API端点`);

    // 设置所有端点为检查中状态
    setEndpoints((prev) =>
      prev.map((endpoint) => ({ ...endpoint, status: "checking" as const }))
    );

    try {
      // 依次检查，避免并发太多请求
      const results = [];
      for (const endpoint of endpoints) {
        const result = await checkEndpoint(endpoint);
        results.push(result);

        // 更新单个结果
        setEndpoints((prev) =>
          prev.map((ep) => (ep.id === result.id ? result : ep))
        );

        // 短暂延迟避免请求过快
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      setLastGlobalCheck(new Date());
      console.log(`✅ 检查完成: ${results.filter(r => r.status === 'online').length}/${results.length} 在线`);
    } catch (error) {
      console.warn("API状态检查过程中断:", error);
    } finally {
      setIsChecking(false);
    }
  };

  // 获取状态图标
  const getStatusIcon = (status: ApiEndpoint["status"]) => {
    switch (status) {
      case "online":
        return <CheckCircle className="w-4 h-4" style={{ color: BUSINESS_COLORS.status.success }} />;
      case "offline":
        return <XCircle className="w-4 h-4" style={{ color: BUSINESS_COLORS.status.error }} />;
      case "slow":
        return <Clock className="w-4 h-4" style={{ color: BUSINESS_COLORS.status.warning }} />;
      case "error":
        return <AlertTriangle className="w-4 h-4" style={{ color: BUSINESS_COLORS.status.error }} />;
      case "checking":
        return <RefreshCw className="w-4 h-4 animate-spin" style={{ color: BUSINESS_COLORS.neutral.silver }} />;
      default:
        return <XCircle className="w-4 h-4" style={{ color: BUSINESS_COLORS.neutral.silver }} />;
    }
  };

  // 获取状态颜色
  const getStatusColor = (status: ApiEndpoint["status"]) => {
    switch (status) {
      case "online":
        return BUSINESS_COLORS.status.success;
      case "offline":
        return BUSINESS_COLORS.status.error;
      case "slow":
        return BUSINESS_COLORS.status.warning;
      case "error":
        return BUSINESS_COLORS.status.error;
      case "checking":
        return BUSINESS_COLORS.neutral.silver;
      default:
        return BUSINESS_COLORS.neutral.silver;
    }
  };

  // 获取状态文本
  const getStatusText = (status: ApiEndpoint["status"]) => {
    switch (status) {
      case "online":
        return "正常";
      case "offline":
        return "离线";
      case "slow":
        return "缓慢";
      case "error":
        return "错误";
      case "checking":
        return "检查中";
      default:
        return "未知";
    }
  };

  // 获取分类图标
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "核心服务":
        return <Server className="w-5 h-5" />;
      case "监控数据":
        return <Activity className="w-5 h-5" />;
      case "网络监控":
        return <Globe className="w-5 h-5" />;
      case "系统监控":
        return <Database className="w-5 h-5" />;
      case "认证服务":
        return <Shield className="w-5 h-5" />;
      case "系统管理":
        return <Zap className="w-5 h-5" />;
      default:
        return <Server className="w-5 h-5" />;
    }
  };

  // 统计数据
  const stats = {
    total: endpoints.length,
    online: endpoints.filter((e) => e.status === "online").length,
    offline: endpoints.filter((e) => e.status === "offline" || e.status === "error").length,
    avgUptime: endpoints.reduce((sum, e) => sum + e.uptime, 0) / endpoints.length,
  };

  // 移除自动检查功能，避免产生大量网络错误
  useEffect(() => {
    // 不自动运行检查，只在用户手动点击时运行
    console.log("🔧 API状态监控已加载，点击'立即检查'按钮开始检测");
  }, []);

  return (
    <div
      className="p-8 pt-16 lg:pt-8 min-h-screen"
      style={{ backgroundColor: BUSINESS_COLORS.ui.background.secondary }}
    >
      {/* 页面标题 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: BUSINESS_COLORS.primary.blue,
                boxShadow: BUSINESS_COLORS.shadows.lg,
              }}
            >
              <Activity
                className="w-6 h-6"
                style={{
                  color: `rgb(var(--brand-lightest))`,
                  filter: `drop-shadow(0 0 8px rgba(var(--brand-accent), 0.6))`,
                }}
              />
            </div>
            <div>
              <h1
                className="text-3xl font-bold"
                style={{ color: BUSINESS_COLORS.ui.text.inverse }}
              >
                API状态监控
              </h1>
              <p style={{ color: BUSINESS_COLORS.neutral.silver }}>
                检测所有API端点的运行状态和性能指标（点击"开始检测"进行检查）
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href="/settings"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: BUSINESS_COLORS.neutral.silver,
                color: BUSINESS_COLORS.ui.text.primary,
                textShadow: `0 0 8px rgba(var(--brand-lightest), 0.3)`,
                boxShadow: BUSINESS_COLORS.shadows.sm,
              }}
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">API设置</span>
            </a>

            <button
              onClick={checkAllEndpoints}
              disabled={isChecking}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 hover:scale-105"
              style={{
                backgroundColor: isChecking ? BUSINESS_COLORS.neutral.silver : BUSINESS_COLORS.primary.blue,
                color: `rgb(var(--brand-lightest))`,
                textShadow: `0 0 8px rgba(var(--brand-lightest), 0.5)`,
                boxShadow: BUSINESS_COLORS.shadows.md,
              }}
            >
            <RefreshCw className={`w-4 h-4 ${isChecking ? "animate-spin" : ""}`} />
            <span className="text-sm font-medium">
              {isChecking ? "检查中..." : "开始检测"}
            </span>
          </button>
        </div>
      </div>

      {/* 全局状态卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatusCard
          title="总端点数"
          value={stats.total}
          icon={<Server className="w-5 h-5" />}
          status="info"
        />

        <StatusCard
          title="在线服务"
          value={stats.online}
          icon={<CheckCircle className="w-5 h-5" />}
          status="success"
        />

        <StatusCard
          title="离线/错误"
          value={stats.offline}
          icon={<XCircle className="w-5 h-5" />}
          status="error"
        />

        <StatusCard
          title="平均可用性"
          value={`${stats.avgUptime.toFixed(1)}%`}
          icon={<Activity className="w-5 h-5" />}
          status="info"
        />
      </div>

      {/* API端点状态列表 */}
      <DataTableCard
        title="API端点监控"
        description={`共监控 ${endpoints.length} 个API端点 ${lastGlobalCheck ? `• 上次检查: ${lastGlobalCheck.toLocaleString()}` : ""}`}
        data={endpoints}
        columns={[
          {
            key: "name",
            label: "服务名称",
            render: (value, row) => (
              <div className="flex items-center space-x-3">
                {getCategoryIcon(row.category)}
                <div>
                  <p className="font-medium text-sm">{value}</p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: BUSINESS_COLORS.ui.text.muted }}
                  >
                    {row.description}
                  </p>
                </div>
              </div>
            ),
          },
          {
            key: "url",
            label: "端点地址",
            render: (value, row) => (
              <div>
                <code
                  className="text-sm font-mono px-2 py-1 rounded"
                  style={{
                    backgroundColor: BUSINESS_COLORS.ui.background.tertiary,
                    color: BUSINESS_COLORS.ui.text.primary,
                  }}
                >
                  {row.method} {value}
                </code>
                <p
                  className="text-xs mt-1"
                  style={{ color: BUSINESS_COLORS.ui.text.muted }}
                >
                  {row.category}
                </p>
              </div>
            ),
          },
          {
            key: "status",
            label: "状态",
            render: (value, row) => (
              <div className="flex items-center space-x-2">
                {getStatusIcon(value)}
                <span className="text-sm font-medium">
                  {getStatusText(value)}
                </span>
                {row.responseTime && (
                  <span
                    className="text-xs"
                    style={{ color: BUSINESS_COLORS.ui.text.muted }}
                  >
                    ({row.responseTime}ms)
                  </span>
                )}
              </div>
            ),
          },
          {
            key: "uptime",
            label: "可用性",
            render: (value) => (
              <div className="text-right">
                <div
                  className="text-sm font-medium"
                  style={{
                    color:
                      value >= 99
                        ? BUSINESS_COLORS.status.success
                        : value >= 95
                          ? BUSINESS_COLORS.status.warning
                          : BUSINESS_COLORS.status.error,
                  }}
                >
                  {value.toFixed(1)}%
                </div>
                <div
                  className="w-full bg-gray-600 rounded-full h-1.5 mt-1"
                  style={{ backgroundColor: BUSINESS_COLORS.ui.background.tertiary }}
                >
                  <div
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: `${value}%`,
                      backgroundColor:
                        value >= 99
                          ? BUSINESS_COLORS.status.success
                          : value >= 95
                            ? BUSINESS_COLORS.status.warning
                            : BUSINESS_COLORS.status.error,
                    }}
                  />
                </div>
              </div>
            ),
          },
          {
            key: "avgResponseTime",
            label: "平均响应时间",
            render: (value) => (
              <div className="text-right">
                <span
                  className="text-sm font-mono"
                  style={{
                    color:
                      value <= 100
                        ? BUSINESS_COLORS.status.success
                        : value <= 500
                          ? BUSINESS_COLORS.status.warning
                          : BUSINESS_COLORS.status.error,
                  }}
                >
                  {value}ms
                </span>
              </div>
            ),
          },
          {
            key: "errorCount",
            label: "24h错误次数",
            render: (value) => (
              <div className="text-right">
                <span
                  className="text-sm font-medium"
                  style={{
                    color:
                      value === 0
                        ? BUSINESS_COLORS.status.success
                        : value <= 10
                          ? BUSINESS_COLORS.status.warning
                          : BUSINESS_COLORS.status.error,
                  }}
                >
                  {value}
                </span>
              </div>
            ),
          },
          {
            key: "lastChecked",
            label: "最后检查",
            render: (value) => (
              <div className="text-right">
                {value ? (
                  <>
                    <p className="text-sm">
                      {new Date(value).toLocaleTimeString("zh-CN")}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: BUSINESS_COLORS.ui.text.muted }}
                    >
                      {new Date(value).toLocaleDateString("zh-CN")}
                    </p>
                  </>
                ) : (
                  <span
                    className="text-sm"
                    style={{ color: BUSINESS_COLORS.ui.text.muted }}
                  >
                    未检查
                  </span>
                )}
              </div>
            ),
          },
        ]}
      />

      {/* 监控说明 */}
      <BusinessCard className="mt-8">
        <div>
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: BUSINESS_COLORS.ui.text.primary }}
          >
            监控说明
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4
                className="font-medium mb-2"
                style={{ color: BUSINESS_COLORS.ui.text.primary }}
              >
                状态定义
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" style={{ color: BUSINESS_COLORS.status.success }} />
                  <span style={{ color: BUSINESS_COLORS.ui.text.secondary }}>
                    正常: 响应时间 {"<="} 1秒，状态码 200
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" style={{ color: BUSINESS_COLORS.status.warning }} />
                  <span style={{ color: BUSINESS_COLORS.ui.text.secondary }}>
                    缓慢: 响应时间 {">"} 1秒，状态码 200
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <XCircle className="w-4 h-4" style={{ color: BUSINESS_COLORS.status.error }} />
                  <span style={{ color: BUSINESS_COLORS.ui.text.secondary }}>
                    离线: 网络连接失败或超时
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" style={{ color: BUSINESS_COLORS.status.error }} />
                  <span style={{ color: BUSINESS_COLORS.ui.text.secondary }}>
                    错误: 状态码非 200
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h4
                className="font-medium mb-2"
                style={{ color: BUSINESS_COLORS.ui.text.primary }}
              >
                监控配置
              </h4>
              <div className="space-y-2 text-sm">
                <div style={{ color: BUSINESS_COLORS.ui.text.secondary }}>
                  • 检查方式: 手动触发
                </div>
                <div style={{ color: BUSINESS_COLORS.ui.text.secondary }}>
                  • 超时设置: 3秒
                </div>
                <div style={{ color: BUSINESS_COLORS.ui.text.secondary }}>
                  • 目标服务器: {API_CONFIG.BASE_URL}
                </div>
                <div style={{ color: BUSINESS_COLORS.ui.text.secondary }}>
                  • 检查间隔: 200ms/端点
                </div>
              </div>
            </div>
          </div>
        </div>
      </BusinessCard>
    </div>
  );
}