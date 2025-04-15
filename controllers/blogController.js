// controllers/blogController.js
const Blog = require('../models/blog')
const Comment = require('../models/blogComment')
const mongoose = require('mongoose')

// 1. Create Blog Controller
exports.createBlog = async (req, res) => {
  try {
    const {
      title,
      category,
      minReading,
      description,
      tags,
      plants,
      
      } = req.body
      
       let featuredImage = ''
       if (req.file) {
         featuredImage = req.file.path // Cloudinary URL
       }

    // Assuming req.user contains the authenticated user
    const postedBy = req.user.id

    const newBlog = new Blog({
      title,
      category,
      minReading,
      description,
      postedBy,
      tags: tags || [],
      plants: plants || [],
      featuredImage,
    })

    const savedBlog = await newBlog.save()

    res.status(201).json({
      success: true,
      data: savedBlog,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create blog',
      error: error.message,
    })
  }
}


exports.uploadImage = async (req, res) => {
  try {
  

    let featuredImage = ''
    if (req.file) {
      featuredImage = req.file.path // Cloudinary URL
    }

    // Assuming req.user contains the authenticated user
    

    res.status(201).json({
      success: true,
      data: featuredImage,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload Image',
      error: error.message,
    })
  }
}

// 2. Edit Blog Controller
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params
      const updateData = req.body
      
       let featuredImage = ''
       if (req.file) {
         featuredImage = req.file.path // Cloudinary URL
       }

    // Find blog and check ownership
    const blog = await Blog.findById(id)

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      })
    }

    // Check if user is the author
    if (blog.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to edit this blog',
      })
    }

    const updatedBlog = await Blog.findOneAndUpdate({ _id: id }, updateData, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: updatedBlog,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update blog',
      error: error.message,
    })
  }
}

// 3. Get Blog by ID Controller
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params

    const blog = await Blog.findById(id)
      .populate('postedBy', 'name email')
      .populate('plants', 'name description')
      .exec()

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      })
    }

    // Get comments for this blog
    const comments = await Comment.find({ blog: id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .exec()

    res.status(200).json({
      success: true,
      data: { blog, comments },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve blog',
      error: error.message,
    })
  }
}

// controllers/blogController.js

// Get All Blogs with pagination, search, filtering
exports.getAllBlogs = async (req, res) => {
  try {
    const { 
      search, 
      page = 1, 
      limit = 10,
      category,
      tag,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      startDate,
      endDate,
      plant
    } = req.query;

    // Build search and filter query
    let query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { tags: { $elemMatch: { $regex: search, $options: 'i' } } }
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by tag
    if (tag) {
      query.tags = { $in: [tag] };
    }

    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Filter by plant
    if (plant) {
      query.plants = mongoose.Types.ObjectId(plant);
    }

    // Pagination logic
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sorting options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Fetch blogs based on search criteria with pagination
    const blogs = await Blog.find(query)
      .populate('postedBy', 'name email')
      .populate('plants', 'name description')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalBlogs = await Blog.countDocuments(query);

    // Get a count of blogs by category for filters
    const categoryCount = await Blog.aggregate([
      { $match: search ? query : {} },  // Apply search if present, but not category filter
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get a count of blogs by tag for filters
    const tagCount = await Blog.aggregate([
      { $match: search ? query : {} },  // Apply search if present
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        blogs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalBlogs / parseInt(limit)),
          totalBlogs,
          hasMore: parseInt(page) < Math.ceil(totalBlogs / parseInt(limit))
        },
        filters: {
          categories: categoryCount,
          tags: tagCount
        }
      }
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve blogs',
      error: error.message 
    });
  }
};



// 4. Delete Blog Controller
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params

    const blog = await Blog.findById(id)

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      })
    }

    // Check ownership
    if (blog.postedBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this blog',
      })
    }

    // Delete blog and its comments
    await Blog.findByIdAndDelete(id)
    await Comment.deleteMany({ blog: id })

    res.status(200).json({
      success: true,
      message: 'Blog and associated comments deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete blog',
      error: error.message,
    })
  }
}

// 5. Get Blogs by Category
exports.getBlogsByCategory = async (req, res) => {
  try {
    const { category } = req.params

    const blogs = await Blog.find({ category })
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 })
      .exec()

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve blogs by category',
      error: error.message,
    })
  }
}

// 6. Get Blogs by Month with Count
exports.getBlogsByMonth = async (req, res) => {
  try {
    const blogsByMonth = await Blog.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          blogs: { $push: '$$ROOT' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          blogs: 1,
          count: 1,
        },
      },
    ])

    // Convert month number to name
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

    const formattedResult = blogsByMonth.map((group) => ({
      monthName: monthNames[group.month - 1],
      year: group.year,
      count: group.count,
      blogs: group.blogs,
    }))

    res.status(200).json({
      success: true,
      data: formattedResult,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve blogs by month',
      error: error.message,
    })
  }
}

// 7. Get Blogs by Specific Plant
// 7. Get Blogs by Specific Plant with pagination and filtering
exports.getBlogsByPlant = async (req, res) => {
  try {
    const { plantId } = req.params;
    const { 
      search, 
      page = 1, 
      limit = 10,
      category,
      tag,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      startDate,
      endDate 
    } = req.query;

    // Build query with plantId as the primary filter
    let query = { plants: mongoose.Types.ObjectId(plantId) };

    // Add search functionality
    if (search) {
      query.$and = [
        { plants: mongoose.Types.ObjectId(plantId) },
        {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { category: { $regex: search, $options: 'i' } },
            { tags: { $elemMatch: { $regex: search, $options: 'i' } } }
          ]
        }
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by tag
    if (tag) {
      query.tags = { $in: [tag] };
    }

    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Pagination logic
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sorting options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Fetch blogs based on query criteria with pagination
    const blogs = await Blog.find(query)
      .populate('postedBy', 'name email')
      .populate('plants', 'name description image')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

    // Get total count for pagination
    const totalBlogs = await Blog.countDocuments(query);

    // Get plant details
    const plant = await mongoose.model('Plant').findById(plantId);

    // Get categories associated with this plant's blogs
    const plantCategories = await Blog.aggregate([
      { $match: { plants: mongoose.Types.ObjectId(plantId) } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get popular tags for this plant's blogs
    const plantTags = await Blog.aggregate([
      { $match: { plants: mongoose.Types.ObjectId(plantId) } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 15 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        blogs,
        plant: plant || { _id: plantId, name: "Unknown Plant" },
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalBlogs / parseInt(limit)),
          totalBlogs,
          hasMore: parseInt(page) < Math.ceil(totalBlogs / parseInt(limit))
        },
        metadata: {
          categories: plantCategories,
          popularTags: plantTags
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve blogs by plant',
      error: error.message,
    });
  }
};


// 8. Get Blog Count by Plant
exports.getBlogCountByPlant = async (req, res) => {
  try {
    const blogCountByPlant = await Blog.aggregate([
      { $unwind: '$plants' },
      {
        $group: {
          _id: '$plants',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'plants', // Collection name in MongoDB
          localField: '_id',
          foreignField: '_id',
          as: 'plantInfo',
        },
      },
      { $unwind: '$plantInfo' },
      {
        $project: {
          _id: 0,
          plantId: '$_id',
          name: '$plantInfo.name',
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ])

    res.status(200).json({
      success: true,
      data: blogCountByPlant,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve blog count by plant',
      error: error.message,
    })
  }
}

// 9. Search Blogs by Title
exports.searchBlogsByTitle = async (req, res) => {
  try {
    const { keyword } = req.query

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: 'Search keyword is required',
      })
    }

    // Using regex for case-insensitive search
    const blogs = await Blog.find({
      title: { $regex: keyword, $options: 'i' },
    })
      .select('title slug category minReading createdAt featuredImage')
      .sort({ createdAt: -1 })
      .limit(10)
      .exec()

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to search blogs',
      error: error.message,
    })
  }
}

// 10. Add Comment to Blog
exports.addComment = async (req, res) => {
  try {
    const { blogId } = req.params
    const { content } = req.body

    // Check if blog exists
    const blog = await Blog.findById(blogId)

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      })
    }

    // Create new comment
    const newComment = new Comment({
      content,
      blog: blogId,
      user: req.user._id, // Assuming authentication middleware provides req.user
    })

    const savedComment = await newComment.save()

    // Populate user info
    const populatedComment = await Comment.findById(savedComment._id)
      .populate('user', 'name email')
      .exec()

    res.status(201).json({
      success: true,
      data: populatedComment,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add comment',
      error: error.message,
    })
  }
}

// Get all comments for a blog with pagination
exports.getCommentsByBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // Convert to integers
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const skip = (pageInt - 1) * limitInt;
    
    // Fetch comments with pagination
    const comments = await Comment.find({ blog: blogId })
      .populate('user', 'name email profilePicture') // Include profile picture if available
      .sort({ createdAt: -1 }) // Newest comments first
      .skip(skip)
      .limit(limitInt)
      .exec();
    
    // Get total count of comments for this blog
    const totalComments = await Comment.countDocuments({ blog: blogId });
    
    // Get blog details
    const blog = await Blog.findById(blogId)
      .select('title slug')
      .exec();
    
    res.status(200).json({
      success: true,
      data: {
        comments,
        blog: blog || { _id: blogId },
        pagination: {
          currentPage: pageInt,
          totalPages: Math.ceil(totalComments / limitInt),
          totalComments,
          hasMore: skip + comments.length < totalComments
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve comments',
      error: error.message
    });
  }
};

