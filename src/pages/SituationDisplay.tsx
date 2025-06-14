import React, {
  useState,
  useRef,
  Suspense,
  useEffect,
  useMemo,
  useCallback,
} from "react";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThreeErrorBoundary } from "@/components/3d/ErrorBoundary";
import { TechSituationDisplay } from "@/components/3d/TechSituationDisplay";
import { TechDataPanels } from "@/components/dashboard/TechDataPanels";
import { TechCard } from "@/components/ui/TechCard";
import {
  useRealTimeData,
  generateSituationData,
} from "@/hooks/useRealTimeData";
import {
  TECH_COLORS,
  TECH_THEME,
  TECH_3D_CONFIG,
  createGlowEffect,
} from "@/lib/techColors";

/**
 * 视图模式枚举
 */
type ViewMode = "3d" | "2d" | "split" | "fullscreen-3d" | "fullscreen-2d";

/**
 * 控制面板状态
 */
interface ControlPanelState {
  isVisible: boolean;
  activeTab: string;
  isPinned: boolean;
}

/**
 * 3D场景设置
 */
interface Scene3DSettings {
  autoRotate: boolean;
  showGrid: boolean;
  showParticles: boolean;
  animationSpeed: number;
  viewAngle: number;
}

/**
 * 主要的态势感知显示页面
 * 集成3D可视化和2D数据面板，支持多种视图模式和响应式布局
 */
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
    showParticles: true,
    animationSpeed: 1.0,
    viewAngle: 60,
  });

  // 实时数据
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 2000,
    enabled: true,
  });

  // 响应式布局状态
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  // 检测屏幕尺寸
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
          case "\\": // Ctrl+\
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
  const toggleControlPanel = useCallback(() => {
    setControlPanel((prev) => ({
      ...prev,
      isVisible: !prev.isVisible,
    }));
  }, []);

  // 视图模式切换
  const switchViewMode = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  // 3D设置更新
  const update3DSettings = useCallback((updates: Partial<Scene3DSettings>) => {
    setScene3DSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  // 加载屏幕
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div
      className="h-screen w-full relative overflow-hidden"
      style={{ backgroundColor: TECH_COLORS.ui.background.primary }}
    >
      {/* 顶部控制栏 */}
      <TopControlBar
        currentTime={currentTime}
        viewMode={viewMode}
        onViewModeChange={switchViewMode}
        onToggleControlPanel={toggleControlPanel}
        onNavigateBack={() => navigate(-1)}
        realTimeData={realTimeData}
      />

      {/* 主要内容区域 */}
      <div
        className="flex h-full"
        style={{ paddingTop: "64px", paddingBottom: "40px" }}
      >
        {/* 3D可视化区域 */}
        {(viewMode === "3d" ||
          viewMode === "split" ||
          viewMode === "fullscreen-3d") && (
          <div
            className={`transition-all duration-500 ${
              viewMode === "2d" || viewMode === "fullscreen-2d"
                ? "w-0"
                : viewMode === "split"
                  ? "w-1/2"
                  : "w-full"
            }`}
            style={{
              display:
                viewMode === "2d" || viewMode === "fullscreen-2d"
                  ? "none"
                  : "block",
            }}
          >
            <Scene3DContainer
              settings={scene3DSettings}
              onSettingsChange={update3DSettings}
            />
          </div>
        )}

        {/* 2D数据面板区域 */}
        {(viewMode === "2d" ||
          viewMode === "split" ||
          viewMode === "fullscreen-2d") && (
          <div
            className={`transition-all duration-500 border-l ${
              viewMode === "3d" || viewMode === "fullscreen-3d"
                ? "w-0"
                : viewMode === "split"
                  ? "w-1/2"
                  : "w-full"
            }`}
            style={{
              borderColor: TECH_COLORS.ui.border.primary,
              display:
                viewMode === "3d" || viewMode === "fullscreen-3d"
                  ? "none"
                  : "block",
            }}
          >
            <TechDataPanels />
          </div>
        )}
      </div>

      {/* 侧边控制面板 */}
      <SideControlPanel
        isVisible={controlPanel.isVisible}
        activeTab={controlPanel.activeTab}
        onTabChange={(tab) =>
          setControlPanel((prev) => ({ ...prev, activeTab: tab }))
        }
        onClose={() =>
          setControlPanel((prev) => ({ ...prev, isVisible: false }))
        }
        scene3DSettings={scene3DSettings}
        onScene3DSettingsChange={update3DSettings}
        realTimeData={realTimeData}
      />

      {/* 浮动控制按钮 */}
      <FloatingControls
        viewMode={viewMode}
        onViewModeChange={switchViewMode}
        controlPanelVisible={controlPanel.isVisible}
        onToggleControlPanel={toggleControlPanel}
      />

      {/* 底部状态栏 */}
      <BottomStatusBar realTimeData={realTimeData} viewMode={viewMode} />

      {/* 快捷键提示 */}
      {!isMobile && <KeyboardShortcuts />}
    </div>
  );
}

/**
 * 加载屏幕组件
 */
function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 10;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center z-50"
      style={{
        background: `linear-gradient(135deg, ${TECH_COLORS.ui.background.primary}, ${TECH_COLORS.ui.background.secondary})`,
      }}
    >
      <div className="text-center">
        {/* 加载动画 */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mb-8 mx-auto relative"
          style={{
            background: TECH_COLORS.gradients.cyber,
            boxShadow: createGlowEffect(TECH_COLORS.primary.cyber, 2),
          }}
        >
          <Brain className="w-12 h-12 text-white animate-pulse" />
          <div
            className="absolute inset-0 rounded-full animate-spin"
            style={{
              border: `2px solid transparent`,
              borderTop: `2px solid ${TECH_COLORS.primary.neon}`,
              borderRight: `2px solid ${TECH_COLORS.primary.matrix}`,
            }}
          />
        </div>

        {/* 标题 */}
        <div
          className="text-3xl font-bold mb-4 font-mono"
          style={{
            color: TECH_COLORS.ui.text.primary,
            textShadow: createGlowEffect(TECH_COLORS.primary.cyber, 1),
          }}
        >
          NEURAL CYBER MONITORING
        </div>

        {/* 副标题 */}
        <div
          className="text-lg font-mono mb-6"
          style={{ color: TECH_COLORS.ui.text.secondary }}
        >
          Advanced Situation Awareness Platform
        </div>

        {/* 进度条 */}
        <div
          className="w-64 h-2 rounded-full mx-auto mb-4"
          style={{ backgroundColor: TECH_COLORS.ui.background.panel }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              background: TECH_COLORS.gradients.matrix,
              boxShadow: createGlowEffect(TECH_COLORS.primary.matrix, 1),
            }}
          />
        </div>

        {/* 进度文本 */}
        <div
          className="text-sm font-mono"
          style={{ color: TECH_COLORS.ui.text.muted }}
        >
          初始化神经网络... {Math.floor(progress)}%
        </div>
      </div>
    </div>
  );
}

/**
 * 顶部控制栏组件
 */
function TopControlBar({
  currentTime,
  viewMode,
  onViewModeChange,
  onToggleControlPanel,
  onNavigateBack,
  realTimeData,
}: {
  currentTime: Date;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onToggleControlPanel: () => void;
  onNavigateBack: () => void;
  realTimeData: any;
}) {
  const viewModeButtons = [
    { mode: "3d" as ViewMode, icon: Cpu, label: "3D视图" },
    { mode: "2d" as ViewMode, icon: Monitor, label: "2D面板" },
    { mode: "split" as ViewMode, icon: Grid3X3, label: "分屏" },
  ];

  return (
    <div
      className="absolute top-0 left-0 right-0 z-50 border-b backdrop-blur-md"
      style={{
        backgroundColor: TECH_COLORS.ui.background.overlay,
        borderColor: TECH_COLORS.ui.border.accent,
        height: "64px",
        boxShadow: createGlowEffect(TECH_COLORS.primary.cyber, 0.5),
      }}
    >
      <div className="flex items-center justify-between h-full px-4">
        {/* 左侧：导航和标题 */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onNavigateBack}
            className="flex items-center space-x-2 px-3 py-1 rounded-lg transition-all duration-300"
            style={{
              backgroundColor: TECH_COLORS.ui.background.panel,
              color: TECH_COLORS.ui.text.secondary,
              border: `1px solid ${TECH_COLORS.ui.border.primary}`,
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-mono">返回</span>
          </button>

          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: TECH_COLORS.gradients.cyber,
                boxShadow: createGlowEffect(TECH_COLORS.primary.cyber, 1),
              }}
            >
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1
                className="text-xl font-bold font-mono"
                style={{
                  color: TECH_COLORS.ui.text.primary,
                  textShadow: createGlowEffect(TECH_COLORS.primary.cyber, 0.5),
                }}
              >
                NEURAL CYBER COMMAND
              </h1>
              <p
                className="text-xs font-mono"
                style={{ color: TECH_COLORS.ui.text.secondary }}
              >
                Advanced Situation Awareness Platform
              </p>
            </div>
          </div>
        </div>

        {/* 中间：视图模式切换 */}
        <div className="flex items-center space-x-2">
          {viewModeButtons.map((button) => (
            <button
              key={button.mode}
              onClick={() => onViewModeChange(button.mode)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300"
              style={{
                backgroundColor:
                  viewMode === button.mode
                    ? TECH_COLORS.ui.background.panel
                    : "transparent",
                color:
                  viewMode === button.mode
                    ? TECH_COLORS.primary.cyber
                    : TECH_COLORS.ui.text.secondary,
                border: `1px solid ${
                  viewMode === button.mode
                    ? TECH_COLORS.primary.cyber
                    : TECH_COLORS.ui.border.primary
                }`,
                boxShadow:
                  viewMode === button.mode
                    ? createGlowEffect(TECH_COLORS.primary.cyber, 0.5)
                    : "none",
              }}
              title={button.label}
            >
              <button.icon className="w-4 h-4" />
              <span className="text-sm font-mono hidden sm:inline">
                {button.label}
              </span>
            </button>
          ))}
        </div>

        {/* 右侧：状态和控制 */}
        <div className="flex items-center space-x-4">
          {/* 系统状态 */}
          <div className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full animate-pulse"
              style={{
                backgroundColor: TECH_COLORS.status.online,
                boxShadow: createGlowEffect(TECH_COLORS.status.online, 1),
              }}
            />
            <span
              className="text-sm font-mono hidden md:inline"
              style={{ color: TECH_COLORS.ui.text.secondary }}
            >
              SYSTEM ONLINE
            </span>
          </div>

          {/* 当前时间 */}
          <div
            className="text-sm font-mono px-3 py-1 rounded border"
            style={{
              color: TECH_COLORS.ui.text.accent,
              backgroundColor: TECH_COLORS.ui.background.panel,
              borderColor: TECH_COLORS.ui.border.accent,
            }}
          >
            {currentTime.toLocaleString("zh-CN")}
          </div>

          {/* 控制面板按钮 */}
          <button
            onClick={onToggleControlPanel}
            className="p-2 rounded-lg transition-all duration-300"
            style={{
              backgroundColor: TECH_COLORS.ui.background.panel,
              color: TECH_COLORS.ui.text.primary,
              border: `1px solid ${TECH_COLORS.ui.border.accent}`,
            }}
            title="控制面板 (Ctrl+\\)"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * 3D场景容器
 */
function Scene3DContainer({
  settings,
  onSettingsChange,
}: {
  settings: Scene3DSettings;
  onSettingsChange: (updates: Partial<Scene3DSettings>) => void;
}) {
  return (
    <div className="relative w-full h-full">
      <ThreeErrorBoundary>
        <Canvas
          camera={{
            position: [0, 30, 60],
            fov: settings.viewAngle,
            near: 0.1,
            far: 1000,
          }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            <TechSituationDisplay />
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={30}
              maxDistance={200}
              dampingFactor={0.05}
              enableDamping
              minPolarAngle={0}
              maxPolarAngle={Math.PI / 1.8}
              autoRotate={settings.autoRotate}
              autoRotateSpeed={0.5 * settings.animationSpeed}
            />
          </Suspense>
        </Canvas>
      </ThreeErrorBoundary>

      {/* 3D控制覆盖层 */}
      <Scene3DOverlay settings={settings} onSettingsChange={onSettingsChange} />
    </div>
  );
}

/**
 * 3D场景覆盖层控制
 */
function Scene3DOverlay({
  settings,
  onSettingsChange,
}: {
  settings: Scene3DSettings;
  onSettingsChange: (updates: Partial<Scene3DSettings>) => void;
}) {
  return (
    <div className="absolute top-4 right-4 space-y-2 z-10">
      <TechCard variant="cyber" className="p-3">
        <div className="flex items-center space-x-2 mb-2">
          <Eye
            className="w-4 h-4"
            style={{ color: TECH_COLORS.primary.cyber }}
          />
          <span
            className="text-sm font-mono"
            style={{ color: TECH_COLORS.ui.text.primary }}
          >
            3D控制
          </span>
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.autoRotate}
              onChange={(e) =>
                onSettingsChange({ autoRotate: e.target.checked })
              }
              className="w-3 h-3"
            />
            <span
              className="text-xs font-mono"
              style={{ color: TECH_COLORS.ui.text.secondary }}
            >
              自动旋转
            </span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.showGrid}
              onChange={(e) => onSettingsChange({ showGrid: e.target.checked })}
              className="w-3 h-3"
            />
            <span
              className="text-xs font-mono"
              style={{ color: TECH_COLORS.ui.text.secondary }}
            >
              显示网格
            </span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.showParticles}
              onChange={(e) =>
                onSettingsChange({ showParticles: e.target.checked })
              }
              className="w-3 h-3"
            />
            <span
              className="text-xs font-mono"
              style={{ color: TECH_COLORS.ui.text.secondary }}
            >
              粒子效果
            </span>
          </label>
        </div>
      </TechCard>
    </div>
  );
}

/**
 * 侧边控制面板
 */
function SideControlPanel({
  isVisible,
  activeTab,
  onTabChange,
  onClose,
  scene3DSettings,
  onScene3DSettingsChange,
  realTimeData,
}: {
  isVisible: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onClose: () => void;
  scene3DSettings: Scene3DSettings;
  onScene3DSettingsChange: (updates: Partial<Scene3DSettings>) => void;
  realTimeData: any;
}) {
  const tabs = [
    { id: "system", label: "系统", icon: Monitor },
    { id: "3d", label: "3D设置", icon: Cpu },
    { id: "data", label: "数据", icon: Activity },
    { id: "alerts", label: "警报", icon: Zap },
  ];

  return (
    <div
      className={`fixed right-0 top-16 bottom-10 border-l transform transition-transform duration-300 z-40 backdrop-blur-md ${
        isVisible ? "translate-x-0" : "translate-x-full"
      }`}
      style={{
        width: "400px",
        backgroundColor: TECH_COLORS.ui.background.overlay,
        borderColor: TECH_COLORS.ui.border.accent,
        boxShadow: createGlowEffect(TECH_COLORS.primary.cyber, 1),
      }}
    >
      {/* 头部 */}
      <div
        className="flex items-center justify-between p-4 border-b"
        style={{
          background: TECH_COLORS.gradients.cyber,
          borderColor: TECH_COLORS.ui.border.accent,
        }}
      >
        <h2
          className="text-xl font-bold font-mono text-white"
          style={{ textShadow: createGlowEffect(TECH_COLORS.primary.cyber, 1) }}
        >
          控制中心
        </h2>
        <button
          onClick={onClose}
          className="p-1 rounded transition-colors hover:bg-black/30"
          style={{ color: "white" }}
        >
          <X className="w-5 h-5" />
        </button>
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
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center space-x-2 py-3 px-4 text-sm font-mono transition-all duration-300 ${
              activeTab === tab.id ? "border-b-2" : ""
            }`}
            style={{
              color:
                activeTab === tab.id
                  ? TECH_COLORS.primary.cyber
                  : TECH_COLORS.ui.text.secondary,
              borderColor:
                activeTab === tab.id
                  ? TECH_COLORS.primary.cyber
                  : "transparent",
              backgroundColor:
                activeTab === tab.id
                  ? TECH_COLORS.ui.background.secondary
                  : "transparent",
            }}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="p-4 overflow-y-auto h-full">
        {activeTab === "system" && (
          <SystemControlTab realTimeData={realTimeData} />
        )}
        {activeTab === "3d" && (
          <Scene3DControlTab
            settings={scene3DSettings}
            onSettingsChange={onScene3DSettingsChange}
          />
        )}
        {activeTab === "data" && <DataControlTab realTimeData={realTimeData} />}
        {activeTab === "alerts" && <AlertsControlTab />}
      </div>
    </div>
  );
}

/**
 * 系统控制标签页
 */
function SystemControlTab({ realTimeData }: { realTimeData: any }) {
  return (
    <div className="space-y-4">
      <h3
        className="text-lg font-bold font-mono"
        style={{ color: TECH_COLORS.ui.text.primary }}
      >
        系统状态
      </h3>

      <div className="space-y-3">
        {[
          { label: "CPU使用率", value: `${realTimeData?.cpuUsage || 0}%` },
          { label: "内存使用率", value: `${realTimeData?.memoryUsage || 0}%` },
          {
            label: "网络延迟",
            value: `${realTimeData?.networkLatency || 0}ms`,
          },
          {
            label: "活跃连接",
            value: `${realTimeData?.activeConnections || 0}`,
          },
          { label: "威胁等级", value: `${realTimeData?.realTimeThreats || 0}` },
        ].map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-3 rounded border"
            style={{
              backgroundColor: TECH_COLORS.ui.background.panel,
              borderColor: TECH_COLORS.ui.border.primary,
            }}
          >
            <span
              className="text-sm font-mono"
              style={{ color: TECH_COLORS.ui.text.secondary }}
            >
              {item.label}
            </span>
            <span
              className="text-sm font-bold font-mono"
              style={{ color: TECH_COLORS.primary.cyber }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 3D场景控制标签页
 */
function Scene3DControlTab({
  settings,
  onSettingsChange,
}: {
  settings: Scene3DSettings;
  onSettingsChange: (updates: Partial<Scene3DSettings>) => void;
}) {
  return (
    <div className="space-y-4">
      <h3
        className="text-lg font-bold font-mono"
        style={{ color: TECH_COLORS.ui.text.primary }}
      >
        3D场景设置
      </h3>

      <div className="space-y-4">
        {/* 自动旋转 */}
        <label className="flex items-center justify-between">
          <span
            className="text-sm font-mono"
            style={{ color: TECH_COLORS.ui.text.secondary }}
          >
            自动旋转
          </span>
          <input
            type="checkbox"
            checked={settings.autoRotate}
            onChange={(e) => onSettingsChange({ autoRotate: e.target.checked })}
            className="w-4 h-4"
          />
        </label>

        {/* 显示网格 */}
        <label className="flex items-center justify-between">
          <span
            className="text-sm font-mono"
            style={{ color: TECH_COLORS.ui.text.secondary }}
          >
            显示网格
          </span>
          <input
            type="checkbox"
            checked={settings.showGrid}
            onChange={(e) => onSettingsChange({ showGrid: e.target.checked })}
            className="w-4 h-4"
          />
        </label>

        {/* 粒子效果 */}
        <label className="flex items-center justify-between">
          <span
            className="text-sm font-mono"
            style={{ color: TECH_COLORS.ui.text.secondary }}
          >
            粒子效果
          </span>
          <input
            type="checkbox"
            checked={settings.showParticles}
            onChange={(e) =>
              onSettingsChange({ showParticles: e.target.checked })
            }
            className="w-4 h-4"
          />
        </label>

        {/* 动画速度 */}
        <div>
          <label
            className="block text-sm font-mono mb-2"
            style={{ color: TECH_COLORS.ui.text.secondary }}
          >
            动画速度: {settings.animationSpeed.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.1"
            max="3.0"
            step="0.1"
            value={settings.animationSpeed}
            onChange={(e) =>
              onSettingsChange({ animationSpeed: parseFloat(e.target.value) })
            }
            className="w-full"
          />
        </div>

        {/* 视角 */}
        <div>
          <label
            className="block text-sm font-mono mb-2"
            style={{ color: TECH_COLORS.ui.text.secondary }}
          >
            视角: {settings.viewAngle}°
          </label>
          <input
            type="range"
            min="30"
            max="120"
            step="5"
            value={settings.viewAngle}
            onChange={(e) =>
              onSettingsChange({ viewAngle: parseInt(e.target.value) })
            }
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * 数据控制标签页
 */
function DataControlTab({ realTimeData }: { realTimeData: any }) {
  return (
    <div className="space-y-4">
      <h3
        className="text-lg font-bold font-mono"
        style={{ color: TECH_COLORS.ui.text.primary }}
      >
        数据监控
      </h3>

      <div
        className="p-3 rounded border font-mono text-sm space-y-1"
        style={{
          backgroundColor: TECH_COLORS.ui.background.primary,
          borderColor: TECH_COLORS.ui.border.primary,
          color: TECH_COLORS.ui.text.secondary,
        }}
      >
        <div>[DATA] 实时数据流: 活跃</div>
        <div>[CONN] 网络连接数: {realTimeData?.activeConnections || 0}</div>
        <div>[BAND] 带宽使用率: {realTimeData?.bandwidthUsage || 0}%</div>
        <div>[THRT] 威胁检测: {realTimeData?.realTimeThreats || 0} 个</div>
        <div>[PERF] 系统性能: 正常</div>
      </div>
    </div>
  );
}

/**
 * 警报控制标签页
 */
function AlertsControlTab() {
  const [alerts] = useState([
    { time: "14:23:45", level: "WARNING", message: "检测到异常网络流量" },
    { time: "14:22:31", level: "INFO", message: "安全扫描完成" },
    { time: "14:21:18", level: "ERROR", message: "节点连接异常" },
    { time: "14:20:02", level: "INFO", message: "系统优化执行" },
  ]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "ERROR":
        return TECH_COLORS.threat.critical;
      case "WARNING":
        return TECH_COLORS.threat.medium;
      default:
        return TECH_COLORS.threat.safe;
    }
  };

  return (
    <div className="space-y-4">
      <h3
        className="text-lg font-bold font-mono"
        style={{ color: TECH_COLORS.ui.text.primary }}
      >
        系统警报
      </h3>

      <div className="space-y-2">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className="p-3 rounded border"
            style={{
              backgroundColor: TECH_COLORS.ui.background.panel,
              borderColor: getLevelColor(alert.level),
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className="text-xs font-mono"
                style={{ color: getLevelColor(alert.level) }}
              >
                {alert.level}
              </span>
              <span
                className="text-xs font-mono"
                style={{ color: TECH_COLORS.ui.text.muted }}
              >
                {alert.time}
              </span>
            </div>
            <div
              className="text-sm font-mono"
              style={{ color: TECH_COLORS.ui.text.secondary }}
            >
              {alert.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 浮动控制按钮
 */
function FloatingControls({
  viewMode,
  onViewModeChange,
  controlPanelVisible,
  onToggleControlPanel,
}: {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  controlPanelVisible: boolean;
  onToggleControlPanel: () => void;
}) {
  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-30 space-y-2">
      {/* 视图切换 */}
      <TechCard variant="cyber" className="p-2">
        <div className="flex flex-col space-y-1">
          {[
            { mode: "3d" as ViewMode, icon: Cpu },
            { mode: "2d" as ViewMode, icon: Monitor },
            { mode: "split" as ViewMode, icon: Grid3X3 },
          ].map((button) => (
            <button
              key={button.mode}
              onClick={() => onViewModeChange(button.mode)}
              className="p-2 rounded transition-all duration-300"
              style={{
                backgroundColor:
                  viewMode === button.mode
                    ? TECH_COLORS.primary.cyber
                    : "transparent",
                color:
                  viewMode === button.mode
                    ? "white"
                    : TECH_COLORS.ui.text.secondary,
              }}
              title={button.mode.toUpperCase()}
            >
              <button.icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </TechCard>

      {/* 控制面板切换 */}
      <button
        onClick={onToggleControlPanel}
        className="p-3 rounded-lg transition-all duration-300"
        style={{
          backgroundColor: controlPanelVisible
            ? TECH_COLORS.primary.cyber
            : TECH_COLORS.ui.background.panel,
          color: controlPanelVisible ? "white" : TECH_COLORS.ui.text.secondary,
          border: `1px solid ${TECH_COLORS.ui.border.accent}`,
          boxShadow: controlPanelVisible
            ? createGlowEffect(TECH_COLORS.primary.cyber, 1)
            : "none",
        }}
        title="控制面板"
      >
        {controlPanelVisible ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}

/**
 * 底部状态栏
 */
function BottomStatusBar({
  realTimeData,
  viewMode,
}: {
  realTimeData: any;
  viewMode: ViewMode;
}) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 border-t p-2 backdrop-blur-md"
      style={{
        backgroundColor: TECH_COLORS.ui.background.overlay,
        borderColor: TECH_COLORS.ui.border.primary,
        height: "40px",
      }}
    >
      <div className="flex justify-between items-center text-sm font-mono">
        <div style={{ color: TECH_COLORS.ui.text.secondary }}>
          Neural Cyber Command Center v3.0 | 视图模式: {viewMode.toUpperCase()}
        </div>
        <div className="flex items-center space-x-4">
          <span style={{ color: TECH_COLORS.ui.text.muted }}>
            连接: {realTimeData?.activeConnections || 0}
          </span>
          <span style={{ color: TECH_COLORS.ui.text.muted }}>
            威胁: {realTimeData?.realTimeThreats || 0}
          </span>
          <div className="flex items-center space-x-1">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{
                backgroundColor: TECH_COLORS.status.online,
                boxShadow: createGlowEffect(TECH_COLORS.status.online, 0.5),
              }}
            />
            <span style={{ color: TECH_COLORS.ui.text.secondary }}>在线</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 快捷键提示
 */
function KeyboardShortcuts() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="fixed bottom-12 left-4 z-20">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="text-xs font-mono p-2 rounded opacity-50 hover:opacity-100 transition-opacity"
        style={{
          color: TECH_COLORS.ui.text.muted,
          backgroundColor: TECH_COLORS.ui.background.panel,
        }}
      >
        快捷键
      </button>

      {isVisible && (
        <TechCard variant="cyber" className="mt-2 p-3 w-48">
          <div className="text-xs font-mono space-y-1">
            <div style={{ color: TECH_COLORS.ui.text.secondary }}>
              Ctrl+1: 3D视图
            </div>
            <div style={{ color: TECH_COLORS.ui.text.secondary }}>
              Ctrl+2: 2D面板
            </div>
            <div style={{ color: TECH_COLORS.ui.text.secondary }}>
              Ctrl+3: 分屏模式
            </div>
            <div style={{ color: TECH_COLORS.ui.text.secondary }}>
              Ctrl+\: 控制面板
            </div>
          </div>
        </TechCard>
      )}
    </div>
  );
}
