import React, { useState, useEffect } from "react";
import {
  Shield,
  Globe,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Download,
  Plus,
  Brain,
  Target,
  Clock,
  MapPin,
  Hash,
  Mail,
  Link,
  FileText,
  Zap,
} from "lucide-react";
import {
  BusinessCard,
  StatusCard,
  InfoCard,
  DataTableCard,
} from "@/components/ui/BusinessCard";
import { BUSINESS_COLORS } from "@/lib/businessColors";

interface ThreatIntel {
  id: string;
  title: string;
  description: string;
  type: "campaign" | "actor" | "malware" | "vulnerability" | "ioc";
  severity: "critical" | "high" | "medium" | "low" | "info";
  confidence: number;
  tlp: "red" | "amber" | "green" | "white";
  source: string;
  firstSeen: string;
  lastSeen: string;
  tags: string[];
  iocs?: {
    ips: string[];
    domains: string[];
    hashes: string[];
    urls: string[];
    emails: string[];
  };
}

export default function ThreatIntelligence() {
  const [intelData, setIntelData] = useState<ThreatIntel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterTLP, setFilterTLP] = useState("all");
  const [selectedIntel, setSelectedIntel] = useState<ThreatIntel | null>(null);

  // 模拟威胁情报数据
  useEffect(() => {
    const mockIntel: ThreatIntel[] = [
      {
        id: "intel-001",
        title: "APT29 针对政府机构的鱼叉式钓鱼活动",
        description: "俄罗斯APT29组织使用新型恶意软件针对北约成员国政府机构",
        type: "campaign",
        severity: "critical",
        confidence: 95,
        tlp: "amber",
        source: "国家安全情报中心",
        firstSeen: "2024-01-10T08:00:00Z",
        lastSeen: "2024-01-15T14:30:00Z",
        tags: ["APT29", "钓鱼", "政府", "恶意软件"],
        iocs: {
          ips: ["203.0.113.45", "198.51.100.23"],
          domains: ["fake-gov-portal.com", "secure-update.net"],
          hashes: ["a1b2c3d4e5f6...", "9f8e7d6c5b4a..."],
          urls: [
            "https://fake-gov-portal.com/login",
            "https://secure-update.net/download",
          ],
          emails: ["admin@fake-gov-portal.com"],
        },
      },
      {
        id: "intel-002",
        title: "勒索软件组织BlackCat新变种",
        description:
          "BlackCat勒索软件发现新变种，采用双重加密技术提高赎金成功率",
        type: "malware",
        severity: "high",
        confidence: 88,
        tlp: "green",
        source: "反病毒实验室",
        firstSeen: "2024-01-12T15:20:00Z",
        lastSeen: "2024-01-15T09:45:00Z",
        tags: ["勒索软件", "BlackCat", "双重加密"],
        iocs: {
          ips: ["192.0.2.100"],
          domains: ["blackcat-payment.onion"],
          hashes: ["e1f2a3b4c5d6...", "7h8i9j0k1l2m..."],
          urls: ["http://blackcat-payment.onion/pay"],
          emails: [],
        },
      },
      {
        id: "intel-003",
        title: "CVE-2024-0001 Apache Struts远程代码执行漏洞",
        description: "Apache Struts框架发现新的远程代码执行漏洞，影响版本2.5.x",
        type: "vulnerability",
        severity: "critical",
        confidence: 100,
        tlp: "white",
        source: "CVE官方数据库",
        firstSeen: "2024-01-14T10:00:00Z",
        lastSeen: "2024-01-15T16:20:00Z",
        tags: ["CVE", "Apache Struts", "RCE", "web应用"],
      },
      {
        id: "intel-004",
        title: "恶意IP地址列表更新",
        description: "发现多个与僵尸网络相关的恶意IP地址正在进行扫描活动",
        type: "ioc",
        severity: "medium",
        confidence: 75,
        tlp: "green",
        source: "威胁情报共享联盟",
        firstSeen: "2024-01-13T12:30:00Z",
        lastSeen: "2024-01-15T11:15:00Z",
        tags: ["僵尸网络", "扫描", "恶意IP"],
        iocs: {
          ips: ["198.51.100.50", "203.0.113.75", "192.0.2.125"],
          domains: [],
          hashes: [],
          urls: [],
          emails: [],
        },
      },
    ];
    setIntelData(mockIntel);
  }, []);

  // 过滤威胁情报
  const filteredIntel = intelData.filter((intel) => {
    const matchesSearch =
      intel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intel.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intel.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesType = filterType === "all" || intel.type === filterType;
    const matchesTLP = filterTLP === "all" || intel.tlp === filterTLP;

    return matchesSearch && matchesType && matchesTLP;
  });

  // 获取类型颜色
  const getTypeColor = (type: string) => {
    switch (type) {
      case "campaign":
        return BUSINESS_COLORS.threat.critical;
      case "actor":
        return BUSINESS_COLORS.threat.high;
      case "malware":
        return BUSINESS_COLORS.threat.medium;
      case "vulnerability":
        return BUSINESS_COLORS.status.warning;
      case "ioc":
        return BUSINESS_COLORS.status.info;
      default:
        return BUSINESS_COLORS.neutral.silver;
    }
  };

  // 获取TLP颜色
  const getTLPColor = (tlp: string) => {
    switch (tlp) {
      case "red":
        return BUSINESS_COLORS.status.error;
      case "amber":
        return BUSINESS_COLORS.status.warning;
      case "green":
        return BUSINESS_COLORS.status.success;
      case "white":
        return BUSINESS_COLORS.neutral.silver;
      default:
        return BUSINESS_COLORS.neutral.silver;
    }
  };

  // 统计数据
  const intelStats = {
    total: intelData.length,
    critical: intelData.filter((i) => i.severity === "critical").length,
    campaigns: intelData.filter((i) => i.type === "campaign").length,
    malware: intelData.filter((i) => i.type === "malware").length,
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
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1
                className="text-3xl font-bold"
                style={{ color: BUSINESS_COLORS.ui.text.inverse }}
              >
                威胁情报中心
              </h1>
              <p style={{ color: BUSINESS_COLORS.neutral.silver }}>
                收集、分析和共享全球网络安全威胁情报
              </p>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center space-x-3">
            <button
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200"
              style={{
                backgroundColor: BUSINESS_COLORS.primary.blue,
                color: "white",
                boxShadow: BUSINESS_COLORS.shadows.md,
              }}
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">添加情报</span>
            </button>
          </div>
        </div>
      </div>

      {/* 统计指标 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatusCard
          title="总情报数"
          value={intelStats.total}
          icon={<Brain className="w-5 h-5" />}
          status="info"
        />

        <StatusCard
          title="严重威胁"
          value={intelStats.critical}
          icon={<AlertTriangle className="w-5 h-5" />}
          status="error"
        />

        <StatusCard
          title="攻击活动"
          value={intelStats.campaigns}
          icon={<Target className="w-5 h-5" />}
          status="warning"
        />

        <StatusCard
          title="恶意软件"
          value={intelStats.malware}
          icon={<Zap className="w-5 h-5" />}
          status="warning"
        />
      </div>

      {/* 威胁情报分类 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {[
          {
            type: "campaign",
            label: "攻击活动",
            icon: Target,
            count: intelStats.campaigns,
          },
          { type: "actor", label: "威胁行为者", icon: Shield, count: 0 },
          {
            type: "malware",
            label: "恶意软件",
            icon: Zap,
            count: intelStats.malware,
          },
          {
            type: "vulnerability",
            label: "安全漏洞",
            icon: AlertTriangle,
            count: 1,
          },
          { type: "ioc", label: "威胁指标", icon: Hash, count: 1 },
        ].map((category) => {
          const Icon = category.icon;

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
                    backgroundColor: `${getTypeColor(category.type)}20`,
                    color: getTypeColor(category.type),
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
                    {category.count} 条情报
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
                placeholder="搜索威胁情报..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200"
                style={{
                  borderColor: BUSINESS_COLORS.ui.border.primary,
                  backgroundColor: BUSINESS_COLORS.ui.background.card,
                  color: BUSINESS_COLORS.ui.text.primary,
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
                <option value="campaign">攻击活动</option>
                <option value="actor">威胁行为者</option>
                <option value="malware">恶意软件</option>
                <option value="vulnerability">安全漏洞</option>
                <option value="ioc">威胁指标</option>
              </select>

              <select
                value={filterTLP}
                onChange={(e) => setFilterTLP(e.target.value)}
                className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  borderColor: BUSINESS_COLORS.ui.border.primary,
                  backgroundColor: BUSINESS_COLORS.ui.background.card,
                  color: BUSINESS_COLORS.ui.text.primary,
                }}
              >
                <option value="all">所有TLP</option>
                <option value="white">TLP:WHITE</option>
                <option value="green">TLP:GREEN</option>
                <option value="amber">TLP:AMBER</option>
                <option value="red">TLP:RED</option>
              </select>
            </div>
          </div>
        </div>
      </BusinessCard>

      {/* 威胁情报列表 */}
      <DataTableCard
        title="威胁情报列表"
        description={`共 ${filteredIntel.length} 条威胁情报`}
        data={filteredIntel}
        columns={[
          {
            key: "type",
            label: "类型",
            render: (value) => (
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getTypeColor(value) }}
                />
                <span className="font-medium text-sm capitalize">
                  {value === "campaign"
                    ? "攻击活动"
                    : value === "actor"
                      ? "威胁行为者"
                      : value === "malware"
                        ? "恶意软件"
                        : value === "vulnerability"
                          ? "安全漏洞"
                          : "威胁指标"}
                </span>
              </div>
            ),
          },
          {
            key: "title",
            label: "威胁情报标题",
            render: (value, row) => (
              <div>
                <p className="font-medium text-sm">{value}</p>
                <div className="flex items-center space-x-2 mt-1">
                  {row.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 rounded text-xs"
                      style={{
                        backgroundColor: `${BUSINESS_COLORS.primary.blue}20`,
                        color: BUSINESS_COLORS.primary.blue,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ),
          },
          {
            key: "severity",
            label: "严重性",
            render: (value) => (
              <span
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${BUSINESS_COLORS.threat[value as keyof typeof BUSINESS_COLORS.threat]}20`,
                  color:
                    BUSINESS_COLORS.threat[
                      value as keyof typeof BUSINESS_COLORS.threat
                    ],
                  border: `1px solid ${BUSINESS_COLORS.threat[value as keyof typeof BUSINESS_COLORS.threat]}40`,
                }}
              >
                {value === "critical"
                  ? "严重"
                  : value === "high"
                    ? "高"
                    : value === "medium"
                      ? "中"
                      : value === "low"
                        ? "低"
                        : "信息"}
              </span>
            ),
          },
          {
            key: "tlp",
            label: "TLP级别",
            render: (value) => (
              <span
                className="px-2 py-1 rounded text-xs font-medium"
                style={{
                  backgroundColor: `${getTLPColor(value)}20`,
                  color: getTLPColor(value),
                  border: `1px solid ${getTLPColor(value)}40`,
                }}
              >
                TLP:{value.toUpperCase()}
              </span>
            ),
          },
          {
            key: "confidence",
            label: "可信度",
            render: (value) => (
              <div className="flex items-center space-x-2">
                <div
                  className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden"
                  style={{
                    backgroundColor: BUSINESS_COLORS.ui.background.tertiary,
                  }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${value}%`,
                      backgroundColor:
                        value >= 80
                          ? BUSINESS_COLORS.status.success
                          : value >= 60
                            ? BUSINESS_COLORS.status.warning
                            : BUSINESS_COLORS.status.error,
                    }}
                  />
                </div>
                <span
                  className="text-sm font-medium"
                  style={{ color: BUSINESS_COLORS.ui.text.primary }}
                >
                  {value}%
                </span>
              </div>
            ),
          },
          {
            key: "source",
            label: "来源",
            render: (value) => (
              <span
                className="text-sm"
                style={{ color: BUSINESS_COLORS.ui.text.secondary }}
              >
                {value}
              </span>
            ),
          },
          {
            key: "lastSeen",
            label: "最新发现",
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
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedIntel(row)}
                  className="p-1 rounded transition-colors"
                  style={{ color: BUSINESS_COLORS.ui.text.muted }}
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  className="p-1 rounded transition-colors"
                  style={{ color: BUSINESS_COLORS.ui.text.muted }}
                >
                  <Download className="w-4 h-4" />
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
