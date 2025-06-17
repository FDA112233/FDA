/**
 * 统一企业级网络安全配色系统
 * 基于专业的深蓝色调和现代化商务设计
 * 优化的配色方案，确保整个应用视觉一致性
 */

// 核心色彩定义 - 基于深蓝主色调
const CORE_COLORS = {
  // ���品牌色系 - 深蓝到浅蓝渐变
  brand: {
    darkest: "#0c1e3a", // 最深蓝 - 背景深色
    dark: "#1e3a8a", // 深蓝 - 主色
    primary: "#2563eb", // 标准蓝 - 强调色
    light: "#3b82f6", // 浅蓝 - 辅助色
    lightest: "#93c5fd", // 最浅蓝 - 轻量色
    accent: "#06b6d4", // 青色 - 点缀色
  },

  // 中性灰度色系 - 从深到浅
  neutral: {
    black: "#000000", // 纯黑
    darkest: "#0f172a", // 最深灰 - 深色背景
    dark: "#1e293b", // 深灰 - 面板背景
    medium: "#334155", // 中灰 - 边框
    light: "#64748b", // 浅灰 - 次要文本
    lighter: "#94a3b8", // 更浅灰 - 占位符
    lightest: "#e2e8f0", // 最浅灰 - 分割线
    white: "#ffffff", // 纯白
  },

  // 功能性色彩 - 状态指示
  functional: {
    success: "#10b981", // 成功绿
    warning: "#f59e0b", // 警告橙
    error: "#ef4444", // 错误红
    info: "#06b6d4", // 信息青
    processing: "#8b5cf6", // 处理紫
  },

  // 威胁等级专用色彩
  threat: {
    critical: "#dc2626", // 严重威胁 - 深红
    high: "#ea580c", // 高危威胁 - 橙红
    medium: "#d97706", // 中等威胁 - 橙色
    low: "#eab308", // 低危威胁 - 黄色
    safe: "#10b981", // 安全状态 - 绿色
  },
};

// 主要配色系统 - 基于核心色彩的完整主题
export const BUSINESS_COLORS = {
  // 主色调系统
  primary: {
    darkest: CORE_COLORS.brand.darkest,
    dark: CORE_COLORS.brand.dark,
    main: CORE_COLORS.brand.primary,
    light: CORE_COLORS.brand.light,
    lightest: CORE_COLORS.brand.lightest,
    accent: CORE_COLORS.brand.accent,
  },

  // 中性色系 - 统一的灰度色阶
  neutral: {
    black: CORE_COLORS.neutral.black,
    900: CORE_COLORS.neutral.darkest,
    800: CORE_COLORS.neutral.dark,
    700: CORE_COLORS.neutral.medium,
    600: CORE_COLORS.neutral.light,
    500: CORE_COLORS.neutral.lighter,
    400: CORE_COLORS.neutral.lightest,
    white: CORE_COLORS.neutral.white,
  },

  // 状态色系 - 功能性色彩
  status: {
    success: CORE_COLORS.functional.success,
    warning: CORE_COLORS.functional.warning,
    error: CORE_COLORS.functional.error,
    info: CORE_COLORS.functional.info,
    processing: CORE_COLORS.functional.processing,
  },

  // 威胁等级色彩 - 安全专用
  threat: {
    critical: CORE_COLORS.threat.critical,
    high: CORE_COLORS.threat.high,
    medium: CORE_COLORS.threat.medium,
    low: CORE_COLORS.threat.low,
    safe: CORE_COLORS.threat.safe,
  },

  // UI界面配色 - 统一的界面色彩系统
  ui: {
    background: {
      primary: CORE_COLORS.neutral.darkest, // 主背景 - 深色
      secondary: CORE_COLORS.neutral.dark, // 次要背景 - 中深色
      tertiary: CORE_COLORS.neutral.medium, // 第三背景 - 中色
      panel: CORE_COLORS.neutral.white, // 面板背景 - 白色
      card: "#f8fafc", // 卡片背景 - 浅灰白
      overlay: "rgba(15, 23, 42, 0.8)", // 遮罩背景 - 半透明
      glass: "rgba(255, 255, 255, 0.1)", // 玻璃效果 - 半透明白
    },

    border: {
      primary: CORE_COLORS.neutral.lightest, // 主边框
      secondary: "#cbd5e1", // 次要边框
      accent: CORE_COLORS.brand.primary, // 强调边框
      subtle: "rgba(226, 232, 240, 0.6)", // 微妙边框
    },

    text: {
      primary: CORE_COLORS.neutral.darkest, // 主要文本 - 深色
      secondary: "#475569", // 次要文本 - 中灰
      muted: CORE_COLORS.neutral.light, // 弱化文本 - 浅灰
      inverse: CORE_COLORS.brand.lightest, // 反色文本 - 浅蓝色替代白色
      brightPrimary: CORE_COLORS.brand.lightest, // 明亮主色 - 用于替代白色
      glowAccent: CORE_COLORS.brand.accent, // 发光强调色
      accent: CORE_COLORS.brand.primary, // 强调文本 - 蓝色
      disabled: CORE_COLORS.neutral.lighter, // 禁用文本 - 浅灰
    },

    surface: {
      raised: CORE_COLORS.neutral.white, // 抬起表面
      sunken: "#f1f5f9", // 凹陷表面
      interactive: "#f8fafc", // 交互表面
      hover: "#f1f5f9", // 悬停表面
      active: CORE_COLORS.brand.lightest, // 激活表面
      selected: `${CORE_COLORS.brand.primary}15`, // 选中表面
    },
  },

  // 3D场景专用色彩
  scene3d: {
    background: {
      primary: CORE_COLORS.neutral.darkest,
      gradient: `linear-gradient(135deg, ${CORE_COLORS.neutral.darkest} 0%, ${CORE_COLORS.neutral.dark} 100%)`,
      space: "#0a0e1a", // 深空背景
    },

    lighting: {
      ambient: "#ffffff", // 环境光
      directional: "#ffffff", // 方向光
      point: CORE_COLORS.brand.primary, // 点光源
      accent: CORE_COLORS.brand.accent, // 强调光
    },

    materials: {
      metal: {
        primary: CORE_COLORS.brand.primary,
        secondary: CORE_COLORS.neutral.light,
        accent: CORE_COLORS.brand.accent,
      },
      glass: {
        primary: "rgba(59, 130, 246, 0.3)",
        secondary: "rgba(255, 255, 255, 0.1)",
        accent: "rgba(6, 182, 212, 0.4)",
      },
      glow: {
        success: `${CORE_COLORS.functional.success}80`,
        warning: `${CORE_COLORS.functional.warning}80`,
        error: `${CORE_COLORS.functional.error}80`,
        info: `${CORE_COLORS.functional.info}80`,
      },
    },

    particles: {
      default: CORE_COLORS.brand.lightest,
      data: CORE_COLORS.brand.accent,
      threat: CORE_COLORS.threat.critical,
      secure: CORE_COLORS.functional.success,
    },
  },

  // 渐变色系 - 统一的渐变方案
  gradients: {
    primary: `linear-gradient(135deg, ${CORE_COLORS.brand.dark} 0%, ${CORE_COLORS.brand.primary} 100%)`,
    secondary: `linear-gradient(135deg, ${CORE_COLORS.neutral.dark} 0%, ${CORE_COLORS.neutral.medium} 100%)`,
    accent: `linear-gradient(135deg, ${CORE_COLORS.brand.primary} 0%, ${CORE_COLORS.brand.accent} 100%)`,
    success: `linear-gradient(135deg, ${CORE_COLORS.functional.success} 0%, #34d399 100%)`,
    warning: `linear-gradient(135deg, ${CORE_COLORS.functional.warning} 0%, #fbbf24 100%)`,
    error: `linear-gradient(135deg, ${CORE_COLORS.functional.error} 0%, #f87171 100%)`,
    glass: `linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)`,
    surface: `linear-gradient(145deg, ${CORE_COLORS.neutral.white} 0%, #f8fafc 100%)`,
  },

  // 阴影系统 - 统一的投影效果
  shadows: {
    xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",

    // 特殊阴影效果
    card: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    panel:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    modal:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    glow: `0 0 20px ${CORE_COLORS.brand.primary}40`,
    glowStrong: `0 0 30px ${CORE_COLORS.brand.primary}60`,

    // 3D特效阴影
    floating: "0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)",
    pressed: "inset 0 1px 3px rgba(0, 0, 0, 0.12)",
  },

  // 透明度系统
  opacity: {
    disabled: 0.38,
    hint: 0.6,
    secondary: 0.74,
    medium: 0.87,
    high: 0.95,
  },
};

// 主题配置 - 统一的设计规范
export const BUSINESS_THEME = {
  // 字体系统 - 专业字体栈
  fonts: {
    primary:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    secondary: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, Monaco, monospace",
    display: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },

  // 字体大小系统
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
  },

  // 字重系统
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // 行高系统
  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // 圆角系统
  borderRadius: {
    none: "0",
    xs: "0.125rem", // 2px
    sm: "0.25rem", // 4px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    xl: "0.75rem", // 12px
    "2xl": "1rem", // 16px
    "3xl": "1.5rem", // 24px
    full: "9999px",
  },

  // 间距系统 - 8像素基准
  spacing: {
    px: "1px",
    0: "0",
    1: "0.25rem", // 4px
    2: "0.5rem", // 8px
    3: "0.75rem", // 12px
    4: "1rem", // 16px
    5: "1.25rem", // 20px
    6: "1.5rem", // 24px
    7: "1.75rem", // 28px
    8: "2rem", // 32px
    10: "2.5rem", // 40px
    12: "3rem", // 48px
    16: "4rem", // 64px
    20: "5rem", // 80px
    24: "6rem", // 96px
  },

  // 动画时长
  animation: {
    instant: "50ms",
    fast: "150ms",
    normal: "250ms",
    slow: "350ms",
    slower: "500ms",
    slowest: "750ms",
  },

  // 动画缓动
  easing: {
    linear: "linear",
    ease: "ease",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },

  // Z-index层级
  zIndex: {
    auto: "auto",
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
};

// 工具函数 - 统一的颜色操作
export const colorUtils = {
  // 获取威胁等级颜色
  getThreatColor: (level: string): string => {
    switch (level.toLowerCase()) {
      case "critical":
        return BUSINESS_COLORS.threat.critical;
      case "high":
        return BUSINESS_COLORS.threat.high;
      case "medium":
        return BUSINESS_COLORS.threat.medium;
      case "low":
        return BUSINESS_COLORS.threat.low;
      case "safe":
        return BUSINESS_COLORS.threat.safe;
      default:
        return BUSINESS_COLORS.neutral[500];
    }
  },

  // 获取状态颜色
  getStatusColor: (status: string): string => {
    switch (status.toLowerCase()) {
      case "success":
      case "resolved":
      case "online":
      case "active":
        return BUSINESS_COLORS.status.success;
      case "warning":
      case "pending":
      case "investigating":
        return BUSINESS_COLORS.status.warning;
      case "error":
      case "failed":
      case "offline":
      case "critical":
        return BUSINESS_COLORS.status.error;
      case "info":
      case "scanning":
      case "processing":
        return BUSINESS_COLORS.status.info;
      default:
        return BUSINESS_COLORS.neutral[500];
    }
  },

  // 添加透明度
  withOpacity: (color: string, opacity: number): string => {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },

  // 创建渐变
  createGradient: (colors: string[], direction: string = "135deg"): string => {
    return `linear-gradient(${direction}, ${colors.join(", ")})`;
  },
};

// 组件样式生成器 - 统一的组件样式
export const styleGenerators = {
  // 卡片样式
  card: (variant: string = "default") => {
    const baseStyle = {
      backgroundColor: BUSINESS_COLORS.ui.background.panel,
      border: `1px solid ${BUSINESS_COLORS.ui.border.primary}`,
      borderRadius: BUSINESS_THEME.borderRadius.lg,
      boxShadow: BUSINESS_COLORS.shadows.card,
      transition: `all ${BUSINESS_THEME.animation.normal} ${BUSINESS_THEME.easing.easeInOut}`,
    };

    const variants = {
      default: baseStyle,
      primary: {
        ...baseStyle,
        borderColor: BUSINESS_COLORS.primary.main,
        boxShadow: `0 0 0 1px ${BUSINESS_COLORS.primary.main}20, ${BUSINESS_COLORS.shadows.card}`,
      },
      glass: {
        ...baseStyle,
        backgroundColor: BUSINESS_COLORS.ui.background.glass,
        backdropFilter: "blur(10px)",
        border: `1px solid ${BUSINESS_COLORS.ui.border.subtle}`,
      },
      elevated: {
        ...baseStyle,
        boxShadow: BUSINESS_COLORS.shadows.lg,
        transform: "translateY(-2px)",
      },
      success: {
        ...baseStyle,
        borderColor: BUSINESS_COLORS.status.success,
        backgroundColor: colorUtils.withOpacity(
          BUSINESS_COLORS.status.success,
          0.05,
        ),
      },
      warning: {
        ...baseStyle,
        borderColor: BUSINESS_COLORS.status.warning,
        backgroundColor: colorUtils.withOpacity(
          BUSINESS_COLORS.status.warning,
          0.05,
        ),
      },
      error: {
        ...baseStyle,
        borderColor: BUSINESS_COLORS.status.error,
        backgroundColor: colorUtils.withOpacity(
          BUSINESS_COLORS.status.error,
          0.05,
        ),
      },
    };

    return variants[variant as keyof typeof variants] || variants.default;
  },

  // 按钮样式
  button: (variant: string = "primary", size: string = "md") => {
    const sizeStyles = {
      xs: {
        padding: "0.25rem 0.5rem",
        fontSize: BUSINESS_THEME.fontSize.xs,
        minHeight: "1.5rem",
      },
      sm: {
        padding: "0.5rem 1rem",
        fontSize: BUSINESS_THEME.fontSize.sm,
        minHeight: "2rem",
      },
      md: {
        padding: "0.75rem 1.5rem",
        fontSize: BUSINESS_THEME.fontSize.sm,
        minHeight: "2.5rem",
      },
      lg: {
        padding: "1rem 2rem",
        fontSize: BUSINESS_THEME.fontSize.base,
        minHeight: "3rem",
      },
      xl: {
        padding: "1.25rem 2.5rem",
        fontSize: BUSINESS_THEME.fontSize.lg,
        minHeight: "3.5rem",
      },
    };

    const baseStyle = {
      borderRadius: BUSINESS_THEME.borderRadius.md,
      fontWeight: BUSINESS_THEME.fontWeight.medium,
      transition: `all ${BUSINESS_THEME.animation.normal} ${BUSINESS_THEME.easing.easeInOut}`,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      border: "1px solid transparent",
      textDecoration: "none",
      ...sizeStyles[size as keyof typeof sizeStyles],
    };

    const variants = {
      primary: {
        ...baseStyle,
        backgroundColor: BUSINESS_COLORS.primary.main,
        color: BUSINESS_COLORS.neutral.white,
        boxShadow: BUSINESS_COLORS.shadows.sm,
      },
      secondary: {
        ...baseStyle,
        backgroundColor: BUSINESS_COLORS.ui.surface.raised,
        color: BUSINESS_COLORS.ui.text.primary,
        borderColor: BUSINESS_COLORS.ui.border.primary,
      },
      outline: {
        ...baseStyle,
        backgroundColor: "transparent",
        color: BUSINESS_COLORS.primary.main,
        borderColor: BUSINESS_COLORS.primary.main,
      },
      ghost: {
        ...baseStyle,
        backgroundColor: "transparent",
        color: BUSINESS_COLORS.ui.text.secondary,
      },
      success: {
        ...baseStyle,
        backgroundColor: BUSINESS_COLORS.status.success,
        color: BUSINESS_COLORS.neutral.white,
      },
      warning: {
        ...baseStyle,
        backgroundColor: BUSINESS_COLORS.status.warning,
        color: BUSINESS_COLORS.neutral.white,
      },
      error: {
        ...baseStyle,
        backgroundColor: BUSINESS_COLORS.status.error,
        color: BUSINESS_COLORS.neutral.white,
      },
    };

    return variants[variant as keyof typeof variants] || variants.primary;
  },

  // 输入框样式
  input: (variant: string = "default") => {
    const baseStyle = {
      backgroundColor: BUSINESS_COLORS.ui.background.panel,
      border: `1px solid ${BUSINESS_COLORS.ui.border.primary}`,
      borderRadius: BUSINESS_THEME.borderRadius.md,
      padding: "0.75rem 1rem",
      fontSize: BUSINESS_THEME.fontSize.sm,
      color: BUSINESS_COLORS.ui.text.primary,
      transition: `all ${BUSINESS_THEME.animation.normal} ${BUSINESS_THEME.easing.easeInOut}`,
    };

    const variants = {
      default: baseStyle,
      filled: {
        ...baseStyle,
        backgroundColor: BUSINESS_COLORS.ui.surface.interactive,
        border: "1px solid transparent",
      },
      outlined: {
        ...baseStyle,
        backgroundColor: "transparent",
        borderWidth: "2px",
      },
    };

    return variants[variant as keyof typeof variants] || variants.default;
  },
};

// 导出默认配色
export default BUSINESS_COLORS;

// 向后兼容的别名
export const getThreatLevelColor = colorUtils.getThreatColor;
export const getStatusColor = colorUtils.getStatusColor;
export const createBusinessCardStyle = styleGenerators.card;
export const createBusinessButtonStyle = styleGenerators.button;
