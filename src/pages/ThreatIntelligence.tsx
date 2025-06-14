import React, { useState, useEffect, useMemo } from "react";
import {
  Brain,
  Shield,
  Globe,
  Target,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Eye,
  AlertTriangle,
  Info,
  MapPin,
  Calendar,
  Clock,
  Users,
  Database,
  Network,
  Server,
  Activity,
  TrendingUp,
  TrendingDown,
  Zap,
  Lock,
  Unlock,
  Bug,
  UserX,
  FileText,
  Hash,
  Link,
  Mail,
  Smartphone,
  HardDrive,
  Wifi,
  Radio,
  Satellite,
  Flag,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Edit3,
  Trash2,
  Share,
  BookOpen,
  Star,
  StarOff,
  Bookmark,
  Tag,
  ExternalLink,
  Copy,
  Settings,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { TechCard, StatusCard } from "@/components/ui/TechCard";
import { TECH_COLORS } from "@/lib/techColors";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

/**
 * 威胁情报接口定义
 */
interface ThreatIntelligence {
  id: string;
  title: string;
  description: string;
  type:
    | "ioc"
    | "campaign"
    | "actor"
    | "malware"
    | "vulnerability"
    | "technique";
  severity: "critical" | "high" | "medium" | "low" | "info";
  confidence: number;
  tlp: "red" | "amber" | "green" | "white"; // Traffic Light Protocol
  source: {
    name: string;
    type: "internal" | "commercial" | "osint" | "government" | "community";
    reliability: number;
  };
  tags: string[];
  indicators: {
    type: string;
    value: string;
    context?: string;
  }[];
  mitre: {
    tactics: string[];
    techniques: string[];
  };
  geolocation: {
    countries: string[];
    regions: string[];
  };
  timeline: {
    first_seen: string;
    last_seen: string;
    created: string;
    updated: string;
  };
  relationships: {
    type: string;
    target: string;
    description: string;
  }[];
  analysis: {
    summary: string;
    impact: string;
    recommendations: string[];
  };
  references: {
    title: string;
    url: string;
    source: string;
  }[];
  isBookmarked: boolean;
  isStarred: boolean;
  views: number;
  shares: number;
}

/**
 * IOC类型接口
 */
interface IOC {
  id: string;
  type: "ip" | "domain" | "url" | "hash" | "email" | "file";
  value: string;
  description?: string;
  malicious: boolean;
  confidence: number;
  source: string;
  first_seen: string;
  last_seen: string;
  tags: string[];
  related_threats: string[];
}

/**
 * 威胁情报主页面
 */
export default function ThreatIntelligence() {
  const navigate = useNavigate();

  // 状态管理
  const [intelligenceData, setIntelligenceData] = useState<
    ThreatIntelligence[]
  >([]);
  const [iocData, setIocData] = useState<IOC[]>([]);
  const [activeTab, setActiveTab] = useState("intelligence");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterTLP, setFilterTLP] = useState<string>("all");
  const [selectedIntel, setSelectedIntel] = useState<ThreatIntelligence | null>(
    null,
  );
  const [isCreatingIntel, setIsCreatingIntel] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // 统计数据
  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    high: 0,
    campaigns: 0,
    actors: 0,
    malware: 0,
    iocs: 0,
    sources: 0,
  });

  // 初始化数据
  useEffect(() => {
    const mockIntelligence: ThreatIntelligence[] = [
      {
        id: "intel-001",
        title: "APT29 (Cozy Bear) 最新攻击活动",
        description:
          "APT29组织利用COVID-19主题的钓鱼邮件进行针对性攻击，目标为政府机构和医疗组织",
        type: "campaign",
        severity: "critical",
        confidence: 95,
        tlp: "amber",
        source: {
          name: "FireEye Threat Intelligence",
          type: "commercial",
          reliability: 95,
        },
        tags: ["apt29", "cozy-bear", "covid-19", "phishing", "government"],
        indicators: [
          {
            type: "domain",
            value: "covid-vaccine-info.com",
            context: "钓鱼域名",
          },
          {
            type: "ip",
            value: "185.159.158.177",
            context: "C&C服务器",
          },
          {
            type: "hash",
            value: "a1b2c3d4e5f6789012345678901234567890abcd",
            context: "恶意软件样本",
          },
        ],
        mitre: {
          tactics: ["Initial Access", "Persistence", "Defense Evasion"],
          techniques: ["T1566.001", "T1547.001", "T1055"],
        },
        geolocation: {
          countries: ["俄罗斯", "乌克兰"],
          regions: ["东欧"],
        },
        timeline: {
          first_seen: "2024-01-10T00:00:00Z",
          last_seen: "2024-01-15T12:00:00Z",
          created: "2024-01-15T14:30:00Z",
          updated: "2024-01-15T16:45:00Z",
        },
        relationships: [
          {
            type: "attributed-to",
            target: "APT29",
            description: "活动归属于APT29组织",
          },
          {
            type: "uses",
            target: "WellMess",
            description: "使用WellMess后门工具",
          },
        ],
        analysis: {
          summary:
            "APT29组织继续其针对西方政府和医疗机构的网络间谍活动，利用当前疫情主题提高攻击成功率。",
          impact: "可能导致敏感政府信息泄露，影响国家安全和疫情防控工作。",
          recommendations: [
            "加强邮件安全过滤",
            "提高员工安全意识培训",
            "部署端点检测与响应（EDR）解决方案",
            "定期更新安全策略",
          ],
        },
        references: [
          {
            title: "APT29 targets COVID-19 vaccine development",
            url: "https://www.fireeye.com/blog/threat-research/2020/11/apt29-targets-covid-19-vaccine-development.html",
            source: "FireEye",
          },
        ],
        isBookmarked: true,
        isStarred: false,
        views: 156,
        shares: 23,
      },
      {
        id: "intel-002",
        title: "Emotet 银行木马新变种分析",
        description:
          "发现Emotet银行木马的新变种，具有增强的反分析能力和更广泛的目标范围",
        type: "malware",
        severity: "high",
        confidence: 88,
        tlp: "green",
        source: {
          name: "Internal Research Team",
          type: "internal",
          reliability: 92,
        },
        tags: ["emotet", "banking-trojan", "malware", "variant"],
        indicators: [
          {
            type: "hash",
            value: "d1e2f3a4b5c6789012345678901234567890efgh",
            context: "恶意软件样本",
          },
          {
            type: "domain",
            value: "update-service.net",
            context: "C&C通信域名",
          },
        ],
        mitre: {
          tactics: ["Initial Access", "Execution", "Collection"],
          techniques: ["T1566.001", "T1204.002", "T1005"],
        },
        geolocation: {
          countries: ["德国", "波兰", "捷克"],
          regions: ["欧洲"],
        },
        timeline: {
          first_seen: "2024-01-12T00:00:00Z",
          last_seen: "2024-01-15T08:00:00Z",
          created: "2024-01-15T10:00:00Z",
          updated: "2024-01-15T15:30:00Z",
        },
        relationships: [
          {
            type: "variant-of",
            target: "Emotet",
            description: "Emotet恶意软件的新变种",
          },
        ],
        analysis: {
          summary:
            "新的Emotet变种增加了多种反分析技术，能够检测虚拟机环境并修改其行为。",
          impact: "可能影响金融机构和企业的网络安全，导致财务损失。",
          recommendations: [
            "更新反病毒特征库",
            "监控网络流量异常",
            "加强邮件附件检查",
            "员工安全培训",
          ],
        },
        references: [
          {
            title: "New Emotet variant analysis",
            url: "https://internal.research.com/emotet-analysis",
            source: "Internal",
          },
        ],
        isBookmarked: false,
        isStarred: true,
        views: 89,
        shares: 12,
      },
      {
        id: "intel-003",
        title: "CVE-2024-0001 - Apache Web服务器远程代码执行漏洞",
        description:
          "Apache HTTP Server中发现的严重远程代码执行漏洞，影响2.4.x版本",
        type: "vulnerability",
        severity: "critical",
        confidence: 100,
        tlp: "white",
        source: {
          name: "Apache Security Team",
          type: "government",
          reliability: 100,
        },
        tags: ["cve-2024-0001", "apache", "rce", "vulnerability"],
        indicators: [
          {
            type: "cve",
            value: "CVE-2024-0001",
            context: "漏洞编号",
          },
        ],
        mitre: {
          tactics: ["Initial Access", "Execution"],
          techniques: ["T1190", "T1059"],
        },
        geolocation: {
          countries: ["全球"],
          regions: ["全球"],
        },
        timeline: {
          first_seen: "2024-01-01T00:00:00Z",
          last_seen: "2024-01-15T00:00:00Z",
          created: "2024-01-15T08:00:00Z",
          updated: "2024-01-15T12:00:00Z",
        },
        relationships: [
          {
            type: "affects",
            target: "Apache HTTP Server",
            description: "影响Apache HTTP Server 2.4.x版本",
          },
        ],
        analysis: {
          summary:
            "该漏洞允许远程攻击者通过特制的HTTP请求执行任意代码，无需身份认证。",
          impact: "可能导致服务器完全被控制，数据泄露和服务中断。",
          recommendations: [
            "立即升级到最新版本",
            "部署Web应用防火墙",
            "监控异常HTTP请求",
            "定期安全扫描",
          ],
        },
        references: [
          {
            title: "Apache HTTP Server Security Advisory",
            url: "https://httpd.apache.org/security/vulnerabilities_24.html",
            source: "Apache",
          },
        ],
        isBookmarked: true,
        isStarred: true,
        views: 234,
        shares: 45,
      },
    ];

    const mockIOCs: IOC[] = [
      {
        id: "ioc-001",
        type: "ip",
        value: "185.159.158.177",
        description: "APT29 C&C服务器",
        malicious: true,
        confidence: 95,
        source: "FireEye",
        first_seen: "2024-01-10T00:00:00Z",
        last_seen: "2024-01-15T12:00:00Z",
        tags: ["apt29", "c2", "cozy-bear"],
        related_threats: ["intel-001"],
      },
      {
        id: "ioc-002",
        type: "domain",
        value: "covid-vaccine-info.com",
        description: "钓鱼域名，伪装成疫苗信息网站",
        malicious: true,
        confidence: 98,
        source: "Internal",
        first_seen: "2024-01-12T00:00:00Z",
        last_seen: "2024-01-15T08:00:00Z",
        tags: ["phishing", "covid-19", "apt29"],
        related_threats: ["intel-001"],
      },
      {
        id: "ioc-003",
        type: "hash",
        value: "d1e2f3a4b5c6789012345678901234567890efgh",
        description: "Emotet变种样本哈希",
        malicious: true,
        confidence: 92,
        source: "VirusTotal",
        first_seen: "2024-01-13T00:00:00Z",
        last_seen: "2024-01-15T10:00:00Z",
        tags: ["emotet", "banking-trojan", "malware"],
        related_threats: ["intel-002"],
      },
      {
        id: "ioc-004",
        type: "url",
        value: "http://malicious-site.com/payload.exe",
        description: "恶意软件下载链接",
        malicious: true,
        confidence: 85,
        source: "URLVoid",
        first_seen: "2024-01-14T00:00:00Z",
        last_seen: "2024-01-15T06:00:00Z",
        tags: ["malware", "payload", "download"],
        related_threats: [],
      },
    ];

    setIntelligenceData(mockIntelligence);
    setIocData(mockIOCs);

    // 计算统计数据
    setStats({
      total: mockIntelligence.length,
      critical: mockIntelligence.filter((i) => i.severity === "critical")
        .length,
      high: mockIntelligence.filter((i) => i.severity === "high").length,
      campaigns: mockIntelligence.filter((i) => i.type === "campaign").length,
      actors: mockIntelligence.filter((i) => i.type === "actor").length,
      malware: mockIntelligence.filter((i) => i.type === "malware").length,
      iocs: mockIOCs.length,
      sources: new Set(mockIntelligence.map((i) => i.source.name)).size,
    });
  }, []);

  // 过滤威胁情报
  const filteredIntelligence = useMemo(() => {
    return intelligenceData.filter((intel) => {
      const matchesSearch =
        intel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        intel.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        intel.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      const matchesType = filterType === "all" || intel.type === filterType;
      const matchesSeverity =
        filterSeverity === "all" || intel.severity === filterSeverity;
      const matchesTLP = filterTLP === "all" || intel.tlp === filterTLP;

      return matchesSearch && matchesType && matchesSeverity && matchesTLP;
    });
  }, [intelligenceData, searchTerm, filterType, filterSeverity, filterTLP]);

  // 过滤IOC
  const filteredIOCs = useMemo(() => {
    return iocData.filter((ioc) => {
      const matchesSearch =
        ioc.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ioc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ioc.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      return matchesSearch;
    });
  }, [iocData, searchTerm]);

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

  // 获取TLP颜色
  const getTLPColor = (tlp: string) => {
    switch (tlp) {
      case "red":
        return TECH_COLORS.status.critical;
      case "amber":
        return TECH_COLORS.status.warning;
      case "green":
        return TECH_COLORS.status.online;
      case "white":
        return TECH_COLORS.ui.text.primary;
      default:
        return TECH_COLORS.ui.text.muted;
    }
  };

  // 标签页配置
  const tabs = [
    {
      id: "intelligence",
      label: "威胁情报",
      icon: Brain,
      count: intelligenceData.length,
    },
    { id: "iocs", label: "IOC指标", icon: Target, count: iocData.length },
    { id: "feeds", label: "情报源", icon: Database, count: stats.sources },
    { id: "analytics", label: "分析报告", icon: Activity, count: 0 },
  ];

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
                  background: TECH_COLORS.gradients.quantum,
                  boxShadow: `0 0 20px ${TECH_COLORS.primary.quantum}66`,
                }}
              >
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1
                  className="text-3xl font-bold font-mono"
                  style={{
                    color: TECH_COLORS.ui.text.primary,
                    textShadow: `0 0 10px ${TECH_COLORS.primary.quantum}66`,
                  }}
                >
                  THREAT INTELLIGENCE
                </h1>
                <p
                  className="text-sm font-mono"
                  style={{ color: TECH_COLORS.ui.text.secondary }}
                >
                  Advanced Threat Intelligence Collection & Analysis
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsCreatingIntel(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 font-mono"
              style={{
                backgroundColor: TECH_COLORS.primary.quantum,
                color: "white",
                boxShadow: `0 0 15px ${TECH_COLORS.primary.quantum}66`,
              }}
            >
              <Plus className="w-4 h-4" />
              <span>添加情报</span>
            </button>

            <button
              className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 font-mono"
              style={{
                backgroundColor: TECH_COLORS.ui.background.panel,
                color: TECH_COLORS.ui.text.secondary,
                border: `1px solid ${TECH_COLORS.ui.border.primary}`,
              }}
            >
              <Upload className="w-4 h-4" />
              <span>导入</span>
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 font-mono"
              style={{
                backgroundColor: showFilters
                  ? TECH_COLORS.primary.cyber
                  : TECH_COLORS.ui.background.panel,
                color: showFilters ? "white" : TECH_COLORS.ui.text.secondary,
                border: `1px solid ${TECH_COLORS.ui.border.primary}`,
              }}
            >
              <Filter className="w-4 h-4" />
              <span>过滤器</span>
            </button>
          </div>
        </div>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
        <StatusCard
          status="processing"
          label="总情报数"
          value={stats.total}
          icon={<Brain className="w-4 h-4" />}
        />
        <StatusCard
          status="critical"
          label="严重威胁"
          value={stats.critical}
          icon={<AlertTriangle className="w-4 h-4" />}
        />
        <StatusCard
          status="warning"
          label="高危威胁"
          value={stats.high}
          icon={<Zap className="w-4 h-4" />}
        />
        <StatusCard
          status="processing"
          label="攻击活动"
          value={stats.campaigns}
          icon={<Target className="w-4 h-4" />}
        />
        <StatusCard
          status="critical"
          label="威胁组织"
          value={stats.actors}
          icon={<Users className="w-4 h-4" />}
        />
        <StatusCard
          status="warning"
          label="恶意软件"
          value={stats.malware}
          icon={<Bug className="w-4 h-4" />}
        />
        <StatusCard
          status="online"
          label="IOC指标"
          value={stats.iocs}
          icon={<Hash className="w-4 h-4" />}
        />
        <StatusCard
          status="processing"
          label="情报源"
          value={stats.sources}
          icon={<Database className="w-4 h-4" />}
        />
      </div>

      {/* 标签页导航 */}
      <TechCard variant="cyber" className="mb-6">
        <div className="flex border-b overflow-x-auto">
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
                    ? TECH_COLORS.primary.quantum
                    : TECH_COLORS.ui.text.secondary,
                borderColor:
                  activeTab === tab.id
                    ? TECH_COLORS.primary.quantum
                    : "transparent",
                backgroundColor:
                  activeTab === tab.id
                    ? `${TECH_COLORS.primary.quantum}10`
                    : "transparent",
              }}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span
                className="px-2 py-0.5 rounded-full text-xs"
                style={{
                  backgroundColor: `${TECH_COLORS.primary.quantum}20`,
                  color: TECH_COLORS.primary.quantum,
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </TechCard>

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
                placeholder="搜索威胁情报..."
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

            {/* 类型过滤 */}
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
              <option value="campaign">攻击活动</option>
              <option value="actor">威胁组织</option>
              <option value="malware">恶意软件</option>
              <option value="vulnerability">漏洞情报</option>
              <option value="technique">攻���技术</option>
              <option value="ioc">IOC指标</option>
            </select>

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

            {/* TLP过滤 */}
            <select
              value={filterTLP}
              onChange={(e) => setFilterTLP(e.target.value)}
              className="px-3 py-2 rounded-lg font-mono text-sm"
              style={{
                backgroundColor: TECH_COLORS.ui.background.panel,
                border: `1px solid ${TECH_COLORS.ui.border.primary}`,
                color: TECH_COLORS.ui.text.primary,
              }}
            >
              <option value="all">所有TLP等级</option>
              <option value="red">TLP:RED</option>
              <option value="amber">TLP:AMBER</option>
              <option value="green">TLP:GREEN</option>
              <option value="white">TLP:WHITE</option>
            </select>
          </div>
        </TechCard>
      )}

      {/* 内容区域 */}
      <div>
        {activeTab === "intelligence" && (
          <ThreatIntelligenceTab
            data={filteredIntelligence}
            onViewDetails={setSelectedIntel}
            getSeverityColor={getSeverityColor}
            getTLPColor={getTLPColor}
          />
        )}
        {activeTab === "iocs" && (
          <IOCTab data={filteredIOCs} getSeverityColor={getSeverityColor} />
        )}
        {activeTab === "feeds" && <ThreatFeedsTab />}
        {activeTab === "analytics" && <AnalyticsTab />}
      </div>

      {/* 威胁情报详情模态框 */}
      {selectedIntel && (
        <ThreatIntelDetailModal
          intel={selectedIntel}
          onClose={() => setSelectedIntel(null)}
          getSeverityColor={getSeverityColor}
          getTLPColor={getTLPColor}
        />
      )}
    </div>
  );
}

/**
 * 威胁情报标签页
 */
function ThreatIntelligenceTab({
  data,
  onViewDetails,
  getSeverityColor,
  getTLPColor,
}: {
  data: ThreatIntelligence[];
  onViewDetails: (intel: ThreatIntelligence) => void;
  getSeverityColor: (severity: string) => string;
  getTLPColor: (tlp: string) => string;
}) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {data.map((intel) => (
        <ThreatIntelCard
          key={intel.id}
          intel={intel}
          onView={() => onViewDetails(intel)}
          getSeverityColor={getSeverityColor}
          getTLPColor={getTLPColor}
        />
      ))}
    </div>
  );
}

/**
 * 威胁情报卡片
 */
function ThreatIntelCard({
  intel,
  onView,
  getSeverityColor,
  getTLPColor,
}: {
  intel: ThreatIntelligence;
  onView: () => void;
  getSeverityColor: (severity: string) => string;
  getTLPColor: (tlp: string) => string;
}) {
  const severityColor = getSeverityColor(intel.severity);
  const tlpColor = getTLPColor(intel.tlp);

  return (
    <TechCard
      variant="quantum"
      className="p-4 cursor-pointer transition-all duration-300 hover:scale-[1.01]"
      onClick={onView}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          {/* 类型图标 */}
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: `${severityColor}20`,
              border: `2px solid ${severityColor}`,
            }}
          >
            {intel.type === "campaign" && (
              <Target className="w-6 h-6" style={{ color: severityColor }} />
            )}
            {intel.type === "malware" && (
              <Bug className="w-6 h-6" style={{ color: severityColor }} />
            )}
            {intel.type === "vulnerability" && (
              <Shield className="w-6 h-6" style={{ color: severityColor }} />
            )}
            {intel.type === "actor" && (
              <Users className="w-6 h-6" style={{ color: severityColor }} />
            )}
            {intel.type === "technique" && (
              <Settings className="w-6 h-6" style={{ color: severityColor }} />
            )}
            {intel.type === "ioc" && (
              <Hash className="w-6 h-6" style={{ color: severityColor }} />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3
                className="text-lg font-bold font-mono"
                style={{ color: TECH_COLORS.ui.text.primary }}
              >
                {intel.title}
              </h3>
              <span
                className="px-2 py-1 rounded-full text-xs font-mono"
                style={{
                  backgroundColor: `${severityColor}20`,
                  color: severityColor,
                  border: `1px solid ${severityColor}`,
                }}
              >
                {intel.severity.toUpperCase()}
              </span>
              <span
                className="px-2 py-1 rounded-full text-xs font-mono"
                style={{
                  backgroundColor: `${tlpColor}20`,
                  color: tlpColor,
                  border: `1px solid ${tlpColor}`,
                }}
              >
                TLP:{intel.tlp.toUpperCase()}
              </span>
              <span
                className="px-2 py-1 rounded-full text-xs font-mono"
                style={{
                  backgroundColor: `${TECH_COLORS.primary.neon}20`,
                  color: TECH_COLORS.primary.neon,
                  border: `1px solid ${TECH_COLORS.primary.neon}`,
                }}
              >
                {intel.type.toUpperCase()}
              </span>
            </div>

            <p
              className="text-sm font-mono mb-3"
              style={{ color: TECH_COLORS.ui.text.secondary }}
            >
              {intel.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-mono mb-3">
              <div>
                <span style={{ color: TECH_COLORS.ui.text.muted }}>来源: </span>
                <span style={{ color: TECH_COLORS.ui.text.primary }}>
                  {intel.source.name}
                </span>
              </div>
              <div>
                <span style={{ color: TECH_COLORS.ui.text.muted }}>
                  置信度:{" "}
                </span>
                <span style={{ color: TECH_COLORS.ui.text.primary }}>
                  {intel.confidence}%
                </span>
              </div>
              <div>
                <span style={{ color: TECH_COLORS.ui.text.muted }}>更新: </span>
                <span style={{ color: TECH_COLORS.ui.text.primary }}>
                  {new Date(intel.timeline.updated).toLocaleDateString("zh-CN")}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {intel.tags.slice(0, 6).map((tag, index) => (
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
              {intel.tags.length > 6 && (
                <span
                  className="px-2 py-1 rounded text-xs font-mono"
                  style={{ color: TECH_COLORS.ui.text.muted }}
                >
                  +{intel.tags.length - 6}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-2">
          {/* 操作按钮 */}
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // 书签功能
              }}
              className="p-1 rounded transition-colors"
              style={{
                color: intel.isBookmarked
                  ? TECH_COLORS.status.warning
                  : TECH_COLORS.ui.text.muted,
              }}
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // 星标功能
              }}
              className="p-1 rounded transition-colors"
              style={{
                color: intel.isStarred
                  ? TECH_COLORS.status.warning
                  : TECH_COLORS.ui.text.muted,
              }}
            >
              <Star className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // 分享功能
              }}
              className="p-1 rounded transition-colors"
              style={{ color: TECH_COLORS.ui.text.muted }}
            >
              <Share className="w-4 h-4" />
            </button>
          </div>

          {/* 统计信息 */}
          <div className="text-xs font-mono text-right">
            <div style={{ color: TECH_COLORS.ui.text.muted }}>
              <Eye className="w-3 h-3 inline mr-1" />
              {intel.views}
            </div>
            <div style={{ color: TECH_COLORS.ui.text.muted }}>
              <Share className="w-3 h-3 inline mr-1" />
              {intel.shares}
            </div>
          </div>

          {/* IOC数量 */}
          <div
            className="text-center p-2 rounded"
            style={{
              backgroundColor: `${TECH_COLORS.primary.quantum}20`,
              border: `1px solid ${TECH_COLORS.primary.quantum}`,
            }}
          >
            <div
              className="text-lg font-bold font-mono"
              style={{ color: TECH_COLORS.primary.quantum }}
            >
              {intel.indicators.length}
            </div>
            <div
              className="text-xs font-mono"
              style={{ color: TECH_COLORS.ui.text.muted }}
            >
              IOCs
            </div>
          </div>
        </div>
      </div>
    </TechCard>
  );
}

/**
 * IOC标签页
 */
function IOCTab({
  data,
  getSeverityColor,
}: {
  data: IOC[];
  getSeverityColor: (severity: string) => string;
}) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {data.map((ioc) => (
        <IOCCard key={ioc.id} ioc={ioc} getSeverityColor={getSeverityColor} />
      ))}
    </div>
  );
}

/**
 * IOC卡片
 */
function IOCCard({
  ioc,
  getSeverityColor,
}: {
  ioc: IOC;
  getSeverityColor: (severity: string) => string;
}) {
  const getIOCIcon = (type: string) => {
    switch (type) {
      case "ip":
        return <Globe className="w-5 h-5" />;
      case "domain":
        return <Network className="w-5 h-5" />;
      case "url":
        return <Link className="w-5 h-5" />;
      case "hash":
        return <Hash className="w-5 h-5" />;
      case "email":
        return <Mail className="w-5 h-5" />;
      case "file":
        return <FileText className="w-5 h-5" />;
      default:
        return <Target className="w-5 h-5" />;
    }
  };

  const confidenceColor =
    ioc.confidence >= 90
      ? TECH_COLORS.status.online
      : ioc.confidence >= 70
        ? TECH_COLORS.status.warning
        : TECH_COLORS.status.critical;

  return (
    <TechCard variant="matrix" className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: ioc.malicious
                ? `${TECH_COLORS.status.critical}20`
                : `${TECH_COLORS.status.online}20`,
              border: `2px solid ${
                ioc.malicious
                  ? TECH_COLORS.status.critical
                  : TECH_COLORS.status.online
              }`,
              color: ioc.malicious
                ? TECH_COLORS.status.critical
                : TECH_COLORS.status.online,
            }}
          >
            {getIOCIcon(ioc.type)}
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span
                className="font-bold font-mono"
                style={{ color: TECH_COLORS.ui.text.primary }}
              >
                {ioc.value}
              </span>
              <span
                className="px-2 py-1 rounded-full text-xs font-mono"
                style={{
                  backgroundColor: `${TECH_COLORS.primary.matrix}20`,
                  color: TECH_COLORS.primary.matrix,
                  border: `1px solid ${TECH_COLORS.primary.matrix}`,
                }}
              >
                {ioc.type.toUpperCase()}
              </span>
              <span
                className="px-2 py-1 rounded-full text-xs font-mono"
                style={{
                  backgroundColor: ioc.malicious
                    ? `${TECH_COLORS.status.critical}20`
                    : `${TECH_COLORS.status.online}20`,
                  color: ioc.malicious
                    ? TECH_COLORS.status.critical
                    : TECH_COLORS.status.online,
                  border: `1px solid ${
                    ioc.malicious
                      ? TECH_COLORS.status.critical
                      : TECH_COLORS.status.online
                  }`,
                }}
              >
                {ioc.malicious ? "恶意" : "可疑"}
              </span>
            </div>

            {ioc.description && (
              <p
                className="text-sm font-mono mb-3"
                style={{ color: TECH_COLORS.ui.text.secondary }}
              >
                {ioc.description}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-mono mb-3">
              <div>
                <span style={{ color: TECH_COLORS.ui.text.muted }}>来源: </span>
                <span style={{ color: TECH_COLORS.ui.text.primary }}>
                  {ioc.source}
                </span>
              </div>
              <div>
                <span style={{ color: TECH_COLORS.ui.text.muted }}>
                  首次发现:{" "}
                </span>
                <span style={{ color: TECH_COLORS.ui.text.primary }}>
                  {new Date(ioc.first_seen).toLocaleDateString("zh-CN")}
                </span>
              </div>
              <div>
                <span style={{ color: TECH_COLORS.ui.text.muted }}>
                  最后发现:{" "}
                </span>
                <span style={{ color: TECH_COLORS.ui.text.primary }}>
                  {new Date(ioc.last_seen).toLocaleDateString("zh-CN")}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {ioc.tags.map((tag, index) => (
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
          <div
            className="text-center p-2 rounded"
            style={{
              backgroundColor: `${confidenceColor}20`,
              border: `1px solid ${confidenceColor}`,
            }}
          >
            <div
              className="text-lg font-bold font-mono"
              style={{ color: confidenceColor }}
            >
              {ioc.confidence}%
            </div>
            <div
              className="text-xs font-mono"
              style={{ color: TECH_COLORS.ui.text.muted }}
            >
              置信度
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              className="p-1 rounded transition-colors"
              style={{ color: TECH_COLORS.ui.text.muted }}
              title="复制"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              className="p-1 rounded transition-colors"
              style={{ color: TECH_COLORS.ui.text.muted }}
              title="查看详情"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </TechCard>
  );
}

/**
 * 威胁情报源标签页
 */
function ThreatFeedsTab() {
  const feeds = [
    {
      name: "FireEye Threat Intelligence",
      type: "Commercial",
      status: "Active",
      last_update: "2024-01-15T16:30:00Z",
      records: 15420,
      reliability: 98,
    },
    {
      name: "MISP Community",
      type: "Community",
      status: "Active",
      last_update: "2024-01-15T15:45:00Z",
      records: 8943,
      reliability: 85,
    },
    {
      name: "Internal Research",
      type: "Internal",
      status: "Active",
      last_update: "2024-01-15T14:20:00Z",
      records: 2156,
      reliability: 95,
    },
    {
      name: "Government Feed",
      type: "Government",
      status: "Active",
      last_update: "2024-01-15T12:00:00Z",
      records: 5632,
      reliability: 99,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4">
      {feeds.map((feed, index) => (
        <TechCard key={index} variant="neural" className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: `${TECH_COLORS.primary.neural}20`,
                  border: `2px solid ${TECH_COLORS.primary.neural}`,
                }}
              >
                <Database
                  className="w-6 h-6"
                  style={{ color: TECH_COLORS.primary.neural }}
                />
              </div>
              <div>
                <h3
                  className="text-lg font-bold font-mono"
                  style={{ color: TECH_COLORS.ui.text.primary }}
                >
                  {feed.name}
                </h3>
                <p
                  className="text-sm font-mono"
                  style={{ color: TECH_COLORS.ui.text.secondary }}
                >
                  {feed.type} • {feed.records.toLocaleString()} 条记录
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div
                  className="text-lg font-bold font-mono"
                  style={{ color: TECH_COLORS.status.online }}
                >
                  {feed.reliability}%
                </div>
                <div
                  className="text-xs font-mono"
                  style={{ color: TECH_COLORS.ui.text.muted }}
                >
                  可靠性
                </div>
              </div>
              <div className="text-center">
                <div
                  className="text-sm font-mono"
                  style={{ color: TECH_COLORS.ui.text.primary }}
                >
                  {new Date(feed.last_update).toLocaleString("zh-CN")}
                </div>
                <div
                  className="text-xs font-mono"
                  style={{ color: TECH_COLORS.ui.text.muted }}
                >
                  最后更新
                </div>
              </div>
              <span
                className="px-3 py-1 rounded-full text-sm font-mono"
                style={{
                  backgroundColor: `${TECH_COLORS.status.online}20`,
                  color: TECH_COLORS.status.online,
                  border: `1px solid ${TECH_COLORS.status.online}`,
                }}
              >
                {feed.status}
              </span>
            </div>
          </div>
        </TechCard>
      ))}
    </div>
  );
}

/**
 * 分析报告标签页
 */
function AnalyticsTab() {
  return (
    <div className="text-center py-12">
      <div
        className="text-6xl mb-4"
        style={{ color: TECH_COLORS.ui.text.muted }}
      >
        📊
      </div>
      <h3
        className="text-xl font-bold font-mono mb-2"
        style={{ color: TECH_COLORS.ui.text.primary }}
      >
        分析报告功能
      </h3>
      <p
        className="text-sm font-mono"
        style={{ color: TECH_COLORS.ui.text.secondary }}
      >
        威胁情报分析报告功能正在开发中...
      </p>
    </div>
  );
}

/**
 * 威胁情报详情模态框
 */
function ThreatIntelDetailModal({
  intel,
  onClose,
  getSeverityColor,
  getTLPColor,
}: {
  intel: ThreatIntelligence;
  onClose: () => void;
  getSeverityColor: (severity: string) => string;
  getTLPColor: (tlp: string) => string;
}) {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "概览", icon: Info },
    { id: "indicators", label: "IOC指标", icon: Target },
    { id: "analysis", label: "分析报告", icon: Brain },
    { id: "relationships", label: "关联关系", icon: Network },
    { id: "references", label: "参考资料", icon: BookOpen },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        onClick={onClose}
      />

      <div
        className="relative max-w-6xl w-full max-h-[90vh] overflow-hidden rounded-xl"
        style={{
          backgroundColor: TECH_COLORS.ui.background.primary,
          border: `2px solid ${getSeverityColor(intel.severity)}`,
          boxShadow: `0 0 30px ${getSeverityColor(intel.severity)}66`,
        }}
      >
        {/* 头部 */}
        <div
          className="p-6 border-b"
          style={{
            background: `linear-gradient(135deg, ${getSeverityColor(intel.severity)}20, transparent)`,
            borderColor: TECH_COLORS.ui.border.primary,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2
                className="text-2xl font-bold font-mono"
                style={{ color: TECH_COLORS.ui.text.primary }}
              >
                {intel.title}
              </h2>
              <p
                className="text-sm font-mono"
                style={{ color: TECH_COLORS.ui.text.secondary }}
              >
                {intel.description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors hover:bg-red-500/20"
              style={{ color: TECH_COLORS.status.critical }}
            >
              <X className="w-5 h-5" />
            </button>
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
                    ? getSeverityColor(intel.severity)
                    : TECH_COLORS.ui.text.secondary,
                borderColor:
                  activeTab === tab.id
                    ? getSeverityColor(intel.severity)
                    : "transparent",
                backgroundColor:
                  activeTab === tab.id
                    ? `${getSeverityColor(intel.severity)}10`
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
            <ThreatIntelOverviewTab
              intel={intel}
              getSeverityColor={getSeverityColor}
              getTLPColor={getTLPColor}
            />
          )}
          {activeTab === "indicators" && (
            <ThreatIntelIndicatorsTab intel={intel} />
          )}
          {activeTab === "analysis" && <ThreatIntelAnalysisTab intel={intel} />}
          {activeTab === "relationships" && (
            <ThreatIntelRelationshipsTab intel={intel} />
          )}
          {activeTab === "references" && (
            <ThreatIntelReferencesTab intel={intel} />
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 威胁情报概览标签页
 */
function ThreatIntelOverviewTab({
  intel,
  getSeverityColor,
  getTLPColor,
}: {
  intel: ThreatIntelligence;
  getSeverityColor: (severity: string) => string;
  getTLPColor: (tlp: string) => string;
}) {
  return (
    <div className="space-y-6">
      {/* 基本信息 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TechCard variant="cyber" className="p-4">
          <h3
            className="text-lg font-bold font-mono mb-4"
            style={{ color: TECH_COLORS.ui.text.primary }}
          >
            基本信息
          </h3>
          <div className="space-y-3 text-sm font-mono">
            <div className="flex justify-between">
              <span style={{ color: TECH_COLORS.ui.text.muted }}>类型:</span>
              <span style={{ color: TECH_COLORS.ui.text.primary }}>
                {intel.type.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: TECH_COLORS.ui.text.muted }}>严重性:</span>
              <span style={{ color: getSeverityColor(intel.severity) }}>
                {intel.severity.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: TECH_COLORS.ui.text.muted }}>置信度:</span>
              <span style={{ color: TECH_COLORS.ui.text.primary }}>
                {intel.confidence}%
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: TECH_COLORS.ui.text.muted }}>TLP等级:</span>
              <span style={{ color: getTLPColor(intel.tlp) }}>
                TLP:{intel.tlp.toUpperCase()}
              </span>
            </div>
          </div>
        </TechCard>

        <TechCard variant="matrix" className="p-4">
          <h3
            className="text-lg font-bold font-mono mb-4"
            style={{ color: TECH_COLORS.ui.text.primary }}
          >
            情报来源
          </h3>
          <div className="space-y-3 text-sm font-mono">
            <div className="flex justify-between">
              <span style={{ color: TECH_COLORS.ui.text.muted }}>
                来源名称:
              </span>
              <span style={{ color: TECH_COLORS.ui.text.primary }}>
                {intel.source.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: TECH_COLORS.ui.text.muted }}>
                来源类型:
              </span>
              <span style={{ color: TECH_COLORS.ui.text.primary }}>
                {intel.source.type.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: TECH_COLORS.ui.text.muted }}>可靠性:</span>
              <span style={{ color: TECH_COLORS.ui.text.primary }}>
                {intel.source.reliability}%
              </span>
            </div>
          </div>
        </TechCard>
      </div>

      {/* 时间线 */}
      <TechCard variant="plasma" className="p-4">
        <h3
          className="text-lg font-bold font-mono mb-4"
          style={{ color: TECH_COLORS.ui.text.primary }}
        >
          时间线
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm font-mono">
          <div>
            <span style={{ color: TECH_COLORS.ui.text.muted }}>首次发现:</span>
            <div style={{ color: TECH_COLORS.ui.text.primary }}>
              {new Date(intel.timeline.first_seen).toLocaleString("zh-CN")}
            </div>
          </div>
          <div>
            <span style={{ color: TECH_COLORS.ui.text.muted }}>最后发现:</span>
            <div style={{ color: TECH_COLORS.ui.text.primary }}>
              {new Date(intel.timeline.last_seen).toLocaleString("zh-CN")}
            </div>
          </div>
          <div>
            <span style={{ color: TECH_COLORS.ui.text.muted }}>创建时间:</span>
            <div style={{ color: TECH_COLORS.ui.text.primary }}>
              {new Date(intel.timeline.created).toLocaleString("zh-CN")}
            </div>
          </div>
          <div>
            <span style={{ color: TECH_COLORS.ui.text.muted }}>更新时间:</span>
            <div style={{ color: TECH_COLORS.ui.text.primary }}>
              {new Date(intel.timeline.updated).toLocaleString("zh-CN")}
            </div>
          </div>
        </div>
      </TechCard>

      {/* MITRE ATT&CK映射 */}
      <TechCard variant="quantum" className="p-4">
        <h3
          className="text-lg font-bold font-mono mb-4"
          style={{ color: TECH_COLORS.ui.text.primary }}
        >
          MITRE ATT&CK 映射
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4
              className="font-semibold font-mono mb-2"
              style={{ color: TECH_COLORS.ui.text.secondary }}
            >
              战术 (Tactics)
            </h4>
            <div className="flex flex-wrap gap-2">
              {intel.mitre.tactics.map((tactic, index) => (
                <span
                  key={index}
                  className="px-2 py-1 rounded text-xs font-mono"
                  style={{
                    backgroundColor: `${TECH_COLORS.primary.quantum}20`,
                    color: TECH_COLORS.primary.quantum,
                    border: `1px solid ${TECH_COLORS.primary.quantum}`,
                  }}
                >
                  {tactic}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4
              className="font-semibold font-mono mb-2"
              style={{ color: TECH_COLORS.ui.text.secondary }}
            >
              技术 (Techniques)
            </h4>
            <div className="flex flex-wrap gap-2">
              {intel.mitre.techniques.map((technique, index) => (
                <span
                  key={index}
                  className="px-2 py-1 rounded text-xs font-mono"
                  style={{
                    backgroundColor: `${TECH_COLORS.primary.neon}20`,
                    color: TECH_COLORS.primary.neon,
                    border: `1px solid ${TECH_COLORS.primary.neon}`,
                  }}
                >
                  {technique}
                </span>
              ))}
            </div>
          </div>
        </div>
      </TechCard>

      {/* 地理位置 */}
      <TechCard variant="neural" className="p-4">
        <h3
          className="text-lg font-bold font-mono mb-4"
          style={{ color: TECH_COLORS.ui.text.primary }}
        >
          地理位置信息
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4
              className="font-semibold font-mono mb-2"
              style={{ color: TECH_COLORS.ui.text.secondary }}
            >
              国家/地区
            </h4>
            <div className="flex flex-wrap gap-2">
              {intel.geolocation.countries.map((country, index) => (
                <span
                  key={index}
                  className="px-2 py-1 rounded text-xs font-mono"
                  style={{
                    backgroundColor: `${TECH_COLORS.primary.neural}20`,
                    color: TECH_COLORS.primary.neural,
                    border: `1px solid ${TECH_COLORS.primary.neural}`,
                  }}
                >
                  {country}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4
              className="font-semibold font-mono mb-2"
              style={{ color: TECH_COLORS.ui.text.secondary }}
            >
              区域
            </h4>
            <div className="flex flex-wrap gap-2">
              {intel.geolocation.regions.map((region, index) => (
                <span
                  key={index}
                  className="px-2 py-1 rounded text-xs font-mono"
                  style={{
                    backgroundColor: `${TECH_COLORS.primary.plasma}20`,
                    color: TECH_COLORS.primary.plasma,
                    border: `1px solid ${TECH_COLORS.primary.plasma}`,
                  }}
                >
                  {region}
                </span>
              ))}
            </div>
          </div>
        </div>
      </TechCard>

      {/* 标签 */}
      <TechCard variant="cyber" className="p-4">
        <h3
          className="text-lg font-bold font-mono mb-4"
          style={{ color: TECH_COLORS.ui.text.primary }}
        >
          标签
        </h3>
        <div className="flex flex-wrap gap-2">
          {intel.tags.map((tag, index) => (
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
      </TechCard>
    </div>
  );
}

/**
 * IOC指标标签页
 */
function ThreatIntelIndicatorsTab({ intel }: { intel: ThreatIntelligence }) {
  return (
    <div className="space-y-4">
      <h3
        className="text-lg font-bold font-mono"
        style={{ color: TECH_COLORS.ui.text.primary }}
      >
        IOC指标列表
      </h3>

      {intel.indicators.length === 0 ? (
        <div
          className="text-center py-8 text-sm font-mono"
          style={{ color: TECH_COLORS.ui.text.muted }}
        >
          暂无IOC指标数据
        </div>
      ) : (
        <div className="space-y-3">
          {intel.indicators.map((indicator, index) => (
            <TechCard key={index} variant="matrix" className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center"
                    style={{
                      backgroundColor: `${TECH_COLORS.primary.matrix}20`,
                      border: `1px solid ${TECH_COLORS.primary.matrix}`,
                    }}
                  >
                    <Hash
                      className="w-4 h-4"
                      style={{ color: TECH_COLORS.primary.matrix }}
                    />
                  </div>
                  <div>
                    <div
                      className="font-bold font-mono"
                      style={{ color: TECH_COLORS.ui.text.primary }}
                    >
                      {indicator.value}
                    </div>
                    <div
                      className="text-sm font-mono"
                      style={{ color: TECH_COLORS.ui.text.secondary }}
                    >
                      {indicator.context || "无上下文信息"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className="px-2 py-1 rounded text-xs font-mono"
                    style={{
                      backgroundColor: `${TECH_COLORS.primary.neon}20`,
                      color: TECH_COLORS.primary.neon,
                      border: `1px solid ${TECH_COLORS.primary.neon}`,
                    }}
                  >
                    {indicator.type.toUpperCase()}
                  </span>
                  <button
                    className="p-1 rounded transition-colors"
                    style={{ color: TECH_COLORS.ui.text.muted }}
                    title="复制"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </TechCard>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * 分析报告标签页
 */
function ThreatIntelAnalysisTab({ intel }: { intel: ThreatIntelligence }) {
  return (
    <div className="space-y-6">
      {/* 摘要 */}
      <TechCard variant="plasma" className="p-4">
        <h3
          className="text-lg font-bold font-mono mb-4"
          style={{ color: TECH_COLORS.ui.text.primary }}
        >
          分析摘要
        </h3>
        <p
          className="text-sm font-mono leading-relaxed"
          style={{ color: TECH_COLORS.ui.text.secondary }}
        >
          {intel.analysis.summary}
        </p>
      </TechCard>

      {/* 影响评估 */}
      <TechCard variant="quantum" className="p-4">
        <h3
          className="text-lg font-bold font-mono mb-4"
          style={{ color: TECH_COLORS.ui.text.primary }}
        >
          影响评估
        </h3>
        <p
          className="text-sm font-mono leading-relaxed"
          style={{ color: TECH_COLORS.ui.text.secondary }}
        >
          {intel.analysis.impact}
        </p>
      </TechCard>

      {/* 建议措施 */}
      <TechCard variant="neural" className="p-4">
        <h3
          className="text-lg font-bold font-mono mb-4"
          style={{ color: TECH_COLORS.ui.text.primary }}
        >
          建议措施
        </h3>
        <div className="space-y-2">
          {intel.analysis.recommendations.map((recommendation, index) => (
            <div
              key={index}
              className="flex items-start space-x-2 p-2 rounded"
              style={{ backgroundColor: TECH_COLORS.ui.background.panel }}
            >
              <CheckCircle
                className="w-4 h-4 mt-0.5"
                style={{ color: TECH_COLORS.status.online }}
              />
              <span
                className="text-sm font-mono"
                style={{ color: TECH_COLORS.ui.text.secondary }}
              >
                {recommendation}
              </span>
            </div>
          ))}
        </div>
      </TechCard>
    </div>
  );
}

/**
 * 关联关系标签页
 */
function ThreatIntelRelationshipsTab({ intel }: { intel: ThreatIntelligence }) {
  return (
    <div className="space-y-4">
      <h3
        className="text-lg font-bold font-mono"
        style={{ color: TECH_COLORS.ui.text.primary }}
      >
        关联关系
      </h3>

      {intel.relationships.length === 0 ? (
        <div
          className="text-center py-8 text-sm font-mono"
          style={{ color: TECH_COLORS.ui.text.muted }}
        >
          暂无关联关系数据
        </div>
      ) : (
        <div className="space-y-3">
          {intel.relationships.map((relationship, index) => (
            <TechCard key={index} variant="cyber" className="p-4">
              <div className="flex items-center space-x-3">
                <Network
                  className="w-5 h-5"
                  style={{ color: TECH_COLORS.primary.cyber }}
                />
                <div className="flex-1">
                  <div
                    className="font-bold font-mono"
                    style={{ color: TECH_COLORS.ui.text.primary }}
                  >
                    {relationship.type.toUpperCase()}: {relationship.target}
                  </div>
                  <p
                    className="text-sm font-mono"
                    style={{ color: TECH_COLORS.ui.text.secondary }}
                  >
                    {relationship.description}
                  </p>
                </div>
              </div>
            </TechCard>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * 参考资料标签页
 */
function ThreatIntelReferencesTab({ intel }: { intel: ThreatIntelligence }) {
  return (
    <div className="space-y-4">
      <h3
        className="text-lg font-bold font-mono"
        style={{ color: TECH_COLORS.ui.text.primary }}
      >
        参考资料
      </h3>

      {intel.references.length === 0 ? (
        <div
          className="text-center py-8 text-sm font-mono"
          style={{ color: TECH_COLORS.ui.text.muted }}
        >
          暂无参考资料
        </div>
      ) : (
        <div className="space-y-3">
          {intel.references.map((reference, index) => (
            <TechCard key={index} variant="matrix" className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ExternalLink
                    className="w-5 h-5"
                    style={{ color: TECH_COLORS.primary.matrix }}
                  />
                  <div>
                    <a
                      href={reference.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold font-mono hover:underline"
                      style={{ color: TECH_COLORS.ui.text.primary }}
                    >
                      {reference.title}
                    </a>
                    <div
                      className="text-sm font-mono"
                      style={{ color: TECH_COLORS.ui.text.secondary }}
                    >
                      来源: {reference.source}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => window.open(reference.url, "_blank")}
                  className="p-2 rounded transition-colors hover:bg-blue-500/20"
                  style={{ color: TECH_COLORS.primary.matrix }}
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </TechCard>
          ))}
        </div>
      )}
    </div>
  );
}
