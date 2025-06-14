import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search, Shield } from "lucide-react";
import { BusinessCard } from "@/components/ui/BusinessCard";
import { BUSINESS_COLORS } from "@/lib/businessColors";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center pt-16 lg:pt-0 p-8"
      style={{ backgroundColor: BUSINESS_COLORS.ui.background.secondary }}
    >
      <div className="text-center max-w-2xl mx-auto">
        {/* 404 插图 */}
        <div className="mb-8">
          <div
            className="w-32 h-32 mx-auto rounded-2xl flex items-center justify-center mb-6"
            style={{
              backgroundColor: `${BUSINESS_COLORS.primary.blue}20`,
              border: `2px solid ${BUSINESS_COLORS.primary.blue}40`,
            }}
          >
            <div className="text-center">
              <Shield
                className="w-16 h-16 mx-auto mb-2"
                style={{ color: BUSINESS_COLORS.primary.blue }}
              />
              <div
                className="text-6xl font-bold opacity-50"
                style={{ color: BUSINESS_COLORS.primary.blue }}
              >
                404
              </div>
            </div>
          </div>
        </div>

        {/* 错误信息 */}
        <BusinessCard className="mb-8">
          <div className="text-center p-8">
            <h1
              className="text-3xl font-bold mb-4"
              style={{ color: BUSINESS_COLORS.ui.text.primary }}
            >
              页面未找到
            </h1>
            <p
              className="text-lg mb-6"
              style={{ color: BUSINESS_COLORS.ui.text.secondary }}
            >
              抱歉，您访问的页面不存在或已被移动
            </p>
            <div
              className="text-sm mb-8 p-4 rounded-lg"
              style={{
                backgroundColor: BUSINESS_COLORS.ui.background.tertiary,
                color: BUSINESS_COLORS.ui.text.muted,
              }}
            >
              <p>可能的原因：</p>
              <ul className="mt-2 space-y-1 text-left list-disc list-inside">
                <li>URL地址输入错误</li>
                <li>页面已被删除或重命名</li>
                <li>您没有访问权限</li>
                <li>链接已过期</li>
              </ul>
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200"
                style={{
                  backgroundColor: BUSINESS_COLORS.primary.blue,
                  color: "white",
                  boxShadow: BUSINESS_COLORS.shadows.md,
                }}
              >
                <Home className="w-5 h-5" />
                <span>返回首页</span>
              </Link>

              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200"
                style={{
                  backgroundColor: "transparent",
                  color: BUSINESS_COLORS.primary.blue,
                  border: `2px solid ${BUSINESS_COLORS.primary.blue}`,
                }}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>返回上页</span>
              </button>
            </div>
          </div>
        </BusinessCard>

        {/* 快速导航 */}
        <BusinessCard>
          <div>
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: BUSINESS_COLORS.ui.text.primary }}
            >
              快速导航
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "威胁告警", path: "/alerts", icon: "🚨" },
                { name: "安全报告", path: "/reports", icon: "📊" },
                { name: "资产管理", path: "/assets", icon: "💻" },
                { name: "系统设置", path: "/settings", icon: "⚙️" },
              ].map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="flex flex-col items-center p-4 rounded-lg transition-all duration-200 hover:bg-gray-50"
                  style={{
                    border: `1px solid ${BUSINESS_COLORS.ui.border.primary}`,
                  }}
                >
                  <span className="text-2xl mb-2">{item.icon}</span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                  >
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </BusinessCard>

        {/* 帮助信息 */}
        <div className="mt-8 text-center">
          <p
            className="text-sm"
            style={{ color: BUSINESS_COLORS.ui.text.muted }}
          >
            如果问题持续存在，请联系技术支持团队
          </p>
          <p
            className="text-sm mt-2"
            style={{ color: BUSINESS_COLORS.ui.text.muted }}
          >
            邮箱: support@cyberguard.com | 电话: 400-123-4567
          </p>
        </div>
      </div>
    </div>
  );
}
