// routes/blogRoutes.js
const express = require('express')
const router = express.Router()
const blogController = require('../controllers/blogController')
const { protect, authorize } = require('../middleware/auth')
const upload = require('../middleware/multer')
// Public routes
router.get('/blogs', blogController.getAllBlogs) // You'll need to implement this
router.get('/blogs/by-month', blogController.getBlogsByMonth)
router.get('/blogs/search', blogController.searchBlogsByTitle)

router.get('/blogs/count-by-plant', blogController.getBlogCountByPlant)
router.get('/blogs/:id', blogController.getBlogById)
router.get('/blogs/category/:category', blogController.getBlogsByCategory)

router.get('/blogs/by-plant/:plantId', blogController.getBlogsByPlant)


router.get('/blogs/:blogId/comments', blogController.getCommentsByBlog)

// Protected routes (require authentication)
router.post('/blogs', upload.single('image'), protect, blogController.createBlog)
router.post(
  '/blogs/upload',
  upload.single('image'),
  protect,
  blogController.uploadImage,
)
router.put('/blogs/:id',upload.single('image'), protect, blogController.updateBlog)
router.delete('/blogs/:id', protect, blogController.deleteBlog)
router.post(
  '/blogs/:blogId/comments',
  protect,
  blogController.addComment,
)

module.exports = router
