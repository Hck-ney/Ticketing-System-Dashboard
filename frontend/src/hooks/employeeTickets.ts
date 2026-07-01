import { useState, useCallback } from 'react'
import { allTickets, myTickets } from '@/api/tickets'
import type { UserTicket } from '@/types/types'

// List all active tickets for the employee dashboard
export const useEmployeeTickets = () => {
    const [ticketList, setTicketList] = useState<UserTicket[]>([])
    const [isDataLoading, setIsDataLoading] = useState(false)

    const fetchData = async () => {
        try {
            setIsDataLoading(true)
            const statsData = await allTickets()
            setTicketList(statsData.tickets)
        } catch (error) {
            console.error('Error fetching stats:', error)
        } finally {
            setIsDataLoading(false)
        }
    }

    return { ticketList, isDataLoading, fetchData }
}

// List assigned tickets to the employee for the employee tickets page
export const useAssignedTickets =  (user_id: number) => {
    const [tickets, setTickets] = useState<UserTicket[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const getTickets = useCallback(async () => {
            try {
                setIsLoading(true)
                if (!user_id) return
                const data = await myTickets(user_id)
                setTickets(data)
            } catch (e) {
                console.log(e)
            } finally {
                setIsLoading(false)
            }
        }, [user_id])

    return {
        tickets,
        isLoading,
        getTickets
    }
}