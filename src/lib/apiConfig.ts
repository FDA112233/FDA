// API 配置和基础设置

// API 基础配置
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  VERSION: "v1",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// API 端点路径
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: "/api/v1/auth/auth/login",
    REGISTER: "/api/v1/auth/auth/register",
    ME: "/api/v1/auth/auth/me",
  },

  // 系统指标
  METRICS: {
    BASE: "/api/v1/metrics/",
    SUMMARY: "/api/v1/metrics/summary/",
    CURRENT: "/api/v1/metrics/current/",
    COLLECT: "/api/v1/metrics/collect/",
  },

  // 网络接口
  NETWORK_INTERFACES: {
    BASE: "/api/v1/metrics/network-interfaces/",
    CURRENT: "/api/v1/metrics/network-interfaces/current/",
    BY_NAME: (name: string) => `/api/v1/metrics/network-interfaces/${name}/`,
  },

  // 系统监控
  SYSTEM: {
    PROCESSES: "/api/v1/system/processes",
    PROCESSES_COLLECT: "/api/v1/system/processes/collect",
    NETWORK: "/api/v1/system/network",
    NETWORK_COLLECT: "/api/v1/system/network/collect",
    SERVICES: "/api/v1/system/services",
    SERVICES_COLLECT: "/api/v1/system/services/collect",
    COLLECT_ALL: "/api/v1/system/collect-all",
  },

  // 日志管理
  LOGS: {
    LOG_LEVELS: "/api/v1/logs/log-levels",
    LOG_LEVEL: "/api/v1/logs/log-level",
    AVAILABLE_LOG_LEVELS: "/api/v1/logs/available-log-levels",
  },

  // 健康检查
  HEALTH: "/health",
} as const;

// 实时数据更新配置
export const REAL_TIME_CONFIG = {
  // 轮询间隔（毫秒）
  POLLING_INTERVALS: {
    SYSTEM_METRICS: 2000, // 2秒
    NETWORK_METRICS: 3000, // 3秒
    PROCESS_METRICS: 5000, // 5秒
    SERVICE_STATUS: 10000, // 10秒
  },

  // 数据保留配置
  DATA_RETENTION: {
    MAX_HISTORY_POINTS: 100, // 最大历史数据点
    CLEANUP_INTERVAL: 60000, // 清理间隔 1分钟
  },
} as const;

// HTTP 请求头配置
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
} as const;

// 错误消息映射
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "网络连接失败，请检查网络设置",
  TIMEOUT_ERROR: "请求超时，请稍后重试",
  AUTH_ERROR: "认证失败，请重新登录",
  SERVER_ERROR: "服务器内部错误，请联系管理员",
  VALIDATION_ERROR: "数据验证失败，请检查输入",
  NOT_FOUND: "请求的资源不存在",
  PERMISSION_DENIED: "权限不足，无法访问该资源",
  UNKNOWN_ERROR: "未知错误，请稍后重试",
} as const;

// HTTP 状态码映射
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

// 构建完整的 API URL
export function buildApiUrl(endpoint: string): string {
  const baseUrl = API_CONFIG.BASE_URL.replace(/\/+$/, ""); // 移除末尾斜杠
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${baseUrl}${path}`;
}

// 构建查询参数
export function buildQueryParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

// 延迟函数（用于重���机制）
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 格式化字节大小
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

// 格式化百分比
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// 格式化时间戳
export function formatTimestamp(timestamp: string | Date): string {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

// 计算时间差（用于数据新鲜度判断）
export function getTimeDifference(timestamp: string | Date): number {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  return Date.now() - date.getTime();
}

// 判断数据是否过期
export function isDataStale(
  timestamp: string | Date,
  maxAgeMs: number = 30000,
): boolean {
  return getTimeDifference(timestamp) > maxAgeMs;
}
