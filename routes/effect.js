const express = require('express');
const router = express.Router();
const effectController = require('../controllers/effectController');
const upload = require('../middleware/multer')
const { protect, authorize } = require('../middleware/auth')

// Create an Effect
router.post('/',upload.single('image'),protect, effectController.createEffect);

// Get all Effects
router.get('/', effectController.getAllPaginationEffects);
router.get('/all/:type?', effectController.getAllEffects);

// Get a single Effect by ID
router.get('/:id', effectController.getEffectById);

// Update an Effect by ID
router.put('/:id',upload.single('image'),protect, effectController.updateEffect);

// Delete an Effect by ID
router.delete('/:id', effectController.deleteEffect);

module.exports = router;
