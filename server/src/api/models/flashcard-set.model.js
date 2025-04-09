const mongoose = require('mongoose');

/**
 * Flashcard Schema - embedded in FlashcardSet
 */
const FlashcardSchema = new mongoose.Schema({
  term: {
    type: String,
    required: [true, 'Term is required'],
    trim: true,
    maxlength: [500, 'Term cannot exceed 500 characters']
  },
  definition: {
    type: String,
    required: [true, 'Definition is required'],
    trim: true,
    maxlength: [2000, 'Definition cannot exceed 2000 characters']
  },
  examples: [{
    type: String,
    trim: true,
    maxlength: [1000, 'Example cannot exceed 1000 characters']
  }],
  imageUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Invalid image URL format'
    }
  },
  confidence: {
    type: Number,
    min: [0, 'Confidence cannot be less than 0'],
    max: [1, 'Confidence cannot be greater than 1'],
    default: 0
  }
});

/**
 * FlashcardSet Schema - main schema for storing sets of flashcards
 */
const FlashcardSetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
    index: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  subject: {
    type: String,
    trim: true,
    maxlength: [100, 'Subject cannot exceed 100 characters'],
    index: true
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  visibility: {
    type: String,
    enum: {
      values: ['private', 'public', 'shared'],
      message: '{VALUE} is not a valid visibility setting'
    },
    default: 'private',
    index: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required'],
    index: true
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['viewer', 'editor'],
      default: 'viewer'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  flashcards: [FlashcardSchema],
  sourceDocument: {
    type: String,
    trim: true
  },
  lastStudied: {
    type: Date
  },
  studyStats: {
    totalReviews: {
      type: Number,
      default: 0
    },
    correctReviews: {
      type: Number,
      default: 0
    },
    averageConfidence: {
      type: Number,
      default: 0
    },
    lastReviewDate: {
      type: Date
    }
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Compound indexes for common query patterns
FlashcardSetSchema.index({ owner: 1, visibility: 1 }); // Find user's sets by visibility
FlashcardSetSchema.index({ visibility: 1, subject: 1, createdAt: -1 }); // Find public sets by subject
FlashcardSetSchema.index({ 'collaborators.user': 1, visibility: 1 }); // Find sets user can collaborate on
FlashcardSetSchema.index({ tags: 1, visibility: 1 }); // Find sets by tags and visibility
FlashcardSetSchema.index({ title: 'text', description: 'text', subject: 'text', tags: 'text' }); // Full-text search

// Add TTL index for inactive private sets (optional, uncomment if needed)
// FlashcardSetSchema.index({ lastStudied: 1 }, { expireAfterSeconds: 180 * 24 * 60 * 60 }); // 180 days

/**
 * Pre-save middleware to update study stats
 */
FlashcardSetSchema.pre('save', function(next) {
  if (this.isModified('flashcards')) {
    const totalConfidence = this.flashcards.reduce((sum, card) => sum + (card.confidence || 0), 0);
    this.studyStats.averageConfidence = this.flashcards.length > 0 
      ? totalConfidence / this.flashcards.length 
      : 0;
  }
  next();
});

/**
 * Instance method to check if user has access
 */
FlashcardSetSchema.methods.hasAccess = function(userId, requiredRole = 'viewer') {
  // Owner has full access
  if (this.owner.equals(userId)) return true;
  
  // Check collaborator access
  const collaborator = this.collaborators.find(c => c.user.equals(userId));
  if (!collaborator) return false;
  
  // For viewer role, any collaborator has access
  if (requiredRole === 'viewer') return true;
  
  // For editor role, check if collaborator is an editor
  return collaborator.role === 'editor';
};

/**
 * Static method to find accessible sets
 */
FlashcardSetSchema.statics.findAccessible = async function(userId, options = {}) {
  const { subject, tags, search, sort = '-createdAt', page = 1, limit = 10 } = options;
  
  const query = {
    $or: [
      { owner: userId },
      { 'collaborators.user': userId },
      { visibility: 'public' }
    ]
  };
  
  if (subject) query.subject = subject;
  if (tags?.length) query.tags = { $all: tags };
  if (search) query.$text = { $search: search };
  
  const sets = await this.find(query)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('owner', 'username')
    .populate('collaborators.user', 'username');
    
  const total = await this.countDocuments(query);
  
  return {
    sets,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

module.exports = mongoose.model('FlashcardSet', FlashcardSetSchema); 