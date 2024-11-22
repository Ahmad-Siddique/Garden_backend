const express = require('express')
const router = express.Router()
const {
  createNutrition,
  getAllNutritions,
  getNutritionById,
  updateNutrition,
  deleteNutrition,
} = require('../controllers/nutritionController')

// CRUD routes
router.post('/', createNutrition)
router.get('/', getAllNutritions)
router.get('/:id', getNutritionById)
router.put('/:id', updateNutrition)
router.delete('/:id', deleteNutrition)

module.exports = router
