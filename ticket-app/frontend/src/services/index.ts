/**
 * Services exports
 * Central export point for all service modules
 */

// Export API functions
export {
  fetchTickets,
  fetchTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
} from './api';

// Export ticket service functions
export {
  fetchTickets as getTickets,
  fetchTicketById as getTicketById,
  createTicket as createNewTicket,
  updateTicket as updateExistingTicket,
  updateTicketStatus,
  updateTicketPriority,
  assignTicket,
  unassignTicket,
  deleteTicket as removeTicket,
  getTicketsByStatus,
  getTicketsByPriority,
  getOverdueTickets,
} from './ticketService';

