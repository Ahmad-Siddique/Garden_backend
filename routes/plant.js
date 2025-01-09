const express = require('express')
const router = express.Router()
const upload = require('../middleware/multer')
const plantController = require('../controllers/plantController')
const { protect, authorize } = require('../middleware/auth')
router.post(
  '/',

  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
    { name: 'gardenImage', maxCount: 1 },
  ]),protect,
  plantController.createPlant,
)
router.get('/grouped-by-category', plantController.getPlantsGroupedByCategory)
router.get('/', plantController.getPlants)
router.get('/all', plantController.getAllPlants)
router.get('/dataall', plantController.getAllAllPlantsData)
router.put('/:slug/relationships', plantController.updateRelationshipsBySlug);
router.get('/slug/:slug', plantController.getPlantBySlug)
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
  ]),protect,
  plantController.updatePlant,
)
router.delete('/:id', protect,plantController.deletePlant)

module.exports = router
