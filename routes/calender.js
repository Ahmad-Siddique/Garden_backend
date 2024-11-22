const express = require('express')
const router = express.Router()
const {
  createCalendar,
  getAllCalendars,
  getCalendarById,
  updateCalendar,
  deleteCalendar,
} = require('../controllers/calendarController')

// CRUD routes
router.post('/', createCalendar)
router.get('/', getAllCalendars)
router.get('/:id', getCalendarById)
router.put('/:id', updateCalendar)
router.delete('/:id', deleteCalendar)

module.exports = router
