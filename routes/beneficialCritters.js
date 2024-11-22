const express = require('express')
const router = express.Router()
const {
  createBeneficialCritter,
  getAllBeneficialCritters,
  getBeneficialCritterById,
  updateBeneficialCritter,
  deleteBeneficialCritter,
} = require('../controllers/beneficialCritterController')

// CRUD Routes
router.post('/', createBeneficialCritter)
router.get('/', getAllBeneficialCritters)
router.get('/:id', getBeneficialCritterById)
router.put('/:id', updateBeneficialCritter)
router.delete('/:id', deleteBeneficialCritter)

module.exports = router
