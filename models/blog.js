const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  category: {
    type: String,
    required: true,
    trim: true,
  },
  minReading: {
    type: Number,
    required: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  featuredImage: {
    type: String, // URL or path to the featured image
  },
  description: {
    type: mongoose.Schema.Types.Mixed, // Supports rich content like headings, paras, links, etc.
    required: true,
  },
  plants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant',
    },
  ],
});

// Middleware to generate the slug from the title
BlogSchema.pre('save', function (next) {
  if (this.title) {
    this.slug = this.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  }
  next();
});

BlogSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    if (update.title) {
      // Normalize name and generate slug if name is being updated
     
      update.slug = update.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    next();
  });


module.exports = mongoose.model('Blog', BlogSchema);
