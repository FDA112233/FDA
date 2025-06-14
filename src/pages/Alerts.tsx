import React, { useState, useEffect, useMemo } from "react";
import {
  AlertTriangle,
  Shield,
  Activity,
  Clock,
  MapPin,
  User,
  Globe,
  Server,
  Database,
  Network,
  Zap,
  Eye,
  EyeOff,
  Check,
  X,
  Filter,
  Search,
  Download,
  RefreshCw,
  Bell,
  BellOff,
  Flag,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus,
  Target,
  Lock,
  Unlock,
  Play,
  Pause,
  Square,
  Settings,
  Info,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock3,
  TrendingUp,
  Brain,
  Hexagon,
  Triangle as TriangleIcon,
} from "lucide-react";
import {
  BusinessCard,
  StatusCard,
  InfoCard,
  DataTableCard,
} from "@/components/ui/BusinessCard";
import { BUSINESS_COLORS } from "@/lib/businessColors";
import {
  TECH_COLORS,
  getThreatLevelColor,
  getStatusColor,
} from "@/lib/techColors";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

/**
 * 威胁警告接口定义
 */
interface ThreatAlert {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  status: "active" | "acknowledged" | "investigating" | "resolved" | "ignored";
  timestamp: string;
  source: {
    ip: string;
    hostname?: string;
    location?: string;
    asn?: string;
  };
  target: {
    ip: string;
    hostname?: string;
    port?: number;
    service?: string;
  };
  category:
    | "malware"
    | "intrusion"
    | "ddos"
    | "brute_force"
    | "suspicious"
    | "vulnerability"
    | "policy_violation";
  tags: string[];
  evidence: {
    type: string;
    data: any;
  }[];
  actions: {
    automated: string[];
    recommended: string[];
  };
  affectedAssets: string[];
  iocCount: number;
  confidenceScore: number;
  assignedTo?: string;
  notes: string[];
  relatedAlerts: string[];
}

/**
 * 威胁统计接口
 */
interface ThreatStats {
  total: number;
  active: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  resolved: number;
  falsePositives: number;
}

/**
 * 威胁警告主页面
 */
export default function Alerts() {
  const navigate = useNavigate();

  // 状态管理
  const [alerts, setAlerts] = useState<ThreatAlert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<ThreatAlert[]>([]);
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"timestamp" | "severity" | "confidence">(
    "timestamp",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedAlert, setSelectedAlert] = useState<ThreatAlert | null>(null);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid" | "timeline">(
    "list",
  );
  const [showFilters, setShowFilters] = useState(false);

  // 模拟威胁数据
  useEffect(() => {
    const mockAlerts: ThreatAlert[] = [
      {
        id: "alert-001",
        title: "高危恶意软件检测",
        description: "检测到Emotet变种在内网传播，已感染多台终端设备",
        severity: "critical",
        status: "active",
        timestamp: "2024-01-15T14:23:45Z",
        source: {
          ip: "203.0.113.15",
          hostname: "malicious-server.com",
          location: "俄罗斯，莫斯科",
          asn: "AS12345",
        },
        target: {
          ip: "192.168.1.105",
          hostname: "workstation-05",
          port: 445,
          service: "SMB",
        },
        category: "malware",
        tags: ["emotet", "banker", "lateral-movement", "persistence"],
        evidence: [
          { type: "file_hash", data: { sha256: "d1ce85109b6b32c8c..." } },
          { type: "network_signature", data: { signature_id: 2024001 } },
        ],
        actions: {
          automated: ["隔离受感染主机", "阻断恶意IP"],
          recommended: ["全网扫描", "更新防病毒库", "员工安全培训"],
        },
        affectedAssets: ["workstation-05", "workstation-12", "server-web-01"],
        iocCount: 15,
        confidenceScore: 95,
        assignedTo: "security-team",
        notes: ["已通知IT部门", "正在进行深度分析"],
        relatedAlerts: ["alert-002", "alert-007"],
      },
      {
        id: "alert-002",
        title: "SSH暴力破解攻击",
        description:
          "检测到针对SSH服务的大规模暴力破解攻击，尝试次数超过1000次",
        severity: "high",
        status: "investigating",
        timestamp: "2024-01-15T13:45:22Z",
        source: {
          ip: "198.51.100.42",
          location: "中国，上海",
          asn: "AS54321",
        },
        target: {
          ip: "203.0.113.100",
          hostname: "ssh-server",
          port: 22,
          service: "SSH",
        },
        category: "brute_force",
        tags: ["ssh", "brute-force", "credential-stuffing"],
        evidence: [
          { type: "auth_logs", data: { failed_attempts: 1247 } },
          { type: "source_reputation", data: { threat_score: 85 } },
        ],
        actions: {
          automated: ["封禁源IP", "启用账户锁定"],
          recommended: ["强化SSH配置", "启用双因子认证"],
        },
        affectedAssets: ["ssh-server"],
        iocCount: 8,
        confidenceScore: 88,
        assignedTo: "incident-response",
        notes: ["已联系相关ISP", "监控中"],
        relatedAlerts: ["alert-001"],
      },
      {
        id: "alert-003",
        title: "异常DNS查询活动",
        description: "检测到大量异常DNS查询，疑似DNS隧道或数据外泄",
        severity: "medium",
        status: "acknowledged",
        timestamp: "2024-01-15T12:30:18Z",
        source: {
          ip: "192.168.1.205",
          hostname: "workstation-205",
        },
        target: {
          ip: "8.8.8.8",
          service: "DNS",
        },
        category: "suspicious",
        tags: ["dns-tunneling", "data-exfiltration", "c2"],
        evidence: [
          {
            type: "dns_queries",
            data: { query_count: 2500, unique_domains: 45 },
          },
        ],
        actions: {
          automated: ["记录DNS查询"],
          recommended: ["检查主机", "分析DNS流量", "用户访谈"],
        },
        affectedAssets: ["workstation-205"],
        iocCount: 3,
        confidenceScore: 72,
        notes: ["可能为误报", "继续观察"],
        relatedAlerts: [],
      },
      {
        id: "alert-004",
        title: "Web应用漏洞利用",
        description: "检测到SQL注入攻击尝试，目标为客户管理系统",
        severity: "high",
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
        category: "vulnerability",
        tags: ["sql-injection", "web-attack", "owasp-top10"],
        evidence: [
          { type: "web_logs", data: { payload: "' OR 1=1 --" } },
          { type: "waf_signature", data: { rule_id: "SQL001" } },
        ],
        actions: {
          automated: ["WAF阻断", "记录攻击特征"],
          recommended: ["代码审计", "参数化查询", "输入验证"],
        },
        affectedAssets: ["web-app-01"],
        iocCount: 5,
        confidenceScore: 92,
        assignedTo: "dev-team",
        notes: ["已修复漏洞", "部署补丁"],
        relatedAlerts: [],
      },
      {
        id: "alert-005",
        title: "内网横向移动检测",
        description: "检测到可疑的内网扫描和横向移动行为",
        severity: "medium",
        status: "active",
        timestamp: "2024-01-15T10:42:11Z",
        source: {
          ip: "192.168.1.88",
          hostname: "compromised-host",
        },
        target: {
          ip: "192.168.1.0/24",
        },
        category: "intrusion",
        tags: ["lateral-movement", "network-scan", "reconnaissance"],
        evidence: [
          {
            type: "network_scan",
            data: { ports_scanned: [22, 80, 443, 3389] },
          },
        ],
        actions: {
          automated: ["网络隔离", "流量监控"],
          recommended: ["主机取证", "凭据重置", "网络分段"],
        },
        affectedAssets: ["network-segment-1"],
        iocCount: 12,
        confidenceScore: 78,
        assignedTo: "network-team",
        notes: ["正在分析", "可能为APT攻击"],
        relatedAlerts: [],
      },
    ];

    setAlerts(mockAlerts);
    setFilteredAlerts(mockAlerts);
  }, []);

  // 实时刷新
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoRefresh) {
      interval = setInterval(() => {
        // 模拟新威胁
        const hasNewThreat = Math.random() > 0.8;
        if (hasNewThreat) {
          const newAlert: ThreatAlert = {
            id: `alert-${Date.now()}`,
            title: "新威胁检测",
            description: "系统检测到新的安全威胁",
            severity: ["critical", "high", "medium"][
              Math.floor(Math.random() * 3)
            ] as any,
            status: "active",
            timestamp: new Date().toISOString(),
            source: {
              ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            },
            target: { ip: "192.168.1.100" },
            category: "suspicious",
            tags: ["new-threat"],
            evidence: [],
            actions: { automated: [], recommended: [] },
            affectedAssets: [],
            iocCount: Math.floor(Math.random() * 20),
            confidenceScore: Math.floor(Math.random() * 40) + 60,
            notes: [],
            relatedAlerts: [],
          };
          setAlerts((prev) => [newAlert, ...prev]);
        }
      }, 10000);
    }
    return () => interval && clearInterval(interval);
  }, [isAutoRefresh]);

  // 过滤和搜索
  useEffect(() => {
    let filtered = alerts;

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(
        (alert) =>
          alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.source.ip.includes(searchTerm) ||
          alert.target.ip.includes(searchTerm) ||
          alert.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    // 严重性过滤
    if (filterSeverity !== "all") {
      filtered = filtered.filter((alert) => alert.severity === filterSeverity);
    }

    // 状态过滤
    if (filterStatus !== "all") {
      filtered = filtered.filter((alert) => alert.status === filterStatus);
    }

    // 分类过滤
    if (filterCategory !== "all") {
      filtered = filtered.filter((alert) => alert.category === filterCategory);
    }

    // 排序
    filtered.sort((a, b) => {
      let valueA: any, valueB: any;

      switch (sortBy) {
        case "severity":
          const severityOrder = {
            critical: 4,
            high: 3,
            medium: 2,
            low: 1,
            info: 0,
          };
          valueA = severityOrder[a.severity];
          valueB = severityOrder[b.severity];
          break;
        case "confidence":
          valueA = a.confidenceScore;
          valueB = b.confidenceScore;
          break;
        default:
          valueA = new Date(a.timestamp).getTime();
          valueB = new Date(b.timestamp).getTime();
      }

      if (sortOrder === "asc") {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });

    setFilteredAlerts(filtered);
  }, [
    alerts,
    searchTerm,
    filterSeverity,
    filterStatus,
    filterCategory,
    sortBy,
    sortOrder,
  ]);

  // 统计数据
  const stats: ThreatStats = useMemo(() => {
    return {
      total: alerts.length,
      active: alerts.filter((a) => a.status === "active").length,
      critical: alerts.filter((a) => a.severity === "critical").length,
      high: alerts.filter((a) => a.severity === "high").length,
      medium: alerts.filter((a) => a.severity === "medium").length,
      low: alerts.filter((a) => a.severity === "low").length,
      resolved: alerts.filter((a) => a.status === "resolved").length,
      falsePositives: alerts.filter((a) => a.status === "ignored").length,
    };
  }, [alerts]);

  // 批量操作
  const handleBulkAction = (action: string) => {
    if (selectedAlerts.length === 0) return;

    switch (action) {
      case "acknowledge":
        setAlerts((prev) =>
          prev.map((alert) =>
            selectedAlerts.includes(alert.id)
              ? { ...alert, status: "acknowledged" as const }
              : alert,
          ),
        );
        break;
      case "resolve":
        setAlerts((prev) =>
          prev.map((alert) =>
            selectedAlerts.includes(alert.id)
              ? { ...alert, status: "resolved" as const }
              : alert,
          ),
        );
        break;
      case "ignore":
        setAlerts((prev) =>
          prev.map((alert) =>
            selectedAlerts.includes(alert.id)
              ? { ...alert, status: "ignored" as const }
              : alert,
          ),
        );
        break;
    }
    setSelectedAlerts([]);
  };

  // 获取严重性颜色
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return TECH_COLORS.status.critical;
      case "high":
        return TECH_COLORS.threat.high;
      case "medium":
        return TECH_COLORS.threat.medium;
      case "low":
        return TECH_COLORS.threat.low;
      default:
        return TECH_COLORS.status.processing;
    }
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return TECH_COLORS.status.critical;
      case "investigating":
        return TECH_COLORS.status.warning;
      case "acknowledged":
        return TECH_COLORS.status.processing;
      case "resolved":
        return TECH_COLORS.status.online;
      case "ignored":
        return TECH_COLORS.status.offline;
      default:
        return TECH_COLORS.ui.text.muted;
    }
  };

  return (
    <div
      className="min-h-screen w-full p-6 pt-16 lg:pt-6"
      style={{ backgroundColor: TECH_COLORS.ui.background.primary }}
    >
      {/* 顶部标题和控制栏 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  background: TECH_COLORS.gradients.plasma,
                  boxShadow: `0 0 20px ${TECH_COLORS.primary.plasma}66`,
                }}
              >
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1
                  className="text-3xl font-bold font-mono"
                  style={{
                    color: TECH_COLORS.ui.text.primary,
                    textShadow: `0 0 10px ${TECH_COLORS.primary.plasma}66`,
                  }}
                >
                  THREAT ALERT CENTER
                </h1>
                <p
                  className="text-sm font-mono"
                  style={{ color: TECH_COLORS.ui.text.secondary }}
                >
                  Real-time Threat Detection & Incident Response
                </p>
              </div>
            </div>
          </div>

          {/* 控制按钮 */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsAutoRefresh(!isAutoRefresh)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                isAutoRefresh ? "animate-pulse" : ""
              }`}
              style={{
                backgroundColor: isAutoRefresh
                  ? TECH_COLORS.status.online
                  : TECH_COLORS.ui.background.panel,
                color: isAutoRefresh ? "white" : TECH_COLORS.ui.text.secondary,
                border: `1px solid ${
                  isAutoRefresh
                    ? TECH_COLORS.status.online
                    : TECH_COLORS.ui.border.primary
                }`,
              }}
            >
              {isAutoRefresh ? (
                <RefreshCw className="w-4 h-4" />
              ) : (
                <Pause className="w-4 h-4" />
              )}
              <span className="text-sm font-mono">
                {isAutoRefresh ? "实时监控" : "手动刷新"}
              </span>
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300"
              style={{
                backgroundColor: showFilters
                  ? TECH_COLORS.primary.cyber
                  : TECH_COLORS.ui.background.panel,
                color: showFilters ? "white" : TECH_COLORS.ui.text.secondary,
                border: `1px solid ${TECH_COLORS.ui.border.primary}`,
              }}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-mono">过滤器</span>
            </button>

            <button
              className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300"
              style={{
                backgroundColor: TECH_COLORS.ui.background.panel,
                color: TECH_COLORS.ui.text.secondary,
                border: `1px solid ${TECH_COLORS.ui.border.primary}`,
              }}
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-mono">导出</span>
            </button>
          </div>
        </div>
      </div>

      {/* 威胁统计概览 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
        <StatusCard
          status="critical"
          label="总威胁"
          value={stats.total}
          icon={<AlertTriangle className="w-4 h-4" />}
          trend="up"
        />
        <StatusCard
          status="critical"
          label="活跃威胁"
          value={stats.active}
          icon={<Activity className="w-4 h-4" />}
          trend={stats.active > 0 ? "up" : "stable"}
        />
        <StatusCard
          status="critical"
          label="严重"
          value={stats.critical}
          icon={<Zap className="w-4 h-4" />}
        />
        <StatusCard
          status="warning"
          label="高危"
          value={stats.high}
          icon={<Flag className="w-4 h-4" />}
        />
        <StatusCard
          status="processing"
          label="中危"
          value={stats.medium}
          icon={<Info className="w-4 h-4" />}
        />
        <StatusCard
          status="online"
          label="低危"
          value={stats.low}
          icon={<CheckCircle className="w-4 h-4" />}
        />
        <StatusCard
          status="online"
          label="已解决"
          value={stats.resolved}
          icon={<Check className="w-4 h-4" />}
          trend="down"
        />
        <StatusCard
          status="offline"
          label="误报"
          value={stats.falsePositives}
          icon={<X className="w-4 h-4" />}
        />
      </div>

      {/* 过滤器面板 */}
      {showFilters && (
        <TechCard variant="cyber" className="p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 搜索 */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                style={{ color: TECH_COLORS.ui.text.muted }}
              />
              <input
                type="text"
                placeholder="搜索威胁..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg font-mono text-sm"
                style={{
                  backgroundColor: TECH_COLORS.ui.background.panel,
                  border: `1px solid ${TECH_COLORS.ui.border.primary}`,
                  color: TECH_COLORS.ui.text.primary,
                }}
              />
            </div>

            {/* 严重性过滤 */}
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-3 py-2 rounded-lg font-mono text-sm"
              style={{
                backgroundColor: TECH_COLORS.ui.background.panel,
                border: `1px solid ${TECH_COLORS.ui.border.primary}`,
                color: TECH_COLORS.ui.text.primary,
              }}
            >
              <option value="all">所有严重性</option>
              <option value="critical">严重</option>
              <option value="high">高危</option>
              <option value="medium">中危</option>
              <option value="low">低危</option>
              <option value="info">信息</option>
            </select>

            {/* 状态过滤 */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-lg font-mono text-sm"
              style={{
                backgroundColor: TECH_COLORS.ui.background.panel,
                border: `1px solid ${TECH_COLORS.ui.border.primary}`,
                color: TECH_COLORS.ui.text.primary,
              }}
            >
              <option value="all">所有状态</option>
              <option value="active">活跃</option>
              <option value="investigating">调查中</option>
              <option value="acknowledged">已确认</option>
              <option value="resolved">已解决</option>
              <option value="ignored">已忽略</option>
            </select>

            {/* 分类过滤 */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 rounded-lg font-mono text-sm"
              style={{
                backgroundColor: TECH_COLORS.ui.background.panel,
                border: `1px solid ${TECH_COLORS.ui.border.primary}`,
                color: TECH_COLORS.ui.text.primary,
              }}
            >
              <option value="all">所有分类</option>
              <option value="malware">恶意软件</option>
              <option value="intrusion">入侵</option>
              <option value="ddos">DDoS</option>
              <option value="brute_force">暴力破解</option>
              <option value="suspicious">可疑活动</option>
              <option value="vulnerability">漏洞利用</option>
              <option value="policy_violation">策略违规</option>
            </select>
          </div>
        </TechCard>
      )}

      {/* 批量操作栏 */}
      {selectedAlerts.length > 0 && (
        <TechCard variant="quantum" className="p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span
                className="text-sm font-mono"
                style={{ color: TECH_COLORS.ui.text.primary }}
              >
                已选择 {selectedAlerts.length} 个威胁
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkAction("acknowledge")}
                className="px-3 py-1 rounded text-sm font-mono transition-all duration-300"
                style={{
                  backgroundColor: TECH_COLORS.status.processing,
                  color: "white",
                }}
              >
                批量确认
              </button>
              <button
                onClick={() => handleBulkAction("resolve")}
                className="px-3 py-1 rounded text-sm font-mono transition-all duration-300"
                style={{
                  backgroundColor: TECH_COLORS.status.online,
                  color: "white",
                }}
              >
                批量解决
              </button>
              <button
                onClick={() => handleBulkAction("ignore")}
                className="px-3 py-1 rounded text-sm font-mono transition-all duration-300"
                style={{
                  backgroundColor: TECH_COLORS.status.offline,
                  color: "white",
                }}
              >
                批量忽略
              </button>
              <button
                onClick={() => setSelectedAlerts([])}
                className="px-3 py-1 rounded text-sm font-mono transition-all duration-300"
                style={{
                  backgroundColor: TECH_COLORS.ui.background.panel,
                  color: TECH_COLORS.ui.text.secondary,
                  border: `1px solid ${TECH_COLORS.ui.border.primary}`,
                }}
              >
                取消选择
              </button>
            </div>
          </div>
        </TechCard>
      )}

      {/* 威胁列表 */}
      <div className="grid grid-cols-1 gap-4">
        {filteredAlerts.map((alert) => (
          <ThreatAlertCard
            key={alert.id}
            alert={alert}
            isSelected={selectedAlerts.includes(alert.id)}
            onSelect={(selected) => {
              if (selected) {
                setSelectedAlerts((prev) => [...prev, alert.id]);
              } else {
                setSelectedAlerts((prev) =>
                  prev.filter((id) => id !== alert.id),
                );
              }
            }}
            onView={() => setSelectedAlert(alert)}
            getSeverityColor={getSeverityColor}
            getStatusColor={getStatusColor}
          />
        ))}
      </div>

      {/* 威胁详情模态框 */}
      {selectedAlert && (
        <ThreatDetailModal
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onUpdate={(updatedAlert) => {
            setAlerts((prev) =>
              prev.map((a) => (a.id === updatedAlert.id ? updatedAlert : a)),
            );
            setSelectedAlert(updatedAlert);
          }}
          getSeverityColor={getSeverityColor}
          getStatusColor={getStatusColor}
        />
      )}
    </div>
  );
}

/**
 * 威胁警告卡片组件
 */
function ThreatAlertCard({
  alert,
  isSelected,
  onSelect,
  onView,
  getSeverityColor,
  getStatusColor,
}: {
  alert: ThreatAlert;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onView: () => void;
  getSeverityColor: (severity: string) => string;
  getStatusColor: (status: string) => string;
}) {
  const severityColor = getSeverityColor(alert.severity);
  const statusColor = getStatusColor(alert.status);

  return (
    <TechCard
      variant="cyber"
      className={`p-4 cursor-pointer transition-all duration-300 ${
        isSelected ? "ring-2" : ""
      }`}
      style={{
        ringColor: TECH_COLORS.primary.cyber,
      }}
      onClick={() => onView()}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          {/* 选择框 */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect(e.target.checked);
            }}
            className="mt-1 w-4 h-4"
          />

          {/* 严重性指示器 */}
          <div
            className="w-4 h-4 rounded-full mt-1 animate-pulse"
            style={{
              backgroundColor: severityColor,
              boxShadow: `0 0 10px ${severityColor}66`,
            }}
          />

          {/* 威胁信息 */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3
                className="text-lg font-bold font-mono"
                style={{ color: TECH_COLORS.ui.text.primary }}
              >
                {alert.title}
              </h3>
              <span
                className="px-2 py-1 rounded-full text-xs font-mono"
                style={{
                  backgroundColor: `${severityColor}20`,
                  color: severityColor,
                  border: `1px solid ${severityColor}`,
                }}
              >
                {alert.severity.toUpperCase()}
              </span>
              <span
                className="px-2 py-1 rounded-full text-xs font-mono"
                style={{
                  backgroundColor: `${statusColor}20`,
                  color: statusColor,
                  border: `1px solid ${statusColor}`,
                }}
              >
                {alert.status.toUpperCase()}
              </span>
            </div>

            <p
              className="text-sm font-mono mb-3"
              style={{ color: TECH_COLORS.ui.text.secondary }}
            >
              {alert.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-mono">
              <div>
                <span style={{ color: TECH_COLORS.ui.text.muted }}>
                  源地址:{" "}
                </span>
                <span style={{ color: TECH_COLORS.ui.text.primary }}>
                  {alert.source.ip}
                </span>
                {alert.source.location && (
                  <div style={{ color: TECH_COLORS.ui.text.muted }}>
                    {alert.source.location}
                  </div>
                )}
              </div>
              <div>
                <span style={{ color: TECH_COLORS.ui.text.muted }}>目标: </span>
                <span style={{ color: TECH_COLORS.ui.text.primary }}>
                  {alert.target.ip}
                  {alert.target.port && `:${alert.target.port}`}
                </span>
                {alert.target.service && (
                  <div style={{ color: TECH_COLORS.ui.text.muted }}>
                    {alert.target.service}
                  </div>
                )}
              </div>
              <div>
                <span style={{ color: TECH_COLORS.ui.text.muted }}>时间: </span>
                <span style={{ color: TECH_COLORS.ui.text.primary }}>
                  {new Date(alert.timestamp).toLocaleString("zh-CN")}
                </span>
              </div>
            </div>

            {/* 标签 */}
            <div className="flex flex-wrap gap-2 mt-3">
              {alert.tags.slice(0, 5).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 rounded text-xs font-mono"
                  style={{
                    backgroundColor: `${TECH_COLORS.primary.neon}20`,
                    color: TECH_COLORS.primary.neon,
                    border: `1px solid ${TECH_COLORS.primary.neon}40`,
                  }}
                >
                  {tag}
                </span>
              ))}
              {alert.tags.length > 5 && (
                <span
                  className="px-2 py-1 rounded text-xs font-mono"
                  style={{ color: TECH_COLORS.ui.text.muted }}
                >
                  +{alert.tags.length - 5} 更多
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 右侧指标 */}
        <div className="flex flex-col items-end space-y-2 text-sm font-mono">
          <div
            className="flex items-center space-x-1"
            style={{ color: TECH_COLORS.ui.text.muted }}
          >
            <Target className="w-4 h-4" />
            <span>置信���: {alert.confidenceScore}%</span>
          </div>
          <div
            className="flex items-center space-x-1"
            style={{ color: TECH_COLORS.ui.text.muted }}
          >
            <Flag className="w-4 h-4" />
            <span>IOC: {alert.iocCount}</span>
          </div>
          <div
            className="flex items-center space-x-1"
            style={{ color: TECH_COLORS.ui.text.muted }}
          >
            <Database className="w-4 h-4" />
            <span>资产: {alert.affectedAssets.length}</span>
          </div>
        </div>
      </div>
    </TechCard>
  );
}

/**
 * 威胁详情模态框
 */
function ThreatDetailModal({
  alert,
  onClose,
  onUpdate,
  getSeverityColor,
  getStatusColor,
}: {
  alert: ThreatAlert;
  onClose: () => void;
  onUpdate: (alert: ThreatAlert) => void;
  getSeverityColor: (severity: string) => string;
  getStatusColor: (status: string) => string;
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [newNote, setNewNote] = useState("");

  const addNote = () => {
    if (newNote.trim()) {
      const updatedAlert = {
        ...alert,
        notes: [...alert.notes, `${new Date().toLocaleString()}: ${newNote}`],
      };
      onUpdate(updatedAlert);
      setNewNote("");
    }
  };

  const updateStatus = (status: ThreatAlert["status"]) => {
    onUpdate({ ...alert, status });
  };

  const tabs = [
    { id: "overview", label: "概览", icon: Info },
    { id: "evidence", label: "证据", icon: Search },
    { id: "actions", label: "响应", icon: Settings },
    { id: "timeline", label: "时间线", icon: Clock },
    { id: "related", label: "关联", icon: Network },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        onClick={onClose}
      />

      {/* 模态框内容 */}
      <div
        className="relative max-w-6xl w-full max-h-[90vh] overflow-hidden rounded-xl"
        style={{
          backgroundColor: TECH_COLORS.ui.background.primary,
          border: `2px solid ${getSeverityColor(alert.severity)}`,
          boxShadow: `0 0 30px ${getSeverityColor(alert.severity)}66`,
        }}
      >
        {/* 头部 */}
        <div
          className="p-6 border-b"
          style={{
            background: `linear-gradient(135deg, ${getSeverityColor(alert.severity)}20, transparent)`,
            borderColor: TECH_COLORS.ui.border.primary,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: `${getSeverityColor(alert.severity)}20`,
                  border: `2px solid ${getSeverityColor(alert.severity)}`,
                }}
              >
                <AlertTriangle
                  className="w-6 h-6"
                  style={{ color: getSeverityColor(alert.severity) }}
                />
              </div>
              <div>
                <h2
                  className="text-2xl font-bold font-mono"
                  style={{ color: TECH_COLORS.ui.text.primary }}
                >
                  {alert.title}
                </h2>
                <p
                  className="text-sm font-mono"
                  style={{ color: TECH_COLORS.ui.text.secondary }}
                >
                  威胁ID: {alert.id}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* 状态更新按钮 */}
              <select
                value={alert.status}
                onChange={(e) =>
                  updateStatus(e.target.value as ThreatAlert["status"])
                }
                className="px-3 py-1 rounded font-mono text-sm"
                style={{
                  backgroundColor: TECH_COLORS.ui.background.panel,
                  border: `1px solid ${getStatusColor(alert.status)}`,
                  color: getStatusColor(alert.status),
                }}
              >
                <option value="active">活跃</option>
                <option value="investigating">调查中</option>
                <option value="acknowledged">已确认</option>
                <option value="resolved">已解决</option>
                <option value="ignored">已忽略</option>
              </select>

              <button
                onClick={onClose}
                className="p-2 rounded-lg transition-colors hover:bg-red-500/20"
                style={{ color: TECH_COLORS.status.critical }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 标签页导航 */}
        <div
          className="flex border-b overflow-x-auto"
          style={{
            backgroundColor: TECH_COLORS.ui.background.panel,
            borderColor: TECH_COLORS.ui.border.primary,
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-3 px-4 text-sm font-mono transition-all duration-300 ${
                activeTab === tab.id ? "border-b-2" : ""
              }`}
              style={{
                color:
                  activeTab === tab.id
                    ? getSeverityColor(alert.severity)
                    : TECH_COLORS.ui.text.secondary,
                borderColor:
                  activeTab === tab.id
                    ? getSeverityColor(alert.severity)
                    : "transparent",
                backgroundColor:
                  activeTab === tab.id
                    ? `${getSeverityColor(alert.severity)}10`
                    : "transparent",
              }}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 内容区域 */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === "overview" && (
            <ThreatOverviewTab
              alert={alert}
              getSeverityColor={getSeverityColor}
            />
          )}
          {activeTab === "evidence" && <ThreatEvidenceTab alert={alert} />}
          {activeTab === "actions" && <ThreatActionsTab alert={alert} />}
          {activeTab === "timeline" && <ThreatTimelineTab alert={alert} />}
          {activeTab === "related" && <ThreatRelatedTab alert={alert} />}
        </div>

        {/* 底部操作栏 */}
        <div
          className="p-4 border-t"
          style={{
            backgroundColor: TECH_COLORS.ui.background.panel,
            borderColor: TECH_COLORS.ui.border.primary,
          }}
        >
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="添加备注..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="flex-1 px-3 py-2 rounded font-mono text-sm"
              style={{
                backgroundColor: TECH_COLORS.ui.background.primary,
                border: `1px solid ${TECH_COLORS.ui.border.primary}`,
                color: TECH_COLORS.ui.text.primary,
              }}
              onKeyPress={(e) => e.key === "Enter" && addNote()}
            />
            <button
              onClick={addNote}
              className="px-4 py-2 rounded font-mono text-sm transition-all duration-300"
              style={{
                backgroundColor: getSeverityColor(alert.severity),
                color: "white",
              }}
            >
              添加备注
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 威胁概览标签页
 */
function ThreatOverviewTab({
  alert,
  getSeverityColor,
}: {
  alert: ThreatAlert;
  getSeverityColor: (severity: string) => string;
}) {
  return (
    <div className="space-y-6">
      {/* 基本信息 */}
      <TechCard variant="cyber" className="p-4">
        <h3
          className="text-lg font-bold font-mono mb-4"
          style={{ color: TECH_COLORS.ui.text.primary }}
        >
          基本信息
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono">
          <div>
            <span style={{ color: TECH_COLORS.ui.text.muted }}>威胁分类: </span>
            <span style={{ color: TECH_COLORS.ui.text.primary }}>
              {alert.category}
            </span>
          </div>
          <div>
            <span style={{ color: TECH_COLORS.ui.text.muted }}>严重性: </span>
            <span style={{ color: getSeverityColor(alert.severity) }}>
              {alert.severity.toUpperCase()}
            </span>
          </div>
          <div>
            <span style={{ color: TECH_COLORS.ui.text.muted }}>置信度: </span>
            <span style={{ color: TECH_COLORS.ui.text.primary }}>
              {alert.confidenceScore}%
            </span>
          </div>
          <div>
            <span style={{ color: TECH_COLORS.ui.text.muted }}>IOC数量: </span>
            <span style={{ color: TECH_COLORS.ui.text.primary }}>
              {alert.iocCount}
            </span>
          </div>
          {alert.assignedTo && (
            <div>
              <span style={{ color: TECH_COLORS.ui.text.muted }}>负责人: </span>
              <span style={{ color: TECH_COLORS.ui.text.primary }}>
                {alert.assignedTo}
              </span>
            </div>
          )}
          <div>
            <span style={{ color: TECH_COLORS.ui.text.muted }}>检测时间: </span>
            <span style={{ color: TECH_COLORS.ui.text.primary }}>
              {new Date(alert.timestamp).toLocaleString("zh-CN")}
            </span>
          </div>
        </div>
      </TechCard>

      {/* 源和目标信息 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TechCard variant="matrix" className="p-4">
          <h3
            className="text-lg font-bold font-mono mb-4"
            style={{ color: TECH_COLORS.ui.text.primary }}
          >
            攻击源信息
          </h3>
          <div className="space-y-3 text-sm font-mono">
            <div>
              <span style={{ color: TECH_COLORS.ui.text.muted }}>IP地址: </span>
              <span style={{ color: TECH_COLORS.ui.text.primary }}>
                {alert.source.ip}
              </span>
            </div>
            {alert.source.hostname && (
              <div>
                <span style={{ color: TECH_COLORS.ui.text.muted }}>
                  主机名:{" "}
                </span>
                <span style={{ color: TECH_COLORS.ui.text.primary }}>
                  {alert.source.hostname}
                </span>
              </div>
            )}
            {alert.source.location && (
              <div>
                <span style={{ color: TECH_COLORS.ui.text.muted }}>
                  地理位置:{" "}
                </span>
                <span style={{ color: TECH_COLORS.ui.text.primary }}>
                  {alert.source.location}
                </span>
              </div>
            )}
            {alert.source.asn && (
              <div>
                <span style={{ color: TECH_COLORS.ui.text.muted }}>ASN: </span>
                <span style={{ color: TECH_COLORS.ui.text.primary }}>
                  {alert.source.asn}
                </span>
              </div>
            )}
          </div>
        </TechCard>

        <TechCard variant="plasma" className="p-4">
          <h3
            className="text-lg font-bold font-mono mb-4"
            style={{ color: TECH_COLORS.ui.text.primary }}
          >
            攻击目标信息
          </h3>
          <div className="space-y-3 text-sm font-mono">
            <div>
              <span style={{ color: TECH_COLORS.ui.text.muted }}>IP地址: </span>
              <span style={{ color: TECH_COLORS.ui.text.primary }}>
                {alert.target.ip}
              </span>
            </div>
            {alert.target.hostname && (
              <div>
                <span style={{ color: TECH_COLORS.ui.text.muted }}>
                  主机名:{" "}
                </span>
                <span style={{ color: TECH_COLORS.ui.text.primary }}>
                  {alert.target.hostname}
                </span>
              </div>
            )}
            {alert.target.port && (
              <div>
                <span style={{ color: TECH_COLORS.ui.text.muted }}>端口: </span>
                <span style={{ color: TECH_COLORS.ui.text.primary }}>
                  {alert.target.port}
                </span>
              </div>
            )}
            {alert.target.service && (
              <div>
                <span style={{ color: TECH_COLORS.ui.text.muted }}>服务: </span>
                <span style={{ color: TECH_COLORS.ui.text.primary }}>
                  {alert.target.service}
                </span>
              </div>
            )}
          </div>
        </TechCard>
      </div>

      {/* 受影响资产 */}
      <TechCard variant="quantum" className="p-4">
        <h3
          className="text-lg font-bold font-mono mb-4"
          style={{ color: TECH_COLORS.ui.text.primary }}
        >
          受影响资产
        </h3>
        <div className="flex flex-wrap gap-2">
          {alert.affectedAssets.map((asset, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded font-mono text-sm"
              style={{
                backgroundColor: `${TECH_COLORS.status.warning}20`,
                color: TECH_COLORS.status.warning,
                border: `1px solid ${TECH_COLORS.status.warning}`,
              }}
            >
              {asset}
            </span>
          ))}
        </div>
      </TechCard>

      {/* 备注 */}
      {alert.notes.length > 0 && (
        <TechCard variant="neural" className="p-4">
          <h3
            className="text-lg font-bold font-mono mb-4"
            style={{ color: TECH_COLORS.ui.text.primary }}
          >
            备注记录
          </h3>
          <div className="space-y-2">
            {alert.notes.map((note, index) => (
              <div
                key={index}
                className="p-3 rounded font-mono text-sm"
                style={{
                  backgroundColor: TECH_COLORS.ui.background.panel,
                  border: `1px solid ${TECH_COLORS.ui.border.primary}`,
                  color: TECH_COLORS.ui.text.secondary,
                }}
              >
                {note}
              </div>
            ))}
          </div>
        </TechCard>
      )}
    </div>
  );
}

/**
 * 威胁证据标签页
 */
function ThreatEvidenceTab({ alert }: { alert: ThreatAlert }) {
  return (
    <div className="space-y-6">
      <h3
        className="text-lg font-bold font-mono"
        style={{ color: TECH_COLORS.ui.text.primary }}
      >
        威胁证据
      </h3>

      {alert.evidence.length === 0 ? (
        <div
          className="text-center py-8 text-sm font-mono"
          style={{ color: TECH_COLORS.ui.text.muted }}
        >
          暂无证据数据
        </div>
      ) : (
        <div className="space-y-4">
          {alert.evidence.map((evidence, index) => (
            <TechCard key={index} variant="cyber" className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Database
                  className="w-5 h-5"
                  style={{ color: TECH_COLORS.primary.cyber }}
                />
                <h4
                  className="text-md font-bold font-mono"
                  style={{ color: TECH_COLORS.ui.text.primary }}
                >
                  {evidence.type.replace("_", " ").toUpperCase()}
                </h4>
              </div>
              <pre
                className="text-sm font-mono p-3 rounded overflow-auto"
                style={{
                  backgroundColor: TECH_COLORS.ui.background.primary,
                  border: `1px solid ${TECH_COLORS.ui.border.primary}`,
                  color: TECH_COLORS.ui.text.secondary,
                }}
              >
                {JSON.stringify(evidence.data, null, 2)}
              </pre>
            </TechCard>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * 威胁响应标签页
 */
function ThreatActionsTab({ alert }: { alert: ThreatAlert }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 自动化响应 */}
        <TechCard variant="matrix" className="p-4">
          <h3
            className="text-lg font-bold font-mono mb-4"
            style={{ color: TECH_COLORS.ui.text.primary }}
          >
            自动化响应
          </h3>
          <div className="space-y-2">
            {alert.actions.automated.length === 0 ? (
              <div
                className="text-sm font-mono"
                style={{ color: TECH_COLORS.ui.text.muted }}
              >
                无自动化响应
              </div>
            ) : (
              alert.actions.automated.map((action, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-2 rounded"
                  style={{ backgroundColor: TECH_COLORS.ui.background.panel }}
                >
                  <CheckCircle
                    className="w-4 h-4"
                    style={{ color: TECH_COLORS.status.online }}
                  />
                  <span
                    className="text-sm font-mono"
                    style={{ color: TECH_COLORS.ui.text.secondary }}
                  >
                    {action}
                  </span>
                </div>
              ))
            )}
          </div>
        </TechCard>

        {/* 推荐响应 */}
        <TechCard variant="plasma" className="p-4">
          <h3
            className="text-lg font-bold font-mono mb-4"
            style={{ color: TECH_COLORS.ui.text.primary }}
          >
            推荐响应
          </h3>
          <div className="space-y-2">
            {alert.actions.recommended.length === 0 ? (
              <div
                className="text-sm font-mono"
                style={{ color: TECH_COLORS.ui.text.muted }}
              >
                无推荐响应
              </div>
            ) : (
              alert.actions.recommended.map((action, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-2 rounded"
                  style={{ backgroundColor: TECH_COLORS.ui.background.panel }}
                >
                  <AlertCircle
                    className="w-4 h-4"
                    style={{ color: TECH_COLORS.status.warning }}
                  />
                  <span
                    className="text-sm font-mono"
                    style={{ color: TECH_COLORS.ui.text.secondary }}
                  >
                    {action}
                  </span>
                </div>
              ))
            )}
          </div>
        </TechCard>
      </div>
    </div>
  );
}

/**
 * 威胁时间线标签页
 */
function ThreatTimelineTab({ alert }: { alert: ThreatAlert }) {
  const timelineEvents = [
    {
      time: alert.timestamp,
      event: "威胁检测",
      description: "系统首次检测到威胁活动",
      type: "detection",
    },
    {
      time: new Date(Date.now() - 300000).toISOString(),
      event: "自动响应",
      description: "执行自动化响应措施",
      type: "response",
    },
    {
      time: new Date(Date.now() - 150000).toISOString(),
      event: "状态更新",
      description: `威胁状态更新为: ${alert.status}`,
      type: "status",
    },
  ];

  return (
    <div className="space-y-6">
      <h3
        className="text-lg font-bold font-mono"
        style={{ color: TECH_COLORS.ui.text.primary }}
      >
        威胁时间线
      </h3>

      <div className="space-y-4">
        {timelineEvents.map((event, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div
              className="w-4 h-4 rounded-full mt-1"
              style={{
                backgroundColor:
                  event.type === "detection"
                    ? TECH_COLORS.status.critical
                    : event.type === "response"
                      ? TECH_COLORS.status.online
                      : TECH_COLORS.status.processing,
              }}
            />
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-1">
                <span
                  className="font-bold font-mono"
                  style={{ color: TECH_COLORS.ui.text.primary }}
                >
                  {event.event}
                </span>
                <span
                  className="text-sm font-mono"
                  style={{ color: TECH_COLORS.ui.text.muted }}
                >
                  {new Date(event.time).toLocaleString("zh-CN")}
                </span>
              </div>
              <p
                className="text-sm font-mono"
                style={{ color: TECH_COLORS.ui.text.secondary }}
              >
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 关联威胁标签页
 */
function ThreatRelatedTab({ alert }: { alert: ThreatAlert }) {
  return (
    <div className="space-y-6">
      <h3
        className="text-lg font-bold font-mono"
        style={{ color: TECH_COLORS.ui.text.primary }}
      >
        关联威胁
      </h3>

      {alert.relatedAlerts.length === 0 ? (
        <div
          className="text-center py-8 text-sm font-mono"
          style={{ color: TECH_COLORS.ui.text.muted }}
        >
          暂无关联威胁
        </div>
      ) : (
        <div className="space-y-3">
          {alert.relatedAlerts.map((relatedId, index) => (
            <TechCard key={index} variant="quantum" className="p-3">
              <div className="flex items-center space-x-3">
                <Network
                  className="w-5 h-5"
                  style={{ color: TECH_COLORS.primary.quantum }}
                />
                <span
                  className="font-mono"
                  style={{ color: TECH_COLORS.ui.text.primary }}
                >
                  关联威胁: {relatedId}
                </span>
              </div>
            </TechCard>
          ))}
        </div>
      )}
    </div>
  );
}
