import React from 'react';
import { Ticket } from '../../../types';
import { PriorityBadge } from '../../ui';

/**
 * Props for KanbanTicketCard component
 */
export interface KanbanTicketCardProps {
  /** Ticket data to display */
  ticket: Ticket;
  
  /** Callback when ticket is clicked */
  onClick?: (ticket: Ticket) => void;
}

/**
 * Ticket card component for Kanban board
 * Displays ticket information in a draggable card format
 * 
 * @param props - KanbanTicketCard component properties
 * @returns {JSX.Element} The kanban ticket card component
 */
export const KanbanTicketCard: React.FC<KanbanTicketCardProps> = ({
  ticket,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(ticket);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', ticket.id);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      className="mb-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-move hover:border-blue-300 dark:hover:border-blue-600"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Ticket ${ticket.ticketId}: ${ticket.title}`}
    >
      <div className="flex flex-col gap-2">
        {/* Ticket ID */}
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {ticket.ticketId}
        </p>
        
        {/* Title */}
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
          {ticket.title}
        </h4>
        
        {/* Priority Badge */}
        <div className="flex items-center gap-2">
          <PriorityBadge priority={ticket.priority} size="sm" />
        </div>
        
        {/* Additional info */}
        {ticket.assignedTo && (
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            Assigned
          </p>
        )}
      </div>
    </div>
  );
};

export default KanbanTicketCard;

