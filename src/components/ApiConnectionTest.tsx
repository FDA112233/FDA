// API 连接测试组件 - 用于调试和测试API连接

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";
import { httpClient } from "@/services/apiService";
import { API_CONFIG } from "@/lib/apiConfig";
import { BACKEND_COLORS } from "@/lib/backendTheme";

interface ApiTestResult {
  endpoint: string;
  status: "pending" | "success" | "error";
  response?: any;
  error?: string;
  duration?: number;
}

export function ApiConnectionTest() {
  const [testResults, setTestResults] = useState<ApiTestResult[]>([]);
  const [testing, setTesting] = useState(false);

  const endpoints = [
    { name: "健康检查", url: "/health" },
    { name: "系统指标摘要", url: "/api/v1/metrics/summary/" },
    { name: "当前系统指标", url: "/api/v1/metrics/current/" },
    { name: "网络接口", url: "/api/v1/metrics/network-interfaces/current/" },
  ];

  const testEndpoint = async (endpoint: string): Promise<ApiTestResult> => {
    const startTime = Date.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时

      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;

      if (response.ok) {
        const data = await response.json();
        return {
          endpoint,
          status: "success",
          response: data,
          duration,
        };
      } else {
        return {
          endpoint,
          status: "error",
          error: `HTTP ${response.status}: ${response.statusText}`,
          duration,
        };
      }
    } catch (error) {
      const duration = Date.now() - startTime;

      // 静默处理网络错误
      let errorMessage = "连接失败";
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          errorMessage = "请求超时";
        } else if (error.message.includes("fetch")) {
          errorMessage = "网络不可达";
        } else {
          errorMessage = error.message;
        }
      }

      return {
        endpoint,
        status: "error",
        error: errorMessage,
        duration,
      };
    }
  };

  const runTests = async () => {
    setTesting(true);
    setTestResults([]);

    console.log(`🧪 开始API连接测试 - 目标服务器: ${API_CONFIG.BASE_URL}`);

    try {
      for (const { name, url } of endpoints) {
        // 添加pending状态
        setTestResults((prev) => [
          ...prev,
          {
            endpoint: `${name} (${url})`,
            status: "pending",
          },
        ]);

        const result = await testEndpoint(url);

        // 更新结果
        setTestResults((prev) =>
          prev.map((item) =>
            item.endpoint === `${name} (${url})`
              ? { ...result, endpoint: `${name} (${url})` }
              : item,
          ),
        );

        // 静默记录结果，避免控制台污染
        if (result.status === "success") {
          console.log(`✅ ${name}: ${result.duration}ms`);
        }

        // 短暂延迟避免过快请求
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    } catch (error) {
      console.warn("测试过程中断:", error);
    } finally {
      setTesting(false);
      console.log("🔧 API测试完成，如所有测试失败则使用模拟数据模式");
    }
  };

  const tryBackendConnection = async () => {
    try {
      const success = await httpClient.tryConnectToBackend();
      if (success) {
        console.log("✅ 后端连接成功！");
        // 重新运行测试
        runTests();
      } else {
        console.warn("❌ 后端连接失败");
      }
    } catch (error) {
      console.error("后端连接错误:", error);
    }
  };

  useEffect(() => {
    // 组件加载时自动运行测试
    runTests();
  }, []);

  return (
    <div
      className="fixed bottom-4 left-4 max-w-md w-full p-4 rounded-xl backdrop-blur-md border shadow-lg z-50"
      style={{
        background: BACKEND_COLORS.backgrounds.card,
        border: `1px solid ${BACKEND_COLORS.borders.primary}`,
        boxShadow: BACKEND_COLORS.shadows.medium,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-lg font-semibold"
          style={{ color: BACKEND_COLORS.text.primary }}
        >
          API 连接测试
        </h3>
        <button
          onClick={runTests}
          disabled={testing}
          className="p-2 rounded-lg transition-colors hover:bg-white hover:bg-opacity-10"
          style={{ color: BACKEND_COLORS.text.secondary }}
        >
          <RefreshCw className={`w-5 h-5 ${testing ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="space-y-2 mb-4">
        <div className="text-xs" style={{ color: BACKEND_COLORS.text.muted }}>
          目标服务器: {API_CONFIG.BASE_URL}
        </div>

        {testResults.map((result, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 rounded-lg"
            style={{
              background: `rgba(${
                result.status === "success"
                  ? "var(--success)"
                  : result.status === "error"
                    ? "var(--error)"
                    : "var(--info)"
              }, 0.1)`,
              border: `1px solid rgba(${
                result.status === "success"
                  ? "var(--success)"
                  : result.status === "error"
                    ? "var(--error)"
                    : "var(--info)"
              }, 0.2)`,
            }}
          >
            <div className="flex items-center space-x-2 flex-1">
              {result.status === "pending" && (
                <Loader2
                  className="w-4 h-4 animate-spin"
                  style={{ color: `rgb(var(--info))` }}
                />
              )}
              {result.status === "success" && (
                <CheckCircle
                  className="w-4 h-4"
                  style={{ color: `rgb(var(--success))` }}
                />
              )}
              {result.status === "error" && (
                <XCircle
                  className="w-4 h-4"
                  style={{ color: `rgb(var(--error))` }}
                />
              )}
              <div className="flex-1 min-w-0">
                <div
                  className="text-sm truncate"
                  style={{ color: BACKEND_COLORS.text.secondary }}
                >
                  {result.endpoint}
                </div>
                {result.error && (
                  <div
                    className="text-xs truncate"
                    style={{ color: `rgb(var(--error))` }}
                  >
                    {result.error}
                  </div>
                )}
              </div>
            </div>
            {result.duration && (
              <div
                className="text-xs"
                style={{ color: BACKEND_COLORS.text.muted }}
              >
                {result.duration}ms
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={tryBackendConnection}
        disabled={testing}
        className="w-full px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
        style={{
          background: BACKEND_COLORS.buttons.primary.background,
          color: BACKEND_COLORS.buttons.primary.text,
          boxShadow: BACKEND_COLORS.buttons.primary.shadow,
        }}
      >
        尝试连接后端
      </button>
    </div>
  );
}
