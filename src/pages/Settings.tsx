import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  Shield,
  Wifi,
  Bell,
  Users,
  Database,
  Monitor,
  Lock,
  Save,
  RefreshCw,
  Globe,
  Smartphone,
  Mail,
  Clock,
  HardDrive,
  Cpu,
  Activity,
  Key,
  UserCheck,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import {
  BusinessCard,
  InfoCard,
  AlertCard,
} from "@/components/ui/BusinessCard";
import { BUSINESS_COLORS } from "@/lib/businessColors";

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: any;
  badge?: string;
  isNew?: boolean;
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState("security");
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 设置分类
  const settingSections: SettingsSection[] = [
    {
      id: "security",
      title: "安全配置",
      description: "防火墙、入侵检测和访问控制",
      icon: Shield,
      badge: "重要",
    },
    {
      id: "network",
      title: "网络设置",
      description: "网络监控和流量管理",
      icon: Wifi,
    },
    {
      id: "alerts",
      title: "告警配置",
      description: "通知渠道和告警规则",
      icon: Bell,
    },
    {
      id: "users",
      title: "用户管理",
      description: "账户、角色和权限管理",
      icon: Users,
    },
    {
      id: "monitoring",
      title: "监控设置",
      description: "性能监控和日志配置",
      icon: Monitor,
    },
    {
      id: "database",
      title: "数据库管理",
      description: "数据存储和备份配置",
      icon: Database,
    },
    {
      id: "system",
      title: "系统配置",
      description: "系统参数和性能优化",
      icon: SettingsIcon,
      isNew: true,
    },
  ];

  // 保存设置
  const handleSave = async () => {
    setIsSaving(true);
    // 模拟保存
    setTimeout(() => {
      setIsSaving(false);
      setIsDirty(false);
    }, 2000);
  };

  // 渲染设置内容
  const renderSectionContent = () => {
    switch (activeSection) {
      case "security":
        return renderSecuritySettings();
      case "network":
        return renderNetworkSettings();
      case "alerts":
        return renderAlertSettings();
      case "users":
        return renderUserSettings();
      case "monitoring":
        return renderMonitoringSettings();
      case "database":
        return renderDatabaseSettings();
      case "system":
        return renderSystemSettings();
      default:
        return null;
    }
  };

  // 安全设置
  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <InfoCard title="防火墙配置" description="网络边界防护和访问控制规则">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="font-medium"
                  style={{ color: BUSINESS_COLORS.ui.text.primary }}
                >
                  防火墙状态
                </p>
                <p
                  className="text-sm"
                  style={{ color: BUSINESS_COLORS.ui.text.muted }}
                >
                  主防火墙运行状态
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: BUSINESS_COLORS.status.success }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: BUSINESS_COLORS.status.success }}
                >
                  运行中
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p
                  className="font-medium"
                  style={{ color: BUSINESS_COLORS.ui.text.primary }}
                >
                  入侵检测
                </p>
                <p
                  className="text-sm"
                  style={{ color: BUSINESS_COLORS.ui.text.muted }}
                >
                  实时入侵检测系统
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div
                  className="w-11 h-6 rounded-full peer transition-colors peer-checked:bg-blue-600"
                  style={{
                    backgroundColor: BUSINESS_COLORS.ui.background.tertiary,
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full shadow transform transition-all duration-200 peer-checked:translate-x-5 translate-x-0.5 mt-0.5"
                    style={{
                      background: `linear-gradient(135deg,
                           rgb(var(--brand-lightest)) 0%,
                           rgb(var(--brand-light)) 100%)`,
                      boxShadow: `0 2px 8px rgba(var(--brand-primary), 0.3)`,
                    }}
                  />
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p
                  className="font-medium"
                  style={{ color: BUSINESS_COLORS.ui.text.primary }}
                >
                  二次验证
                </p>
                <p
                  className="text-sm"
                  style={{ color: BUSINESS_COLORS.ui.text.muted }}
                >
                  强制双因子认证
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div
                  className="w-11 h-6 rounded-full peer transition-colors peer-checked:bg-blue-600"
                  style={{
                    backgroundColor: BUSINESS_COLORS.ui.background.tertiary,
                  }}
                >
                  rounded-full shadow transform transition-all duration-200
                  peer-checked:translate-x-5 translate-x-0.5 mt-0.5" style=
                  {{
                    background: `linear-gradient(135deg, rgb(var(--brand-lightest)) 0%, rgb(var(--brand-light)) 100%)`,
                    boxShadow: `0 2px 8px rgba(var(--brand-primary), 0.3)`,
                  }}
                  <div className="w-5 h-5 bg-white rounded-full shadow transform transition-transform peer-checked:translate-x-5 translate-x-0.5 mt-0.5" />
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: BUSINESS_COLORS.ui.text.primary }}
              >
                IP白名单
              </label>
              <textarea
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: BUSINESS_COLORS.ui.border.primary,
                  backgroundColor: BUSINESS_COLORS.ui.background.card,
                  color: BUSINESS_COLORS.ui.text.primary,
                }}
                rows={4}
                placeholder="每行输入一个IP地址或CIDR"
                defaultValue="192.168.1.0/24&#10;10.0.0.0/8"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: BUSINESS_COLORS.ui.text.primary }}
              >
                会话超时 (分钟)
              </label>
              <input
                type="number"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: BUSINESS_COLORS.ui.border.primary,
                  backgroundColor: BUSINESS_COLORS.ui.background.card,
                  color: BUSINESS_COLORS.ui.text.primary,
                }}
                defaultValue={30}
                min={5}
                max={120}
              />
            </div>
          </div>
        </div>
      </InfoCard>

      <AlertCard
        type="warning"
        title="安全建议"
        message="建议启用所有安全功能以提高系统防护能力。更改安全设置可能影响系统访问，请谨慎操作。"
      />
    </div>
  );

  // 网络设置
  const renderNetworkSettings = () => (
    <div className="space-y-6">
      <InfoCard
        title="网络监控配置"
        description="流量监控、带宽管理和网络性能优化"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="font-medium"
                  style={{ color: BUSINESS_COLORS.ui.text.primary }}
                >
                  流量监控
                </p>
                <p
                  className="text-sm"
                  style={{ color: BUSINESS_COLORS.ui.text.muted }}
                >
                  实时网络流量分析
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div
                  className="w-11 h-6 rounded-full peer transition-colors peer-checked:bg-blue-600"
                  style={{
                    backgroundColor: BUSINESS_COLORS.ui.background.tertiary,
                  }}
                >
                  <div className="w-5 h-5 bg-white rounded-full shadow transform transition-transform peer-checked:translate-x-5 translate-x-0.5 mt-0.5" />
                </div>
              </label>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: BUSINESS_COLORS.ui.text.primary }}
              >
                带宽限制 (Mbps)
              </label>
              <input
                type="number"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: BUSINESS_COLORS.ui.border.primary,
                  backgroundColor: BUSINESS_COLORS.ui.background.card,
                  color: BUSINESS_COLORS.ui.text.primary,
                }}
                defaultValue={1000}
                min={1}
                max={10000}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: BUSINESS_COLORS.ui.text.primary }}
              >
                DNS服务器
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: BUSINESS_COLORS.ui.border.primary,
                  backgroundColor: BUSINESS_COLORS.ui.background.card,
                  color: BUSINESS_COLORS.ui.text.primary,
                }}
                defaultValue="8.8.8.8, 8.8.4.4"
                placeholder="主DNS, 备用DNS"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: BUSINESS_COLORS.ui.text.primary }}
              >
                代理服务器
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: BUSINESS_COLORS.ui.border.primary,
                  backgroundColor: BUSINESS_COLORS.ui.background.card,
                  color: BUSINESS_COLORS.ui.text.primary,
                }}
                placeholder="proxy.company.com:8080"
              />
            </div>
          </div>
        </div>
      </InfoCard>
    </div>
  );

  // 告警设置
  const renderAlertSettings = () => (
    <div className="space-y-6">
      <InfoCard
        title="告警通知配置"
        description="设置告警规则、通知渠道和响应策略"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail
                  className="w-5 h-5"
                  style={{ color: BUSINESS_COLORS.primary.blue }}
                />
                <p
                  className="font-medium"
                  style={{ color: BUSINESS_COLORS.ui.text.primary }}
                >
                  邮件通知
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div
                  className="w-11 h-6 rounded-full peer transition-colors peer-checked:bg-blue-600"
                  style={{
                    backgroundColor: BUSINESS_COLORS.ui.background.tertiary,
                  }}
                >
                  <div className="w-5 h-5 bg-white rounded-full shadow transform transition-transform peer-checked:translate-x-5 translate-x-0.5 mt-0.5" />
                </div>
              </label>
              <input
                type="email"
                className="w-full p-2 text-sm border rounded"
                style={{
                  borderColor: BUSINESS_COLORS.ui.border.primary,
                  backgroundColor: BUSINESS_COLORS.ui.background.card,
                }}
                placeholder="admin@company.com"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Smartphone
                  className="w-5 h-5"
                  style={{ color: BUSINESS_COLORS.primary.blue }}
                />
                <p
                  className="font-medium"
                  style={{ color: BUSINESS_COLORS.ui.text.primary }}
                >
                  短信通知
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div
                  className="w-11 h-6 rounded-full peer transition-colors peer-checked:bg-blue-600"
                  style={{
                    backgroundColor: BUSINESS_COLORS.ui.background.tertiary,
                  }}
                >
                  <div className="w-5 h-5 bg-white rounded-full shadow transform transition-transform peer-checked:translate-x-5 translate-x-0.5 mt-0.5" />
                </div>
              </label>
              <input
                type="tel"
                className="w-full p-2 text-sm border rounded"
                style={{
                  borderColor: BUSINESS_COLORS.ui.border.primary,
                  backgroundColor: BUSINESS_COLORS.ui.background.card,
                }}
                placeholder="+86 138xxxx8888"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Globe
                  className="w-5 h-5"
                  style={{ color: BUSINESS_COLORS.primary.blue }}
                />
                <p
                  className="font-medium"
                  style={{ color: BUSINESS_COLORS.ui.text.primary }}
                >
                  Webhook
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div
                  className="w-11 h-6 rounded-full peer transition-colors peer-checked:bg-blue-600"
                  style={{
                    backgroundColor: BUSINESS_COLORS.ui.background.tertiary,
                  }}
                >
                  <div className="w-5 h-5 bg-white rounded-full shadow transform transition-transform peer-checked:translate-x-5 translate-x-0.5 mt-0.5" />
                </div>
              </label>
              <input
                type="url"
                className="w-full p-2 text-sm border rounded"
                style={{
                  borderColor: BUSINESS_COLORS.ui.border.primary,
                  backgroundColor: BUSINESS_COLORS.ui.background.card,
                }}
                placeholder="https://hooks.slack.com/..."
              />
            </div>
          </div>
        </div>
      </InfoCard>
    </div>
  );

  // 用户设置
  const renderUserSettings = () => (
    <div className="space-y-6">
      <InfoCard
        title="用户账户管理"
        description="管理用户账户、角色权限和访问控制"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p
                className="font-medium"
                style={{ color: BUSINESS_COLORS.ui.text.primary }}
              >
                用户自注册
              </p>
              <p
                className="text-sm"
                style={{ color: BUSINESS_COLORS.ui.text.muted }}
              >
                允许新用户自行注册账户
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div
                className="w-11 h-6 rounded-full peer transition-colors peer-checked:bg-blue-600"
                style={{
                  backgroundColor: BUSINESS_COLORS.ui.background.tertiary,
                }}
              >
                <div className="w-5 h-5 bg-white rounded-full shadow transform transition-transform peer-checked:translate-x-5 translate-x-0.5 mt-0.5" />
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: BUSINESS_COLORS.ui.text.primary }}
              >
                默认用户角色
              </label>
              <select
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: BUSINESS_COLORS.ui.border.primary,
                  backgroundColor: BUSINESS_COLORS.ui.background.card,
                  color: BUSINESS_COLORS.ui.text.primary,
                }}
              >
                <option value="viewer">查看者</option>
                <option value="operator">操作员</option>
                <option value="analyst">分析师</option>
                <option value="admin">管理员</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: BUSINESS_COLORS.ui.text.primary }}
              >
                密码策略
              </label>
              <select
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: BUSINESS_COLORS.ui.border.primary,
                  backgroundColor: BUSINESS_COLORS.ui.background.card,
                  color: BUSINESS_COLORS.ui.text.primary,
                }}
              >
                <option value="basic">基础 (8位)</option>
                <option value="standard">标准 (12位+特殊字符)</option>
                <option value="strict">严格 (16位+复杂要求)</option>
              </select>
            </div>
          </div>
        </div>
      </InfoCard>
    </div>
  );

  // 监控设置
  const renderMonitoringSettings = () => (
    <div className="space-y-6">
      <InfoCard
        title="系统监控配置"
        description="性能监控、日志记录和数据保留策略"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: BUSINESS_COLORS.ui.text.primary }}
              >
                监控间隔 (秒)
              </label>
              <input
                type="number"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: BUSINESS_COLORS.ui.border.primary,
                  backgroundColor: BUSINESS_COLORS.ui.background.card,
                  color: BUSINESS_COLORS.ui.text.primary,
                }}
                defaultValue={30}
                min={10}
                max={300}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: BUSINESS_COLORS.ui.text.primary }}
              >
                日志保留天数
              </label>
              <input
                type="number"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: BUSINESS_COLORS.ui.border.primary,
                  backgroundColor: BUSINESS_COLORS.ui.background.card,
                  color: BUSINESS_COLORS.ui.text.primary,
                }}
                defaultValue={90}
                min={7}
                max={365}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="font-medium"
                  style={{ color: BUSINESS_COLORS.ui.text.primary }}
                >
                  性能监控
                </p>
                <p
                  className="text-sm"
                  style={{ color: BUSINESS_COLORS.ui.text.muted }}
                >
                  监控CPU、内存、磁盘使用率
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div
                  className="w-11 h-6 rounded-full peer transition-colors peer-checked:bg-blue-600"
                  style={{
                    backgroundColor: BUSINESS_COLORS.ui.background.tertiary,
                  }}
                >
                  <div className="w-5 h-5 bg-white rounded-full shadow transform transition-transform peer-checked:translate-x-5 translate-x-0.5 mt-0.5" />
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p
                  className="font-medium"
                  style={{ color: BUSINESS_COLORS.ui.text.primary }}
                >
                  详细日志
                </p>
                <p
                  className="text-sm"
                  style={{ color: BUSINESS_COLORS.ui.text.muted }}
                >
                  记录详细的系统操作日志
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div
                  className="w-11 h-6 rounded-full peer transition-colors peer-checked:bg-blue-600"
                  style={{
                    backgroundColor: BUSINESS_COLORS.ui.background.tertiary,
                  }}
                >
                  <div className="w-5 h-5 bg-white rounded-full shadow transform transition-transform peer-checked:translate-x-5 translate-x-0.5 mt-0.5" />
                </div>
              </label>
            </div>
          </div>
        </div>
      </InfoCard>
    </div>
  );

  // 数据库设置
  const renderDatabaseSettings = () => (
    <div className="space-y-6">
      <InfoCard
        title="数据库管理"
        description="数据存储、备份策略和性能优化配置"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: BUSINESS_COLORS.ui.text.primary }}
              >
                自动备份间隔
              </label>
              <select
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: BUSINESS_COLORS.ui.border.primary,
                  backgroundColor: BUSINESS_COLORS.ui.background.card,
                  color: BUSINESS_COLORS.ui.text.primary,
                }}
              >
                <option value="6h">每6小时</option>
                <option value="12h">每12小时</option>
                <option value="24h">每24小时</option>
                <option value="weekly">每周</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: BUSINESS_COLORS.ui.text.primary }}
              >
                备份保留天数
              </label>
              <input
                type="number"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: BUSINESS_COLORS.ui.border.primary,
                  backgroundColor: BUSINESS_COLORS.ui.background.card,
                  color: BUSINESS_COLORS.ui.text.primary,
                }}
                defaultValue={30}
                min={7}
                max={365}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="font-medium"
                  style={{ color: BUSINESS_COLORS.ui.text.primary }}
                >
                  数据压缩
                </p>
                <p
                  className="text-sm"
                  style={{ color: BUSINESS_COLORS.ui.text.muted }}
                >
                  启用数据库压缩功能
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div
                  className="w-11 h-6 rounded-full peer transition-colors peer-checked:bg-blue-600"
                  style={{
                    backgroundColor: BUSINESS_COLORS.ui.background.tertiary,
                  }}
                >
                  <div className="w-5 h-5 bg-white rounded-full shadow transform transition-transform peer-checked:translate-x-5 translate-x-0.5 mt-0.5" />
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p
                  className="font-medium"
                  style={{ color: BUSINESS_COLORS.ui.text.primary }}
                >
                  加密存储
                </p>
                <p
                  className="text-sm"
                  style={{ color: BUSINESS_COLORS.ui.text.muted }}
                >
                  启用数据库静态加密
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div
                  className="w-11 h-6 rounded-full peer transition-colors peer-checked:bg-blue-600"
                  style={{
                    backgroundColor: BUSINESS_COLORS.ui.background.tertiary,
                  }}
                >
                  <div className="w-5 h-5 bg-white rounded-full shadow transform transition-transform peer-checked:translate-x-5 translate-x-0.5 mt-0.5" />
                </div>
              </label>
            </div>
          </div>
        </div>
      </InfoCard>
    </div>
  );

  // 系统设置
  const renderSystemSettings = () => (
    <div className="space-y-6">
      <InfoCard title="系统参数配置" description="系统性能、界面主题和全局设置">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: BUSINESS_COLORS.ui.text.primary }}
              >
                界面主题
              </label>
              <select
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: BUSINESS_COLORS.ui.border.primary,
                  backgroundColor: BUSINESS_COLORS.ui.background.card,
                  color: BUSINESS_COLORS.ui.text.primary,
                }}
              >
                <option value="business">商务风格</option>
                <option value="dark">深色主题</option>
                <option value="light">浅色主题</option>
                <option value="auto">跟随系统</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: BUSINESS_COLORS.ui.text.primary }}
              >
                语言设置
              </label>
              <select
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: BUSINESS_COLORS.ui.border.primary,
                  backgroundColor: BUSINESS_COLORS.ui.background.card,
                  color: BUSINESS_COLORS.ui.text.primary,
                }}
              >
                <option value="zh-CN">简体中文</option>
                <option value="en-US">English</option>
                <option value="ja-JP">��本語</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: BUSINESS_COLORS.ui.text.primary }}
              >
                时区设置
              </label>
              <select
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: BUSINESS_COLORS.ui.border.primary,
                  backgroundColor: BUSINESS_COLORS.ui.background.card,
                  color: BUSINESS_COLORS.ui.text.primary,
                }}
              >
                <option value="Asia/Shanghai">北京时间 (UTC+8)</option>
                <option value="UTC">UTC 时间</option>
                <option value="America/New_York">纽约时间 (UTC-5)</option>
                <option value="Europe/London">伦敦时间 (UTC+0)</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: BUSINESS_COLORS.ui.text.primary }}
              >
                数据刷新间隔 (秒)
              </label>
              <input
                type="number"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: BUSINESS_COLORS.ui.border.primary,
                  backgroundColor: BUSINESS_COLORS.ui.background.card,
                  color: BUSINESS_COLORS.ui.text.primary,
                }}
                defaultValue={5}
                min={1}
                max={60}
              />
            </div>
          </div>
        </div>
      </InfoCard>
    </div>
  );

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
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1
                className="text-3xl font-bold"
                style={{ color: BUSINESS_COLORS.ui.text.inverse }}
              >
                系统设置
              </h1>
              <p style={{ color: BUSINESS_COLORS.neutral.silver }}>
                配置系统参数、安全策略和用户权限
              </p>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center space-x-3">
            {isDirty && (
              <div
                className="flex items-center space-x-2 px-3 py-2 rounded-lg"
                style={{
                  backgroundColor: `${BUSINESS_COLORS.status.warning}20`,
                  border: `1px solid ${BUSINESS_COLORS.status.warning}`,
                  color: BUSINESS_COLORS.status.warning,
                }}
              >
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">配置已修改</span>
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={isSaving || !isDirty}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50"
              style={{
                backgroundColor: BUSINESS_COLORS.primary.blue,
                color: `rgb(var(--brand-lightest))`,
                textShadow: `0 0 8px rgba(var(--brand-lightest), 0.5)`,
                boxShadow: BUSINESS_COLORS.shadows.md,
              }}
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-medium">保存中...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span className="text-sm font-medium">保存设置</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 侧边栏导航 */}
        <div className="lg:col-span-1">
          <BusinessCard>
            <nav className="space-y-1">
              {settingSections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                      isActive ? "ring-2" : ""
                    }`}
                    style={{
                      backgroundColor: isActive
                        ? `${BUSINESS_COLORS.primary.blue}20`
                        : "transparent",
                      color: isActive
                        ? BUSINESS_COLORS.primary.blue
                        : BUSINESS_COLORS.ui.text.secondary,
                      ringColor: isActive
                        ? BUSINESS_COLORS.primary.blue
                        : "transparent",
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <div className="text-left">
                        <div className="font-medium text-sm">
                          {section.title}
                        </div>
                        <div className="text-xs opacity-80">
                          {section.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      {section.badge && (
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${BUSINESS_COLORS.status.error}20`,
                            color: BUSINESS_COLORS.status.error,
                            border: `1px solid ${BUSINESS_COLORS.status.error}`,
                          }}
                        >
                          {section.badge}
                        </span>
                      )}
                      {section.isNew && (
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${BUSINESS_COLORS.status.success}20`,
                            color: BUSINESS_COLORS.status.success,
                            border: `1px solid ${BUSINESS_COLORS.status.success}`,
                          }}
                        >
                          NEW
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </BusinessCard>
        </div>

        {/* 主要内容 */}
        <div className="lg:col-span-3">{renderSectionContent()}</div>
      </div>
    </div>
  );
}
