const express = require('express')
const router = express.Router()
const {
  createPlantVariety,
  getAllPlantVarieties,
  getPlantVarietyById,
  updatePlantVariety,
  deletePlantVariety,
} = require('../controllers/plantVarietyController')

// CRUD routes
router.post('/', createPlantVariety)
router.get('/', getAllPlantVarieties)
router.get('/:id', getPlantVarietyById)
router.put('/:id', updatePlantVariety)
router.delete('/:id', deletePlantVariety)

module.exports = router
