import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Label } from "@/components/ui/label"
import { myTickets } from "@/api/tickets";
import { useAuth } from "@/context/AuthContext";
import { RefreshCw, ChevronRight } from 'lucide-react';
import { updateTicket } from "@/api/tickets";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { toast } from "sonner";

type Priority = 'Critical' | 'Medium' | 'Low'
type Status = 'Open' | 'In-progress' | 'Resolved' | 'Closed' | 'Cancelled'
type ticket = {
    id: number
    title: string
    description: string
    status: Status
    priority: Priority
    created_at: string
    user_id: number
    users: {
        name: string
    }
}

export default function ticket() {
    const { user } = useAuth()
    const [tickets, setTickets] = useState<ticket[]>([])
    const [isLoading, setIsLoading] = useState(Boolean)
    const [selectedTicket, setSelectedTicket] = useState<ticket | null>(null);
    const [comment, setComment] = useState('')
    const [refresh, setRefresh] = useState(false)
    const isOpen = !!selectedTicket

    const getTickets = async () => {
        try {
            console.log('loading now...')
            setIsLoading(true)
            if (!user || !user.id) {
                console.log('Error: User context is null')
                return
            }
            const data = await myTickets(user.id)
            setTickets(data)
            setIsLoading(false)
            console.log('...finished loading')
        }
        catch (e) {
            console.log(e)
            return
        }
    }
    const closeSheet = (open: boolean) => {
        if (!open) {
            setTimeout(() => {
                setSelectedTicket(null);
            }, 300);
        }
    }
    const priorityStyles: Record<Priority, string> = {
        Critical: 'text-red-600 bg-[#fef2f2] border-[#ffc9c9]',
        Medium: 'text-[#bf8d44] bg-[#fefce8] border-[#dfc600]',
        Low: 'text-[#8e9caf] bg-[#f1f5f9] border-[#a1afbf]',
    }
    const statusStyles: Record<Status, string> = {
        'Open': '',
        'In-progress': 'text-[#9f00ff] bg-[#f5f3ff] border-[#ddd6ff]',
        'Resolved': 'text-[#00b800] bg-[#ecfdf5] border-[#54c754]',
        'Closed': 'text-red-600 bg-[#fef2f2] border-[#ffc9c9]',
        'Cancelled': 'text-red-600 bg-[#fef2f2] border-[#ffc9c9]'
    }
    const resolveTicket = async () => {
        if (!comment) {
            toast.error('Comment must not be empty')
            return
        }
        if (!selectedTicket) {
            return
        }
        const payload = {
            status: 'Resolved',
            comment: comment
        }
        await updateTicket(selectedTicket.id, payload)
        toast.success('Ticket set as Resolved')
        setSelectedTicket(null)
        setRefresh(prev => !prev);
    }

    useEffect(() => {
        getTickets()
    }, [refresh])

    return (
        <div className="p-6 bg-[#f4f5f9] overflow-auto">
            {isLoading ? (
                <div className="flex gap-2 justify-center items-center h-64">
                    <Spinner className="size-12" />
                    <span>Fetching Tickets...</span>
                </div>
            ) : (
                <>
                    <div className="flex justify-between">
                        <div>
                            <p>My Tickets</p>
                            <p className="text-sm">{tickets.length} tickets assigned to you</p>
                        </div>
                        <Button className="text-black bg-white border" onClick={getTickets}>
                            <RefreshCw /> Refresh
                        </Button>
                    </div>

                    <div className="flex flex-1 gap-12 py-6">
                        <div className="rounded-lg py-4 px-2 w-1/3 border border-[#b8e6fe] bg-[#f0f9ff] text-[#0084d1] font-medium">
                            In-progress<p>{tickets?.filter((t) => t.status === "In-progress").length}</p>
                        </div>
                        <div className="rounded-lg border border-[#a4f4cf] bg-[#ecfdf5] py-4 px-2 w-1/3 text-[#009966]">
                            Resolved<p>{tickets?.filter((t) => t.status === "Resolved").length}</p>
                        </div>
                        <div className="rounded-lg border border-[#ddd6ff] bg-[#f5f3ff] py-4 px-2 w-1/3 text-[#7f22fe]">
                            Closed<p>{tickets?.filter((t) => t.status === "Closed").length}</p>
                        </div>
                    </div>

                    <div className="border h-8 mb-8">Search bar</div>

                    <Sheet open={isOpen} onOpenChange={closeSheet}>
                        <SheetTrigger className='w-full'>
                            {tickets.map((t) => (
                                <div key={t.id} onClick={() => { setSelectedTicket(t) }} className="border pl-2 pt-2 pr-2 my-4 h-20 bg-white rounded-md w-full">
                                    <div className="flex gap-4 mb-1.5">
                                        <div className="p-1 text-xs">Ticket #{t.id}</div>
                                        <div className={`border py-1 px-2 text-xs rounded-md ${statusStyles[t.status]}`}>
                                            {t.status}
                                        </div>
                                        <div className={`py-1 px-2 text-xs rounded-md border ${priorityStyles[t.priority]}`}>
                                            {t.priority}
                                        </div>
                                        <ChevronRight className="ml-auto" size={18} strokeWidth={1.5} />
                                    </div>
                                    <p className="text-left">{t.title}</p>
                                </div>
                            ))}
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader className="border">
                                <SheetTitle className='!text-xl'>{selectedTicket ? `${selectedTicket.title}` : ''}</SheetTitle>
                                <SheetDescription>{selectedTicket ? `Ticket #${selectedTicket.id}` : ''}</SheetDescription>
                            </SheetHeader>
                            <div className="px-4 h-3/4">
                                <div className="grid grid-cols-2">
                                    <div className="grid h-14 gap-1">
                                        <p className="text-muted-foreground">Status</p>
                                        <div className={`justify-self-start border py-1 px-2 text-xs rounded-md ${selectedTicket ? `${statusStyles[selectedTicket.status]}` : ''}`}>
                                            {selectedTicket ? `${selectedTicket.status}` : ''}
                                        </div>
                                    </div>
                                    <div className=" grid h-14 gap-1">
                                        <p className="text-muted-foreground">Priority</p>
                                        <p>{`${selectedTicket?.priority}`}</p>
                                    </div>
                                    <div className="grid h-14 gap-1">
                                        <p className="text-muted-foreground">Requester</p>
                                        <p>{`${selectedTicket?.users.name}`}</p>
                                    </div>
                                    <div className="grid h-14 gap-1">
                                        <p className="text-muted-foreground">Created at</p>
                                        <p>{`${selectedTicket?.created_at.replace("T", " ").split(".")[0]}`}</p>
                                    </div>
                                </div>
                                <div className="grid gap-3 my-4">
                                    <Label htmlFor="sheet-demo-name" className="text-muted-foreground">Description</Label>
                                    <textarea className="h-60 border p-2" id="sheet-demo-name" value={selectedTicket?.description} disabled />
                                </div>
                                <div className="grid gap-3 my-4">
                                    <Label htmlFor="sheet-demo-name" className="text-muted-foreground">Leave a comment/note</Label>
                                    <textarea className="h-30 border p-2" id="sheet-demo-name" onChange={(e) => setComment(e.target.value)} />
                                </div>
                            </div>
                            <SheetFooter>
                                <Button type="submit" variant={"green"} onClick={resolveTicket}>Mark as Resolved</Button>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </>
            )}
        </div>
    );
}