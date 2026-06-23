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



export default function Dashboard() {
    const { user } = useAuth()
    const [ticketList, setTicketList] = useState<UserTicket[]>([])
    const [isDataLoading, setIsDataLoading] = useState(true)
    const [selectedTicket, setSelectedTicket] = useState<UserTicket | null>(null)
    const [refresh, setRefresh] = useState(false);

    const fetchData = async () => {
        try {
            setIsDataLoading(true)
            const statsData = await allTickets()
            console.log('awaiting tickets')
            setIsDataLoading(false)
            setTicketList(statsData.tickets)
        } catch (error) {
            console.error('Error fetching stats:', error)
        } finally {
        }
    }
    const assign = async () => {
        if (!selectedTicket || !user?.id) {
            return
        }
        try {
            const ticket = ({
                id: selectedTicket.id,
                user_id: user?.id
            })
            await assignTicket(ticket)
            toast.success('Ticket assigned to you')
            setSelectedTicket(null)
            setRefresh(prev => !prev);
        }
        catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchData()
    }, [refresh])

    return (
        <div className='flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-800'>

            <div className='mx-8 my-12 flex-1 flex flex-col rounded-xl border border-slate-500 overflow-auto'>
                <div className='flex items-center justify-between px-6 py-4 border-b bg-white dark:bg-gray-900'>
                    <p className='dark:text-white text-slate-900 text-base font-bold m-0'>
                        Active Tickets
                    </p>
                    <Button onClick={fetchData}>
                        Refresh
                    </Button>
                </div>

                {isDataLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Spinner className='size-12 text-black dark:text-white' />
                        <span className='text-black dark:text-white'>Fetching all Active Tickets</span>

                    </div>
                ) : (
                    <Table className='flex-1 overflow-auto w-full bg-white dark:bg-gray-900'>
                        <TableHeader>
                            <TableRow className="text-left px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wide">
                                <TableHead className='w-[100px] text-black dark:text-white'>ID</TableHead>
                                <TableHead className='text-black dark:text-white'>Title</TableHead>
                                <TableHead className='text-black dark:text-white'>Submitted By</TableHead>
                                <TableHead className='text-black dark:text-white'>Priority</TableHead>
                                <TableHead className='text-black dark:text-white'>Status</TableHead>
                                <TableHead className='text-black dark:text-white'>Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className='h-100'>
                            {ticketList.map((ticket) => (
                                <TableRow
                                    key={ticket.id}
                                    onClick={() => { setSelectedTicket(ticket) }}
                                    className='cursor-pointer hover:bg-muted dark:text-gray-200 text-black'
                                >
                                    <TableCell className="font-medium">{ticket.id}</TableCell>
                                    <TableCell>{ticket.title}</TableCell>
                                    <TableCell>{ticket.users.name}</TableCell>
                                    <TableCell>{ticket.priority}</TableCell>
                                    <TableCell>{ticket.status}</TableCell>
                                    <TableCell>
                                        {ticket.created_at.replace("T", " ").split(".")[0]}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
            {/* Dialog modal */}
            <Dialog
                open={!!selectedTicket}
                onOpenChange={(open) => { if (!open) setSelectedTicket(null) }}
                disablePointerDismissal
            >
                <DialogContent className='sm:max-w-md bg-gray-100 text-black dark:bg-gray-900 dark: text-gray-100' >
                    <DialogHeader>
                        <DialogTitle>{selectedTicket?.title}</DialogTitle>
                        <DialogDescription className='text-gray-700 dark:text-gray-400'>Ticket #{selectedTicket?.id}</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label className='dark:text-gray-300 text-black'>Submitted By</Label>
                            <Input className='dark:text-gray-100 dark:bg-gray-800' value={selectedTicket?.users.name ?? ''} readOnly />
                        </div>
                        <div className="grid gap-2">
                            <Label className='dark:text-gray-300 text-black'>Priority</Label>
                            <Input value={selectedTicket?.priority ?? ''} readOnly className='dark:text-gray-100 dark:bg-gray-800' />
                        </div>
                        <div className="grid gap-2">
                            <Label className='dark:text-gray-300 text-black'>Created</Label>
                            <Input value={selectedTicket?.created_at.replace("T", " ").split(".")[0] ?? ''} readOnly className='dark:text-gray-100 dark:bg-gray-800' />
                        </div>
                        <div className="grid gap-2">
                            <Label className='dark:text-gray-300 text-gray-700'>Description</Label>
                            <Textarea
                                value={selectedTicket?.description ?? ''}
                                readOnly
                                className='dark:text-gray-100 dark:bg-gray-800'
                            />
                        </div>
                    </div>

                    <DialogFooter className="flex justify-between">
                        <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={assign}
                        >
                            Assign to Me
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}