import { describe, it, expect } from 'vitest'
import { statusBadge } from './utils/ticketStyles'
import { formatTicketDate } from './utils/formatDate'

describe('statusBadge', () => {
  it('should proper styling for different ticket status', () => {
    expect(statusBadge('Open')).toContain('bg-blue-50 text-blue-700 border-blue-200')
    expect(statusBadge('Resolved')).toContain('text-green-700')
    expect(statusBadge('SomethingWeird')).toBe('bg-slate-50 text-slate-400 border-slate-200')
  })
})

describe('Date Formatting function test', () => {
  it('should return formatted date', () => {
    expect(formatTicketDate('2026-05-31 12:05:08.402624')).toBe('2026-05-31 12:05:08')
  })
})
