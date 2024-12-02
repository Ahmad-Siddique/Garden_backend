const express = require('express')
const router = express.Router()
const {
  createDisease,
  getAllDiseases,
  getDiseaseById,
  updateDisease,
  deleteDisease,
  getDiseaseByPlantSlug,
  getDiseaseByIdAdmin,
} = require('../controllers/diseaseController')

const upload = require('../middleware/multer')
const { protect, authorize } = require('../middleware/auth')


// CRUD Routes
router.post('/',upload.single('image'),protect, createDisease)
router.get('/', getAllDiseases)
router.get('/:id', getDiseaseById)
router.get('/admin/:id', getDiseaseByIdAdmin)
router.put('/:id',upload.single('image'),protect, updateDisease)
router.delete('/:id', protect, deleteDisease)
router.get('/name/:name', protect, getDiseaseByPlantSlug)


module.exports = router
