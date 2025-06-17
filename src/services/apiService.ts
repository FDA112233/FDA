// API 服务层 - 处理所有后端 API 调用

import {
  API_CONFIG,
  API_ENDPOINTS,
  DEFAULT_HEADERS,
  ERROR_MESSAGES,
  HTTP_STATUS,
  buildApiUrl,
  buildQueryParams,
  delay,
} from "../lib/apiConfig";

import { mockApiService } from "./mockApiService";

import type {
  SystemMetricsResponse,
  SystemMetricsList,
  SystemMetricsSummary,
  NetworkInterfaceMetricsList,
  CurrentNetworkInterfaceMetricsList,
  ProcessMetricsResponse,
  NetworkConnectionResponse,
  ServiceStatusSimple,
  Token,
  UserCreate,
  UserResponse,
  MetricsQueryParams,
  PaginationParams,
  LogLevelUpdate,
  ApiResponse,
} from "../types/api";

// API 错误类
class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// 基础 HTTP 客户端类
class HttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private backendAvailable: boolean = false; // 默认假设后端不可用
  private mockMode: boolean = true; // 默认使用模拟模式

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.defaultHeaders = { ...DEFAULT_HEADERS };
    // 立即启用模拟数据模式
    mockApiService.enable();
    console.log("🔧 API 服务初始化为模拟数据模式");
  }

  // 设置认证令牌
  setAuthToken(token: string): void {
    this.defaultHeaders.Authorization = `Bearer ${token}`;
  }

  // 移除认证令牌
  removeAuthToken(): void {
    delete this.defaultHeaders.Authorization;
  }

  // 手动检查后端连接（只在用户明确要求时执行）
  async tryConnectToBackend(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(buildApiUrl("/health"), {
        method: "GET",
        headers: this.defaultHeaders,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        this.backendAvailable = true;
        this.mockMode = false;
        mockApiService.disable();
        console.log("✅ 成功连接到后端服务器");
        return true;
      }
    } catch (error) {
      // 静默处理连接失败
    }

    this.backendAvailable = false;
    this.mockMode = true;
    mockApiService.enable();
    return false;
  }

  // 强制使用模拟数据模式
  enableMockMode(): void {
    this.mockMode = true;
    this.backendAvailable = false;
    mockApiService.enable();
  }

  // 检查是否在模拟模式
  isMockMode(): boolean {
    return this.mockMode || !this.backendAvailable;
  }

  // 通用请求方法
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    // 检查后端健康状态
    await this.checkBackendHealth();

    // 如果后端不可用，直接抛出503错误
    if (!this.backendAvailable) {
      throw new ApiError("后端服务器不可用", 503);
    }

    const url = buildApiUrl(endpoint);

    // 创建可控制的超时信号
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      signal: options.signal || controller.signal,
    };

    let lastError: Error;

    // 减少重试次数，防止过多超时
    const maxRetries = this.backendAvailable ? API_CONFIG.RETRY_ATTEMPTS : 1;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, config);

        clearTimeout(timeoutId);

        // 处理 HTTP 错误状态
        if (!response.ok) {
          const errorData = await this.parseErrorResponse(response);
          throw new ApiError(
            this.getErrorMessage(response.status, errorData),
            response.status,
            errorData,
          );
        }

        // 解析响应数据
        const data = await this.parseResponse<T>(response);
        return data;
      } catch (error) {
        clearTimeout(timeoutId);
        lastError = error as Error;

        // 处理各种错误类型
        if (
          error instanceof TypeError ||
          error instanceof DOMException ||
          (error as any).name === "AbortError" ||
          (error as any).name === "TimeoutError"
        ) {
          // 网络错误、超时错误或中止错误
          this.backendAvailable = false;
          mockApiService.enable();
          throw new ApiError("网络连接失败或超时", 503);
        }

        // 如果是最后一次重试或者是不可重试的错误，直接抛出
        if (
          attempt === maxRetries ||
          (error instanceof ApiError &&
            (error.status === HTTP_STATUS.UNAUTHORIZED ||
              error.status === HTTP_STATUS.FORBIDDEN ||
              error.status === HTTP_STATUS.NOT_FOUND))
        ) {
          throw error;
        }

        // 等待后重试（但只对非网络错误重试）
        if (!(error instanceof TypeError) && !(error instanceof DOMException)) {
          await delay(API_CONFIG.RETRY_DELAY * attempt);
        } else {
          // 网络错误不重试
          break;
        }
      }
    }

    throw lastError!;
  }

  // 解析响应数据
  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      return await response.json();
    }

    return (await response.text()) as unknown as T;
  }

  // 解析错误响应
  private async parseErrorResponse(response: Response): Promise<any> {
    try {
      return await response.json();
    } catch {
      return { message: response.statusText };
    }
  }

  // 获取错误消息
  private getErrorMessage(status: number, errorData?: any): string {
    switch (status) {
      case HTTP_STATUS.BAD_REQUEST:
        return errorData?.detail?.[0]?.msg || ERROR_MESSAGES.VALIDATION_ERROR;
      case HTTP_STATUS.UNAUTHORIZED:
        return ERROR_MESSAGES.AUTH_ERROR;
      case HTTP_STATUS.FORBIDDEN:
        return ERROR_MESSAGES.PERMISSION_DENIED;
      case HTTP_STATUS.NOT_FOUND:
        return ERROR_MESSAGES.NOT_FOUND;
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        return ERROR_MESSAGES.SERVER_ERROR;
      case HTTP_STATUS.BAD_GATEWAY:
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return errorData?.message || ERROR_MESSAGES.UNKNOWN_ERROR;
    }
  }

  // GET 请求
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = params ? `${endpoint}${buildQueryParams(params)}` : endpoint;
    return this.request<T>(url, { method: "GET" });
  }

  // POST 请求
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT 请求
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE 请求
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  // 表单数据请求（用于 OAuth2 登录）
  async postForm<T>(
    endpoint: string,
    data: Record<string, string>,
  ): Promise<T> {
    const formData = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    return this.request<T>(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });
  }
}

// 创建 HTTP 客户端实例
const httpClient = new HttpClient();

// 系统指标 API 服务
export const metricsApi = {
  // 获取系统指标历史数据
  getMetrics: async (
    params?: MetricsQueryParams,
  ): Promise<SystemMetricsList> => {
    try {
      return await httpClient.get(API_ENDPOINTS.METRICS.BASE, params);
    } catch (error) {
      if (error instanceof ApiError && error.status === 503) {
        return await mockApiService.getSystemMetrics(params);
      }
      throw error;
    }
  },

  // 获取系统指标摘要
  getSummary: async (): Promise<SystemMetricsSummary> => {
    try {
      return await httpClient.get(API_ENDPOINTS.METRICS.SUMMARY);
    } catch (error) {
      if (error instanceof ApiError && error.status === 503) {
        return await mockApiService.getSystemSummary();
      }
      throw error;
    }
  },

  // 获取当前系统指标
  getCurrent: async (): Promise<Record<string, any>> => {
    try {
      return await httpClient.get(API_ENDPOINTS.METRICS.CURRENT);
    } catch (error) {
      if (error instanceof ApiError && error.status === 503) {
        return await mockApiService.getCurrentSystemMetrics();
      }
      throw error;
    }
  },

  // 收集系统指标
  collect: async (): Promise<Record<string, any>> => {
    try {
      return await httpClient.post(API_ENDPOINTS.METRICS.COLLECT);
    } catch (error) {
      if (error instanceof ApiError && error.status === 503) {
        // 模拟收集成功
        return { status: "collected", timestamp: new Date().toISOString() };
      }
      throw error;
    }
  },
};

// 网络接口 API 服务
export const networkApi = {
  // 获取网络接口历史数据
  getInterfaces: async (
    params?: MetricsQueryParams,
  ): Promise<NetworkInterfaceMetricsList> => {
    try {
      return await httpClient.get(
        API_ENDPOINTS.NETWORK_INTERFACES.BASE,
        params,
      );
    } catch (error) {
      if (error instanceof ApiError && error.status === 503) {
        // 返回空的历史数据
        return { metrics: [] };
      }
      throw error;
    }
  },

  // 获取当前网络接口数据
  getCurrentInterfaces:
    async (): Promise<CurrentNetworkInterfaceMetricsList> => {
      try {
        return await httpClient.get(API_ENDPOINTS.NETWORK_INTERFACES.CURRENT);
      } catch (error) {
        if (error instanceof ApiError && error.status === 503) {
          return await mockApiService.getCurrentNetworkInterfaces();
        }
        throw error;
      }
    },

  // 获取指定网络接口数据
  getInterface: async (
    name: string,
    params?: MetricsQueryParams,
  ): Promise<NetworkInterfaceMetricsList> => {
    try {
      return await httpClient.get(
        API_ENDPOINTS.NETWORK_INTERFACES.BY_NAME(name),
        params,
      );
    } catch (error) {
      if (error instanceof ApiError && error.status === 503) {
        return await mockApiService.getNetworkInterface(name, params);
      }
      throw error;
    }
  },
};

// 系统监控 API 服务
export const systemApi = {
  // 获取进程信息
  getProcesses: async (
    params?: PaginationParams,
  ): Promise<ProcessMetricsResponse[]> => {
    try {
      return await httpClient.get(API_ENDPOINTS.SYSTEM.PROCESSES, params);
    } catch (error) {
      if (error instanceof ApiError && error.status === 503) {
        return await mockApiService.getProcesses(params);
      }
      throw error;
    }
  },

  // 收集进程信息
  collectProcesses: async (): Promise<ProcessMetricsResponse[]> => {
    try {
      return await httpClient.post(API_ENDPOINTS.SYSTEM.PROCESSES_COLLECT);
    } catch (error) {
      if (error instanceof ApiError && error.status === 503) {
        return await mockApiService.getProcesses();
      }
      throw error;
    }
  },

  // 获取网络连接
  getNetworkConnections: async (
    params?: PaginationParams,
  ): Promise<NetworkConnectionResponse[]> => {
    try {
      return await httpClient.get(API_ENDPOINTS.SYSTEM.NETWORK, params);
    } catch (error) {
      if (error instanceof ApiError && error.status === 503) {
        return await mockApiService.getNetworkConnections(params);
      }
      throw error;
    }
  },

  // 收集网络连接
  collectNetworkConnections: async (): Promise<NetworkConnectionResponse[]> => {
    try {
      return await httpClient.post(API_ENDPOINTS.SYSTEM.NETWORK_COLLECT);
    } catch (error) {
      if (error instanceof ApiError && error.status === 503) {
        return await mockApiService.getNetworkConnections();
      }
      throw error;
    }
  },

  // 获取服务状态
  getServices: async (
    params?: PaginationParams,
  ): Promise<ServiceStatusSimple[]> => {
    try {
      return await httpClient.get(API_ENDPOINTS.SYSTEM.SERVICES, params);
    } catch (error) {
      if (error instanceof ApiError && error.status === 503) {
        return await mockApiService.getServices(params);
      }
      throw error;
    }
  },

  // 收集服务状态
  collectServices: async (): Promise<ServiceStatusSimple[]> => {
    try {
      return await httpClient.post(API_ENDPOINTS.SYSTEM.SERVICES_COLLECT);
    } catch (error) {
      if (error instanceof ApiError && error.status === 503) {
        return await mockApiService.getServices();
      }
      throw error;
    }
  },

  // 收集所有系统数据
  collectAll: async (): Promise<any> => {
    try {
      return await httpClient.post(API_ENDPOINTS.SYSTEM.COLLECT_ALL);
    } catch (error) {
      if (error instanceof ApiError && error.status === 503) {
        return { status: "collected", timestamp: new Date().toISOString() };
      }
      throw error;
    }
  },
};

// 认证 API 服务
export const authApi = {
  // 用户登录
  login: (username: string, password: string): Promise<Token> =>
    httpClient.postForm(API_ENDPOINTS.AUTH.LOGIN, {
      username,
      password,
      grant_type: "password",
    }),

  // 用户注册
  register: (userData: UserCreate): Promise<UserResponse> =>
    httpClient.post(API_ENDPOINTS.AUTH.REGISTER, userData),

  // 获取当前用户信息
  getMe: (): Promise<UserResponse> => httpClient.get(API_ENDPOINTS.AUTH.ME),

  // 设置认证令牌
  setToken: (token: string): void => {
    httpClient.setAuthToken(token);
    localStorage.setItem("auth_token", token);
  },

  // 移除认证令牌
  removeToken: (): void => {
    httpClient.removeAuthToken();
    localStorage.removeItem("auth_token");
  },

  // 从本地存储恢复令牌
  restoreToken: (): string | null => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      httpClient.setAuthToken(token);
    }
    return token;
  },
};

// 日志管理 API 服务
export const logsApi = {
  // 获取日志级别
  getLogLevels: (): Promise<Record<string, any>> =>
    httpClient.get(API_ENDPOINTS.LOGS.LOG_LEVELS),

  // 更新日志级别
  updateLogLevel: (data: LogLevelUpdate): Promise<Record<string, any>> =>
    httpClient.put(API_ENDPOINTS.LOGS.LOG_LEVEL, data),

  // 获取可用日志级别
  getAvailableLogLevels: (): Promise<Record<string, any>> =>
    httpClient.get(API_ENDPOINTS.LOGS.AVAILABLE_LOG_LEVELS),
};

// 健康检查 API 服务
export const healthApi = {
  // 健康检查
  check: async (): Promise<any> => {
    try {
      return await httpClient.get(API_ENDPOINTS.HEALTH);
    } catch (error) {
      if (error instanceof ApiError && error.status === 503) {
        return await mockApiService.healthCheck();
      }
      throw error;
    }
  },
};

// 统一的 API 服务导出
export const apiService = {
  metrics: metricsApi,
  network: networkApi,
  system: systemApi,
  auth: authApi,
  logs: logsApi,
  health: healthApi,
};

// 导出 HTTP 客户端（用于特殊场景）
export { httpClient };

// 导出错误类
export { ApiError };
