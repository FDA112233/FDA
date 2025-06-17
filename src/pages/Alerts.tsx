import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Shield,
  Activity,
  Clock,
  MapPin,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  BusinessCard,
  StatusCard,
  InfoCard,
  DataTableCard,
} from "@/components/ui/BusinessCard";
import { BUSINESS_COLORS } from "@/lib/businessColors";

interface ThreatAlert {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  status: "active" | "investigating" | "acknowledged" | "resolved" | "ignored";
  timestamp: string;
  source: {
    ip: string;
    hostname?: string;
    location?: string;
  };
  target?: {
    ip: string;
    hostname?: string;
    port?: number;
    service?: string;
  };
  category: string;
  assignee?: string;
}

export default function Alerts() {
  const [alerts, setAlerts] = useState<ThreatAlert[]>([]);
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  // 模拟威胁数据
  useEffect(() => {
    const mockAlerts: ThreatAlert[] = [
      {
        id: "alert-001",
        title: "可疑登录尝试",
        description: "检测到多次失败的登录尝试，可能是暴力破解攻击",
        severity: "high",
        status: "active",
        timestamp: "2024-01-15T14:25:30Z",
        source: {
          ip: "203.0.113.45",
          location: "俄罗斯，莫斯科",
        },
        target: {
          ip: "192.168.1.100",
          hostname: "server-01",
          port: 22,
          service: "SSH",
        },
        category: "认证威胁",
        assignee: "张安全",
      },
      {
        id: "alert-002",
        title: "恶意软件检测",
        description: "在工作站上发现已知恶意软件签名",
        severity: "critical",
        status: "investigating",
        timestamp: "2024-01-15T13:45:22Z",
        source: {
          ip: "192.168.1.205",
          hostname: "workstation-205",
        },
        category: "恶意软件",
        assignee: "李防护",
      },
      {
        id: "alert-003",
        title: "异常网络流量",
        description: "检测到异常的出站数据流量，可能存在数据泄露风险",
        severity: "medium",
        status: "acknowledged",
        timestamp: "2024-01-15T12:30:18Z",
        source: {
          ip: "192.168.1.150",
          hostname: "db-server-01",
        },
        category: "数据泄露",
      },
      {
        id: "alert-004",
        title: "Web应用漏洞扫描",
        description: "检测到针对Web应用的自动化漏洞扫描活动",
        severity: "low",
        status: "resolved",
        timestamp: "2024-01-15T11:15:33Z",
        source: {
          ip: "104.28.1.1",
          location: "美国，加利福尼亚",
        },
        target: {
          ip: "203.0.113.200",
          hostname: "web-app-01",
          port: 443,
          service: "HTTPS",
        },
        category: "漏洞扫描",
      },
    ];
    setAlerts(mockAlerts);
  }, []);

  // 过滤告���
  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity =
      filterSeverity === "all" || alert.severity === filterSeverity;
    const matchesStatus =
      filterStatus === "all" || alert.status === filterStatus;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  // 获取严重性颜色
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return BUSINESS_COLORS.threat.critical;
      case "high":
        return BUSINESS_COLORS.threat.high;
      case "medium":
        return BUSINESS_COLORS.threat.medium;
      case "low":
        return BUSINESS_COLORS.threat.low;
      case "info":
        return BUSINESS_COLORS.threat.info;
      default:
        return BUSINESS_COLORS.neutral.silver;
    }
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return BUSINESS_COLORS.status.error;
      case "investigating":
        return BUSINESS_COLORS.status.warning;
      case "acknowledged":
        return BUSINESS_COLORS.status.processing;
      case "resolved":
        return BUSINESS_COLORS.status.success;
      case "ignored":
        return BUSINESS_COLORS.neutral.silver;
      default:
        return BUSINESS_COLORS.neutral.silver;
    }
  };

  // 统计数据
  const alertStats = {
    total: alerts.length,
    critical: alerts.filter((a) => a.severity === "critical").length,
    high: alerts.filter((a) => a.severity === "high").length,
    active: alerts.filter((a) => a.status === "active").length,
    resolved: alerts.filter((a) => a.status === "resolved").length,
  };

  return (
    <div
      className="min-h-screen w-full p-6 pt-16 lg:pt-6"
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
              <AlertTriangle
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
                威胁告警中心
              </h1>
              <p style={{ color: BUSINESS_COLORS.neutral.silver }}>
                实时威胁检测与事件响应管理
              </p>
            </div>
          </div>

          {/* 控制按钮 */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsAutoRefresh(!isAutoRefresh)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200"
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
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200"
              style={{
                backgroundColor: BUSINESS_COLORS.ui.background.panel,
                color: BUSINESS_COLORS.ui.text.secondary,
                border: `1px solid ${BUSINESS_COLORS.ui.border.primary}`,
              }}
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">导出报告</span>
            </button>
          </div>
        </div>
      </div>

      {/* 统计指标 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <StatusCard
          title="总告警数"
          value={alertStats.total}
          icon={<AlertTriangle className="w-5 h-5" />}
          status="info"
        />

        <StatusCard
          title="严重告警"
          value={alertStats.critical}
          icon={<XCircle className="w-5 h-5" />}
          status="error"
        />

        <StatusCard
          title="高危告警"
          value={alertStats.high}
          icon={<AlertCircle className="w-5 h-5" />}
          status="warning"
        />

        <StatusCard
          title="活跃告警"
          value={alertStats.active}
          icon={<Activity className="w-5 h-5" />}
          status="warning"
        />

        <StatusCard
          title="已解决"
          value={alertStats.resolved}
          icon={<CheckCircle className="w-5 h-5" />}
          status="success"
        />
      </div>

      {/* 搜索和过滤 */}
      <BusinessCard className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            {/* 搜索框 */}
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                style={{ color: BUSINESS_COLORS.ui.text.muted }}
              />
              <input
                type="text"
                placeholder="搜索威胁告警..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200"
                style={{
                  borderColor: BUSINESS_COLORS.ui.border.primary,
                  backgroundColor: BUSINESS_COLORS.ui.background.card,
                  color: BUSINESS_COLORS.ui.text.primary,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = BUSINESS_COLORS.primary.blue;
                  e.target.style.boxShadow = `0 0 0 3px ${BUSINESS_COLORS.primary.blue}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor =
                    BUSINESS_COLORS.ui.border.primary;
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* 过滤器 */}
            <div className="flex gap-3">
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  borderColor: BUSINESS_COLORS.ui.border.primary,
                  backgroundColor: BUSINESS_COLORS.ui.background.card,
                  color: BUSINESS_COLORS.ui.text.primary,
                }}
              >
                <option value="all">所有严重性</option>
                <option value="critical">严重</option>
                <option value="high">高危</option>
                <option value="medium">中危</option>
                <option value="low">低危</option>
                <option value="info">信息</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  borderColor: BUSINESS_COLORS.ui.border.primary,
                  backgroundColor: BUSINESS_COLORS.ui.background.card,
                  color: BUSINESS_COLORS.ui.text.primary,
                }}
              >
                <option value="all">所有状态</option>
                <option value="active">活跃</option>
                <option value="investigating">调查中</option>
                <option value="acknowledged">已确认</option>
                <option value="resolved">已解决</option>
                <option value="ignored">已忽略</option>
              </select>
            </div>
          </div>
        </div>
      </BusinessCard>

      {/* 告警列表 */}
      <DataTableCard
        title="威胁告警列表"
        description={`共 ${filteredAlerts.length} 条告警记录`}
        data={filteredAlerts}
        columns={[
          {
            key: "severity",
            label: "严重性",
            render: (value) => (
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getSeverityColor(value) }}
                />
                <span className="font-medium text-sm capitalize">{value}</span>
              </div>
            ),
          },
          {
            key: "title",
            label: "威胁标题",
            render: (value, row) => (
              <div>
                <p className="font-medium text-sm">{value}</p>
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
            key: "source",
            label: "来源",
            render: (value) => (
              <div>
                <p className="text-sm font-mono">{value.ip}</p>
                {value.hostname && (
                  <p
                    className="text-xs"
                    style={{ color: BUSINESS_COLORS.ui.text.muted }}
                  >
                    {value.hostname}
                  </p>
                )}
              </div>
            ),
          },
          {
            key: "status",
            label: "状态",
            render: (value) => (
              <span
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${getStatusColor(value)}20`,
                  color: getStatusColor(value),
                  border: `1px solid ${getStatusColor(value)}40`,
                }}
              >
                {value === "active"
                  ? "活跃"
                  : value === "investigating"
                    ? "调查中"
                    : value === "acknowledged"
                      ? "已确认"
                      : value === "resolved"
                        ? "已解决"
                        : "已忽略"}
              </span>
            ),
          },
          {
            key: "timestamp",
            label: "时间",
            render: (value) => (
              <div>
                <p className="text-sm">
                  {new Date(value).toLocaleDateString("zh-CN")}
                </p>
                <p
                  className="text-xs"
                  style={{ color: BUSINESS_COLORS.ui.text.muted }}
                >
                  {new Date(value).toLocaleTimeString("zh-CN")}
                </p>
              </div>
            ),
          },
          {
            key: "actions",
            label: "操作",
            render: (_, row) => (
              <button
                className="p-2 rounded-lg transition-colors"
                style={{
                  color: BUSINESS_COLORS.ui.text.muted,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    BUSINESS_COLORS.ui.background.secondary;
                  e.currentTarget.style.color = BUSINESS_COLORS.ui.text.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = BUSINESS_COLORS.ui.text.muted;
                }}
              >
                <Eye className="w-4 h-4" />
              </button>
            ),
          },
        ]}
        actions={
          <div className="flex items-center space-x-2">
            <button
              className="flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors"
              style={{
                backgroundColor: BUSINESS_COLORS.ui.background.secondary,
                color: BUSINESS_COLORS.ui.text.secondary,
                border: `1px solid ${BUSINESS_COLORS.ui.border.primary}`,
              }}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">筛选</span>
            </button>
          </div>
        }
      />
    </div>
  );
}
