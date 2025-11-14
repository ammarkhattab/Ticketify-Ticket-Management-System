/**
 * Type definitions for the CNX Ticketify application
 * 
 * This file serves as the main export point for all type definitions.
 * Individual type files are organized by domain (ticket, user, etc.)
 */

// Export all ticket-related types
export type {
  Priority,
  Status,
  CustomerType,
  Subtask,
  Ticket,
  TicketCreateInput,
  TicketUpdateInput,
  SubtaskCreateInput,
  SubtaskUpdateInput,
  TicketStats,
  TicketWithMetadata,
  TicketFilters,
} from './ticket';

/**
 * User role types
 * - ADMIN: Full system access
 * - MANAGER: Can manage teams and tickets
 * - AGENT: Can work on assigned tickets
 * - VIEWER: Read-only access
 */
export type UserRole = 'ADMIN' | 'MANAGER' | 'AGENT' | 'VIEWER';

/**
 * User interface representing a user entity
 * 
 * @interface User
 */
export interface User {
  /** Unique identifier for the user */
  id: string;
  
  /** Full name of the user */
  name: string;
  
  /** Email address of the user */
  email: string;
  
  /** Role/permission level of the user */
  role: UserRole;
  
  /** Date and time when the user account was created */
  createdAt: Date;
  
  /** Date and time of the user's last activity */
  lastActive: Date;
}

/**
 * API Response wrapper for API calls
 * 
 * @template T - The type of data returned in a successful response
 * @interface ApiResponse
 */
export interface ApiResponse<T> {
  /** Whether the API call was successful */
  success: boolean;
  
  /** Response data (present when success is true) */
  data?: T;
  
  /** Error message (present when success is false) */
  error?: string;
  
  /** Optional informational message */
  message?: string;
}

/**
 * Pagination parameters for paginated API requests
 * 
 * @interface PaginationParams
 */
export interface PaginationParams {
  /** Current page number (1-indexed) */
  page: number;
  
  /** Number of items per page */
  limit: number;
  
  /** Field name to sort by */
  sortBy?: string;
  
  /** Sort order: 'asc' for ascending, 'desc' for descending */
  sortOrder?: 'asc' | 'desc';
}
