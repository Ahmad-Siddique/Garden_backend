const express = require('express')
const router = express.Router()
const {
  createDisease,
  getAllDiseases,
  getDiseaseById,
  updateDisease,
  deleteDisease,
} = require('../controllers/diseaseController')

// CRUD Routes
router.post('/', createDisease)
router.get('/', getAllDiseases)
router.get('/:id', getDiseaseById)
router.put('/:id', updateDisease)
router.delete('/:id', deleteDisease)

module.exports = router
