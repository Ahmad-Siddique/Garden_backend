const express = require('express')
const router = express.Router()
const {
  createBeneficialCritter,
  getAllBeneficialCritters,
  getBeneficialCritterById,
  updateBeneficialCritter,
  deleteBeneficialCritter,
  getCritterByPlantSlug,
} = require('../controllers/beneficialCritterController')

const upload = require('../middleware/multer')
const { protect, authorize } = require('../middleware/auth')


// CRUD Routes
router.post('/', upload.single('image'), protect, createBeneficialCritter)
router.get('/', getAllBeneficialCritters)
router.get('/:id', getBeneficialCritterById)
router.put('/:id', upload.single('image'), protect, updateBeneficialCritter)
router.delete('/:id', deleteBeneficialCritter)
router.get('/name/:name', protect, getCritterByPlantSlug)

module.exports = router
