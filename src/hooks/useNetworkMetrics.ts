// 网络指标数据管理钩子

import { useState, useEffect, useCallback, useRef } from "react";
import { apiService } from "../services/apiService";
import { REAL_TIME_CONFIG, formatBytes } from "../lib/apiConfig";
import type {
  CurrentNetworkInterfaceMetrics,
  NetworkInterfaceMetrics,
  NetworkSummary,
  MetricsQueryParams,
} from "../types/api";

// 网络指标钩子返回类型
interface UseNetworkMetricsReturn {
  // 数据状态
  interfaces: CurrentNetworkInterfaceMetrics[];
  history: Record<string, NetworkInterfaceMetrics[]>;
  summary: NetworkSummary | null;

  // 状态管理
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // 操作方法
  refresh: () => Promise<void>;
  fetchInterfaceHistory: (
    interfaceName: string,
    params?: MetricsQueryParams,
  ) => Promise<void>;
  startRealTime: () => void;
  stopRealTime: () => void;
  isRealTimeActive: boolean;

  // 格式化方法
  formatTraffic: (bytes: number) => string;
  getTopInterface: () => CurrentNetworkInterfaceMetrics | null;
}

// 计算网络摘要
function calculateNetworkSummary(
  interfaces: CurrentNetworkInterfaceMetrics[],
): NetworkSummary {
  const activeInterfaces = interfaces.filter(
    (iface) => iface.config?.is_up !== false,
  );

  const totalTraffic = interfaces.reduce(
    (sum, iface) => sum + iface.bytes_sent + iface.bytes_recv,
    0,
  );

  const totalPackets = interfaces.reduce(
    (sum, iface) => sum + iface.packets_sent + iface.packets_recv,
    0,
  );

  const totalErrors = interfaces.reduce(
    (sum, iface) => sum + iface.errin + iface.errout,
    0,
  );

  const errorRate = totalPackets > 0 ? (totalErrors / totalPackets) * 100 : 0;

  // 找到流量最大的接口
  const topInterface = interfaces.reduce(
    (max, iface) => {
      const traffic = iface.bytes_sent + iface.bytes_recv;
      return traffic > max.traffic
        ? { name: iface.interface_name, traffic }
        : max;
    },
    { name: "", traffic: 0 },
  );

  return {
    totalInterfaces: interfaces.length,
    activeInterfaces: activeInterfaces.length,
    totalTraffic,
    totalPackets,
    errorRate: Math.round(errorRate * 100) / 100,
    topInterface,
  };
}

// 网络指标钩子
export function useNetworkMetrics(): UseNetworkMetricsReturn {
  // 状态管理
  const [interfaces, setInterfaces] = useState<
    CurrentNetworkInterfaceMetrics[]
  >([]);
  const [history, setHistory] = useState<
    Record<string, NetworkInterfaceMetrics[]>
  >({});
  const [summary, setSummary] = useState<NetworkSummary | null>(null);
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

  // 获取当前网络接口数据
  const fetchCurrent = useCallback(async () => {
    try {
      clearError();

      const response = await apiService.network.getCurrentInterfaces();

      if (!mountedRef.current) return;

      const interfaceData = response.metrics || [];
      setInterfaces(interfaceData);

      // 计算网络摘要
      const networkSummary = calculateNetworkSummary(interfaceData);
      setSummary(networkSummary);

      setLastUpdated(new Date());
    } catch (err) {
      if (!mountedRef.current) return;

      console.error("获取网络接口数据失败:", err);
      setError(err instanceof Error ? err.message : "获取网络接口数据失败");
    }
  }, [clearError]);

  // 获取指定接口的历史数据
  const fetchInterfaceHistory = useCallback(
    async (interfaceName: string, params?: MetricsQueryParams) => {
      try {
        setLoading(true);
        clearError();

        const response = await apiService.network.getInterface(
          interfaceName,
          params,
        );

        if (!mountedRef.current) return;

        setHistory((prev) => ({
          ...prev,
          [interfaceName]: response.metrics || [],
        }));
      } catch (err) {
        if (!mountedRef.current) return;

        console.error(`获取网络接口 ${interfaceName} 历史数据失败:`, err);
        setError(
          err instanceof Error ? err.message : "获取网络接口历史数据失败",
        );
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
    }, REAL_TIME_CONFIG.POLLING_INTERVALS.NETWORK_METRICS);
  }, [fetchCurrent]);

  // 停止实时更新
  const stopRealTime = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRealTimeActive(false);
  }, []);

  // 格式化流量数据
  const formatTraffic = useCallback((bytes: number): string => {
    return formatBytes(bytes);
  }, []);

  // 获取流量最大的接口
  const getTopInterface =
    useCallback((): CurrentNetworkInterfaceMetrics | null => {
      if (interfaces.length === 0) return null;

      return interfaces.reduce((max, iface) => {
        const currentTraffic = iface.bytes_sent + iface.bytes_recv;
        const maxTraffic = max.bytes_sent + max.bytes_recv;
        return currentTraffic > maxTraffic ? iface : max;
      });
    }, [interfaces]);

  // 组件挂载时的初始化
  useEffect(() => {
    mountedRef.current = true;

    // 初始数据获取
    refresh();

    // 组件卸载时清理
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refresh]);

  // 自动启动实时更新
  useEffect(() => {
    startRealTime();

    return () => {
      stopRealTime();
    };
  }, [startRealTime, stopRealTime]);

  // 当接口列表变化时，获取主要接口的历史数据
  useEffect(() => {
    const topInterface = getTopInterface();
    if (topInterface && !history[topInterface.interface_name]) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      fetchInterfaceHistory(topInterface.interface_name, {
        start_time: oneHourAgo,
      });
    }
  }, [interfaces, history, getTopInterface, fetchInterfaceHistory]);

  return {
    // 数据状态
    interfaces,
    history,
    summary,

    // 状态管理
    loading,
    error,
    lastUpdated,

    // 操作方法
    refresh,
    fetchInterfaceHistory,
    startRealTime,
    stopRealTime,
    isRealTimeActive,

    // 格式化方法
    formatTraffic,
    getTopInterface,
  };
}

// 网络接口状态钩子
export function useNetworkInterfaceStatus() {
  const { interfaces, summary } = useNetworkMetrics();

  const status = {
    total: summary?.totalInterfaces || 0,
    active: summary?.activeInterfaces || 0,
    inactive:
      (summary?.totalInterfaces || 0) - (summary?.activeInterfaces || 0),
    errorRate: summary?.errorRate || 0,
    hasErrors: (summary?.errorRate || 0) > 1, // 错误率超过 1% 认为有问题
  };

  // 按状态分组接口
  const groupedInterfaces = {
    active: interfaces.filter((iface) => iface.config?.is_up !== false),
    inactive: interfaces.filter((iface) => iface.config?.is_up === false),
    withErrors: interfaces.filter((iface) => iface.errin + iface.errout > 0),
  };

  return {
    status,
    interfaces: groupedInterfaces,
  };
}

// 网络流量趋势钩子
export function useNetworkTrafficTrend(interfaceName?: string) {
  const { interfaces, history } = useNetworkMetrics();
  const [trend, setTrend] = useState<{
    direction: "up" | "down" | "stable";
    percentage: number;
  }>({ direction: "stable", percentage: 0 });

  useEffect(() => {
    if (!interfaceName) {
      // 使用总流量计算趋势
      const totalCurrent = interfaces.reduce(
        (sum, iface) => sum + iface.bytes_sent + iface.bytes_recv,
        0,
      );

      // 简化版本：基于当前数据的变化趋势
      // 实际应用中可以使用历史数据计算更准确的趋势
      setTrend({ direction: "stable", percentage: 0 });
      return;
    }

    const interfaceHistory = history[interfaceName];
    if (!interfaceHistory || interfaceHistory.length < 2) {
      setTrend({ direction: "stable", percentage: 0 });
      return;
    }

    // 计算最近两个数据点的变化
    const recent = interfaceHistory.slice(-2);
    const [prev, current] = recent;

    const prevTraffic = prev.bytes_sent + prev.bytes_recv;
    const currentTraffic = current.bytes_sent + current.bytes_recv;

    if (prevTraffic === 0) {
      setTrend({ direction: "stable", percentage: 0 });
      return;
    }

    const changePercentage =
      ((currentTraffic - prevTraffic) / prevTraffic) * 100;

    let direction: "up" | "down" | "stable";
    if (Math.abs(changePercentage) < 5) {
      direction = "stable";
    } else if (changePercentage > 0) {
      direction = "up";
    } else {
      direction = "down";
    }

    setTrend({
      direction,
      percentage: Math.abs(changePercentage),
    });
  }, [interfaces, history, interfaceName]);

  return trend;
}
