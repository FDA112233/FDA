/**
 * 统一科技风配色方案 - Tech-Style Unified Color Scheme
 * 专为3D态势感知平台设计的现代化科技配色系统
 */

// 核心科技配色 - Core Tech Colors
export const TECH_COLORS = {
  // 主要科技色彩 - Primary Tech Colors
  primary: {
    neon: "#00f5ff", // 霓虹蓝 - Neon Blue
    cyber: "#7928ca", // 赛博紫 - Cyber Purple
    matrix: "#39ff14", // 矩阵绿 - Matrix Green
    plasma: "#ff0080", // 等离子粉 - Plasma Pink
    quantum: "#00d4ff", // 量子蓝 - Quantum Blue
    neural: "#ff6b35", // 神经橙 - Neural Orange
  },

  // 状���指示色 - Status Colors
  status: {
    online: "#39ff14", // 在线 - 亮绿
    warning: "#ffaa00", // 警告 - 金橙
    critical: "#ff0040", // 危险 - 亮红
    offline: "#666677", // 离线 - 暗灰
    processing: "#00f5ff", // 处理中 - 霓虹蓝
    standby: "#9966ff", // 待机 - 紫色
  },

  // 网络层级色彩 - Network Layer Colors
  network: {
    core: "#ff0080", // 核心层 - 等离子粉
    edge: "#00f5ff", // 边缘层 - 霓虹蓝
    access: "#39ff14", // 接入层 - 矩阵绿
    backbone: "#7928ca", // 骨干网 - 赛博紫
    satellite: "#ffaa00", // 卫星链路 - 金橙
    fiber: "#00d4ff", // 光纤 - 量子蓝
  },

  // 威胁等级色彩 - Threat Level Colors
  threat: {
    safe: "#39ff14", // 安全 - 矩阵绿
    low: "#00d4ff", // 低威胁 - 量子蓝
    medium: "#ffaa00", // 中威胁 - 金橙
    high: "#ff6b35", // 高威胁 - 神经橙
    critical: "#ff0040", // 极危险 - 亮红
    unknown: "#9966ff", // 未知 - 紫色
  },

  // 数据类型色彩 - Data Type Colors
  data: {
    traffic: "#00f5ff", // 流量数据 - 霓虹蓝
    security: "#ff0080", // 安全数据 - 等离子粉
    system: "#39ff14", // 系统数据 - 矩阵绿
    user: "#ffaa00", // 用户数据 - 金橙
    application: "#7928ca", // 应用数据 - 赛博紫
    network: "#00d4ff", // 网络数据 - 量子蓝
  },

  // UI界面色彩 - UI Interface Colors
  ui: {
    background: {
      primary: "#000511", // 主背景 - 深空黑
      secondary: "#0a0f1c", // 次背景 - 深蓝黑
      panel: "#111827", // 面板背景 - 暗蓝灰
      overlay: "rgba(0, 5, 17, 0.9)", // 覆盖层 - 半透明黑
      glass: "rgba(17, 24, 39, 0.7)", // 玻璃效果 - 半透明灰
    },
    text: {
      primary: "#ffffff", // 主文本 - 纯白
      secondary: "#ccddff", // 次文本 - 浅蓝白
      accent: "#00f5ff", // 强调文本 - 霓虹蓝
      muted: "#88aacc", // 辅助文本 - 蓝灰
      warning: "#ffaa00", // 警告文本 - 金橙
      error: "#ff0040", // 错误文本 - 亮红
    },
    border: {
      primary: "#334155", // 主边框 - 深蓝灰
      accent: "#00f5ff", // 强调边框 - 霓虹蓝
      glow: "#7928ca", // 发光边框 - 赛博紫
      success: "#39ff14", // 成功边框 - 矩阵绿
      warning: "#ffaa00", // 警告边框 - 金橙
      danger: "#ff0040", // 危险边框 - 亮红
    },
  },

  // 3D材质专用色彩 - 3D Material Colors
  material: {
    building: {
      base: "#1a2332", // 建筑基础色 - 深蓝灰
      highlight: "#00f5ff", // 建筑高亮 - 霓虹蓝
      emissive: "#7928ca", // 建筑发光 - 赛博紫
      window: "#39ff14", // 窗口光 - 矩阵绿
    },
    platform: {
      base: "#0f1419", // 平台基础 - 极深灰
      grid: "#334155", // 网格线 - 深蓝灰
      highlight: "#00f5ff", // 平台高亮 - 霓虹蓝
      energy: "#ff0080", // 能量场 - 等离子粉
    },
    effects: {
      particle: "#00f5ff", // 粒子效果 - 霓虹蓝
      beam: "#39ff14", // 光束效果 - 矩阵绿
      scan: "#ff0080", // 扫描线 - 等离子粉
      hologram: "#7928ca", // 全息影像 - 赛博紫
      portal: "#00d4ff", // 传送门 - 量子蓝
      explosion: "#ff6b35", // 爆炸效果 - 神经橙
    },
  },

  // 梯度配色 - Gradient Colors
  gradients: {
    cyber: "linear-gradient(135deg, #7928ca 0%, #ff0080 100%)",
    matrix: "linear-gradient(135deg, #39ff14 0%, #00f5ff 100%)",
    plasma: "linear-gradient(135deg, #ff0080 0%, #ff6b35 100%)",
    quantum: "linear-gradient(135deg, #00d4ff 0%, #7928ca 100%)",
    neural: "linear-gradient(135deg, #ff6b35 0%, #ffaa00 100%)",
    void: "linear-gradient(135deg, #000511 0%, #0a0f1c 100%)",
  },
} as const;

// 威胁等级到颜色的映射
export const THREAT_LEVEL_MAP = {
  0: TECH_COLORS.threat.safe,
  1: TECH_COLORS.threat.safe,
  2: TECH_COLORS.threat.low,
  3: TECH_COLORS.threat.low,
  4: TECH_COLORS.threat.medium,
  5: TECH_COLORS.threat.medium,
  6: TECH_COLORS.threat.high,
  7: TECH_COLORS.threat.high,
  8: TECH_COLORS.threat.critical,
  9: TECH_COLORS.threat.critical,
  10: TECH_COLORS.threat.critical,
} as const;

// 网络状态到颜色的映射
export const STATUS_COLOR_MAP = {
  online: TECH_COLORS.status.online,
  offline: TECH_COLORS.status.offline,
  warning: TECH_COLORS.status.warning,
  critical: TECH_COLORS.status.critical,
  processing: TECH_COLORS.status.processing,
  standby: TECH_COLORS.status.standby,
} as const;

// 数据类型到颜色的映射
export const DATA_TYPE_COLOR_MAP = {
  traffic: TECH_COLORS.data.traffic,
  security: TECH_COLORS.data.security,
  system: TECH_COLORS.data.system,
  user: TECH_COLORS.data.user,
  application: TECH_COLORS.data.application,
  network: TECH_COLORS.data.network,
} as const;

/**
 * 获取威胁等级对应的颜色
 */
export function getThreatLevelColor(level: number): string {
  const clampedLevel = Math.max(
    0,
    Math.min(10, Math.floor(level)),
  ) as keyof typeof THREAT_LEVEL_MAP;
  return THREAT_LEVEL_MAP[clampedLevel];
}

/**
 * 获取状态对应的颜色
 */
export function getStatusColor(status: keyof typeof STATUS_COLOR_MAP): string {
  return STATUS_COLOR_MAP[status] || TECH_COLORS.status.offline;
}

/**
 * 获取数据类型对应的颜色
 */
export function getDataTypeColor(
  dataType: keyof typeof DATA_TYPE_COLOR_MAP,
): string {
  return DATA_TYPE_COLOR_MAP[dataType] || TECH_COLORS.data.system;
}

/**
 * 根据性能值获取颜色（0-100）
 */
export function getPerformanceColor(value: number): string {
  if (value >= 90) return TECH_COLORS.threat.critical;
  if (value >= 75) return TECH_COLORS.threat.high;
  if (value >= 50) return TECH_COLORS.threat.medium;
  if (value >= 25) return TECH_COLORS.threat.low;
  return TECH_COLORS.threat.safe;
}

/**
 * 创建发光效果CSS
 */
export function createGlowEffect(color: string, intensity: number = 1): string {
  return `0 0 ${10 * intensity}px ${color}66, 0 0 ${20 * intensity}px ${color}44, 0 0 ${30 * intensity}px ${color}22`;
}

/**
 * 创建脉冲动画关键帧
 */
export function createPulseAnimation(color: string): string {
  return `
    @keyframes pulse-${color.replace("#", "")} {
      0%, 100% { 
        box-shadow: 0 0 5px ${color}66;
        opacity: 1;
      }
      50% { 
        box-shadow: 0 0 20px ${color}99, 0 0 30px ${color}66;
        opacity: 0.8;
      }
    }
  `;
}

/**
 * 科技风主题配置
 */
export const TECH_THEME = {
  // 边框圆角
  borderRadius: {
    none: "0px",
    small: "4px",
    medium: "8px",
    large: "12px",
    xl: "16px",
    full: "9999px",
  },

  // 阴影效果
  shadows: {
    glow: (color: string) => `0 0 20px ${color}66`,
    neon: (color: string) =>
      `0 0 10px ${color}, 0 0 20px ${color}, 0 0 40px ${color}`,
    cyber: `0 8px 32px rgba(121, 40, 202, 0.3)`,
    matrix: `0 8px 32px rgba(57, 255, 20, 0.3)`,
    plasma: `0 8px 32px rgba(255, 0, 128, 0.3)`,
  },

  // 动画配置
  animations: {
    duration: {
      fast: "0.15s",
      normal: "0.3s",
      slow: "0.5s",
      ultra: "1s",
    },
    easing: {
      ease: "ease",
      easeIn: "ease-in",
      easeOut: "ease-out",
      easeInOut: "ease-in-out",
      cyber: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    },
  },

  // 字体配置
  fonts: {
    mono: "'JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata', monospace",
    display: "'Orbitron', 'Exo 2', 'Rajdhani', sans-serif",
    body: "'Inter', 'SF Pro Display', 'Segoe UI', sans-serif",
  },

  // 尺寸配置
  sizing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.25rem",
    xl: "1.5rem",
    "2xl": "2rem",
    "3xl": "2.5rem",
    "4xl": "3rem",
  },

  // 透明度配置
  opacity: {
    hidden: "0",
    low: "0.1",
    medium: "0.3",
    high: "0.7",
    almost: "0.9",
    full: "1",
  },
} as const;

/**
 * 3D场景配置
 */
export const TECH_3D_CONFIG = {
  // 光照配置
  lighting: {
    ambient: {
      color: TECH_COLORS.ui.text.secondary,
      intensity: 0.3,
    },
    directional: {
      color: TECH_COLORS.primary.neon,
      intensity: 0.8,
      position: [50, 50, 50] as [number, number, number],
    },
    point: {
      color: TECH_COLORS.primary.cyber,
      intensity: 1.2,
      position: [0, 30, 0] as [number, number, number],
    },
    spot: {
      color: TECH_COLORS.primary.matrix,
      intensity: 1.0,
      position: [0, 50, 0] as [number, number, number],
    },
  },

  // 环境配置
  environment: {
    backgroundColor: TECH_COLORS.ui.background.primary,
    fogColor: TECH_COLORS.ui.background.secondary,
    fogNear: 50,
    fogFar: 200,
    gridColor: TECH_COLORS.ui.border.primary,
    platformColor: TECH_COLORS.material.platform.base,
  },

  // 材质配置
  materials: {
    building: {
      color: TECH_COLORS.material.building.base,
      emissive: TECH_COLORS.material.building.emissive,
      emissiveIntensity: 0.2,
      roughness: 0.3,
      metalness: 0.8,
    },
    platform: {
      color: TECH_COLORS.material.platform.base,
      emissive: TECH_COLORS.material.platform.energy,
      emissiveIntensity: 0.1,
      roughness: 0.1,
      metalness: 0.9,
    },
    glass: {
      color: TECH_COLORS.primary.neon,
      transparent: true,
      opacity: 0.3,
      roughness: 0.0,
      metalness: 0.1,
    },
  },

  // 粒子系统配置
  particles: {
    count: 3000,
    size: 2,
    color: TECH_COLORS.material.effects.particle,
    speed: 0.5,
    spread: 100,
    opacity: 0.8,
  },

  // 动画配置
  animations: {
    rotation: {
      speed: 0.01,
      direction: 1,
    },
    pulse: {
      speed: 2.0,
      amplitude: 0.1,
    },
    float: {
      speed: 1.0,
      amplitude: 0.5,
    },
    scan: {
      speed: 1.5,
      range: 50,
    },
  },
} as const;

export default TECH_COLORS;
