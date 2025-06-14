import React, { useState, useEffect, useMemo } from "react";
import {
  Server,
  Monitor,
  Smartphone,
  Router,
  Database,
  Cloud,
  HardDrive,
  Cpu,
  MemoryStick,
  Wifi,
  Network,
  Globe,
  MapPin,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Download,
  Upload,
  RefreshCw,
  Settings,
  Shield,
  Lock,
  Unlock,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Tag,
  Hash,
  FileText,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  Scan,
  Radio,
  Bluetooth,
  Usb,
  Printer,
  Camera,
  Mic,
  Volume2,
  Battery,
  Power,
  Thermometer,
  Gauge,
  Info,
  AlertCircle,
  Star,
  StarOff,
  Bookmark,
  Share,
  Copy,
  ExternalLink,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  X,
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
  PieChart as RechartsPie,
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
 * 资产接口定义
 */
interface Asset {
  id: string;
  name: string;
  type: "server" | "workstation" | "mobile" | "network" | "iot" | "cloud";
  category: "physical" | "virtual" | "cloud" | "hybrid";
  status: "online" | "offline" | "maintenance" | "compromised" | "unknown";
  criticality: "critical" | "high" | "medium" | "low";
  ip_address: string;
  mac_address?: string;
  hostname: string;
  operating_system: {
    name: string;
    version: string;
    patch_level: string;
  };
  hardware: {
    cpu: string;
    memory: string;
    storage: string;
    manufacturer?: string;
    model?: string;
    serial_number?: string;
  };
  network: {
    location: string;
    subnet: string;
    vlan?: string;
    ports: number[];
  };
  security: {
    last_scan: string;
    vulnerabilities: number;
    patches_pending: number;
    antivirus_status: "active" | "inactive" | "outdated" | "unknown";
    encryption_status: boolean;
    compliance_status: "compliant" | "non_compliant" | "unknown";
  };
  metadata: {
    owner: string;
    department: string;
    cost_center?: string;
    purchase_date?: string;
    warranty_expiry?: string;
    last_updated: string;
    discovered: string;
  };
  services: {
    name: string;
    port: number;
    protocol: string;
    version?: string;
    status: "running" | "stopped" | "unknown";
  }[];
  tags: string[];
  custom_fields: Record<string, any>;
  risk_score: number;
  is_managed: boolean;
  is_monitored: boolean;
  is_favorite: boolean;
}

/**
 * 资产发现任务接口
 */
interface DiscoveryTask {
  id: string;
  name: string;
  type:
    | "network_scan"
    | "port_scan"
    | "service_discovery"
    | "vulnerability_scan";
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  target: string;
  schedule: string;
  last_run: string;
  next_run: string;
  discovered_assets: number;
  duration: number;
  config: Record<string, any>;
}

/**
 * 资产管理主页面
 */
export default function AssetManagement() {
  const navigate = useNavigate();

  // 状态管理
  const [assets, setAssets] = useState<Asset[]>([]);
  const [discoveryTasks, setDiscoveryTasks] = useState<DiscoveryTask[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("assets");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "topology">(
    "grid",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCriticality, setFilterCriticality] = useState<string>("all");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isCreatingAsset, setIsCreatingAsset] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<
    "name" | "type" | "risk_score" | "last_updated"
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // 统计数据
  const [stats, setStats] = useState({
    total: 0,
    online: 0,
    offline: 0,
    critical: 0,
    high_risk: 0,
    vulnerabilities: 0,
    unmanaged: 0,
    compliance_issues: 0,
  });

  // 初始化数据
  useEffect(() => {
    const mockAssets: Asset[] = [
      {
        id: "asset-001",
        name: "Web服务器-01",
        type: "server",
        category: "physical",
        status: "online",
        criticality: "critical",
        ip_address: "192.168.1.100",
        mac_address: "00:1B:44:11:3A:B7",
        hostname: "web-server-01.company.local",
        operating_system: {
          name: "Ubuntu Server",
          version: "20.04 LTS",
          patch_level: "2024.01.15",
        },
        hardware: {
          cpu: "Intel Xeon E5-2690 v4",
          memory: "32GB DDR4",
          storage: "1TB SSD RAID1",
          manufacturer: "Dell",
          model: "PowerEdge R640",
          serial_number: "DEL123456789",
        },
        network: {
          location: "数据中心机房A",
          subnet: "192.168.1.0/24",
          vlan: "VLAN-100",
          ports: [80, 443, 22],
        },
        security: {
          last_scan: "2024-01-15T14:30:00Z",
          vulnerabilities: 2,
          patches_pending: 5,
          antivirus_status: "active",
          encryption_status: true,
          compliance_status: "compliant",
        },
        metadata: {
          owner: "IT部门",
          department: "技术部",
          cost_center: "IT-001",
          purchase_date: "2023-06-15",
          warranty_expiry: "2026-06-15",
          last_updated: "2024-01-15T16:00:00Z",
          discovered: "2023-06-16T09:00:00Z",
        },
        services: [
          {
            name: "Apache",
            port: 80,
            protocol: "HTTP",
            version: "2.4.41",
            status: "running",
          },
          {
            name: "Apache",
            port: 443,
            protocol: "HTTPS",
            version: "2.4.41",
            status: "running",
          },
          {
            name: "SSH",
            port: 22,
            protocol: "SSH",
            version: "8.2",
            status: "running",
          },
        ],
        tags: ["production", "web", "critical", "public-facing"],
        custom_fields: {
          backup_status: "active",
          monitoring_enabled: true,
          load_balancer: "nginx-lb-01",
        },
        risk_score: 8.5,
        is_managed: true,
        is_monitored: true,
        is_favorite: true,
      },
      {
        id: "asset-002",
        name: "数据库服务器-主",
        type: "server",
        category: "physical",
        status: "online",
        criticality: "critical",
        ip_address: "192.168.1.101",
        mac_address: "00:1B:44:11:3A:B8",
        hostname: "db-server-primary.company.local",
        operating_system: {
          name: "CentOS",
          version: "8.4",
          patch_level: "2024.01.10",
        },
        hardware: {
          cpu: "Intel Xeon Gold 6248R",
          memory: "128GB DDR4",
          storage: "4TB NVMe RAID10",
          manufacturer: "HP",
          model: "ProLiant DL380 Gen10",
          serial_number: "HP987654321",
        },
        network: {
          location: "数据中心机房A",
          subnet: "192.168.1.0/24",
          vlan: "VLAN-200",
          ports: [3306, 22],
        },
        security: {
          last_scan: "2024-01-15T12:00:00Z",
          vulnerabilities: 0,
          patches_pending: 3,
          antivirus_status: "active",
          encryption_status: true,
          compliance_status: "compliant",
        },
        metadata: {
          owner: "数据库管理员",
          department: "技术部",
          cost_center: "IT-002",
          purchase_date: "2023-08-01",
          warranty_expiry: "2026-08-01",
          last_updated: "2024-01-15T15:30:00Z",
          discovered: "2023-08-02T10:00:00Z",
        },
        services: [
          {
            name: "MySQL",
            port: 3306,
            protocol: "TCP",
            version: "8.0.28",
            status: "running",
          },
          {
            name: "SSH",
            port: 22,
            protocol: "SSH",
            version: "8.0",
            status: "running",
          },
        ],
        tags: ["production", "database", "critical", "encrypted"],
        custom_fields: {
          replication_status: "master",
          backup_frequency: "daily",
          performance_tier: "high",
        },
        risk_score: 7.2,
        is_managed: true,
        is_monitored: true,
        is_favorite: true,
      },
      {
        id: "asset-003",
        name: "员工工作站-财务部",
        type: "workstation",
        category: "physical",
        status: "online",
        criticality: "medium",
        ip_address: "192.168.2.50",
        mac_address: "00:1B:44:11:3A:C1",
        hostname: "finance-ws-01.company.local",
        operating_system: {
          name: "Windows 11 Pro",
          version: "22H2",
          patch_level: "2024.01.12",
        },
        hardware: {
          cpu: "Intel Core i7-12700",
          memory: "16GB DDR4",
          storage: "512GB SSD",
          manufacturer: "Lenovo",
          model: "ThinkCentre M90t",
          serial_number: "LEN456789123",
        },
        network: {
          location: "财务部办公室",
          subnet: "192.168.2.0/24",
          vlan: "VLAN-300",
          ports: [3389],
        },
        security: {
          last_scan: "2024-01-15T10:00:00Z",
          vulnerabilities: 1,
          patches_pending: 8,
          antivirus_status: "active",
          encryption_status: true,
          compliance_status: "compliant",
        },
        metadata: {
          owner: "张三",
          department: "财务部",
          cost_center: "FIN-001",
          purchase_date: "2023-09-15",
          warranty_expiry: "2026-09-15",
          last_updated: "2024-01-15T14:00:00Z",
          discovered: "2023-09-16T08:30:00Z",
        },
        services: [
          { name: "RDP", port: 3389, protocol: "TCP", status: "running" },
        ],
        tags: ["workstation", "finance", "encrypted", "managed"],
        custom_fields: {
          user_assigned: "张三",
          asset_tag: "COMP-FIN-001",
          bitlocker_enabled: true,
        },
        risk_score: 4.1,
        is_managed: true,
        is_monitored: true,
        is_favorite: false,
      },
      {
        id: "asset-004",
        name: "网络交换机-核心",
        type: "network",
        category: "physical",
        status: "online",
        criticality: "high",
        ip_address: "192.168.1.1",
        mac_address: "00:1B:44:11:3A:D1",
        hostname: "core-switch-01.company.local",
        operating_system: {
          name: "Cisco IOS",
          version: "15.2(7)E3",
          patch_level: "2024.01.05",
        },
        hardware: {
          cpu: "ARM Cortex-A9",
          memory: "512MB",
          storage: "2GB Flash",
          manufacturer: "Cisco",
          model: "Catalyst 3850-48P",
          serial_number: "CIS789123456",
        },
        network: {
          location: "网络设备间",
          subnet: "192.168.1.0/24",
          ports: [22, 23, 80, 443],
        },
        security: {
          last_scan: "2024-01-15T08:00:00Z",
          vulnerabilities: 3,
          patches_pending: 2,
          antivirus_status: "unknown",
          encryption_status: true,
          compliance_status: "non_compliant",
        },
        metadata: {
          owner: "网络管理员",
          department: "技术部",
          cost_center: "IT-003",
          purchase_date: "2022-12-01",
          warranty_expiry: "2025-12-01",
          last_updated: "2024-01-15T13:15:00Z",
          discovered: "2022-12-02T11:00:00Z",
        },
        services: [
          { name: "SSH", port: 22, protocol: "SSH", status: "running" },
          { name: "Telnet", port: 23, protocol: "TCP", status: "running" },
          { name: "HTTP", port: 80, protocol: "HTTP", status: "running" },
          { name: "HTTPS", port: 443, protocol: "HTTPS", status: "running" },
        ],
        tags: ["network", "core", "infrastructure", "cisco"],
        custom_fields: {
          port_count: 48,
          poe_enabled: true,
          stack_member: false,
        },
        risk_score: 6.8,
        is_managed: true,
        is_monitored: true,
        is_favorite: false,
      },
      {
        id: "asset-005",
        name: "IoT温度传感器-机房A",
        type: "iot",
        category: "physical",
        status: "online",
        criticality: "low",
        ip_address: "192.168.10.25",
        mac_address: "00:1B:44:11:3A:E1",
        hostname: "temp-sensor-01.iot.local",
        operating_system: {
          name: "Embedded Linux",
          version: "4.19",
          patch_level: "2023.12.01",
        },
        hardware: {
          cpu: "ARM Cortex-M4",
          memory: "256KB",
          storage: "1MB Flash",
          manufacturer: "Sensirion",
          model: "SHT30-DIS",
          serial_number: "SEN123456789",
        },
        network: {
          location: "数据中心机房A",
          subnet: "192.168.10.0/24",
          vlan: "VLAN-IoT",
          ports: [8080],
        },
        security: {
          last_scan: "2024-01-15T06:00:00Z",
          vulnerabilities: 5,
          patches_pending: 0,
          antivirus_status: "unknown",
          encryption_status: false,
          compliance_status: "non_compliant",
        },
        metadata: {
          owner: "设施管理部",
          department: "运维部",
          cost_center: "FAC-001",
          purchase_date: "2023-03-10",
          warranty_expiry: "2025-03-10",
          last_updated: "2024-01-15T11:45:00Z",
          discovered: "2023-03-11T14:20:00Z",
        },
        services: [
          { name: "HTTP API", port: 8080, protocol: "HTTP", status: "running" },
        ],
        tags: ["iot", "sensor", "temperature", "monitoring"],
        custom_fields: {
          sensor_type: "temperature_humidity",
          measurement_range: "-40 to 125°C",
          update_frequency: "30s",
        },
        risk_score: 7.9,
        is_managed: false,
        is_monitored: true,
        is_favorite: false,
      },
    ];

    const mockDiscoveryTasks: DiscoveryTask[] = [
      {
        id: "task-001",
        name: "日常网络扫描",
        type: "network_scan",
        status: "completed",
        target: "192.168.0.0/16",
        schedule: "0 2 * * *",
        last_run: "2024-01-15T02:00:00Z",
        next_run: "2024-01-16T02:00:00Z",
        discovered_assets: 245,
        duration: 1800,
        config: {
          scan_type: "ping_sweep",
          ports: "1-1024",
          timeout: 5,
        },
      },
      {
        id: "task-002",
        name: "服务发现扫描",
        type: "service_discovery",
        status: "running",
        target: "192.168.1.0/24",
        schedule: "0 6 * * 1",
        last_run: "2024-01-15T06:00:00Z",
        next_run: "2024-01-22T06:00:00Z",
        discovered_assets: 52,
        duration: 3600,
        config: {
          service_detection: true,
          version_detection: true,
          os_detection: true,
        },
      },
      {
        id: "task-003",
        name: "漏洞扫描",
        type: "vulnerability_scan",
        status: "pending",
        target: "critical_assets",
        schedule: "0 0 * * 0",
        last_run: "2024-01-07T00:00:00Z",
        next_run: "2024-01-21T00:00:00Z",
        discovered_assets: 15,
        duration: 7200,
        config: {
          scan_intensity: "aggressive",
          vulnerability_db: "latest",
          compliance_checks: true,
        },
      },
    ];

    setAssets(mockAssets);
    setDiscoveryTasks(mockDiscoveryTasks);
    setFilteredAssets(mockAssets);

    // 计算统计数据
    setStats({
      total: mockAssets.length,
      online: mockAssets.filter((a) => a.status === "online").length,
      offline: mockAssets.filter((a) => a.status === "offline").length,
      critical: mockAssets.filter((a) => a.criticality === "critical").length,
      high_risk: mockAssets.filter((a) => a.risk_score >= 7).length,
      vulnerabilities: mockAssets.reduce(
        (sum, a) => sum + a.security.vulnerabilities,
        0,
      ),
      unmanaged: mockAssets.filter((a) => !a.is_managed).length,
      compliance_issues: mockAssets.filter(
        (a) => a.security.compliance_status === "non_compliant",
      ).length,
    });
  }, []);

  // 过滤和搜索
  useEffect(() => {
    let filtered = assets;

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(
        (asset) =>
          asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.ip_address.includes(searchTerm) ||
          asset.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    // 类型过滤
    if (filterType !== "all") {
      filtered = filtered.filter((asset) => asset.type === filterType);
    }

    // 状态过滤
    if (filterStatus !== "all") {
      filtered = filtered.filter((asset) => asset.status === filterStatus);
    }

    // 关键性过滤
    if (filterCriticality !== "all") {
      filtered = filtered.filter(
        (asset) => asset.criticality === filterCriticality,
      );
    }

    // 排序
    filtered.sort((a, b) => {
      let valueA: any, valueB: any;

      switch (sortBy) {
        case "risk_score":
          valueA = a.risk_score;
          valueB = b.risk_score;
          break;
        case "last_updated":
          valueA = new Date(a.metadata.last_updated).getTime();
          valueB = new Date(b.metadata.last_updated).getTime();
          break;
        case "type":
          valueA = a.type;
          valueB = b.type;
          break;
        default:
          valueA = a.name;
          valueB = b.name;
      }

      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortOrder === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      }
    });

    setFilteredAssets(filtered);
  }, [
    assets,
    searchTerm,
    filterType,
    filterStatus,
    filterCriticality,
    sortBy,
    sortOrder,
  ]);

  // 获取资产类型图标
  const getAssetIcon = (type: string, size = "w-6 h-6") => {
    switch (type) {
      case "server":
        return <Server className={size} />;
      case "workstation":
        return <Monitor className={size} />;
      case "mobile":
        return <Smartphone className={size} />;
      case "network":
        return <Router className={size} />;
      case "iot":
        return <Radio className={size} />;
      case "cloud":
        return <Cloud className={size} />;
      default:
        return <HardDrive className={size} />;
    }
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return TECH_COLORS.status.online;
      case "offline":
        return TECH_COLORS.status.offline;
      case "maintenance":
        return TECH_COLORS.status.warning;
      case "compromised":
        return TECH_COLORS.status.critical;
      default:
        return TECH_COLORS.ui.text.muted;
    }
  };

  // 获取关键性颜色
  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case "critical":
        return TECH_COLORS.status.critical;
      case "high":
        return TECH_COLORS.threat.high;
      case "medium":
        return TECH_COLORS.threat.medium;
      case "low":
        return TECH_COLORS.threat.low;
      default:
        return TECH_COLORS.ui.text.muted;
    }
  };

  // 标签页配置
  const tabs = [
    { id: "assets", label: "资产清单", icon: Database, count: stats.total },
    {
      id: "discovery",
      label: "资产发现",
      icon: Scan,
      count: discoveryTasks.length,
    },
    { id: "topology", label: "网络拓扑", icon: Network, count: 0 },
    { id: "analytics", label: "分析报告", icon: BarChart3, count: 0 },
  ];

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
                  background: TECH_COLORS.gradients.matrix,
                  boxShadow: `0 0 20px ${TECH_COLORS.primary.matrix}66`,
                }}
              >
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1
                  className="text-3xl font-bold font-mono"
                  style={{
                    color: TECH_COLORS.ui.text.primary,
                    textShadow: `0 0 10px ${TECH_COLORS.primary.matrix}66`,
                  }}
                >
                  ASSET MANAGEMENT
                </h1>
                <p
                  className="text-sm font-mono"
                  style={{ color: TECH_COLORS.ui.text.secondary }}
                >
                  Network Asset Discovery & Management Platform
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsCreatingAsset(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 font-mono"
              style={{
                backgroundColor: TECH_COLORS.primary.matrix,
                color: "white",
                boxShadow: `0 0 15px ${TECH_COLORS.primary.matrix}66`,
              }}
            >
              <Plus className="w-4 h-4" />
              <span>添加资产</span>
            </button>

            <button
              className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 font-mono"
              style={{
                backgroundColor: TECH_COLORS.ui.background.panel,
                color: TECH_COLORS.ui.text.secondary,
                border: `1px solid ${TECH_COLORS.ui.border.primary}`,
              }}
            >
              <Scan className="w-4 h-4" />
              <span>扫描网络</span>
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
          label="总资产数"
          value={stats.total}
          icon={<Database className="w-4 h-4" />}
        />
        <StatusCard
          status="online"
          label="在线设备"
          value={stats.online}
          icon={<CheckCircle className="w-4 h-4" />}
          trend="stable"
        />
        <StatusCard
          status="offline"
          label="离线设备"
          value={stats.offline}
          icon={<XCircle className="w-4 h-4" />}
        />
        <StatusCard
          status="critical"
          label="关键资产"
          value={stats.critical}
          icon={<AlertTriangle className="w-4 h-4" />}
        />
        <StatusCard
          status="warning"
          label="高风险"
          value={stats.high_risk}
          icon={<Zap className="w-4 h-4" />}
        />
        <StatusCard
          status="critical"
          label="漏洞总数"
          value={stats.vulnerabilities}
          icon={<Shield className="w-4 h-4" />}
          trend="down"
        />
        <StatusCard
          status="warning"
          label="未托管"
          value={stats.unmanaged}
          icon={<AlertCircle className="w-4 h-4" />}
        />
        <StatusCard
          status="critical"
          label="合规问题"
          value={stats.compliance_issues}
          icon={<Lock className="w-4 h-4" />}
        />
      </div>

      {/* 标签页导航 */}
      <TechCard variant="matrix" className="mb-6">
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
                    ? TECH_COLORS.primary.matrix
                    : TECH_COLORS.ui.text.secondary,
                borderColor:
                  activeTab === tab.id
                    ? TECH_COLORS.primary.matrix
                    : "transparent",
                backgroundColor:
                  activeTab === tab.id
                    ? `${TECH_COLORS.primary.matrix}10`
                    : "transparent",
              }}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span
                className="px-2 py-0.5 rounded-full text-xs"
                style={{
                  backgroundColor: `${TECH_COLORS.primary.matrix}20`,
                  color: TECH_COLORS.primary.matrix,
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* 搜索 */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                style={{ color: TECH_COLORS.ui.text.muted }}
              />
              <input
                type="text"
                placeholder="搜索资产..."
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
              <option value="server">服务器</option>
              <option value="workstation">工作站</option>
              <option value="mobile">移动设备</option>
              <option value="network">网络设备</option>
              <option value="iot">IoT设备</option>
              <option value="cloud">云资源</option>
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
              <option value="online">在线</option>
              <option value="offline">离线</option>
              <option value="maintenance">维护中</option>
              <option value="compromised">已入侵</option>
              <option value="unknown">未知</option>
            </select>

            {/* 关键性过滤 */}
            <select
              value={filterCriticality}
              onChange={(e) => setFilterCriticality(e.target.value)}
              className="px-3 py-2 rounded-lg font-mono text-sm"
              style={{
                backgroundColor: TECH_COLORS.ui.background.panel,
                border: `1px solid ${TECH_COLORS.ui.border.primary}`,
                color: TECH_COLORS.ui.text.primary,
              }}
            >
              <option value="all">所有关键性</option>
              <option value="critical">关键</option>
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>

            {/* 排序 */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [by, order] = e.target.value.split("-");
                setSortBy(by as any);
                setSortOrder(order as any);
              }}
              className="px-3 py-2 rounded-lg font-mono text-sm"
              style={{
                backgroundColor: TECH_COLORS.ui.background.panel,
                border: `1px solid ${TECH_COLORS.ui.border.primary}`,
                color: TECH_COLORS.ui.text.primary,
              }}
            >
              <option value="name-asc">名称(A-Z)</option>
              <option value="name-desc">名称(Z-A)</option>
              <option value="type-asc">类型(A-Z)</option>
              <option value="risk_score-desc">风险评分(高-低)</option>
              <option value="last_updated-desc">更新时间(新-旧)</option>
            </select>
          </div>
        </TechCard>
      )}

      {/* 视图模式切换 */}
      {activeTab === "assets" && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <span
              className="text-sm font-mono"
              style={{ color: TECH_COLORS.ui.text.secondary }}
            >
              找到 {filteredAssets.length} 个资产
            </span>
            {selectedAssets.length > 0 && (
              <span
                className="text-sm font-mono"
                style={{ color: TECH_COLORS.primary.matrix }}
              >
                已选择 {selectedAssets.length} 个
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {["grid", "list", "topology"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className="p-2 rounded transition-all duration-300"
                style={{
                  backgroundColor:
                    viewMode === mode
                      ? TECH_COLORS.primary.matrix
                      : TECH_COLORS.ui.background.panel,
                  color:
                    viewMode === mode ? "white" : TECH_COLORS.ui.text.secondary,
                  border: `1px solid ${TECH_COLORS.ui.border.primary}`,
                }}
              >
                {mode === "grid" && <BarChart3 className="w-4 h-4" />}
                {mode === "list" && <FileText className="w-4 h-4" />}
                {mode === "topology" && <Network className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 内容区域 */}
      <div>
        {activeTab === "assets" && (
          <AssetInventoryTab
            assets={filteredAssets}
            viewMode={viewMode}
            selectedAssets={selectedAssets}
            onSelectAsset={(id, selected) => {
              if (selected) {
                setSelectedAssets([...selectedAssets, id]);
              } else {
                setSelectedAssets(selectedAssets.filter((a) => a !== id));
              }
            }}
            onViewDetails={setSelectedAsset}
            getAssetIcon={getAssetIcon}
            getStatusColor={getStatusColor}
            getCriticalityColor={getCriticalityColor}
          />
        )}
        {activeTab === "discovery" && (
          <AssetDiscoveryTab tasks={discoveryTasks} />
        )}
        {activeTab === "topology" && <NetworkTopologyTab />}
        {activeTab === "analytics" && <AssetAnalyticsTab />}
      </div>

      {/* 资产详情模态框 */}
      {selectedAsset && (
        <AssetDetailModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          getAssetIcon={getAssetIcon}
          getStatusColor={getStatusColor}
          getCriticalityColor={getCriticalityColor}
        />
      )}
    </div>
  );
}

/**
 * 资产清单标签页
 */
function AssetInventoryTab({
  assets,
  viewMode,
  selectedAssets,
  onSelectAsset,
  onViewDetails,
  getAssetIcon,
  getStatusColor,
  getCriticalityColor,
}: {
  assets: Asset[];
  viewMode: "grid" | "list" | "topology";
  selectedAssets: string[];
  onSelectAsset: (id: string, selected: boolean) => void;
  onViewDetails: (asset: Asset) => void;
  getAssetIcon: (type: string, size?: string) => React.ReactNode;
  getStatusColor: (status: string) => string;
  getCriticalityColor: (criticality: string) => string;
}) {
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assets.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset}
            isSelected={selectedAssets.includes(asset.id)}
            onSelect={(selected) => onSelectAsset(asset.id, selected)}
            onView={() => onViewDetails(asset)}
            getAssetIcon={getAssetIcon}
            getStatusColor={getStatusColor}
            getCriticalityColor={getCriticalityColor}
          />
        ))}
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-2">
        {assets.map((asset) => (
          <AssetListItem
            key={asset.id}
            asset={asset}
            isSelected={selectedAssets.includes(asset.id)}
            onSelect={(selected) => onSelectAsset(asset.id, selected)}
            onView={() => onViewDetails(asset)}
            getAssetIcon={getAssetIcon}
            getStatusColor={getStatusColor}
            getCriticalityColor={getCriticalityColor}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <Network
        className="w-16 h-16 mx-auto mb-4"
        style={{ color: TECH_COLORS.ui.text.muted }}
      />
      <h3
        className="text-xl font-bold font-mono mb-2"
        style={{ color: TECH_COLORS.ui.text.primary }}
      >
        网络拓扑视图
      </h3>
      <p
        className="text-sm font-mono"
        style={{ color: TECH_COLORS.ui.text.secondary }}
      >
        网络拓扑可视化功能正在开发中...
      </p>
    </div>
  );
}

/**
 * 资产卡片组件
 */
function AssetCard({
  asset,
  isSelected,
  onSelect,
  onView,
  getAssetIcon,
  getStatusColor,
  getCriticalityColor,
}: {
  asset: Asset;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onView: () => void;
  getAssetIcon: (type: string, size?: string) => React.ReactNode;
  getStatusColor: (status: string) => string;
  getCriticalityColor: (criticality: string) => string;
}) {
  const statusColor = getStatusColor(asset.status);
  const criticalityColor = getCriticalityColor(asset.criticality);

  return (
    <TechCard
      variant="matrix"
      className={`p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
        isSelected ? "ring-2" : ""
      }`}
      style={{
        ringColor: TECH_COLORS.primary.matrix,
      }}
      onClick={onView}
    >
      <div className="space-y-4">
        {/* 头部 */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation();
                onSelect(e.target.checked);
              }}
              className="w-4 h-4"
            />
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: `${statusColor}20`,
                border: `2px solid ${statusColor}`,
                color: statusColor,
              }}
            >
              {getAssetIcon(asset.type, "w-5 h-5")}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className="px-2 py-1 rounded-full text-xs font-mono"
              style={{
                backgroundColor: `${criticalityColor}20`,
                color: criticalityColor,
                border: `1px solid ${criticalityColor}`,
              }}
            >
              {asset.criticality.toUpperCase()}
            </span>
            {asset.is_favorite && (
              <Star
                className="w-4 h-4"
                style={{ color: TECH_COLORS.status.warning }}
              />
            )}
          </div>
        </div>

        {/* 基本信息 */}
        <div>
          <h3
            className="text-lg font-bold font-mono mb-1"
            style={{ color: TECH_COLORS.ui.text.primary }}
          >
            {asset.name}
          </h3>
          <p
            className="text-sm font-mono"
            style={{ color: TECH_COLORS.ui.text.secondary }}
          >
            {asset.hostname}
          </p>
          <p
            className="text-sm font-mono"
            style={{ color: TECH_COLORS.ui.text.muted }}
          >
            {asset.ip_address}
          </p>
        </div>

        {/* 状态和指标 */}
        <div className="grid grid-cols-2 gap-4 text-sm font-mono">
          <div>
            <span style={{ color: TECH_COLORS.ui.text.muted }}>状态: </span>
            <span style={{ color: statusColor }}>
              {asset.status.toUpperCase()}
            </span>
          </div>
          <div>
            <span style={{ color: TECH_COLORS.ui.text.muted }}>风险: </span>
            <span style={{ color: TECH_COLORS.ui.text.primary }}>
              {asset.risk_score}/10
            </span>
          </div>
          <div>
            <span style={{ color: TECH_COLORS.ui.text.muted }}>漏洞: </span>
            <span
              style={{
                color:
                  asset.security.vulnerabilities > 0
                    ? TECH_COLORS.status.critical
                    : TECH_COLORS.status.online,
              }}
            >
              {asset.security.vulnerabilities}
            </span>
          </div>
          <div>
            <span style={{ color: TECH_COLORS.ui.text.muted }}>服务: </span>
            <span style={{ color: TECH_COLORS.ui.text.primary }}>
              {asset.services.length}
            </span>
          </div>
        </div>

        {/* 操作系统 */}
        <div className="text-sm font-mono">
          <span style={{ color: TECH_COLORS.ui.text.muted }}>OS: </span>
          <span style={{ color: TECH_COLORS.ui.text.primary }}>
            {asset.operating_system.name} {asset.operating_system.version}
          </span>
        </div>

        {/* 标签 */}
        <div className="flex flex-wrap gap-1">
          {asset.tags.slice(0, 3).map((tag, index) => (
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
          {asset.tags.length > 3 && (
            <span
              className="px-2 py-1 rounded text-xs font-mono"
              style={{ color: TECH_COLORS.ui.text.muted }}
            >
              +{asset.tags.length - 3}
            </span>
          )}
        </div>

        {/* 底部指示器 */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-2">
            {asset.is_managed && (
              <Settings
                className="w-4 h-4"
                style={{ color: TECH_COLORS.status.online }}
                title="已托管"
              />
            )}
            {asset.is_monitored && (
              <Eye
                className="w-4 h-4"
                style={{ color: TECH_COLORS.status.processing }}
                title="监控中"
              />
            )}
            {asset.security.encryption_status && (
              <Lock
                className="w-4 h-4"
                style={{ color: TECH_COLORS.primary.cyber }}
                title="已加密"
              />
            )}
          </div>
          <span
            className="text-xs font-mono"
            style={{ color: TECH_COLORS.ui.text.muted }}
          >
            {new Date(asset.metadata.last_updated).toLocaleDateString("zh-CN")}
          </span>
        </div>
      </div>
    </TechCard>
  );
}

/**
 * 资产列表项组件
 */
function AssetListItem({
  asset,
  isSelected,
  onSelect,
  onView,
  getAssetIcon,
  getStatusColor,
  getCriticalityColor,
}: {
  asset: Asset;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onView: () => void;
  getAssetIcon: (type: string, size?: string) => React.ReactNode;
  getStatusColor: (status: string) => string;
  getCriticalityColor: (criticality: string) => string;
}) {
  const statusColor = getStatusColor(asset.status);
  const criticalityColor = getCriticalityColor(asset.criticality);

  return (
    <TechCard
      variant="matrix"
      className={`p-4 cursor-pointer transition-all duration-300 hover:bg-opacity-70 ${
        isSelected ? "ring-2" : ""
      }`}
      style={{
        ringColor: TECH_COLORS.primary.matrix,
      }}
      onClick={onView}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect(e.target.checked);
            }}
            className="w-4 h-4"
          />

          <div
            className="w-8 h-8 rounded flex items-center justify-center"
            style={{
              backgroundColor: `${statusColor}20`,
              border: `1px solid ${statusColor}`,
              color: statusColor,
            }}
          >
            {getAssetIcon(asset.type, "w-4 h-4")}
          </div>

          <div className="flex-1 grid grid-cols-5 gap-4 text-sm font-mono">
            <div>
              <div
                className="font-bold"
                style={{ color: TECH_COLORS.ui.text.primary }}
              >
                {asset.name}
              </div>
              <div style={{ color: TECH_COLORS.ui.text.muted }}>
                {asset.type.toUpperCase()}
              </div>
            </div>
            <div>
              <div style={{ color: TECH_COLORS.ui.text.primary }}>
                {asset.ip_address}
              </div>
              <div style={{ color: TECH_COLORS.ui.text.muted }}>
                {asset.hostname}
              </div>
            </div>
            <div>
              <span
                className="px-2 py-1 rounded text-xs"
                style={{
                  backgroundColor: `${statusColor}20`,
                  color: statusColor,
                  border: `1px solid ${statusColor}`,
                }}
              >
                {asset.status.toUpperCase()}
              </span>
            </div>
            <div>
              <span
                className="px-2 py-1 rounded text-xs"
                style={{
                  backgroundColor: `${criticalityColor}20`,
                  color: criticalityColor,
                  border: `1px solid ${criticalityColor}`,
                }}
              >
                {asset.criticality.toUpperCase()}
              </span>
            </div>
            <div className="text-right">
              <div style={{ color: TECH_COLORS.ui.text.primary }}>
                风险: {asset.risk_score}/10
              </div>
              <div style={{ color: TECH_COLORS.ui.text.muted }}>
                漏洞: {asset.security.vulnerabilities}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {asset.is_favorite && (
            <Star
              className="w-4 h-4"
              style={{ color: TECH_COLORS.status.warning }}
            />
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              // 更多操作
            }}
            className="p-1 rounded transition-colors"
            style={{ color: TECH_COLORS.ui.text.muted }}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </TechCard>
  );
}

/**
 * 资产发现标签页
 */
function AssetDiscoveryTab({ tasks }: { tasks: DiscoveryTask[] }) {
  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return TECH_COLORS.status.online;
      case "running":
        return TECH_COLORS.status.processing;
      case "pending":
        return TECH_COLORS.status.warning;
      case "failed":
        return TECH_COLORS.status.critical;
      case "cancelled":
        return TECH_COLORS.status.offline;
      default:
        return TECH_COLORS.ui.text.muted;
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TechCard key={task.id} variant="cyber" className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: `${getTaskStatusColor(task.status)}20`,
                  border: `2px solid ${getTaskStatusColor(task.status)}`,
                }}
              >
                <Scan
                  className="w-6 h-6"
                  style={{ color: getTaskStatusColor(task.status) }}
                />
              </div>
              <div>
                <h3
                  className="text-lg font-bold font-mono"
                  style={{ color: TECH_COLORS.ui.text.primary }}
                >
                  {task.name}
                </h3>
                <p
                  className="text-sm font-mono"
                  style={{ color: TECH_COLORS.ui.text.secondary }}
                >
                  {task.type.replace("_", " ").toUpperCase()} • 目标:{" "}
                  {task.target}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div
                  className="text-lg font-bold font-mono"
                  style={{ color: TECH_COLORS.ui.text.primary }}
                >
                  {task.discovered_assets}
                </div>
                <div
                  className="text-xs font-mono"
                  style={{ color: TECH_COLORS.ui.text.muted }}
                >
                  发现资产
                </div>
              </div>
              <div className="text-center">
                <div
                  className="text-sm font-mono"
                  style={{ color: TECH_COLORS.ui.text.primary }}
                >
                  {Math.floor(task.duration / 60)}分钟
                </div>
                <div
                  className="text-xs font-mono"
                  style={{ color: TECH_COLORS.ui.text.muted }}
                >
                  执行时长
                </div>
              </div>
              <div className="text-center">
                <span
                  className="px-3 py-1 rounded-full text-sm font-mono"
                  style={{
                    backgroundColor: `${getTaskStatusColor(task.status)}20`,
                    color: getTaskStatusColor(task.status),
                    border: `1px solid ${getTaskStatusColor(task.status)}`,
                  }}
                >
                  {task.status.toUpperCase()}
                </span>
              </div>
              <div className="text-right text-sm font-mono">
                <div style={{ color: TECH_COLORS.ui.text.secondary }}>
                  下次执行:
                </div>
                <div style={{ color: TECH_COLORS.ui.text.primary }}>
                  {new Date(task.next_run).toLocaleString("zh-CN")}
                </div>
              </div>
            </div>
          </div>
        </TechCard>
      ))}
    </div>
  );
}

/**
 * 网络拓扑标签页
 */
function NetworkTopologyTab() {
  return (
    <div className="text-center py-12">
      <Network
        className="w-24 h-24 mx-auto mb-6"
        style={{ color: TECH_COLORS.ui.text.muted }}
      />
      <h3
        className="text-2xl font-bold font-mono mb-4"
        style={{ color: TECH_COLORS.ui.text.primary }}
      >
        网络拓扑可视化
      </h3>
      <p
        className="text-lg font-mono mb-6"
        style={{ color: TECH_COLORS.ui.text.secondary }}
      >
        交互式网络拓扑图和资产关系视图
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <TechCard variant="cyber" className="p-6 text-center">
          <Globe
            className="w-12 h-12 mx-auto mb-3"
            style={{ color: TECH_COLORS.primary.cyber }}
          />
          <h4
            className="font-bold font-mono mb-2"
            style={{ color: TECH_COLORS.ui.text.primary }}
          >
            网络层视图
          </h4>
          <p
            className="text-sm font-mono"
            style={{ color: TECH_COLORS.ui.text.secondary }}
          >
            按网络段和VLAN组织的设备视图
          </p>
        </TechCard>
        <TechCard variant="matrix" className="p-6 text-center">
          <Router
            className="w-12 h-12 mx-auto mb-3"
            style={{ color: TECH_COLORS.primary.matrix }}
          />
          <h4
            className="font-bold font-mono mb-2"
            style={{ color: TECH_COLORS.ui.text.primary }}
          >
            设备连接图
          </h4>
          <p
            className="text-sm font-mono"
            style={{ color: TECH_COLORS.ui.text.secondary }}
          >
            设备间的物理和逻辑连接关系
          </p>
        </TechCard>
        <TechCard variant="plasma" className="p-6 text-center">
          <Activity
            className="w-12 h-12 mx-auto mb-3"
            style={{ color: TECH_COLORS.primary.plasma }}
          />
          <h4
            className="font-bold font-mono mb-2"
            style={{ color: TECH_COLORS.ui.text.primary }}
          >
            流量分析
          </h4>
          <p
            className="text-sm font-mono"
            style={{ color: TECH_COLORS.ui.text.secondary }}
          >
            实时网络流量和数据流向分析
          </p>
        </TechCard>
      </div>
    </div>
  );
}

/**
 * 资产分析标签页
 */
function AssetAnalyticsTab() {
  return (
    <div className="text-center py-12">
      <BarChart3
        className="w-24 h-24 mx-auto mb-6"
        style={{ color: TECH_COLORS.ui.text.muted }}
      />
      <h3
        className="text-2xl font-bold font-mono mb-4"
        style={{ color: TECH_COLORS.ui.text.primary }}
      >
        资产分析报告
      </h3>
      <p
        className="text-lg font-mono mb-6"
        style={{ color: TECH_COLORS.ui.text.secondary }}
      >
        资产风险评估、趋势分析和合规性报告
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
        <TechCard variant="cyber" className="p-6 text-center">
          <Target
            className="w-10 h-10 mx-auto mb-3"
            style={{ color: TECH_COLORS.primary.cyber }}
          />
          <h4
            className="font-bold font-mono mb-2"
            style={{ color: TECH_COLORS.ui.text.primary }}
          >
            风险评估
          </h4>
        </TechCard>
        <TechCard variant="matrix" className="p-6 text-center">
          <TrendingUp
            className="w-10 h-10 mx-auto mb-3"
            style={{ color: TECH_COLORS.primary.matrix }}
          />
          <h4
            className="font-bold font-mono mb-2"
            style={{ color: TECH_COLORS.ui.text.primary }}
          >
            趋势分析
          </h4>
        </TechCard>
        <TechCard variant="plasma" className="p-6 text-center">
          <Shield
            className="w-10 h-10 mx-auto mb-3"
            style={{ color: TECH_COLORS.primary.plasma }}
          />
          <h4
            className="font-bold font-mono mb-2"
            style={{ color: TECH_COLORS.ui.text.primary }}
          >
            合规性检查
          </h4>
        </TechCard>
        <TechCard variant="quantum" className="p-6 text-center">
          <AlertTriangle
            className="w-10 h-10 mx-auto mb-3"
            style={{ color: TECH_COLORS.primary.quantum }}
          />
          <h4
            className="font-bold font-mono mb-2"
            style={{ color: TECH_COLORS.ui.text.primary }}
          >
            漏洞分析
          </h4>
        </TechCard>
      </div>
    </div>
  );
}

/**
 * 资产详情模态框
 */
function AssetDetailModal({
  asset,
  onClose,
  getAssetIcon,
  getStatusColor,
  getCriticalityColor,
}: {
  asset: Asset;
  onClose: () => void;
  getAssetIcon: (type: string, size?: string) => React.ReactNode;
  getStatusColor: (status: string) => string;
  getCriticalityColor: (criticality: string) => string;
}) {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "概览", icon: Info },
    { id: "hardware", label: "硬件", icon: Cpu },
    { id: "network", label: "网络", icon: Network },
    { id: "security", label: "安全", icon: Shield },
    { id: "services", label: "服务", icon: Activity },
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
          border: `2px solid ${getCriticalityColor(asset.criticality)}`,
          boxShadow: `0 0 30px ${getCriticalityColor(asset.criticality)}66`,
        }}
      >
        {/* 头部 */}
        <div
          className="p-6 border-b"
          style={{
            background: `linear-gradient(135deg, ${getCriticalityColor(asset.criticality)}20, transparent)`,
            borderColor: TECH_COLORS.ui.border.primary,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className="w-16 h-16 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: `${getStatusColor(asset.status)}20`,
                  border: `2px solid ${getStatusColor(asset.status)}`,
                }}
              >
                {getAssetIcon(asset.type, "w-8 h-8")}
              </div>
              <div>
                <h2
                  className="text-2xl font-bold font-mono"
                  style={{ color: TECH_COLORS.ui.text.primary }}
                >
                  {asset.name}
                </h2>
                <p
                  className="text-sm font-mono"
                  style={{ color: TECH_COLORS.ui.text.secondary }}
                >
                  {asset.hostname} • {asset.ip_address}
                </p>
              </div>
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
                    ? getCriticalityColor(asset.criticality)
                    : TECH_COLORS.ui.text.secondary,
                borderColor:
                  activeTab === tab.id
                    ? getCriticalityColor(asset.criticality)
                    : "transparent",
                backgroundColor:
                  activeTab === tab.id
                    ? `${getCriticalityColor(asset.criticality)}10`
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
            <AssetOverviewTab
              asset={asset}
              getStatusColor={getStatusColor}
              getCriticalityColor={getCriticalityColor}
            />
          )}
          {activeTab === "hardware" && <AssetHardwareTab asset={asset} />}
          {activeTab === "network" && <AssetNetworkTab asset={asset} />}
          {activeTab === "security" && <AssetSecurityTab asset={asset} />}
          {activeTab === "services" && <AssetServicesTab asset={asset} />}
        </div>
      </div>
    </div>
  );
}

/**
 * 资产概览标签页
 */
function AssetOverviewTab({
  asset,
  getStatusColor,
  getCriticalityColor,
}: {
  asset: Asset;
  getStatusColor: (status: string) => string;
  getCriticalityColor: (criticality: string) => string;
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
                {asset.type.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: TECH_COLORS.ui.text.muted }}>分类:</span>
              <span style={{ color: TECH_COLORS.ui.text.primary }}>
                {asset.category.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: TECH_COLORS.ui.text.muted }}>状态:</span>
              <span style={{ color: getStatusColor(asset.status) }}>
                {asset.status.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: TECH_COLORS.ui.text.muted }}>关键性:</span>
              <span style={{ color: getCriticalityColor(asset.criticality) }}>
                {asset.criticality.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: TECH_COLORS.ui.text.muted }}>
                风险评分:
              </span>
              <span style={{ color: TECH_COLORS.ui.text.primary }}>
                {asset.risk_score}/10
              </span>
            </div>
          </div>
        </TechCard>

        <TechCard variant="matrix" className="p-4">
          <h3
            className="text-lg font-bold font-mono mb-4"
            style={{ color: TECH_COLORS.ui.text.primary }}
          >
            管理信息
          </h3>
          <div className="space-y-3 text-sm font-mono">
            <div className="flex justify-between">
              <span style={{ color: TECH_COLORS.ui.text.muted }}>负责人:</span>
              <span style={{ color: TECH_COLORS.ui.text.primary }}>
                {asset.metadata.owner}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: TECH_COLORS.ui.text.muted }}>部门:</span>
              <span style={{ color: TECH_COLORS.ui.text.primary }}>
                {asset.metadata.department}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: TECH_COLORS.ui.text.muted }}>
                成本中心:
              </span>
              <span style={{ color: TECH_COLORS.ui.text.primary }}>
                {asset.metadata.cost_center || "未设置"}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: TECH_COLORS.ui.text.muted }}>
                购买日期:
              </span>
              <span style={{ color: TECH_COLORS.ui.text.primary }}>
                {asset.metadata.purchase_date
                  ? new Date(asset.metadata.purchase_date).toLocaleDateString(
                      "zh-CN",
                    )
                  : "未知"}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: TECH_COLORS.ui.text.muted }}>
                保修到期:
              </span>
              <span style={{ color: TECH_COLORS.ui.text.primary }}>
                {asset.metadata.warranty_expiry
                  ? new Date(asset.metadata.warranty_expiry).toLocaleDateString(
                      "zh-CN",
                    )
                  : "未知"}
              </span>
            </div>
          </div>
        </TechCard>
      </div>

      {/* 操作系统信息 */}
      <TechCard variant="plasma" className="p-4">
        <h3
          className="text-lg font-bold font-mono mb-4"
          style={{ color: TECH_COLORS.ui.text.primary }}
        >
          操作系统
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-mono">
          <div>
            <span style={{ color: TECH_COLORS.ui.text.muted }}>系统:</span>
            <div style={{ color: TECH_COLORS.ui.text.primary }}>
              {asset.operating_system.name}
            </div>
          </div>
          <div>
            <span style={{ color: TECH_COLORS.ui.text.muted }}>版本:</span>
            <div style={{ color: TECH_COLORS.ui.text.primary }}>
              {asset.operating_system.version}
            </div>
          </div>
          <div>
            <span style={{ color: TECH_COLORS.ui.text.muted }}>补丁级别:</span>
            <div style={{ color: TECH_COLORS.ui.text.primary }}>
              {asset.operating_system.patch_level}
            </div>
          </div>
        </div>
      </TechCard>

      {/* 标签 */}
      <TechCard variant="quantum" className="p-4">
        <h3
          className="text-lg font-bold font-mono mb-4"
          style={{ color: TECH_COLORS.ui.text.primary }}
        >
          标签
        </h3>
        <div className="flex flex-wrap gap-2">
          {asset.tags.map((tag, index) => (
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
 * 硬件信息标签页
 */
function AssetHardwareTab({ asset }: { asset: Asset }) {
  return (
    <div className="space-y-6">
      <TechCard variant="neural" className="p-4">
        <h3
          className="text-lg font-bold font-mono mb-4"
          style={{ color: TECH_COLORS.ui.text.primary }}
        >
          硬件规格
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-mono">
          <div className="space-y-3">
            <div>
              <span style={{ color: TECH_COLORS.ui.text.muted }}>处理器:</span>
              <div style={{ color: TECH_COLORS.ui.text.primary }}>
                {asset.hardware.cpu}
              </div>
            </div>
            <div>
              <span style={{ color: TECH_COLORS.ui.text.muted }}>内存:</span>
              <div style={{ color: TECH_COLORS.ui.text.primary }}>
                {asset.hardware.memory}
              </div>
            </div>
            <div>
              <span style={{ color: TECH_COLORS.ui.text.muted }}>存储:</span>
              <div style={{ color: TECH_COLORS.ui.text.primary }}>
                {asset.hardware.storage}
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <span style={{ color: TECH_COLORS.ui.text.muted }}>制造商:</span>
              <div style={{ color: TECH_COLORS.ui.text.primary }}>
                {asset.hardware.manufacturer || "未知"}
              </div>
            </div>
            <div>
              <span style={{ color: TECH_COLORS.ui.text.muted }}>型号:</span>
              <div style={{ color: TECH_COLORS.ui.text.primary }}>
                {asset.hardware.model || "未知"}
              </div>
            </div>
            <div>
              <span style={{ color: TECH_COLORS.ui.text.muted }}>序列号:</span>
              <div style={{ color: TECH_COLORS.ui.text.primary }}>
                {asset.hardware.serial_number || "未知"}
              </div>
            </div>
          </div>
        </div>
      </TechCard>
    </div>
  );
}

/**
 * 网络信息标签页
 */
function AssetNetworkTab({ asset }: { asset: Asset }) {
  return (
    <div className="space-y-6">
      <TechCard variant="cyber" className="p-4">
        <h3
          className="text-lg font-bold font-mono mb-4"
          style={{ color: TECH_COLORS.ui.text.primary }}
        >
          网络配置
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-mono">
          <div className="space-y-3">
            <div>
              <span style={{ color: TECH_COLORS.ui.text.muted }}>IP地址:</span>
              <div style={{ color: TECH_COLORS.ui.text.primary }}>
                {asset.ip_address}
              </div>
            </div>
            <div>
              <span style={{ color: TECH_COLORS.ui.text.muted }}>MAC地址:</span>
              <div style={{ color: TECH_COLORS.ui.text.primary }}>
                {asset.mac_address || "未知"}
              </div>
            </div>
            <div>
              <span style={{ color: TECH_COLORS.ui.text.muted }}>主机名:</span>
              <div style={{ color: TECH_COLORS.ui.text.primary }}>
                {asset.hostname}
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <span style={{ color: TECH_COLORS.ui.text.muted }}>子网:</span>
              <div style={{ color: TECH_COLORS.ui.text.primary }}>
                {asset.network.subnet}
              </div>
            </div>
            <div>
              <span style={{ color: TECH_COLORS.ui.text.muted }}>VLAN:</span>
              <div style={{ color: TECH_COLORS.ui.text.primary }}>
                {asset.network.vlan || "未设置"}
              </div>
            </div>
            <div>
              <span style={{ color: TECH_COLORS.ui.text.muted }}>位置:</span>
              <div style={{ color: TECH_COLORS.ui.text.primary }}>
                {asset.network.location}
              </div>
            </div>
          </div>
        </div>
      </TechCard>
    </div>
  );
}

/**
 * 安全信息标签页
 */
function AssetSecurityTab({ asset }: { asset: Asset }) {
  const getComplianceColor = (status: string) => {
    switch (status) {
      case "compliant":
        return TECH_COLORS.status.online;
      case "non_compliant":
        return TECH_COLORS.status.critical;
      default:
        return TECH_COLORS.ui.text.muted;
    }
  };

  const getAntivirusColor = (status: string) => {
    switch (status) {
      case "active":
        return TECH_COLORS.status.online;
      case "inactive":
        return TECH_COLORS.status.critical;
      case "outdated":
        return TECH_COLORS.status.warning;
      default:
        return TECH_COLORS.ui.text.muted;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TechCard variant="plasma" className="p-4">
          <h3
            className="text-lg font-bold font-mono mb-4"
            style={{ color: TECH_COLORS.ui.text.primary }}
          >
            安全状态
          </h3>
          <div className="space-y-3 text-sm font-mono">
            <div className="flex justify-between">
              <span style={{ color: TECH_COLORS.ui.text.muted }}>
                漏洞数量:
              </span>
              <span
                style={{
                  color:
                    asset.security.vulnerabilities > 0
                      ? TECH_COLORS.status.critical
                      : TECH_COLORS.status.online,
                }}
              >
                {asset.security.vulnerabilities}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: TECH_COLORS.ui.text.muted }}>待补丁:</span>
              <span
                style={{
                  color:
                    asset.security.patches_pending > 0
                      ? TECH_COLORS.status.warning
                      : TECH_COLORS.status.online,
                }}
              >
                {asset.security.patches_pending}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: TECH_COLORS.ui.text.muted }}>防病毒:</span>
              <span
                style={{
                  color: getAntivirusColor(asset.security.antivirus_status),
                }}
              >
                {asset.security.antivirus_status.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: TECH_COLORS.ui.text.muted }}>
                加密状态:
              </span>
              <span
                style={{
                  color: asset.security.encryption_status
                    ? TECH_COLORS.status.online
                    : TECH_COLORS.status.critical,
                }}
              >
                {asset.security.encryption_status ? "已加密" : "未加密"}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: TECH_COLORS.ui.text.muted }}>
                合规状态:
              </span>
              <span
                style={{
                  color: getComplianceColor(asset.security.compliance_status),
                }}
              >
                {asset.security.compliance_status === "compliant"
                  ? "合规"
                  : asset.security.compliance_status === "non_compliant"
                    ? "不合规"
                    : "未知"}
              </span>
            </div>
          </div>
        </TechCard>

        <TechCard variant="quantum" className="p-4">
          <h3
            className="text-lg font-bold font-mono mb-4"
            style={{ color: TECH_COLORS.ui.text.primary }}
          >
            扫描信息
          </h3>
          <div className="space-y-3 text-sm font-mono">
            <div>
              <span style={{ color: TECH_COLORS.ui.text.muted }}>
                最后扫描:
              </span>
              <div style={{ color: TECH_COLORS.ui.text.primary }}>
                {new Date(asset.security.last_scan).toLocaleString("zh-CN")}
              </div>
            </div>
          </div>
        </TechCard>
      </div>
    </div>
  );
}

/**
 * 服务信息标签页
 */
function AssetServicesTab({ asset }: { asset: Asset }) {
  const getServiceStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return TECH_COLORS.status.online;
      case "stopped":
        return TECH_COLORS.status.critical;
      default:
        return TECH_COLORS.ui.text.muted;
    }
  };

  return (
    <div className="space-y-4">
      <h3
        className="text-lg font-bold font-mono"
        style={{ color: TECH_COLORS.ui.text.primary }}
      >
        运行服务
      </h3>

      {asset.services.length === 0 ? (
        <div
          className="text-center py-8 text-sm font-mono"
          style={{ color: TECH_COLORS.ui.text.muted }}
        >
          暂无服务信息
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {asset.services.map((service, index) => (
            <TechCard key={index} variant="neural" className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div
                    className="font-bold font-mono"
                    style={{ color: TECH_COLORS.ui.text.primary }}
                  >
                    {service.name}
                  </div>
                  <div
                    className="text-sm font-mono"
                    style={{ color: TECH_COLORS.ui.text.secondary }}
                  >
                    {service.protocol}:{service.port}
                    {service.version && ` • v${service.version}`}
                  </div>
                </div>
                <span
                  className="px-2 py-1 rounded text-xs font-mono"
                  style={{
                    backgroundColor: `${getServiceStatusColor(service.status)}20`,
                    color: getServiceStatusColor(service.status),
                    border: `1px solid ${getServiceStatusColor(service.status)}`,
                  }}
                >
                  {service.status.toUpperCase()}
                </span>
              </div>
            </TechCard>
          ))}
        </div>
      )}
    </div>
  );
}
