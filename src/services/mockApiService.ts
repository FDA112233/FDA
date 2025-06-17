// 模拟 API 数据服务 - 当后端不可用时提供假数据

import type {
  SystemMetricsResponse,
  SystemMetricsList,
  SystemMetricsSummary,
  CurrentNetworkInterfaceMetrics,
  CurrentNetworkInterfaceMetricsList,
  NetworkInterfaceMetricsList,
  ProcessMetricsResponse,
  NetworkConnectionResponse,
  ServiceStatusSimple,
  MetricsQueryParams,
  PaginationParams,
} from "../types/api";

// 生成随机数据的辅助函数
function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomInt(min: number, max: number): number {
  return Math.floor(randomBetween(min, max));
}

// 模拟网络接口配置
const mockNetworkInterfaces = [
  { name: "eth0", isUp: true, ip: "192.168.1.100" },
  { name: "lo", isUp: true, ip: "127.0.0.1" },
  { name: "wlan0", isUp: true, ip: "192.168.1.101" },
  { name: "docker0", isUp: false, ip: "172.17.0.1" },
];

// 模拟系统指标数据
export function generateMockSystemMetrics(): SystemMetricsResponse {
  const timestamp = new Date().toISOString();
  const cpuPercent = randomBetween(15, 85);
  const memoryPercent = randomBetween(40, 90);
  const diskPercent = randomBetween(30, 70);

  return {
    id: randomInt(1000, 9999),
    timestamp,
    cpu_percent: Math.round(cpuPercent * 10) / 10,
    cpu_count: 8,
    memory_total: 16 * 1024 * 1024 * 1024, // 16GB
    memory_available: (16 * 1024 * 1024 * 1024 * (100 - memoryPercent)) / 100,
    memory_percent: Math.round(memoryPercent * 10) / 10,
    disk_total: 500 * 1024 * 1024 * 1024, // 500GB
    disk_used: (500 * 1024 * 1024 * 1024 * diskPercent) / 100,
    disk_free: (500 * 1024 * 1024 * 1024 * (100 - diskPercent)) / 100,
    disk_percent: Math.round(diskPercent * 10) / 10,
    net_bytes_sent: randomInt(1000000000, 9999999999), // 1-10GB
    net_bytes_recv: randomInt(1000000000, 9999999999), // 1-10GB
    load_1min: randomBetween(0.5, 3.0),
    load_5min: randomBetween(0.8, 2.5),
    load_15min: randomBetween(1.0, 2.0),
    cpu_alert: cpuPercent > 80,
    memory_alert: memoryPercent > 85,
    disk_alert: diskPercent > 80,
  };
}

// 模拟系统指标摘要
export function generateMockSystemSummary(): SystemMetricsSummary {
  const currentMetrics = generateMockSystemMetrics();
  const alertCount = [
    currentMetrics.cpu_alert,
    currentMetrics.memory_alert,
    currentMetrics.disk_alert,
  ].filter(Boolean).length;

  return {
    current_cpu_percent: currentMetrics.cpu_percent,
    current_memory_percent: currentMetrics.memory_percent,
    current_disk_percent: currentMetrics.disk_percent,
    has_alerts: alertCount > 0,
    alert_count: alertCount,
  };
}

// 模拟网络接口数据
export function generateMockNetworkInterfaces(): CurrentNetworkInterfaceMetrics[] {
  return mockNetworkInterfaces.map((iface) => ({
    timestamp: new Date().toISOString(),
    interface_name: iface.name,
    bytes_sent: randomInt(100000000, 999999999), // 100MB-1GB
    bytes_recv: randomInt(100000000, 999999999), // 100MB-1GB
    packets_sent: randomInt(1000000, 9999999),
    packets_recv: randomInt(1000000, 9999999),
    errin: randomInt(0, 100),
    errout: randomInt(0, 100),
    dropin: randomInt(0, 50),
    dropout: randomInt(0, 50),
    config: {
      interface_name: iface.name,
      ip_address: iface.ip,
      netmask: "255.255.255.0",
      mac_address: `00:${randomInt(10, 99)}:${randomInt(10, 99)}:${randomInt(10, 99)}:${randomInt(10, 99)}:${randomInt(10, 99)}`,
      is_up: iface.isUp,
      mtu: 1500,
      speed: iface.name === "lo" ? null : randomInt(100, 1000),
      duplex: iface.name === "lo" ? null : "full",
    },
  }));
}

// 模拟历史数据
export function generateMockHistoryData(
  count: number = 50,
): SystemMetricsResponse[] {
  const history: SystemMetricsResponse[] = [];
  const baseTime = Date.now() - count * 60 * 1000; // 过去N分钟

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(baseTime + i * 60 * 1000).toISOString();
    const metrics = generateMockSystemMetrics();
    history.push({
      ...metrics,
      id: 1000 + i,
      timestamp,
    });
  }

  return history;
}

// 模拟进程数据
export function generateMockProcesses(
  count: number = 20,
): ProcessMetricsResponse[] {
  const processNames = [
    "chrome",
    "firefox",
    "code",
    "node",
    "python",
    "nginx",
    "mysql",
    "redis",
    "docker",
    "sshd",
    "systemd",
    "kernel",
    "NetworkManager",
    "pulseaudio",
    "gnome-shell",
    "Xorg",
    "teamviewer",
    "zoom",
    "slack",
    "spotify",
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    pid: randomInt(1000, 99999),
    name: processNames[i % processNames.length],
    status: Math.random() > 0.1 ? "running" : "sleeping",
    username: Math.random() > 0.5 ? "user" : "root",
    cpu_percent: randomBetween(0, 15),
    memory_percent: randomBetween(0.5, 10),
    memory_rss: randomInt(50000000, 500000000), // 50MB-500MB
    memory_vms: randomInt(100000000, 1000000000), // 100MB-1GB
    io_read_bytes: Math.random() > 0.3 ? randomInt(1000000, 100000000) : null,
    io_write_bytes: Math.random() > 0.3 ? randomInt(1000000, 50000000) : null,
    threads_count: randomInt(1, 20),
    create_time: new Date(
      Date.now() - randomInt(3600000, 86400000 * 7),
    ).toISOString(),
    timestamp: new Date().toISOString(),
  }));
}

// 模拟网络连接
export function generateMockNetworkConnections(
  count: number = 15,
): NetworkConnectionResponse[] {
  const protocols = ["TCP", "UDP"];
  const appProtocols = ["HTTP", "HTTPS", "SSH", "FTP", "DNS", "SMTP"];
  const statuses = ["ESTABLISHED", "LISTEN", "TIME_WAIT", "CLOSE_WAIT"];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    transport_protocol: protocols[randomInt(0, protocols.length)],
    app_protocol:
      Math.random() > 0.3
        ? appProtocols[randomInt(0, appProtocols.length)]
        : null,
    url: Math.random() > 0.7 ? `https://example${i}.com` : null,
    local_address: "192.168.1.100",
    local_port: randomInt(1024, 65535),
    remote_address: `${randomInt(1, 255)}.${randomInt(1, 255)}.${randomInt(1, 255)}.${randomInt(1, 255)}`,
    remote_port: randomInt(80, 8080),
    status: statuses[randomInt(0, statuses.length)],
    pid: Math.random() > 0.2 ? randomInt(1000, 99999) : null,
    process_name:
      Math.random() > 0.2
        ? ["chrome", "firefox", "node", "nginx"][randomInt(0, 4)]
        : null,
    timestamp: new Date().toISOString(),
  }));
}

// 模拟服务状态
export function generateMockServices(): ServiceStatusSimple[] {
  const services = [
    { name: "nginx", running: true },
    { name: "mysql", running: true },
    { name: "redis", running: true },
    { name: "docker", running: true },
    { name: "ssh", running: true },
    { name: "firewall", running: true },
    { name: "apache2", running: false },
    { name: "postgresql", running: false },
  ];

  return services.map((service) => ({
    name: service.name,
    status: service.running ? "active" : "inactive",
    running: service.running,
  }));
}

// 延迟函数（模拟网络延迟）
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 模拟 API 服务类
export class MockApiService {
  private static instance: MockApiService;
  private isEnabled: boolean = false;

  static getInstance(): MockApiService {
    if (!MockApiService.instance) {
      MockApiService.instance = new MockApiService();
    }
    return MockApiService.instance;
  }

  enable(): void {
    this.isEnabled = true;
    console.warn("🔧 模拟 API 服务已启用 - 后端服务器不可用，使用模拟数据");
  }

  disable(): void {
    this.isEnabled = false;
  }

  isActive(): boolean {
    return this.isEnabled;
  }

  // 模拟系统指标 API
  async getSystemMetrics(
    params?: MetricsQueryParams,
  ): Promise<SystemMetricsList> {
    await delay(randomInt(100, 500)); // 模拟网络延迟

    const count = params?.start_time ? 50 : 10;
    return {
      metrics: generateMockHistoryData(count),
    };
  }

  async getSystemSummary(): Promise<SystemMetricsSummary> {
    await delay(randomInt(50, 200));
    return generateMockSystemSummary();
  }

  async getCurrentSystemMetrics(): Promise<SystemMetricsResponse> {
    await delay(randomInt(50, 200));
    return generateMockSystemMetrics();
  }

  // 模拟网络接口 API
  async getCurrentNetworkInterfaces(): Promise<CurrentNetworkInterfaceMetricsList> {
    await delay(randomInt(100, 300));
    return {
      metrics: generateMockNetworkInterfaces(),
    };
  }

  async getNetworkInterface(
    name: string,
    params?: MetricsQueryParams,
  ): Promise<NetworkInterfaceMetricsList> {
    await delay(randomInt(100, 400));

    // 生成指定接口的历史数据
    const count = 30;
    const baseTime = Date.now() - count * 60 * 1000;
    const metrics = Array.from({ length: count }, (_, i) => {
      const timestamp = new Date(baseTime + i * 60 * 1000).toISOString();
      const interfaceData = generateMockNetworkInterfaces().find(
        (iface) => iface.interface_name === name,
      );

      return {
        id: i + 1,
        timestamp,
        interface_name: name,
        bytes_sent: randomInt(100000, 999999),
        bytes_recv: randomInt(100000, 999999),
        packets_sent: randomInt(1000, 9999),
        packets_recv: randomInt(1000, 9999),
        errin: randomInt(0, 10),
        errout: randomInt(0, 10),
        dropin: randomInt(0, 5),
        dropout: randomInt(0, 5),
        config: interfaceData?.config || null,
      };
    });

    return { metrics };
  }

  // 模拟系统监控 API
  async getProcesses(
    params?: PaginationParams,
  ): Promise<ProcessMetricsResponse[]> {
    await delay(randomInt(200, 500));
    const limit = params?.limit || 20;
    const skip = params?.skip || 0;

    const allProcesses = generateMockProcesses(100);
    return allProcesses.slice(skip, skip + limit);
  }

  async getNetworkConnections(
    params?: PaginationParams,
  ): Promise<NetworkConnectionResponse[]> {
    await delay(randomInt(200, 500));
    const limit = params?.limit || 15;
    const skip = params?.skip || 0;

    const allConnections = generateMockNetworkConnections(50);
    return allConnections.slice(skip, skip + limit);
  }

  async getServices(params?: PaginationParams): Promise<ServiceStatusSimple[]> {
    await delay(randomInt(100, 300));
    return generateMockServices();
  }

  // 健康检查
  async healthCheck(): Promise<{ status: string }> {
    await delay(50);
    return { status: "ok" };
  }
}

// 导出单例实例
export const mockApiService = MockApiService.getInstance();
