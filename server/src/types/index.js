/**
 * @typedef {Object} User
 * @property {string} _id - The user's unique ID
 * @property {string} username - The user's username
 * @property {string} email - The user's email address
 * @property {string} password - The user's hashed password
 * @property {Date} createdAt - When the user was created
 * @property {Date} updatedAt - When the user was last updated
 */

/**
 * @typedef {Object} UserDTO
 * @property {string} id - The user's unique ID
 * @property {string} username - The user's username
 * @property {string} email - The user's email address
 */

/**
 * @typedef {Object} Flashcard
 * @property {string} front - The content on the front of the flashcard
 * @property {string} back - The content on the back of the flashcard
 * @property {string} [imageUrl] - Optional URL to an image for the flashcard
 */

/**
 * @typedef {Object} FlashcardSet
 * @property {string} _id - The flashcard set's unique ID
 * @property {string} title - The title of the flashcard set
 * @property {string} description - A description of the flashcard set
 * @property {string} userId - The ID of the user who created the set
 * @property {Flashcard[]} flashcards - The flashcards in the set
 * @property {string[]} tags - Tags associated with the flashcard set
 * @property {boolean} isPublic - Whether the set is publicly accessible
 * @property {Date} createdAt - When the set was created
 * @property {Date} updatedAt - When the set was last updated
 */

/**
 * @typedef {Object} GenerationParams
 * @property {string} contentType - The type of content being processed (text, pdf, url, etc.)
 * @property {string} content - The content to generate flashcards from
 * @property {string} [language='english'] - The language of the content
 * @property {number} [maxCards=50] - Maximum number of flashcards to generate
 * @property {boolean} [includeImages=false] - Whether to include images in the flashcards
 * @property {string} [complexity='medium'] - Desired complexity level (simple, medium, advanced)
 */

/**
 * @typedef {Object} ErrorResponse
 * @property {string} message - The error message
 * @property {string} [code] - An optional error code
 * @property {Object} [details] - Additional error details
 */

/**
 * @typedef {Object} ProcessedDocument
 * @property {string} title - The document's title
 * @property {string} content - The extracted text content
 * @property {Object[]} [images] - Any images extracted from the document
 * @property {Object} metadata - Document metadata
 */

/**
 * @typedef {Object} ProgressStatus
 * @property {string} taskId - Unique ID for the task
 * @property {string} status - Current status (queued, processing, completed, failed)
 * @property {number} progress - Progress percentage (0-100)
 * @property {string} [message] - Optional status message
 * @property {Object} [result] - The result of the completed task
 * @property {Error} [error] - Error information if the task failed
 */

module.exports = {}; 