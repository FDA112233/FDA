import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  BUSINESS_COLORS,
  BUSINESS_THEME,
  createBusinessCardStyle,
} from "@/lib/businessColors";

interface BusinessCardProps {
  className?: string;
  children: React.ReactNode;
  variant?:
    | "default"
    | "primary"
    | "success"
    | "warning"
    | "error"
    | "elevated"
    | "glass";
  size?: "sm" | "md" | "lg" | "xl";
  hoverable?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  glow?: boolean;
  pulse?: boolean;
  bordered?: boolean;
  gradient?: boolean;
}

export function BusinessCard({
  className,
  children,
  variant = "default",
  size = "md",
  hoverable = false,
  onClick,
  disabled = false,
  loading = false,
  glow = false,
  pulse = false,
  bordered = false,
  gradient = false,
}: BusinessCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  const cardStyle = createBusinessCardStyle(variant);

  const sizeClasses = {
    sm: "p-3",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  };

  const variants = {
    default: {
      background: "bg-gradient-to-br from-slate-50 to-blue-50/50",
      border: "border-slate-200",
      shadow: "shadow-sm shadow-blue-500/10",
      hoverShadow: "hover:shadow-lg hover:shadow-blue-500/20",
    },
    primary: {
      background: "bg-gradient-to-br from-blue-50 to-cyan-50",
      border: "border-blue-200",
      shadow: "shadow-sm shadow-blue-500/20",
      hoverShadow: "hover:shadow-lg hover:shadow-blue-500/30",
    },
    success: {
      background: "bg-gradient-to-br from-green-50 to-emerald-50",
      border: "border-green-200",
      shadow: "shadow-sm shadow-green-500/20",
      hoverShadow: "hover:shadow-lg hover:shadow-green-500/30",
    },
    warning: {
      background: "bg-gradient-to-br from-yellow-50 to-orange-50",
      border: "border-yellow-200",
      shadow: "shadow-sm shadow-yellow-500/20",
      hoverShadow: "hover:shadow-lg hover:shadow-yellow-500/30",
    },
    error: {
      background: "bg-gradient-to-br from-red-50 to-pink-50",
      border: "border-red-200",
      shadow: "shadow-sm shadow-red-500/20",
      hoverShadow: "hover:shadow-lg hover:shadow-red-500/30",
    },
    elevated: {
      background: "bg-gradient-to-br from-slate-50 to-indigo-50/70",
      border: "border-slate-100",
      shadow: "shadow-xl shadow-indigo-500/15",
      hoverShadow: "hover:shadow-2xl hover:shadow-indigo-500/25",
    },
    glass: {
      background:
        "bg-gradient-to-br from-white/60 to-blue-50/40 backdrop-blur-md",
      border: "border-white/30",
      shadow: "shadow-lg shadow-blue-500/10",
      hoverShadow:
        "hover:shadow-xl hover:shadow-blue-500/20 hover:from-white/70 hover:to-blue-50/50",
    },
  };

  const currentVariant = variants[variant] || variants.default;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !onClick) return;

    // 创建涟漪效果
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { id: Date.now(), x, y };

    setRipples((prev) => [...prev, newRipple]);

    // 清除涟漪效果
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 600);

    onClick();
  };

  return (
    <div
      className={cn(
        "rounded-xl border relative overflow-hidden transition-all duration-300 ease-out group",
        currentVariant.background,
        bordered ? currentVariant.border : "border-transparent",
        currentVariant.shadow,
        sizeClasses[size],
        hoverable && !disabled && currentVariant.hoverShadow,
        hoverable && !disabled && "hover:-translate-y-1 hover:scale-[1.02]",
        glow && "ring-2 ring-blue-500/20",
        pulse && "animate-pulse",
        gradient && "bg-gradient-to-br from-white to-gray-50",
        onClick && !disabled && "cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed",
        loading && "animate-pulse",
        className,
      )}
      style={cardStyle}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 背景光晕效果 */}
      {(hoverable || glow) && (
        <div
          className={cn(
            "absolute inset-0 opacity-0 transition-opacity duration-300",
            isHovered && "opacity-100",
          )}
          style={{
            background: `radial-gradient(circle at center, ${BUSINESS_COLORS.primary.blue}10 0%, transparent 70%)`,
          }}
        />
      )}

      {/* 边框光效 */}
      {hoverable && (
        <div
          className={cn(
            "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300",
            isHovered && "opacity-100",
          )}
          style={{
            background: `linear-gradient(90deg, transparent, ${BUSINESS_COLORS.primary.blue}20, transparent)`,
            animation: isHovered ? "border-flow 2s linear infinite" : "none",
          }}
        />
      )}

      {/* 涟漪效果 */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute rounded-full animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            backgroundColor: `${BUSINESS_COLORS.primary.blue}40`,
            animation: "ripple 0.6s ease-out",
          }}
        />
      ))}

      {/* 加载状态 */}
      {loading && (
        <div
          className="absolute inset-0 flex items-center justify-center rounded-xl backdrop-blur-sm"
          style={{
            background: `linear-gradient(135deg,
                 rgba(var(--brand-primary), 0.1) 0%,
                 rgba(var(--brand-accent), 0.05) 50%,
                 rgba(var(--brand-light), 0.1) 100%)`,
          }}
        >
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full animate-bounce"
                style={{
                  background: `linear-gradient(45deg,
                    ${[BUSINESS_COLORS.primary.main, BUSINESS_COLORS.primary.accent, BUSINESS_COLORS.primary.light][i]},
                    ${[BUSINESS_COLORS.primary.light, BUSINESS_COLORS.primary.main, BUSINESS_COLORS.primary.accent][i]})`,
                  animationDelay: `${i * 0.2}s`,
                  boxShadow: `0 4px 8px rgba(var(--brand-primary), 0.3)`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* 内容 */}
      <div className="relative z-10">{children}</div>

      {/* 装饰性元素 */}
      {variant === "elevated" && (
        <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
          <div
            className="w-full h-full rounded-full"
            style={{ backgroundColor: BUSINESS_COLORS.primary.blue }}
          />
        </div>
      )}
    </div>
  );
}

interface StatusCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  status?: "success" | "warning" | "error" | "info" | "neutral";
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  onClick?: () => void;
  className?: string;
  animated?: boolean;
}

export function StatusCard({
  title,
  value,
  subtitle,
  icon,
  status = "neutral",
  trend,
  onClick,
  className,
  animated = true,
}: StatusCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const statusColors = {
    success: BUSINESS_COLORS.status.success,
    warning: BUSINESS_COLORS.status.warning,
    error: BUSINESS_COLORS.status.error,
    info: BUSINESS_COLORS.status.info,
    neutral: BUSINESS_COLORS.neutral.silver,
  };

  const statusColor = statusColors[status];

  return (
    <BusinessCard
      variant={status === "neutral" ? "default" : status}
      hoverable={!!onClick}
      onClick={onClick}
      className={cn("group", className)}
      bordered
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            {icon && (
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                  animated && "group-hover:scale-110 group-hover:rotate-3",
                )}
                style={{
                  backgroundColor: `${statusColor}20`,
                  color: statusColor,
                }}
              >
                {icon}
              </div>
            )}
            <div>
              <h3
                className="font-semibold text-sm"
                style={{ color: BUSINESS_COLORS.ui.text.secondary }}
              >
                {title}
              </h3>
            </div>
          </div>

          <div className="mb-2">
            <span
              className={cn(
                "text-3xl font-bold transition-all duration-500",
                mounted && animated && "animate-count-up",
              )}
              style={{ color: BUSINESS_COLORS.ui.text.primary }}
            >
              {value}
            </span>
          </div>

          {subtitle && (
            <p
              className="text-sm mb-3"
              style={{ color: BUSINESS_COLORS.ui.text.muted }}
            >
              {subtitle}
            </p>
          )}

          {trend && (
            <div className="flex items-center space-x-2">
              <div
                className={cn(
                  "flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium",
                  trend.isPositive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700",
                )}
              >
                <span
                  className={
                    trend.isPositive ? "text-green-500" : "text-red-500"
                  }
                >
                  {trend.isPositive ? "↗" : "↘"}
                </span>
                <span>
                  {trend.isPositive ? "+" : ""}
                  {trend.value}%
                </span>
              </div>
              <span
                className="text-xs"
                style={{ color: BUSINESS_COLORS.ui.text.muted }}
              >
                {trend.label}
              </span>
            </div>
          )}
        </div>
      </div>
    </BusinessCard>
  );
}

interface InfoCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  headerActions?: React.ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export function InfoCard({
  title,
  description,
  children,
  headerActions,
  className,
  collapsible = false,
  defaultExpanded = true,
}: InfoCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <BusinessCard className={className} bordered>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3
                className="text-lg font-semibold"
                style={{ color: BUSINESS_COLORS.ui.text.primary }}
              >
                {title}
              </h3>
              {collapsible && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 rounded-lg transition-transform duration-200"
                  style={{
                    color: BUSINESS_COLORS.ui.text.muted,
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  ▼
                </button>
              )}
            </div>
            {description && (
              <p
                className="text-sm mt-1"
                style={{ color: BUSINESS_COLORS.ui.text.secondary }}
              >
                {description}
              </p>
            )}
          </div>
          {headerActions && (
            <div className="flex items-center space-x-2">{headerActions}</div>
          )}
        </div>

        <div
          className={cn(
            "transition-all duration-300 overflow-hidden",
            isExpanded ? "max-h-full opacity-100" : "max-h-0 opacity-0",
          )}
        >
          {children}
        </div>
      </div>
    </BusinessCard>
  );
}

interface DataTableCardProps {
  title: string;
  description?: string;
  data: Array<Record<string, any>>;
  columns: Array<{
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
    sortable?: boolean;
  }>;
  actions?: React.ReactNode;
  className?: string;
  pageSize?: number;
}

export function DataTableCard({
  title,
  description,
  data,
  columns,
  actions,
  className,
  pageSize = 10,
}: DataTableCardProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = data.slice(startIndex, endIndex);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  return (
    <BusinessCard className={className} bordered>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3
              className="text-lg font-semibold"
              style={{ color: BUSINESS_COLORS.ui.text.primary }}
            >
              {title}
            </h3>
            {description && (
              <p
                className="text-sm mt-1"
                style={{ color: BUSINESS_COLORS.ui.text.secondary }}
              >
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center space-x-2">{actions}</div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className="border-b"
                style={{ borderColor: BUSINESS_COLORS.ui.border.primary }}
              >
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      "text-left py-3 px-4 font-semibold text-sm transition-colors duration-200",
                      column.sortable && "cursor-pointer hover:bg-gray-50",
                    )}
                    style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{column.label}</span>
                      {column.sortable && sortColumn === column.key && (
                        <span className="text-xs">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.map((row, index) => (
                <tr
                  key={index}
                  className="border-b last:border-b-0 hover:bg-gray-50/50 transition-colors duration-150"
                  style={{ borderColor: BUSINESS_COLORS.ui.border.primary }}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="py-4 px-4 text-sm"
                      style={{ color: BUSINESS_COLORS.ui.text.primary }}
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页控制 */}
        {totalPages > 1 && (
          <div
            className="flex items-center justify-between pt-4 border-t"
            style={{ borderColor: BUSINESS_COLORS.ui.border.primary }}
          >
            <div className="flex items-center space-x-2">
              <span
                className="text-sm"
                style={{ color: BUSINESS_COLORS.ui.text.muted }}
              >
                显示 {startIndex + 1}-{Math.min(endIndex, data.length)} 条，共{" "}
                {data.length} 条
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: BUSINESS_COLORS.ui.background.secondary,
                  color: BUSINESS_COLORS.ui.text.secondary,
                }}
              >
                上一页
              </button>
              <span
                className="text-sm"
                style={{ color: BUSINESS_COLORS.ui.text.secondary }}
              >
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: BUSINESS_COLORS.ui.background.secondary,
                  color: BUSINESS_COLORS.ui.text.secondary,
                }}
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>
    </BusinessCard>
  );
}

interface AlertCardProps {
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  actions?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  animated?: boolean;
}

export function AlertCard({
  type,
  title,
  message,
  actions,
  dismissible = false,
  onDismiss,
  className,
  animated = true,
}: AlertCardProps) {
  const [isVisible, setIsVisible] = useState(true);

  const alertStyles = {
    info: {
      backgroundColor: `${BUSINESS_COLORS.status.info}10`,
      borderColor: BUSINESS_COLORS.status.info,
      iconColor: BUSINESS_COLORS.status.info,
    },
    success: {
      backgroundColor: `${BUSINESS_COLORS.status.success}10`,
      borderColor: BUSINESS_COLORS.status.success,
      iconColor: BUSINESS_COLORS.status.success,
    },
    warning: {
      backgroundColor: `${BUSINESS_COLORS.status.warning}10`,
      borderColor: BUSINESS_COLORS.status.warning,
      iconColor: BUSINESS_COLORS.status.warning,
    },
    error: {
      backgroundColor: `${BUSINESS_COLORS.status.error}10`,
      borderColor: BUSINESS_COLORS.status.error,
      iconColor: BUSINESS_COLORS.status.error,
    },
  };

  const style = alertStyles[type];

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss?.();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "rounded-lg border-l-4 p-4 transition-all duration-300",
        animated && "animate-slide-in",
        className,
      )}
      style={{
        backgroundColor: style.backgroundColor,
        borderLeftColor: style.borderColor,
        border: `1px solid ${style.borderColor}30`,
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4
            className="font-semibold text-sm mb-1"
            style={{ color: BUSINESS_COLORS.ui.text.primary }}
          >
            {title}
          </h4>
          <p
            className="text-sm"
            style={{ color: BUSINESS_COLORS.ui.text.secondary }}
          >
            {message}
          </p>
          {actions && <div className="mt-3">{actions}</div>}
        </div>
        {dismissible && onDismiss && (
          <button
            onClick={handleDismiss}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
