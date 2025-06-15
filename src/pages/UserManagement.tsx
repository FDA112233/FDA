import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Shield,
  Key,
  Clock,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import {
  BusinessCard,
  StatusCard,
  DataTableCard,
} from "@/components/ui/BusinessCard";
import { BUSINESS_COLORS } from "@/lib/businessColors";

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: "admin" | "analyst" | "operator" | "viewer";
  status: "active" | "inactive" | "suspended" | "pending";
  lastLogin: string;
  createdAt: string;
  permissions: string[];
  phone?: string;
  department: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // 模拟用户数据
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: "user-001",
        username: "admin",
        email: "admin@cyberguard.com",
        fullName: "系统管理员",
        role: "admin",
        status: "active",
        lastLogin: "2024-01-15T14:30:00Z",
        createdAt: "2023-01-01T00:00:00Z",
        permissions: ["all"],
        phone: "+86 138-0013-8000",
        department: "信息技术部",
      },
      {
        id: "user-002",
        username: "zhang.security",
        email: "zhang@cyberguard.com",
        fullName: "张安全",
        role: "analyst",
        status: "active",
        lastLogin: "2024-01-15T13:45:00Z",
        createdAt: "2023-03-15T00:00:00Z",
        permissions: ["view_threats", "manage_alerts", "create_reports"],
        phone: "+86 139-0013-9000",
        department: "网络安全部",
      },
      {
        id: "user-003",
        username: "li.ops",
        email: "li@cyberguard.com",
        fullName: "李运维",
        role: "operator",
        status: "active",
        lastLogin: "2024-01-15T12:20:00Z",
        createdAt: "2023-05-20T00:00:00Z",
        permissions: ["view_assets", "manage_systems", "view_logs"],
        phone: "+86 135-0013-5000",
        department: "运维部",
      },
      {
        id: "user-004",
        username: "wang.audit",
        email: "wang@cyberguard.com",
        fullName: "王审计",
        role: "viewer",
        status: "inactive",
        lastLogin: "2024-01-10T16:00:00Z",
        createdAt: "2023-08-10T00:00:00Z",
        permissions: ["view_reports", "view_compliance"],
        phone: "+86 136-0013-6000",
        department: "审计部",
      },
      {
        id: "user-005",
        username: "chen.temp",
        email: "chen@cyberguard.com",
        fullName: "陈临时",
        role: "viewer",
        status: "pending",
        lastLogin: "",
        createdAt: "2024-01-14T00:00:00Z",
        permissions: ["view_reports"],
        department: "人力资源部",
      },
    ];
    setUsers(mockUsers);
  }, []);

  // 过滤用户
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // 获取角色颜色
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return BUSINESS_COLORS.threat.critical;
      case "analyst":
        return BUSINESS_COLORS.primary.blue;
      case "operator":
        return BUSINESS_COLORS.status.warning;
      case "viewer":
        return BUSINESS_COLORS.status.info;
      default:
        return BUSINESS_COLORS.neutral.silver;
    }
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return BUSINESS_COLORS.status.success;
      case "inactive":
        return BUSINESS_COLORS.neutral.silver;
      case "suspended":
        return BUSINESS_COLORS.status.error;
      case "pending":
        return BUSINESS_COLORS.status.warning;
      default:
        return BUSINESS_COLORS.neutral.silver;
    }
  };

  // 统计数据
  const userStats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    admins: users.filter((u) => u.role === "admin").length,
    pending: users.filter((u) => u.status === "pending").length,
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
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1
                className="text-3xl font-bold"
                style={{ color: BUSINESS_COLORS.ui.text.inverse }}
              >
                用户管理
              </h1>
              <p style={{ color: BUSINESS_COLORS.neutral.silver }}>
                管理用户账户、角色权限和访问控制
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
            <span className="text-sm font-medium">添加用户</span>
          </button>
        </div>
      </div>

      {/* 统计指标 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatusCard
          title="总用户数"
          value={userStats.total}
          icon={<Users className="w-5 h-5" />}
          status="info"
        />

        <StatusCard
          title="活跃用户"
          value={userStats.active}
          icon={<UserCheck className="w-5 h-5" />}
          status="success"
        />

        <StatusCard
          title="管理员"
          value={userStats.admins}
          icon={<Shield className="w-5 h-5" />}
          status="warning"
        />

        <StatusCard
          title="待审核"
          value={userStats.pending}
          icon={<Clock className="w-5 h-5" />}
          status="warning"
        />
      </div>

      {/* 搜索和过滤 */}
      <BusinessCard className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                style={{ color: BUSINESS_COLORS.ui.text.muted }}
              />
              <input
                type="text"
                placeholder="搜索用户名、姓名或邮箱..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  borderColor: BUSINESS_COLORS.ui.border.primary,
                  backgroundColor: BUSINESS_COLORS.ui.background.card,
                  color: BUSINESS_COLORS.ui.text.primary,
                }}
              />
            </div>

            <div className="flex gap-3">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  borderColor: BUSINESS_COLORS.ui.border.primary,
                  backgroundColor: BUSINESS_COLORS.ui.background.card,
                  color: BUSINESS_COLORS.ui.text.primary,
                }}
              >
                <option value="all">所有角色</option>
                <option value="admin">管理员</option>
                <option value="analyst">分析师</option>
                <option value="operator">操作员</option>
                <option value="viewer">查看者</option>
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
                <option value="active">活跃</option>
                <option value="inactive">非活跃</option>
                <option value="suspended">已停用</option>
                <option value="pending">待审核</option>
              </select>
            </div>
          </div>
        </div>
      </BusinessCard>

      {/* 用户列表 */}
      <DataTableCard
        title="用户账户列表"
        description={`共 ${filteredUsers.length} 个用户账户`}
        data={filteredUsers}
        columns={[
          {
            key: "fullName",
            label: "用户信息",
            render: (value, row) => (
              <div className="flex items-center space-x-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                  style={{
                    backgroundColor: `${getRoleColor(row.role)}20`,
                    color: getRoleColor(row.role),
                  }}
                >
                  {value.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-sm">{value}</p>
                  <p
                    className="text-xs"
                    style={{ color: BUSINESS_COLORS.ui.text.muted }}
                  >
                    @{row.username}
                  </p>
                </div>
              </div>
            ),
          },
          {
            key: "email",
            label: "联系信息",
            render: (value, row) => (
              <div>
                <div className="flex items-center space-x-2">
                  <Mail
                    className="w-3 h-3"
                    style={{ color: BUSINESS_COLORS.ui.text.muted }}
                  />
                  <span className="text-sm">{value}</span>
                </div>
                {row.phone && (
                  <div className="flex items-center space-x-2 mt-1">
                    <Phone
                      className="w-3 h-3"
                      style={{ color: BUSINESS_COLORS.ui.text.muted }}
                    />
                    <span
                      className="text-xs"
                      style={{ color: BUSINESS_COLORS.ui.text.muted }}
                    >
                      {row.phone}
                    </span>
                  </div>
                )}
              </div>
            ),
          },
          {
            key: "role",
            label: "角色",
            render: (value) => (
              <span
                className="px-2 py-1 rounded text-xs font-medium"
                style={{
                  backgroundColor: `${getRoleColor(value)}20`,
                  color: getRoleColor(value),
                  border: `1px solid ${getRoleColor(value)}40`,
                }}
              >
                {value === "admin"
                  ? "管理员"
                  : value === "analyst"
                    ? "分析师"
                    : value === "operator"
                      ? "操作员"
                      : "查看者"}
              </span>
            ),
          },
          {
            key: "status",
            label: "状态",
            render: (value) => (
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
                      : value === "suspended"
                        ? "已停用"
                        : "待审核"}
                </span>
              </div>
            ),
          },
          {
            key: "department",
            label: "部门",
            render: (value) => (
              <span
                className="text-sm"
                style={{ color: BUSINESS_COLORS.ui.text.secondary }}
              >
                {value}
              </span>
            ),
          },
          {
            key: "lastLogin",
            label: "最后登录",
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
                    从未登录
                  </span>
                )}
              </div>
            ),
          },
          {
            key: "actions",
            label: "操作",
            render: (_, row) => (
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
                {row.status !== "admin" && (
                  <button
                    className="p-1 rounded transition-colors"
                    style={{ color: BUSINESS_COLORS.status.error }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
