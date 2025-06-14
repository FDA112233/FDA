import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import {
  Shield,
  AlertTriangle,
  FileText,
  Activity,
  Settings,
  User,
  Bell,
  LogOut,
  Users,
  Server,
  Key,
  Monitor,
  Globe,
  Menu,
  X,
} from "lucide-react";
import { BUSINESS_COLORS } from "@/lib/businessColors";

const navItems = [
  { name: "仪表板", path: "/", icon: Activity },
  { name: "3D态势大屏", path: "/situation", icon: Globe },
  { name: "威胁告警", path: "/alerts", icon: AlertTriangle },
  { name: "安全报告", path: "/reports", icon: FileText },
  { name: "威胁情报", path: "/threat-intelligence", icon: Shield },
  { name: "资产管理", path: "/assets", icon: Server },
  { name: "用��管理", path: "/users", icon: Users },
  { name: "系统日志", path: "/logs", icon: FileText },
  { name: "API密钥", path: "/api-keys", icon: Key },
  { name: "系统设置", path: "/settings", icon: Settings },
];

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 检测屏幕尺寸
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 关闭移动端菜单
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    closeMobileMenu();
  };

  return (
    <>
      {/* 移动端菜单按钮 */}
      {isMobile && (
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-lg backdrop-blur-sm border shadow-lg"
          style={{
            backgroundColor: BUSINESS_COLORS.ui.background.panel,
            borderColor: BUSINESS_COLORS.ui.border.primary,
            color: BUSINESS_COLORS.ui.text.primary,
          }}
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* 移动端遮罩 */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 mobile-menu-overlay"
          onClick={closeMobileMenu}
        />
      )}

      {/* 导航菜单 */}
      <nav
        className={cn(
          "w-64 h-screen fixed left-0 top-0 z-50 flex flex-col mobile-nav-transition border-r shadow-xl",
          isMobile && !isMobileMenuOpen && "-translate-x-full",
        )}
        style={{
          backgroundColor: BUSINESS_COLORS.ui.background.panel,
          borderColor: BUSINESS_COLORS.ui.border.primary,
        }}
      >
        {/* 移动端关闭按钮 */}
        {isMobile && (
          <button
            onClick={closeMobileMenu}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-lg transition-colors"
            style={{
              color: BUSINESS_COLORS.ui.text.secondary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                BUSINESS_COLORS.ui.background.secondary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Logo */}
        <div
          className="p-6 border-b relative group"
          style={{ borderColor: BUSINESS_COLORS.ui.border.primary }}
        >
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105 enhanced-icon"
              style={{
                backgroundColor: BUSINESS_COLORS.primary.blue,
                boxShadow: BUSINESS_COLORS.shadows.md,
              }}
            >
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1
                className="text-xl font-bold gradient-text transition-all duration-300"
                style={{ color: BUSINESS_COLORS.ui.text.primary }}
              >
                CyberGuard
              </h1>
              <p
                className="text-xs transition-colors duration-300"
                style={{ color: BUSINESS_COLORS.ui.text.muted }}
              >
                网络安全管理平台
              </p>
            </div>
          </div>

          {/* Logo背景光效 */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${BUSINESS_COLORS.primary.blue}10 0%, transparent 70%)`,
            }}
          />
        </div>

        {/* Navigation Items */}
        <div className="flex-1 p-4 space-y-1">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 relative group enhanced-button overflow-hidden",
                  isActive ? "shadow-lg" : "hover:shadow-md",
                  "hover-lift",
                )}
                style={{
                  backgroundColor: isActive
                    ? BUSINESS_COLORS.primary.blue
                    : "transparent",
                  color: isActive ? "white" : BUSINESS_COLORS.ui.text.secondary,
                  animationDelay: `${index * 50}ms`,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor =
                      BUSINESS_COLORS.ui.background.secondary;
                    e.currentTarget.style.color =
                      BUSINESS_COLORS.ui.text.primary;
                    e.currentTarget.style.transform = "translateX(8px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color =
                      BUSINESS_COLORS.ui.text.secondary;
                    e.currentTarget.style.transform = "translateX(0)";
                  }
                }}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 enhanced-icon transition-transform duration-300",
                    isActive && "animate-pulse",
                  )}
                />
                <span className="font-medium">{item.name}</span>

                {isActive && (
                  <>
                    <div
                      className="absolute right-2 w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                    />
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                        animation: "shimmer 2s infinite",
                      }}
                    />
                  </>
                )}

                {/* 悬停指示器 */}
                <div
                  className="absolute left-0 top-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: BUSINESS_COLORS.primary.lightBlue }}
                />
              </Link>
            );
          })}
        </div>

        {/* Status Indicator */}
        <div
          className="p-4 border-t"
          style={{ borderColor: BUSINESS_COLORS.ui.border.primary }}
        >
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 group">
              <div
                className="w-2 h-2 rounded-full animate-pulse status-indicator status-online relative"
                style={{ backgroundColor: BUSINESS_COLORS.status.success }}
              />
              <span
                className="transition-colors duration-300 group-hover:text-green-600"
                style={{ color: BUSINESS_COLORS.status.success }}
              >
                系统在线
              </span>
            </div>
            <div className="flex items-center space-x-2 group cursor-pointer">
              <Bell
                className="w-4 h-4 enhanced-icon transition-colors duration-300 group-hover:text-orange-600"
                style={{ color: BUSINESS_COLORS.status.warning }}
              />
              <span
                className="px-2 py-0.5 text-xs rounded-full transition-all duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: `${BUSINESS_COLORS.status.warning}20`,
                  color: BUSINESS_COLORS.status.warning,
                }}
              >
                3
              </span>
            </div>
          </div>

          {/* 实时数据指示器 */}
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="flex justify-between text-xs">
              <span style={{ color: BUSINESS_COLORS.ui.text.muted }}>
                CPU: <span className="text-green-500">23%</span>
              </span>
              <span style={{ color: BUSINESS_COLORS.ui.text.muted }}>
                内存: <span className="text-blue-500">67%</span>
              </span>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div
          className="p-4 border-t"
          style={{ borderColor: BUSINESS_COLORS.ui.border.primary }}
        >
          <div className="flex items-center space-x-3 mb-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: BUSINESS_COLORS.ui.background.secondary,
                border: `2px solid ${BUSINESS_COLORS.primary.blue}`,
              }}
            >
              <User
                className="w-4 h-4"
                style={{ color: BUSINESS_COLORS.primary.blue }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium truncate"
                style={{ color: BUSINESS_COLORS.ui.text.primary }}
              >
                {user || "安全管理员"}
              </p>
              <p
                className="text-xs truncate"
                style={{ color: BUSINESS_COLORS.ui.text.muted }}
              >
                admin@cyberguard.com
              </p>
            </div>
          </div>

          {/* 登出按钮 */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm rounded transition-all duration-200"
            style={{ color: BUSINESS_COLORS.ui.text.secondary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${BUSINESS_COLORS.status.error}10`;
              e.currentTarget.style.color = BUSINESS_COLORS.status.error;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = BUSINESS_COLORS.ui.text.secondary;
            }}
          >
            <LogOut className="w-4 h-4" />
            <span>退出登录</span>
          </button>
        </div>
      </nav>
    </>
  );
}
