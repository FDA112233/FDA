/**
 * 统一后台配色主题系统
 * 完全避免白色使用，采用多彩渐变设计
 */

import { BUSINESS_COLORS } from "./businessColors";

// 后台专用配色调色板
export const BACKEND_COLORS = {
  // 主要背景色系 - 深色调配色
  backgrounds: {
    primary: `linear-gradient(135deg, 
      rgb(var(--neutral-900)) 0%, 
      rgb(var(--neutral-800)) 25%, 
      rgb(var(--brand-darkest)) 50%, 
      rgb(var(--neutral-800)) 75%, 
      rgb(var(--neutral-900)) 100%)`,

    secondary: `linear-gradient(135deg, 
      rgba(var(--brand-darkest), 0.9) 0%, 
      rgba(var(--neutral-800), 0.95) 100%)`,

    panel: `linear-gradient(135deg, 
      rgba(var(--brand-primary), 0.1) 0%, 
      rgba(var(--brand-accent), 0.05) 50%,
      rgba(var(--brand-light), 0.08) 100%)`,

    card: `linear-gradient(135deg, 
      rgba(var(--neutral-800), 0.9) 0%, 
      rgba(var(--brand-darkest), 0.8) 100%)`,

    modal: `linear-gradient(135deg, 
      rgba(var(--neutral-900), 0.95) 0%, 
      rgba(var(--brand-darkest), 0.9) 100%)`,

    sidebar: `linear-gradient(180deg, 
      rgba(var(--neutral-900), 0.95) 0%, 
      rgba(var(--brand-darkest), 0.9) 50%, 
      rgba(var(--neutral-800), 0.95) 100%)`,
  },

  // 文本色系 - 避免纯白
  text: {
    primary: `rgb(var(--brand-lightest))`, // 浅蓝替代白色
    secondary: `rgb(var(--brand-light))`,
    muted: `rgb(var(--neutral-500))`,
    accent: `rgb(var(--brand-accent))`,
    glow: `rgb(var(--brand-lightest))`,
  },

  // 边框色系 - 彩色边框
  borders: {
    primary: `rgba(var(--brand-primary), 0.3)`,
    secondary: `rgba(var(--brand-accent), 0.2)`,
    accent: `rgba(var(--brand-light), 0.4)`,
    subtle: `rgba(var(--brand-primary), 0.1)`,
    glow: `rgba(var(--brand-accent), 0.5)`,
  },

  // 按钮配色系统
  buttons: {
    primary: {
      background: `linear-gradient(135deg, 
        rgb(var(--brand-primary)) 0%, 
        rgb(var(--brand-accent)) 100%)`,
      hover: `linear-gradient(135deg, 
        rgb(var(--brand-dark)) 0%, 
        rgb(var(--brand-primary)) 100%)`,
      text: `rgb(var(--brand-lightest))`,
      shadow: `0 8px 20px rgba(var(--brand-primary), 0.4)`,
    },

    secondary: {
      background: `linear-gradient(135deg, 
        rgba(var(--neutral-700), 0.8) 0%, 
        rgba(var(--brand-darkest), 0.6) 100%)`,
      hover: `linear-gradient(135deg, 
        rgba(var(--neutral-600), 0.9) 0%, 
        rgba(var(--brand-dark), 0.7) 100%)`,
      text: `rgb(var(--brand-light))`,
      shadow: `0 4px 12px rgba(var(--neutral-700), 0.3)`,
    },

    success: {
      background: `linear-gradient(135deg, 
        rgb(var(--success)) 0%, 
        rgb(var(--threat-safe)) 100%)`,
      hover: `linear-gradient(135deg, 
        #059669 0%, 
        rgb(var(--success)) 100%)`,
      text: `rgb(var(--brand-lightest))`,
      shadow: `0 8px 20px rgba(var(--success), 0.4)`,
    },

    warning: {
      background: `linear-gradient(135deg, 
        rgb(var(--warning)) 0%, 
        rgb(var(--threat-medium)) 100%)`,
      hover: `linear-gradient(135deg, 
        #d97706 0%, 
        rgb(var(--warning)) 100%)`,
      text: `rgb(var(--brand-lightest))`,
      shadow: `0 8px 20px rgba(var(--warning), 0.4)`,
    },

    danger: {
      background: `linear-gradient(135deg, 
        rgb(var(--error)) 0%, 
        rgb(var(--threat-critical)) 100%)`,
      hover: `linear-gradient(135deg, 
        #dc2626 0%, 
        rgb(var(--error)) 100%)`,
      text: `rgb(var(--brand-lightest))`,
      shadow: `0 8px 20px rgba(var(--error), 0.4)`,
    },
  },

  // 表单组件配色
  forms: {
    input: {
      background: `linear-gradient(135deg, 
        rgba(var(--neutral-800), 0.8) 0%, 
        rgba(var(--brand-darkest), 0.6) 100%)`,
      border: `rgba(var(--brand-primary), 0.3)`,
      focus: `rgba(var(--brand-accent), 0.6)`,
      text: `rgb(var(--brand-lightest))`,
      placeholder: `rgb(var(--neutral-500))`,
    },

    select: {
      background: `linear-gradient(135deg, 
        rgba(var(--neutral-800), 0.9) 0%, 
        rgba(var(--brand-darkest), 0.7) 100%)`,
      border: `rgba(var(--brand-primary), 0.3)`,
      text: `rgb(var(--brand-light))`,
    },

    checkbox: {
      background: `linear-gradient(135deg, 
        rgba(var(--brand-primary), 0.3) 0%, 
        rgba(var(--brand-accent), 0.2) 100%)`,
      checked: `linear-gradient(135deg, 
        rgb(var(--brand-primary)) 0%, 
        rgb(var(--brand-accent)) 100%)`,
      border: `rgba(var(--brand-primary), 0.4)`,
    },
  },

  // 状态指示器配色
  status: {
    online: {
      color: `rgb(var(--success))`,
      glow: `0 0 12px rgba(var(--success), 0.6)`,
      background: `rgba(var(--success), 0.1)`,
    },

    offline: {
      color: `rgb(var(--error))`,
      glow: `0 0 12px rgba(var(--error), 0.6)`,
      background: `rgba(var(--error), 0.1)`,
    },

    warning: {
      color: `rgb(var(--warning))`,
      glow: `0 0 12px rgba(var(--warning), 0.6)`,
      background: `rgba(var(--warning), 0.1)`,
    },

    processing: {
      color: `rgb(var(--processing))`,
      glow: `0 0 12px rgba(var(--processing), 0.6)`,
      background: `rgba(var(--processing), 0.1)`,
    },
  },

  // 菜单导航配色
  navigation: {
    background: `linear-gradient(180deg, 
      rgba(var(--neutral-900), 0.95) 0%, 
      rgba(var(--brand-darkest), 0.9) 50%, 
      rgba(var(--neutral-800), 0.95) 100%)`,

    itemDefault: {
      background: "transparent",
      text: `rgb(var(--brand-light))`,
      border: "transparent",
    },

    itemHover: {
      background: `linear-gradient(135deg, 
        rgba(var(--brand-primary), 0.15) 0%, 
        rgba(var(--brand-accent), 0.1) 100%)`,
      text: `rgb(var(--brand-lightest))`,
      border: `rgba(var(--brand-primary), 0.2)`,
    },

    itemActive: {
      background: `linear-gradient(135deg, 
        rgba(var(--brand-primary), 0.3) 0%, 
        rgba(var(--brand-accent), 0.2) 100%)`,
      text: `rgb(var(--brand-lightest))`,
      border: `rgba(var(--brand-primary), 0.3)`,
      shadow: `0 8px 32px rgba(var(--brand-primary), 0.3)`,
    },

    logo: {
      background: `linear-gradient(135deg, 
        rgb(var(--brand-primary)) 0%, 
        rgb(var(--brand-accent)) 100%)`,
      text: `rgb(var(--brand-lightest))`,
      shadow: `0 8px 32px rgba(var(--brand-primary), 0.4)`,
    },
  },

  // 阴影系统 - 彩色阴影
  shadows: {
    small: `0 2px 8px rgba(var(--brand-primary), 0.1)`,
    medium: `0 4px 16px rgba(var(--brand-primary), 0.15)`,
    large: `0 8px 32px rgba(var(--brand-primary), 0.2)`,
    glow: `0 0 20px rgba(var(--brand-accent), 0.4)`,
    intense: `0 0 40px rgba(var(--brand-primary), 0.6)`,

    // 彩色阴影变体
    success: `0 8px 24px rgba(var(--success), 0.3)`,
    warning: `0 8px 24px rgba(var(--warning), 0.3)`,
    error: `0 8px 24px rgba(var(--error), 0.3)`,
    info: `0 8px 24px rgba(var(--info), 0.3)`,
  },

  // 装饰效果
  effects: {
    particle: [
      `rgb(var(--brand-lightest))`,
      `rgb(var(--brand-accent))`,
      `rgb(var(--brand-light))`,
      `rgb(var(--info))`,
      `rgb(var(--success))`,
    ],

    gradientOverlay: `radial-gradient(circle at center, 
      rgba(var(--brand-accent), 0.2) 0%, 
      transparent 70%)`,

    shimmer: `linear-gradient(90deg, 
      transparent 0%, 
      rgba(var(--brand-lightest), 0.4) 50%, 
      transparent 100%)`,

    glow: `linear-gradient(90deg, 
      transparent 0%, 
      rgba(var(--brand-accent), 0.3) 50%, 
      transparent 100%)`,
  },
};

// 主题应用工具函数
export const ThemeUtils = {
  // 应用按钮样式
  applyButtonStyle: (
    element: HTMLElement,
    variant: keyof typeof BACKEND_COLORS.buttons = "primary",
    state: "default" | "hover" = "default",
  ) => {
    const buttonStyle = BACKEND_COLORS.buttons[variant];
    element.style.background =
      state === "hover" ? buttonStyle.hover : buttonStyle.background;
    element.style.color = buttonStyle.text;
    element.style.boxShadow = buttonStyle.shadow;
    element.style.border = "1px solid transparent";
    element.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
  },

  // 应用输入框样式
  applyInputStyle: (
    element: HTMLElement,
    state: "default" | "focus" = "default",
  ) => {
    const inputStyle = BACKEND_COLORS.forms.input;
    element.style.background = inputStyle.background;
    element.style.border = `1px solid ${state === "focus" ? inputStyle.focus : inputStyle.border}`;
    element.style.color = inputStyle.text;
    element.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
  },

  // 应用状态指示器样式
  applyStatusStyle: (
    element: HTMLElement,
    status: keyof typeof BACKEND_COLORS.status,
  ) => {
    const statusStyle = BACKEND_COLORS.status[status];
    element.style.color = statusStyle.color;
    element.style.boxShadow = statusStyle.glow;
    element.style.backgroundColor = statusStyle.background;
  },

  // 生成随机装饰粒子颜色
  getRandomParticleColor: () => {
    const colors = BACKEND_COLORS.effects.particle;
    return colors[Math.floor(Math.random() * colors.length)];
  },

  // 创建彩色文本阴影
  createTextGlow: (color: string, intensity: number = 0.5) => {
    return `0 0 ${8 * intensity}px ${color}${Math.floor(intensity * 255).toString(16)}`;
  },

  // 创建彩色边框
  createGlowBorder: (color: string, width: number = 1) => {
    return `${width}px solid ${color}, 0 0 ${width * 8}px ${color}40`;
  },
};

// 响应式断点配色
export const RESPONSIVE_THEME = {
  mobile: {
    navigation: {
      background: `linear-gradient(135deg, 
        rgba(var(--neutral-900), 0.98) 0%, 
        rgba(var(--brand-darkest), 0.95) 100%)`,
      overlay: `linear-gradient(135deg, 
        rgba(var(--neutral-900), 0.8) 0%, 
        rgba(var(--brand-darkest), 0.9) 100%)`,
    },
  },

  tablet: {
    sidebar: {
      width: "280px",
      background: BACKEND_COLORS.navigation.background,
    },
  },

  desktop: {
    sidebar: {
      width: "320px",
      background: BACKEND_COLORS.navigation.background,
    },
  },
};

// 动画主题
export const ANIMATION_THEME = {
  particles: {
    count: 20,
    colors: BACKEND_COLORS.effects.particle,
    duration: "3s",
    delay: "0s",
  },

  shimmer: {
    duration: "2s",
    easing: "ease-in-out",
    infinite: true,
  },

  glow: {
    duration: "3s",
    easing: "ease-in-out",
    infinite: true,
  },

  backgroundShift: {
    duration: "25s",
    easing: "ease-in-out",
    infinite: true,
  },
};

// 导出默认主题配置
export default {
  colors: BACKEND_COLORS,
  utils: ThemeUtils,
  responsive: RESPONSIVE_THEME,
  animation: ANIMATION_THEME,
};
