const express = require('express')
const router = express.Router()
const { getUserTickets, allTickets, updateTicketStatus, createTicket, assignTicket } = require('../controllers/ticketController')

router.get('/allTickets', allTickets)
router.get('/tickets', getUserTickets)
router.post('/createTicket', createTicket)
router.put('/updateTicketStatus', updateTicketStatus)
router.put('/assignTicket', assignTicket)


module.exports = router
