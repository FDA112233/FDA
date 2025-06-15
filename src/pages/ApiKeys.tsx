import React, { useState, useEffect } from "react";
import {
  Key,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  BusinessCard,
  StatusCard,
  DataTableCard,
} from "@/components/ui/BusinessCard";
import { BUSINESS_COLORS } from "@/lib/businessColors";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  description: string;
  permissions: string[];
  status: "active" | "inactive" | "expired";
  createdAt: string;
  expiresAt: string;
  lastUsed?: string;
  usageCount: number;
  createdBy: string;
}

export default function ApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showKey, setShowKey] = useState<{ [key: string]: boolean }>({});

  // 模拟API密钥数据
  useEffect(() => {
    const mockApiKeys: ApiKey[] = [
      {
        id: "key-001",
        name: "监控系统集成",
        key: "sk_live_1234567890abcdef1234567890abcdef",
        description: "用于外部监控系统接入威胁数据API",
        permissions: ["threats:read", "alerts:read", "reports:read"],
        status: "active",
        createdAt: "2024-01-01T00:00:00Z",
        expiresAt: "2024-12-31T23:59:59Z",
        lastUsed: "2024-01-15T14:30:00Z",
        usageCount: 15420,
        createdBy: "admin",
      },
      {
        id: "key-002",
        name: "第三方安全工具",
        key: "sk_live_abcdef1234567890abcdef1234567890",
        description: "集成第三方安全分析工具的API访问",
        permissions: ["assets:read", "vulnerabilities:read"],
        status: "active",
        createdAt: "2024-01-10T00:00:00Z",
        expiresAt: "2024-06-30T23:59:59Z",
        lastUsed: "2024-01-14T18:20:00Z",
        usageCount: 3250,
        createdBy: "zhang.security",
      },
      {
        id: "key-003",
        name: "自动化脚本",
        key: "sk_live_fedcba0987654321fedcba0987654321",
        description: "用于自动化运维脚本的API调用",
        permissions: ["system:read", "logs:read"],
        status: "inactive",
        createdAt: "2023-12-15T00:00:00Z",
        expiresAt: "2024-03-15T23:59:59Z",
        usageCount: 890,
        createdBy: "li.ops",
      },
      {
        id: "key-004",
        name: "临时测试密钥",
        key: "sk_test_1111222233334444555566667777888",
        description: "开发测试环境使用的临时API密钥",
        permissions: ["*:read"],
        status: "expired",
        createdAt: "2024-01-01T00:00:00Z",
        expiresAt: "2024-01-10T23:59:59Z",
        lastUsed: "2024-01-09T16:45:00Z",
        usageCount: 125,
        createdBy: "dev.team",
      },
    ];
    setApiKeys(mockApiKeys);
  }, []);

  // 切换密钥显示
  const toggleKeyVisibility = (keyId: string) => {
    setShowKey((prev) => ({
      ...prev,
      [keyId]: !prev[keyId],
    }));
  };

  // 复制密钥
  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    // 这里可以添加提示消息
  };

  // 检查是否过期
  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return BUSINESS_COLORS.status.success;
      case "inactive":
        return BUSINESS_COLORS.neutral.silver;
      case "expired":
        return BUSINESS_COLORS.status.error;
      default:
        return BUSINESS_COLORS.neutral.silver;
    }
  };

  // 统计数据
  const keyStats = {
    total: apiKeys.length,
    active: apiKeys.filter((k) => k.status === "active").length,
    expired: apiKeys.filter((k) => k.status === "expired").length,
    totalUsage: apiKeys.reduce((sum, k) => sum + k.usageCount, 0),
  };

  return (
    <div
      className="p-8 pt-16 lg:pt-8 min-h-screen"
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
              <Key className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1
                className="text-3xl font-bold"
                style={{ color: BUSINESS_COLORS.ui.text.inverse }}
              >
                API密钥管理
              </h1>
              <p style={{ color: BUSINESS_COLORS.neutral.silver }}>
                管理和监控API访问密钥及权限控制
              </p>
            </div>
          </div>

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
            <span className="text-sm font-medium">创建密钥</span>
          </button>
        </div>
      </div>

      {/* 统计指标 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatusCard
          title="总密钥数"
          value={keyStats.total}
          icon={<Key className="w-5 h-5" />}
          status="info"
        />

        <StatusCard
          title="活跃密钥"
          value={keyStats.active}
          icon={<CheckCircle className="w-5 h-5" />}
          status="success"
        />

        <StatusCard
          title="已过期"
          value={keyStats.expired}
          icon={<XCircle className="w-5 h-5" />}
          status="error"
        />

        <StatusCard
          title="总调用次数"
          value={keyStats.totalUsage.toLocaleString()}
          icon={<Shield className="w-5 h-5" />}
          status="info"
        />
      </div>

      {/* API密钥列表 */}
      <DataTableCard
        title="API密钥列表"
        description={`共 ${apiKeys.length} 个API密钥`}
        data={apiKeys}
        columns={[
          {
            key: "name",
            label: "密钥名称",
            render: (value, row) => (
              <div>
                <p className="font-medium text-sm">{value}</p>
                <p
                  className="text-xs mt-1"
                  style={{ color: BUSINESS_COLORS.ui.text.muted }}
                >
                  {row.description}
                </p>
              </div>
            ),
          },
          {
            key: "key",
            label: "密钥",
            render: (value, row) => (
              <div className="flex items-center space-x-2">
                <code
                  className="text-sm font-mono px-2 py-1 rounded"
                  style={{
                    backgroundColor: BUSINESS_COLORS.ui.background.tertiary,
                    color: BUSINESS_COLORS.ui.text.primary,
                  }}
                >
                  {showKey[row.id]
                    ? value
                    : `${value.substring(0, 8)}...${value.substring(value.length - 8)}`}
                </code>
                <button
                  onClick={() => toggleKeyVisibility(row.id)}
                  className="p-1 rounded transition-colors"
                  style={{ color: BUSINESS_COLORS.ui.text.muted }}
                >
                  {showKey[row.id] ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => copyKey(value)}
                  className="p-1 rounded transition-colors"
                  style={{ color: BUSINESS_COLORS.ui.text.muted }}
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            ),
          },
          {
            key: "status",
            label: "状态",
            render: (value, row) => (
              <div className="flex items-center space-x-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getStatusColor(value) }}
                />
                <span className="text-sm">
                  {value === "active"
                    ? "活跃"
                    : value === "inactive"
                      ? "非活跃"
                      : "已过期"}
                </span>
                {isExpired(row.expiresAt) && value !== "expired" && (
                  <AlertTriangle
                    className="w-4 h-4"
                    style={{ color: BUSINESS_COLORS.status.warning }}
                  />
                )}
              </div>
            ),
          },
          {
            key: "permissions",
            label: "权限",
            render: (value) => (
              <div className="flex flex-wrap gap-1">
                {value.slice(0, 2).map((permission, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 rounded text-xs"
                    style={{
                      backgroundColor: `${BUSINESS_COLORS.primary.blue}20`,
                      color: BUSINESS_COLORS.primary.blue,
                    }}
                  >
                    {permission}
                  </span>
                ))}
                {value.length > 2 && (
                  <span
                    className="px-2 py-0.5 rounded text-xs"
                    style={{
                      backgroundColor: BUSINESS_COLORS.ui.background.tertiary,
                      color: BUSINESS_COLORS.ui.text.muted,
                    }}
                  >
                    +{value.length - 2}
                  </span>
                )}
              </div>
            ),
          },
          {
            key: "usageCount",
            label: "使用次数",
            render: (value) => (
              <span
                className="text-sm font-mono"
                style={{ color: BUSINESS_COLORS.ui.text.secondary }}
              >
                {value.toLocaleString()}
              </span>
            ),
          },
          {
            key: "expiresAt",
            label: "过期时间",
            render: (value) => (
              <div>
                <p className="text-sm">
                  {new Date(value).toLocaleDateString("zh-CN")}
                </p>
                <p
                  className={`text-xs ${isExpired(value) ? "font-medium" : ""}`}
                  style={{
                    color: isExpired(value)
                      ? BUSINESS_COLORS.status.error
                      : BUSINESS_COLORS.ui.text.muted,
                  }}
                >
                  {isExpired(value) ? "已过期" : "有效"}
                </p>
              </div>
            ),
          },
          {
            key: "lastUsed",
            label: "最后使用",
            render: (value) => (
              <div>
                {value ? (
                  <>
                    <p className="text-sm">
                      {new Date(value).toLocaleDateString("zh-CN")}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: BUSINESS_COLORS.ui.text.muted }}
                    >
                      {new Date(value).toLocaleTimeString("zh-CN")}
                    </p>
                  </>
                ) : (
                  <span
                    className="text-sm"
                    style={{ color: BUSINESS_COLORS.ui.text.muted }}
                  >
                    从未使用
                  </span>
                )}
              </div>
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
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  className="p-1 rounded transition-colors"
                  style={{ color: BUSINESS_COLORS.status.error }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ),
          },
        ]}
      />

      {/* API使用说明 */}
      <BusinessCard className="mt-8">
        <div>
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: BUSINESS_COLORS.ui.text.primary }}
          >
            API使用说明
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4
                className="font-medium mb-2"
                style={{ color: BUSINESS_COLORS.ui.text.primary }}
              >
                认证方式
              </h4>
              <p
                className="text-sm mb-2"
                style={{ color: BUSINESS_COLORS.ui.text.secondary }}
              >
                在HTTP请求头中添加认证信息：
              </p>
              <code
                className="block text-sm p-3 rounded-lg"
                style={{
                  backgroundColor: BUSINESS_COLORS.ui.background.tertiary,
                  color: BUSINESS_COLORS.ui.text.primary,
                }}
              >
                Authorization: Bearer YOUR_API_KEY
              </code>
            </div>
            <div>
              <h4
                className="font-medium mb-2"
                style={{ color: BUSINESS_COLORS.ui.text.primary }}
              >
                API端点
              </h4>
              <p
                className="text-sm mb-2"
                style={{ color: BUSINESS_COLORS.ui.text.secondary }}
              >
                基础URL：
              </p>
              <code
                className="block text-sm p-3 rounded-lg"
                style={{
                  backgroundColor: BUSINESS_COLORS.ui.background.tertiary,
                  color: BUSINESS_COLORS.ui.text.primary,
                }}
              >
                https://api.cyberguard.com/v1/
              </code>
            </div>
          </div>
        </div>
      </BusinessCard>
    </div>
  );
}
