import {
  Shield,
  Activity,
  AlertTriangle,
  TrendingUp,
  Users,
  Server,
  Globe,
  Lock,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
} from "lucide-react";
import {
  BusinessCard,
  StatusCard,
  InfoCard,
} from "@/components/ui/BusinessCard";
import { BUSINESS_COLORS } from "@/lib/businessColors";

export default function Index() {
  // 模拟实时数据
  const securityMetrics = {
    totalThreats: 1247,
    blockedAttacks: 856,
    activeAlerts: 23,
    systemUptime: 99.8,
    protectedAssets: 342,
    responseTime: 1.2,
  };

  const recentAlerts = [
    {
      id: 1,
      title: "可疑登录尝试",
      severity: "high",
      time: "2分钟前",
      source: "192.168.1.100",
    },
    {
      id: 2,
      title: "恶意软件检测",
      severity: "critical",
      time: "5分钟前",
      source: "工作站-205",
    },
    {
      id: 3,
      title: "异常网络流量",
      severity: "medium",
      time: "8分钟前",
      source: "服务器集群-A",
    },
  ];

  return (
    <div
      className="min-h-screen p-8 pt-16 lg:pt-8"
      style={{ backgroundColor: BUSINESS_COLORS.ui.background.secondary }}
    >
      {/* 页面标题 */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: BUSINESS_COLORS.primary.blue,
              boxShadow: BUSINESS_COLORS.shadows.lg,
            }}
          >
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1
              className="text-3xl font-bold"
              style={{ color: BUSINESS_COLORS.ui.text.inverse }}
            >
              安全监控仪表板
            </h1>
            <p style={{ color: BUSINESS_COLORS.neutral.silver }}>
              实时监控网络威胁，保护您的数字资产安全
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* 核心安全指标 */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            <StatusCard
              title="总威胁数"
              value={securityMetrics.totalThreats.toLocaleString()}
              icon={<AlertTriangle className="w-5 h-5" />}
              status="info"
              trend={{ value: 12, label: "较昨日", isPositive: false }}
            />

            <StatusCard
              title="已阻止攻击"
              value={securityMetrics.blockedAttacks.toLocaleString()}
              icon={<Shield className="w-5 h-5" />}
              status="success"
              trend={{ value: 8, label: "较昨日", isPositive: true }}
            />

            <StatusCard
              title="活跃告警"
              value={securityMetrics.activeAlerts}
              icon={<Activity className="w-5 h-5" />}
              status="warning"
              trend={{ value: 5, label: "较昨日", isPositive: false }}
            />

            <StatusCard
              title="系统运行时间"
              value={`${securityMetrics.systemUptime}%`}
              icon={<TrendingUp className="w-5 h-5" />}
              status="success"
              subtitle="过去30天"
            />

            <StatusCard
              title="受保护资产"
              value={securityMetrics.protectedAssets}
              icon={<Server className="w-5 h-5" />}
              status="info"
              subtitle="设备和系统"
            />

            <StatusCard
              title="平均响应时间"
              value={`${securityMetrics.responseTime}s`}
              icon={<Clock className="w-5 h-5" />}
              status="success"
              subtitle="威胁响应"
            />
          </div>
        </section>

        {/* 主要内容区域 */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 威胁趋势图表 */}
          <div className="lg:col-span-2">
            <InfoCard
              title="威胁趋势分析"
              description="过去7天的安全威胁趋势变化"
              headerActions={
                <button
                  className="flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors"
                  style={{
                    backgroundColor: BUSINESS_COLORS.ui.background.secondary,
                    color: BUSINESS_COLORS.ui.text.secondary,
                  }}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-sm">查看详情</span>
                </button>
              }
            >
              <div
                className="h-64 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: BUSINESS_COLORS.ui.background.secondary,
                }}
              >
                <div className="text-center">
                  <BarChart3
                    className="w-12 h-12 mx-auto mb-4"
                    style={{ color: BUSINESS_COLORS.ui.text.muted }}
                  />
                  <p style={{ color: BUSINESS_COLORS.ui.text.secondary }}>
                    威胁趋势图表将在此显示
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
          </div>

          {/* 最新告警 */}
          <div>
            <InfoCard
              title="最新安全告警"
              description="需要立即关注的安全事件"
              headerActions={
                <div className="flex items-center space-x-2">
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: BUSINESS_COLORS.status.success }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: BUSINESS_COLORS.status.success }}
                  >
                    实时监控
                  </span>
                </div>
              }
            >
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start space-x-3 p-3 rounded-lg border"
                    style={{
                      backgroundColor: BUSINESS_COLORS.ui.background.card,
                      borderColor: BUSINESS_COLORS.ui.border.primary,
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                      style={{
                        backgroundColor:
                          alert.severity === "critical"
                            ? BUSINESS_COLORS.threat.critical
                            : alert.severity === "high"
                              ? BUSINESS_COLORS.threat.high
                              : BUSINESS_COLORS.threat.medium,
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-medium text-sm"
                        style={{ color: BUSINESS_COLORS.ui.text.primary }}
                      >
                        {alert.title}
                      </p>
                      <p
                        className="text-xs mt-1"
                        style={{ color: BUSINESS_COLORS.ui.text.muted }}
                      >
                        来源: {alert.source} • {alert.time}
                      </p>
                    </div>
                  </div>
                ))}

                <button
                  className="w-full py-2 text-sm rounded-lg transition-colors"
                  style={{
                    backgroundColor: BUSINESS_COLORS.ui.background.secondary,
                    color: BUSINESS_COLORS.primary.blue,
                  }}
                >
                  查看全��告警
                </button>
              </div>
            </InfoCard>
          </div>
        </section>

        {/* 系统状态概览 */}
        <section>
          <InfoCard
            title="系统状态概览"
            description="各个安全模块的实时运行状态"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center space-x-3">
                <CheckCircle
                  className="w-6 h-6"
                  style={{ color: BUSINESS_COLORS.status.success }}
                />
                <div>
                  <p
                    className="font-medium"
                    style={{ color: BUSINESS_COLORS.ui.text.primary }}
                  >
                    防火墙
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: BUSINESS_COLORS.status.success }}
                  >
                    正常运行
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <CheckCircle
                  className="w-6 h-6"
                  style={{ color: BUSINESS_COLORS.status.success }}
                />
                <div>
                  <p
                    className="font-medium"
                    style={{ color: BUSINESS_COLORS.ui.text.primary }}
                  >
                    入侵检测
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: BUSINESS_COLORS.status.success }}
                  >
                    正常运行
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <AlertTriangle
                  className="w-6 h-6"
                  style={{ color: BUSINESS_COLORS.status.warning }}
                />
                <div>
                  <p
                    className="font-medium"
                    style={{ color: BUSINESS_COLORS.ui.text.primary }}
                  >
                    恶意软件扫描
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: BUSINESS_COLORS.status.warning }}
                  >
                    更新中
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <CheckCircle
                  className="w-6 h-6"
                  style={{ color: BUSINESS_COLORS.status.success }}
                />
                <div>
                  <p
                    className="font-medium"
                    style={{ color: BUSINESS_COLORS.ui.text.primary }}
                  >
                    数据备份
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: BUSINESS_COLORS.status.success }}
                  >
                    正常运行
                  </p>
                </div>
              </div>
            </div>
          </InfoCard>
        </section>
      </div>

      {/* 背景动画效果 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* 矩阵雨效果 */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-neon-green/30 to-transparent animate-matrix-rain"
            style={{
              left: `${Math.random() * 100}%`,
              height: "100px",
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}

        {/* 扫描线 */}
        <div
          className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-blue/50 to-transparent animate-scan-line"
          style={{ animationDuration: "8s" }}
        />
      </div>
    </div>
  );
}
