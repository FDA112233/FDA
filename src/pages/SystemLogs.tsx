import React, { useState, useEffect } from "react";
import {
  FileText,
  Search,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  Clock,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Eye,
  Server,
  User,
  Shield,
} from "lucide-react";
import {
  BusinessCard,
  StatusCard,
  DataTableCard,
} from "@/components/ui/BusinessCard";
import { BUSINESS_COLORS } from "@/lib/businessColors";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error" | "debug";
  source: string;
  message: string;
  user?: string;
  ip?: string;
  action?: string;
  category: "auth" | "system" | "security" | "audit" | "network";
}

export default function SystemLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  // 模拟日志数据
  useEffect(() => {
    const mockLogs: LogEntry[] = [
      {
        id: "log-001",
        timestamp: "2024-01-15T14:30:22.123Z",
        level: "info",
        source: "AuthService",
        message: "用户登录成功",
        user: "zhang.security",
        ip: "192.168.1.100",
        action: "LOGIN",
        category: "auth",
      },
      {
        id: "log-002",
        timestamp: "2024-01-15T14:25:15.456Z",
        level: "warning",
        source: "FirewallService",
        message: "检测到可疑端口扫描活动",
        ip: "203.0.113.45",
        action: "PORT_SCAN_DETECTED",
        category: "security",
      },
      {
        id: "log-003",
        timestamp: "2024-01-15T14:20:08.789Z",
        level: "error",
        source: "DatabaseService",
        message: "数据库连接失败，尝试重连",
        action: "DB_CONNECTION_FAILED",
        category: "system",
      },
      {
        id: "log-004",
        timestamp: "2024-01-15T14:15:33.012Z",
        level: "info",
        source: "AssetScanner",
        message: "资产发现扫描完成，发现342个设备",
        action: "ASSET_SCAN_COMPLETED",
        category: "network",
      },
      {
        id: "log-005",
        timestamp: "2024-01-15T14:10:45.345Z",
        level: "warning",
        source: "ThreatDetector",
        message: "发现恶意文件，已隔离处理",
        ip: "192.168.1.205",
        action: "MALWARE_QUARANTINED",
        category: "security",
      },
    ];
    setLogs(mockLogs);
  }, []);

  // 过滤日志
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.user && log.user.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLevel = filterLevel === "all" || log.level === filterLevel;
    const matchesCategory =
      filterCategory === "all" || log.category === filterCategory;

    return matchesSearch && matchesLevel && matchesCategory;
  });

  // 获取日志级别颜色
  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return BUSINESS_COLORS.status.error;
      case "warning":
        return BUSINESS_COLORS.status.warning;
      case "info":
        return BUSINESS_COLORS.status.info;
      case "debug":
        return BUSINESS_COLORS.neutral.silver;
      default:
        return BUSINESS_COLORS.neutral.silver;
    }
  };

  // 获取日志级别图标
  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error":
        return XCircle;
      case "warning":
        return AlertTriangle;
      case "info":
        return Info;
      case "debug":
        return CheckCircle;
      default:
        return Info;
    }
  };

  // 统计数据
  const logStats = {
    total: logs.length,
    errors: logs.filter((l) => l.level === "error").length,
    warnings: logs.filter((l) => l.level === "warning").length,
    security: logs.filter((l) => l.category === "security").length,
  };

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
              <FileText
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
                系统日志
              </h1>
              <p style={{ color: BUSINESS_COLORS.neutral.silver }}>
                系统运行日志查看和安全审计记录
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsAutoRefresh(!isAutoRefresh)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                isAutoRefresh ? "animate-pulse" : ""
              }`}
              style={{
                backgroundColor: isAutoRefresh
                  ? BUSINESS_COLORS.status.success
                  : BUSINESS_COLORS.ui.background.panel,
                color: isAutoRefresh
                  ? "white"
                  : BUSINESS_COLORS.ui.text.secondary,
                border: `1px solid ${BUSINESS_COLORS.ui.border.primary}`,
              }}
            >
              <RefreshCw
                className={`w-4 h-4 ${isAutoRefresh ? "animate-spin" : ""}`}
              />
              <span className="text-sm">
                {isAutoRefresh ? "自动刷新" : "手动刷新"}
              </span>
            </button>

            <button
              className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200"
              style={{
                backgroundColor: BUSINESS_COLORS.ui.background.panel,
                color: BUSINESS_COLORS.ui.text.secondary,
                border: `1px solid ${BUSINESS_COLORS.ui.border.primary}`,
              }}
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">导出日志</span>
            </button>
          </div>
        </div>
      </div>

      {/* 统计指标 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatusCard
          title="总日志数"
          value={logStats.total.toLocaleString()}
          icon={<FileText className="w-5 h-5" />}
          status="info"
        />

        <StatusCard
          title="错误日志"
          value={logStats.errors}
          icon={<XCircle className="w-5 h-5" />}
          status="error"
        />

        <StatusCard
          title="警告日志"
          value={logStats.warnings}
          icon={<AlertTriangle className="w-5 h-5" />}
          status="warning"
        />

        <StatusCard
          title="安全事件"
          value={logStats.security}
          icon={<Shield className="w-5 h-5" />}
          status="warning"
        />
      </div>

      {/* 搜索和过滤 */}
      <BusinessCard className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                style={{ color: BUSINESS_COLORS.ui.text.muted }}
              />
              <input
                type="text"
                placeholder="搜索日志内容、来源或用户..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  borderColor: BUSINESS_COLORS.ui.border.primary,
                  backgroundColor: BUSINESS_COLORS.ui.background.card,
                  color: BUSINESS_COLORS.ui.text.primary,
                }}
              />
            </div>

            <div className="flex gap-3">
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  borderColor: BUSINESS_COLORS.ui.border.primary,
                  backgroundColor: BUSINESS_COLORS.ui.background.card,
                  color: BUSINESS_COLORS.ui.text.primary,
                }}
              >
                <option value="all">所有级别</option>
                <option value="error">错误</option>
                <option value="warning">警告</option>
                <option value="info">信息</option>
                <option value="debug">调试</option>
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  borderColor: BUSINESS_COLORS.ui.border.primary,
                  backgroundColor: BUSINESS_COLORS.ui.background.card,
                  color: BUSINESS_COLORS.ui.text.primary,
                }}
              >
                <option value="all">所有分类</option>
                <option value="auth">认证</option>
                <option value="system">系统</option>
                <option value="security">安全</option>
                <option value="audit">审计</option>
                <option value="network">网络</option>
              </select>
            </div>
          </div>
        </div>
      </BusinessCard>

      {/* 日志列表 */}
      <DataTableCard
        title="系统日志记录"
        description={`共 ${filteredLogs.length} 条日志记录`}
        data={filteredLogs}
        columns={[
          {
            key: "level",
            label: "级别",
            render: (value) => {
              const Icon = getLevelIcon(value);
              return (
                <div className="flex items-center space-x-2">
                  <Icon
                    className="w-4 h-4"
                    style={{ color: getLevelColor(value) }}
                  />
                  <span
                    className="font-medium text-sm uppercase"
                    style={{ color: getLevelColor(value) }}
                  >
                    {value}
                  </span>
                </div>
              );
            },
          },
          {
            key: "timestamp",
            label: "时间",
            render: (value) => (
              <div>
                <p className="text-sm font-mono">
                  {new Date(value).toLocaleDateString("zh-CN")}
                </p>
                <p
                  className="text-xs font-mono"
                  style={{ color: BUSINESS_COLORS.ui.text.muted }}
                >
                  {new Date(value).toLocaleTimeString("zh-CN")}
                </p>
              </div>
            ),
          },
          {
            key: "source",
            label: "来源",
            render: (value) => (
              <div className="flex items-center space-x-2">
                <Server
                  className="w-3 h-3"
                  style={{ color: BUSINESS_COLORS.ui.text.muted }}
                />
                <span
                  className="text-sm font-mono"
                  style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                >
                  {value}
                </span>
              </div>
            ),
          },
          {
            key: "message",
            label: "消息内容",
            render: (value, row) => (
              <div>
                <p className="text-sm">{value}</p>
                {row.action && (
                  <span
                    className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-mono"
                    style={{
                      backgroundColor: `${BUSINESS_COLORS.primary.blue}20`,
                      color: BUSINESS_COLORS.primary.blue,
                    }}
                  >
                    {row.action}
                  </span>
                )}
              </div>
            ),
          },
          {
            key: "category",
            label: "分类",
            render: (value) => (
              <span
                className="px-2 py-1 rounded text-xs font-medium"
                style={{
                  backgroundColor: `${BUSINESS_COLORS.neutral.lightGray}40`,
                  color: BUSINESS_COLORS.ui.text.secondary,
                }}
              >
                {value === "auth"
                  ? "认证"
                  : value === "system"
                    ? "系统"
                    : value === "security"
                      ? "安全"
                      : value === "audit"
                        ? "��计"
                        : "网络"}
              </span>
            ),
          },
          {
            key: "user",
            label: "用户/IP",
            render: (value, row) => (
              <div>
                {value && (
                  <div className="flex items-center space-x-2">
                    <User
                      className="w-3 h-3"
                      style={{ color: BUSINESS_COLORS.ui.text.muted }}
                    />
                    <span className="text-sm">{value}</span>
                  </div>
                )}
                {row.ip && (
                  <p
                    className="text-xs font-mono mt-1"
                    style={{ color: BUSINESS_COLORS.ui.text.muted }}
                  >
                    {row.ip}
                  </p>
                )}
              </div>
            ),
          },
          {
            key: "actions",
            label: "操作",
            render: () => (
              <button
                className="p-1 rounded transition-colors"
                style={{ color: BUSINESS_COLORS.ui.text.muted }}
              >
                <Eye className="w-4 h-4" />
              </button>
            ),
          },
        ]}
      />
    </div>
  );
}
