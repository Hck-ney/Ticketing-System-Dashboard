export const formatTicketDate = (date: string) =>
  date.replace('T', ' ').split('.')[0]