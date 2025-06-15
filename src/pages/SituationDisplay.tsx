import React, { useState, useRef, Suspense, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
  ArrowLeft,
  Layers,
  ChevronLeft,
  ChevronRight,
  X,
  Settings,
  Maximize2,
  Minimize2,
  Monitor,
  Cpu,
  Activity,
  Brain,
  Zap,
  Grid3X3,
  Eye,
  EyeOff,
  Shield,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Wifi,
  Server,
  Globe,
  Lock,
  Unlock,
  Pause,
  Play,
  RefreshCw,
  Download,
  Share2,
  MapPin,
  Database,
  Cloud,
  HardDrive,
  Router,
  Smartphone,
  Laptop,
  MousePointer2,
  Target,
  Filter,
  Search,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  BusinessSecurityModel,
  BusinessShield,
  BusinessNetworkTopology,
} from "@/components/3d/BusinessSecurityModel";
import {
  BusinessCard,
  StatusCard,
  InfoCard,
  DataTableCard,
} from "@/components/ui/BusinessCard";
import { BUSINESS_COLORS } from "@/lib/businessColors";

type ViewMode = "3d" | "2d" | "split" | "fullscreen";
type ModelType = "security" | "network" | "shield" | "topology" | "global";
type AlertLevel = "low" | "medium" | "high" | "critical";

interface ControlPanelState {
  isVisible: boolean;
  activeTab: string;
  isPinned: boolean;
}

interface Scene3DSettings {
  autoRotate: boolean;
  showGrid: boolean;
  showLabels: boolean;
  animationSpeed: number;
  viewAngle: number;
  modelType: ModelType;
  showTraffic: boolean;
  threatSimulation: boolean;
  showConnections: boolean;
  particleEffects: boolean;
  cameraPosition: [number, number, number];
  lightIntensity: number;
}

interface RealTimeData {
  threatLevel: AlertLevel;
  activeThreats: number;
  blockedAttacks: number;
  systemHealth: number;
  networkLoad: number;
  connectedDevices: number;
  dataTransfer: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  bandwidth: number;
  uptime: string;
  lastUpdate: Date;
}

interface ThreatData {
  id: string;
  type: string;
  severity: AlertLevel;
  source: string;
  target: string;
  timestamp: Date;
  description: string;
  status: "active" | "blocked" | "investigating";
}

interface NetworkNode {
  id: string;
  name: string;
  type: "server" | "firewall" | "router" | "endpoint" | "cloud" | "database";
  status: "online" | "offline" | "warning" | "error";
  position: [number, number, number];
  load: number;
  connections: string[];
  lastSeen: Date;
}

export default function SituationDisplay() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // 视图状态管理
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // 控制面板状态
  const [controlPanel, setControlPanel] = useState<ControlPanelState>({
    isVisible: false,
    activeTab: "system",
    isPinned: false,
  });

  // 过滤和搜索
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);

  // 3D场景设置
  const [scene3DSettings, setScene3DSettings] = useState<Scene3DSettings>({
    autoRotate: true,
    showGrid: true,
    showLabels: true,
    animationSpeed: 1.0,
    viewAngle: 60,
    modelType: "security",
    showTraffic: true,
    threatSimulation: false,
    showConnections: true,
    particleEffects: true,
    cameraPosition: [8, 6, 8],
    lightIntensity: 0.8,
  });

  // 模拟实时数据
  const [realTimeData, setRealTimeData] = useState<RealTimeData>({
    threatLevel: "medium",
    activeThreats: 23,
    blockedAttacks: 1247,
    systemHealth: 98,
    networkLoad: 45,
    connectedDevices: 342,
    dataTransfer: 2.4,
    cpuUsage: 35,
    memoryUsage: 68,
    diskUsage: 42,
    bandwidth: 85.6,
    uptime: "15天 8小时",
    lastUpdate: new Date(),
  });

  // 威胁数据
  const [threatData, setThreatData] = useState<ThreatData[]>([
    {
      id: "T001",
      type: "DDoS攻击",
      severity: "high",
      source: "203.0.113.45",
      target: "Web服务器群组",
      timestamp: new Date(Date.now() - 300000),
      description: "检测到大量异常流量涌入Web服务器",
      status: "blocked",
    },
    {
      id: "T002",
      type: "恶意软件",
      severity: "critical",
      source: "内部网络",
      target: "工作站-A204",
      timestamp: new Date(Date.now() - 120000),
      description: "发现可疑的木马程序活动",
      status: "investigating",
    },
    {
      id: "T003",
      type: "暴力破解",
      severity: "medium",
      source: "198.51.100.67",
      target: "SSH服务",
      timestamp: new Date(Date.now() - 600000),
      description: "多次登录失败尝试",
      status: "blocked",
    },
  ]);

  // 网络节点数据
  const [networkNodes, setNetworkNodes] = useState<NetworkNode[]>([
    {
      id: "core-01",
      name: "核心交换机",
      type: "router",
      status: "online",
      position: [0, 0, 0],
      load: 45,
      connections: ["fw-01", "srv-01", "srv-02"],
      lastSeen: new Date(),
    },
    {
      id: "fw-01",
      name: "主防火墙",
      type: "firewall",
      status: "online",
      position: [0, 2, 3],
      load: 32,
      connections: ["core-01", "ep-01", "ep-02"],
      lastSeen: new Date(),
    },
    {
      id: "srv-01",
      name: "Web服务器集群",
      type: "server",
      status: "warning",
      position: [2, 1, 2],
      load: 78,
      connections: ["core-01", "db-01"],
      lastSeen: new Date(),
    },
    {
      id: "srv-02",
      name: "应用服务器",
      type: "server",
      status: "online",
      position: [-2, 1, 2],
      load: 56,
      connections: ["core-01", "db-01"],
      lastSeen: new Date(),
    },
    {
      id: "db-01",
      name: "数据库集群",
      type: "database",
      status: "online",
      position: [0, -1, -2],
      load: 23,
      connections: ["srv-01", "srv-02"],
      lastSeen: new Date(),
    },
    {
      id: "ep-01",
      name: "终端设备群A",
      type: "endpoint",
      status: "online",
      position: [3, 0.5, 0],
      load: 15,
      connections: ["fw-01"],
      lastSeen: new Date(),
    },
    {
      id: "ep-02",
      name: "终端设备群B",
      type: "endpoint",
      status: "online",
      position: [-3, 0.5, 0],
      load: 18,
      connections: ["fw-01"],
      lastSeen: new Date(),
    },
  ]);

  // 数据历史记录
  const [dataHistory, setDataHistory] = useState({
    threats: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: Math.floor(Math.random() * 50) + 10,
    })),
    bandwidth: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      usage: Math.floor(Math.random() * 100) + 20,
    })),
    attacks: Array.from({ length: 7 }, (_, i) => ({
      day: i,
      blocked: Math.floor(Math.random() * 200) + 100,
      detected: Math.floor(Math.random() * 300) + 150,
    })),
  });

  // 初始化和定时更新
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updateTime = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const updateData = setInterval(() => {
      if (!isPaused) {
        setRealTimeData((prev) => ({
          ...prev,
          activeThreats: Math.max(
            0,
            prev.activeThreats + Math.floor(Math.random() * 6) - 3,
          ),
          blockedAttacks: prev.blockedAttacks + Math.floor(Math.random() * 5),
          networkLoad: Math.max(
            0,
            Math.min(
              100,
              prev.networkLoad + Math.floor(Math.random() * 20) - 10,
            ),
          ),
          systemHealth: Math.max(
            90,
            Math.min(
              100,
              prev.systemHealth + Math.floor(Math.random() * 4) - 2,
            ),
          ),
          dataTransfer: +(Math.random() * 10).toFixed(1),
          cpuUsage: Math.max(
            0,
            Math.min(100, prev.cpuUsage + Math.floor(Math.random() * 20) - 10),
          ),
          memoryUsage: Math.max(
            0,
            Math.min(
              100,
              prev.memoryUsage + Math.floor(Math.random() * 10) - 5,
            ),
          ),
          bandwidth: +(Math.random() * 200).toFixed(1),
          lastUpdate: new Date(),
        }));
      }
    }, 3000);

    return () => {
      clearInterval(updateTime);
      clearInterval(updateData);
    };
  }, [isPaused]);

  // 功能函数
  const switchViewMode = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleControlPanel = () => {
    setControlPanel((prev) => ({
      ...prev,
      isVisible: !prev.isVisible,
    }));
  };

  const update3DSettings = (newSettings: Partial<Scene3DSettings>) => {
    setScene3DSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  const exportView = () => {
    // 导出当前视图逻辑
    console.log("导出视图");
  };

  const resetCamera = () => {
    update3DSettings({ cameraPosition: [8, 6, 8] });
  };

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodes((prev) =>
      prev.includes(nodeId)
        ? prev.filter((id) => id !== nodeId)
        : [...prev, nodeId],
    );
  };

  const getThreatLevelColor = (level: AlertLevel) => {
    switch (level) {
      case "low":
        return BUSINESS_COLORS.status.success;
      case "medium":
        return BUSINESS_COLORS.status.warning;
      case "high":
        return BUSINESS_COLORS.status.error;
      case "critical":
        return "#dc2626";
      default:
        return BUSINESS_COLORS.neutral.silver;
    }
  };

  const getNodeTypeIcon = (type: string) => {
    switch (type) {
      case "server":
        return <Server className="w-4 h-4" />;
      case "firewall":
        return <Shield className="w-4 h-4" />;
      case "router":
        return <Router className="w-4 h-4" />;
      case "endpoint":
        return <Laptop className="w-4 h-4" />;
      case "database":
        return <Database className="w-4 h-4" />;
      case "cloud":
        return <Cloud className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const filteredThreats = useMemo(() => {
    return threatData.filter(
      (threat) =>
        threat.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        threat.type.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [threatData, searchTerm]);

  const filteredNodes = useMemo(() => {
    return networkNodes.filter(
      (node) => activeFilters.length === 0 || activeFilters.includes(node.type),
    );
  }, [networkNodes, activeFilters]);

  // 如果正在加载，显示加载界面
  if (isLoading) {
    return (
      <div
        className="h-screen w-full flex items-center justify-center"
        style={{ backgroundColor: BUSINESS_COLORS.ui.background.secondary }}
      >
        <div className="text-center">
          <div className="relative">
            <Shield
              className="w-16 h-16 mx-auto mb-4 animate-spin"
              style={{ color: BUSINESS_COLORS.primary.blue }}
            />
            <div
              className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin"
              style={{ borderColor: `${BUSINESS_COLORS.primary.blue}20` }}
            />
          </div>
          <h2
            className="text-xl font-bold mb-2"
            style={{ color: BUSINESS_COLORS.ui.text.primary }}
          >
            初始化3D态势大屏
          </h2>
          <p style={{ color: BUSINESS_COLORS.ui.text.secondary }}>
            正在加载网络安全态势数据...
          </p>
          <div className="mt-4 flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full animate-pulse"
                style={{
                  backgroundColor: BUSINESS_COLORS.primary.blue,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full relative overflow-hidden transition-all duration-300 ${
        isFullscreen ? "h-screen" : "h-screen"
      }`}
      style={{ backgroundColor: BUSINESS_COLORS.ui.background.secondary }}
    >
      {/* 顶部控制栏 */}
      <div
        className="h-16 flex items-center justify-between px-6 border-b backdrop-blur-sm"
        style={{
          backgroundColor: `${BUSINESS_COLORS.ui.background.panel}f0`,
          borderColor: BUSINESS_COLORS.ui.border.primary,
        }}
      >
        {/* 左侧控制 */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 px-3 py-1 rounded-lg transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: BUSINESS_COLORS.ui.background.secondary,
              color: BUSINESS_COLORS.ui.text.secondary,
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">返回</span>
          </button>

          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{
                backgroundColor: BUSINESS_COLORS.primary.blue,
                boxShadow: `0 4px 14px 0 ${BUSINESS_COLORS.primary.blue}40`,
              }}
            >
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1
                className="text-lg font-bold"
                style={{ color: BUSINESS_COLORS.ui.text.primary }}
              >
                网络安全态势大屏
              </h1>
              <div className="flex items-center space-x-2">
                <p
                  className="text-xs"
                  style={{ color: BUSINESS_COLORS.ui.text.muted }}
                >
                  {currentTime.toLocaleString("zh-CN")}
                </p>
                <div className="flex items-center space-x-1">
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: BUSINESS_COLORS.status.success }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: BUSINESS_COLORS.status.success }}
                  >
                    实时更新
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 中间视图切换和控制 */}
        <div className="flex items-center space-x-4">
          {/* 视图模式切换 */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            {[
              { mode: "3d" as ViewMode, label: "3D", icon: Cpu },
              { mode: "2d" as ViewMode, label: "2D", icon: BarChart3 },
              { mode: "split" as ViewMode, label: "分屏", icon: Layers },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = viewMode === item.mode;

              return (
                <button
                  key={item.mode}
                  onClick={() => switchViewMode(item.mode)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ${
                    isActive ? "shadow-sm" : "hover:bg-gray-50"
                  }`}
                  style={{
                    backgroundColor: isActive
                      ? BUSINESS_COLORS.primary.blue
                      : "transparent",
                    color: isActive
                      ? "white"
                      : BUSINESS_COLORS.ui.text.secondary,
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* 快捷控制按钮 */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: isPaused
                  ? BUSINESS_COLORS.status.warning
                  : BUSINESS_COLORS.ui.background.secondary,
                color: isPaused ? "white" : BUSINESS_COLORS.ui.text.secondary,
              }}
              title={isPaused ? "恢复更新" : "暂停更新"}
            >
              {isPaused ? (
                <Play className="w-4 h-4" />
              ) : (
                <Pause className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={() => setAlertsEnabled(!alertsEnabled)}
              className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: alertsEnabled
                  ? BUSINESS_COLORS.ui.background.secondary
                  : BUSINESS_COLORS.status.error,
                color: alertsEnabled
                  ? BUSINESS_COLORS.ui.text.secondary
                  : "white",
              }}
              title={alertsEnabled ? "关闭告警" : "开启告警"}
            >
              {alertsEnabled ? (
                <Bell className="w-4 h-4" />
              ) : (
                <BellOff className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: BUSINESS_COLORS.ui.background.secondary,
                color: BUSINESS_COLORS.ui.text.secondary,
              }}
              title={soundEnabled ? "关闭声音" : "开启声音"}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: BUSINESS_COLORS.ui.background.secondary,
                color: BUSINESS_COLORS.ui.text.secondary,
              }}
              title={isFullscreen ? "退出全屏" : "全屏显示"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* 右侧状态和设置 */}
        <div className="flex items-center space-x-4">
          {/* 系统状态指示器 */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{
                    backgroundColor: getThreatLevelColor(
                      realTimeData.threatLevel,
                    ),
                  }}
                />
                <span
                  className="text-sm font-medium"
                  style={{
                    color: getThreatLevelColor(realTimeData.threatLevel),
                  }}
                >
                  威胁等级: {realTimeData.threatLevel.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span
                  className="text-xs"
                  style={{ color: BUSINESS_COLORS.ui.text.muted }}
                >
                  最后更新: {realTimeData.lastUpdate.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={toggleControlPanel}
            className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: controlPanel.isVisible
                ? BUSINESS_COLORS.primary.blue
                : BUSINESS_COLORS.ui.background.secondary,
              color: controlPanel.isVisible
                ? "white"
                : BUSINESS_COLORS.ui.text.secondary,
            }}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex h-full" style={{ height: "calc(100vh - 4rem)" }}>
        {/* 3D可视化区域 */}
        {(viewMode === "3d" || viewMode === "split") && (
          <div
            className={`transition-all duration-500 ${
              viewMode === "2d"
                ? "w-0"
                : viewMode === "split"
                  ? "w-1/2"
                  : "w-full"
            }`}
            style={{
              display: viewMode === "2d" ? "none" : "block",
            }}
          >
            <div className="h-full relative">
              <Suspense
                fallback={
                  <div
                    className="h-full flex items-center justify-center"
                    style={{
                      backgroundColor: BUSINESS_COLORS.ui.background.tertiary,
                    }}
                  >
                    <div className="text-center">
                      <Shield className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-pulse" />
                      <p style={{ color: BUSINESS_COLORS.ui.text.secondary }}>
                        加载3D安全模型...
                      </p>
                    </div>
                  </div>
                }
              >
                <Canvas
                  ref={canvasRef}
                  camera={{
                    position: scene3DSettings.cameraPosition,
                    fov: scene3DSettings.viewAngle,
                  }}
                  style={{
                    background: `linear-gradient(135deg, ${BUSINESS_COLORS.ui.background.secondary} 0%, ${BUSINESS_COLORS.ui.background.tertiary} 100%)`,
                  }}
                >
                  <OrbitControls
                    enableZoom={true}
                    enablePan={true}
                    enableRotate={true}
                    autoRotate={scene3DSettings.autoRotate && !isPaused}
                    autoRotateSpeed={scene3DSettings.animationSpeed}
                    maxDistance={20}
                    minDistance={2}
                  />

                  {/* 渲染不同类型的3D模型 */}
                  {scene3DSettings.modelType === "security" && (
                    <BusinessSecurityModel />
                  )}
                  {scene3DSettings.modelType === "shield" && <BusinessShield />}
                  {scene3DSettings.modelType === "topology" && (
                    <BusinessNetworkTopology />
                  )}

                  {/* 添加额外的光照效果 */}
                  <ambientLight
                    intensity={scene3DSettings.lightIntensity * 0.4}
                  />
                  <directionalLight
                    position={[10, 10, 5]}
                    intensity={scene3DSettings.lightIntensity}
                    castShadow
                  />
                  <pointLight
                    position={[0, 10, 0]}
                    intensity={scene3DSettings.lightIntensity * 0.6}
                    color={BUSINESS_COLORS.primary.blue}
                  />

                  {/* 显示网格 */}
                  {scene3DSettings.showGrid && (
                    <gridHelper
                      args={[
                        20,
                        20,
                        BUSINESS_COLORS.ui.border.primary,
                        BUSINESS_COLORS.ui.border.secondary,
                      ]}
                    />
                  )}

                  {/* 雾效 */}
                  <fog
                    attach="fog"
                    args={[BUSINESS_COLORS.ui.background.secondary, 10, 50]}
                  />
                </Canvas>
              </Suspense>

              {/* 3D控制覆盖层 */}
              <div className="absolute top-4 left-4 space-y-3">
                <BusinessCard size="sm" variant="glass">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-sm font-medium"
                        style={{ color: BUSINESS_COLORS.ui.text.primary }}
                      >
                        3D场景控制
                      </span>
                      <button
                        onClick={resetCamera}
                        className="p-1 rounded transition-colors"
                        style={{ color: BUSINESS_COLORS.ui.text.muted }}
                        title="重置视角"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className="text-xs"
                          style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                        >
                          自动旋转
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={scene3DSettings.autoRotate}
                            onChange={(e) =>
                              update3DSettings({ autoRotate: e.target.checked })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-8 h-4 bg-gray-200 rounded-full peer transition-colors peer-checked:bg-blue-600">
                            <div className="w-3 h-3 bg-white rounded-full shadow transform transition-transform peer-checked:translate-x-4 translate-x-0.5 mt-0.5" />
                          </div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <span
                          className="text-xs"
                          style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                        >
                          显示网格
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={scene3DSettings.showGrid}
                            onChange={(e) =>
                              update3DSettings({ showGrid: e.target.checked })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-8 h-4 bg-gray-200 rounded-full peer transition-colors peer-checked:bg-blue-600">
                            <div className="w-3 h-3 bg-white rounded-full shadow transform transition-transform peer-checked:translate-x-4 translate-x-0.5 mt-0.5" />
                          </div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <span
                          className="text-xs"
                          style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                        >
                          粒子效果
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={scene3DSettings.particleEffects}
                            onChange={(e) =>
                              update3DSettings({
                                particleEffects: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-8 h-4 bg-gray-200 rounded-full peer transition-colors peer-checked:bg-blue-600">
                            <div className="w-3 h-3 bg-white rounded-full shadow transform transition-transform peer-checked:translate-x-4 translate-x-0.5 mt-0.5" />
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        className="text-xs"
                        style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                      >
                        模型类型
                      </label>
                      <select
                        value={scene3DSettings.modelType}
                        onChange={(e) =>
                          update3DSettings({
                            modelType: e.target.value as ModelType,
                          })
                        }
                        className="w-full text-xs p-1 rounded border"
                        style={{
                          backgroundColor:
                            BUSINESS_COLORS.ui.background.secondary,
                          borderColor: BUSINESS_COLORS.ui.border.primary,
                          color: BUSINESS_COLORS.ui.text.primary,
                        }}
                      >
                        <option value="security">安全态势</option>
                        <option value="topology">网络拓扑</option>
                        <option value="shield">防护盾牌</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label
                        className="text-xs"
                        style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                      >
                        动画速度: {scene3DSettings.animationSpeed.toFixed(1)}x
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="3.0"
                        step="0.1"
                        value={scene3DSettings.animationSpeed}
                        onChange={(e) =>
                          update3DSettings({
                            animationSpeed: parseFloat(e.target.value),
                          })
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </BusinessCard>

                {/* 场景统计 */}
                <BusinessCard size="sm" variant="glass">
                  <div className="space-y-2">
                    <h4
                      className="text-sm font-medium"
                      style={{ color: BUSINESS_COLORS.ui.text.primary }}
                    >
                      场景统计
                    </h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span
                          style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                        >
                          活跃节点
                        </span>
                        <span
                          style={{ color: BUSINESS_COLORS.ui.text.primary }}
                        >
                          {
                            filteredNodes.filter((n) => n.status === "online")
                              .length
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span
                          style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                        >
                          告警节点
                        </span>
                        <span style={{ color: BUSINESS_COLORS.status.warning }}>
                          {
                            filteredNodes.filter((n) => n.status === "warning")
                              .length
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span
                          style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                        >
                          数据流
                        </span>
                        <span
                          style={{ color: BUSINESS_COLORS.ui.text.primary }}
                        >
                          {scene3DSettings.showTraffic ? "显示" : "隐藏"}
                        </span>
                      </div>
                    </div>
                  </div>
                </BusinessCard>
              </div>

              {/* 性能监控 */}
              <div className="absolute top-4 right-4">
                <BusinessCard size="sm" variant="glass">
                  <div className="space-y-2">
                    <h4
                      className="text-sm font-medium"
                      style={{ color: BUSINESS_COLORS.ui.text.primary }}
                    >
                      性能监控
                    </h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span
                          style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                        >
                          FPS
                        </span>
                        <span style={{ color: BUSINESS_COLORS.status.success }}>
                          60
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span
                          style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                        >
                          三角形
                        </span>
                        <span
                          style={{ color: BUSINESS_COLORS.ui.text.primary }}
                        >
                          2.4K
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span
                          style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                        >
                          内存
                        </span>
                        <span
                          style={{ color: BUSINESS_COLORS.ui.text.primary }}
                        >
                          45MB
                        </span>
                      </div>
                    </div>
                  </div>
                </BusinessCard>
              </div>

              {/* 威胁热力图覆盖层 */}
              {realTimeData.threatLevel === "high" ||
              realTimeData.threatLevel === "critical" ? (
                <div className="absolute bottom-4 left-4">
                  <BusinessCard size="sm" variant="error">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 animate-pulse" />
                      <div>
                        <div
                          className="text-sm font-medium"
                          style={{ color: BUSINESS_COLORS.ui.text.primary }}
                        >
                          高危威胁告警
                        </div>
                        <div
                          className="text-xs"
                          style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                        >
                          检测到 {realTimeData.activeThreats} 个活跃威胁
                        </div>
                      </div>
                    </div>
                  </BusinessCard>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* 2D数据面板区域 */}
        {(viewMode === "2d" || viewMode === "split") && (
          <div
            className={`transition-all duration-500 ${
              viewMode === "3d"
                ? "w-0"
                : viewMode === "split"
                  ? "w-1/2"
                  : "w-full"
            } overflow-y-auto`}
            style={{
              display: viewMode === "3d" ? "none" : "block",
              backgroundColor: BUSINESS_COLORS.ui.background.secondary,
            }}
          >
            <div className="p-6 space-y-6">
              {/* 搜索和过滤栏 */}
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索威胁、节点或事件..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border"
                    style={{
                      backgroundColor: BUSINESS_COLORS.ui.background.panel,
                      borderColor: BUSINESS_COLORS.ui.border.primary,
                      color: BUSINESS_COLORS.ui.text.primary,
                    }}
                  />
                </div>
                <button
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors"
                  style={{
                    backgroundColor: BUSINESS_COLORS.ui.background.panel,
                    color: BUSINESS_COLORS.ui.text.secondary,
                  }}
                >
                  <Filter className="w-4 h-4" />
                  <span className="text-sm">过滤</span>
                </button>
                <button
                  onClick={exportView}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors"
                  style={{
                    backgroundColor: BUSINESS_COLORS.primary.blue,
                    color: "white",
                  }}
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">���出</span>
                </button>
              </div>

              {/* 实时指标仪表板 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatusCard
                  title="威胁等级"
                  value={realTimeData.threatLevel.toUpperCase()}
                  icon={<AlertTriangle className="w-5 h-5" />}
                  status={
                    realTimeData.threatLevel === "low"
                      ? "success"
                      : realTimeData.threatLevel === "medium"
                        ? "warning"
                        : "error"
                  }
                />

                <StatusCard
                  title="活跃威胁"
                  value={realTimeData.activeThreats}
                  icon={<Shield className="w-5 h-5" />}
                  status="error"
                  trend={{ value: 12, label: "较1小时前", isPositive: false }}
                />

                <StatusCard
                  title="阻止攻击"
                  value={realTimeData.blockedAttacks.toLocaleString()}
                  icon={<Activity className="w-5 h-5" />}
                  status="success"
                  trend={{ value: 8, label: "较1小时前", isPositive: true }}
                />

                <StatusCard
                  title="系统健康"
                  value={`${realTimeData.systemHealth}%`}
                  icon={<Monitor className="w-5 h-5" />}
                  status="success"
                />

                <StatusCard
                  title="网络负载"
                  value={`${realTimeData.networkLoad}%`}
                  icon={<TrendingUp className="w-5 h-5" />}
                  status={realTimeData.networkLoad > 80 ? "warning" : "info"}
                />

                <StatusCard
                  title="连接设备"
                  value={realTimeData.connectedDevices}
                  icon={<Cpu className="w-5 h-5" />}
                  status="info"
                />

                <StatusCard
                  title="数据传输"
                  value={`${realTimeData.dataTransfer}GB/s`}
                  icon={<Database className="w-5 h-5" />}
                  status="info"
                />

                <StatusCard
                  title="运行时间"
                  value={realTimeData.uptime}
                  icon={<Activity className="w-5 h-5" />}
                  status="success"
                />
              </div>

              {/* 威胁情报实时面板 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 威胁列表 */}
                <InfoCard
                  title="实时威胁监控"
                  description="当前检测到的安全威胁和攻击事件"
                >
                  <div className="space-y-3">
                    {filteredThreats.slice(0, 5).map((threat) => (
                      <div
                        key={threat.id}
                        className="flex items-start space-x-3 p-3 rounded-lg border"
                        style={{
                          backgroundColor:
                            BUSINESS_COLORS.ui.background.tertiary,
                          borderColor: BUSINESS_COLORS.ui.border.secondary,
                        }}
                      >
                        <div
                          className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                          style={{
                            backgroundColor: getThreatLevelColor(
                              threat.severity,
                            ),
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h5
                                className="font-medium text-sm"
                                style={{
                                  color: BUSINESS_COLORS.ui.text.primary,
                                }}
                              >
                                {threat.type}
                              </h5>
                              <p
                                className="text-xs mt-1"
                                style={{
                                  color: BUSINESS_COLORS.ui.text.secondary,
                                }}
                              >
                                {threat.description}
                              </p>
                              <div className="flex items-center space-x-3 mt-2 text-xs">
                                <span
                                  style={{
                                    color: BUSINESS_COLORS.ui.text.muted,
                                  }}
                                >
                                  来源: {threat.source}
                                </span>
                                <span
                                  style={{
                                    color: BUSINESS_COLORS.ui.text.muted,
                                  }}
                                >
                                  目标: {threat.target}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                              <span
                                className="px-2 py-1 rounded text-xs font-medium"
                                style={{
                                  backgroundColor: `${getThreatLevelColor(threat.severity)}20`,
                                  color: getThreatLevelColor(threat.severity),
                                }}
                              >
                                {threat.severity.toUpperCase()}
                              </span>
                              <span
                                className="text-xs"
                                style={{ color: BUSINESS_COLORS.ui.text.muted }}
                              >
                                {threat.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </InfoCard>

                {/* 网络拓扑状态 */}
                <InfoCard
                  title="网络拓扑状态"
                  description="网络设备实时状态和性能监控"
                >
                  <div className="space-y-3">
                    {filteredNodes.map((node) => (
                      <div
                        key={node.id}
                        className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                          selectedNodes.includes(node.id) ? "ring-2" : ""
                        }`}
                        style={{
                          backgroundColor:
                            BUSINESS_COLORS.ui.background.tertiary,
                          borderColor: selectedNodes.includes(node.id)
                            ? BUSINESS_COLORS.primary.blue
                            : BUSINESS_COLORS.ui.border.secondary,
                          ringColor: BUSINESS_COLORS.primary.blue,
                        }}
                        onClick={() => handleNodeSelect(node.id)}
                      >
                        <div className="flex items-center space-x-2">
                          {getNodeTypeIcon(node.type)}
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor:
                                node.status === "online"
                                  ? BUSINESS_COLORS.status.success
                                  : node.status === "warning"
                                    ? BUSINESS_COLORS.status.warning
                                    : node.status === "error"
                                      ? BUSINESS_COLORS.status.error
                                      : BUSINESS_COLORS.neutral.silver,
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h5
                              className="font-medium text-sm"
                              style={{ color: BUSINESS_COLORS.ui.text.primary }}
                            >
                              {node.name}
                            </h5>
                            <span
                              className="text-xs"
                              style={{ color: BUSINESS_COLORS.ui.text.muted }}
                            >
                              负载: {node.load}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span
                              className="text-xs"
                              style={{
                                color: BUSINESS_COLORS.ui.text.secondary,
                              }}
                            >
                              {node.type} · {node.connections.length} 个连接
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-xs`}
                              style={{
                                backgroundColor:
                                  node.status === "online"
                                    ? `${BUSINESS_COLORS.status.success}20`
                                    : node.status === "warning"
                                      ? `${BUSINESS_COLORS.status.warning}20`
                                      : node.status === "error"
                                        ? `${BUSINESS_COLORS.status.error}20`
                                        : `${BUSINESS_COLORS.neutral.silver}20`,
                                color:
                                  node.status === "online"
                                    ? BUSINESS_COLORS.status.success
                                    : node.status === "warning"
                                      ? BUSINESS_COLORS.status.warning
                                      : node.status === "error"
                                        ? BUSINESS_COLORS.status.error
                                        : BUSINESS_COLORS.neutral.silver,
                              }}
                            >
                              {node.status === "online"
                                ? "在线"
                                : node.status === "warning"
                                  ? "告警"
                                  : node.status === "error"
                                    ? "故障"
                                    : "离线"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </InfoCard>
              </div>

              {/* 详细数据表格 */}
              <DataTableCard
                title="系统性能详情"
                description="详细的系统性能指标和历史数据"
                data={[
                  {
                    metric: "CPU使用率",
                    current: `${realTimeData.cpuUsage}%`,
                    average: "32%",
                    peak: "78%",
                    status: realTimeData.cpuUsage > 80 ? "warning" : "normal",
                  },
                  {
                    metric: "内存使用率",
                    current: `${realTimeData.memoryUsage}%`,
                    average: "65%",
                    peak: "89%",
                    status:
                      realTimeData.memoryUsage > 85 ? "warning" : "normal",
                  },
                  {
                    metric: "磁盘使用率",
                    current: `${realTimeData.diskUsage}%`,
                    average: "45%",
                    peak: "67%",
                    status: realTimeData.diskUsage > 90 ? "warning" : "normal",
                  },
                  {
                    metric: "网络带宽",
                    current: `${realTimeData.bandwidth}Mbps`,
                    average: "156Mbps",
                    peak: "298Mbps",
                    status: "normal",
                  },
                ]}
                columns={[
                  { key: "metric", label: "性能指标" },
                  { key: "current", label: "当前值" },
                  { key: "average", label: "平均值" },
                  { key: "peak", label: "峰值" },
                  { key: "status", label: "状态" },
                ]}
              />

              {/* 威胁趋势图表占位符 */}
              <InfoCard
                title="威胁趋势分析"
                description="过去24小时的安全威胁变化趋势和攻击模式分析"
              >
                <div
                  className="h-64 rounded-lg flex items-center justify-center border-2 border-dashed"
                  style={{
                    backgroundColor: BUSINESS_COLORS.ui.background.tertiary,
                    borderColor: BUSINESS_COLORS.ui.border.secondary,
                  }}
                >
                  <div className="text-center">
                    <BarChart3
                      className="w-12 h-12 mx-auto mb-4"
                      style={{ color: BUSINESS_COLORS.ui.text.muted }}
                    />
                    <p style={{ color: BUSINESS_COLORS.ui.text.secondary }}>
                      威胁趋势图表
                    </p>
                    <p
                      className="text-sm mt-2"
                      style={{ color: BUSINESS_COLORS.ui.text.muted }}
                    >
                      实时数据更新中... ({dataHistory.threats.length} 个数据点)
                    </p>
                  </div>
                </div>
              </InfoCard>
            </div>
          </div>
        )}

        {/* 控制面板侧边栏 */}
        {controlPanel.isVisible && (
          <div
            className="w-80 border-l overflow-y-auto backdrop-blur-sm"
            style={{
              backgroundColor: `${BUSINESS_COLORS.ui.background.panel}f8`,
              borderColor: BUSINESS_COLORS.ui.border.primary,
            }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="font-bold"
                  style={{ color: BUSINESS_COLORS.ui.text.primary }}
                >
                  高级控制面板
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setControlPanel((prev) => ({
                        ...prev,
                        isPinned: !prev.isPinned,
                      }))
                    }
                    className="p-1 rounded transition-colors"
                    style={{
                      color: controlPanel.isPinned
                        ? BUSINESS_COLORS.primary.blue
                        : BUSINESS_COLORS.ui.text.muted,
                    }}
                    title={controlPanel.isPinned ? "取消固定" : "固定面板"}
                  >
                    <MapPin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={toggleControlPanel}
                    className="p-1 rounded transition-colors"
                    style={{ color: BUSINESS_COLORS.ui.text.muted }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 标签页导航 */}
              <div className="flex space-x-1 mb-4 p-1 rounded-lg bg-gray-100">
                {[
                  { id: "system", label: "系统", icon: Monitor },
                  { id: "security", label: "安全", icon: Shield },
                  { id: "network", label: "网络", icon: Wifi },
                  { id: "settings", label: "设置", icon: Settings },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = controlPanel.activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() =>
                        setControlPanel((prev) => ({
                          ...prev,
                          activeTab: tab.id,
                        }))
                      }
                      className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 ${
                        isActive ? "shadow-sm" : ""
                      }`}
                      style={{
                        backgroundColor: isActive
                          ? BUSINESS_COLORS.primary.blue
                          : "transparent",
                        color: isActive
                          ? "white"
                          : BUSINESS_COLORS.ui.text.secondary,
                      }}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-4">
                {/* 系统标签页 */}
                {controlPanel.activeTab === "system" && (
                  <>
                    <BusinessCard size="sm">
                      <h4
                        className="font-medium mb-3"
                        style={{ color: BUSINESS_COLORS.ui.text.primary }}
                      >
                        显示设置
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span
                            className="text-sm"
                            style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                          >
                            自动刷新
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={!isPaused}
                              onChange={() => setIsPaused(!isPaused)}
                            />
                            <div className="w-9 h-5 bg-gray-200 rounded-full peer transition-colors peer-checked:bg-blue-600">
                              <div className="w-4 h-4 bg-white rounded-full shadow transform transition-transform peer-checked:translate-x-4 translate-x-0.5 mt-0.5" />
                            </div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <span
                            className="text-sm"
                            style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                          >
                            显示标签
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={scene3DSettings.showLabels}
                              onChange={(e) =>
                                update3DSettings({
                                  showLabels: e.target.checked,
                                })
                              }
                            />
                            <div className="w-9 h-5 bg-gray-200 rounded-full peer transition-colors peer-checked:bg-blue-600">
                              <div className="w-4 h-4 bg-white rounded-full shadow transform transition-transform peer-checked:translate-x-4 translate-x-0.5 mt-0.5" />
                            </div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <span
                            className="text-sm"
                            style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                          >
                            流量显示
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={scene3DSettings.showTraffic}
                              onChange={(e) =>
                                update3DSettings({
                                  showTraffic: e.target.checked,
                                })
                              }
                            />
                            <div className="w-9 h-5 bg-gray-200 rounded-full peer transition-colors peer-checked:bg-blue-600">
                              <div className="w-4 h-4 bg-white rounded-full shadow transform transition-transform peer-checked:translate-x-4 translate-x-0.5 mt-0.5" />
                            </div>
                          </label>
                        </div>
                      </div>
                    </BusinessCard>

                    <BusinessCard size="sm">
                      <h4
                        className="font-medium mb-3"
                        style={{ color: BUSINESS_COLORS.ui.text.primary }}
                      >
                        性能调优
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label
                            className="text-sm block mb-1"
                            style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                          >
                            渲染质量
                          </label>
                          <select
                            className="w-full text-sm p-2 rounded border"
                            style={{
                              backgroundColor:
                                BUSINESS_COLORS.ui.background.secondary,
                              borderColor: BUSINESS_COLORS.ui.border.primary,
                              color: BUSINESS_COLORS.ui.text.primary,
                            }}
                          >
                            <option value="low">低 (更流畅)</option>
                            <option value="medium" selected>
                              中等
                            </option>
                            <option value="high">高 (更精细)</option>
                          </select>
                        </div>

                        <div>
                          <label
                            className="text-sm block mb-1"
                            style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                          >
                            光照强度:{" "}
                            {scene3DSettings.lightIntensity.toFixed(1)}
                          </label>
                          <input
                            type="range"
                            min="0.1"
                            max="2.0"
                            step="0.1"
                            value={scene3DSettings.lightIntensity}
                            onChange={(e) =>
                              update3DSettings({
                                lightIntensity: parseFloat(e.target.value),
                              })
                            }
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label
                            className="text-sm block mb-1"
                            style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                          >
                            视角: {scene3DSettings.viewAngle}°
                          </label>
                          <input
                            type="range"
                            min="30"
                            max="120"
                            step="5"
                            value={scene3DSettings.viewAngle}
                            onChange={(e) =>
                              update3DSettings({
                                viewAngle: parseInt(e.target.value),
                              })
                            }
                            className="w-full"
                          />
                        </div>
                      </div>
                    </BusinessCard>
                  </>
                )}

                {/* 安全标签页 */}
                {controlPanel.activeTab === "security" && (
                  <>
                    <BusinessCard size="sm">
                      <h4
                        className="font-medium mb-3"
                        style={{ color: BUSINESS_COLORS.ui.text.primary }}
                      >
                        威胁模拟
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span
                            className="text-sm"
                            style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                          >
                            启用威胁模拟
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={scene3DSettings.threatSimulation}
                              onChange={(e) =>
                                update3DSettings({
                                  threatSimulation: e.target.checked,
                                })
                              }
                            />
                            <div className="w-9 h-5 bg-gray-200 rounded-full peer transition-colors peer-checked:bg-blue-600">
                              <div className="w-4 h-4 bg-white rounded-full shadow transform transition-transform peer-checked:translate-x-4 translate-x-0.5 mt-0.5" />
                            </div>
                          </label>
                        </div>

                        <div>
                          <label
                            className="text-sm block mb-1"
                            style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                          >
                            告警阈值
                          </label>
                          <select
                            className="w-full text-sm p-2 rounded border"
                            style={{
                              backgroundColor:
                                BUSINESS_COLORS.ui.background.secondary,
                              borderColor: BUSINESS_COLORS.ui.border.primary,
                              color: BUSINESS_COLORS.ui.text.primary,
                            }}
                          >
                            <option value="low">低敏感度</option>
                            <option value="medium" selected>
                              中等敏感度
                            </option>
                            <option value="high">高敏感度</option>
                          </select>
                        </div>
                      </div>
                    </BusinessCard>

                    <BusinessCard size="sm">
                      <h4
                        className="font-medium mb-3"
                        style={{ color: BUSINESS_COLORS.ui.text.primary }}
                      >
                        实时统计
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span
                            style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                          >
                            今日攻击
                          </span>
                          <span style={{ color: BUSINESS_COLORS.status.error }}>
                            {realTimeData.blockedAttacks}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span
                            style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                          >
                            拦截率
                          </span>
                          <span
                            style={{ color: BUSINESS_COLORS.status.success }}
                          >
                            98.7%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span
                            style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                          >
                            平均响应
                          </span>
                          <span
                            style={{ color: BUSINESS_COLORS.ui.text.primary }}
                          >
                            12ms
                          </span>
                        </div>
                      </div>
                    </BusinessCard>
                  </>
                )}

                {/* 网络标签页 */}
                {controlPanel.activeTab === "network" && (
                  <>
                    <BusinessCard size="sm">
                      <h4
                        className="font-medium mb-3"
                        style={{ color: BUSINESS_COLORS.ui.text.primary }}
                      >
                        网络过滤器
                      </h4>
                      <div className="space-y-2">
                        {[
                          "server",
                          "firewall",
                          "router",
                          "endpoint",
                          "database",
                          "cloud",
                        ].map((type) => (
                          <label
                            key={type}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={
                                activeFilters.length === 0 ||
                                activeFilters.includes(type)
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setActiveFilters((prev) =>
                                    prev.filter((f) => f !== type),
                                  );
                                } else {
                                  setActiveFilters((prev) => [...prev, type]);
                                }
                              }}
                              className="rounded"
                            />
                            <span
                              className="text-sm capitalize"
                              style={{
                                color: BUSINESS_COLORS.ui.text.secondary,
                              }}
                            >
                              {type === "server"
                                ? "服务器"
                                : type === "firewall"
                                  ? "防火墙"
                                  : type === "router"
                                    ? "路由器"
                                    : type === "endpoint"
                                      ? "终端"
                                      : type === "database"
                                        ? "数据库"
                                        : type === "cloud"
                                          ? "云服务"
                                          : type}
                            </span>
                          </label>
                        ))}
                      </div>
                    </BusinessCard>

                    <BusinessCard size="sm">
                      <h4
                        className="font-medium mb-3"
                        style={{ color: BUSINESS_COLORS.ui.text.primary }}
                      >
                        网络拓扑
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span
                            style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                          >
                            总节点
                          </span>
                          <span
                            style={{ color: BUSINESS_COLORS.ui.text.primary }}
                          >
                            {networkNodes.length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span
                            style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                          >
                            在线节点
                          </span>
                          <span
                            style={{ color: BUSINESS_COLORS.status.success }}
                          >
                            {
                              networkNodes.filter((n) => n.status === "online")
                                .length
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span
                            style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                          >
                            告警节点
                          </span>
                          <span
                            style={{ color: BUSINESS_COLORS.status.warning }}
                          >
                            {
                              networkNodes.filter((n) => n.status === "warning")
                                .length
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span
                            style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                          >
                            故障节点
                          </span>
                          <span style={{ color: BUSINESS_COLORS.status.error }}>
                            {
                              networkNodes.filter((n) => n.status === "error")
                                .length
                            }
                          </span>
                        </div>
                      </div>
                    </BusinessCard>
                  </>
                )}

                {/* 设置标签页 */}
                {controlPanel.activeTab === "settings" && (
                  <>
                    <BusinessCard size="sm">
                      <h4
                        className="font-medium mb-3"
                        style={{ color: BUSINESS_COLORS.ui.text.primary }}
                      >
                        快捷操作
                      </h4>
                      <div className="space-y-2">
                        <button
                          onClick={exportView}
                          className="w-full text-left p-2 text-sm rounded transition-colors hover:scale-[1.02]"
                          style={{
                            backgroundColor:
                              BUSINESS_COLORS.ui.background.secondary,
                            color: BUSINESS_COLORS.ui.text.secondary,
                          }}
                        >
                          <Download className="w-4 h-4 inline mr-2" />
                          导出当前视图
                        </button>
                        <button
                          className="w-full text-left p-2 text-sm rounded transition-colors hover:scale-[1.02]"
                          style={{
                            backgroundColor:
                              BUSINESS_COLORS.ui.background.secondary,
                            color: BUSINESS_COLORS.ui.text.secondary,
                          }}
                        >
                          <Share2 className="w-4 h-4 inline mr-2" />
                          分享态势大屏
                        </button>
                        <button
                          className="w-full text-left p-2 text-sm rounded transition-colors hover:scale-[1.02]"
                          style={{
                            backgroundColor:
                              BUSINESS_COLORS.ui.background.secondary,
                            color: BUSINESS_COLORS.ui.text.secondary,
                          }}
                        >
                          <BarChart3 className="w-4 h-4 inline mr-2" />
                          生成安全报告
                        </button>
                        <button
                          onClick={resetCamera}
                          className="w-full text-left p-2 text-sm rounded transition-colors hover:scale-[1.02]"
                          style={{
                            backgroundColor:
                              BUSINESS_COLORS.ui.background.secondary,
                            color: BUSINESS_COLORS.ui.text.secondary,
                          }}
                        >
                          <RefreshCw className="w-4 h-4 inline mr-2" />
                          重置视角
                        </button>
                      </div>
                    </BusinessCard>

                    <BusinessCard size="sm">
                      <h4
                        className="font-medium mb-3"
                        style={{ color: BUSINESS_COLORS.ui.text.primary }}
                      >
                        通知设置
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span
                            className="text-sm"
                            style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                          >
                            桌面通知
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={alertsEnabled}
                              onChange={() => setAlertsEnabled(!alertsEnabled)}
                            />
                            <div className="w-9 h-5 bg-gray-200 rounded-full peer transition-colors peer-checked:bg-blue-600">
                              <div className="w-4 h-4 bg-white rounded-full shadow transform transition-transform peer-checked:translate-x-4 translate-x-0.5 mt-0.5" />
                            </div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <span
                            className="text-sm"
                            style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                          >
                            声音提醒
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={soundEnabled}
                              onChange={() => setSoundEnabled(!soundEnabled)}
                            />
                            <div className="w-9 h-5 bg-gray-200 rounded-full peer transition-colors peer-checked:bg-blue-600">
                              <div className="w-4 h-4 bg-white rounded-full shadow transform transition-transform peer-checked:translate-x-4 translate-x-0.5 mt-0.5" />
                            </div>
                          </label>
                        </div>
                      </div>
                    </BusinessCard>

                    <BusinessCard size="sm">
                      <h4
                        className="font-medium mb-3"
                        style={{ color: BUSINESS_COLORS.ui.text.primary }}
                      >
                        关于
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span
                            style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                          >
                            版本
                          </span>
                          <span
                            style={{ color: BUSINESS_COLORS.ui.text.primary }}
                          >
                            v2.1.0
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span
                            style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                          >
                            构建
                          </span>
                          <span
                            style={{ color: BUSINESS_COLORS.ui.text.primary }}
                          >
                            20240315
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span
                            style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                          >
                            运行时间
                          </span>
                          <span
                            style={{ color: BUSINESS_COLORS.ui.text.primary }}
                          >
                            {realTimeData.uptime}
                          </span>
                        </div>
                      </div>
                    </BusinessCard>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
