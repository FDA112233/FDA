import { useAuth } from "@/contexts/AuthContext";
import { BUSINESS_COLORS } from "@/lib/businessColors";

export default function TestIndex() {
  const { user, logout } = useAuth();

  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: BUSINESS_COLORS.ui.background.secondary }}
    >
      <div className="max-w-4xl mx-auto">
        <div
          className="bg-white rounded-lg p-8 shadow-lg"
          style={{
            backgroundColor: BUSINESS_COLORS.ui.background.panel,
            boxShadow: BUSINESS_COLORS.shadows.lg,
          }}
        >
          <h1
            className="text-3xl font-bold mb-4"
            style={{ color: BUSINESS_COLORS.ui.text.primary }}
          >
            欢迎使用 CyberGuard 网络安全管理平台
          </h1>

          <div className="mb-6">
            <p
              className="text-lg mb-2"
              style={{ color: BUSINESS_COLORS.ui.text.secondary }}
            >
              当前登录用户: <strong>{user}</strong>
            </p>
            <p
              className="text-sm"
              style={{ color: BUSINESS_COLORS.ui.text.muted }}
            >
              您已成功登录后台管理界面
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: BUSINESS_COLORS.ui.background.card,
                borderColor: BUSINESS_COLORS.ui.border.primary,
              }}
            >
              <h3
                className="font-semibold mb-2"
                style={{ color: BUSINESS_COLORS.ui.text.primary }}
              >
                威胁监控
              </h3>
              <p
                className="text-sm"
                style={{ color: BUSINESS_COLORS.ui.text.secondary }}
              >
                实时监控网络威胁和安全事件
              </p>
            </div>

            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: BUSINESS_COLORS.ui.background.card,
                borderColor: BUSINESS_COLORS.ui.border.primary,
              }}
            >
              <h3
                className="font-semibold mb-2"
                style={{ color: BUSINESS_COLORS.ui.text.primary }}
              >
                资产管理
              </h3>
              <p
                className="text-sm"
                style={{ color: BUSINESS_COLORS.ui.text.secondary }}
              >
                管理和监控网络资产安全状态
              </p>
            </div>

            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: BUSINESS_COLORS.ui.background.card,
                borderColor: BUSINESS_COLORS.ui.border.primary,
              }}
            >
              <h3
                className="font-semibold mb-2"
                style={{ color: BUSINESS_COLORS.ui.text.primary }}
              >
                安全报告
              </h3>
              <p
                className="text-sm"
                style={{ color: BUSINESS_COLORS.ui.text.secondary }}
              >
                生成和查看安全分析报告
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="px-6 py-2 rounded-lg font-medium transition-all duration-200"
            style={{
              backgroundColor: BUSINESS_COLORS.status.error,
              color: "white",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            退出登录
          </button>
        </div>
      </div>
    </div>
  );
}
