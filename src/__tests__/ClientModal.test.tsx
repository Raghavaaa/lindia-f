import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import ClientModal from '@/components/ClientModal'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

describe('ClientModal', () => {
  const mockOnClose = jest.fn()
  const mockOnCreate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render modal when open', () => {
    render(
      <ClientModal
        open={true}
        onClose={mockOnClose}
        onCreate={mockOnCreate}
      />
    )

    expect(screen.getByText('Create New Client')).toBeInTheDocument()
    expect(screen.getByLabelText('Client name')).toBeInTheDocument()
    expect(screen.getByLabelText('Phone number')).toBeInTheDocument()
  })

  it('should not render modal when closed', () => {
    render(
      <ClientModal
        open={false}
        onClose={mockOnClose}
        onCreate={mockOnCreate}
      />
    )

    expect(screen.queryByText('Create New Client')).not.toBeInTheDocument()
  })

  it('should validate phone numbers correctly', async () => {
    render(
      <ClientModal
        open={true}
        onClose={mockOnClose}
        onCreate={mockOnCreate}
      />
    )

    const nameInput = screen.getByLabelText('Client name')
    const phoneInput = screen.getByLabelText('Phone number')
    const createButton = screen.getByText('Create Client')

    // Fill in valid name
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })

    // Test valid phone number
    fireEvent.change(phoneInput, { target: { value: '+919999990987' } })
    fireEvent.click(createButton)

    await waitFor(() => {
      expect(mockOnCreate).toHaveBeenCalledWith({
        name: 'John Doe',
        phone: '+919999990987'
      })
    })
  })

  it('should show validation error for invalid phone number', async () => {
    render(
      <ClientModal
        open={true}
        onClose={mockOnClose}
        onCreate={mockOnCreate}
      />
    )

    const nameInput = screen.getByLabelText('Client name')
    const phoneInput = screen.getByLabelText('Phone number')
    const createButton = screen.getByText('Create Client')

    // Fill in valid name
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })

    // Test invalid phone number
    fireEvent.change(phoneInput, { target: { value: '123' } })
    fireEvent.click(createButton)

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid international phone number (10-15 digits)')).toBeInTheDocument()
    })

    expect(mockOnCreate).not.toHaveBeenCalled()
  })

  it('should show validation error for empty name', async () => {
    render(
      <ClientModal
        open={true}
        onClose={mockOnClose}
        onCreate={mockOnCreate}
      />
    )

    const nameInput = screen.getByLabelText('Client name')
    const phoneInput = screen.getByLabelText('Phone number')
    const createButton = screen.getByText('Create Client')

    // Fill in valid phone but invalid name (too short)
    fireEvent.change(nameInput, { target: { value: 'A' } })
    fireEvent.change(phoneInput, { target: { value: '+919999990987' } })
    fireEvent.click(createButton)

    await waitFor(() => {
      expect(screen.getByText('Name must be 2-100 characters long')).toBeInTheDocument()
    })

    expect(mockOnCreate).not.toHaveBeenCalled()
  })

  it('should normalize phone input', () => {
    render(
      <ClientModal
        open={true}
        onClose={mockOnClose}
        onCreate={mockOnCreate}
      />
    )

    const phoneInput = screen.getByLabelText('Phone number')

    // Test phone normalization
    fireEvent.change(phoneInput, { target: { value: '+91 99999-90987' } })
    expect(phoneInput).toHaveValue('+919999990987')
  })

  it('should have proper accessibility attributes', () => {
    render(
      <ClientModal
        open={true}
        onClose={mockOnClose}
        onCreate={mockOnCreate}
      />
    )

    const nameInput = screen.getByLabelText('Client name')
    const phoneInput = screen.getByLabelText('Phone number')

    expect(nameInput).toHaveAttribute('type', 'text')
    expect(nameInput).toHaveAttribute('inputMode', 'text')
    expect(phoneInput).toHaveAttribute('type', 'tel')
    expect(phoneInput).toHaveAttribute('inputMode', 'tel')
  })

  it('should not have accessibility violations', async () => {
    const { container } = render(
      <ClientModal
        open={true}
        onClose={mockOnClose}
        onCreate={mockOnCreate}
      />
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should call onClose when cancel button is clicked', () => {
    render(
      <ClientModal
        open={true}
        onClose={mockOnClose}
        onCreate={mockOnCreate}
      />
    )

    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalled()
  })
})
