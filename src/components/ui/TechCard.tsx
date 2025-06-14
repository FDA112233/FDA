import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { TECH_COLORS, TECH_THEME, createGlowEffect } from "@/lib/techColors";

interface TechCardProps {
  className?: string;
  children: React.ReactNode;
  variant?: "default" | "cyber" | "matrix" | "plasma" | "quantum" | "neural";
  glow?: boolean;
  pulse?: boolean;
  animated?: boolean;
  borderStyle?: "solid" | "dashed" | "dotted" | "neon";
  onClick?: () => void;
  disabled?: boolean;
}

export function TechCard({
  className,
  children,
  variant = "default",
  glow = false,
  pulse = false,
  animated = true,
  borderStyle = "solid",
  onClick,
  disabled = false,
}: TechCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(1);

  // 脉冲效果
  useEffect(() => {
    if (pulse) {
      const interval = setInterval(() => {
        setGlowIntensity((prev) => (prev === 1 ? 1.5 : 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [pulse]);

  // 获取变体颜色
  const getVariantColors = (variant: string) => {
    switch (variant) {
      case "cyber":
        return {
          primary: TECH_COLORS.primary.cyber,
          secondary: TECH_COLORS.primary.neon,
          gradient: TECH_COLORS.gradients.cyber,
        };
      case "matrix":
        return {
          primary: TECH_COLORS.primary.matrix,
          secondary: TECH_COLORS.primary.quantum,
          gradient: TECH_COLORS.gradients.matrix,
        };
      case "plasma":
        return {
          primary: TECH_COLORS.primary.plasma,
          secondary: TECH_COLORS.primary.neural,
          gradient: TECH_COLORS.gradients.plasma,
        };
      case "quantum":
        return {
          primary: TECH_COLORS.primary.quantum,
          secondary: TECH_COLORS.primary.cyber,
          gradient: TECH_COLORS.gradients.quantum,
        };
      case "neural":
        return {
          primary: TECH_COLORS.primary.neural,
          secondary: TECH_COLORS.primary.plasma,
          gradient: TECH_COLORS.gradients.neural,
        };
      default:
        return {
          primary: TECH_COLORS.primary.neon,
          secondary: TECH_COLORS.primary.cyber,
          gradient: TECH_COLORS.gradients.cyber,
        };
    }
  };

  const colors = getVariantColors(variant);

  // 获取边框样式
  const getBorderStyle = (style: string, color: string) => {
    switch (style) {
      case "dashed":
        return `2px dashed ${color}`;
      case "dotted":
        return `2px dotted ${color}`;
      case "neon":
        return `1px solid ${color}`;
      default:
        return `1px solid ${color}`;
    }
  };

  const baseStyles = {
    backgroundColor: TECH_COLORS.ui.background.glass,
    border: getBorderStyle(borderStyle, colors.primary),
    backdropFilter: "blur(10px)",
    transition: animated
      ? "all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
      : "none",
    transform:
      isHovered && !disabled ? "scale(1.02) translateY(-2px)" : "scale(1)",
    boxShadow: glow
      ? createGlowEffect(
          colors.primary,
          isHovered ? glowIntensity * 1.5 : glowIntensity,
        )
      : TECH_THEME.shadows.cyber,
    cursor: onClick && !disabled ? "pointer" : "default",
    opacity: disabled ? 0.5 : 1,
  };

  const pulseAnimation = pulse
    ? {
        animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
      }
    : {};

  return (
    <div
      className={cn(
        "relative rounded-lg p-4 overflow-hidden",
        "before:absolute before:inset-0 before:rounded-lg before:p-[1px]",
        "before:bg-gradient-to-r",
        animated && "transition-all duration-300 ease-out",
        onClick && !disabled && "hover:cursor-pointer",
        className,
      )}
      style={
        {
          ...baseStyles,
          ...pulseAnimation,
          "--gradient": colors.gradient,
        } as React.CSSProperties
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick && !disabled ? onClick : undefined}
    >
      {/* 背景渐变效果 */}
      {glow && (
        <div
          className="absolute inset-0 opacity-10 rounded-lg"
          style={{
            background: colors.gradient,
            filter: `blur(${isHovered ? "20px" : "10px"})`,
            transition: "all 0.3s ease",
          }}
        />
      )}

      {/* 边框霓虹效果 */}
      {borderStyle === "neon" && (
        <div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary}, ${colors.primary})`,
            padding: "1px",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
          }}
        />
      )}

      {/* 扫描线效果 */}
      {animated && (isHovered || pulse) && (
        <div
          className="absolute inset-0 opacity-20 rounded-lg pointer-events-none overflow-hidden"
          style={{
            background: `linear-gradient(90deg, transparent, ${colors.primary}66, transparent)`,
            animation: "scan 2s linear infinite",
          }}
        />
      )}

      {/* 内容区域 */}
      <div className="relative z-10">{children}</div>

      {/* 内联样式用��动画 */}
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes scan {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

// 预设的科技风卡片变体
export function CyberCard(props: Omit<TechCardProps, "variant">) {
  return <TechCard {...props} variant="cyber" />;
}

export function MatrixCard(props: Omit<TechCardProps, "variant">) {
  return <TechCard {...props} variant="matrix" />;
}

export function PlasmaCard(props: Omit<TechCardProps, "variant">) {
  return <TechCard {...props} variant="plasma" />;
}

export function QuantumCard(props: Omit<TechCardProps, "variant">) {
  return <TechCard {...props} variant="quantum" />;
}

export function NeuralCard(props: Omit<TechCardProps, "variant">) {
  return <TechCard {...props} variant="neural" />;
}

// 特殊功能卡片
interface StatusCardProps extends Omit<TechCardProps, "variant"> {
  status: "online" | "offline" | "warning" | "critical" | "processing";
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "stable";
  unit?: string;
}

export function StatusCard({
  status,
  label,
  value,
  icon,
  trend,
  unit = "",
  className,
  ...props
}: StatusCardProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "online":
        return "matrix";
      case "warning":
        return "neural";
      case "critical":
        return "plasma";
      case "processing":
        return "quantum";
      default:
        return "cyber";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return TECH_COLORS.status.online;
      case "warning":
        return TECH_COLORS.status.warning;
      case "critical":
        return TECH_COLORS.status.critical;
      case "processing":
        return TECH_COLORS.status.processing;
      default:
        return TECH_COLORS.status.offline;
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up":
        return "↗";
      case "down":
        return "↘";
      case "stable":
        return "→";
      default:
        return "";
    }
  };

  return (
    <TechCard
      {...props}
      variant={getStatusVariant(status)}
      className={cn("min-h-[120px]", className)}
      glow
      pulse={status === "critical" || status === "processing"}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {icon && (
              <div
                className="p-1 rounded"
                style={{
                  color: getStatusColor(status),
                  backgroundColor: `${getStatusColor(status)}20`,
                }}
              >
                {icon}
              </div>
            )}
            <span
              className="text-sm font-medium"
              style={{ color: TECH_COLORS.ui.text.secondary }}
            >
              {label}
            </span>
          </div>
          {trend && (
            <span
              className="text-xs font-mono"
              style={{ color: getStatusColor(status) }}
            >
              {getTrendIcon(trend)}
            </span>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div
            className="text-3xl font-bold font-mono mb-1"
            style={{
              color: getStatusColor(status),
              textShadow: `0 0 10px ${getStatusColor(status)}66`,
            }}
          >
            {value}
            {unit && <span className="text-lg ml-1">{unit}</span>}
          </div>
        </div>

        <div
          className="text-xs font-mono uppercase tracking-wider opacity-70"
          style={{ color: TECH_COLORS.ui.text.muted }}
        >
          {status.toUpperCase()}
        </div>
      </div>
    </TechCard>
  );
}

export default TechCard;
