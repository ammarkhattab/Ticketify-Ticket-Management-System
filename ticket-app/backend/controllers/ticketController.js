/**
 * Ticket Controller
 * Handles business logic for ticket-related operations
 */

// Mock in-memory ticket data
// In production, this would be replaced with database queries
let tickets = [
  {
    id: '1',
    ticketId: 'TCK-001',
    title: 'Implement user authentication',
    description: 'Add login and registration functionality',
    priority: 'HIGH',
    status: 'SCHEDULED',
    category: 'Feature',
    deadline: new Date('2025-12-31').toISOString(),
    completedAt: null,
    createdAt: new Date('2025-11-01').toISOString(),
    updatedAt: new Date('2025-11-01').toISOString(),
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
    deadline: new Date('2025-11-20').toISOString(),
    completedAt: null,
    createdAt: new Date('2025-11-05').toISOString(),
    updatedAt: new Date('2025-11-10').toISOString(),
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
    deadline: new Date('2025-12-15').toISOString(),
    completedAt: null,
    createdAt: new Date('2025-11-08').toISOString(),
    updatedAt: new Date('2025-11-12').toISOString(),
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
    deadline: new Date('2025-11-10').toISOString(),
    completedAt: null,
    createdAt: new Date('2025-10-20').toISOString(),
    updatedAt: new Date('2025-11-10').toISOString(),
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
    deadline: new Date('2025-11-15').toISOString(),
    completedAt: new Date('2025-11-14').toISOString(),
    createdAt: new Date('2025-10-25').toISOString(),
    updatedAt: new Date('2025-11-14').toISOString(),
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
 * Generate a unique ID for new tickets
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Get all tickets
 * GET /api/tickets
 */
exports.getTickets = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: tickets,
      error: null,
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: 'Failed to fetch tickets',
    });
  }
};

/**
 * Get a single ticket by ID
 * GET /api/tickets/:id
 */
exports.getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const ticket = tickets.find((t) => t.id === id);
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        data: null,
        error: 'Ticket not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: ticket,
      error: null,
    });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: 'Failed to fetch ticket',
    });
  }
};

/**
 * Create a new ticket
 * POST /api/tickets
 */
exports.createTicket = async (req, res) => {
  try {
    const {
      ticketId,
      title,
      description,
      priority,
      status,
      category,
      deadline,
      csamName,
      tpid,
      agreementId,
      customerName,
      customerType,
      notes,
      subtasks,
      assignedTo,
      tags,
    } = req.body;
    
    // Validate required fields
    if (!ticketId || !title) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Ticket ID and title are required',
      });
    }
    
    // Check if ticketId already exists
    const existingTicket = tickets.find((t) => t.ticketId === ticketId);
    if (existingTicket) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Ticket ID already exists',
      });
    }
    
    // Create new ticket
    const newTicket = {
      id: generateId(),
      ticketId,
      title,
      description: description || '',
      priority: priority || 'MEDIUM',
      status: status || 'SCHEDULED',
      category: category || 'General',
      deadline: deadline ? new Date(deadline).toISOString() : new Date().toISOString(),
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      csamName: csamName || '',
      tpid: tpid || '',
      agreementId: agreementId || '',
      customerName: customerName || '',
      customerType: customerType || 'SMB',
      notes: notes || [],
      subtasks: subtasks || [],
      assignedTo: assignedTo || null,
      tags: tags || [],
    };
    
    tickets.push(newTicket);
    
    res.status(201).json({
      success: true,
      data: newTicket,
      error: null,
    });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: 'Failed to create ticket',
    });
  }
};

/**
 * Update an existing ticket
 * PUT /api/tickets/:id
 */
exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const ticketIndex = tickets.findIndex((t) => t.id === id);
    
    if (ticketIndex === -1) {
      return res.status(404).json({
        success: false,
        data: null,
        error: 'Ticket not found',
      });
    }
    
    // Don't allow updating id, createdAt
    delete updateData.id;
    delete updateData.createdAt;
    
    // Update ticket
    const updatedTicket = {
      ...tickets[ticketIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
      // Set completedAt if status is COMPLETED
      completedAt:
        updateData.status === 'COMPLETED'
          ? new Date().toISOString()
          : tickets[ticketIndex].completedAt,
    };
    
    tickets[ticketIndex] = updatedTicket;
    
    res.status(200).json({
      success: true,
      data: updatedTicket,
      error: null,
    });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: 'Failed to update ticket',
    });
  }
};

/**
 * Delete a ticket
 * DELETE /api/tickets/:id
 */
exports.deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    
    const ticketIndex = tickets.findIndex((t) => t.id === id);
    
    if (ticketIndex === -1) {
      return res.status(404).json({
        success: false,
        data: null,
        error: 'Ticket not found',
      });
    }
    
    tickets.splice(ticketIndex, 1);
    
    res.status(200).json({
      success: true,
      data: { message: 'Ticket deleted successfully' },
      error: null,
    });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: 'Failed to delete ticket',
    });
  }
};

