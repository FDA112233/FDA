import React, { useState, useEffect } from "react";
import {
  Server,
  Monitor,
  Smartphone,
  Globe,
  Shield,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Activity,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Wifi,
  HardDrive,
  Cpu,
} from "lucide-react";
import {
  BusinessCard,
  StatusCard,
  InfoCard,
  DataTableCard,
} from "@/components/ui/BusinessCard";
import { BUSINESS_COLORS } from "@/lib/businessColors";

interface Asset {
  id: string;
  name: string;
  type: "server" | "workstation" | "mobile" | "network" | "iot" | "cloud";
  ip: string;
  os: string;
  location: string;
  owner: string;
  status: "online" | "offline" | "maintenance" | "error";
  lastSeen: string;
  riskScore: number;
  compliance: boolean;
  vulnerabilities: number;
  ports: number[];
  services: string[];
}

export default function AssetManagement() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // 模拟资产数据
  useEffect(() => {
    const mockAssets: Asset[] = [
      {
        id: "asset-001",
        name: "Web服务器-01",
        type: "server",
        ip: "192.168.1.100",
        os: "Ubuntu 20.04 LTS",
        location: "数据中心A",
        owner: "运维团队",
        status: "online",
        lastSeen: "2024-01-15T14:30:00Z",
        riskScore: 25,
        compliance: true,
        vulnerabilities: 2,
        ports: [22, 80, 443],
        services: ["SSH", "Apache", "MySQL"],
      },
      {
        id: "asset-002",
        name: "CEO工作站",
        type: "workstation",
        ip: "192.168.1.205",
        os: "Windows 11 Pro",
        location: "总裁办公室",
        owner: "张总",
        status: "online",
        lastSeen: "2024-01-15T14:25:00Z",
        riskScore: 45,
        compliance: true,
        vulnerabilities: 0,
        ports: [3389],
        services: ["RDP", "Antivirus"],
      },
      {
        id: "asset-003",
        name: "数据库服务器",
        type: "server",
        ip: "192.168.1.150",
        os: "CentOS 8",
        location: "数据中心A",
        owner: "数据库团队",
        status: "maintenance",
        lastSeen: "2024-01-15T10:00:00Z",
        riskScore: 15,
        compliance: true,
        vulnerabilities: 1,
        ports: [22, 3306, 5432],
        services: ["SSH", "MySQL", "PostgreSQL"],
      },
      {
        id: "asset-004",
        name: "IoT温度传感器",
        type: "iot",
        ip: "192.168.2.50",
        os: "嵌入式Linux",
        location: "机房A",
        owner: "设施管理",
        status: "error",
        lastSeen: "2024-01-14T18:20:00Z",
        riskScore: 85,
        compliance: false,
        vulnerabilities: 5,
        ports: [80, 443],
        services: ["HTTP", "SNMP"],
      },
      {
        id: "asset-005",
        name: "移动设备-iPhone",
        type: "mobile",
        ip: "192.168.1.220",
        os: "iOS 17.2",
        location: "移动办公",
        owner: "李经理",
        status: "online",
        lastSeen: "2024-01-15T14:20:00Z",
        riskScore: 30,
        compliance: true,
        vulnerabilities: 0,
        ports: [],
        services: ["MDM", "VPN"],
      },
    ];
    setAssets(mockAssets);
  }, []);

  // 过滤资产
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.ip.includes(searchTerm) ||
      asset.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || asset.type === filterType;
    const matchesStatus =
      filterStatus === "all" || asset.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // 获取资产类型图标
  const getAssetTypeIcon = (type: string) => {
    switch (type) {
      case "server":
        return Server;
      case "workstation":
        return Monitor;
      case "mobile":
        return Smartphone;
      case "network":
        return Wifi;
      case "iot":
        return Activity;
      case "cloud":
        return Globe;
      default:
        return Server;
    }
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return BUSINESS_COLORS.status.success;
      case "offline":
        return BUSINESS_COLORS.neutral.silver;
      case "maintenance":
        return BUSINESS_COLORS.status.warning;
      case "error":
        return BUSINESS_COLORS.status.error;
      default:
        return BUSINESS_COLORS.neutral.silver;
    }
  };

  // 获取风险等级颜色
  const getRiskColor = (score: number) => {
    if (score >= 70) return BUSINESS_COLORS.threat.critical;
    if (score >= 50) return BUSINESS_COLORS.threat.high;
    if (score >= 30) return BUSINESS_COLORS.threat.medium;
    return BUSINESS_COLORS.status.success;
  };

  // 统计数据
  const assetStats = {
    total: assets.length,
    online: assets.filter((a) => a.status === "online").length,
    servers: assets.filter((a) => a.type === "server").length,
    highRisk: assets.filter((a) => a.riskScore >= 70).length,
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
              <Server
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
                资产管理
              </h1>
              <p style={{ color: BUSINESS_COLORS.neutral.silver }}>
                网络资产发现、管理和安全评估
              </p>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center space-x-3">
            <button
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200"
              style={{
                backgroundColor: BUSINESS_COLORS.ui.background.panel,
                color: BUSINESS_COLORS.ui.text.secondary,
                border: `1px solid ${BUSINESS_COLORS.ui.border.primary}`,
              }}
            >
              <Activity className="w-4 h-4" />
              <span className="text-sm">发现扫描</span>
            </button>

            <button
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200"
              style={{
                backgroundColor: BUSINESS_COLORS.primary.blue,
                color: `rgb(var(--brand-lightest))`,
                textShadow: `0 0 8px rgba(var(--brand-lightest), 0.5)`,
                boxShadow: BUSINESS_COLORS.shadows.md,
              }}
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">添加资产</span>
            </button>
          </div>
        </div>
      </div>

      {/* 统计指标 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatusCard
          title="总资产数"
          value={assetStats.total}
          icon={<Server className="w-5 h-5" />}
          status="info"
        />

        <StatusCard
          title="在线设备"
          value={assetStats.online}
          icon={<CheckCircle className="w-5 h-5" />}
          status="success"
          trend={{ value: 5, label: "较昨日", isPositive: true }}
        />

        <StatusCard
          title="服务器数量"
          value={assetStats.servers}
          icon={<HardDrive className="w-5 h-5" />}
          status="info"
        />

        <StatusCard
          title="高风险资产"
          value={assetStats.highRisk}
          icon={<AlertTriangle className="w-5 h-5" />}
          status="error"
        />
      </div>

      {/* 资产类型分布 */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        {[
          { type: "server", label: "服务器", icon: Server },
          { type: "workstation", label: "工作站", icon: Monitor },
          { type: "mobile", label: "移动设备", icon: Smartphone },
          { type: "network", label: "网络设备", icon: Wifi },
          { type: "iot", label: "IoT设备", icon: Activity },
          { type: "cloud", label: "云资源", icon: Globe },
        ].map((category) => {
          const Icon = category.icon;
          const count = assets.filter((a) => a.type === category.type).length;

          return (
            <BusinessCard
              key={category.type}
              hoverable
              onClick={() => setFilterType(category.type)}
              className="cursor-pointer text-center"
            >
              <div className="flex flex-col items-center space-y-2">
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
                    {count} 个
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
                placeholder="搜索资产名称、IP或负责人..."
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
                <option value="server">服务器</option>
                <option value="workstation">工作站</option>
                <option value="mobile">移动设备</option>
                <option value="network">网络设备</option>
                <option value="iot">IoT设备</option>
                <option value="cloud">云资源</option>
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
                <option value="online">在线</option>
                <option value="offline">离线</option>
                <option value="maintenance">维护中</option>
                <option value="error">错误</option>
              </select>
            </div>
          </div>
        </div>
      </BusinessCard>

      {/* 资产列表 */}
      <DataTableCard
        title="网络资产清单"
        description={`共 ${filteredAssets.length} 个资产`}
        data={filteredAssets}
        columns={[
          {
            key: "type",
            label: "类型",
            render: (value) => {
              const Icon = getAssetTypeIcon(value);
              return (
                <div className="flex items-center space-x-2">
                  <Icon
                    className="w-4 h-4"
                    style={{ color: BUSINESS_COLORS.primary.blue }}
                  />
                  <span className="font-medium text-sm capitalize">
                    {value === "server"
                      ? "服务器"
                      : value === "workstation"
                        ? "工作站"
                        : value === "mobile"
                          ? "移动设备"
                          : value === "network"
                            ? "网络设备"
                            : value === "iot"
                              ? "IoT设备"
                              : "云资源"}
                  </span>
                </div>
              );
            },
          },
          {
            key: "name",
            label: "资产名称",
            render: (value, row) => (
              <div>
                <p className="font-medium text-sm">{value}</p>
                <p
                  className="text-xs mt-1"
                  style={{ color: BUSINESS_COLORS.ui.text.muted }}
                >
                  {row.ip} • {row.os}
                </p>
              </div>
            ),
          },
          {
            key: "status",
            label: "状态",
            render: (value) => (
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getStatusColor(value) }}
                />
                <span className="font-medium text-sm">
                  {value === "online"
                    ? "在线"
                    : value === "offline"
                      ? "离线"
                      : value === "maintenance"
                        ? "维护中"
                        : "错误"}
                </span>
              </div>
            ),
          },
          {
            key: "location",
            label: "位置",
            render: (value, row) => (
              <div>
                <p className="text-sm">{value}</p>
                <p
                  className="text-xs mt-1"
                  style={{ color: BUSINESS_COLORS.ui.text.muted }}
                >
                  负责人: {row.owner}
                </p>
              </div>
            ),
          },
          {
            key: "riskScore",
            label: "风险评分",
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
                      backgroundColor: getRiskColor(value),
                    }}
                  />
                </div>
                <span
                  className="text-sm font-medium"
                  style={{ color: getRiskColor(value) }}
                >
                  {value}
                </span>
              </div>
            ),
          },
          {
            key: "vulnerabilities",
            label: "漏洞数",
            render: (value) => (
              <span
                className="px-2 py-1 rounded text-xs font-medium"
                style={{
                  backgroundColor:
                    value > 0
                      ? `${BUSINESS_COLORS.status.warning}20`
                      : `${BUSINESS_COLORS.status.success}20`,
                  color:
                    value > 0
                      ? BUSINESS_COLORS.status.warning
                      : BUSINESS_COLORS.status.success,
                }}
              >
                {value} 个
              </span>
            ),
          },
          {
            key: "compliance",
            label: "合规性",
            render: (value) =>
              value ? (
                <CheckCircle
                  className="w-5 h-5"
                  style={{ color: BUSINESS_COLORS.status.success }}
                />
              ) : (
                <XCircle
                  className="w-5 h-5"
                  style={{ color: BUSINESS_COLORS.status.error }}
                />
              ),
          },
          {
            key: "actions",
            label: "操作",
            render: () => (
              <div className="flex items-center space-x-2">
                <button
                  className="p-1 rounded transition-colors"
                  style={{ color: BUSINESS_COLORS.ui.text.muted }}
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  className="p-1 rounded transition-colors"
                  style={{ color: BUSINESS_COLORS.ui.text.muted }}
                >
                  <Edit className="w-4 h-4" />
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
