import React from "react";
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
    | "elevated";
  size?: "sm" | "md" | "lg";
  hoverable?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
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
}: BusinessCardProps) {
  const cardStyle = createBusinessCardStyle(variant);

  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const hoverClasses =
    hoverable && !disabled
      ? "hover:shadow-md hover:-translate-y-0.5 hover:border-blue-300 transition-all duration-250"
      : "";

  const clickableClasses =
    onClick && !disabled
      ? "cursor-pointer"
      : disabled
        ? "cursor-not-allowed opacity-50"
        : "";

  return (
    <div
      className={cn(
        "rounded-lg border bg-white",
        sizeClasses[size],
        hoverClasses,
        clickableClasses,
        loading && "animate-pulse",
        className,
      )}
      style={cardStyle}
      onClick={disabled ? undefined : onClick}
    >
      {loading ? (
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </div>
      ) : (
        children
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
}: StatusCardProps) {
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
      className={className}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            {icon && (
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: `${statusColor}20`,
                  color: statusColor,
                }}
              >
                {icon}
              </div>
            )}
            <h3
              className="font-medium text-sm"
              style={{ color: BUSINESS_COLORS.ui.text.secondary }}
            >
              {title}
            </h3>
          </div>

          <div className="mb-1">
            <span
              className="text-2xl font-bold"
              style={{ color: BUSINESS_COLORS.ui.text.primary }}
            >
              {value}
            </span>
          </div>

          {subtitle && (
            <p
              className="text-sm mb-2"
              style={{ color: BUSINESS_COLORS.ui.text.muted }}
            >
              {subtitle}
            </p>
          )}

          {trend && (
            <div className="flex items-center space-x-1">
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-green-600" : "text-red-600",
                )}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
              <span
                className="text-sm"
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
}

export function InfoCard({
  title,
  description,
  children,
  headerActions,
  className,
}: InfoCardProps) {
  return (
    <BusinessCard className={className}>
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
          {headerActions && (
            <div className="flex items-center space-x-2">{headerActions}</div>
          )}
        </div>
        <div>{children}</div>
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
  }>;
  actions?: React.ReactNode;
  className?: string;
}

export function DataTableCard({
  title,
  description,
  data,
  columns,
  actions,
  className,
}: DataTableCardProps) {
  return (
    <BusinessCard className={className}>
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
                    className="text-left py-3 px-4 font-medium text-sm"
                    style={{ color: BUSINESS_COLORS.ui.text.secondary }}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr
                  key={index}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                  style={{ borderColor: BUSINESS_COLORS.ui.border.primary }}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="py-3 px-4 text-sm"
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
}

export function AlertCard({
  type,
  title,
  message,
  actions,
  dismissible = false,
  onDismiss,
  className,
}: AlertCardProps) {
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

  return (
    <div
      className={cn("rounded-lg border-l-4 p-4", className)}
      style={{
        backgroundColor: style.backgroundColor,
        borderLeftColor: style.borderColor,
        border: `1px solid ${style.borderColor}30`,
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4
            className="font-medium text-sm mb-1"
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
            onClick={onDismiss}
            className="ml-4 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
