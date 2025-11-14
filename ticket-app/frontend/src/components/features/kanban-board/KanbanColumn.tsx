import React from 'react';
import { Ticket, Status } from '../../../types';
import { KanbanTicketCard } from './KanbanTicketCard';

/**
 * Props for KanbanColumn component
 */
export interface KanbanColumnProps {
  /** Column status */
  status: Status;
  
  /** Tickets in this column */
  tickets: Ticket[];
  
  /** Callback when ticket is dropped in this column */
  onDrop: (ticketId: string, newStatus: Status) => void;
  
  /** Callback when ticket is clicked */
  onTicketClick?: (ticket: Ticket) => void;
}

/**
 * Helper function to get display name for status
 */
function getStatusDisplayName(status: Status): string {
  return status.replace('_', ' ');
}

/**
 * Helper function to get column header color classes
 */
function getColumnHeaderClasses(status: Status): string {
  const baseClasses = 'text-sm font-semibold uppercase tracking-wide';
  
  switch (status) {
    case 'SCHEDULED':
      return `${baseClasses} text-sky-700 dark:text-sky-300`;
    case 'IN_PROGRESS':
      return `${baseClasses} text-indigo-700 dark:text-indigo-300`;
    case 'ACTIVE':
      return `${baseClasses} text-violet-700 dark:text-violet-300`;
    case 'OVERDUE':
      return `${baseClasses} text-rose-700 dark:text-rose-300`;
    case 'COMPLETED':
      return `${baseClasses} text-emerald-700 dark:text-emerald-300`;
    default:
      return `${baseClasses} text-gray-700 dark:text-gray-300`;
  }
}

/**
 * Kanban column component representing a status column
 * 
 * @param props - KanbanColumn component properties
 * @returns {JSX.Element} The kanban column component
 */
export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  tickets,
  onDrop,
  onTicketClick,
}) => {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('bg-blue-50', 'dark:bg-blue-900/20');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('bg-blue-50', 'dark:bg-blue-900/20');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-blue-50', 'dark:bg-blue-900/20');
    
    const ticketId = e.dataTransfer.getData('text/plain');
    if (ticketId) {
      onDrop(ticketId, status);
    }
  };

  return (
    <div
      className="flex flex-col h-full min-h-[500px] bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-lg">
        <div className="flex items-center justify-between">
          <h3 className={getColumnHeaderClasses(status)}>
            {getStatusDisplayName(status)}
          </h3>
          <span className="px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 rounded-full">
            {tickets.length}
          </span>
        </div>
      </div>
      
      {/* Tickets Container */}
      <div className="flex-1 p-3 overflow-y-auto">
        {tickets.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-gray-400 dark:text-gray-500">
            No tickets
          </div>
        ) : (
          tickets.map((ticket) => (
            <KanbanTicketCard
              key={ticket.id}
              ticket={ticket}
              onClick={onTicketClick}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;

