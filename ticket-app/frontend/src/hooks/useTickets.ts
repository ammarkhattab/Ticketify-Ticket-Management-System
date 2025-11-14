import { useState, useEffect, useCallback } from 'react';
import { Ticket, TicketCreateInput, TicketUpdateInput } from '../types';
import {
  fetchTickets as fetchTicketsService,
  createTicket as createTicketService,
  updateTicket as updateTicketService,
  deleteTicket as deleteTicketService,
} from '../services/ticketService';

/**
 * Return type for useTickets hook
 */
export interface UseTicketsReturn {
  /** Array of tickets */
  tickets: Ticket[];
  
  /** Loading state */
  loading: boolean;
  
  /** Error message if any */
  error: string | null;
  
  /** Function to add a new ticket */
  addTicket: (ticketData: TicketCreateInput) => Promise<Ticket | null>;
  
  /** Function to update an existing ticket */
  updateTicket: (ticketData: TicketUpdateInput) => Promise<Ticket | null>;
  
  /** Function to delete a ticket */
  deleteTicket: (ticketId: string) => Promise<boolean>;
  
  /** Function to refresh tickets from API */
  refreshTickets: () => Promise<void>;
}

/**
 * Custom hook for managing tickets state and operations
 * 
 * Provides state management for tickets with loading and error states,
 * along with functions to add, update, and delete tickets.
 * 
 * @returns {UseTicketsReturn} Object containing tickets, loading state, error, and CRUD functions
 * 
 * @example
 * ```tsx
 * const { tickets, loading, error, addTicket, updateTicket, deleteTicket } = useTickets();
 * ```
 */
export const useTickets = (): UseTicketsReturn => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch tickets from the API
   */
  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTickets = await fetchTicketsService();
      setTickets(fetchedTickets);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tickets';
      setError(errorMessage);
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Add a new ticket
   */
  const addTicket = useCallback(async (ticketData: TicketCreateInput): Promise<Ticket | null> => {
    try {
      setError(null);
      const newTicket = await createTicketService(ticketData);
      setTickets((prevTickets) => [...prevTickets, newTicket]);
      return newTicket;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create ticket';
      setError(errorMessage);
      console.error('Error creating ticket:', err);
      return null;
    }
  }, []);

  /**
   * Update an existing ticket
   */
  const updateTicket = useCallback(async (ticketData: TicketUpdateInput): Promise<Ticket | null> => {
    try {
      setError(null);
      const updatedTicket = await updateTicketService(ticketData);
      setTickets((prevTickets) =>
        prevTickets.map((ticket) => (ticket.id === updatedTicket.id ? updatedTicket : ticket))
      );
      return updatedTicket;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update ticket';
      setError(errorMessage);
      console.error('Error updating ticket:', err);
      return null;
    }
  }, []);

  /**
   * Delete a ticket
   */
  const deleteTicket = useCallback(async (ticketId: string): Promise<boolean> => {
    try {
      setError(null);
      await deleteTicketService(ticketId);
      setTickets((prevTickets) => prevTickets.filter((ticket) => ticket.id !== ticketId));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete ticket';
      setError(errorMessage);
      console.error('Error deleting ticket:', err);
      return false;
    }
  }, []);

  // Fetch tickets on component mount
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return {
    tickets,
    loading,
    error,
    addTicket,
    updateTicket,
    deleteTicket,
    refreshTickets: fetchTickets,
  };
};

