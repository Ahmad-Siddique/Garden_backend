// Import necessary modules from Express, Passport, and controllers
const express = require('express')
const router = express.Router()
const passport = require('passport')

const {
  register,
  login,
  getMe,
  onBoarding,
  updatePassword,
  forgotPassword,
  resetPassword,
  allusers,
  deleteuser,
  registeruseradminpanel,
  updateuser,
  countuser,
  verifyEmail,
  verifyEmailSend,
  updateUserProfile,
  getUserProfile,
  getUserById,
  updateSpringFrostDate,
  updateFallFrostDate,
  updateMetricUnit,
  getGrowingSeasonInfo,

  // getUserMetrics,
  // getUserMetrics2,
} = require('../controllers/auth')
const { protect, authorize } = require('../middleware/auth')

const cloudinary = require('cloudinary').v2


const upload = require('../middleware/multer')





// Route for user registration
router.post('/register', upload.single('image'), register)

router.post('/registeruser', registeruseradminpanel)

router.post('/login', login)

// Route to get user details (requires authentication)
router.get('/getMe', protect, getMe)
// Update Spring Frost Date
router.put('/update-spring-frost', protect, updateSpringFrostDate)

// Update Fall Frost Date
router.put('/update-fall-frost', protect, updateFallFrostDate)

// Update Metric Unit Preference
router.put('/update-metric-unit', protect, updateMetricUnit)

// Fetch Growing Season Info
router.get('/growing-season', protect, getGrowingSeasonInfo)
router.post('/onboarding', upload.single('image'),protect, onBoarding)
// router.get('/getusermetrics', protect, getUserMetrics)
// router.get('/getusermetrics2', protect, getUserMetrics2)
router.post('/forgotPassword', forgotPassword)

router.put('/resetpassword/:resettoken', resetPassword)

router.post('/updatePassword', protect, updatePassword)

router.get('/verify-email/:token', verifyEmail)
router.get('/verify-email', protect, verifyEmailSend)

// Update user profile

router.post('/updateuserprofile',upload.single('image'), protect, updateUserProfile)
router.get('/getuserprofile', protect, getUserProfile)



// Admin routes
router.get('/allusers', protect, authorize('admin'), allusers)
router.delete('/deleteuser/:id', protect, authorize('admin'), deleteuser)
router.put('/updateuser/:id', protect, authorize('admin'), updateuser)
router.get('/getuser/:id', protect, authorize('admin'), getUserById)
router.get('/countuser', countuser)

// Export the router for use in other parts of the application
module.exports = router
