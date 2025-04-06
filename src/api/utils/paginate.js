/**
 * Helper class for pagination
 */
class Paginator {
  /**
   * Creates a paginator instance
   * @param {Object} options - Pagination options
   * @param {number} options.page - Current page number (1-based)
   * @param {number} options.limit - Maximum items per page
   * @param {string} options.sort - Field to sort by
   * @param {string} options.order - Sort order ('asc' or 'desc')
   * @param {number} options.totalItems - Total number of items
   */
  constructor({ page = 1, limit = 20, sort = 'createdAt', order = 'desc', totalItems = 0 }) {
    this.page = parseInt(page, 10);
    this.limit = parseInt(limit, 10);
    this.sort = sort;
    this.order = order;
    this.totalItems = totalItems;
    
    // Calculate skip value for MongoDB queries
    this.skip = (this.page - 1) * this.limit;
    
    // Calculate total pages
    this.totalPages = Math.ceil(this.totalItems / this.limit) || 1;
    
    // Determine if there are more pages
    this.hasNextPage = this.page < this.totalPages;
    this.hasPrevPage = this.page > 1;
    
    // Calculate next and previous page numbers
    this.nextPage = this.hasNextPage ? this.page + 1 : null;
    this.prevPage = this.hasPrevPage ? this.page - 1 : null;
  }
  
  /**
   * Get the MongoDB query options for pagination
   * @returns {Object} - Query options for MongoDB
   */
  getQueryOptions() {
    return {
      skip: this.skip,
      limit: this.limit,
      sort: { [this.sort]: this.order === 'desc' ? -1 : 1 },
    };
  }
  
  /**
   * Get paginated result metadata
   * @returns {Object} - Pagination metadata
   */
  getMetadata() {
    return {
      currentPage: this.page,
      totalPages: this.totalPages,
      totalItems: this.totalItems,
      itemsPerPage: this.limit,
      hasNextPage: this.hasNextPage,
      hasPrevPage: this.hasPrevPage,
      nextPage: this.nextPage,
      prevPage: this.prevPage,
    };
  }
  
  /**
   * Format paginated results
   * @param {Array} data - The items for the current page
   * @returns {Object} - Formatted paginated response
   */
  formatResults(data) {
    return {
      data,
      pagination: this.getMetadata(),
    };
  }
  
  /**
   * Create a paginator from query parameters
   * @param {Object} query - Express request query object
   * @param {number} totalItems - Total number of items
   * @returns {Paginator} - Configured paginator instance
   */
  static fromQuery(query, totalItems) {
    const { page = 1, limit = 20, sort = 'createdAt', order = 'desc' } = query;
    return new Paginator({ page, limit, sort, order, totalItems });
  }
}

module.exports = Paginator; 