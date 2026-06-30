import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { useTickets } from '../hooks/tickets'
import { userTickets } from '../api/tickets'

// Replace the real API module with mocked functions
vi.mock('../api/tickets', () => ({
  userTickets: vi.fn(),
}))

// Create a typed mock
const mockedUserTickets = vi.mocked(userTickets)

const mockTicket = {
  id: 1,
  title: 'Login issue',
  description: 'Cannot login',
  status: 'Open',
  priority: 'High',
  created_at: '2025-01-01',
  user_id: 1,
  comment: '',
}

describe('useTickets', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should have the initial state', () => {
    const { result } = renderHook(() => useTickets(1))
    expect(result.current.userTicketList).toEqual([])
    expect(result.current.isTicketListLoading).toBe(true)
  })

  it('fetches tickets successfully', async () => {
    mockedUserTickets.mockResolvedValue({
      tickets: [mockTicket],
    })

    const { result } = renderHook(() => useTickets(1))

    await act(async () => {
      await result.current.fetchTickets()
    })

    await waitFor(() => {
      expect(result.current.isTicketListLoading).toBe(false)
    })

    expect(mockedUserTickets).toHaveBeenCalledWith(1)

    expect(result.current.userTicketList).toEqual([mockTicket])
  })

  it('handles API errors', async () => {
    mockedUserTickets.mockRejectedValue(new Error('Network Error'))

    const consoleSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    const { result } = renderHook(() => useTickets(1))

    await act(async () => {
      await result.current.fetchTickets()
    })

    await waitFor(() => {
      expect(result.current.isTicketListLoading).toBe(false)
    })

    expect(consoleSpy).toHaveBeenCalled()

    expect(result.current.userTicketList).toEqual([])

    consoleSpy.mockRestore()
  })
})