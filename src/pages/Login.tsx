import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Eye,
  EyeOff,
  User,
  Lock,
  AlertTriangle,
  Loader,
  CheckCircle,
  Building,
  Globe,
} from "lucide-react";
import { BusinessCard, AlertCard } from "@/components/ui/BusinessCard";
import { BUSINESS_COLORS } from "@/lib/businessColors";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // 检查是否已经登录，如果已登录则重定向到首页
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 模拟登录验证
    setTimeout(() => {
      if (formData.username === "admin" && formData.password === "123456") {
        // 使用AuthContext的login方法
        login(formData.username);
        // 导航到首页
        navigate("/", { replace: true });
      } else {
        setError("用户名或密码错误");
      }
      setLoading(false);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: BUSINESS_COLORS.neutral.slate }}
    >
      {/* 左侧 - 品牌展示区域 */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative">
        {/* 渐变背景 */}
        <div
          className="absolute inset-0"
          style={{ background: BUSINESS_COLORS.gradients.primary }}
        />

        {/* 内容容器 */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          {/* 主标题区域 */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              >
                <Shield className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4">CyberGuard</h1>
            <p className="text-xl text-blue-100 mb-2">企业级网络安全管理平台</p>
            <p className="text-blue-200">
              全方位保护您的数字资产，确保业务安全可靠运行
            </p>
          </div>

          {/* 特性展示 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            <div className="flex items-start space-x-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              >
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">实时监控</h3>
                <p className="text-blue-100 text-sm">
                  24/7 全天候网络安全监控，实时发现和响应威胁
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              >
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">企业级安全</h3>
                <p className="text-blue-100 text-sm">
                  符合行业标准的企业级安全解决方案
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              >
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">威胁情报</h3>
                <p className="text-blue-100 text-sm">
                  全球威胁情报网络，提供最新的安全态势信息
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              >
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">合规管理</h3>
                <p className="text-blue-100 text-sm">
                  满足各种行业法规和合规要求的安全管理
                </p>
              </div>
            </div>
          </div>

          {/* 底部状态 */}
          <div className="mt-12 text-center">
            <div className="flex items-center justify-center space-x-2 text-blue-200">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">系统状态正常 • 全球节点在线</span>
            </div>
          </div>
        </div>

        {/* 装饰性图案 */}
        <div className="absolute bottom-0 left-0 w-full h-32 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
        </div>
      </div>

      {/* 右侧 - 登录表单区域 */}
      <div
        className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-8"
        style={{ backgroundColor: BUSINESS_COLORS.ui.background.card }}
      >
        <div className="w-full max-w-md">
          {/* 移动端Logo */}
          <div className="lg:hidden text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4"
              style={{
                backgroundColor: BUSINESS_COLORS.primary.blue,
                boxShadow: BUSINESS_COLORS.shadows.lg,
              }}
            >
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1
              className="text-2xl font-bold mb-1"
              style={{ color: BUSINESS_COLORS.ui.text.primary }}
            >
              CyberGuard
            </h1>
            <p style={{ color: BUSINESS_COLORS.ui.text.secondary }}>
              企业级网络安全管理平台
            </p>
          </div>

          {/* 登录表单容器 */}
          <BusinessCard size="lg" className="shadow-xl" elevated glow>
            {/* 表单标题 */}
            <div className="text-center mb-8">
              <div className="mb-4">
                <div
                  className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center animate-pulse-glow"
                  style={{
                    backgroundColor: BUSINESS_COLORS.primary.blue,
                    boxShadow: `0 0 30px ${BUSINESS_COLORS.primary.blue}40`,
                  }}
                >
                  <Shield className="w-8 h-8 text-white animate-float" />
                </div>
              </div>
              <h2
                className="text-2xl font-bold mb-2 gradient-text"
                style={{ color: BUSINESS_COLORS.ui.text.primary }}
              >
                登录控制台
              </h2>
              <p style={{ color: BUSINESS_COLORS.ui.text.secondary }}>
                请输入您的凭据以访问安全管理控制台
              </p>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="mb-6">
                <AlertCard type="error" title="登录失败" message={error} />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 用户名输入 */}
              <div className="relative">
                <label
                  className="block text-sm font-medium mb-2 transition-colors duration-300"
                  style={{ color: BUSINESS_COLORS.ui.text.primary }}
                >
                  用户名
                </label>
                <div className="relative group">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 enhanced-icon transition-all duration-300 group-focus-within:scale-110"
                    style={{ color: BUSINESS_COLORS.ui.text.muted }}
                  />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="请输入用户名"
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none transition-all duration-300 enhanced-button"
                    style={{
                      borderColor: BUSINESS_COLORS.ui.border.primary,
                      backgroundColor: BUSINESS_COLORS.ui.background.card,
                      color: BUSINESS_COLORS.ui.text.primary,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = BUSINESS_COLORS.primary.blue;
                      e.target.style.boxShadow = `0 0 0 4px ${BUSINESS_COLORS.primary.blue}20, 0 0 20px ${BUSINESS_COLORS.primary.blue}20`;
                      e.target.style.transform = "translateY(-2px)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor =
                        BUSINESS_COLORS.ui.border.primary;
                      e.target.style.boxShadow = "none";
                      e.target.style.transform = "translateY(0)";
                    }}
                    required
                  />

                  {/* 输入框底部光效 */}
                  <div
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 opacity-0 group-focus-within:opacity-100"
                    style={{ width: formData.username ? "100%" : "0%" }}
                  />
                </div>
              </div>

              {/* 密码输入 */}
              <div className="relative">
                <label
                  className="block text-sm font-medium mb-2 transition-colors duration-300"
                  style={{ color: BUSINESS_COLORS.ui.text.primary }}
                >
                  密码
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 enhanced-icon transition-all duration-300 group-focus-within:scale-110"
                    style={{ color: BUSINESS_COLORS.ui.text.muted }}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="请输入密码"
                    className="w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none transition-all duration-300 enhanced-button"
                    style={{
                      borderColor: BUSINESS_COLORS.ui.border.primary,
                      backgroundColor: BUSINESS_COLORS.ui.background.card,
                      color: BUSINESS_COLORS.ui.text.primary,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = BUSINESS_COLORS.primary.blue;
                      e.target.style.boxShadow = `0 0 0 4px ${BUSINESS_COLORS.primary.blue}20, 0 0 20px ${BUSINESS_COLORS.primary.blue}20`;
                      e.target.style.transform = "translateY(-2px)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor =
                        BUSINESS_COLORS.ui.border.primary;
                      e.target.style.boxShadow = "none";
                      e.target.style.transform = "translateY(0)";
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 enhanced-icon hover:scale-110"
                    style={{ color: BUSINESS_COLORS.ui.text.muted }}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>

                  {/* 输入框底部光效 */}
                  <div
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 opacity-0 group-focus-within:opacity-100"
                    style={{ width: formData.password ? "100%" : "0%" }}
                  />
                </div>
              </div>

              {/* 登录按钮 */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed enhanced-button relative overflow-hidden group"
                style={{
                  backgroundColor: BUSINESS_COLORS.primary.blue,
                  color: "white",
                  boxShadow: `0 4px 20px ${BUSINESS_COLORS.primary.blue}40`,
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor =
                      BUSINESS_COLORS.primary.navy;
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = `0 8px 30px ${BUSINESS_COLORS.primary.blue}60`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor =
                      BUSINESS_COLORS.primary.blue;
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = `0 4px 20px ${BUSINESS_COLORS.primary.blue}40`;
                  }
                }}
              >
                {/* 按钮背景动效 */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>

                <div className="relative flex items-center justify-center space-x-3">
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>验证中...</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 enhanced-icon group-hover:rotate-12" />
                      <span>登录系统</span>
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* 演示信息 */}
            <div
              className="mt-8 pt-6 border-t"
              style={{ borderColor: BUSINESS_COLORS.ui.border.primary }}
            >
              <div
                className="rounded-lg p-4"
                style={{
                  backgroundColor: BUSINESS_COLORS.ui.background.secondary,
                }}
              >
                <div className="text-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span style={{ color: BUSINESS_COLORS.ui.text.secondary }}>
                      演示账号:
                    </span>
                    <code
                      className="px-2 py-1 rounded font-mono text-sm"
                      style={{
                        backgroundColor: BUSINESS_COLORS.primary.blue,
                        color: "white",
                      }}
                    >
                      admin
                    </code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: BUSINESS_COLORS.ui.text.secondary }}>
                      演示密码:
                    </span>
                    <code
                      className="px-2 py-1 rounded font-mono text-sm"
                      style={{
                        backgroundColor: BUSINESS_COLORS.primary.blue,
                        color: "white",
                      }}
                    >
                      123456
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </BusinessCard>

          {/* 版权信息 */}
          <div className="mt-8 text-center">
            <p
              className="text-sm"
              style={{ color: BUSINESS_COLORS.ui.text.muted }}
            >
              © 2024 CyberGuard Security Platform. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
