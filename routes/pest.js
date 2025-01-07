const express = require('express')
const router = express.Router()
const {
  createPest,
  getAllPests,
  getPestById,
  getPestByIdAdmin,
  updatePest,
  deletePest,
  getPestsByPlantSlug,
  getAllAllPests
} = require('../controllers/pestController')

const upload = require('../middleware/multer')
const { protect, authorize } = require('../middleware/auth')

// CRUD Routes
router.post('/',upload.single('image'),protect, createPest)
router.get('/', protect, getAllPests)
router.get('/all', protect, getAllAllPests)
router.get('/:id', protect, getPestById)
router.get('/admin/:id', protect, getPestByIdAdmin)
router.put('/:id', upload.single('image'), protect, updatePest)
router.delete('/:id', protect, deletePest)
router.get('/name/:name', protect, getPestsByPlantSlug)

module.exports = router
