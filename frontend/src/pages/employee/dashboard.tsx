import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { allTickets } from '@/api/tickets'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from '@/context/AuthContext'
import { assignTicket } from '@/api/tickets'
import { toast } from 'sonner'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"

type UserTicket = {
    id: number
    title: string
    description: string
    status: string
    priority: string
    created_at: string
    user_id: number
    users: {
        name: string
    }
}

const statusBadge = (status: string) => {
    switch (status) {
        case 'Open': return 'bg-blue-50 text-blue-700 border-blue-200'
        case 'In-progress': return 'bg-violet-50 text-violet-700 border-violet-200'
        case 'Resolved': return 'bg-green-50 text-green-700 border-green-200'
        case 'Closed': return 'bg-slate-100 text-slate-500 border-slate-200'
        default: return 'bg-slate-50 text-slate-400 border-slate-200'
    }
}

const statusDot = (status: string) => {
    switch (status) {
        case 'Open': return 'bg-blue-500'
        case 'In-progress': return 'bg-violet-500'
        case 'Resolved': return 'bg-green-500'
        case 'Closed': return 'bg-slate-400'
        default: return 'bg-slate-300'
    }
}

const priorityBadge = (priority: string) => {
    switch (priority) {
        case 'Critical': return 'bg-red-50 text-red-700 border-red-200'
        case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-200'
        case 'Low': return 'bg-slate-100 text-slate-500 border-slate-200'
        default: return 'bg-slate-50 text-slate-400 border-slate-200'
    }
}

export default function Dashboard() {
    const { user } = useAuth()
    const [ticketList, setTicketList] = useState<UserTicket[]>([])
    const [isDataLoading, setIsDataLoading] = useState(true)
    const [selectedTicket, setSelectedTicket] = useState<UserTicket | null>(null)
    const [refresh, setRefresh] = useState(false)

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

    const assign = async () => {
        if (!selectedTicket || !user?.id) return
        try {
            await assignTicket({ id: selectedTicket.id, user_id: user.id })
            toast.success('Ticket assigned to you')
            setSelectedTicket(null)
            setRefresh(prev => !prev)
        } catch (error) {
            console.log(error)
            toast.error('Failed to assign ticket')
        }
    }

    useEffect(() => {
        fetchData()
    }, [refresh])

    return (
        <div className='flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-800'>

            <div className='mx-8 my-12 flex flex-col rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden'>

                {/* Header */}
                <div className='flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-900'>
                    <p className='dark:text-white text-slate-900 text-base font-bold m-0'>
                        Active Tickets
                    </p>
                    <Button onClick={fetchData}>Refresh</Button>
                </div>

                {/* Body */}
                {isDataLoading ? (
                    <div className="flex items-center justify-center gap-2 py-16 bg-white dark:bg-gray-900">
                        <Spinner className='size-12 text-black dark:text-white' />
                        <span className='text-black dark:text-white'>Fetching all Active Tickets</span>
                    </div>
                ) : (
                    <div className='overflow-auto max-h-[600px]'>
                        <Table className='w-full bg-white dark:bg-gray-900'>
                            <TableHeader className='sticky top-0 z-10 bg-slate-50 dark:bg-gray-800'>
                                <TableRow className='border-b border-slate-200 dark:border-slate-700'>
                                    <TableHead className='text-xs font-bold text-slate-400 uppercase tracking-wide w-[80px]'>ID</TableHead>
                                    <TableHead className='text-xs font-bold text-slate-400 uppercase tracking-wide'>Title</TableHead>
                                    <TableHead className='text-xs font-bold text-slate-400 uppercase tracking-wide'>Submitted By</TableHead>
                                    <TableHead className='text-xs font-bold text-slate-400 uppercase tracking-wide'>Priority</TableHead>
                                    <TableHead className='text-xs font-bold text-slate-400 uppercase tracking-wide'>Status</TableHead>
                                    <TableHead className='text-xs font-bold text-slate-400 uppercase tracking-wide'>Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ticketList.map((ticket) => (
                                    <TableRow
                                        key={ticket.id}
                                        onClick={() => setSelectedTicket(ticket)}
                                        className='cursor-pointer border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors h-16'
                                    >
                                        <TableCell className='text-sm text-slate-400 font-mono py-4'>#{ticket.id}</TableCell>
                                        <TableCell className='text-sm font-medium text-slate-800 dark:text-gray-200 py-4'>{ticket.title}</TableCell>
                                        <TableCell className='text-sm text-slate-600 dark:text-gray-300 py-4'>{ticket.users.name}</TableCell>

                                        <TableCell className='py-4'>
                                            <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${priorityBadge(ticket.priority)}`}>
                                                {ticket.priority}
                                            </span>
                                        </TableCell>

                                        <TableCell className='py-4'>
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusBadge(ticket.status)}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot(ticket.status)}`} />
                                                {ticket.status}
                                            </span>
                                        </TableCell>

                                        <TableCell className='text-sm text-slate-400 py-4'>
                                            {ticket.created_at.replace('T', ' ').split('.')[0]}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            {/* Dialog modal */}
            <Dialog
                open={!!selectedTicket}
                onOpenChange={(open) => { if (!open) setSelectedTicket(null) }}
                disablePointerDismissal
            >
                <DialogContent className='sm:max-w-md bg-gray-100 text-black dark:bg-gray-900 dark:text-gray-100'>
                    <DialogHeader>
                        <DialogTitle className='text-black dark:text-white'>{selectedTicket?.title}</DialogTitle>
                        <DialogDescription className='text-gray-700 dark:text-gray-400'>
                            Ticket #{selectedTicket?.id}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label className='dark:text-gray-300 text-black'>Submitted By</Label>
                            <Input
                                className='dark:text-gray-100 dark:bg-gray-800 text-black'
                                value={selectedTicket?.users.name ?? ''}
                                readOnly
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className='dark:text-gray-300 text-black'>Priority</Label>
                            <Input
                                value={selectedTicket?.priority ?? ''}
                                readOnly
                                className='text-black dark:text-gray-100 dark:bg-gray-800'
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className='dark:text-gray-300 text-black'>Status</Label>
                            <Input
                                value={selectedTicket?.status ?? ''}
                                readOnly
                                className='text-black dark:text-gray-100 dark:bg-gray-800'
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className='dark:text-gray-300 text-black'>Created</Label>
                            <Input
                                value={selectedTicket?.created_at.replace('T', ' ').split('.')[0] ?? ''}
                                readOnly
                                className='text-black dark:text-gray-100 dark:bg-gray-800'
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className='dark:text-gray-300 text-black'>Description</Label>
                            <Textarea
                                value={selectedTicket?.description ?? ''}
                                readOnly
                                className='text-black dark:text-gray-100 dark:bg-gray-800'
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={assign}
                        >
                            Assign to Me
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}