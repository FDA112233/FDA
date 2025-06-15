import React from "react";
import {
  Shield,
  Activity,
  BarChart3,
  Users,
  Server,
  Globe,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowRight,
} from "lucide-react";
import {
  BusinessCard,
  StatusCard,
  InfoCard,
} from "@/components/ui/BusinessCard";
import { BUSINESS_COLORS } from "@/lib/businessColors";
import { BACKEND_COLORS } from "@/lib/backendTheme";

export default function Overview() {
  const features = [
    {
      title: "实时威胁监控",
      description: "24/7全天候网络安全监控，实时发现和响应各类网络威胁",
      icon: Shield,
      color: BUSINESS_COLORS.primary.blue,
    },
    {
      title: "智能分析报告",
      description: "基于AI的威胁分析和风险评估，提供详细的安全报告",
      icon: BarChart3,
      color: BUSINESS_COLORS.status.success,
    },
    {
      title: "资产管理",
      description: "全面的网络资产发现、分类和安全状态管理",
      icon: Server,
      color: BUSINESS_COLORS.status.warning,
    },
    {
      title: "用户权限管理",
      description: "基于角色的访问控制，确保系统安全和合规性",
      icon: Users,
      color: BUSINESS_COLORS.primary.navy,
    },
    {
      title: "威胁情报",
      description: "整合全球威胁情报，提供最新的安全态势信息",
      icon: Globe,
      color: BUSINESS_COLORS.status.info,
    },
    {
      title: "系统监控",
      description: "全面的系统性能监控和日志审计功能",
      icon: Activity,
      color: BUSINESS_COLORS.threat.medium,
    },
  ];

  const quickStats = [
    {
      title: "系统运行时间",
      value: "99.9%",
      icon: Clock,
      status: "success" as const,
    },
    {
      title: "今日阻止攻击",
      value: "1,247",
      icon: Shield,
      status: "success" as const,
    },
    {
      title: "活跃告警",
      value: "23",
      icon: AlertTriangle,
      status: "warning" as const,
    },
    {
      title: "受保护资产",
      value: "342",
      icon: Server,
      status: "info" as const,
    },
  ];

  return (
    <div
      className="p-8 pt-16 lg:pt-8 min-h-screen"
      style={{ backgroundColor: BUSINESS_COLORS.ui.background.secondary }}
    >
      {/* 页面标题 */}
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center mb-6">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{
              backgroundColor: BUSINESS_COLORS.primary.blue,
              boxShadow: BUSINESS_COLORS.shadows.xl,
            }}
          >
            <Shield
              className="w-10 h-10"
              style={{
                color: `rgb(var(--brand-lightest))`,
                filter: `drop-shadow(0 0 12px rgba(var(--brand-accent), 0.7))`,
              }}
            />
          </div>
        </div>
        <h1
          className="text-4xl font-bold mb-4"
          style={{ color: BUSINESS_COLORS.ui.text.inverse }}
        >
          CyberGuard 网络安全管理平台
        </h1>
        <p
          className="text-xl mb-2"
          style={{ color: BUSINESS_COLORS.neutral.silver }}
        >
          企业级网络安全管理平台 - 专业版
        </p>
        <p
          className="text-lg max-w-2xl mx-auto"
          style={{ color: BUSINESS_COLORS.ui.text.muted }}
        >
          为企业提供全方位的网络安全防护，实时监控威胁、智能分析风险、快速响应事件
        </p>
      </div>

      {/* 快速统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <StatusCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={<Icon className="w-5 h-5" />}
              status={stat.status}
            />
          );
        })}
      </div>

      {/* 核心功能 */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: BUSINESS_COLORS.ui.text.inverse }}
          >
            核心安全功能
          </h2>
          <p style={{ color: BUSINESS_COLORS.ui.text.muted }}>
            全面的网络安全解决方案，保护您的数字资产
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <BusinessCard
                key={index}
                hoverable
                className="group cursor-pointer h-full"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
                      style={{
                        backgroundColor: `${feature.color}20`,
                        color: feature.color,
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3
                        className="text-xl font-bold"
                        style={{ color: BUSINESS_COLORS.ui.text.primary }}
                      >
                        {feature.title}
                      </h3>
                    </div>
                  </div>
                  <p
                    className="text-sm flex-1"
                    style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                  >
                    {feature.description}
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center text-sm text-blue-600 group-hover:text-blue-700">
                      <span>了解更多</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </div>
              </BusinessCard>
            );
          })}
        </div>
      </div>

      {/* 系统���势 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <InfoCard
          title="为什么选择 CyberGuard？"
          description="专业的网络安全管理平台，为企业提供全方位保护"
        >
          <div className="space-y-4">
            {[
              "企业级安全架构，支持大规模部署",
              "AI驱动的威胁检测和智能分析",
              "符合国际安全标准和合规要求",
              "7x24小时专业技术支持服务",
              "灵活的API接口，支持第三方集成",
              "直观的可视化界面，操作简单高效",
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle
                  className="w-5 h-5 flex-shrink-0"
                  style={{ color: BUSINESS_COLORS.status.success }}
                />
                <span
                  className="text-sm"
                  style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </InfoCard>

        <InfoCard title="技术规格" description="了解平台的技术特性和性能指标">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4
                className="font-medium mb-2"
                style={{ color: BUSINESS_COLORS.ui.text.primary }}
              >
                性能指标
              </h4>
              <ul
                className="text-sm space-y-1"
                style={{ color: BUSINESS_COLORS.ui.text.secondary }}
              >
                <li>• 支持10万+并发设备</li>
                <li>• 毫秒级威胁响应</li>
                <li>• 99.9%系统可用性</li>
                <li>• PB级数据处理能力</li>
              </ul>
            </div>
            <div>
              <h4
                className="font-medium mb-2"
                style={{ color: BUSINESS_COLORS.ui.text.primary }}
              >
                安全特性
              </h4>
              <ul
                className="text-sm space-y-1"
                style={{ color: BUSINESS_COLORS.ui.text.secondary }}
              >
                <li>• 零信任安全架构</li>
                <li>• 端到端数据加密</li>
                <li>• 多因子身份认证</li>
                <li>• 完整审计日志</li>
              </ul>
            </div>
          </div>
        </InfoCard>
      </div>

      {/* 联系信息 */}
      <BusinessCard className="text-center">
        <div>
          <h3
            className="text-2xl font-bold mb-4"
            style={{ color: BUSINESS_COLORS.ui.text.primary }}
          >
            开始使用 CyberGuard
          </h3>
          <p
            className="text-lg mb-6"
            style={{ color: BUSINESS_COLORS.ui.text.secondary }}
          >
            立即部署企业级网络安全解决方案，保护您的数字资产
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-8 py-3 rounded-lg font-medium transition-all duration-200"
              style={{
                backgroundColor: BUSINESS_COLORS.primary.blue,
                color: `rgb(var(--brand-lightest))`,
                textShadow: `0 0 8px rgba(var(--brand-lightest), 0.5)`,
                boxShadow: BUSINESS_COLORS.shadows.md,
              }}
            >
              联系销售团队
            </button>
            <button
              className="px-8 py-3 rounded-lg font-medium transition-all duration-200"
              style={{
                backgroundColor: "transparent",
                color: BUSINESS_COLORS.primary.blue,
                border: `2px solid ${BUSINESS_COLORS.primary.blue}`,
              }}
            >
              申请试用
            </button>
          </div>
        </div>
      </BusinessCard>
    </div>
  );
}
