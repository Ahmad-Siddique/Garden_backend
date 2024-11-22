const express = require('express')
const router = express.Router()
const {
  createPest,
  getAllPests,
  getPestById,
  updatePest,
  deletePest,
} = require('../controllers/pestsController')

// CRUD Routes
router.post('/', createPest)
router.get('/', getAllPests)
router.get('/:id', getPestById)
router.put('/:id', updatePest)
router.delete('/:id', deletePest)

module.exports = router
