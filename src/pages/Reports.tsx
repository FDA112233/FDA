import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Calendar,
  BarChart3,
  TrendingUp,
  Shield,
  AlertTriangle,
  Activity,
  Clock,
  Filter,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import {
  BusinessCard,
  StatusCard,
  InfoCard,
  DataTableCard,
} from "@/components/ui/BusinessCard";
import { BUSINESS_COLORS } from "@/lib/businessColors";

interface SecurityReport {
  id: string;
  name: string;
  type: "daily" | "weekly" | "monthly" | "incident" | "compliance";
  status: "generating" | "completed" | "failed" | "scheduled";
  createdAt: string;
  createdBy: string;
  size: string;
  description: string;
}

export default function Reports() {
  const [reports, setReports] = useState<SecurityReport[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // 模拟报告数据
  useEffect(() => {
    const mockReports: SecurityReport[] = [
      {
        id: "report-001",
        name: "每日安全摘要报告",
        type: "daily",
        status: "completed",
        createdAt: "2024-01-15T08:00:00Z",
        createdBy: "系统自动",
        size: "2.3 MB",
        description: "包含威胁检测、响应活动和系统状态的每日汇总",
      },
      {
        id: "report-002",
        name: "周度威胁分析报告",
        type: "weekly",
        status: "completed",
        createdAt: "2024-01-14T18:00:00Z",
        createdBy: "张安全",
        size: "5.7 MB",
        description: "本周威胁趋势分析、攻击模式识别和防护效果评估",
      },
      {
        id: "report-003",
        name: "合规性检查报告",
        type: "compliance",
        status: "generating",
        createdAt: "2024-01-15T14:30:00Z",
        createdBy: "李合规",
        size: "生成中...",
        description: "ISO 27001和等保三级合规性检查结果",
      },
      {
        id: "report-004",
        name: "安全事件调查报告",
        type: "incident",
        status: "completed",
        createdAt: "2024-01-12T16:45:00Z",
        createdBy: "王响应",
        size: "8.2 MB",
        description: "针对1月10日数据泄露事件的详细调查报告",
      },
      {
        id: "report-005",
        name: "月度安全态势报告",
        type: "monthly",
        status: "scheduled",
        createdAt: "2024-01-20T09:00:00Z",
        createdBy: "系统自动",
        size: "待生成",
        description: "月度安全态势总结、趋势分析和改进建议",
      },
    ];
    setReports(mockReports);
  }, []);

  // 过滤报告
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || report.type === filterType;
    const matchesStatus =
      filterStatus === "all" || report.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return BUSINESS_COLORS.status.success;
      case "generating":
        return BUSINESS_COLORS.status.processing;
      case "failed":
        return BUSINESS_COLORS.status.error;
      case "scheduled":
        return BUSINESS_COLORS.status.info;
      default:
        return BUSINESS_COLORS.neutral.silver;
    }
  };

  // 获取类型图标
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "daily":
        return <Calendar className="w-4 h-4" />;
      case "weekly":
        return <BarChart3 className="w-4 h-4" />;
      case "monthly":
        return <TrendingUp className="w-4 h-4" />;
      case "incident":
        return <AlertTriangle className="w-4 h-4" />;
      case "compliance":
        return <Shield className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  // 统计数据
  const reportStats = {
    total: reports.length,
    completed: reports.filter((r) => r.status === "completed").length,
    generating: reports.filter((r) => r.status === "generating").length,
    scheduled: reports.filter((r) => r.status === "scheduled").length,
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
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1
                className="text-3xl font-bold"
                style={{ color: BUSINESS_COLORS.ui.text.inverse }}
              >
                安全报告管理
              </h1>
              <p style={{ color: BUSINESS_COLORS.neutral.silver }}>
                生成、管理和分析安全报告与合规文档
              </p>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center space-x-3">
            <button
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200"
              style={{
                backgroundColor: BUSINESS_COLORS.primary.blue,
                color: `rgb(var(--brand-lightest))`,
                textShadow: `0 0 8px rgba(var(--brand-lightest), 0.5)`,
                boxShadow: BUSINESS_COLORS.shadows.md,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  BUSINESS_COLORS.primary.navy;
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  BUSINESS_COLORS.primary.blue;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">生成报告</span>
            </button>
          </div>
        </div>
      </div>

      {/* 统计指标 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatusCard
          title="总报告数"
          value={reportStats.total}
          icon={<FileText className="w-5 h-5" />}
          status="info"
        />

        <StatusCard
          title="已完成"
          value={reportStats.completed}
          icon={<BarChart3 className="w-5 h-5" />}
          status="success"
        />

        <StatusCard
          title="生成中"
          value={reportStats.generating}
          icon={<Activity className="w-5 h-5" />}
          status="warning"
        />

        <StatusCard
          title="已计划"
          value={reportStats.scheduled}
          icon={<Clock className="w-5 h-5" />}
          status="info"
        />
      </div>

      {/* 报告分类快捷入口 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {[
          { type: "daily", label: "每日报告", icon: Calendar },
          { type: "weekly", label: "周度报告", icon: BarChart3 },
          { type: "monthly", label: "月度报告", icon: TrendingUp },
          { type: "incident", label: "事件报告", icon: AlertTriangle },
          { type: "compliance", label: "合规报告", icon: Shield },
        ].map((category) => {
          const Icon = category.icon;
          const count = reports.filter((r) => r.type === category.type).length;

          return (
            <BusinessCard
              key={category.type}
              hoverable
              onClick={() => setFilterType(category.type)}
              className="cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: `${BUSINESS_COLORS.primary.blue}20`,
                    color: BUSINESS_COLORS.primary.blue,
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p
                    className="font-medium text-sm"
                    style={{ color: BUSINESS_COLORS.ui.text.primary }}
                  >
                    {category.label}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: BUSINESS_COLORS.ui.text.muted }}
                  >
                    {count} 个报告
                  </p>
                </div>
              </div>
            </BusinessCard>
          );
        })}
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
                placeholder="搜索报告..."
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
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  borderColor: BUSINESS_COLORS.ui.border.primary,
                  backgroundColor: BUSINESS_COLORS.ui.background.card,
                  color: BUSINESS_COLORS.ui.text.primary,
                }}
              >
                <option value="all">所有类型</option>
                <option value="daily">每日报告</option>
                <option value="weekly">周度报告</option>
                <option value="monthly">月度报告</option>
                <option value="incident">事件报告</option>
                <option value="compliance">合规报告</option>
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
                <option value="completed">已完成</option>
                <option value="generating">生成中</option>
                <option value="scheduled">已计划</option>
                <option value="failed">失败</option>
              </select>
            </div>
          </div>
        </div>
      </BusinessCard>

      {/* 报告列表 */}
      <DataTableCard
        title="安全报告列表"
        description={`共 ${filteredReports.length} 个报告`}
        data={filteredReports}
        columns={[
          {
            key: "type",
            label: "类型",
            render: (value) => (
              <div className="flex items-center space-x-2">
                {getTypeIcon(value)}
                <span className="font-medium text-sm capitalize">
                  {value === "daily"
                    ? "每日"
                    : value === "weekly"
                      ? "周度"
                      : value === "monthly"
                        ? "月度"
                        : value === "incident"
                          ? "事件"
                          : "合规"}
                </span>
              </div>
            ),
          },
          {
            key: "name",
            label: "报告名称",
            render: (value, row) => (
              <div>
                <p className="font-medium text-sm">{value}</p>
                <p
                  className="text-xs mt-1"
                  style={{ color: BUSINESS_COLORS.ui.text.muted }}
                >
                  {row.description}
                </p>
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
                {value === "completed"
                  ? "已完成"
                  : value === "generating"
                    ? "生成中"
                    : value === "scheduled"
                      ? "已计划"
                      : "失败"}
              </span>
            ),
          },
          {
            key: "createdBy",
            label: "创建者",
            render: (value) => <span className="text-sm">{value}</span>,
          },
          {
            key: "createdAt",
            label: "创建时间",
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
            key: "size",
            label: "大小",
            render: (value) => (
              <span
                className="text-sm font-mono"
                style={{ color: BUSINESS_COLORS.ui.text.secondary }}
              >
                {value}
              </span>
            ),
          },
          {
            key: "actions",
            label: "操作",
            render: (_, row) => (
              <div className="flex items-center space-x-2">
                {row.status === "completed" && (
                  <button
                    className="p-1 rounded transition-colors"
                    style={{ color: BUSINESS_COLORS.ui.text.muted }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        BUSINESS_COLORS.ui.background.secondary;
                      e.currentTarget.style.color =
                        BUSINESS_COLORS.ui.text.primary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color =
                        BUSINESS_COLORS.ui.text.muted;
                    }}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                )}
                <button
                  className="p-1 rounded transition-colors"
                  style={{ color: BUSINESS_COLORS.ui.text.muted }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      BUSINESS_COLORS.ui.background.secondary;
                    e.currentTarget.style.color =
                      BUSINESS_COLORS.ui.text.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = BUSINESS_COLORS.ui.text.muted;
                  }}
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
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
