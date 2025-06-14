import React, { useState, useRef, Suspense, useEffect } from "react";
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
} from "@/components/ui/BusinessCard";
import { BUSINESS_COLORS } from "@/lib/businessColors";

type ViewMode = "3d" | "2d" | "split" | "fullscreen";

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
  modelType: "security" | "network" | "shield";
  showTraffic: boolean;
  threatSimulation: boolean;
}

export default function SituationDisplay() {
  const navigate = useNavigate();

  // 视图状态管理
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 控制面板状态
  const [controlPanel, setControlPanel] = useState<ControlPanelState>({
    isVisible: false,
    activeTab: "system",
    isPinned: false,
  });

  // 3D场景设置
  const [scene3DSettings, setScene3DSettings] = useState<Scene3DSettings>({
    autoRotate: true,
    showGrid: true,
    showLabels: true,
    animationSpeed: 1.0,
    viewAngle: 60,
  });

  // 模拟实时数据
  const [realTimeData, setRealTimeData] = useState({
    threatLevel: "中等",
    activeThreats: 23,
    blockedAttacks: 1247,
    systemHealth: 98,
    networkLoad: 45,
    connectedDevices: 342,
  });

  // 初始化加载
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // 更新当前时间
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 模拟数据更新
  useEffect(() => {
    const timer = setInterval(() => {
      setRealTimeData((prev) => ({
        ...prev,
        activeThreats: Math.max(
          0,
          prev.activeThreats + Math.floor(Math.random() * 5) - 2,
        ),
        networkLoad: Math.max(
          0,
          Math.min(100, prev.networkLoad + Math.floor(Math.random() * 10) - 5),
        ),
        systemHealth: Math.max(
          90,
          Math.min(100, prev.systemHealth + Math.floor(Math.random() * 3) - 1),
        ),
      }));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        switch (e.key) {
          case "1":
            e.preventDefault();
            setViewMode("3d");
            break;
          case "2":
            e.preventDefault();
            setViewMode("2d");
            break;
          case "3":
            e.preventDefault();
            setViewMode("split");
            break;
          case "\\":
            e.preventDefault();
            toggleControlPanel();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // 控制面板切换
  const toggleControlPanel = () => {
    setControlPanel((prev) => ({
      ...prev,
      isVisible: !prev.isVisible,
    }));
  };

  // 视图模式切换
  const switchViewMode = (mode: ViewMode) => {
    setViewMode(mode);
  };

  // 3D设置更新
  const update3DSettings = (updates: Partial<Scene3DSettings>) => {
    setScene3DSettings((prev) => ({ ...prev, ...updates }));
  };

  // 加载屏幕
  if (isLoading) {
    return (
      <div
        className="h-screen w-full flex items-center justify-center"
        style={{ backgroundColor: BUSINESS_COLORS.ui.background.secondary }}
      >
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: BUSINESS_COLORS.primary.blue }}
          >
            <Shield className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h2
            className="text-xl font-bold mb-2"
            style={{ color: BUSINESS_COLORS.ui.text.inverse }}
          >
            初始化态势感知系统
          </h2>
          <p style={{ color: BUSINESS_COLORS.neutral.silver }}>
            正在加载安全监控界面...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-screen w-full relative overflow-hidden"
      style={{ backgroundColor: BUSINESS_COLORS.ui.background.secondary }}
    >
      {/* 顶部控制栏 */}
      <div
        className="h-16 flex items-center justify-between px-6 border-b"
        style={{
          backgroundColor: BUSINESS_COLORS.ui.background.panel,
          borderColor: BUSINESS_COLORS.ui.border.primary,
        }}
      >
        {/* 左侧控制 */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors"
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
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: BUSINESS_COLORS.primary.blue }}
            >
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1
                className="text-lg font-bold"
                style={{ color: BUSINESS_COLORS.ui.text.primary }}
              >
                网络安全态势大屏
              </h1>
              <p
                className="text-xs"
                style={{ color: BUSINESS_COLORS.ui.text.muted }}
              >
                {currentTime.toLocaleString("zh-CN")}
              </p>
            </div>
          </div>
        </div>

        {/* 中间视图切换 */}
        <div className="flex items-center space-x-2">
          {[
            { mode: "3d" as ViewMode, label: "3D视图", icon: Cpu },
            { mode: "2d" as ViewMode, label: "2D面板", icon: BarChart3 },
            { mode: "split" as ViewMode, label: "分屏", icon: Layers },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = viewMode === item.mode;

            return (
              <button
                key={item.mode}
                onClick={() => switchViewMode(item.mode)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive ? "shadow-md" : ""
                }`}
                style={{
                  backgroundColor: isActive
                    ? BUSINESS_COLORS.primary.blue
                    : BUSINESS_COLORS.ui.background.secondary,
                  color: isActive ? "white" : BUSINESS_COLORS.ui.text.secondary,
                }}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* 右侧状态 */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: BUSINESS_COLORS.status.success }}
            />
            <span
              className="text-sm"
              style={{ color: BUSINESS_COLORS.status.success }}
            >
              系统在线
            </span>
          </div>

          <button
            onClick={toggleControlPanel}
            className="p-2 rounded-lg transition-colors"
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
                  camera={{
                    position: [8, 6, 8],
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
                    autoRotate={scene3DSettings.autoRotate}
                    autoRotateSpeed={scene3DSettings.animationSpeed}
                    maxDistance={15}
                    minDistance={3}
                  />

                  <BusinessSecurityModel />
                </Canvas>
              </Suspense>

              {/* 3D控制覆盖层 */}
              <div className="absolute top-4 left-4">
                <BusinessCard size="sm">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-sm font-medium"
                        style={{ color: BUSINESS_COLORS.ui.text.primary }}
                      >
                        3D控制
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={scene3DSettings.autoRotate}
                        onChange={(e) =>
                          update3DSettings({ autoRotate: e.target.checked })
                        }
                        className="rounded"
                      />
                      <span
                        className="text-xs"
                        style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                      >
                        自动旋转
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={scene3DSettings.showGrid}
                        onChange={(e) =>
                          update3DSettings({ showGrid: e.target.checked })
                        }
                        className="rounded"
                      />
                      <span
                        className="text-xs"
                        style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                      >
                        显示网格
                      </span>
                    </div>
                  </div>
                </BusinessCard>
              </div>
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
              {/* 实时指标 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatusCard
                  title="威胁等级"
                  value={realTimeData.threatLevel}
                  icon={<AlertTriangle className="w-5 h-5" />}
                  status="warning"
                />

                <StatusCard
                  title="活跃威胁"
                  value={realTimeData.activeThreats}
                  icon={<Shield className="w-5 h-5" />}
                  status="error"
                  trend={{ value: 12, label: "较昨日", isPositive: false }}
                />

                <StatusCard
                  title="阻止攻击"
                  value={realTimeData.blockedAttacks.toLocaleString()}
                  icon={<Activity className="w-5 h-5" />}
                  status="success"
                  trend={{ value: 8, label: "较昨日", isPositive: true }}
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
                  status="info"
                />

                <StatusCard
                  title="连接设备"
                  value={realTimeData.connectedDevices}
                  icon={<Cpu className="w-5 h-5" />}
                  status="info"
                />
              </div>

              {/* 威胁趋势图表 */}
              <InfoCard
                title="威胁趋势分析"
                description="过去24小时的安全威胁变化趋势"
              >
                <div
                  className="h-64 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: BUSINESS_COLORS.ui.background.tertiary,
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
                      实时数据更新中...
                    </p>
                  </div>
                </div>
              </InfoCard>

              {/* 网络拓扑状态 */}
              <InfoCard
                title="网络拓扑状态"
                description="当前网络设备连接状态和流量分布"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span style={{ color: BUSINESS_COLORS.ui.text.primary }}>
                        核心交换机
                      </span>
                      <span
                        className="px-2 py-1 rounded text-xs"
                        style={{
                          backgroundColor: `${BUSINESS_COLORS.status.success}20`,
                          color: BUSINESS_COLORS.status.success,
                        }}
                      >
                        正常
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span style={{ color: BUSINESS_COLORS.ui.text.primary }}>
                        防火墙集群
                      </span>
                      <span
                        className="px-2 py-1 rounded text-xs"
                        style={{
                          backgroundColor: `${BUSINESS_COLORS.status.success}20`,
                          color: BUSINESS_COLORS.status.success,
                        }}
                      >
                        正常
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span style={{ color: BUSINESS_COLORS.ui.text.primary }}>
                        入侵检测
                      </span>
                      <span
                        className="px-2 py-1 rounded text-xs"
                        style={{
                          backgroundColor: `${BUSINESS_COLORS.status.warning}20`,
                          color: BUSINESS_COLORS.status.warning,
                        }}
                      >
                        告警
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span style={{ color: BUSINESS_COLORS.ui.text.primary }}>
                        Web服务器
                      </span>
                      <span
                        className="px-2 py-1 rounded text-xs"
                        style={{
                          backgroundColor: `${BUSINESS_COLORS.status.success}20`,
                          color: BUSINESS_COLORS.status.success,
                        }}
                      >
                        正常
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span style={{ color: BUSINESS_COLORS.ui.text.primary }}>
                        数据库服务器
                      </span>
                      <span
                        className="px-2 py-1 rounded text-xs"
                        style={{
                          backgroundColor: `${BUSINESS_COLORS.status.success}20`,
                          color: BUSINESS_COLORS.status.success,
                        }}
                      >
                        正常
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span style={{ color: BUSINESS_COLORS.ui.text.primary }}>
                        工作站群组
                      </span>
                      <span
                        className="px-2 py-1 rounded text-xs"
                        style={{
                          backgroundColor: `${BUSINESS_COLORS.status.info}20`,
                          color: BUSINESS_COLORS.status.info,
                        }}
                      >
                        监控中
                      </span>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </div>
        )}

        {/* 控制面板侧边栏 */}
        {controlPanel.isVisible && (
          <div
            className="w-80 border-l overflow-y-auto"
            style={{
              backgroundColor: BUSINESS_COLORS.ui.background.panel,
              borderColor: BUSINESS_COLORS.ui.border.primary,
            }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="font-bold"
                  style={{ color: BUSINESS_COLORS.ui.text.primary }}
                >
                  控制面板
                </h3>
                <button
                  onClick={toggleControlPanel}
                  className="p-1 rounded"
                  style={{ color: BUSINESS_COLORS.ui.text.muted }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
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
                          defaultChecked
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
                          defaultChecked
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
                    快捷操作
                  </h4>
                  <div className="space-y-2">
                    <button
                      className="w-full text-left p-2 text-sm rounded transition-colors"
                      style={{
                        backgroundColor:
                          BUSINESS_COLORS.ui.background.secondary,
                        color: BUSINESS_COLORS.ui.text.secondary,
                      }}
                    >
                      导出当前视图
                    </button>
                    <button
                      className="w-full text-left p-2 text-sm rounded transition-colors"
                      style={{
                        backgroundColor:
                          BUSINESS_COLORS.ui.background.secondary,
                        color: BUSINESS_COLORS.ui.text.secondary,
                      }}
                    >
                      生成安全报告
                    </button>
                    <button
                      className="w-full text-left p-2 text-sm rounded transition-colors"
                      style={{
                        backgroundColor:
                          BUSINESS_COLORS.ui.background.secondary,
                        color: BUSINESS_COLORS.ui.text.secondary,
                      }}
                    >
                      调整告警阈值
                    </button>
                  </div>
                </BusinessCard>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
