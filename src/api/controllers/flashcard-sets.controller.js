const { StatusCodes } = require('http-status-codes');
const { FlashcardSet } = require('../models');
const { asyncHandler, errors, Paginator } = require('../utils');
const mongoose = require('mongoose');
const logger = require('../../config/logger');

/**
 * @route POST /api/v1/flashcard-sets
 * @desc Create a new flashcard set
 * @access Private
 */
const createFlashcardSet = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  
  // Add user ID to request body
  const flashcardSetData = {
    ...req.body,
    userId,
  };
  
  const flashcardSet = await FlashcardSet.create(flashcardSetData);
  
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Flashcard set created successfully',
    flashcardSet,
  });
});

/**
 * @route GET /api/v1/flashcard-sets
 * @desc Get all flashcard sets for the user (paginated)
 * @access Private
 */
const getFlashcardSets = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { page, limit, sort, order, tags, language, complexity } = req.query;
  
  // Build query filter
  const filter = { userId };
  
  // Add optional filters
  if (tags) {
    // Handle both single tag and array of tags
    const tagArray = Array.isArray(tags) ? tags : [tags];
    filter.tags = { $in: tagArray };
  }
  
  if (language) {
    filter.language = language;
  }
  
  if (complexity) {
    filter.complexity = complexity;
  }
  
  // Create paginator
  const paginator = new Paginator({
    page,
    limit,
    sort: sort || 'createdAt',
    order: order || 'desc',
    totalItems: await FlashcardSet.countDocuments(filter),
  });
  
  // Define projection for listing view (exclude large content)
  const projection = {
    title: 1,
    description: 1,
    userId: 1,
    tags: 1,
    isPublic: 1,
    language: 1,
    complexity: 1,
    createdAt: 1,
    updatedAt: 1,
    'flashcards.difficulty': 1,
    'flashcards._id': 1
  };
  
  // Get paginated results with optimized query
  const flashcardSets = await FlashcardSet.find(filter, projection)
    .lean()
    .skip(paginator.skip)
    .limit(paginator.limit)
    .sort({ [paginator.sort]: paginator.order === 'desc' ? -1 : 1 });
  
  // Add flashcard count to each set
  const results = flashcardSets.map(set => ({
    ...set,
    id: set._id,
    flashcardCount: set.flashcards ? set.flashcards.length : 0,
    flashcards: undefined
  }));
  
  res.status(StatusCodes.OK).json({
    success: true,
    ...paginator.formatResults(results),
  });
});

/**
 * @route GET /api/v1/flashcard-sets/public
 * @desc Get public flashcard sets (paginated)
 * @access Public (with optional authentication)
 */
const getPublicFlashcardSets = asyncHandler(async (req, res) => {
  const { page, limit, sort, order, tags, language, complexity } = req.query;
  
  // Build query filter
  const filter = { isPublic: true };
  
  // Add optional filters
  if (tags) {
    const tagArray = Array.isArray(tags) ? tags : [tags];
    filter.tags = { $in: tagArray };
  }
  
  if (language) {
    filter.language = language;
  }
  
  if (complexity) {
    filter.complexity = complexity;
  }
  
  // Create paginator
  const paginator = new Paginator({
    page,
    limit,
    sort: sort || 'createdAt',
    order: order || 'desc',
    totalItems: await FlashcardSet.countDocuments(filter),
  });
  
  // Define projection for listing view (exclude large content)
  const projection = {
    title: 1,
    description: 1,
    userId: 1,
    tags: 1,
    isPublic: 1,
    language: 1,
    complexity: 1,
    createdAt: 1,
    updatedAt: 1,
    'flashcards.difficulty': 1,
    'flashcards._id': 1
  };
  
  // Get paginated results with optimized query
  const flashcardSets = await FlashcardSet.find(filter, projection)
    .lean()
    .skip(paginator.skip)
    .limit(paginator.limit)
    .sort({ [paginator.sort]: paginator.order === 'desc' ? -1 : 1 });
  
  // Add flashcard count to each set
  const results = flashcardSets.map(set => ({
    ...set,
    id: set._id,
    flashcardCount: set.flashcards ? set.flashcards.length : 0,
    flashcards: undefined
  }));
  
  res.status(StatusCodes.OK).json({
    success: true,
    ...paginator.formatResults(results),
  });
});

/**
 * @route GET /api/v1/flashcard-sets/:id
 * @desc Get a single flashcard set by ID
 * @access Private (for user's own sets) or Public (for public sets)
 */
const getFlashcardSet = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.userId; // Optional authentication
  
  // Verify valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new errors.BadRequestError(`Invalid flashcard set ID: ${id}`);
  }
  
  // Base query - either must be the owner or the set must be public
  const query = {
    _id: id,
    $or: [
      { userId: userId },
      { isPublic: true }
    ]
  };
  
  // If user is not authenticated, can only access public sets
  if (!userId) {
    query.$or = [{ isPublic: true }];
  }
  
  // Retrieve the flashcard set with query
  const flashcardSet = await FlashcardSet.findOne(query);
  
  if (!flashcardSet) {
    throw new errors.NotFoundError('Flashcard set not found or you do not have permission to access it');
  }
  
  // Track analytics for public sets (in a real app, this would be more robust)
  if (flashcardSet.isPublic) {
    // This would be handled by a proper analytics service in production
    logger.info(`Flashcard set viewed: ${id}, User: ${userId || 'anonymous'}`);
  }
  
  res.status(StatusCodes.OK).json({
    success: true,
    flashcardSet,
  });
});

/**
 * @route PUT /api/v1/flashcard-sets/:id
 * @desc Update a flashcard set
 * @access Private (owner only)
 */
const updateFlashcardSet = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  
  // Find flashcard set
  const flashcardSet = await FlashcardSet.findById(id);
  
  if (!flashcardSet) {
    throw new errors.NotFoundError('Flashcard set not found');
  }
  
  // Check if user is the owner
  if (flashcardSet.userId.toString() !== userId) {
    throw new errors.ForbiddenError('You do not have permission to update this flashcard set');
  }
  
  // Update only allowed fields
  const allowedUpdates = [
    'title', 'description', 'flashcards', 'tags', 
    'isPublic', 'language', 'complexity', 'metadata'
  ];
  
  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });
  
  // Update the flashcard set
  const updatedFlashcardSet = await FlashcardSet.findByIdAndUpdate(
    id,
    updates,
    { new: true, runValidators: true }
  );
  
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Flashcard set updated successfully',
    flashcardSet: updatedFlashcardSet,
  });
});

/**
 * @route DELETE /api/v1/flashcard-sets/:id
 * @desc Delete a flashcard set
 * @access Private (owner only)
 */
const deleteFlashcardSet = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  
  // Find flashcard set
  const flashcardSet = await FlashcardSet.findById(id);
  
  if (!flashcardSet) {
    throw new errors.NotFoundError('Flashcard set not found');
  }
  
  // Check if user is the owner
  if (flashcardSet.userId.toString() !== userId) {
    throw new errors.ForbiddenError('You do not have permission to delete this flashcard set');
  }
  
  // Delete the flashcard set
  await FlashcardSet.findByIdAndDelete(id);
  
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Flashcard set deleted successfully',
  });
});

/**
 * @route GET /api/v1/flashcard-sets/:id/stats
 * @desc Get statistics for a flashcard set
 * @access Private (for user's own sets) or Public (for public sets)
 */
const getFlashcardSetStats = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.userId; // Optional authentication
  
  const flashcardSet = await FlashcardSet.findById(id);
  
  if (!flashcardSet) {
    throw new errors.NotFoundError('Flashcard set not found');
  }
  
  // Check if user has access (owner or public set)
  if (!flashcardSet.isPublic && (!userId || flashcardSet.userId.toString() !== userId)) {
    throw new errors.ForbiddenError('You do not have permission to access this flashcard set');
  }
  
  // Calculate statistics
  const stats = flashcardSet.getStatistics();
  
  res.status(StatusCodes.OK).json({
    success: true,
    stats,
  });
});

/**
 * @route POST /api/v1/flashcard-sets/:id/duplicate
 * @desc Duplicate a flashcard set
 * @access Private (for public sets or user's own sets)
 */
const duplicateFlashcardSet = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const { title } = req.body;
  
  // Find original flashcard set
  const originalSet = await FlashcardSet.findById(id);
  
  if (!originalSet) {
    throw new errors.NotFoundError('Flashcard set not found');
  }
  
  // Check if user has access (owner or public set)
  if (!originalSet.isPublic && originalSet.userId.toString() !== userId) {
    throw new errors.ForbiddenError('You do not have permission to duplicate this flashcard set');
  }
  
  // Create new flashcard set with user's data
  const newSetData = {
    title: title || `Copy of ${originalSet.title}`,
    description: originalSet.description,
    userId,
    flashcards: originalSet.flashcards,
    tags: originalSet.tags,
    isPublic: false, // Default to private for duplicated sets
    language: originalSet.language,
    complexity: originalSet.complexity,
    sourceType: originalSet.sourceType,
    sourceReference: originalSet.sourceReference,
  };
  
  const newFlashcardSet = await FlashcardSet.create(newSetData);
  
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Flashcard set duplicated successfully',
    flashcardSet: newFlashcardSet,
  });
});

/**
 * @route GET /api/v1/flashcard-sets/search
 * @desc Search flashcard sets
 * @access Private (with public sets option)
 */
const searchFlashcardSets = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { query, page, limit, filter = 'all', isPublic } = req.query;
  
  // Build search filter
  let searchFilter = {};
  
  // Determine which sets to search (user's sets or public sets)
  if (isPublic === 'true') {
    searchFilter.isPublic = true;
  } else if (isPublic === 'false') {
    searchFilter.userId = userId;
  } else {
    // If not specified, search both user's sets and public sets
    searchFilter.$or = [
      { userId },
      { isPublic: true },
    ];
  }
  
  // Build text search criteria based on filter
  let textSearchCriteria = {};
  
  switch (filter) {
    case 'title':
      textSearchCriteria.title = { $regex: query, $options: 'i' };
      break;
    case 'description':
      textSearchCriteria.description = { $regex: query, $options: 'i' };
      break;
    case 'tags':
      textSearchCriteria.tags = { $regex: query, $options: 'i' };
      break;
    case 'content':
      textSearchCriteria['flashcards.front'] = { $regex: query, $options: 'i' };
      break;
    case 'all':
    default:
      textSearchCriteria.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } },
        { 'flashcards.front': { $regex: query, $options: 'i' } },
        { 'flashcards.back': { $regex: query, $options: 'i' } },
      ];
  }
  
  // Combine filters
  const finalFilter = {
    ...searchFilter,
    ...textSearchCriteria,
  };
  
  // Create paginator
  const paginator = new Paginator({
    page,
    limit,
    totalItems: await FlashcardSet.countDocuments(finalFilter),
  });
  
  // Define projection for listing view (exclude large content)
  const projection = {
    title: 1,
    description: 1,
    userId: 1,
    tags: 1,
    isPublic: 1,
    language: 1,
    complexity: 1,
    createdAt: 1,
    updatedAt: 1,
    'flashcards.difficulty': 1,
    'flashcards._id': 1
  };
  
  // Get paginated results
  const flashcardSets = await FlashcardSet.find(finalFilter, projection)
    .lean()
    .skip(paginator.skip)
    .limit(paginator.limit)
    .sort({ createdAt: -1 });
  
  // Add flashcard count to each set
  const results = flashcardSets.map(set => ({
    ...set,
    id: set._id,
    flashcardCount: set.flashcards ? set.flashcards.length : 0,
    flashcards: undefined
  }));
  
  res.status(StatusCodes.OK).json({
    success: true,
    ...paginator.formatResults(results),
  });
});

module.exports = {
  createFlashcardSet,
  getFlashcardSets,
  getPublicFlashcardSets,
  getFlashcardSet,
  updateFlashcardSet,
  deleteFlashcardSet,
  getFlashcardSetStats,
  duplicateFlashcardSet,
  searchFlashcardSets,
}; 