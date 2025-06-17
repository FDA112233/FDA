// API 错误边界组件 - 捕获和处理 API 相关错误

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Database } from "lucide-react";
import { BACKEND_COLORS } from "@/lib/backendTheme";
import { mockApiService } from "@/services/mockApiService";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isRetrying: boolean;
}

export class ApiErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      isRetrying: false,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // 检查是否是 API 相关错误
    const isApiError =
      error.message.includes("fetch") ||
      error.message.includes("timeout") ||
      error.message.includes("网络") ||
      error.name === "AbortError" ||
      error.name === "TimeoutError";

    if (isApiError) {
      // 启用模拟数据模式
      mockApiService.enable();
    }

    return {
      hasError: isApiError,
      error: isApiError ? error : null,
      isRetrying: false,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("API Error Boundary caught an error:", error, errorInfo);

    // 调用外部错误处理函数
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // 如果是网络错误，自动启用模拟数据模式
    if (
      error.message.includes("fetch") ||
      error.message.includes("timeout") ||
      error.name === "AbortError" ||
      error.name === "TimeoutError"
    ) {
      mockApiService.enable();
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleRetry = () => {
    this.setState({ isRetrying: true });

    // 2秒后重置错误状态
    this.retryTimeoutId = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        isRetrying: false,
      });
    }, 2000);
  };

  handleUseMockData = () => {
    mockApiService.enable();
    this.setState({
      hasError: false,
      error: null,
      isRetrying: false,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // 如果提供了自定义 fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认错误 UI
      return (
        <div
          className="min-h-screen flex items-center justify-center p-4"
          style={{
            background: BACKEND_COLORS.backgrounds.secondary,
          }}
        >
          <div
            className="max-w-md w-full p-8 rounded-xl backdrop-blur-md text-center space-y-6"
            style={{
              background: `linear-gradient(135deg, rgba(var(--error), 0.15) 0%, rgba(var(--warning), 0.1) 100%)`,
              border: `1px solid rgba(var(--error), 0.3)`,
              boxShadow: `0 8px 32px rgba(var(--error), 0.2)`,
            }}
          >
            {/* 错误图标 */}
            <div className="flex justify-center">
              <AlertTriangle
                className="w-16 h-16"
                style={{
                  color: `rgb(var(--error))`,
                  filter: `drop-shadow(0 0 12px rgba(var(--error), 0.6))`,
                }}
              />
            </div>

            {/* 错误标题 */}
            <div>
              <h2
                className="text-2xl font-bold mb-2"
                style={{ color: BACKEND_COLORS.text.primary }}
              >
                连接失败
              </h2>
              <p
                className="text-sm"
                style={{ color: BACKEND_COLORS.text.secondary }}
              >
                无法连接到后端服务器
              </p>
            </div>

            {/* 错误详情 */}
            <div
              className="p-4 rounded-lg text-left"
              style={{
                background: `rgba(0, 0, 0, 0.2)`,
                border: `1px solid rgba(var(--error), 0.2)`,
              }}
            >
              <p
                className="text-xs font-mono"
                style={{ color: BACKEND_COLORS.text.muted }}
              >
                {this.state.error.message}
              </p>
            </div>

            {/* 操作按钮 */}
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                disabled={this.state.isRetrying}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: BACKEND_COLORS.buttons.primary.background,
                  color: BACKEND_COLORS.buttons.primary.text,
                  boxShadow: BACKEND_COLORS.buttons.primary.shadow,
                }}
              >
                <RefreshCw
                  className={`w-5 h-5 ${
                    this.state.isRetrying ? "animate-spin" : ""
                  }`}
                />
                <span>{this.state.isRetrying ? "重试中..." : "重试连接"}</span>
              </button>

              <button
                onClick={this.handleUseMockData}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
                style={{
                  background: BACKEND_COLORS.buttons.secondary.background,
                  color: BACKEND_COLORS.buttons.secondary.text,
                  border: `1px solid rgba(var(--info), 0.3)`,
                }}
              >
                <Database className="w-5 h-5" />
                <span>使用演示数据</span>
              </button>
            </div>

            {/* 提示信息 */}
            <div
              className="text-xs space-y-1"
              style={{ color: BACKEND_COLORS.text.muted }}
            >
              <p>后端服务器可能正在维护或暂时不可用</p>
              <p>您可以使用演示数据继续浏览系统功能</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook 版本的错误边界（用于函数组件）
export function useApiErrorHandler() {
  const handleApiError = (error: Error) => {
    console.error("API Error:", error);

    // 检查是否是 API 错误
    if (
      error.message.includes("fetch") ||
      error.message.includes("timeout") ||
      error.name === "AbortError" ||
      error.name === "TimeoutError"
    ) {
      mockApiService.enable();
    }
  };

  return { handleApiError };
}
