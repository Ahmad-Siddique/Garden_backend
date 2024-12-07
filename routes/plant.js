const express = require('express')
const router = express.Router()
const upload = require('../middleware/multer')
const plantController = require('../controllers/plantController')

router.post(
  '/',
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
    { name: 'gardenImage', maxCount: 1 },
  ]),
  plantController.createPlant,
)
router.get('/grouped-by-category', plantController.getPlantsGroupedByCategory)
router.get('/', plantController.getPlants)
router.get('/all', plantController.getAllPlants)
router.get('/category/:category', plantController.getPlantsByCategoryName)
router.get('/:id', plantController.getPlantById)
router.put(
  '/:id',
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
    { name: 'gardenImage', maxCount: 1 },
  ]),
  plantController.updatePlant,
)
router.delete('/:id', plantController.deletePlant)

module.exports = router
