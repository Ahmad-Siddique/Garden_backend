const express = require('express')
const router = express.Router()
const {
  createNutrition,
  getAllNutritions,
  getNutritionById,
  updateNutrition,
  deleteNutrition,
  getNutritionByIdAdmin,
} = require('../controllers/nutrientsController')
const upload = require('../middleware/multer')
const { protect, authorize } = require('../middleware/auth')
// CRUD routes
router.post('/',upload.single('image'),protect, createNutrition)
router.get('/', getAllNutritions)
router.get('/:id', getNutritionById)
router.get('/admin/:id', protect, getNutritionByIdAdmin)
router.put('/:id', upload.single('image'), protect, updateNutrition)
router.delete('/:id', deleteNutrition)

module.exports = router
