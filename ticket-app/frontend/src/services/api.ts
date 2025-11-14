/**
 * Base API service for making HTTP requests
 * Handles common API operations, error handling, and response typing
 */

import { ApiResponse, Ticket, TicketCreateInput, TicketUpdateInput } from '../types';

/**
 * Base URL for API requests
 * Defaults to http://localhost:3001 if REACT_APP_API_URL is not set
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

/**
 * Default headers for API requests
 */
const getDefaultHeaders = (): HeadersInit => {
  return {
    'Content-Type': 'application/json',
    // Add authorization header if token exists
    ...(localStorage.getItem('authToken') && {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    }),
  };
};

/**
 * Handles API response and throws error if request failed
 * 
 * @param response - Fetch API response object
 * @returns Promise that resolves to the parsed JSON response
 * @throws Error if response is not ok
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: response.statusText || 'An error occurred',
    }));
    
    throw new Error(
      errorData.message || errorData.error || `HTTP error! status: ${response.status}`
    );
  }
  
  return response.json();
}

/**
 * Generic API request function
 * 
 * @param endpoint - API endpoint (relative to API_BASE_URL)
 * @param options - Fetch API options
 * @returns Promise that resolves to the typed response data
 * @throws Error if request fails
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...getDefaultHeaders(),
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, config);
    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`API request failed for ${endpoint}:`, error.message);
      throw error;
    }
    throw new Error('An unknown error occurred during API request');
  }
}

/**
 * Fetch all tickets from the API
 * 
 * @returns Promise that resolves to an array of tickets
 * @throws Error if request fails
 */
export async function fetchTickets(): Promise<Ticket[]> {
  try {
    const response = await apiRequest<ApiResponse<Ticket[]>>('/api/tickets');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
}

/**
 * Fetch a single ticket by ID
 * 
 * @param ticketId - The ID of the ticket to fetch
 * @returns Promise that resolves to a ticket
 * @throws Error if request fails
 */
export async function fetchTicketById(ticketId: string): Promise<Ticket> {
  try {
    const response = await apiRequest<ApiResponse<Ticket>>(`/api/tickets/${ticketId}`);
    if (!response.data) {
      throw new Error('Ticket not found');
    }
    return response.data;
  } catch (error) {
    console.error(`Error fetching ticket ${ticketId}:`, error);
    throw error;
  }
}

/**
 * Create a new ticket
 * 
 * @param ticketData - Ticket data for creation
 * @returns Promise that resolves to the created ticket
 * @throws Error if request fails
 */
export async function createTicket(ticketData: TicketCreateInput): Promise<Ticket> {
  try {
    const response = await apiRequest<ApiResponse<Ticket>>('/api/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
    
    if (!response.data) {
      throw new Error('Failed to create ticket');
    }
    
    return response.data;
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
 * @throws Error if request fails
 */
export async function updateTicket(ticketData: TicketUpdateInput): Promise<Ticket> {
  try {
    const { id, ...updateData } = ticketData;
    const response = await apiRequest<ApiResponse<Ticket>>(`/api/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    
    if (!response.data) {
      throw new Error('Failed to update ticket');
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error updating ticket ${ticketData.id}:`, error);
    throw error;
  }
}

/**
 * Delete a ticket by ID
 * 
 * @param ticketId - The ID of the ticket to delete
 * @returns Promise that resolves when deletion is successful
 * @throws Error if request fails
 */
export async function deleteTicket(ticketId: string): Promise<void> {
  try {
    await apiRequest<ApiResponse<void>>(`/api/tickets/${ticketId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error(`Error deleting ticket ${ticketId}:`, error);
    throw error;
  }
}

