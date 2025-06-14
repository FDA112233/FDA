/**
 * 商务风格配色系统 - 网络安全企业级平台
 * 专业、简洁、可信赖的商务设计风格
 */

// 主色调系统 - 专业深蓝和灰色系
export const BUSINESS_COLORS = {
  // 主要品牌色
  primary: {
    navy: "#1e3a8a", // 海军蓝 - 主色
    blue: "#2563eb", // 标准蓝 - 强调色
    lightBlue: "#3b82f6", // 浅蓝 - 辅助色
    cyan: "#0891b2", // 青色 - 信息色
  },

  // 中性色系
  neutral: {
    slate: "#0f172a", // 深板岩色 - 背景
    gray: "#1e293b", // 深灰 - 面板
    lightGray: "#334155", // 浅灰 - 边框
    silver: "#64748b", // 银灰 - 次要文本
    white: "#ffffff", // 纯白 - 主要文本
    offWhite: "#f8fafc", // 米白 - 浅色背景
  },

  // 状态色系
  status: {
    success: "#059669", // 成功 - 绿色
    warning: "#d97706", // 警告 - 橙色
    error: "#dc2626", // 错误 - 红色
    info: "#0284c7", // 信息 - 蓝色
    processing: "#7c3aed", // 处理中 - 紫色
  },

  // 威胁等级色彩
  threat: {
    critical: "#dc2626", // 严重 - 红色
    high: "#ea580c", // 高危 - 橙红
    medium: "#d97706", // 中危 - 橙色
    low: "#eab308", // 低危 - 黄色
    info: "#0284c7", // 信息 - 蓝色
  },

  // UI 界面色彩
  ui: {
    background: {
      primary: "#0f172a", // 主背景
      secondary: "#1e293b", // 次要背景
      tertiary: "#334155", // 第三背景
      panel: "#ffffff", // 面板背景
      card: "#f8fafc", // 卡片背景
    },
    border: {
      primary: "#e2e8f0", // 主边框
      secondary: "#cbd5e1", // 次要边框
      accent: "#2563eb", // 强调边框
    },
    text: {
      primary: "#0f172a", // 主要文本
      secondary: "#475569", // 次要文本
      muted: "#64748b", // 弱化文本
      inverse: "#ffffff", // 反色文本
      accent: "#2563eb", // 强调文本
    },
  },

  // 渐变色系
  gradients: {
    primary: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
    secondary: "linear-gradient(135deg, #334155 0%, #475569 100%)",
    success: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
    warning: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
    danger: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
  },

  // 阴影系统
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    card: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    panel: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
};

// 商务主题配置
export const BUSINESS_THEME = {
  // 字体系统
  fonts: {
    primary:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', Consolas, Monaco, monospace",
    display:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  // 圆角系统
  borderRadius: {
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    full: "9999px",
  },

  // 间距系统
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    xxl: "3rem",
  },

  // 动画时长
  animation: {
    fast: "150ms",
    normal: "250ms",
    slow: "350ms",
  },
};

// 获取威胁等级颜色
export const getThreatLevelColor = (level: string): string => {
  switch (level.toLowerCase()) {
    case "critical":
      return BUSINESS_COLORS.threat.critical;
    case "high":
      return BUSINESS_COLORS.threat.high;
    case "medium":
      return BUSINESS_COLORS.threat.medium;
    case "low":
      return BUSINESS_COLORS.threat.low;
    case "info":
      return BUSINESS_COLORS.threat.info;
    default:
      return BUSINESS_COLORS.neutral.silver;
  }
};

// 获取状态颜色
export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "success":
    case "resolved":
    case "online":
      return BUSINESS_COLORS.status.success;
    case "warning":
    case "pending":
      return BUSINESS_COLORS.status.warning;
    case "error":
    case "failed":
    case "offline":
      return BUSINESS_COLORS.status.error;
    case "info":
    case "investigating":
      return BUSINESS_COLORS.status.info;
    case "processing":
      return BUSINESS_COLORS.status.processing;
    default:
      return BUSINESS_COLORS.neutral.silver;
  }
};

// 创建商务风格卡片样式
export const createBusinessCardStyle = (variant: string = "default") => {
  const baseStyle = {
    backgroundColor: BUSINESS_COLORS.ui.background.panel,
    border: `1px solid ${BUSINESS_COLORS.ui.border.primary}`,
    borderRadius: BUSINESS_THEME.borderRadius.lg,
    boxShadow: BUSINESS_COLORS.shadows.card,
  };

  switch (variant) {
    case "primary":
      return {
        ...baseStyle,
        borderColor: BUSINESS_COLORS.primary.blue,
        boxShadow: `0 0 0 1px ${BUSINESS_COLORS.primary.blue}20, ${BUSINESS_COLORS.shadows.card}`,
      };
    case "success":
      return {
        ...baseStyle,
        borderColor: BUSINESS_COLORS.status.success,
        backgroundColor: `${BUSINESS_COLORS.status.success}05`,
      };
    case "warning":
      return {
        ...baseStyle,
        borderColor: BUSINESS_COLORS.status.warning,
        backgroundColor: `${BUSINESS_COLORS.status.warning}05`,
      };
    case "error":
      return {
        ...baseStyle,
        borderColor: BUSINESS_COLORS.status.error,
        backgroundColor: `${BUSINESS_COLORS.status.error}05`,
      };
    default:
      return baseStyle;
  }
};

// 商务风格按钮样式
export const createBusinessButtonStyle = (
  variant: string = "primary",
  size: string = "md",
) => {
  const sizeStyles = {
    sm: {
      padding: "0.5rem 1rem",
      fontSize: "0.875rem",
      minHeight: "2rem",
    },
    md: {
      padding: "0.75rem 1.5rem",
      fontSize: "0.875rem",
      minHeight: "2.5rem",
    },
    lg: {
      padding: "1rem 2rem",
      fontSize: "1rem",
      minHeight: "3rem",
    },
  };

  const baseStyle = {
    borderRadius: BUSINESS_THEME.borderRadius.md,
    fontWeight: "500",
    transition: `all ${BUSINESS_THEME.animation.normal} cubic-bezier(0.4, 0, 0.2, 1)`,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid transparent",
    ...sizeStyles[size as keyof typeof sizeStyles],
  };

  switch (variant) {
    case "primary":
      return {
        ...baseStyle,
        backgroundColor: BUSINESS_COLORS.primary.blue,
        color: BUSINESS_COLORS.neutral.white,
        ":hover": {
          backgroundColor: BUSINESS_COLORS.primary.navy,
          transform: "translateY(-1px)",
          boxShadow: BUSINESS_COLORS.shadows.md,
        },
      };
    case "secondary":
      return {
        ...baseStyle,
        backgroundColor: BUSINESS_COLORS.ui.background.secondary,
        color: BUSINESS_COLORS.ui.text.primary,
        borderColor: BUSINESS_COLORS.ui.border.primary,
        ":hover": {
          backgroundColor: BUSINESS_COLORS.ui.background.tertiary,
          borderColor: BUSINESS_COLORS.ui.border.secondary,
        },
      };
    case "outline":
      return {
        ...baseStyle,
        backgroundColor: "transparent",
        color: BUSINESS_COLORS.primary.blue,
        borderColor: BUSINESS_COLORS.primary.blue,
        ":hover": {
          backgroundColor: BUSINESS_COLORS.primary.blue,
          color: BUSINESS_COLORS.neutral.white,
        },
      };
    case "ghost":
      return {
        ...baseStyle,
        backgroundColor: "transparent",
        color: BUSINESS_COLORS.ui.text.secondary,
        ":hover": {
          backgroundColor: BUSINESS_COLORS.ui.background.secondary,
          color: BUSINESS_COLORS.ui.text.primary,
        },
      };
    default:
      return baseStyle;
  }
};

export default BUSINESS_COLORS;
