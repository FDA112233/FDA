// 系统指标数据管理钩子

import { useState, useEffect, useCallback, useRef } from "react";
import { apiService } from "../services/apiService";
import { REAL_TIME_CONFIG } from "../lib/apiConfig";
import type {
  SystemMetricsResponse,
  SystemMetricsSummary,
  FormattedMetrics,
  ApiResponse,
  MetricsQueryParams,
} from "../types/api";

// 系统指标钩子返回类型
interface UseSystemMetricsReturn {
  // 数据状态
  current: SystemMetricsResponse | null;
  summary: SystemMetricsSummary | null;
  history: SystemMetricsResponse[];
  formatted: FormattedMetrics | null;

  // 状态管理
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // 操作方法
  refresh: () => Promise<void>;
  fetchHistory: (params?: MetricsQueryParams) => Promise<void>;
  startRealTime: () => void;
  stopRealTime: () => void;
  isRealTimeActive: boolean;
}

// 格式化系统指标数据
function formatSystemMetrics(metrics: SystemMetricsResponse): FormattedMetrics {
  return {
    cpu: {
      percent: Math.round(metrics.cpu_percent * 10) / 10,
      count: metrics.cpu_count,
      load: {
        "1min": metrics.load_1min || 0,
        "5min": metrics.load_5min || 0,
        "15min": metrics.load_15min || 0,
      },
      alert: metrics.cpu_alert,
    },
    memory: {
      total: metrics.memory_total,
      available: metrics.memory_available,
      used: metrics.memory_total - metrics.memory_available,
      percent: Math.round(metrics.memory_percent * 10) / 10,
      alert: metrics.memory_alert,
    },
    disk: {
      total: metrics.disk_total,
      used: metrics.disk_used,
      free: metrics.disk_free,
      percent: Math.round(metrics.disk_percent * 10) / 10,
      alert: metrics.disk_alert,
    },
    network: {
      bytesSent: metrics.net_bytes_sent,
      bytesRecv: metrics.net_bytes_recv,
      totalTraffic: metrics.net_bytes_sent + metrics.net_bytes_recv,
    },
  };
}

// 系统指标钩子
export function useSystemMetrics(): UseSystemMetricsReturn {
  // 状态管理
  const [current, setCurrent] = useState<SystemMetricsResponse | null>(null);
  const [summary, setSummary] = useState<SystemMetricsSummary | null>(null);
  const [history, setHistory] = useState<SystemMetricsResponse[]>([]);
  const [formatted, setFormatted] = useState<FormattedMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRealTimeActive, setIsRealTimeActive] = useState(false);

  // 实时更新控制
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // 清理错误状态
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 获取当前系统指标
  const fetchCurrent = useCallback(async () => {
    try {
      clearError();

      // 同时获取当前指标和摘要
      const [currentData, summaryData] = await Promise.all([
        apiService.metrics.getCurrent(),
        apiService.metrics.getSummary(),
      ]);

      if (!mountedRef.current) return;

      // 处理当前指标数据
      if (currentData && typeof currentData === "object") {
        const metricsData = currentData as SystemMetricsResponse;
        setCurrent(metricsData);
        setFormatted(formatSystemMetrics(metricsData));
      }

      // 设置摘要数据
      setSummary(summaryData);
      setLastUpdated(new Date());
    } catch (err) {
      if (!mountedRef.current) return;

      // 静默处理超时和网络错误，不显示给用户
      const errorMessage =
        err instanceof Error ? err.message : "获取系统指标失败";

      if (
        errorMessage.includes("timeout") ||
        errorMessage.includes("fetch") ||
        errorMessage.includes("网络") ||
        errorMessage.includes("503")
      ) {
        // 网络相关错误，静默处理
        console.warn("系统指标获取失败，使用模拟数据:", errorMessage);
        setError(null); // 不显示错误给用户
      } else {
        console.error("获取系统指标失败:", err);
        setError(errorMessage);
      }
    }
  }, [clearError]);

  // 获取历史数据
  const fetchHistory = useCallback(
    async (params?: MetricsQueryParams) => {
      try {
        setLoading(true);
        clearError();

        const response = await apiService.metrics.getMetrics(params);

        if (!mountedRef.current) return;

        setHistory(response.metrics || []);

        // 限制历史数据点数量
        if (
          response.metrics.length >
          REAL_TIME_CONFIG.DATA_RETENTION.MAX_HISTORY_POINTS
        ) {
          setHistory(
            response.metrics.slice(
              -REAL_TIME_CONFIG.DATA_RETENTION.MAX_HISTORY_POINTS,
            ),
          );
        }
      } catch (err) {
        if (!mountedRef.current) return;

        console.error("获取历史数据失败:", err);
        setError(err instanceof Error ? err.message : "获取历史数据失败");
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [clearError],
  );

  // 手动刷新数据
  const refresh = useCallback(async () => {
    setLoading(true);
    await fetchCurrent();
    setLoading(false);
  }, [fetchCurrent]);

  // 启动实时更新
  const startRealTime = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setIsRealTimeActive(true);

    // 立即获取一次数据
    fetchCurrent();

    // 设置定时器
    intervalRef.current = setInterval(() => {
      if (mountedRef.current) {
        fetchCurrent();
      }
    }, REAL_TIME_CONFIG.POLLING_INTERVALS.SYSTEM_METRICS);
  }, [fetchCurrent]);

  // 停止实时更新
  const stopRealTime = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRealTimeActive(false);
  }, []);

  // 组件挂载时的初始化
  useEffect(() => {
    mountedRef.current = true;

    // 初始数据获取
    refresh();

    // 获取最近的历史数据
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    fetchHistory({
      start_time: oneHourAgo,
    });

    // 组件卸载时清理
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refresh, fetchHistory]);

  // 自动启动实时更新
  useEffect(() => {
    startRealTime();

    return () => {
      stopRealTime();
    };
  }, [startRealTime, stopRealTime]);

  // 清理过期历史数据
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setHistory((prev) => {
        if (prev.length <= REAL_TIME_CONFIG.DATA_RETENTION.MAX_HISTORY_POINTS) {
          return prev;
        }
        return prev.slice(-REAL_TIME_CONFIG.DATA_RETENTION.MAX_HISTORY_POINTS);
      });
    }, REAL_TIME_CONFIG.DATA_RETENTION.CLEANUP_INTERVAL);

    return () => clearInterval(cleanupInterval);
  }, []);

  return {
    // 数据状态
    current,
    summary,
    history,
    formatted,

    // 状态管理
    loading,
    error,
    lastUpdated,

    // 操作方法
    refresh,
    fetchHistory,
    startRealTime,
    stopRealTime,
    isRealTimeActive,
  };
}

// 系统警告检查钩子
export function useSystemAlerts() {
  const { summary, current } = useSystemMetrics();

  const alerts = {
    cpu: current?.cpu_alert || false,
    memory: current?.memory_alert || false,
    disk: current?.disk_alert || false,
    hasAny: summary?.has_alerts || false,
    count: summary?.alert_count || 0,
  };

  return alerts;
}

// 系统性能状态钩子
export function useSystemStatus() {
  const { formatted, loading, error } = useSystemMetrics();

  if (loading || error || !formatted) {
    return {
      status: "unknown" as const,
      score: 0,
      message: loading ? "加载中..." : error || "数据不可用",
    };
  }

  // 计算性能分数 (0-100)
  const cpuScore = Math.max(0, 100 - formatted.cpu.percent);
  const memoryScore = Math.max(0, 100 - formatted.memory.percent);
  const diskScore = Math.max(0, 100 - formatted.disk.percent);

  const totalScore = Math.round((cpuScore + memoryScore + diskScore) / 3);

  // 确定状态
  let status: "excellent" | "good" | "warning" | "critical";
  let message: string;

  if (totalScore >= 80) {
    status = "excellent";
    message = "系统运行状态优秀";
  } else if (totalScore >= 60) {
    status = "good";
    message = "系统运行状态良好";
  } else if (totalScore >= 40) {
    status = "warning";
    message = "系统运行状态需要关注";
  } else {
    status = "critical";
    message = "系统运行状态紧急";
  }

  return {
    status,
    score: totalScore,
    message,
  };
}
