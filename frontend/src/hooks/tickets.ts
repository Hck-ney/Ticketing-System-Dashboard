import { useState, useCallback } from 'react'
import { userTickets } from '../api/tickets'

type UserTicket = {
    id: number
    title: string
    description: string
    status: string
    priority: string
    created_at: string
    user_id: number
    comment: string
}

export function useTickets(userId?: number) {
    const [userTicketList, setUserTicketList] = useState<UserTicket[]>([])
    const [isTicketListLoading, setIsTicketListLoading] = useState(true)

    const fetchTickets = useCallback(async () => {
        try {
            setIsTicketListLoading(true)
            const data = await userTickets(userId || 0)
            setUserTicketList(data.tickets)
        } catch (error) {
            console.error('Error fetching user tickets:', error)
        } finally {
            setIsTicketListLoading(false)
        }
    }, [userId])

    return {
        userTicketList,
        isTicketListLoading,
        fetchTickets
    }
}