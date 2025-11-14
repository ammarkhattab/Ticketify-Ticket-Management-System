/**
 * Ticket Routes
 * Defines all routes related to ticket operations
 */

const express = require('express');
const router = express.Router();
const {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
} = require('../controllers/ticketController');

/**
 * GET /api/tickets
 * List all tickets
 */
router.get('/', getTickets);

/**
 * GET /api/tickets/:id
 * Get a single ticket by ID
 */
router.get('/:id', getTicketById);

/**
 * POST /api/tickets
 * Create a new ticket
 */
router.post('/', createTicket);

/**
 * PUT /api/tickets/:id
 * Update an existing ticket
 */
router.put('/:id', updateTicket);

/**
 * DELETE /api/tickets/:id
 * Delete a ticket
 */
router.delete('/:id', deleteTicket);

module.exports = router;

