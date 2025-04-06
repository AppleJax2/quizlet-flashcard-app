const mongoose = require('mongoose');

/**
 * Flashcard Schema - embedded in FlashcardSet
 */
const FlashcardSchema = new mongoose.Schema({
  front: {
    type: String,
    required: [true, 'Front content is required'],
    trim: true,
    maxlength: [2000, 'Front content cannot exceed 2000 characters'],
  },
  back: {
    type: String,
    required: [true, 'Back content is required'],
    trim: true,
    maxlength: [2000, 'Back content cannot exceed 2000 characters'],
  },
  imageUrl: {
    type: String,
    validate: {
      validator: function(v) {
        // Allow null or valid URL format
        return v === null || v === '' || /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
      },
      message: props => `${props.value} is not a valid URL`,
    },
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  metadata: {
    type: Map,
    of: String,
    default: {},
  },
}, {
  timestamps: true,
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
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  flashcards: {
    type: [FlashcardSchema],
    required: [true, 'At least one flashcard is required'],
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: 'At least one flashcard is required',
    },
  },
  tags: [{
    type: String,
    trim: true,
  }],
  isPublic: {
    type: Boolean,
    default: false,
  },
  sourceType: {
    type: String,
    enum: ['manual', 'text', 'pdf', 'url', 'docx', 'image'],
    default: 'manual',
  },
  sourceReference: {
    type: String,
    trim: true,
  },
  language: {
    type: String,
    trim: true,
    lowercase: true,
    default: 'english',
  },
  complexity: {
    type: String,
    enum: ['simple', 'medium', 'advanced'],
    default: 'medium',
  },
  metadata: {
    type: Map,
    of: String,
    default: {},
  },
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

// Add indexes for optimized queries
FlashcardSetSchema.index({ userId: 1, createdAt: -1 });
FlashcardSetSchema.index({ isPublic: 1, createdAt: -1 });
FlashcardSetSchema.index({ tags: 1 });

/**
 * Calculate statistics for the flashcard set
 * @returns {Object} - Statistics object
 */
FlashcardSetSchema.methods.getStatistics = function() {
  const flashcardCount = this.flashcards.length;
  
  const difficultyMap = this.flashcards.reduce((acc, card) => {
    acc[card.difficulty] = (acc[card.difficulty] || 0) + 1;
    return acc;
  }, {});
  
  // Calculate average front/back content length
  const avgFrontLength = this.flashcards.reduce((sum, card) => sum + card.front.length, 0) / flashcardCount;
  const avgBackLength = this.flashcards.reduce((sum, card) => sum + card.back.length, 0) / flashcardCount;
  
  // Calculate how many cards have images
  const cardsWithImages = this.flashcards.filter(card => card.imageUrl).length;
  
  return {
    flashcardCount,
    difficulty: difficultyMap,
    avgFrontLength: Math.round(avgFrontLength),
    avgBackLength: Math.round(avgBackLength),
    cardsWithImages,
    cardsWithImagesPercentage: Math.round((cardsWithImages / flashcardCount) * 100),
  };
};

/**
 * Get a summary of the flashcard set
 * @returns {Object} - Summary object
 */
FlashcardSetSchema.methods.getSummary = function() {
  return {
    id: this._id,
    title: this.title,
    description: this.description,
    userId: this.userId,
    flashcardCount: this.flashcards.length,
    tags: this.tags,
    isPublic: this.isPublic,
    language: this.language,
    complexity: this.complexity,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model('FlashcardSet', FlashcardSetSchema); 