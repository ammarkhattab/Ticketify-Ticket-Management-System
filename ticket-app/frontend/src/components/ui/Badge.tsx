import React from 'react';
import { Priority, Status } from '../../types';

/**
 * Badge variant types
 */
export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

/**
 * Badge size types
 */
export type BadgeSize = 'sm' | 'md' | 'lg';

/**
 * Badge component props
 */
export interface BadgeProps {
  /** Badge content */
  children: React.ReactNode;
  
  /** Badge variant style */
  variant?: BadgeVariant;
  
  /** Badge size */
  size?: BadgeSize;
  
  /** Custom class name */
  className?: string;
  
  /** Whether to show as outline style */
  outline?: boolean;
}

/**
 * Badge component for priority display
 */
export interface PriorityBadgeProps {
  /** Priority value */
  priority: Priority;
  
  /** Badge size */
  size?: BadgeSize;
  
  /** Custom class name */
  className?: string;
}

/**
 * Badge component for status display
 */
export interface StatusBadgeProps {
  /** Status value */
  status: Status;
  
  /** Badge size */
  size?: BadgeSize;
  
  /** Custom class name */
  className?: string;
}

/**
 * Small badge/tag component for displaying labels, priorities, and statuses
 * 
 * @param props - Badge component properties
 * @returns {JSX.Element} The badge component
 * 
 * @example
 * ```tsx
 * <Badge variant="success" size="md">Active</Badge>
 * ```
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  outline = false,
}) => {
  // Base classes
  const baseClasses =
    'inline-flex items-center font-medium rounded-full border transition-colors';
  
  // Variant classes
  const variantClasses = {
    default: outline
      ? 'border-gray-300 text-gray-700 bg-transparent dark:border-gray-600 dark:text-gray-300'
      : 'border-gray-200 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200',
    success: outline
      ? 'border-green-300 text-green-700 bg-transparent dark:border-green-600 dark:text-green-400'
      : 'border-green-200 bg-green-100 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200',
    warning: outline
      ? 'border-amber-300 text-amber-700 bg-transparent dark:border-amber-600 dark:text-amber-400'
      : 'border-amber-200 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:border-amber-700 dark:text-amber-200',
    error: outline
      ? 'border-red-300 text-red-700 bg-transparent dark:border-red-600 dark:text-red-400'
      : 'border-red-200 bg-red-100 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200',
    info: outline
      ? 'border-blue-300 text-blue-700 bg-transparent dark:border-blue-600 dark:text-blue-400'
      : 'border-blue-200 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200',
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };
  
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();
  
  return <span className={combinedClasses}>{children}</span>;
};

/**
 * Priority badge component with automatic styling based on priority level
 * 
 * @param props - Priority badge properties
 * @returns {JSX.Element} The priority badge component
 */
export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = 'md',
  className = '',
}) => {
  const priorityVariantMap: Record<Priority, BadgeVariant> = {
    LOW: 'success',
    MEDIUM: 'info',
    HIGH: 'warning',
    URGENT: 'error',
  };
  
  return (
    <Badge variant={priorityVariantMap[priority]} size={size} className={className}>
      {priority}
    </Badge>
  );
};

/**
 * Status badge component with automatic styling based on status value
 * 
 * @param props - Status badge properties
 * @returns {JSX.Element} The status badge component
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
}) => {
  const statusVariantMap: Record<Status, BadgeVariant> = {
    SCHEDULED: 'info',
    IN_PROGRESS: 'info',
    ACTIVE: 'success',
    OVERDUE: 'error',
    COMPLETED: 'success',
  };
  
  const displayText = status.replace('_', ' ');
  
  return (
    <Badge variant={statusVariantMap[status]} size={size} className={className}>
      {displayText}
    </Badge>
  );
};

export default Badge;

