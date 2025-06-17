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
  {
    name: "仪表板",
    path: "/",
    icon: Activity,
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "3D态势大屏",
    path: "/situation",
    icon: Globe,
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "威胁告警",
    path: "/alerts",
    icon: AlertTriangle,
    color: "from-red-500 to-orange-500",
  },
  {
    name: "安全报告",
    path: "/reports",
    icon: FileText,
    color: "from-green-500 to-teal-500",
  },
  {
    name: "威胁情报",
    path: "/threat-intelligence",
    icon: Shield,
    color: "from-indigo-500 to-purple-500",
  },
  {
    name: "资产管理",
    path: "/assets",
    icon: Server,
    color: "from-yellow-500 to-orange-500",
  },
  {
    name: "用户管理",
    path: "/users",
    icon: Users,
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "系统日志",
    path: "/logs",
    icon: FileText,
    color: "from-slate-500 to-gray-500",
  },
  {
    name: "API密钥",
    path: "/api-keys",
    icon: Key,
    color: "from-amber-500 to-yellow-500",
  },
  {
    name: "系统设置",
    path: "/settings",
    icon: Settings,
    color: "from-violet-500 to-indigo-500",
  },
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
          className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl backdrop-blur-md border transition-all duration-300 hover:scale-110 click-pulse"
          style={{
            background: `linear-gradient(135deg,
              rgba(var(--brand-primary), 0.2) 0%,
              rgba(var(--brand-accent), 0.1) 100%)`,
            borderColor: `rgba(var(--brand-primary), 0.3)`,
            color: `rgb(var(--brand-lightest))`,
            boxShadow: `0 8px 32px rgba(var(--brand-primary), 0.3)`,
          }}
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* 移动端遮罩 */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 mobile-menu-overlay backdrop-blur-sm"
          style={{
            background: `linear-gradient(135deg,
              rgba(var(--neutral-900), 0.8) 0%,
              rgba(var(--brand-darkest), 0.9) 100%)`,
          }}
          onClick={closeMobileMenu}
        />
      )}

      {/* 导航菜单主容器 */}
      <nav
        className={cn(
          "w-64 h-screen fixed left-0 top-0 z-50 flex flex-col mobile-nav-transition border-r backdrop-blur-md overflow-hidden",
          isMobile && !isMobileMenuOpen && "-translate-x-full",
        )}
        style={{
          background: `linear-gradient(180deg,
            rgba(var(--neutral-900), 0.95) 0%,
            rgba(var(--brand-darkest), 0.9) 50%,
            rgba(var(--neutral-800), 0.95) 100%)`,
          borderColor: `rgba(var(--brand-primary), 0.2)`,
          boxShadow: `20px 0 40px rgba(var(--brand-primary), 0.1)`,
        }}
      >
        {/* 背景装饰效果 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* 动态渐变背景 */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(circle at 20% 20%, rgba(var(--brand-accent), 0.1) 0%, transparent 50%),
                          radial-gradient(circle at 80% 60%, rgba(var(--brand-primary), 0.08) 0%, transparent 50%),
                          radial-gradient(circle at 40% 90%, rgba(var(--brand-light), 0.06) 0%, transparent 50%)`,
              animation: "backgroundShift 20s ease-in-out infinite",
            }}
          />

          {/* 装饰粒子 */}
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                backgroundColor: [
                  `rgb(var(--brand-lightest))`,
                  `rgb(var(--brand-accent))`,
                  `rgb(var(--brand-light))`,
                ][i % 3],
                borderRadius: "50%",
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 2}s`,
              }}
            />
          ))}
        </div>

        {/* 移动端关闭按钮 */}
        {isMobile && (
          <button
            onClick={closeMobileMenu}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-lg transition-all duration-300 hover:scale-110 z-10"
            style={{
              background: `linear-gradient(135deg, rgba(var(--error), 0.2) 0%, rgba(var(--warning), 0.1) 100%)`,
              color: `rgb(var(--brand-lightest))`,
            }}
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Logo 区域 */}
        <div
          className="p-6 border-b relative group backdrop-blur-sm"
          style={{
            borderColor: `rgba(var(--brand-primary), 0.3)`,
            background: `linear-gradient(135deg, rgba(var(--brand-primary), 0.1) 0%, rgba(var(--brand-accent), 0.05) 100%)`,
          }}
        >
          <div className="flex items-center space-x-3 relative z-10">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg,
                  rgb(var(--brand-primary)) 0%,
                  rgb(var(--brand-accent)) 100%)`,
                boxShadow: `0 8px 32px rgba(var(--brand-primary), 0.4)`,
              }}
            >
              {/* 内部光效 */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%)`,
                }}
              />

              <Shield
                className="w-7 h-7 relative z-10"
                style={{
                  color: `rgb(var(--brand-lightest))`,
                  filter: `drop-shadow(0 0 12px rgba(var(--brand-lightest), 0.8))`,
                }}
              />
            </div>

            <div>
              <h1
                className="text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105"
                style={{
                  backgroundImage: `linear-gradient(45deg,
                    rgb(var(--brand-lightest)) 0%,
                    rgb(var(--brand-accent)) 50%,
                    rgb(var(--brand-light)) 100%)`,
                }}
              >
                CyberGuard
              </h1>
              <p
                className="text-xs transition-colors duration-300"
                style={{ color: `rgb(var(--brand-light))` }}
              >
                网��安全管理平台
              </p>
            </div>
          </div>

          {/* Logo 背景动态光效 */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, rgba(var(--brand-accent), 0.2) 0%, transparent 70%)`,
            }}
          />
        </div>

        {/* 导航菜单项 */}
        <div className="flex-1 p-4 space-y-2 relative z-10">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 relative group overflow-hidden",
                  "hover:scale-105 hover:-translate-y-1",
                  isActive && "shadow-2xl",
                )}
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, rgba(var(--brand-primary), 0.3) 0%, rgba(var(--brand-accent), 0.2) 100%)`
                    : "transparent",
                  color: isActive
                    ? `rgb(var(--brand-lightest))`
                    : `rgb(var(--brand-light))`,
                  animationDelay: `${index * 100}ms`,
                  boxShadow: isActive
                    ? `0 8px 32px rgba(var(--brand-primary), 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
                    : "none",
                  border: isActive
                    ? `1px solid rgba(var(--brand-primary), 0.3)`
                    : "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = `linear-gradient(135deg, rgba(var(--brand-primary), 0.15) 0%, rgba(var(--brand-accent), 0.1) 100%)`;
                    e.currentTarget.style.color = `rgb(var(--brand-lightest))`;
                    e.currentTarget.style.transform =
                      "translateX(8px) scale(1.02)";
                    e.currentTarget.style.borderColor = `rgba(var(--brand-primary), 0.2)`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = `rgb(var(--brand-light))`;
                    e.currentTarget.style.transform = "translateX(0) scale(1)";
                    e.currentTarget.style.borderColor = "transparent";
                  }
                }}
              >
                {/* 菜单项背景光效 */}
                <div
                  className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                    isActive && "opacity-30",
                  )}
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, rgba(var(--brand-accent), 0.2) 50%, transparent 100%)`,
                    animation: isActive
                      ? "slideRight 3s ease-in-out infinite"
                      : "none",
                  }}
                />

                <Icon
                  className={cn(
                    "w-5 h-5 transition-all duration-300 relative z-10",
                    isActive && "animate-pulse",
                    "group-hover:scale-110",
                  )}
                  style={{
                    filter: isActive
                      ? `drop-shadow(0 0 8px rgba(var(--brand-accent), 0.8))`
                      : `drop-shadow(0 0 4px rgba(var(--brand-light), 0.3))`,
                  }}
                />

                <span className="font-medium relative z-10 transition-all duration-300">
                  {item.name}
                </span>

                {/* 活跃状态指示器 */}
                {isActive && (
                  <>
                    <div
                      className="absolute right-3 w-2 h-2 rounded-full animate-pulse"
                      style={{
                        backgroundColor: `rgb(var(--brand-lightest))`,
                        boxShadow: `0 0 8px rgba(var(--brand-lightest), 0.8)`,
                      }}
                    />

                    {/* 左侧活跃指示线 */}
                    <div
                      className="absolute left-0 top-0 w-1 h-full rounded-r"
                      style={{
                        background: `linear-gradient(180deg, rgb(var(--brand-accent)) 0%, rgb(var(--brand-light)) 100%)`,
                        boxShadow: `0 0 8px rgba(var(--brand-accent), 0.6)`,
                      }}
                    />
                  </>
                )}

                {/* 悬停光效 */}
                <div
                  className="absolute left-0 top-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-r"
                  style={{
                    background: `linear-gradient(180deg, rgb(var(--brand-primary)) 0%, rgb(var(--brand-accent)) 100%)`,
                    boxShadow: `0 0 12px rgba(var(--brand-primary), 0.6)`,
                  }}
                />
              </Link>
            );
          })}
        </div>

        {/* 系统状态指示器 */}
        <div
          className="p-4 border-t backdrop-blur-sm"
          style={{
            borderColor: `rgba(var(--brand-primary), 0.3)`,
            background: `linear-gradient(135deg, rgba(var(--success), 0.05) 0%, rgba(var(--info), 0.05) 100%)`,
          }}
        >
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 group cursor-pointer">
              <div
                className="w-3 h-3 rounded-full animate-pulse relative"
                style={{
                  backgroundColor: `rgb(var(--success))`,
                  boxShadow: `0 0 12px rgba(var(--success), 0.6)`,
                }}
              >
                <div
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ backgroundColor: `rgb(var(--success))` }}
                />
              </div>
              <span
                className="transition-colors duration-300 group-hover:scale-105"
                style={{ color: `rgb(var(--success))` }}
              >
                系统在线
              </span>
            </div>

            <div className="flex items-center space-x-2 group cursor-pointer">
              <Bell
                className="w-4 h-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                style={{
                  color: `rgb(var(--warning))`,
                  filter: `drop-shadow(0 0 6px rgba(var(--warning), 0.6))`,
                }}
              />
              <span
                className="px-2 py-0.5 text-xs rounded-full transition-all duration-300 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, rgba(var(--warning), 0.3) 0%, rgba(var(--error), 0.2) 100%)`,
                  color: `rgb(var(--warning))`,
                  boxShadow: `0 0 8px rgba(var(--warning), 0.3)`,
                }}
              >
                3
              </span>
            </div>
          </div>

          {/* 实时系统指标 */}
          <div
            className="mt-3 pt-2 border-t"
            style={{ borderColor: `rgba(var(--brand-primary), 0.2)` }}
          >
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span style={{ color: `rgb(var(--brand-light))` }}>CPU:</span>
                <span
                  className="font-mono"
                  style={{
                    color: `rgb(var(--success))`,
                    textShadow: `0 0 4px rgba(var(--success), 0.5)`,
                  }}
                >
                  23%
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: `rgb(var(--brand-light))` }}>内存:</span>
                <span
                  className="font-mono"
                  style={{
                    color: `rgb(var(--info))`,
                    textShadow: `0 0 4px rgba(var(--info), 0.5)`,
                  }}
                >
                  67%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 用户资料区域 */}
        <div
          className="p-4 border-t backdrop-blur-sm"
          style={{
            borderColor: `rgba(var(--brand-primary), 0.3)`,
            background: `linear-gradient(135deg, rgba(var(--brand-primary), 0.1) 0%, rgba(var(--brand-accent), 0.05) 100%)`,
          }}
        >
          <div className="flex items-center space-x-3 mb-3 group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, rgba(var(--brand-primary), 0.3) 0%, rgba(var(--brand-accent), 0.2) 100%)`,
                border: `2px solid rgba(var(--brand-primary), 0.4)`,
                boxShadow: `0 4px 16px rgba(var(--brand-primary), 0.2)`,
              }}
            >
              <User
                className="w-5 h-5 relative z-10"
                style={{
                  color: `rgb(var(--brand-lightest))`,
                  filter: `drop-shadow(0 0 6px rgba(var(--brand-lightest), 0.6))`,
                }}
              />

              {/* 在线状态指示器 */}
              <div
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 animate-pulse"
                style={{
                  backgroundColor: `rgb(var(--success))`,
                  borderColor: `rgba(var(--neutral-900), 0.8)`,
                  boxShadow: `0 0 8px rgba(var(--success), 0.6)`,
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium truncate transition-all duration-300 group-hover:scale-105"
                style={{
                  color: `rgb(var(--brand-lightest))`,
                  textShadow: `0 0 4px rgba(var(--brand-lightest), 0.3)`,
                }}
              >
                {user || "安全管理员"}
              </p>
              <p
                className="text-xs truncate transition-colors duration-300"
                style={{ color: `rgb(var(--brand-light))` }}
              >
                admin@cyberguard.com
              </p>
            </div>
          </div>

          {/* 用户统计卡片 */}
          <div
            className="mb-3 p-3 rounded-xl backdrop-blur-sm"
            style={{
              background: `linear-gradient(135deg, rgba(var(--brand-primary), 0.15) 0%, rgba(var(--brand-accent), 0.1) 100%)`,
              border: `1px solid rgba(var(--brand-primary), 0.2)`,
            }}
          >
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="text-center group cursor-pointer">
                <div
                  className="font-bold text-lg transition-all duration-300 group-hover:scale-110"
                  style={{
                    color: `rgb(var(--brand-lightest))`,
                    textShadow: `0 0 8px rgba(var(--brand-lightest), 0.4)`,
                  }}
                >
                  15
                </div>
                <div style={{ color: `rgb(var(--brand-light))` }}>今日操作</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div
                  className="font-bold text-lg transition-all duration-300 group-hover:scale-110"
                  style={{
                    color: `rgb(var(--success))`,
                    textShadow: `0 0 8px rgba(var(--success), 0.4)`,
                  }}
                >
                  98%
                </div>
                <div style={{ color: `rgb(var(--brand-light))` }}>安全评分</div>
              </div>
            </div>
          </div>

          {/* 退出登录按钮 */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-sm rounded-xl transition-all duration-300 group relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, rgba(var(--error), 0.1) 0%, rgba(var(--warning), 0.05) 100%)`,
              color: `rgb(var(--brand-light))`,
              border: `1px solid rgba(var(--error), 0.2)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, rgba(var(--error), 0.3) 0%, rgba(var(--warning), 0.2) 100%)`;
              e.currentTarget.style.color = `rgb(var(--brand-lightest))`;
              e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
              e.currentTarget.style.boxShadow = `0 8px 24px rgba(var(--error), 0.3)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, rgba(var(--error), 0.1) 0%, rgba(var(--warning), 0.05) 100%)`;
              e.currentTarget.style.color = `rgb(var(--brand-light))`;
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <LogOut
              className="w-4 h-4 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110"
              style={{
                filter: `drop-shadow(0 0 4px rgba(var(--error), 0.4))`,
              }}
            />
            <span className="font-medium">退出登录</span>

            {/* 按钮内部光效 */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `linear-gradient(90deg, transparent 0%, rgba(var(--error), 0.2) 50%, transparent 100%)`,
                animation: "slideRight 2s ease-in-out infinite",
              }}
            />
          </button>
        </div>
      </nav>
    </>
  );
}
