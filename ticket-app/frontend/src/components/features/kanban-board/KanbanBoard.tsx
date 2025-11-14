import React, { useState, useCallback } from 'react';
import { Ticket, Status } from '../../../types';
import { KanbanColumn } from './KanbanColumn';

/**
 * Props for KanbanBoard component
 */
export interface KanbanBoardProps {
  /** Initial tickets to display */
  initialTickets?: Ticket[];
  
  /** Callback when ticket status is updated */
  onTicketUpdate?: (ticketId: string, newStatus: Status) => void;
  
  /** Callback when ticket is clicked */
  onTicketClick?: (ticket: Ticket) => void;
}

/**
 * All possible ticket statuses for Kanban columns
 */
const KANBAN_STATUSES: Status[] = [
  'SCHEDULED',
  'IN_PROGRESS',
  'ACTIVE',
  'OVERDUE',
  'COMPLETED',
];

/**
 * Mock ticket data for testing
 */
const MOCK_TICKETS: Ticket[] = [
  {
    id: '1',
    ticketId: 'TCK-001',
    title: 'Implement user authentication',
    description: 'Add login and registration functionality',
    priority: 'HIGH',
    status: 'SCHEDULED',
    category: 'Feature',
    deadline: new Date('2025-12-31'),
    completedAt: null,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-01'),
    csamName: 'John Doe',
    tpid: 'TP-001',
    agreementId: 'AGR-001',
    customerName: 'Acme Corp',
    customerType: 'ENTERPRISE',
    notes: [],
    subtasks: [],
    assignedTo: 'user-1',
    tags: ['auth', 'security'],
  },
  {
    id: '2',
    ticketId: 'TCK-002',
    title: 'Fix payment processing bug',
    description: 'Payment gateway integration issue',
    priority: 'URGENT',
    status: 'IN_PROGRESS',
    category: 'Bug',
    deadline: new Date('2025-11-20'),
    completedAt: null,
    createdAt: new Date('2025-11-05'),
    updatedAt: new Date('2025-11-10'),
    csamName: 'Jane Smith',
    tpid: 'TP-002',
    agreementId: 'AGR-002',
    customerName: 'Tech Startup',
    customerType: 'STARTUP',
    notes: [],
    subtasks: [],
    assignedTo: 'user-2',
    tags: ['payment', 'bug'],
  },
  {
    id: '3',
    ticketId: 'TCK-003',
    title: 'Design new dashboard UI',
    description: 'Create modern dashboard interface',
    priority: 'MEDIUM',
    status: 'ACTIVE',
    category: 'Design',
    deadline: new Date('2025-12-15'),
    completedAt: null,
    createdAt: new Date('2025-11-08'),
    updatedAt: new Date('2025-11-12'),
    csamName: 'Bob Johnson',
    tpid: 'TP-003',
    agreementId: 'AGR-003',
    customerName: 'SMB Inc',
    customerType: 'SMB',
    notes: [],
    subtasks: [],
    assignedTo: null,
    tags: ['design', 'ui'],
  },
  {
    id: '4',
    ticketId: 'TCK-004',
    title: 'Update API documentation',
    description: 'Document all API endpoints',
    priority: 'LOW',
    status: 'OVERDUE',
    category: 'Documentation',
    deadline: new Date('2025-11-10'),
    completedAt: null,
    createdAt: new Date('2025-10-20'),
    updatedAt: new Date('2025-11-10'),
    csamName: 'Alice Williams',
    tpid: 'TP-004',
    agreementId: 'AGR-004',
    customerName: 'Dev Corp',
    customerType: 'ENTERPRISE',
    notes: [],
    subtasks: [],
    assignedTo: 'user-3',
    tags: ['docs', 'api'],
  },
  {
    id: '5',
    ticketId: 'TCK-005',
    title: 'Setup CI/CD pipeline',
    description: 'Configure automated deployment',
    priority: 'HIGH',
    status: 'COMPLETED',
    category: 'DevOps',
    deadline: new Date('2025-11-15'),
    completedAt: new Date('2025-11-14'),
    createdAt: new Date('2025-10-25'),
    updatedAt: new Date('2025-11-14'),
    csamName: 'Charlie Brown',
    tpid: 'TP-005',
    agreementId: 'AGR-005',
    customerName: 'Cloud Services',
    customerType: 'ENTERPRISE',
    notes: [],
    subtasks: [],
    assignedTo: 'user-1',
    tags: ['ci-cd', 'devops'],
  },
];

/**
 * Kanban board component for visualizing and managing tickets
 * 
 * Displays tickets in columns based on their status with drag-and-drop functionality
 * 
 * @param props - KanbanBoard component properties
 * @returns {JSX.Element} The kanban board component
 * 
 * @example
 * ```tsx
 * <KanbanBoard
 *   initialTickets={tickets}
 *   onTicketUpdate={(id, status) => updateTicket(id, status)}
 *   onTicketClick={(ticket) => openTicketDetails(ticket)}
 * />
 * ```
 */
export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  initialTickets = MOCK_TICKETS,
  onTicketUpdate,
  onTicketClick,
}) => {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);

  /**
   * Group tickets by status
   */
  const getTicketsByStatus = useCallback(
    (status: Status): Ticket[] => {
      return tickets.filter((ticket) => ticket.status === status);
    },
    [tickets]
  );

  /**
   * Handle ticket drop in a column
   */
  const handleDrop = useCallback(
    (ticketId: string, newStatus: Status) => {
      setTickets((prevTickets) =>
        prevTickets.map((ticket) => {
          if (ticket.id === ticketId) {
            const updatedTicket: Ticket = {
              ...ticket,
              status: newStatus,
              updatedAt: new Date(),
              completedAt: newStatus === 'COMPLETED' ? new Date() : ticket.completedAt,
            };
            
            // Call update callback if provided
            if (onTicketUpdate) {
              onTicketUpdate(ticketId, newStatus);
            }
            
            return updatedTicket;
          }
          return ticket;
        })
      );
    },
    [onTicketUpdate]
  );

  return (
    <div className="w-full h-full p-4 bg-gray-50 dark:bg-gray-900">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Kanban Board
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Drag and drop tickets between columns to update their status
        </p>
      </div>
      
      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {KANBAN_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tickets={getTicketsByStatus(status)}
            onDrop={handleDrop}
            onTicketClick={onTicketClick}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;

