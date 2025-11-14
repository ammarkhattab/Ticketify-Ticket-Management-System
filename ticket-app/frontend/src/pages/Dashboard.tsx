import React, { useState } from 'react';
import { KanbanBoard } from '../components/features/kanban-board';
import { useTickets } from '../hooks/useTickets';
import { Modal, Button, Input } from '../components/ui';
import { Ticket, TicketCreateInput, Status } from '../types';

/**
 * Dashboard page component
 * Main page displaying the Kanban board with ticket management
 * 
 * @returns {JSX.Element} The dashboard page component
 */
export const Dashboard: React.FC = () => {
  const { tickets, loading, error, addTicket, updateTicket } = useTickets();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<TicketCreateInput>({
    ticketId: '',
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'SCHEDULED',
    category: 'General',
    deadline: new Date().toISOString().split('T')[0],
    csamName: '',
    tpid: '',
    agreementId: '',
    customerName: '',
    customerType: 'SMB',
    notes: [],
    subtasks: [],
    assignedTo: null,
    tags: [],
  });

  /**
   * Handle form input change
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newTicket = await addTicket(formData);
      if (newTicket) {
        setIsCreateModalOpen(false);
        // Reset form
        setFormData({
          ticketId: '',
          title: '',
          description: '',
          priority: 'MEDIUM',
          status: 'SCHEDULED',
          category: 'General',
          deadline: new Date().toISOString().split('T')[0],
          csamName: '',
          tpid: '',
          agreementId: '',
          customerName: '',
          customerType: 'SMB',
          notes: [],
          subtasks: [],
          assignedTo: null,
          tags: [],
        });
      }
    } catch (err) {
      console.error('Error creating ticket:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle ticket status update from Kanban board
   */
  const handleTicketUpdate = async (ticketId: string, newStatus: Status) => {
    try {
      await updateTicket({
        id: ticketId,
        status: newStatus,
      });
    } catch (err) {
      console.error('Error updating ticket status:', err);
    }
  };

  /**
   * Handle ticket click
   */
  const handleTicketClick = (ticket: Ticket) => {
    console.log('Ticket clicked:', ticket);
    // TODO: Open ticket details modal or navigate to ticket page
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading tickets...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
            Error Loading Tickets
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-4">{error}</p>
          <Button
            variant="primary"
            fullWidth
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                CNX Ticketify
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Ticket Management Dashboard
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
            >
              + Create Ticket
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <KanbanBoard
          initialTickets={tickets}
          onTicketUpdate={handleTicketUpdate}
          onTicketClick={handleTicketClick}
        />
      </main>

      {/* Create Ticket Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Ticket"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Ticket ID"
              name="ticketId"
              value={formData.ticketId}
              onChange={handleInputChange}
              required
              placeholder="TCK-001"
            />
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Enter ticket title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter ticket description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="SCHEDULED">Scheduled</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="ACTIVE">Active</option>
                <option value="OVERDUE">Overdue</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <Input
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="General"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Customer Name"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              placeholder="Enter customer name"
            />
            <Input
              label="CSAM Name"
              name="csamName"
              value={formData.csamName}
              onChange={handleInputChange}
              placeholder="Enter CSAM name"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsCreateModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Create Ticket
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;

