export const statusBadge = (status: string) => {
  switch (status) {
    case 'Open':        return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'In-progress': return 'bg-violet-50 text-violet-700 border-violet-200'
    case 'Resolved':    return 'bg-green-50 text-green-700 border-green-200'
    case 'Closed':      return 'bg-slate-100 text-slate-500 border-slate-200'
    default:            return 'bg-slate-50 text-slate-400 border-slate-200'
  }
}

export const statusDot = (status: string) => {
  switch (status) {
    case 'Open':        return 'bg-blue-500'
    case 'In-progress': return 'bg-violet-500'
    case 'Resolved':    return 'bg-green-500'
    case 'Closed':      return 'bg-slate-400'
    default:            return 'bg-slate-300'
  }
}

export const priorityBadge = (priority: string) => {
  switch (priority) {
    case 'Critical': return 'bg-red-50 text-red-700 border-red-200'
    case 'Medium':   return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'Low':      return 'bg-slate-100 text-slate-500 border-slate-200'
    default:         return 'bg-slate-50 text-slate-400 border-slate-200'
  }
}