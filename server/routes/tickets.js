const express = require('express')
const router = express.Router()
const { myTickets, getUserTickets, allTickets, updateTicketStatus, createTicket, assignTicket } = require('../controllers/ticketController')

// get
router.get('/allTickets', allTickets)
router.get('/tickets', getUserTickets)
router.get('/myTickets', myTickets)

// post
router.post('/createTicket', createTicket)

// put
router.put('/updateTicketStatus', updateTicketStatus)
router.put('/assignTicket', assignTicket)


module.exports = router
