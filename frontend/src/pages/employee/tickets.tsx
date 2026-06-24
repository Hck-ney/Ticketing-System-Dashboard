import { useEffect, useState } from "react";
import { myTickets } from "@/api/tickets";
import { useAuth } from "@/context/AuthContext";

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
    const getTickets = async () => {
        if (!user || !user.id) {
            console.log('Error: User context is null')
            return
        }
        const data = await myTickets(user.id)
        setTickets(data)
    }

    const priorityStyles: Record<Priority, string> = {
        Critical: 'text-red-600 bg-[#fef2f2] border-[#ffc9c9]',
        Medium: 'text-[#bf8d44] bg-[#fefce8] border-[#fef6b7]',
        Low: 'text-[#8e9caf] bg-[#f1f5f9] border-[#e4eaf1]',
    }

    const statusStyles: Record<Status, string> = {
        'Open': '',
        'In-progress': 'text-[#a160f0] bg-[#f5f3ff] border-[#ddd6ff]',
        'Resolved': 'text-red-600 bg-[#fef2f2] border-[#ffc9c9]',
        'Closed': 'text-red-600 bg-[#fef2f2] border-[#ffc9c9]',
        'Cancelled': 'text-red-600 bg-[#fef2f2] border-[#ffc9c9]'
    }

    useEffect(() => {
        getTickets()
    }, [])

    return (
        <div className="p-6 bg-[#f4f5f9] overflow-auto">
            <div>
                <p>My Tickets</p>
                <p className="text-sm">{tickets.length} tickets assigned to you</p>
            </div>
            <div className="flex flex-1 gap-12 py-6">
                <div className="rounded-lg py-4 px-2 w-1/3 border border-[#b8e6fe] bg-[#f0f9ff]  text-[#0084d1] font-medium">In-progress<p>{tickets?.filter(t => t.status === 'In-progress').length}</p></div>
                <div className="rounded-lg border border-[#a4f4cf] bg-[#ecfdf5] py-4 px-2 w-1/3 text-[#009966]">Resolved<p>{tickets?.filter(t => t.status === 'Resolved').length}</p></div>
                <div className="rounded-lg border border-[#ddd6ff] bg-[#f5f3ff] py-4 px-2 w-1/3 text-[#7f22fe]">Closed<p>{tickets?.filter(t => t.status === 'Closed').length}</p></div>
            </div>
            {/* Search bar */}
            <div className="border h-8 mb-8">Search bar</div>
            {/* Ticket Section */}
            {tickets.map((t) => (
                <div key={t.id} className="border p-2 my-4 h-18 bg-white rounded-md">
                    <div className="flex gap-4 mb-1">
                        <div className="p-1 text-xs">Ticket #{t.id}</div>
                        <div className={`border py-1 px-2 text-xs rounded-md ${statusStyles[t.status]}`}>
                            {t.status}
                        </div>
                        <div className={`py-1 px-2 text-xs rounded-md border ${priorityStyles[t.priority]}`} >
                            {t.priority}
                        </div>
                    </div>
                    <p>{t.title}</p>
                    {/* <button onClick={()=> {console.log(t.priority)}}>Click here</button> */}
                </div>
            ))}

        </div>
    );
}