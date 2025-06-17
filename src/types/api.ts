// API 响应数据类型定义，基于 FastAPI OpenAPI 规范

// 系统指标相关类型
export interface SystemMetricsResponse {
  cpu_percent: number;
  cpu_count: number;
  memory_total: number;
  memory_available: number;
  memory_percent: number;
  disk_total: number;
  disk_used: number;
  disk_free: number;
  disk_percent: number;
  net_bytes_sent: number;
  net_bytes_recv: number;
  load_1min?: number;
  load_5min?: number;
  load_15min?: number;
  cpu_alert: boolean;
  memory_alert: boolean;
  disk_alert: boolean;
  id: number;
  timestamp: string;
}

export interface SystemMetricsList {
  metrics: SystemMetricsResponse[];
}

export interface SystemMetricsSummary {
  current_cpu_percent: number;
  current_memory_percent: number;
  current_disk_percent: number;
  has_alerts: boolean;
  alert_count: number;
}

// 网络接口相关类型
export interface NetworkInterfaceConfig {
  interface_name: string;
  ip_address?: string;
  netmask?: string;
  mac_address?: string;
  is_up: boolean;
  mtu?: number;
  speed?: number;
  duplex?: string;
}

export interface NetworkInterfaceMetrics {
  id: number;
  timestamp: string;
  interface_name: string;
  bytes_sent: number;
  bytes_recv: number;
  packets_sent: number;
  packets_recv: number;
  errin: number;
  errout: number;
  dropin: number;
  dropout: number;
  config?: NetworkInterfaceConfig;
}

export interface CurrentNetworkInterfaceMetrics {
  timestamp: string;
  interface_name: string;
  bytes_sent: number;
  bytes_recv: number;
  packets_sent: number;
  packets_recv: number;
  errin: number;
  errout: number;
  dropin: number;
  dropout: number;
  config?: NetworkInterfaceConfig;
}

export interface NetworkInterfaceMetricsList {
  metrics: NetworkInterfaceMetrics[];
}

export interface CurrentNetworkInterfaceMetricsList {
  metrics: CurrentNetworkInterfaceMetrics[];
}

// 进程监控相关类型
export interface ProcessMetricsResponse {
  pid: number;
  name: string;
  status: string;
  username?: string;
  cpu_percent: number;
  memory_percent: number;
  memory_rss: number;
  memory_vms: number;
  io_read_bytes?: number;
  io_write_bytes?: number;
  threads_count: number;
  create_time: string;
  id: number;
  timestamp: string;
}

// 网络连接相关类型
export interface NetworkConnectionResponse {
  transport_protocol: string;
  app_protocol?: string;
  url?: string;
  local_address: string;
  local_port: number;
  remote_address: string;
  remote_port: number;
  status: string;
  pid?: number;
  process_name?: string;
  id: number;
  timestamp: string;
}

// 服务状态相关类型
export interface ServiceStatusSimple {
  name: string;
  status: string;
  running: boolean;
}

// 认证相关类型
export interface User {
  username: string;
  is_active: boolean;
  is_superuser: boolean;
  id: number;
  created_at: string;
  updated_at?: string;
}

export interface Token {
  code: number;
  access_token: string;
  token_type: string;
  user: User;
}

export interface UserCreate {
  username: string;
  password: string;
  is_active?: boolean;
  is_superuser?: boolean;
}

export interface UserResponse {
  username: string;
  is_active: boolean;
  is_superuser: boolean;
  id: number;
  created_at: string;
}

// 日志管理相关类型
export interface LogLevelUpdate {
  logger_name: string;
  level: string;
}

// API 响应包装器类型
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  loading: boolean;
}

// API 错误类型
export interface HTTPValidationError {
  detail: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }>;
}

// 实时数据更新类型
export interface RealTimeData {
  systemMetrics: SystemMetricsResponse;
  networkInterfaces: CurrentNetworkInterfaceMetrics[];
  summary: SystemMetricsSummary;
  lastUpdated: Date;
}

// 查询参数类型
export interface MetricsQueryParams {
  start_time?: string;
  end_time?: string;
}

export interface PaginationParams {
  skip?: number;
  limit?: number;
}

// 格式化辅助类型
export interface FormattedMetrics {
  cpu: {
    percent: number;
    count: number;
    load: {
      "1min": number;
      "5min": number;
      "15min": number;
    };
    alert: boolean;
  };
  memory: {
    total: number;
    available: number;
    used: number;
    percent: number;
    alert: boolean;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    percent: number;
    alert: boolean;
  };
  network: {
    bytesSent: number;
    bytesRecv: number;
    totalTraffic: number;
  };
}

// 网络统计汇总类型
export interface NetworkSummary {
  totalInterfaces: number;
  activeInterfaces: number;
  totalTraffic: number;
  totalPackets: number;
  errorRate: number;
  topInterface: {
    name: string;
    traffic: number;
  };
}
