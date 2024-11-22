const express = require('express')
const router = express.Router()
const plantController = require('../controllers/PlantCategoriesController')

// Create a new plant category
router.post('/plantscategory', plantController.createPlantCategory)

// Get all plant categories
router.get('/plantscategory', plantController.getPlantCategories)

// Get a single plant category by ID
router.get('/plantscategory/:id', plantController.getPlantCategoryById)

// Update a plant category by ID
router.put('/plantscategory/:id', plantController.updatePlantCategory)

// Delete a plant category by ID
router.delete('/plantscategory/:id', plantController.deletePlantCategory)






module.exports = router
