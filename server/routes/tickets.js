const express = require('express')
const router = express.Router()
const { myTickets, getUserTickets, allTickets, updateTicketStatus, createTicket, assignTicket, reopenTicket } = require('../controllers/ticketController')

// get
router.get('/allTickets', allTickets)
router.get('/tickets', getUserTickets)
router.get('/myTickets', myTickets)

// post
router.post('/createTicket', createTicket)

// put
router.put('/updateTicketStatus', updateTicketStatus)
router.put('/assignTicket', assignTicket)
router.put('/reopenTicket', reopenTicket)


module.exports = router
