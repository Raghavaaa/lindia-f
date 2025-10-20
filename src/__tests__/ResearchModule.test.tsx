import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock the hooks
jest.mock('../hooks/api', () => ({
  useResearch: () => ({
    mutate: jest.fn(),
    isPending: false
  })
}))

jest.mock('../hooks/use-api-toast', () => ({
  useApiToast: () => ({
    warning: jest.fn(),
    success: jest.fn(),
    error: jest.fn()
  })
}))

// Mock uuid
jest.mock('uuid', () => ({
  v4: () => 'test-uuid'
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => children
}))

// Import after mocks
import ResearchModule from '../components/ResearchModule'

describe('ResearchModule', () => {
  const mockOnResearchComplete = jest.fn()
  const mockOnOpenClientSelector = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should show client selection CTA when no client is selected', () => {
    render(
      <ResearchModule
        clientId=""
        onResearchComplete={mockOnResearchComplete}
        onOpenClientSelector={mockOnOpenClientSelector}
      />
    )

    expect(screen.getByText('Select a client to run Research')).toBeInTheDocument()
    expect(screen.getByText('Choose a client from the left panel to start your legal research')).toBeInTheDocument()
    expect(screen.getByText('Select Client')).toBeInTheDocument()
  })

  it('should show research form when client is selected', () => {
    render(
      <ResearchModule
        clientId="test-client-id"
        onResearchComplete={mockOnResearchComplete}
        onOpenClientSelector={mockOnOpenClientSelector}
      />
    )

    expect(screen.getByPlaceholderText(/Enter your legal research question/)).toBeInTheDocument()
    expect(screen.getByText('Press Enter to run research')).toBeInTheDocument()
    expect(screen.getByText('Run Research')).toBeInTheDocument()
  })

  it('should call onOpenClientSelector when Select Client button is clicked', () => {
    render(
      <ResearchModule
        clientId=""
        onResearchComplete={mockOnResearchComplete}
        onOpenClientSelector={mockOnOpenClientSelector}
      />
    )

    fireEvent.click(screen.getByText('Select Client'))
    expect(mockOnOpenClientSelector).toHaveBeenCalledTimes(1)
  })

  it('should disable research button when no query is entered', () => {
    render(
      <ResearchModule
        clientId="test-client-id"
        onResearchComplete={mockOnResearchComplete}
        onOpenClientSelector={mockOnOpenClientSelector}
      />
    )

    const researchButton = screen.getByTitle('Enter a query first')
    expect(researchButton).toBeDisabled()
  })

  it('should enable research button when query is entered', () => {
    render(
      <ResearchModule
        clientId="test-client-id"
        onResearchComplete={mockOnResearchComplete}
        onOpenClientSelector={mockOnOpenClientSelector}
      />
    )

    const textarea = screen.getByPlaceholderText(/Enter your legal research question/)
    fireEvent.change(textarea, { target: { value: 'Test research query' } })

    const researchButton = screen.getByTitle('Run Research')
    expect(researchButton).not.toBeDisabled()
  })

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <ResearchModule
        clientId="test-client-id"
        onResearchComplete={mockOnResearchComplete}
        onOpenClientSelector={mockOnOpenClientSelector}
      />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
