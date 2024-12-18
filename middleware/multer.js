const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

let upload

try {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'uploads', // Folder name on Cloudinary
      // allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif', 'svg'], // Allowed formats
      resource_type: 'auto',
    },
  })

  upload = multer({ storage: storage })
} catch (error) {
  console.error('Error configuring multer:', error.message)
  throw new Error('Multer configuration failed') // Exit gracefully or handle appropriately
}

module.exports = upload
