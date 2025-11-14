/**
 * Type definitions for Ticket-related entities in the CNX Ticketify application
 */

/**
 * Ticket priority levels
 * - LOW: Low priority, can be handled when time permits
 * - MEDIUM: Normal priority, standard handling
 * - HIGH: High priority, requires attention soon
 * - URGENT: Urgent priority, requires immediate attention
 */
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

/**
 * Ticket status values
 * - SCHEDULED: Ticket is scheduled for future work
 * - IN_PROGRESS: Ticket is currently being worked on
 * - ACTIVE: Ticket is active and awaiting action
 * - OVERDUE: Ticket has passed its deadline
 * - COMPLETED: Ticket has been completed
 */
export type Status = 'SCHEDULED' | 'IN_PROGRESS' | 'ACTIVE' | 'OVERDUE' | 'COMPLETED';

/**
 * Customer type classification
 * - ENTERPRISE: Large enterprise customer
 * - SMB: Small to medium business
 * - STARTUP: Startup company
 */
export type CustomerType = 'ENTERPRISE' | 'SMB' | 'STARTUP';

/**
 * Subtask interface representing a sub-task within a ticket
 * 
 * @interface Subtask
 */
export interface Subtask {
  /** Unique identifier for the subtask */
  id: string;
  
  /** Text description of the subtask */
  text: string;
  
  /** Whether the subtask has been completed */
  completed: boolean;
  
  /** Date and time when the subtask was completed, null if not completed */
  completedAt: Date | null;
}

/**
 * Ticket interface representing a ticket entity in the system
 * 
 * A ticket represents a work item, task, or issue that needs to be tracked
 * and managed through its lifecycle from creation to completion.
 * 
 * @interface Ticket
 */
export interface Ticket {
  /** Unique identifier (UUID) for the ticket */
  id: string;
  
  /** Human-readable ticket identifier (e.g., "TCK-12345") */
  ticketId: string;
  
  /** Title or summary of the ticket */
  title: string;
  
  /** Detailed description of the ticket */
  description: string;
  
  /** Expected completion deadline */
  deadline: Date;
  
  /** Priority level of the ticket */
  priority: Priority;
  
  /** Category or type of ticket (e.g., "Bug", "Feature", "Support") */
  category: string;
  
  /** Current status of the ticket */
  status: Status;
  
  /** Date and time when the ticket was completed, null if not completed */
  completedAt: Date | null;
  
  /** Date and time when the ticket was created */
  createdAt: Date;
  
  /** Date and time when the ticket was last updated */
  updatedAt: Date;
  
  /** Name of the Customer Success Account Manager (CSAM) */
  csamName: string;
  
  /** T-Process ID associated with the ticket */
  tpid: string;
  
  /** Customer agreement ID */
  agreementId: string;
  
  /** Name of the customer or company */
  customerName: string;
  
  /** Type of customer (Enterprise, SMB, or Startup) */
  customerType: CustomerType;
  
  /** Array of internal notes and comments */
  notes: string[];
  
  /** Array of subtasks associated with this ticket */
  subtasks: Subtask[];
  
  /** User ID of the person assigned to this ticket, null if unassigned */
  assignedTo: string | null;
  
  /** Array of tags for filtering and categorization */
  tags: string[];
}

/**
 * Input type for creating a new ticket
 * Omits auto-generated fields like id, createdAt, updatedAt, completedAt
 * 
 * @interface TicketCreateInput
 */
export interface TicketCreateInput
  extends Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'completedAt' | 'subtasks'> {
  /** Optional subtasks to include when creating the ticket */
  subtasks?: Omit<Subtask, 'id' | 'completedAt'>[];
}

/**
 * Input type for updating an existing ticket
 * All fields are optional except id
 * 
 * @interface TicketUpdateInput
 */
export interface TicketUpdateInput extends Partial<Omit<Ticket, 'id' | 'createdAt'>> {
  /** Ticket ID (required for updates) */
  id: string;
  
  /** Optional subtasks to update */
  subtasks?: Subtask[];
}

/**
 * Input type for creating a new subtask
 * Omits auto-generated fields like id and completedAt
 * 
 * @interface SubtaskCreateInput
 */
export interface SubtaskCreateInput extends Omit<Subtask, 'id' | 'completedAt'> {}

/**
 * Input type for updating an existing subtask
 * 
 * @interface SubtaskUpdateInput
 */
export interface SubtaskUpdateInput extends Partial<Omit<Subtask, 'id'>> {
  /** Subtask ID (required for updates) */
  id: string;
}

/**
 * Ticket statistics and summary information
 * 
 * @interface TicketStats
 */
export interface TicketStats {
  /** Total number of tickets */
  total: number;
  
  /** Number of tickets by status */
  byStatus: Record<Status, number>;
  
  /** Number of tickets by priority */
  byPriority: Record<Priority, number>;
  
  /** Number of overdue tickets */
  overdue: number;
  
  /** Number of completed tickets */
  completed: number;
  
  /** Average time to completion in hours */
  averageCompletionTime?: number;
}

/**
 * Ticket with computed/derived fields
 * Extends Ticket with additional calculated properties
 * 
 * @interface TicketWithMetadata
 */
export interface TicketWithMetadata extends Ticket {
  /** Whether the ticket is overdue */
  isOverdue: boolean;
  
  /** Number of days until deadline (negative if overdue) */
  daysUntilDeadline: number;
  
  /** Completion percentage based on subtasks */
  completionPercentage: number;
  
  /** Number of completed subtasks */
  completedSubtasksCount: number;
  
  /** Total number of subtasks */
  totalSubtasksCount: number;
}

/**
 * Filter parameters for querying tickets
 * 
 * @interface TicketFilters
 */
export interface TicketFilters {
  /** Filter by ticket status(es) */
  status?: Status[];
  
  /** Filter by priority level(s) */
  priority?: Priority[];
  
  /** Filter by category(ies) */
  category?: string[];
  
  /** Filter by CSAM name(s) */
  csamName?: string[];
  
  /** Filter by customer name (partial match) */
  customerName?: string;
  
  /** Filter by assigned user ID */
  assignedTo?: string;
  
  /** Filter by tags */
  tags?: string[];
  
  /** Full-text search query */
  search?: string;
}

