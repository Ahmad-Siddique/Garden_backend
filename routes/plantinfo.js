const express = require('express')
const router = express.Router()
const {
  createPlantInfo,
  getAllPlantInfo,
  getPlantInfoById,
  updatePlantInfo,
  deletePlantInfo,
} = require('../controllers/plantInfoController')
const upload = require('../middleware/multer')
// CRUD routes
router.post('/',upload.single('image'), createPlantInfo)
router.get('/', getAllPlantInfo)
router.get('/:id', getPlantInfoById)
router.put('/:id',upload.single('image'), updatePlantInfo)
router.delete('/:id', deletePlantInfo)

module.exports = router
