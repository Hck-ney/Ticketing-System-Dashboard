import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/useAuth";
import { RefreshCw, ChevronRight, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { updateTicket } from "@/api/tickets";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { toast } from "sonner";
import { useAssignedTickets } from "@/hooks/employeeTickets";
import type { UserTicket, Status, Priority } from "@/types/types";




const statusBadge = (status: Status) => {
    switch (status) {
        case 'Open':        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
        case 'In-progress': return 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800'
        case 'Resolved':    return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-800'
        case 'Closed':      return 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
        case 'Cancelled':   return 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800'
        default:            return 'bg-slate-50 text-slate-400 border-slate-200'
    }
}

const statusDot = (status: Status) => {
    switch (status) {
        case 'Open':        return 'bg-blue-500'
        case 'In-progress': return 'bg-violet-500'
        case 'Resolved':    return 'bg-green-500'
        case 'Closed':      return 'bg-slate-400'
        case 'Cancelled':   return 'bg-red-500'
        default:            return 'bg-slate-300'
    }
}

const priorityBadge = (priority: Priority) => {
    switch (priority) {
        case 'Critical': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800'
        case 'Medium':   return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
        case 'Low':      return 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
        default:         return 'bg-slate-50 text-slate-400 border-slate-200'
    }
}

export default function Ticket() {
    const { user } = useAuth()
    const [selectedTicket, setSelectedTicket] = useState<UserTicket | null>(null)
    const [comment, setComment] = useState('')
    const [refresh, setRefresh] = useState(false)
    const isOpen = !!selectedTicket
    const { tickets, isLoading, getTickets } = useAssignedTickets(user?.id ?? 0)

    const closeSheet = (open: boolean) => {
        if (!open) {
            setTimeout(() => setSelectedTicket(null), 300)
        }
    }

    const resolveTicket = async () => {
        if (!comment) { toast.error('Comment must not be empty'); return }
        if (!selectedTicket) return
        await updateTicket(selectedTicket.id, { status: 'Resolved', comment })
        toast.success('Ticket set as Resolved')
        setSelectedTicket(null)
        setRefresh(prev => !prev)
    }

    useEffect(() => { getTickets() }, [refresh, getTickets])

    const inProgress = tickets.filter(t => t.status === 'In-progress')
    const resolved   = tickets.filter(t => t.status === 'Resolved')
    const closed     = tickets.filter(t => t.status === 'Closed')

    return (
        <div className="p-8 min-h-full bg-slate-50 dark:bg-gray-950">
            {isLoading ? (
                <div className="flex gap-2 justify-center items-center h-64">
                    <Spinner className="size-10 text-slate-500 dark:text-slate-400" />
                    <span className="text-slate-500 dark:text-slate-400 text-sm">Fetching tickets...</span>
                </div>
            ) : (
                <>
                    {/* Page header */}
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">My Tickets</h2>
                            <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
                                {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} assigned to you
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={getTickets}
                            className="gap-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </Button>
                    </div>

                    {/* Stat cards */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="rounded-xl border border-violet-200 dark:border-violet-800/50 bg-violet-50 dark:bg-violet-950/30 px-5 py-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                                </div>
                                <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wide">In Progress</span>
                            </div>
                            <p className="text-3xl font-bold text-violet-700 dark:text-violet-300">{inProgress.length}</p>
                        </div>

                        <div className="rounded-xl border border-green-200 dark:border-green-800/50 bg-green-50 dark:bg-green-950/30 px-5 py-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                                </div>
                                <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">Resolved</span>
                            </div>
                            <p className="text-3xl font-bold text-green-700 dark:text-green-300">{resolved.length}</p>
                        </div>

                        <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/40 px-5 py-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center">
                                    <XCircle className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                </div>
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Closed</span>
                            </div>
                            <p className="text-3xl font-bold text-slate-700 dark:text-slate-300">{closed.length}</p>
                        </div>
                    </div>

                    {/* Ticket list + Sheet */}
                    <Sheet open={isOpen} onOpenChange={closeSheet}>
                        <div className="flex flex-col gap-3">
                            {inProgress.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-900">
                                    <Clock className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-3" />
                                    <p className="text-sm font-medium text-slate-400 dark:text-slate-500">No in-progress tickets</p>
                                    <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">Tickets assigned to you will appear here</p>
                                </div>
                            ) : (
                                inProgress.map(t => (
                                    <div
                                        key={t.id}
                                        onClick={() => setSelectedTicket(t)}
                                        className="group flex items-center gap-4 bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700/60 rounded-xl px-5 py-4 cursor-pointer hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-sm transition-all duration-150"
                                    >
                                        {/* Left accent bar */}
                                        <div className="w-1 h-10 rounded-full bg-violet-400 dark:bg-violet-600 shrink-0" />

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                                <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">#{t.id}</span>
                                                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${statusBadge(t.status)}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot(t.status)}`} />
                                                    {t.status}
                                                </span>
                                                <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${priorityBadge(t.priority)}`}>
                                                    {t.priority}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{t.title}</p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                                {t.users.name} · {t.created_at.replace('T', ' ').split('.')[0]}
                                            </p>
                                        </div>

                                        <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-violet-400 dark:group-hover:text-violet-500 transition-colors shrink-0" />
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Sheet panel */}
                        <SheetContent className="bg-white dark:bg-gray-900 border-l border-slate-200 dark:border-slate-700 w-full sm:max-w-md flex flex-col px-0">

                            <SheetHeader className="pb-4 border-b border-slate-100 dark:border-slate-800 text-left px-6 pt-6">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">#{selectedTicket?.id}</span>
                                    {selectedTicket && (
                                        <>
                                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${statusBadge(selectedTicket.status)}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${statusDot(selectedTicket.status)}`} />
                                                {selectedTicket.status}
                                            </span>
                                            <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${priorityBadge(selectedTicket.priority)}`}>
                                                {selectedTicket.priority}
                                            </span>
                                        </>
                                    )}
                                </div>
                                <SheetTitle className="text-base font-semibold text-slate-900 dark:text-white leading-snug">
                                    {selectedTicket?.title}
                                </SheetTitle>
                                <SheetDescription className="text-slate-400 dark:text-slate-500 text-sm">
                                    Submitted by {selectedTicket?.users.name}
                                </SheetDescription>
                            </SheetHeader>

                            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

                                {/* Meta grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: 'Requester',  value: selectedTicket?.users.name },
                                        { label: 'Created at', value: selectedTicket?.created_at.replace('T', ' ').split('.')[0] },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg px-3 py-2.5">
                                            <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">{label}</p>
                                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{value}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Description */}
                                <div>
                                    <Label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide block mb-2">
                                        Description
                                    </Label>
                                    <textarea
                                        className="w-full h-40 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg resize-none outline-none font-sans leading-relaxed"
                                        value={selectedTicket?.description ?? ''}
                                        disabled
                                    />
                                </div>

                                {/* Resolution note */}
                                <div>
                                    <Label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide block mb-2">
                                        Resolution note
                                    </Label>
                                    <textarea
                                        className="w-full h-28 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg resize-none outline-none font-sans leading-relaxed focus:border-violet-400 dark:focus:border-violet-600 transition-colors"
                                        placeholder="Describe how the issue was resolved..."
                                        onChange={e => setComment(e.target.value)}
                                    />
                                </div>
                            </div>

                            <SheetFooter className="pt-4 border-t border-slate-100 dark:border-slate-800 px-6 pb-6">
                                <Button
                                    onClick={resolveTicket}
                                    className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-semibold"
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Mark as Resolved
                                </Button>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </>
            )}
        </div>
    )
}