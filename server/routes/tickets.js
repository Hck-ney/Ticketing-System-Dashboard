const express = require('express')
const router = express.Router()
const { getUserTickets, allTickets, updateTicketStatus, createTicket } = require('../controllers/ticketController')

router.get('/allTickets', allTickets)
router.get('/tickets', getUserTickets)
router.post('/createTicket', createTicket)
router.put('/updateTicketStatus', updateTicketStatus)


module.exports = router
