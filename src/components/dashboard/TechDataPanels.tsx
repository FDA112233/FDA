import React, { useState, useEffect, useMemo } from "react";
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  ComposedChart,
} from "recharts";
import {
  Brain,
  Zap,
  Shield,
  Activity,
  Database,
  Network,
  Cpu,
  HardDrive,
  Wifi,
  Server,
  Globe,
  Eye,
  Lock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Hexagon,
  Triangle,
  Square,
  Circle,
} from "lucide-react";
import { TechCard, StatusCard } from "@/components/ui/TechCard";
import {
  TECH_COLORS,
  getThreatLevelColor,
  getStatusColor,
} from "@/lib/techColors";
import {
  useRealTimeData,
  generateSituationData,
} from "@/hooks/useRealTimeData";

/**
 * 实时网络状态数据
 */
interface NetworkStatus {
  timestamp: string;
  cpuUsage: number;
  memoryUsage: number;
  networkLatency: number;
  throughput: number;
  connections: number;
  threatLevel: number;
  dataRate: number;
  securityScore: number;
}

/**
 * 主要的2D数据面板
 */
export function TechDataPanels() {
  const { data: realTimeData } = useRealTimeData(generateSituationData, {
    interval: 1000,
    enabled: true,
  });

  const [historicalData, setHistoricalData] = useState<NetworkStatus[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 更新历史数据
  useEffect(() => {
    if (realTimeData) {
      const newDataPoint: NetworkStatus = {
        timestamp: new Date().toLocaleTimeString(),
        cpuUsage: realTimeData.cpuUsage || 0,
        memoryUsage: realTimeData.memoryUsage || 0,
        networkLatency: realTimeData.networkLatency || 0,
        throughput: realTimeData.bandwidthUsage || 0,
        connections: realTimeData.activeConnections || 0,
        threatLevel: realTimeData.realTimeThreats || 0,
        dataRate: realTimeData.dataFlowRate || 0,
        securityScore: 100 - (realTimeData.realTimeThreats || 0) * 10,
      };

      setHistoricalData((prev) => {
        const updated = [...prev, newDataPoint].slice(-20); // 保留最近20个数据点
        return updated;
      });
    }
  }, [realTimeData]);

  // 更新当前时间
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="h-full w-full p-4 space-y-4 overflow-y-auto"
      style={{ backgroundColor: TECH_COLORS.ui.background.primary }}
    >
      {/* 顶部状态概览 */}
      <TechStatusOverview
        realTimeData={realTimeData}
        currentTime={currentTime}
      />

      {/* 中间图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <NetworkPerformanceChart data={historicalData} />
        <ThreatAnalysisChart data={historicalData} />
        <SystemMetricsRadar data={realTimeData} />
        <DataFlowVisualization data={historicalData} />
      </div>

      {/* 底部详细数据 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <SecurityMetrics realTimeData={realTimeData} />
        <NetworkTopology />
        <SystemLogs />
      </div>
    </div>
  );
}

/**
 * 顶部状态概览
 */
function TechStatusOverview({
  realTimeData,
  currentTime,
}: {
  realTimeData: any;
  currentTime: Date;
}) {
  const statusMetrics = useMemo(
    () => [
      {
        label: "神经处理器",
        value: realTimeData?.cpuUsage || 0,
        unit: "%",
        icon: <Brain className="w-5 h-5" />,
        status: realTimeData?.cpuUsage > 80 ? "warning" : "online",
        trend: "up",
      },
      {
        label: "量子内存",
        value: realTimeData?.memoryUsage || 0,
        unit: "%",
        icon: <Hexagon className="w-5 h-5" />,
        status: realTimeData?.memoryUsage > 85 ? "critical" : "online",
        trend: "stable",
      },
      {
        label: "网络连接",
        value: Math.floor((realTimeData?.activeConnections || 0) / 1000),
        unit: "K",
        icon: <Network className="w-5 h-5" />,
        status: "online",
        trend: "up",
      },
      {
        label: "威胁等级",
        value: realTimeData?.realTimeThreats || 0,
        unit: "",
        icon: <Shield className="w-5 h-5" />,
        status: realTimeData?.realTimeThreats > 5 ? "critical" : "online",
        trend: realTimeData?.realTimeThreats > 3 ? "up" : "down",
      },
      {
        label: "数据吞吐",
        value: realTimeData?.bandwidthUsage || 0,
        unit: "%",
        icon: <Activity className="w-5 h-5" />,
        status: "processing",
        trend: "up",
      },
      {
        label: "系统延迟",
        value: realTimeData?.networkLatency || 0,
        unit: "ms",
        icon: <Zap className="w-5 h-5" />,
        status: realTimeData?.networkLatency > 100 ? "warning" : "online",
        trend: "down",
      },
    ],
    [realTimeData],
  );

  return (
    <TechCard variant="cyber" glow className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{
              background: TECH_COLORS.gradients.cyber,
              boxShadow: `0 0 20px ${TECH_COLORS.primary.cyber}66`,
            }}
          >
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2
              className="text-2xl font-bold font-mono"
              style={{
                color: TECH_COLORS.ui.text.primary,
                textShadow: `0 0 10px ${TECH_COLORS.primary.cyber}66`,
              }}
            >
              NEURAL CYBER COMMAND CENTER
            </h2>
            <p
              className="text-sm font-mono"
              style={{ color: TECH_COLORS.ui.text.secondary }}
            >
              Advanced Threat Detection & Network Monitoring
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full animate-pulse"
              style={{
                backgroundColor: TECH_COLORS.status.online,
                boxShadow: `0 0 10px ${TECH_COLORS.status.online}`,
              }}
            />
            <span
              className="text-sm font-mono"
              style={{ color: TECH_COLORS.ui.text.secondary }}
            >
              SYSTEM ONLINE
            </span>
          </div>
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
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {statusMetrics.map((metric, index) => (
          <StatusCard
            key={index}
            status={metric.status}
            label={metric.label}
            value={metric.value}
            unit={metric.unit}
            icon={metric.icon}
            trend={metric.trend}
            className="min-h-[100px]"
          />
        ))}
      </div>
    </TechCard>
  );
}

/**
 * 网络性能图表
 */
function NetworkPerformanceChart({ data }: { data: NetworkStatus[] }) {
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="p-3 rounded border backdrop-blur-sm"
          style={{
            backgroundColor: TECH_COLORS.ui.background.overlay,
            borderColor: TECH_COLORS.ui.border.accent,
            color: TECH_COLORS.ui.text.primary,
          }}
        >
          <p className="font-mono text-sm mb-2">{`时间: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p
              key={index}
              className="font-mono text-xs"
              style={{ color: entry.color }}
            >
              {`${entry.name}: ${entry.value}${entry.name.includes("延迟") ? "ms" : "%"}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <TechCard variant="matrix" glow className="p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Activity
          className="w-5 h-5"
          style={{ color: TECH_COLORS.primary.matrix }}
        />
        <h3
          className="text-lg font-bold font-mono"
          style={{ color: TECH_COLORS.ui.text.primary }}
        >
          网络性能监控
        </h3>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={TECH_COLORS.ui.border.primary}
              opacity={0.3}
            />
            <XAxis
              dataKey="timestamp"
              tick={{ fontSize: 10, fill: TECH_COLORS.ui.text.muted }}
              axisLine={{ stroke: TECH_COLORS.ui.border.primary }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: TECH_COLORS.ui.text.muted }}
              axisLine={{ stroke: TECH_COLORS.ui.border.primary }}
            />
            <Tooltip content={customTooltip} />

            <Area
              type="monotone"
              dataKey="cpuUsage"
              stackId="1"
              stroke={TECH_COLORS.primary.neural}
              fill={`${TECH_COLORS.primary.neural}33`}
              name="CPU使用率"
            />
            <Area
              type="monotone"
              dataKey="memoryUsage"
              stackId="1"
              stroke={TECH_COLORS.primary.plasma}
              fill={`${TECH_COLORS.primary.plasma}33`}
              name="内存使用率"
            />
            <Line
              type="monotone"
              dataKey="networkLatency"
              stroke={TECH_COLORS.primary.matrix}
              strokeWidth={2}
              dot={{ fill: TECH_COLORS.primary.matrix, strokeWidth: 2, r: 3 }}
              name="网络延迟"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </TechCard>
  );
}

/**
 * 威胁分析图表
 */
function ThreatAnalysisChart({ data }: { data: NetworkStatus[] }) {
  const threatData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      threatColor: getThreatLevelColor(item.threatLevel),
    }));
  }, [data]);

  return (
    <TechCard variant="plasma" glow className="p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Shield
          className="w-5 h-5"
          style={{ color: TECH_COLORS.primary.plasma }}
        />
        <h3
          className="text-lg font-bold font-mono"
          style={{ color: TECH_COLORS.ui.text.primary }}
        >
          威胁态势分析
        </h3>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={threatData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={TECH_COLORS.ui.border.primary}
              opacity={0.3}
            />
            <XAxis
              dataKey="timestamp"
              tick={{ fontSize: 10, fill: TECH_COLORS.ui.text.muted }}
              axisLine={{ stroke: TECH_COLORS.ui.border.primary }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: TECH_COLORS.ui.text.muted }}
              axisLine={{ stroke: TECH_COLORS.ui.border.primary }}
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
              dataKey="threatLevel"
              stroke={TECH_COLORS.threat.critical}
              fill={`${TECH_COLORS.threat.critical}44`}
              strokeWidth={2}
              name="威胁等级"
            />
            <Area
              type="monotone"
              dataKey="securityScore"
              stroke={TECH_COLORS.threat.safe}
              fill={`${TECH_COLORS.threat.safe}22`}
              strokeWidth={1}
              name="安全评分"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </TechCard>
  );
}

/**
 * 系统指标雷达图
 */
function SystemMetricsRadar({ data }: { data: any }) {
  const radarData = useMemo(
    () => [
      {
        metric: "CPU",
        value: data?.cpuUsage || 0,
        fullMark: 100,
      },
      {
        metric: "内存",
        value: data?.memoryUsage || 0,
        fullMark: 100,
      },
      {
        metric: "网络",
        value: 100 - (data?.networkLatency || 0),
        fullMark: 100,
      },
      {
        metric: "吞吐",
        value: data?.bandwidthUsage || 0,
        fullMark: 100,
      },
      {
        metric: "安全",
        value: 100 - (data?.realTimeThreats || 0) * 10,
        fullMark: 100,
      },
      {
        metric: "稳定",
        value: Math.random() * 30 + 70, // 模拟稳定性指标
        fullMark: 100,
      },
    ],
    [data],
  );

  return (
    <TechCard variant="quantum" glow className="p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Hexagon
          className="w-5 h-5"
          style={{ color: TECH_COLORS.primary.quantum }}
        />
        <h3
          className="text-lg font-bold font-mono"
          style={{ color: TECH_COLORS.ui.text.primary }}
        >
          系统性能雷达
        </h3>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke={TECH_COLORS.ui.border.primary} opacity={0.3} />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fontSize: 12, fill: TECH_COLORS.ui.text.secondary }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: TECH_COLORS.ui.text.muted }}
            />
            <Radar
              name="系统指标"
              dataKey="value"
              stroke={TECH_COLORS.primary.quantum}
              fill={`${TECH_COLORS.primary.quantum}33`}
              strokeWidth={2}
              dot={{ fill: TECH_COLORS.primary.quantum, strokeWidth: 2, r: 4 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </TechCard>
  );
}

/**
 * 数据流可视化
 */
function DataFlowVisualization({ data }: { data: NetworkStatus[] }) {
  const flowData = useMemo(() => {
    return data.slice(-10).map((item, index) => ({
      time: index,
      incoming: item.dataRate,
      outgoing: item.throughput,
      processing: item.connections / 100,
    }));
  }, [data]);

  return (
    <TechCard variant="neural" glow className="p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Database
          className="w-5 h-5"
          style={{ color: TECH_COLORS.primary.neural }}
        />
        <h3
          className="text-lg font-bold font-mono"
          style={{ color: TECH_COLORS.ui.text.primary }}
        >
          数据流监控
        </h3>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={flowData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={TECH_COLORS.ui.border.primary}
              opacity={0.3}
            />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: TECH_COLORS.ui.text.muted }}
              axisLine={{ stroke: TECH_COLORS.ui.border.primary }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: TECH_COLORS.ui.text.muted }}
              axisLine={{ stroke: TECH_COLORS.ui.border.primary }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: TECH_COLORS.ui.background.overlay,
                border: `1px solid ${TECH_COLORS.ui.border.accent}`,
                borderRadius: "8px",
                color: TECH_COLORS.ui.text.primary,
              }}
            />

            <Bar
              dataKey="incoming"
              fill={TECH_COLORS.primary.matrix}
              name="流入数据"
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="outgoing"
              fill={TECH_COLORS.primary.neural}
              name="流出数据"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </TechCard>
  );
}

/**
 * 安全指标
 */
function SecurityMetrics({ realTimeData }: { realTimeData: any }) {
  const securityData = useMemo(
    () => [
      {
        name: "防火墙",
        value: 95,
        color: TECH_COLORS.threat.safe,
      },
      {
        name: "入侵检测",
        value: 88,
        color: TECH_COLORS.threat.low,
      },
      {
        name: "病毒防护",
        value: 92,
        color: TECH_COLORS.threat.safe,
      },
      {
        name: "数据加密",
        value: 97,
        color: TECH_COLORS.threat.safe,
      },
    ],
    [],
  );

  return (
    <TechCard variant="cyber" glow className="p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Lock
          className="w-5 h-5"
          style={{ color: TECH_COLORS.primary.cyber }}
        />
        <h3
          className="text-lg font-bold font-mono"
          style={{ color: TECH_COLORS.ui.text.primary }}
        >
          安全防护状态
        </h3>
      </div>

      <div className="space-y-3">
        {securityData.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span
                className="text-sm font-mono"
                style={{ color: TECH_COLORS.ui.text.secondary }}
              >
                {item.name}
              </span>
              <span
                className="text-sm font-bold font-mono"
                style={{ color: item.color }}
              >
                {item.value}%
              </span>
            </div>
            <div
              className="w-full h-2 rounded-full"
              style={{ backgroundColor: TECH_COLORS.ui.background.panel }}
            >
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${item.value}%`,
                  backgroundColor: item.color,
                  boxShadow: `0 0 10px ${item.color}66`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </TechCard>
  );
}

/**
 * 网络拓扑
 */
function NetworkTopology() {
  return (
    <TechCard variant="matrix" glow className="p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Network
          className="w-5 h-5"
          style={{ color: TECH_COLORS.primary.matrix }}
        />
        <h3
          className="text-lg font-bold font-mono"
          style={{ color: TECH_COLORS.ui.text.primary }}
        >
          网络拓扑
        </h3>
      </div>

      <div className="space-y-3">
        {[
          { node: "核心路由器", status: "online", connections: 12 },
          { node: "分布交换机", status: "online", connections: 8 },
          { node: "接��节点", status: "warning", connections: 24 },
          { node: "边缘设备", status: "online", connections: 6 },
          { node: "安全网关", status: "online", connections: 4 },
        ].map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 rounded"
            style={{ backgroundColor: TECH_COLORS.ui.background.panel }}
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: getStatusColor(item.status),
                  boxShadow: `0 0 8px ${getStatusColor(item.status)}`,
                }}
              />
              <span
                className="text-sm font-mono"
                style={{ color: TECH_COLORS.ui.text.secondary }}
              >
                {item.node}
              </span>
            </div>
            <span
              className="text-xs font-mono"
              style={{ color: TECH_COLORS.ui.text.muted }}
            >
              {item.connections} 连接
            </span>
          </div>
        ))}
      </div>
    </TechCard>
  );
}

/**
 * 系统日志
 */
function SystemLogs() {
  const [logs, setLogs] = useState([
    { time: "14:23:45", level: "INFO", message: "神经网络初始化完成" },
    { time: "14:23:46", level: "INFO", message: "量子加密通道建立" },
    { time: "14:23:47", level: "WARN", message: "检测到异常数据包" },
    { time: "14:23:48", level: "INFO", message: "威胁已自动隔离" },
    { time: "14:23:49", level: "ERROR", message: "边缘节点连接异常" },
    { time: "14:23:50", level: "INFO", message: "系统自愈完成" },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      const newLog = {
        time: new Date().toLocaleTimeString(),
        level: ["INFO", "WARN", "ERROR"][Math.floor(Math.random() * 3)],
        message: [
          "数据流量检测正常",
          "威胁扫描完成",
          "连接状态更新",
          "安全策略生效",
          "性能优化执行",
        ][Math.floor(Math.random() * 5)],
      };

      setLogs((prev) => [...prev.slice(-5), newLog]);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "ERROR":
        return TECH_COLORS.threat.critical;
      case "WARN":
        return TECH_COLORS.threat.medium;
      default:
        return TECH_COLORS.threat.safe;
    }
  };

  return (
    <TechCard variant="plasma" glow className="p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Eye
          className="w-5 h-5"
          style={{ color: TECH_COLORS.primary.plasma }}
        />
        <h3
          className="text-lg font-bold font-mono"
          style={{ color: TECH_COLORS.ui.text.primary }}
        >
          系统日志
        </h3>
      </div>

      <div
        className="h-48 overflow-y-auto space-y-1 p-2 rounded"
        style={{
          backgroundColor: TECH_COLORS.ui.background.primary,
          border: `1px solid ${TECH_COLORS.ui.border.primary}`,
        }}
      >
        {logs.map((log, index) => (
          <div
            key={index}
            className="flex items-start space-x-2 text-xs font-mono"
          >
            <span style={{ color: TECH_COLORS.ui.text.muted }}>
              [{log.time}]
            </span>
            <span style={{ color: getLevelColor(log.level) }}>
              {log.level}:
            </span>
            <span style={{ color: TECH_COLORS.ui.text.secondary }}>
              {log.message}
            </span>
          </div>
        ))}
      </div>
    </TechCard>
  );
}

export default TechDataPanels;
