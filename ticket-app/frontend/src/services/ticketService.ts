/**
 * Ticket service layer with higher-level business logic
 * Provides convenient methods for ticket operations with additional functionality
 */

import {
  Ticket,
  TicketCreateInput,
  TicketUpdateInput,
  TicketFilters,
  Priority,
  Status,
} from '../types';
import {
  fetchTickets as apiFetchTickets,
  fetchTicketById as apiFetchTicketById,
  createTicket as apiCreateTicket,
  updateTicket as apiUpdateTicket,
  deleteTicket as apiDeleteTicket,
} from './api';

/**
 * Fetch all tickets with optional filtering
 * 
 * @param filters - Optional filters to apply to the ticket list
 * @returns Promise that resolves to an array of filtered tickets
 */
export async function fetchTickets(filters?: TicketFilters): Promise<Ticket[]> {
  try {
    const tickets = await apiFetchTickets();
    
    if (!filters) {
      return tickets;
    }
    
    return tickets.filter((ticket) => {
      // Filter by status
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(ticket.status)) {
          return false;
        }
      }
      
      // Filter by priority
      if (filters.priority && filters.priority.length > 0) {
        if (!filters.priority.includes(ticket.priority)) {
          return false;
        }
      }
      
      // Filter by category
      if (filters.category && filters.category.length > 0) {
        if (!filters.category.includes(ticket.category)) {
          return false;
        }
      }
      
      // Filter by CSAM name
      if (filters.csamName && filters.csamName.length > 0) {
        if (!filters.csamName.includes(ticket.csamName)) {
          return false;
        }
      }
      
      // Filter by customer name (partial match)
      if (filters.customerName) {
        if (
          !ticket.customerName
            .toLowerCase()
            .includes(filters.customerName.toLowerCase())
        ) {
          return false;
        }
      }
      
      // Filter by assigned user
      if (filters.assignedTo) {
        if (ticket.assignedTo !== filters.assignedTo) {
          return false;
        }
      }
      
      // Filter by tags
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some((tag) =>
          ticket.tags.includes(tag)
        );
        if (!hasMatchingTag) {
          return false;
        }
      }
      
      // Full-text search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const searchableText = [
          ticket.title,
          ticket.description,
          ticket.ticketId,
          ticket.customerName,
          ticket.csamName,
        ]
          .join(' ')
          .toLowerCase();
        
        if (!searchableText.includes(searchLower)) {
          return false;
        }
      }
      
      return true;
    });
  } catch (error) {
    console.error('Error fetching tickets with filters:', error);
    throw error;
  }
}

/**
 * Fetch a single ticket by ID
 * 
 * @param ticketId - The ID of the ticket to fetch
 * @returns Promise that resolves to a ticket
 */
export async function fetchTicketById(ticketId: string): Promise<Ticket> {
  try {
    return await apiFetchTicketById(ticketId);
  } catch (error) {
    console.error(`Error fetching ticket ${ticketId}:`, error);
    throw error;
  }
}

/**
 * Create a new ticket with validation
 * 
 * @param ticketData - Ticket data for creation
 * @returns Promise that resolves to the created ticket
 */
export async function createTicket(ticketData: TicketCreateInput): Promise<Ticket> {
  try {
    // Validate required fields
    if (!ticketData.title || ticketData.title.trim().length === 0) {
      throw new Error('Ticket title is required');
    }
    
    if (!ticketData.ticketId || ticketData.ticketId.trim().length === 0) {
      throw new Error('Ticket ID is required');
    }
    
    // Set default values if not provided
    const ticketWithDefaults: TicketCreateInput = {
      ...ticketData,
      priority: ticketData.priority || 'MEDIUM',
      status: ticketData.status || 'SCHEDULED',
      notes: ticketData.notes || [],
      tags: ticketData.tags || [],
      subtasks: ticketData.subtasks || [],
    };
    
    return await apiCreateTicket(ticketWithDefaults);
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
}

/**
 * Update an existing ticket
 * 
 * @param ticketData - Ticket data for update (must include id)
 * @returns Promise that resolves to the updated ticket
 */
export async function updateTicket(ticketData: TicketUpdateInput): Promise<Ticket> {
  try {
    if (!ticketData.id) {
      throw new Error('Ticket ID is required for update');
    }
    
    return await apiUpdateTicket(ticketData);
  } catch (error) {
    console.error(`Error updating ticket ${ticketData.id}:`, error);
    throw error;
  }
}

/**
 * Update ticket status
 * 
 * @param ticketId - The ID of the ticket to update
 * @param status - New status value
 * @returns Promise that resolves to the updated ticket
 */
export async function updateTicketStatus(
  ticketId: string,
  status: Status
): Promise<Ticket> {
  try {
    return await updateTicket({
      id: ticketId,
      status,
      completedAt: status === 'COMPLETED' ? new Date() : undefined,
    });
  } catch (error) {
    console.error(`Error updating ticket status for ${ticketId}:`, error);
    throw error;
  }
}

/**
 * Update ticket priority
 * 
 * @param ticketId - The ID of the ticket to update
 * @param priority - New priority value
 * @returns Promise that resolves to the updated ticket
 */
export async function updateTicketPriority(
  ticketId: string,
  priority: Priority
): Promise<Ticket> {
  try {
    return await updateTicket({
      id: ticketId,
      priority,
    });
  } catch (error) {
    console.error(`Error updating ticket priority for ${ticketId}:`, error);
    throw error;
  }
}

/**
 * Assign ticket to a user
 * 
 * @param ticketId - The ID of the ticket to assign
 * @param userId - The ID of the user to assign to
 * @returns Promise that resolves to the updated ticket
 */
export async function assignTicket(
  ticketId: string,
  userId: string
): Promise<Ticket> {
  try {
    return await updateTicket({
      id: ticketId,
      assignedTo: userId,
    });
  } catch (error) {
    console.error(`Error assigning ticket ${ticketId}:`, error);
    throw error;
  }
}

/**
 * Unassign ticket (remove assignment)
 * 
 * @param ticketId - The ID of the ticket to unassign
 * @returns Promise that resolves to the updated ticket
 */
export async function unassignTicket(ticketId: string): Promise<Ticket> {
  try {
    return await updateTicket({
      id: ticketId,
      assignedTo: null,
    });
  } catch (error) {
    console.error(`Error unassigning ticket ${ticketId}:`, error);
    throw error;
  }
}

/**
 * Delete a ticket by ID
 * 
 * @param ticketId - The ID of the ticket to delete
 * @returns Promise that resolves when deletion is successful
 */
export async function deleteTicket(ticketId: string): Promise<void> {
  try {
    await apiDeleteTicket(ticketId);
  } catch (error) {
    console.error(`Error deleting ticket ${ticketId}:`, error);
    throw error;
  }
}

/**
 * Get tickets by status
 * 
 * @param status - Status to filter by
 * @returns Promise that resolves to an array of tickets with the specified status
 */
export async function getTicketsByStatus(status: Status): Promise<Ticket[]> {
  return fetchTickets({ status: [status] });
}

/**
 * Get tickets by priority
 * 
 * @param priority - Priority to filter by
 * @returns Promise that resolves to an array of tickets with the specified priority
 */
export async function getTicketsByPriority(priority: Priority): Promise<Ticket[]> {
  return fetchTickets({ priority: [priority] });
}

/**
 * Get overdue tickets
 * 
 * @returns Promise that resolves to an array of overdue tickets
 */
export async function getOverdueTickets(): Promise<Ticket[]> {
  const tickets = await fetchTickets({ status: ['OVERDUE'] });
  return tickets.filter(
    (ticket) => new Date(ticket.deadline) < new Date() && ticket.status !== 'COMPLETED'
  );
}

