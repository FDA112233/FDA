import React, { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Download,
  Eye,
  Calendar,
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Shield,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Users,
  Globe,
  Server,
  Database,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Plus,
  Settings,
  RefreshCw,
  Share,
  Printer,
  Mail,
  Brain,
  Zap,
  Target,
  Lock,
  Unlock,
  Network,
  HardDrive,
  Cpu,
  MemoryStick,
  Wifi,
  Bug,
  UserX,
  Ban,
} from "lucide-react";
import {
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart as RechartsPie,
  Pie,
  Cell,
  BarChart,
  Bar,
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { TechCard, StatusCard } from "@/components/ui/TechCard";
import { TECH_COLORS } from "@/lib/techColors";
import { useNavigate } from "react-router-dom";

/**
 * 报告类型接口
 */
interface SecurityReport {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly" | "monthly" | "incident" | "compliance" | "custom";
  status: "generating" | "completed" | "scheduled" | "failed";
  createdAt: string;
  createdBy: string;
  period: {
    start: string;
    end: string;
  };
  metrics: {
    totalThreats: number;
    criticalThreats: number;
    resolvedThreats: number;
    falsePositives: number;
    averageResponseTime: number;
    systemUptime: number;
    securityScore: number;
    vulnerabilities: number;
  };
  tags: string[];
  size: string;
  downloadUrl?: string;
}

/**
 * 报告模���接口
 */
interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: "executive" | "technical" | "compliance" | "incident";
  sections: string[];
  frequency: "daily" | "weekly" | "monthly" | "on-demand";
  recipients: string[];
  isDefault: boolean;
}

/**
 * 安全报告主页面
 */
export default function Reports() {
  const navigate = useNavigate();

  // 状态管理
  const [reports, setReports] = useState<SecurityReport[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState("last7days");
  const [selectedReport, setSelectedReport] = useState<SecurityReport | null>(
    null,
  );
  const [isCreatingReport, setIsCreatingReport] = useState(false);
  const [newReportForm, setNewReportForm] = useState({
    title: "",
    type: "custom" as SecurityReport["type"],
    period: {
      start: "",
      end: "",
    },
    template: "",
    recipients: [] as string[],
  });

  // 分析数据
  const [analyticsData, setAnalyticsData] = useState({
    threatTrends: [] as any[],
    categoryBreakdown: [] as any[],
    responseMetrics: [] as any[],
    securityScore: [] as any[],
    systemHealth: [] as any[],
    incidentStats: {
      total: 0,
      resolved: 0,
      pending: 0,
      critical: 0,
    },
  });

  // 初始化数据
  useEffect(() => {
    // 模拟报告数据
    const mockReports: SecurityReport[] = [
      {
        id: "report-001",
        title: "周安全态势报告",
        description: "2024年第3周网络安全威胁态势分析报告",
        type: "weekly",
        status: "completed",
        createdAt: "2024-01-15T08:00:00Z",
        createdBy: "security-admin",
        period: {
          start: "2024-01-08T00:00:00Z",
          end: "2024-01-14T23:59:59Z",
        },
        metrics: {
          totalThreats: 247,
          criticalThreats: 15,
          resolvedThreats: 198,
          falsePositives: 34,
          averageResponseTime: 12.5,
          systemUptime: 99.97,
          securityScore: 92,
          vulnerabilities: 8,
        },
        tags: ["weekly", "threats", "incidents"],
        size: "2.4MB",
        downloadUrl: "/api/reports/report-001/download",
      },
      {
        id: "report-002",
        title: "恶意软件感染事件报告",
        description: "Emotet变种感染事件的详��分析和响应报告",
        type: "incident",
        status: "completed",
        createdAt: "2024-01-15T14:30:00Z",
        createdBy: "incident-response",
        period: {
          start: "2024-01-15T14:23:00Z",
          end: "2024-01-15T18:45:00Z",
        },
        metrics: {
          totalThreats: 1,
          criticalThreats: 1,
          resolvedThreats: 1,
          falsePositives: 0,
          averageResponseTime: 45,
          systemUptime: 99.9,
          securityScore: 88,
          vulnerabilities: 3,
        },
        tags: ["incident", "malware", "emotet", "response"],
        size: "5.7MB",
        downloadUrl: "/api/reports/report-002/download",
      },
      {
        id: "report-003",
        title: "月度合规报告",
        description: "2024年1月网络安全合规性评估报告",
        type: "compliance",
        status: "generating",
        createdAt: "2024-01-31T09:00:00Z",
        createdBy: "compliance-team",
        period: {
          start: "2024-01-01T00:00:00Z",
          end: "2024-01-31T23:59:59Z",
        },
        metrics: {
          totalThreats: 1024,
          criticalThreats: 67,
          resolvedThreats: 945,
          falsePositives: 128,
          averageResponseTime: 18.3,
          systemUptime: 99.95,
          securityScore: 94,
          vulnerabilities: 23,
        },
        tags: ["compliance", "monthly", "audit"],
        size: "8.2MB",
      },
      {
        id: "report-004",
        title: "高管安全简报",
        description: "面向高管的网络安全状况摘要报告",
        type: "daily",
        status: "completed",
        createdAt: "2024-01-15T06:00:00Z",
        createdBy: "auto-scheduler",
        period: {
          start: "2024-01-14T00:00:00Z",
          end: "2024-01-14T23:59:59Z",
        },
        metrics: {
          totalThreats: 45,
          criticalThreats: 2,
          resolvedThreats: 41,
          falsePositives: 6,
          averageResponseTime: 8.7,
          systemUptime: 100,
          securityScore: 96,
          vulnerabilities: 1,
        },
        tags: ["executive", "daily", "summary"],
        size: "1.2MB",
        downloadUrl: "/api/reports/report-004/download",
      },
    ];

    // 模拟报告模板
    const mockTemplates: ReportTemplate[] = [
      {
        id: "template-001",
        name: "高管安全简报模板",
        description: "面向高级管理层的安全状况摘要",
        type: "executive",
        sections: ["威胁概览", "关键指标", "风险评估", "行动建议"],
        frequency: "daily",
        recipients: ["ceo@company.com", "cto@company.com"],
        isDefault: true,
      },
      {
        id: "template-002",
        name: "技术威胁分析模板",
        description: "详细的技术威胁分析和响应报告",
        type: "technical",
        sections: ["威胁详情", "IOC分析", "响应时间线", "技术建议", "补救措施"],
        frequency: "weekly",
        recipients: ["security-team@company.com"],
        isDefault: false,
      },
      {
        id: "template-003",
        name: "合规审计模板",
        description: "网络安全合规性评估报告",
        type: "compliance",
        sections: ["合规检查", "政策遵循", "审计发现", "整改建议"],
        frequency: "monthly",
        recipients: ["compliance@company.com", "audit@company.com"],
        isDefault: false,
      },
    ];

    setReports(mockReports);
    setTemplates(mockTemplates);

    // 生成分析数据
    generateAnalyticsData();
  }, []);

  // 生成分析数据
  const generateAnalyticsData = () => {
    const now = new Date();
    const days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split("T")[0];
    });

    const threatTrends = days.map((date) => ({
      date,
      critical: Math.floor(Math.random() * 10) + 2,
      high: Math.floor(Math.random() * 20) + 5,
      medium: Math.floor(Math.random() * 30) + 10,
      low: Math.floor(Math.random() * 15) + 5,
      resolved: Math.floor(Math.random() * 40) + 20,
    }));

    const categoryBreakdown = [
      { name: "恶意软件", value: 35, color: TECH_COLORS.status.critical },
      { name: "入侵检测", value: 28, color: TECH_COLORS.threat.high },
      { name: "暴力破解", value: 15, color: TECH_COLORS.threat.medium },
      { name: "可疑活动", value: 12, color: TECH_COLORS.threat.low },
      { name: "策略违规", value: 10, color: TECH_COLORS.status.processing },
    ];

    const responseMetrics = days.slice(-14).map((date) => ({
      date,
      responseTime: Math.floor(Math.random() * 30) + 5,
      resolutionTime: Math.floor(Math.random() * 120) + 30,
      mttr: Math.floor(Math.random() * 60) + 15,
    }));

    const securityScore = days.slice(-14).map((date) => ({
      date,
      score: Math.floor(Math.random() * 15) + 85,
      baseline: 90,
    }));

    const systemHealth = [
      { system: "防火墙", status: 99.8, color: TECH_COLORS.status.online },
      { system: "IDS/IPS", status: 97.5, color: TECH_COLORS.status.online },
      { system: "端点保护", status: 94.2, color: TECH_COLORS.status.warning },
      { system: "邮件安全", status: 99.1, color: TECH_COLORS.status.online },
      { system: "Web过滤", status: 96.8, color: TECH_COLORS.status.online },
    ];

    setAnalyticsData({
      threatTrends,
      categoryBreakdown,
      responseMetrics,
      securityScore,
      systemHealth,
      incidentStats: {
        total: threatTrends.reduce(
          (sum, day) => sum + day.critical + day.high + day.medium + day.low,
          0,
        ),
        resolved: threatTrends.reduce((sum, day) => sum + day.resolved, 0),
        pending: Math.floor(Math.random() * 50) + 20,
        critical: threatTrends.reduce((sum, day) => sum + day.critical, 0),
      },
    });
  };

  // 过滤报告
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch =
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      const matchesType = filterType === "all" || report.type === filterType;
      const matchesStatus =
        filterStatus === "all" || report.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [reports, searchTerm, filterType, filterStatus]);

  // 创建新报告
  const handleCreateReport = () => {
    const newReport: SecurityReport = {
      id: `report-${Date.now()}`,
      title: newReportForm.title || "自定义安全报告",
      description: `${newReportForm.period.start} 至 ${newReportForm.period.end} 的安全分析报告`,
      type: newReportForm.type,
      status: "generating",
      createdAt: new Date().toISOString(),
      createdBy: "current-user",
      period: newReportForm.period,
      metrics: {
        totalThreats: Math.floor(Math.random() * 500) + 100,
        criticalThreats: Math.floor(Math.random() * 50) + 10,
        resolvedThreats: Math.floor(Math.random() * 400) + 80,
        falsePositives: Math.floor(Math.random() * 30) + 5,
        averageResponseTime: Math.floor(Math.random() * 30) + 10,
        systemUptime: 99 + Math.random(),
        securityScore: Math.floor(Math.random() * 20) + 80,
        vulnerabilities: Math.floor(Math.random() * 20) + 5,
      },
      tags: ["custom", newReportForm.type],
      size: `${(Math.random() * 10 + 1).toFixed(1)}MB`,
    };

    setReports((prev) => [newReport, ...prev]);
    setIsCreatingReport(false);
    setNewReportForm({
      title: "",
      type: "custom",
      period: { start: "", end: "" },
      template: "",
      recipients: [],
    });

    // 模拟报告生成过程
    setTimeout(() => {
      setReports((prev) =>
        prev.map((r) =>
          r.id === newReport.id
            ? {
                ...r,
                status: "completed" as const,
                downloadUrl: `/api/reports/${r.id}/download`,
              }
            : r,
        ),
      );
    }, 3000);
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return TECH_COLORS.status.online;
      case "generating":
        return TECH_COLORS.status.processing;
      case "scheduled":
        return TECH_COLORS.status.warning;
      case "failed":
        return TECH_COLORS.status.critical;
      default:
        return TECH_COLORS.ui.text.muted;
    }
  };

  // 获取类型颜色
  const getTypeColor = (type: string) => {
    switch (type) {
      case "daily":
        return TECH_COLORS.primary.neon;
      case "weekly":
        return TECH_COLORS.primary.matrix;
      case "monthly":
        return TECH_COLORS.primary.plasma;
      case "incident":
        return TECH_COLORS.status.critical;
      case "compliance":
        return TECH_COLORS.primary.quantum;
      case "custom":
        return TECH_COLORS.primary.neural;
      default:
        return TECH_COLORS.ui.text.muted;
    }
  };

  return (
    <div
      className="min-h-screen w-full p-6"
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
                  background: TECH_COLORS.gradients.neural,
                  boxShadow: `0 0 20px ${TECH_COLORS.primary.neural}66`,
                }}
              >
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1
                  className="text-3xl font-bold font-mono"
                  style={{
                    color: TECH_COLORS.ui.text.primary,
                    textShadow: `0 0 10px ${TECH_COLORS.primary.neural}66`,
                  }}
                >
                  SECURITY ANALYTICS
                </h1>
                <p
                  className="text-sm font-mono"
                  style={{ color: TECH_COLORS.ui.text.secondary }}
                >
                  Comprehensive Security Reporting & Analysis
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsCreatingReport(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 font-mono"
              style={{
                backgroundColor: TECH_COLORS.primary.neural,
                color: "white",
                boxShadow: `0 0 15px ${TECH_COLORS.primary.neural}66`,
              }}
            >
              <Plus className="w-4 h-4" />
              <span>创建报告</span>
            </button>

            <button
              className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 font-mono"
              style={{
                backgroundColor: TECH_COLORS.ui.background.panel,
                color: TECH_COLORS.ui.text.secondary,
                border: `1px solid ${TECH_COLORS.ui.border.primary}`,
              }}
            >
              <Settings className="w-4 h-4" />
              <span>模板管理</span>
            </button>
          </div>
        </div>
      </div>

      {/* 威胁态势仪表板 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <StatusCard
          status="critical"
          label="总威胁数"
          value={analyticsData.incidentStats.total}
          icon={<AlertTriangle className="w-4 h-4" />}
          trend="up"
        />
        <StatusCard
          status="online"
          label="已解决"
          value={analyticsData.incidentStats.resolved}
          icon={<CheckCircle className="w-4 h-4" />}
          trend="up"
        />
        <StatusCard
          status="warning"
          label="待处理"
          value={analyticsData.incidentStats.pending}
          icon={<Clock className="w-4 h-4" />}
          trend="stable"
        />
        <StatusCard
          status="critical"
          label="严重威胁"
          value={analyticsData.incidentStats.critical}
          icon={<Zap className="w-4 h-4" />}
          trend="down"
        />
      </div>

      {/* 威胁分析图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 威胁趋势 */}
        <TechCard variant="cyber" glow className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp
              className="w-5 h-5"
              style={{ color: TECH_COLORS.primary.cyber }}
            />
            <h3
              className="text-lg font-bold font-mono"
              style={{ color: TECH_COLORS.ui.text.primary }}
            >
              威胁趋势分析
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.threatTrends.slice(-14)}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={TECH_COLORS.ui.border.primary}
                  opacity={0.3}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: TECH_COLORS.ui.text.muted }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: TECH_COLORS.ui.text.muted }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: TECH_COLORS.ui.background.overlay,
                    border: `1px solid ${TECH_COLORS.ui.border.accent}`,
                    borderRadius: "8px",
                    color: TECH_COLORS.ui.text.primary,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="critical"
                  stackId="1"
                  stroke={TECH_COLORS.status.critical}
                  fill={`${TECH_COLORS.status.critical}66`}
                  name="严重"
                />
                <Area
                  type="monotone"
                  dataKey="high"
                  stackId="1"
                  stroke={TECH_COLORS.threat.high}
                  fill={`${TECH_COLORS.threat.high}66`}
                  name="高危"
                />
                <Area
                  type="monotone"
                  dataKey="medium"
                  stackId="1"
                  stroke={TECH_COLORS.threat.medium}
                  fill={`${TECH_COLORS.threat.medium}66`}
                  name="中危"
                />
                <Area
                  type="monotone"
                  dataKey="low"
                  stackId="1"
                  stroke={TECH_COLORS.threat.low}
                  fill={`${TECH_COLORS.threat.low}66`}
                  name="低危"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </TechCard>

        {/* 威胁分类分布 */}
        <TechCard variant="matrix" glow className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <PieChart
              className="w-5 h-5"
              style={{ color: TECH_COLORS.primary.matrix }}
            />
            <h3
              className="text-lg font-bold font-mono"
              style={{ color: TECH_COLORS.ui.text.primary }}
            >
              威胁分类分布
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={analyticsData.categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {analyticsData.categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: TECH_COLORS.ui.background.overlay,
                    border: `1px solid ${TECH_COLORS.ui.border.accent}`,
                    borderRadius: "8px",
                    color: TECH_COLORS.ui.text.primary,
                  }}
                />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        </TechCard>

        {/* 响应时间指标 */}
        <TechCard variant="plasma" glow className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Activity
              className="w-5 h-5"
              style={{ color: TECH_COLORS.primary.plasma }}
            />
            <h3
              className="text-lg font-bold font-mono"
              style={{ color: TECH_COLORS.ui.text.primary }}
            >
              响应时间指标
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLine data={analyticsData.responseMetrics}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={TECH_COLORS.ui.border.primary}
                  opacity={0.3}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: TECH_COLORS.ui.text.muted }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: TECH_COLORS.ui.text.muted }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: TECH_COLORS.ui.background.overlay,
                    border: `1px solid ${TECH_COLORS.ui.border.accent}`,
                    borderRadius: "8px",
                    color: TECH_COLORS.ui.text.primary,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="responseTime"
                  stroke={TECH_COLORS.primary.plasma}
                  strokeWidth={2}
                  dot={{
                    fill: TECH_COLORS.primary.plasma,
                    strokeWidth: 2,
                    r: 4,
                  }}
                  name="响应时间(分钟)"
                />
                <Line
                  type="monotone"
                  dataKey="mttr"
                  stroke={TECH_COLORS.primary.neon}
                  strokeWidth={2}
                  dot={{ fill: TECH_COLORS.primary.neon, strokeWidth: 2, r: 4 }}
                  name="平均修复时间(分钟)"
                />
              </RechartsLine>
            </ResponsiveContainer>
          </div>
        </TechCard>

        {/* 安全评分 */}
        <TechCard variant="quantum" glow className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield
              className="w-5 h-5"
              style={{ color: TECH_COLORS.primary.quantum }}
            />
            <h3
              className="text-lg font-bold font-mono"
              style={{ color: TECH_COLORS.ui.text.primary }}
            >
              安全评分趋势
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.securityScore}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={TECH_COLORS.ui.border.primary}
                  opacity={0.3}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: TECH_COLORS.ui.text.muted }}
                />
                <YAxis
                  domain={[80, 100]}
                  tick={{ fontSize: 10, fill: TECH_COLORS.ui.text.muted }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: TECH_COLORS.ui.background.overlay,
                    border: `1px solid ${TECH_COLORS.ui.border.accent}`,
                    borderRadius: "8px",
                    color: TECH_COLORS.ui.text.primary,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke={TECH_COLORS.primary.quantum}
                  fill={`${TECH_COLORS.primary.quantum}66`}
                  name="安全评分"
                />
                <Line
                  type="monotone"
                  dataKey="baseline"
                  stroke={TECH_COLORS.status.warning}
                  strokeDasharray="5 5"
                  name="基准线"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </TechCard>
      </div>

      {/* 过滤和搜索 */}
      <TechCard variant="cyber" className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
              style={{ color: TECH_COLORS.ui.text.muted }}
            />
            <input
              type="text"
              placeholder="搜索报告..."
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

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 rounded-lg font-mono text-sm"
            style={{
              backgroundColor: TECH_COLORS.ui.background.panel,
              border: `1px solid ${TECH_COLORS.ui.border.primary}`,
              color: TECH_COLORS.ui.text.primary,
            }}
          >
            <option value="all">所有类型</option>
            <option value="daily">日报</option>
            <option value="weekly">周报</option>
            <option value="monthly">月报</option>
            <option value="incident">事件报告</option>
            <option value="compliance">合规报告</option>
            <option value="custom">自定义</option>
          </select>

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
            <option value="completed">已完成</option>
            <option value="generating">生成中</option>
            <option value="scheduled">已计划</option>
            <option value="failed">失败</option>
          </select>

          <button
            onClick={() => generateAnalyticsData()}
            className="flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 font-mono"
            style={{
              backgroundColor: TECH_COLORS.ui.background.panel,
              color: TECH_COLORS.ui.text.secondary,
              border: `1px solid ${TECH_COLORS.ui.border.primary}`,
            }}
          >
            <RefreshCw className="w-4 h-4" />
            <span>刷新</span>
          </button>
        </div>
      </TechCard>

      {/* 报告列表 */}
      <div className="grid grid-cols-1 gap-4">
        {filteredReports.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            onView={() => setSelectedReport(report)}
            getStatusColor={getStatusColor}
            getTypeColor={getTypeColor}
          />
        ))}
      </div>

      {/* 创建报告模态框 */}
      {isCreatingReport && (
        <CreateReportModal
          templates={templates}
          formData={newReportForm}
          onFormChange={setNewReportForm}
          onSubmit={handleCreateReport}
          onClose={() => setIsCreatingReport(false)}
        />
      )}

      {/* 报告详情模态框 */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          getStatusColor={getStatusColor}
          getTypeColor={getTypeColor}
        />
      )}
    </div>
  );
}

/**
 * 报告卡片组件
 */
function ReportCard({
  report,
  onView,
  getStatusColor,
  getTypeColor,
}: {
  report: SecurityReport;
  onView: () => void;
  getStatusColor: (status: string) => string;
  getTypeColor: (type: string) => string;
}) {
  const statusColor = getStatusColor(report.status);
  const typeColor = getTypeColor(report.type);

  return (
    <TechCard
      variant="cyber"
      className="p-4 cursor-pointer transition-all duration-300 hover:scale-[1.01]"
      onClick={onView}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: `${typeColor}20`,
              border: `2px solid ${typeColor}`,
            }}
          >
            <FileText className="w-6 h-6" style={{ color: typeColor }} />
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3
                className="text-lg font-bold font-mono"
                style={{ color: TECH_COLORS.ui.text.primary }}
              >
                {report.title}
              </h3>
              <span
                className="px-2 py-1 rounded-full text-xs font-mono"
                style={{
                  backgroundColor: `${typeColor}20`,
                  color: typeColor,
                  border: `1px solid ${typeColor}`,
                }}
              >
                {report.type.toUpperCase()}
              </span>
              <span
                className="px-2 py-1 rounded-full text-xs font-mono"
                style={{
                  backgroundColor: `${statusColor}20`,
                  color: statusColor,
                  border: `1px solid ${statusColor}`,
                }}
              >
                {report.status.toUpperCase()}
              </span>
            </div>

            <p
              className="text-sm font-mono mb-3"
              style={{ color: TECH_COLORS.ui.text.secondary }}
            >
              {report.description}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-mono">
              <div>
                <span style={{ color: TECH_COLORS.ui.text.muted }}>
                  创建时间:{" "}
                </span>
                <span style={{ color: TECH_COLORS.ui.text.primary }}>
                  {new Date(report.createdAt).toLocaleDateString("zh-CN")}
                </span>
              </div>
              <div>
                <span style={{ color: TECH_COLORS.ui.text.muted }}>
                  创建人:{" "}
                </span>
                <span style={{ color: TECH_COLORS.ui.text.primary }}>
                  {report.createdBy}
                </span>
              </div>
              <div>
                <span style={{ color: TECH_COLORS.ui.text.muted }}>
                  时间范围:{" "}
                </span>
                <span style={{ color: TECH_COLORS.ui.text.primary }}>
                  {new Date(report.period.start).toLocaleDateString("zh-CN")} -{" "}
                  {new Date(report.period.end).toLocaleDateString("zh-CN")}
                </span>
              </div>
              <div>
                <span style={{ color: TECH_COLORS.ui.text.muted }}>
                  文件大小:{" "}
                </span>
                <span style={{ color: TECH_COLORS.ui.text.primary }}>
                  {report.size}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {report.tags.map((tag, index) => (
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
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-2">
          <div className="grid grid-cols-2 gap-3 text-sm font-mono">
            <div className="text-center">
              <div
                className="text-xl font-bold"
                style={{ color: TECH_COLORS.status.critical }}
              >
                {report.metrics.totalThreats}
              </div>
              <div style={{ color: TECH_COLORS.ui.text.muted }}>总威胁</div>
            </div>
            <div className="text-center">
              <div
                className="text-xl font-bold"
                style={{ color: TECH_COLORS.status.online }}
              >
                {report.metrics.resolvedThreats}
              </div>
              <div style={{ color: TECH_COLORS.ui.text.muted }}>已解决</div>
            </div>
            <div className="text-center">
              <div
                className="text-xl font-bold"
                style={{ color: TECH_COLORS.primary.quantum }}
              >
                {report.metrics.securityScore}
              </div>
              <div style={{ color: TECH_COLORS.ui.text.muted }}>安全分</div>
            </div>
            <div className="text-center">
              <div
                className="text-xl font-bold"
                style={{ color: TECH_COLORS.primary.neon }}
              >
                {report.metrics.systemUptime.toFixed(1)}%
              </div>
              <div style={{ color: TECH_COLORS.ui.text.muted }}>正常率</div>
            </div>
          </div>

          {report.status === "completed" && report.downloadUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                // 处理下载
                console.log("Downloading report:", report.downloadUrl);
              }}
              className="flex items-center space-x-2 px-3 py-1 rounded transition-all duration-300 font-mono text-sm"
              style={{
                backgroundColor: TECH_COLORS.status.online,
                color: "white",
              }}
            >
              <Download className="w-4 h-4" />
              <span>下载</span>
            </button>
          )}
        </div>
      </div>
    </TechCard>
  );
}

/**
 * 创建报告模态框
 */
function CreateReportModal({
  templates,
  formData,
  onFormChange,
  onSubmit,
  onClose,
}: {
  templates: ReportTemplate[];
  formData: any;
  onFormChange: (data: any) => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        onClick={onClose}
      />

      <div
        className="relative max-w-2xl w-full max-h-[90vh] overflow-hidden rounded-xl"
        style={{
          backgroundColor: TECH_COLORS.ui.background.primary,
          border: `2px solid ${TECH_COLORS.primary.neural}`,
          boxShadow: `0 0 30px ${TECH_COLORS.primary.neural}66`,
        }}
      >
        <div
          className="p-6 border-b"
          style={{
            background: `linear-gradient(135deg, ${TECH_COLORS.primary.neural}20, transparent)`,
            borderColor: TECH_COLORS.ui.border.primary,
          }}
        >
          <h2
            className="text-2xl font-bold font-mono"
            style={{ color: TECH_COLORS.ui.text.primary }}
          >
            创建安全报告
          </h2>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label
              className="block text-sm font-mono mb-2"
              style={{ color: TECH_COLORS.ui.text.secondary }}
            >
              报告标题
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                onFormChange({ ...formData, title: e.target.value })
              }
              placeholder="输入报告标题..."
              className="w-full px-3 py-2 rounded-lg font-mono"
              style={{
                backgroundColor: TECH_COLORS.ui.background.panel,
                border: `1px solid ${TECH_COLORS.ui.border.primary}`,
                color: TECH_COLORS.ui.text.primary,
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-mono mb-2"
                style={{ color: TECH_COLORS.ui.text.secondary }}
              >
                报告类型
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  onFormChange({ ...formData, type: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg font-mono"
                style={{
                  backgroundColor: TECH_COLORS.ui.background.panel,
                  border: `1px solid ${TECH_COLORS.ui.border.primary}`,
                  color: TECH_COLORS.ui.text.primary,
                }}
              >
                <option value="custom">自定义</option>
                <option value="daily">日报</option>
                <option value="weekly">周报</option>
                <option value="monthly">月报</option>
                <option value="incident">事件报告</option>
                <option value="compliance">合规报告</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-mono mb-2"
                style={{ color: TECH_COLORS.ui.text.secondary }}
              >
                报告模板
              </label>
              <select
                value={formData.template}
                onChange={(e) =>
                  onFormChange({ ...formData, template: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg font-mono"
                style={{
                  backgroundColor: TECH_COLORS.ui.background.panel,
                  border: `1px solid ${TECH_COLORS.ui.border.primary}`,
                  color: TECH_COLORS.ui.text.primary,
                }}
              >
                <option value="">选择模板...</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-mono mb-2"
                style={{ color: TECH_COLORS.ui.text.secondary }}
              >
                开始时间
              </label>
              <input
                type="datetime-local"
                value={formData.period.start}
                onChange={(e) =>
                  onFormChange({
                    ...formData,
                    period: { ...formData.period, start: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-lg font-mono"
                style={{
                  backgroundColor: TECH_COLORS.ui.background.panel,
                  border: `1px solid ${TECH_COLORS.ui.border.primary}`,
                  color: TECH_COLORS.ui.text.primary,
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-mono mb-2"
                style={{ color: TECH_COLORS.ui.text.secondary }}
              >
                结束时间
              </label>
              <input
                type="datetime-local"
                value={formData.period.end}
                onChange={(e) =>
                  onFormChange({
                    ...formData,
                    period: { ...formData.period, end: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-lg font-mono"
                style={{
                  backgroundColor: TECH_COLORS.ui.background.panel,
                  border: `1px solid ${TECH_COLORS.ui.border.primary}`,
                  color: TECH_COLORS.ui.text.primary,
                }}
              />
            </div>
          </div>
        </div>

        <div
          className="p-4 border-t flex items-center justify-end space-x-3"
          style={{
            backgroundColor: TECH_COLORS.ui.background.panel,
            borderColor: TECH_COLORS.ui.border.primary,
          }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-mono transition-all duration-300"
            style={{
              backgroundColor: TECH_COLORS.ui.background.primary,
              color: TECH_COLORS.ui.text.secondary,
              border: `1px solid ${TECH_COLORS.ui.border.primary}`,
            }}
          >
            取消
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 rounded-lg font-mono transition-all duration-300"
            style={{
              backgroundColor: TECH_COLORS.primary.neural,
              color: "white",
            }}
          >
            创建报告
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * 报告详情模态框
 */
function ReportDetailModal({
  report,
  onClose,
  getStatusColor,
  getTypeColor,
}: {
  report: SecurityReport;
  onClose: () => void;
  getStatusColor: (status: string) => string;
  getTypeColor: (type: string) => string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        onClick={onClose}
      />

      <div
        className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-xl"
        style={{
          backgroundColor: TECH_COLORS.ui.background.primary,
          border: `2px solid ${getTypeColor(report.type)}`,
          boxShadow: `0 0 30px ${getTypeColor(report.type)}66`,
        }}
      >
        <div
          className="p-6 border-b"
          style={{
            background: `linear-gradient(135deg, ${getTypeColor(report.type)}20, transparent)`,
            borderColor: TECH_COLORS.ui.border.primary,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2
                className="text-2xl font-bold font-mono"
                style={{ color: TECH_COLORS.ui.text.primary }}
              >
                {report.title}
              </h2>
              <p
                className="text-sm font-mono"
                style={{ color: TECH_COLORS.ui.text.secondary }}
              >
                {report.description}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {report.status === "completed" && report.downloadUrl && (
                <button
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg font-mono"
                  style={{
                    backgroundColor: TECH_COLORS.status.online,
                    color: "white",
                  }}
                >
                  <Download className="w-4 h-4" />
                  <span>下载</span>
                </button>
              )}
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

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 基本信息 */}
            <TechCard variant="cyber" className="p-4">
              <h3
                className="text-lg font-bold font-mono mb-4"
                style={{ color: TECH_COLORS.ui.text.primary }}
              >
                基本信息
              </h3>
              <div className="space-y-3 text-sm font-mono">
                <div className="flex justify-between">
                  <span style={{ color: TECH_COLORS.ui.text.muted }}>
                    类型:
                  </span>
                  <span style={{ color: getTypeColor(report.type) }}>
                    {report.type.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: TECH_COLORS.ui.text.muted }}>
                    状态:
                  </span>
                  <span style={{ color: getStatusColor(report.status) }}>
                    {report.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: TECH_COLORS.ui.text.muted }}>
                    创建人:
                  </span>
                  <span style={{ color: TECH_COLORS.ui.text.primary }}>
                    {report.createdBy}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: TECH_COLORS.ui.text.muted }}>
                    文件大小:
                  </span>
                  <span style={{ color: TECH_COLORS.ui.text.primary }}>
                    {report.size}
                  </span>
                </div>
              </div>
            </TechCard>

            {/* 时间范围 */}
            <TechCard variant="matrix" className="p-4">
              <h3
                className="text-lg font-bold font-mono mb-4"
                style={{ color: TECH_COLORS.ui.text.primary }}
              >
                报告周期
              </h3>
              <div className="space-y-3 text-sm font-mono">
                <div className="flex justify-between">
                  <span style={{ color: TECH_COLORS.ui.text.muted }}>
                    开始时间:
                  </span>
                  <span style={{ color: TECH_COLORS.ui.text.primary }}>
                    {new Date(report.period.start).toLocaleString("zh-CN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: TECH_COLORS.ui.text.muted }}>
                    结束时间:
                  </span>
                  <span style={{ color: TECH_COLORS.ui.text.primary }}>
                    {new Date(report.period.end).toLocaleString("zh-CN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: TECH_COLORS.ui.text.muted }}>
                    时长:
                  </span>
                  <span style={{ color: TECH_COLORS.ui.text.primary }}>
                    {Math.ceil(
                      (new Date(report.period.end).getTime() -
                        new Date(report.period.start).getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}{" "}
                    天
                  </span>
                </div>
              </div>
            </TechCard>
          </div>

          {/* 威胁指标 */}
          <div className="mt-6">
            <h3
              className="text-lg font-bold font-mono mb-4"
              style={{ color: TECH_COLORS.ui.text.primary }}
            >
              安全指标
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatusCard
                status="critical"
                label="总威胁"
                value={report.metrics.totalThreats}
                icon={<AlertTriangle className="w-4 h-4" />}
              />
              <StatusCard
                status="critical"
                label="严重威胁"
                value={report.metrics.criticalThreats}
                icon={<Zap className="w-4 h-4" />}
              />
              <StatusCard
                status="online"
                label="已解决"
                value={report.metrics.resolvedThreats}
                icon={<CheckCircle className="w-4 h-4" />}
              />
              <StatusCard
                status="offline"
                label="误报"
                value={report.metrics.falsePositives}
                icon={<XCircle className="w-4 h-4" />}
              />
              <StatusCard
                status="processing"
                label="响应时间"
                value={`${report.metrics.averageResponseTime}分钟`}
                icon={<Clock className="w-4 h-4" />}
              />
              <StatusCard
                status="online"
                label="系统正常率"
                value={`${report.metrics.systemUptime.toFixed(1)}%`}
                icon={<Activity className="w-4 h-4" />}
              />
              <StatusCard
                status="processing"
                label="安全评分"
                value={report.metrics.securityScore}
                icon={<Shield className="w-4 h-4" />}
              />
              <StatusCard
                status="warning"
                label="漏洞数"
                value={report.metrics.vulnerabilities}
                icon={<Bug className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* 标签 */}
          <div className="mt-6">
            <h3
              className="text-lg font-bold font-mono mb-4"
              style={{ color: TECH_COLORS.ui.text.primary }}
            >
              标签
            </h3>
            <div className="flex flex-wrap gap-2">
              {report.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-sm font-mono"
                  style={{
                    backgroundColor: `${TECH_COLORS.primary.neon}20`,
                    color: TECH_COLORS.primary.neon,
                    border: `1px solid ${TECH_COLORS.primary.neon}`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
