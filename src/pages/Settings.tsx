import React, { useState, useEffect, useCallback } from "react";
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
  Eye,
  EyeOff,
  Download,
  Upload,
  Trash2,
  Plus,
  Edit3,
  Check,
  X,
  AlertTriangle,
  Info,
  Globe,
  Smartphone,
  Mail,
  Clock,
  HardDrive,
  Cpu,
  MemoryStick,
  Activity,
  Zap,
  Brain,
  Hexagon,
  Triangle,
  Server,
  FileText,
  Key,
  UserCheck,
  UserX,
  Search,
  Filter,
  MoreVertical,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { TechCard, StatusCard } from "@/components/ui/TechCard";
import { TECH_COLORS, getThreatLevelColor } from "@/lib/techColors";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

/**
 * 设置分类接口
 */
interface SettingSection {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  badge?: string;
  isNew?: boolean;
}

/**
 * 用户接口
 */
interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "operator" | "viewer";
  status: "active" | "inactive" | "locked";
  lastLogin: string;
  permissions: string[];
}

/**
 * 系统设置主页面
 */
export default function Settings() {
  const navigate = useNavigate();

  // 基础状态
  const [activeSection, setActiveSection] = useState("security");
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 用户管理状态
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      username: "admin",
      email: "admin@cyberguard.com",
      role: "admin",
      status: "active",
      lastLogin: "2024-01-15 14:23:45",
      permissions: ["*"],
    },
    {
      id: "2",
      username: "operator",
      email: "operator@cyberguard.com",
      role: "operator",
      status: "active",
      lastLogin: "2024-01-15 13:45:21",
      permissions: ["view", "alert", "monitor"],
    },
    {
      id: "3",
      username: "viewer",
      email: "viewer@cyberguard.com",
      role: "viewer",
      status: "locked",
      lastLogin: "2024-01-14 09:12:33",
      permissions: ["view"],
    },
  ]);

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isEditingUser, setIsEditingUser] = useState(false);

  // 系统设置状态
  const [settings, setSettings] = useState({
    // 安全配置
    security: {
      firewallEnabled: true,
      intrusionDetection: true,
      autoBlock: true,
      blockDuration: 3600,
      maxLoginAttempts: 5,
      passwordComplexity: "high",
      sessionTimeout: 30,
      twoFactorAuth: true,
      ipWhitelist: ["192.168.1.0/24", "10.0.0.0/8"],
      autoLockout: true,
      bruteForceProtection: true,
      sqlInjectionProtection: true,
      xssProtection: true,
    },

    // 网络设置
    network: {
      bandwidthLimit: 1000,
      trafficMonitoring: true,
      packetInspection: true,
      geoBlocking: true,
      dnsFiltering: true,
      portScanning: true,
      ddosProtection: true,
      networkSegmentation: true,
      vpnSupport: true,
      proxySettings: {
        enabled: false,
        server: "",
        port: 8080,
        authentication: false,
      },
    },

    // 告警配置
    alerts: {
      emailNotifications: true,
      smsNotifications: false,
      webhookNotifications: true,
      criticalThreshold: 5,
      highThreshold: 10,
      mediumThreshold: 20,
      autoEscalation: true,
      escalationDelay: 300,
      notificationChannels: {
        email: {
          smtp: {
            server: "smtp.company.com",
            port: 587,
            security: "tls",
            username: "alerts@cyberguard.com",
            password: "********",
          },
          recipients: ["admin@company.com", "security@company.com"],
        },
        webhook: {
          url: "https://hooks.slack.com/services/...",
          secret: "********",
        },
        sms: {
          provider: "twilio",
          apiKey: "********",
          recipients: ["+1234567890"],
        },
      },
    },

    // 监控配置
    monitoring: {
      dataRetention: 90,
      logLevel: "info",
      realTimeUpdates: true,
      performanceMetrics: true,
      healthChecks: true,
      autoBackup: true,
      backupInterval: 24,
      backupLocation: "/var/backup/cyberguard",
      metricsCollection: {
        cpu: true,
        memory: true,
        disk: true,
        network: true,
        application: true,
      },
      alerting: {
        diskUsage: 85,
        memoryUsage: 90,
        cpuUsage: 80,
        networkLatency: 1000,
      },
    },

    // 数据管理
    database: {
      autoCleanup: true,
      cleanupInterval: 7,
      compressionEnabled: true,
      indexOptimization: true,
      connectionPoolSize: 20,
      queryTimeout: 30,
      backupRetention: 30,
      encryptionEnabled: true,
      replicationEnabled: false,
      shardingEnabled: false,
    },

    // 系统配置
    system: {
      theme: "dark",
      language: "zh-CN",
      timezone: "Asia/Shanghai",
      dateFormat: "YYYY-MM-DD",
      timeFormat: "24h",
      autoUpdate: true,
      updateChannel: "stable",
      debugMode: false,
      maintenanceMode: false,
      apiRateLimit: 1000,
      maxConcurrentUsers: 100,
    },
  });

  // 设置分类定义
  const settingSections: SettingSection[] = [
    {
      id: "security",
      title: "安全配置",
      icon: Shield,
      description: "防火墙、入侵检测和访问控制设置",
      badge: "关键",
    },
    {
      id: "network",
      title: "网络设置",
      icon: Wifi,
      description: "网络监控、带宽限制和流量分析配置",
    },
    {
      id: "alerts",
      title: "告警配置",
      icon: Bell,
      description: "告警规则、通知方式和阈值设置",
    },
    {
      id: "users",
      title: "用户管理",
      icon: Users,
      description: "用户权限、角色分配和访问管理",
    },
    {
      id: "monitoring",
      title: "监控配置",
      icon: Monitor,
      description: "系统监控、性能指标和日志配置",
    },
    {
      id: "database",
      title: "数据管理",
      icon: Database,
      description: "数据备份、清理和存储配置",
    },
    {
      id: "system",
      title: "���统配置",
      icon: SettingsIcon,
      description: "主题、语言、时区和系统参数设置",
      isNew: true,
    },
  ];

  // 处理设置变更
  const handleSettingChange = useCallback(
    (section: string, key: string, value: any) => {
      setSettings((prev) => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [key]: value,
        },
      }));
      setIsDirty(true);
    },
    [],
  );

  // 处理嵌套设置变更
  const handleNestedSettingChange = useCallback(
    (section: string, path: string[], value: any) => {
      setSettings((prev) => {
        const newSettings = { ...prev };
        let current = newSettings[section as keyof typeof newSettings] as any;

        // 导航到嵌套属性的父级
        for (let i = 0; i < path.length - 1; i++) {
          current = current[path[i]];
        }

        // 设置最终值
        current[path[path.length - 1]] = value;

        return newSettings;
      });
      setIsDirty(true);
    },
    [],
  );

  // 保存设置
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // TODO: 实际保存到后端
      console.log("Saving settings:", settings);

      setIsDirty(false);

      // 显示成功提示
      if ((window as any).showToast) {
        (window as any).showToast({
          title: "设置已保存",
          description: "系统配置已成功更新",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      if ((window as any).showToast) {
        (window as any).showToast({
          title: "保存失败",
          description: "请稍后重试",
          type: "error",
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  // 导出设置
  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `cyberguard-settings-${new Date().toISOString().split("T")[0]}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  // 导入设置
  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setSettings(importedSettings);
          setIsDirty(true);

          if ((window as any).showToast) {
            (window as any).showToast({
              title: "设置已导入",
              description: "配置文件导入成功",
              type: "success",
            });
          }
        } catch (error) {
          if ((window as any).showToast) {
            (window as any).showToast({
              title: "导入失败",
              description: "配置文件格式错误",
              type: "error",
            });
          }
        }
      };
      reader.readAsText(file);
    }
  };

  // 重置设置
  const handleResetSettings = () => {
    if (confirm("确定要重置所有设置到默认值吗？此操作不可撤销。")) {
      // TODO: 重置到默认设置
      setIsDirty(true);
    }
  };

  // 渲染安全设置
  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <TechCard variant="cyber" glow className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Shield
              className="w-6 h-6"
              style={{ color: TECH_COLORS.primary.cyber }}
            />
            <div>
              <h3
                className="text-xl font-bold font-mono"
                style={{ color: TECH_COLORS.ui.text.primary }}
              >
                安全防护设置
              </h3>
              <p
                className="text-sm font-mono"
                style={{ color: TECH_COLORS.ui.text.secondary }}
              >
                Configure advanced security protection mechanisms
              </p>
            </div>
          </div>
          <div
            className="px-3 py-1 rounded-full text-xs font-mono"
            style={{
              backgroundColor: `${TECH_COLORS.status.critical}20`,
              color: TECH_COLORS.status.critical,
              border: `1px solid ${TECH_COLORS.status.critical}`,
            }}
          >
            关键配置
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 基础防护 */}
          <div className="space-y-4">
            <h4
              className="text-lg font-semibold font-mono"
              style={{ color: TECH_COLORS.ui.text.primary }}
            >
              基础防护
            </h4>

            <SettingToggle
              label="智能防火墙"
              description="AI驱动的下一代防火墙保护"
              checked={settings.security.firewallEnabled}
              onChange={(checked) =>
                handleSettingChange("security", "firewallEnabled", checked)
              }
              status="critical"
            />

            <SettingToggle
              label="入侵检测系统"
              description="实时监控和分析网络入侵行为"
              checked={settings.security.intrusionDetection}
              onChange={(checked) =>
                handleSettingChange("security", "intrusionDetection", checked)
              }
              status="critical"
            />

            <SettingToggle
              label="自动威胁阻断"
              description="检测到威胁时自动阻断来源"
              checked={settings.security.autoBlock}
              onChange={(checked) =>
                handleSettingChange("security", "autoBlock", checked)
              }
            />

            <SettingToggle
              label="双因子认证"
              description="增强账户安全��的双重验证"
              checked={settings.security.twoFactorAuth}
              onChange={(checked) =>
                handleSettingChange("security", "twoFactorAuth", checked)
              }
              status="recommended"
            />
          </div>

          {/* 高级防护 */}
          <div className="space-y-4">
            <h4
              className="text-lg font-semibold font-mono"
              style={{ color: TECH_COLORS.ui.text.primary }}
            >
              高级防护
            </h4>

            <SettingToggle
              label="暴力破解防护"
              description="检测并阻止暴力破解攻击"
              checked={settings.security.bruteForceProtection}
              onChange={(checked) =>
                handleSettingChange("security", "bruteForceProtection", checked)
              }
            />

            <SettingToggle
              label="SQL注入防护"
              description="检测和阻止SQL注入攻击"
              checked={settings.security.sqlInjectionProtection}
              onChange={(checked) =>
                handleSettingChange(
                  "security",
                  "sqlInjectionProtection",
                  checked,
                )
              }
            />

            <SettingToggle
              label="XSS攻击防护"
              description="防止跨站脚本攻击"
              checked={settings.security.xssProtection}
              onChange={(checked) =>
                handleSettingChange("security", "xssProtection", checked)
              }
            />

            <SettingToggle
              label="自动锁定"
              description="多次失败登录后自动锁定账户"
              checked={settings.security.autoLockout}
              onChange={(checked) =>
                handleSettingChange("security", "autoLockout", checked)
              }
            />
          </div>
        </div>

        {/* 数值设置 */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <SettingInput
            label="阻断持续时间"
            description="威胁源IP阻断时长（秒）"
            type="number"
            value={settings.security.blockDuration}
            onChange={(value) =>
              handleSettingChange("security", "blockDuration", parseInt(value))
            }
            min={300}
            max={86400}
            unit="秒"
          />

          <SettingInput
            label="最大登录尝试"
            description="失败登录阻断前的最大尝试次数"
            type="number"
            value={settings.security.maxLoginAttempts}
            onChange={(value) =>
              handleSettingChange(
                "security",
                "maxLoginAttempts",
                parseInt(value),
              )
            }
            min={3}
            max={10}
            unit="次"
          />

          <SettingInput
            label="会话超时"
            description="用户会话超时时间（分钟）"
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(value) =>
              handleSettingChange("security", "sessionTimeout", parseInt(value))
            }
            min={5}
            max={240}
            unit="分钟"
          />
        </div>

        {/* 密码复杂度 */}
        <div className="mt-6">
          <SettingSelect
            label="密码复杂度要求"
            description="用户密码的安全性要求级别"
            value={settings.security.passwordComplexity}
            onChange={(value) =>
              handleSettingChange("security", "passwordComplexity", value)
            }
            options={[
              { value: "low", label: "低 - 6位以上" },
              { value: "medium", label: "中 - 8位��上，包含数字" },
              {
                value: "high",
                label: "高 - 12位以上，包含大小写、数字和特殊字符",
              },
              {
                value: "extreme",
                label: "极高 - 16位以上，包含所有字符类型",
              },
            ]}
          />
        </div>

        {/* IP白名单 */}
        <div className="mt-6">
          <IPWhitelistManager
            whitelist={settings.security.ipWhitelist}
            onChange={(whitelist) =>
              handleSettingChange("security", "ipWhitelist", whitelist)
            }
          />
        </div>
      </TechCard>
    </div>
  );

  // 渲染网络设置
  const renderNetworkSettings = () => (
    <div className="space-y-6">
      <TechCard variant="matrix" glow className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Wifi
            className="w-6 h-6"
            style={{ color: TECH_COLORS.primary.matrix }}
          />
          <div>
            <h3
              className="text-xl font-bold font-mono"
              style={{ color: TECH_COLORS.ui.text.primary }}
            >
              网络监控与控制
            </h3>
            <p
              className="text-sm font-mono"
              style={{ color: TECH_COLORS.ui.text.secondary }}
            >
              Network monitoring and traffic control settings
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 流量控制 */}
          <div className="space-y-4">
            <h4
              className="text-lg font-semibold font-mono"
              style={{ color: TECH_COLORS.ui.text.primary }}
            >
              流量控制
            </h4>

            <SettingInput
              label="带宽限制"
              description="最大网络带宽使用限制"
              type="number"
              value={settings.network.bandwidthLimit}
              onChange={(value) =>
                handleSettingChange(
                  "network",
                  "bandwidthLimit",
                  parseInt(value),
                )
              }
              min={100}
              max={10000}
              unit="Mbps"
            />

            <SettingToggle
              label="实时流量监控"
              description="监控网络流量并生成详细报告"
              checked={settings.network.trafficMonitoring}
              onChange={(checked) =>
                handleSettingChange("network", "trafficMonitoring", checked)
              }
            />

            <SettingToggle
              label="深度包检测"
              description="分析数据包内容检测潜在威胁"
              checked={settings.network.packetInspection}
              onChange={(checked) =>
                handleSettingChange("network", "packetInspection", checked)
              }
            />
          </div>

          {/* 安全防护 */}
          <div className="space-y-4">
            <h4
              className="text-lg font-semibold font-mono"
              style={{ color: TECH_COLORS.ui.text.primary }}
            >
              网络安全
            </h4>

            <SettingToggle
              label="地理位置拦截"
              description="基于IP地理位置阻断可疑流量"
              checked={settings.network.geoBlocking}
              onChange={(checked) =>
                handleSettingChange("network", "geoBlocking", checked)
              }
            />

            <SettingToggle
              label="DNS过滤"
              description="过滤恶意域名和钓鱼网站"
              checked={settings.network.dnsFiltering}
              onChange={(checked) =>
                handleSettingChange("network", "dnsFiltering", checked)
              }
            />

            <SettingToggle
              label="端口扫描检测"
              description="检测并阻止端口扫描攻击"
              checked={settings.network.portScanning}
              onChange={(checked) =>
                handleSettingChange("network", "portScanning", checked)
              }
            />

            <SettingToggle
              label="DDoS防护"
              description="分布式拒绝服务攻击防护"
              checked={settings.network.ddosProtection}
              onChange={(checked) =>
                handleSettingChange("network", "ddosProtection", checked)
              }
            />
          </div>
        </div>

        {/* 代理设置 */}
        {showAdvanced && (
          <div className="mt-6">
            <ProxySettings
              settings={settings.network.proxySettings}
              onChange={(proxySettings) =>
                handleNestedSettingChange(
                  "network",
                  ["proxySettings"],
                  proxySettings,
                )
              }
            />
          </div>
        )}
      </TechCard>
    </div>
  );

  // 渲染告警设置
  const renderAlertSettings = () => (
    <div className="space-y-6">
      <TechCard variant="plasma" glow className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Bell
            className="w-6 h-6"
            style={{ color: TECH_COLORS.primary.plasma }}
          />
          <div>
            <h3
              className="text-xl font-bold font-mono"
              style={{ color: TECH_COLORS.ui.text.primary }}
            >
              智能告警系统
            </h3>
            <p
              className="text-sm font-mono"
              style={{ color: TECH_COLORS.ui.text.secondary }}
            >
              Advanced alerting and notification configuration
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 通知渠道 */}
          <div className="space-y-4">
            <h4
              className="text-lg font-semibold font-mono"
              style={{ color: TECH_COLORS.ui.text.primary }}
            >
              通知渠道
            </h4>

            <SettingToggle
              label="邮件通知"
              description="通过邮件发送告警信息"
              checked={settings.alerts.emailNotifications}
              onChange={(checked) =>
                handleSettingChange("alerts", "emailNotifications", checked)
              }
              icon={<Mail className="w-4 h-4" />}
            />

            <SettingToggle
              label="短信通知"
              description="通过短信发送紧急告警"
              checked={settings.alerts.smsNotifications}
              onChange={(checked) =>
                handleSettingChange("alerts", "smsNotifications", checked)
              }
              icon={<Smartphone className="w-4 h-4" />}
            />

            <SettingToggle
              label="Webhook通知"
              description="发送到第三方系统（如Slack）"
              checked={settings.alerts.webhookNotifications}
              onChange={(checked) =>
                handleSettingChange("alerts", "webhookNotifications", checked)
              }
              icon={<Globe className="w-4 h-4" />}
            />
          </div>

          {/* 告警级别 */}
          <div className="space-y-4">
            <h4
              className="text-lg font-semibold font-mono"
              style={{ color: TECH_COLORS.ui.text.primary }}
            >
              告警阈值
            </h4>

            <SettingInput
              label="严重告警阈值"
              description="触发严重告警的威胁数量"
              type="number"
              value={settings.alerts.criticalThreshold}
              onChange={(value) =>
                handleSettingChange(
                  "alerts",
                  "criticalThreshold",
                  parseInt(value),
                )
              }
              min={1}
              max={20}
              status="critical"
            />

            <SettingInput
              label="高危告警阈值"
              description="触发高危告警的威胁数量"
              type="number"
              value={settings.alerts.highThreshold}
              onChange={(value) =>
                handleSettingChange("alerts", "highThreshold", parseInt(value))
              }
              min={5}
              max={50}
              status="high"
            />

            <SettingInput
              label="中危告警阈值"
              description="触发中危告警的威胁数量"
              type="number"
              value={settings.alerts.mediumThreshold}
              onChange={(value) =>
                handleSettingChange(
                  "alerts",
                  "mediumThreshold",
                  parseInt(value),
                )
              }
              min={10}
              max={100}
              status="medium"
            />
          </div>
        </div>

        {/* 升级设置 */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingToggle
            label="自动升级"
            description="严重告警自动升级通知���别"
            checked={settings.alerts.autoEscalation}
            onChange={(checked) =>
              handleSettingChange("alerts", "autoEscalation", checked)
            }
          />

          <SettingInput
            label="升级延迟"
            description="告警升级前的等待时间"
            type="number"
            value={settings.alerts.escalationDelay}
            onChange={(value) =>
              handleSettingChange("alerts", "escalationDelay", parseInt(value))
            }
            min={60}
            max={3600}
            unit="秒"
          />
        </div>

        {/* 通知渠道详细配置 */}
        {showAdvanced && (
          <div className="mt-6">
            <NotificationChannelSettings
              channels={settings.alerts.notificationChannels}
              onChange={(channels) =>
                handleNestedSettingChange(
                  "alerts",
                  ["notificationChannels"],
                  channels,
                )
              }
            />
          </div>
        )}
      </TechCard>
    </div>
  );

  // 渲染用户管理
  const renderUserManagement = () => (
    <div className="space-y-6">
      <TechCard variant="quantum" glow className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Users
              className="w-6 h-6"
              style={{ color: TECH_COLORS.primary.quantum }}
            />
            <div>
              <h3
                className="text-xl font-bold font-mono"
                style={{ color: TECH_COLORS.ui.text.primary }}
              >
                用户权限管理
              </h3>
              <p
                className="text-sm font-mono"
                style={{ color: TECH_COLORS.ui.text.secondary }}
              >
                User accounts, roles and permissions management
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditingUser(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300"
            style={{
              backgroundColor: TECH_COLORS.primary.quantum,
              color: "white",
            }}
          >
            <Plus className="w-4 h-4" />
            <span className="font-mono">添加用户</span>
          </button>
        </div>

        {/* 用户搜索和过滤 */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
              style={{ color: TECH_COLORS.ui.text.muted }}
            />
            <input
              type="text"
              placeholder="搜索用户..."
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
          <button
            className="p-2 rounded-lg transition-all duration-300"
            style={{
              backgroundColor: TECH_COLORS.ui.background.panel,
              border: `1px solid ${TECH_COLORS.ui.border.primary}`,
              color: TECH_COLORS.ui.text.secondary,
            }}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* 用户列表 */}
        <div className="space-y-3">
          {users
            .filter(
              (user) =>
                user.username
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .map((user) => (
              <UserCard
                key={user.id}
                user={user}
                isSelected={selectedUser === user.id}
                onSelect={() =>
                  setSelectedUser(selectedUser === user.id ? null : user.id)
                }
                onEdit={() => {
                  setSelectedUser(user.id);
                  setIsEditingUser(true);
                }}
                onDelete={() => {
                  if (confirm(`确定要删除用户 ${user.username} 吗？`)) {
                    setUsers(users.filter((u) => u.id !== user.id));
                  }
                }}
                onToggleStatus={() => {
                  setUsers(
                    users.map((u) =>
                      u.id === user.id
                        ? {
                            ...u,
                            status:
                              u.status === "active" ? "inactive" : "active",
                          }
                        : u,
                    ),
                  );
                }}
              />
            ))}
        </div>

        {/* 用户统计 */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatusCard
            status="online"
            label="总用户数"
            value={users.length}
            icon={<Users className="w-4 h-4" />}
          />
          <StatusCard
            status="online"
            label="活跃用户"
            value={users.filter((u) => u.status === "active").length}
            icon={<UserCheck className="w-4 h-4" />}
          />
          <StatusCard
            status="warning"
            label="锁定用户"
            value={users.filter((u) => u.status === "locked").length}
            icon={<UserX className="w-4 h-4" />}
          />
          <StatusCard
            status="processing"
            label="管理员"
            value={users.filter((u) => u.role === "admin").length}
            icon={<Key className="w-4 h-4" />}
          />
        </div>
      </TechCard>
    </div>
  );

  // 渲染监控配置
  const renderMonitoringSettings = () => (
    <div className="space-y-6">
      <TechCard variant="neural" glow className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Monitor
            className="w-6 h-6"
            style={{ color: TECH_COLORS.primary.neural }}
          />
          <div>
            <h3
              className="text-xl font-bold font-mono"
              style={{ color: TECH_COLORS.ui.text.primary }}
            >
              系统监控配置
            </h3>
            <p
              className="text-sm font-mono"
              style={{ color: TECH_COLORS.ui.text.secondary }}
            >
              Performance monitoring and logging configuration
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ��控设置 */}
          <div className="space-y-4">
            <h4
              className="text-lg font-semibold font-mono"
              style={{ color: TECH_COLORS.ui.text.primary }}
            >
              监控配置
            </h4>

            <SettingToggle
              label="实时数据更新"
              description="启用仪表板实时数据更新"
              checked={settings.monitoring.realTimeUpdates}
              onChange={(checked) =>
                handleSettingChange("monitoring", "realTimeUpdates", checked)
              }
              icon={<Activity className="w-4 h-4" />}
            />

            <SettingToggle
              label="性能指标收集"
              description="收集详细的系统性能指标"
              checked={settings.monitoring.performanceMetrics}
              onChange={(checked) =>
                handleSettingChange("monitoring", "performanceMetrics", checked)
              }
              icon={<Cpu className="w-4 h-4" />}
            />

            <SettingToggle
              label="健康检查"
              description="定期执行系统健康检查"
              checked={settings.monitoring.healthChecks}
              onChange={(checked) =>
                handleSettingChange("monitoring", "healthChecks", checked)
              }
              icon={<Zap className="w-4 h-4" />}
            />
          </div>

          {/* 备份设置 */}
          <div className="space-y-4">
            <h4
              className="text-lg font-semibold font-mono"
              style={{ color: TECH_COLORS.ui.text.primary }}
            >
              备份配置
            </h4>

            <SettingToggle
              label="自动备份"
              description="按计划自动备份系统数据"
              checked={settings.monitoring.autoBackup}
              onChange={(checked) =>
                handleSettingChange("monitoring", "autoBackup", checked)
              }
              icon={<HardDrive className="w-4 h-4" />}
            />

            <SettingInput
              label="备份间隔"
              description="自动备份的时间间隔"
              type="number"
              value={settings.monitoring.backupInterval}
              onChange={(value) =>
                handleSettingChange(
                  "monitoring",
                  "backupInterval",
                  parseInt(value),
                )
              }
              min={1}
              max={168}
              unit="小时"
            />

            <SettingInput
              label="备份位置"
              description="备份文件存储路径"
              type="text"
              value={settings.monitoring.backupLocation}
              onChange={(value) =>
                handleSettingChange("monitoring", "backupLocation", value)
              }
            />
          </div>
        </div>

        {/* 数据保留和日志设置 */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <SettingInput
            label="数据保留天数"
            description="历史数据保留的天数"
            type="number"
            value={settings.monitoring.dataRetention}
            onChange={(value) =>
              handleSettingChange(
                "monitoring",
                "dataRetention",
                parseInt(value),
              )
            }
            min={7}
            max={365}
            unit="天"
          />

          <SettingSelect
            label="日志级别"
            description="系统日志记录的详细程度"
            value={settings.monitoring.logLevel}
            onChange={(value) =>
              handleSettingChange("monitoring", "logLevel", value)
            }
            options={[
              { value: "debug", label: "Debug - 调试信息" },
              { value: "info", label: "Info - 一般信息" },
              { value: "warning", label: "Warning - 警告信息" },
              { value: "error", label: "Error - 错误信息" },
            ]}
          />

          <div className="space-y-2">
            <label
              className="text-sm font-mono"
              style={{ color: TECH_COLORS.ui.text.secondary }}
            >
              监控指标
            </label>
            <div className="space-y-1">
              {Object.entries(settings.monitoring.metricsCollection).map(
                ([key, value]) => (
                  <label key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        handleNestedSettingChange(
                          "monitoring",
                          ["metricsCollection", key],
                          e.target.checked,
                        )
                      }
                      className="w-3 h-3"
                    />
                    <span
                      className="text-xs font-mono"
                      style={{ color: TECH_COLORS.ui.text.muted }}
                    >
                      {key.toUpperCase()}
                    </span>
                  </label>
                ),
              )}
            </div>
          </div>
        </div>
      </TechCard>
    </div>
  );

  // 渲染数据库设置
  const renderDatabaseSettings = () => (
    <div className="space-y-6">
      <TechCard variant="cyber" glow className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Database
            className="w-6 h-6"
            style={{ color: TECH_COLORS.primary.cyber }}
          />
          <div>
            <h3
              className="text-xl font-bold font-mono"
              style={{ color: TECH_COLORS.ui.text.primary }}
            >
              数据库管理
            </h3>
            <p
              className="text-sm font-mono"
              style={{ color: TECH_COLORS.ui.text.secondary }}
            >
              Database optimization and maintenance settings
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 维护设置 */}
          <div className="space-y-4">
            <h4
              className="text-lg font-semibold font-mono"
              style={{ color: TECH_COLORS.ui.text.primary }}
            >
              维护配置
            </h4>

            <SettingToggle
              label="自动清理"
              description="定期清理过期和冗余数据"
              checked={settings.database.autoCleanup}
              onChange={(checked) =>
                handleSettingChange("database", "autoCleanup", checked)
              }
            />

            <SettingToggle
              label="数据压缩"
              description="启用数据压缩以节省存储空间"
              checked={settings.database.compressionEnabled}
              onChange={(checked) =>
                handleSettingChange("database", "compressionEnabled", checked)
              }
            />

            <SettingToggle
              label="索引优化"
              description="定期优化数据库索引"
              checked={settings.database.indexOptimization}
              onChange={(checked) =>
                handleSettingChange("database", "indexOptimization", checked)
              }
            />

            <SettingInput
              label="清理间隔"
              description="自动清理执行间隔"
              type="number"
              value={settings.database.cleanupInterval}
              onChange={(value) =>
                handleSettingChange(
                  "database",
                  "cleanupInterval",
                  parseInt(value),
                )
              }
              min={1}
              max={30}
              unit="天"
            />
          </div>

          {/* 性能设置 */}
          <div className="space-y-4">
            <h4
              className="text-lg font-semibold font-mono"
              style={{ color: TECH_COLORS.ui.text.primary }}
            >
              性能配置
            </h4>

            <SettingInput
              label="连接池大小"
              description="数据库连接池的最大连接数"
              type="number"
              value={settings.database.connectionPoolSize}
              onChange={(value) =>
                handleSettingChange(
                  "database",
                  "connectionPoolSize",
                  parseInt(value),
                )
              }
              min={5}
              max={100}
            />

            <SettingInput
              label="查询超时"
              description="数据库查询超时时间"
              type="number"
              value={settings.database.queryTimeout}
              onChange={(value) =>
                handleSettingChange("database", "queryTimeout", parseInt(value))
              }
              min={5}
              max={300}
              unit="秒"
            />

            <SettingInput
              label="备份保留"
              description="数据库备份保留天数"
              type="number"
              value={settings.database.backupRetention}
              onChange={(value) =>
                handleSettingChange(
                  "database",
                  "backupRetention",
                  parseInt(value),
                )
              }
              min={7}
              max={365}
              unit="天"
            />
          </div>
        </div>

        {/* 高级功能 */}
        <div className="mt-6">
          <h4
            className="text-lg font-semibold font-mono mb-4"
            style={{ color: TECH_COLORS.ui.text.primary }}
          >
            高级功能
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SettingToggle
              label="数据加密"
              description="启用数据库静态加密"
              checked={settings.database.encryptionEnabled}
              onChange={(checked) =>
                handleSettingChange("database", "encryptionEnabled", checked)
              }
              status="critical"
            />

            <SettingToggle
              label="主从复制"
              description="启用数据库主从复制"
              checked={settings.database.replicationEnabled}
              onChange={(checked) =>
                handleSettingChange("database", "replicationEnabled", checked)
              }
            />

            <SettingToggle
              label="分片部署"
              description="启用数据库分片功能"
              checked={settings.database.shardingEnabled}
              onChange={(checked) =>
                handleSettingChange("database", "shardingEnabled", checked)
              }
            />
          </div>
        </div>
      </TechCard>
    </div>
  );

  // 渲染系统配置
  const renderSystemSettings = () => (
    <div className="space-y-6">
      <TechCard variant="quantum" glow className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <SettingsIcon
            className="w-6 h-6"
            style={{ color: TECH_COLORS.primary.quantum }}
          />
          <div>
            <h3
              className="text-xl font-bold font-mono"
              style={{ color: TECH_COLORS.ui.text.primary }}
            >
              系统参数配置
            </h3>
            <p
              className="text-sm font-mono"
              style={{ color: TECH_COLORS.ui.text.secondary }}
            >
              Global system settings and preferences
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 界面设置 */}
          <div className="space-y-4">
            <h4
              className="text-lg font-semibold font-mono"
              style={{ color: TECH_COLORS.ui.text.primary }}
            >
              界面配置
            </h4>

            <SettingSelect
              label="界面主题"
              description="选择系统界面主题"
              value={settings.system.theme}
              onChange={(value) =>
                handleSettingChange("system", "theme", value)
              }
              options={[
                { value: "dark", label: "深色主题" },
                { value: "light", label: "浅色主题" },
                { value: "auto", label: "自动切换" },
                { value: "cyber", label: "赛博朋克" },
              ]}
            />

            <SettingSelect
              label="显示语言"
              description="系统界面显示语言"
              value={settings.system.language}
              onChange={(value) =>
                handleSettingChange("system", "language", value)
              }
              options={[
                { value: "zh-CN", label: "简体中文" },
                { value: "en-US", label: "English" },
                { value: "ja-JP", label: "日本語" },
                { value: "ko-KR", label: "한국어" },
              ]}
            />

            <SettingSelect
              label="时区设置"
              description="系统时区配置"
              value={settings.system.timezone}
              onChange={(value) =>
                handleSettingChange("system", "timezone", value)
              }
              options={[
                { value: "Asia/Shanghai", label: "Asia/Shanghai (UTC+8)" },
                { value: "UTC", label: "UTC (UTC+0)" },
                {
                  value: "America/New_York",
                  label: "America/New_York (UTC-5)",
                },
                { value: "Europe/London", label: "Europe/London (UTC+0)" },
              ]}
            />
          </div>

          {/* 系统设置 */}
          <div className="space-y-4">
            <h4
              className="text-lg font-semibold font-mono"
              style={{ color: TECH_COLORS.ui.text.primary }}
            >
              系统配置
            </h4>

            <SettingToggle
              label="自动更新"
              description="启用系统自动更新"
              checked={settings.system.autoUpdate}
              onChange={(checked) =>
                handleSettingChange("system", "autoUpdate", checked)
              }
            />

            <SettingSelect
              label="更新渠道"
              description="选择系统更新渠道"
              value={settings.system.updateChannel}
              onChange={(value) =>
                handleSettingChange("system", "updateChannel", value)
              }
              options={[
                { value: "stable", label: "稳定版" },
                { value: "beta", label: "测试版" },
                { value: "alpha", label: "开发版" },
              ]}
            />

            <SettingToggle
              label="调试模式"
              description="启用系统��试模式"
              checked={settings.system.debugMode}
              onChange={(checked) =>
                handleSettingChange("system", "debugMode", checked)
              }
              status="warning"
            />

            <SettingToggle
              label="维护模式"
              description="启用系统维护模式"
              checked={settings.system.maintenanceMode}
              onChange={(checked) =>
                handleSettingChange("system", "maintenanceMode", checked)
              }
              status="critical"
            />
          </div>
        </div>

        {/* 性能限制 */}
        <div className="mt-6">
          <h4
            className="text-lg font-semibold font-mono mb-4"
            style={{ color: TECH_COLORS.ui.text.primary }}
          >
            性能限制
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingInput
              label="API速率限制"
              description="每分钟��大API请求数"
              type="number"
              value={settings.system.apiRateLimit}
              onChange={(value) =>
                handleSettingChange("system", "apiRateLimit", parseInt(value))
              }
              min={100}
              max={10000}
              unit="次/分钟"
            />

            <SettingInput
              label="最大并发用户"
              description="系统支持的最大并发用户数"
              type="number"
              value={settings.system.maxConcurrentUsers}
              onChange={(value) =>
                handleSettingChange(
                  "system",
                  "maxConcurrentUsers",
                  parseInt(value),
                )
              }
              min={10}
              max={1000}
              unit="用户"
            />
          </div>
        </div>
      </TechCard>
    </div>
  );

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
        return renderUserManagement();
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

  return (
    <div
      className="min-h-screen w-full p-6 pt-16 lg:pt-6"
      style={{ backgroundColor: TECH_COLORS.ui.background.primary }}
    >
      {/* 顶部标题栏 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 px-3 py-1 rounded-lg transition-all duration-300"
              style={{
                backgroundColor: TECH_COLORS.ui.background.panel,
                color: TECH_COLORS.ui.text.secondary,
                border: `1px solid ${TECH_COLORS.ui.border.primary}`,
              }}
            >
              <X className="w-4 h-4" />
              <span className="text-sm font-mono">返回</span>
            </button>

            <div className="flex items-center space-x-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  background: TECH_COLORS.gradients.cyber,
                  boxShadow: `0 0 20px ${TECH_COLORS.primary.cyber}66`,
                }}
              >
                <SettingsIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1
                  className="text-3xl font-bold font-mono"
                  style={{
                    color: TECH_COLORS.ui.text.primary,
                    textShadow: `0 0 10px ${TECH_COLORS.primary.cyber}66`,
                  }}
                >
                  NEURAL SYSTEM CONFIG
                </h1>
                <p
                  className="text-sm font-mono"
                  style={{ color: TECH_COLORS.ui.text.secondary }}
                >
                  Advanced System Configuration & Management
                </p>
              </div>
            </div>
          </div>

          {/* 工具栏 */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300"
              style={{
                backgroundColor: showAdvanced
                  ? TECH_COLORS.primary.cyber
                  : TECH_COLORS.ui.background.panel,
                color: showAdvanced ? "white" : TECH_COLORS.ui.text.secondary,
                border: `1px solid ${TECH_COLORS.ui.border.primary}`,
              }}
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm font-mono">高级选项</span>
            </button>

            <button
              onClick={handleExportSettings}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300"
              style={{
                backgroundColor: TECH_COLORS.ui.background.panel,
                color: TECH_COLORS.ui.text.secondary,
                border: `1px solid ${TECH_COLORS.ui.border.primary}`,
              }}
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-mono">导出</span>
            </button>

            <label className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span className="text-sm font-mono">导入</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportSettings}
                className="hidden"
              />
            </label>

            <button
              onClick={handleResetSettings}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300"
              style={{
                backgroundColor: TECH_COLORS.ui.background.panel,
                color: TECH_COLORS.status.critical,
                border: `1px solid ${TECH_COLORS.status.critical}`,
              }}
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm font-mono">重置</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 侧边导航 */}
        <div className="lg:col-span-1">
          <TechCard variant="cyber" className="p-4 sticky top-6">
            <h3
              className="text-lg font-bold font-mono mb-4"
              style={{ color: TECH_COLORS.ui.text.primary }}
            >
              配置分类
            </h3>
            <nav className="space-y-2">
              {settingSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-300 flex items-center justify-between ${
                      activeSection === section.id
                        ? "ring-2"
                        : "hover:bg-opacity-50"
                    }`}
                    style={{
                      backgroundColor:
                        activeSection === section.id
                          ? `${TECH_COLORS.primary.cyber}20`
                          : "transparent",
                      color:
                        activeSection === section.id
                          ? TECH_COLORS.primary.cyber
                          : TECH_COLORS.ui.text.secondary,
                      ringColor:
                        activeSection === section.id
                          ? TECH_COLORS.primary.cyber
                          : "transparent",
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <div>
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
                          className="px-2 py-0.5 rounded-full text-xs font-mono"
                          style={{
                            backgroundColor: `${TECH_COLORS.status.critical}20`,
                            color: TECH_COLORS.status.critical,
                            border: `1px solid ${TECH_COLORS.status.critical}`,
                          }}
                        >
                          {section.badge}
                        </span>
                      )}
                      {section.isNew && (
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-mono"
                          style={{
                            backgroundColor: `${TECH_COLORS.status.online}20`,
                            color: TECH_COLORS.status.online,
                            border: `1px solid ${TECH_COLORS.status.online}`,
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
          </TechCard>
        </div>

        {/* 主要内容 */}
        <div className="lg:col-span-3">
          {renderSectionContent()}

          {/* 底部操作栏 */}
          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {isDirty && (
                <div
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg"
                  style={{
                    backgroundColor: `${TECH_COLORS.status.warning}20`,
                    color: TECH_COLORS.status.warning,
                    border: `1px solid ${TECH_COLORS.status.warning}`,
                  }}
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-mono">配置已修改</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  if (isDirty && !confirm("确定要丢弃未保存的修改吗？")) {
                    return;
                  }
                  navigate(-1);
                }}
                className="px-6 py-3 rounded-lg transition-all duration-300 font-mono"
                style={{
                  backgroundColor: TECH_COLORS.ui.background.panel,
                  color: TECH_COLORS.ui.text.secondary,
                  border: `1px solid ${TECH_COLORS.ui.border.primary}`,
                }}
              >
                取消
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving || !isDirty}
                className="flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 font-mono"
                style={{
                  backgroundColor:
                    isDirty && !isSaving
                      ? TECH_COLORS.primary.cyber
                      : TECH_COLORS.ui.background.panel,
                  color:
                    isDirty && !isSaving ? "white" : TECH_COLORS.ui.text.muted,
                  border: `1px solid ${
                    isDirty && !isSaving
                      ? TECH_COLORS.primary.cyber
                      : TECH_COLORS.ui.border.primary
                  }`,
                  boxShadow:
                    isDirty && !isSaving
                      ? `0 0 20px ${TECH_COLORS.primary.cyber}66`
                      : "none",
                }}
              >
                {isSaving ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>{isSaving ? "保存中..." : "保存配置"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 设置切换组件
 */
function SettingToggle({
  label,
  description,
  checked,
  onChange,
  status,
  icon,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  status?: "critical" | "recommended" | "normal";
  icon?: React.ReactNode;
}) {
  const getStatusColor = () => {
    switch (status) {
      case "critical":
        return TECH_COLORS.status.critical;
      case "recommended":
        return TECH_COLORS.status.warning;
      default:
        return TECH_COLORS.primary.neon;
    }
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border transition-all duration-300">
      <div className="flex items-center space-x-3">
        {icon && (
          <div
            className="p-2 rounded"
            style={{
              backgroundColor: `${getStatusColor()}20`,
              color: getStatusColor(),
            }}
          >
            {icon}
          </div>
        )}
        <div>
          <div
            className="font-medium font-mono flex items-center space-x-2"
            style={{ color: TECH_COLORS.ui.text.primary }}
          >
            <span>{label}</span>
            {status && (
              <span
                className="px-2 py-0.5 rounded-full text-xs"
                style={{
                  backgroundColor: `${getStatusColor()}20`,
                  color: getStatusColor(),
                }}
              >
                {status.toUpperCase()}
              </span>
            )}
          </div>
          <p
            className="text-sm font-mono"
            style={{ color: TECH_COLORS.ui.text.secondary }}
          >
            {description}
          </p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div
          className="relative w-11 h-6 rounded-full peer transition-colors duration-300"
          style={{
            backgroundColor: checked
              ? getStatusColor()
              : TECH_COLORS.ui.background.panel,
          }}
        >
          <div
            className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform duration-300 bg-white"
            style={{
              transform: checked ? "translateX(20px)" : "translateX(0)",
            }}
          />
        </div>
      </label>
    </div>
  );
}

/**
 * 设置输入组件
 */
function SettingInput({
  label,
  description,
  type,
  value,
  onChange,
  min,
  max,
  unit,
  status,
}: {
  label: string;
  description: string;
  type: "text" | "number";
  value: string | number;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  unit?: string;
  status?: "critical" | "high" | "medium";
}) {
  const getStatusColor = () => {
    switch (status) {
      case "critical":
        return TECH_COLORS.status.critical;
      case "high":
        return TECH_COLORS.status.warning;
      case "medium":
        return TECH_COLORS.status.processing;
      default:
        return TECH_COLORS.ui.border.primary;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          className="font-medium font-mono"
          style={{ color: TECH_COLORS.ui.text.primary }}
        >
          {label}
          {status && (
            <span
              className="ml-2 px-2 py-0.5 rounded-full text-xs"
              style={{
                backgroundColor: `${getStatusColor()}20`,
                color: getStatusColor(),
              }}
            >
              {status.toUpperCase()}
            </span>
          )}
        </label>
        {unit && (
          <span
            className="text-sm font-mono"
            style={{ color: TECH_COLORS.ui.text.muted }}
          >
            {unit}
          </span>
        )}
      </div>
      <p
        className="text-sm font-mono"
        style={{ color: TECH_COLORS.ui.text.secondary }}
      >
        {description}
      </p>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        className="w-full px-3 py-2 rounded-lg font-mono transition-all duration-300"
        style={{
          backgroundColor: TECH_COLORS.ui.background.panel,
          border: `1px solid ${getStatusColor()}`,
          color: TECH_COLORS.ui.text.primary,
          boxShadow: `0 0 0 0 ${getStatusColor()}`,
        }}
        onFocus={(e) => {
          e.target.style.boxShadow = `0 0 0 2px ${getStatusColor()}33`;
        }}
        onBlur={(e) => {
          e.target.style.boxShadow = `0 0 0 0 ${getStatusColor()}`;
        }}
      />
    </div>
  );
}

/**
 * 设置选择组件
 */
function SettingSelect({
  label,
  description,
  value,
  onChange,
  options,
}: {
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-2">
      <label
        className="font-medium font-mono"
        style={{ color: TECH_COLORS.ui.text.primary }}
      >
        {label}
      </label>
      <p
        className="text-sm font-mono"
        style={{ color: TECH_COLORS.ui.text.secondary }}
      >
        {description}
      </p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg font-mono transition-all duration-300"
        style={{
          backgroundColor: TECH_COLORS.ui.background.panel,
          border: `1px solid ${TECH_COLORS.ui.border.primary}`,
          color: TECH_COLORS.ui.text.primary,
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * IP白名单管理器
 */
function IPWhitelistManager({
  whitelist,
  onChange,
}: {
  whitelist: string[];
  onChange: (whitelist: string[]) => void;
}) {
  const [newIP, setNewIP] = useState("");

  const addIP = () => {
    if (newIP && !whitelist.includes(newIP)) {
      onChange([...whitelist, newIP]);
      setNewIP("");
    }
  };

  const removeIP = (ip: string) => {
    onChange(whitelist.filter((item) => item !== ip));
  };

  return (
    <div className="space-y-4">
      <h4
        className="text-lg font-semibold font-mono"
        style={{ color: TECH_COLORS.ui.text.primary }}
      >
        IP白名单管理
      </h4>

      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="输入IP地址或CIDR..."
          value={newIP}
          onChange={(e) => setNewIP(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg font-mono"
          style={{
            backgroundColor: TECH_COLORS.ui.background.panel,
            border: `1px solid ${TECH_COLORS.ui.border.primary}`,
            color: TECH_COLORS.ui.text.primary,
          }}
          onKeyPress={(e) => e.key === "Enter" && addIP()}
        />
        <button
          onClick={addIP}
          className="px-4 py-2 rounded-lg transition-all duration-300 font-mono"
          style={{
            backgroundColor: TECH_COLORS.primary.matrix,
            color: "white",
          }}
        >
          添加
        </button>
      </div>

      <div className="space-y-2 max-h-40 overflow-y-auto">
        {whitelist.map((ip, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 rounded border"
            style={{
              backgroundColor: TECH_COLORS.ui.background.panel,
              borderColor: TECH_COLORS.ui.border.primary,
            }}
          >
            <span
              className="font-mono text-sm"
              style={{ color: TECH_COLORS.ui.text.primary }}
            >
              {ip}
            </span>
            <button
              onClick={() => removeIP(ip)}
              className="p-1 rounded transition-colors hover:bg-red-500/20"
              style={{ color: TECH_COLORS.status.critical }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 代理设置组件
 */
function ProxySettings({
  settings,
  onChange,
}: {
  settings: any;
  onChange: (settings: any) => void;
}) {
  return (
    <TechCard variant="matrix" className="p-4">
      <h4
        className="text-lg font-semibold font-mono mb-4"
        style={{ color: TECH_COLORS.ui.text.primary }}
      >
        代理服务器配置
      </h4>

      <div className="space-y-4">
        <SettingToggle
          label="启用代理"
          description="通过代理服务器访问外部网络"
          checked={settings.enabled}
          onChange={(checked) => onChange({ ...settings, enabled: checked })}
        />

        {settings.enabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingInput
              label="代理服务器"
              description="代理服务器地址"
              type="text"
              value={settings.server}
              onChange={(value) => onChange({ ...settings, server: value })}
            />

            <SettingInput
              label="端口号"
              description="代理服务器端口"
              type="number"
              value={settings.port}
              onChange={(value) =>
                onChange({ ...settings, port: parseInt(value) })
              }
              min={1}
              max={65535}
            />

            <div className="md:col-span-2">
              <SettingToggle
                label="启用认证"
                description="代理服务器需要用户名密码认证"
                checked={settings.authentication}
                onChange={(checked) =>
                  onChange({ ...settings, authentication: checked })
                }
              />
            </div>
          </div>
        )}
      </div>
    </TechCard>
  );
}

/**
 * 通知渠道设置
 */
function NotificationChannelSettings({
  channels,
  onChange,
}: {
  channels: any;
  onChange: (channels: any) => void;
}) {
  return (
    <TechCard variant="plasma" className="p-4">
      <h4
        className="text-lg font-semibold font-mono mb-4"
        style={{ color: TECH_COLORS.ui.text.primary }}
      >
        通知渠道详细配置
      </h4>

      <div className="space-y-6">
        {/* 邮件配置 */}
        <div className="space-y-4">
          <h5
            className="font-semibold font-mono"
            style={{ color: TECH_COLORS.ui.text.primary }}
          >
            邮件通知配置
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingInput
              label="SMTP服务器"
              description="邮件服务器地址"
              type="text"
              value={channels.email.smtp.server}
              onChange={(value) =>
                onChange({
                  ...channels,
                  email: {
                    ...channels.email,
                    smtp: { ...channels.email.smtp, server: value },
                  },
                })
              }
            />
            <SettingInput
              label="SMTP端口"
              description="邮件服务器端口"
              type="number"
              value={channels.email.smtp.port}
              onChange={(value) =>
                onChange({
                  ...channels,
                  email: {
                    ...channels.email,
                    smtp: { ...channels.email.smtp, port: parseInt(value) },
                  },
                })
              }
            />
          </div>
        </div>

        {/* Webhook配置 */}
        <div className="space-y-4">
          <h5
            className="font-semibold font-mono"
            style={{ color: TECH_COLORS.ui.text.primary }}
          >
            Webhook配置
          </h5>
          <SettingInput
            label="Webhook URL"
            description="第三方服务的Webhook地址"
            type="text"
            value={channels.webhook.url}
            onChange={(value) =>
              onChange({
                ...channels,
                webhook: { ...channels.webhook, url: value },
              })
            }
          />
        </div>
      </div>
    </TechCard>
  );
}

/**
 * 用户卡片组件
 */
function UserCard({
  user,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onToggleStatus,
}: {
  user: User;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return TECH_COLORS.status.online;
      case "locked":
        return TECH_COLORS.status.critical;
      default:
        return TECH_COLORS.status.offline;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return TECH_COLORS.status.critical;
      case "operator":
        return TECH_COLORS.status.warning;
      default:
        return TECH_COLORS.status.processing;
    }
  };

  return (
    <div
      className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
        isSelected ? "ring-2" : ""
      }`}
      style={{
        backgroundColor: TECH_COLORS.ui.background.panel,
        borderColor: isSelected
          ? TECH_COLORS.primary.quantum
          : TECH_COLORS.ui.border.primary,
        ringColor: TECH_COLORS.primary.quantum,
      }}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold"
            style={{
              backgroundColor: `${getRoleColor(user.role)}20`,
              color: getRoleColor(user.role),
            }}
          >
            {user.username[0].toUpperCase()}
          </div>
          <div>
            <div
              className="font-semibold font-mono"
              style={{ color: TECH_COLORS.ui.text.primary }}
            >
              {user.username}
            </div>
            <div
              className="text-sm font-mono"
              style={{ color: TECH_COLORS.ui.text.secondary }}
            >
              {user.email}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span
              className="px-2 py-1 rounded-full text-xs font-mono"
              style={{
                backgroundColor: `${getRoleColor(user.role)}20`,
                color: getRoleColor(user.role),
              }}
            >
              {user.role.toUpperCase()}
            </span>
            <span
              className="px-2 py-1 rounded-full text-xs font-mono"
              style={{
                backgroundColor: `${getStatusColor(user.status)}20`,
                color: getStatusColor(user.status),
              }}
            >
              {user.status.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1 rounded transition-colors hover:bg-blue-500/20"
              style={{ color: TECH_COLORS.primary.quantum }}
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus();
              }}
              className="p-1 rounded transition-colors hover:bg-yellow-500/20"
              style={{ color: TECH_COLORS.status.warning }}
            >
              {user.status === "active" ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 rounded transition-colors hover:bg-red-500/20"
              style={{ color: TECH_COLORS.status.critical }}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {isSelected && (
        <div className="mt-4 pt-4 border-t space-y-2">
          <div
            className="text-sm font-mono"
            style={{ color: TECH_COLORS.ui.text.secondary }}
          >
            <span>最后登录: {user.lastLogin}</span>
          </div>
          <div
            className="text-sm font-mono"
            style={{ color: TECH_COLORS.ui.text.secondary }}
          >
            <span>权限: {user.permissions.join(", ")}</span>
          </div>
        </div>
      )}
    </div>
  );
}
