# Quizlet Flashcard Generator Backend

A powerful backend system for generating, managing, and sharing flashcards.

## Features

- 🔐 **Secure Authentication**: User registration, login, password reset
- 📚 **Flashcard Management**: Create, read, update, delete flashcard sets
- 🔄 **Content Processing**: Process text, URLs, and various file formats
- ✨ **Automatic Generation**: AI-powered flashcard generation from content
- 🔍 **Search & Discovery**: Find and filter flashcard sets
- 📊 **Statistics**: Track and analyze flashcard sets

## Technology Stack

- **Node.js**: JavaScript runtime environment
- **Express**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: Object Data Modeling (ODM) library
- **JWT**: JSON Web Tokens for authentication
- **Joi**: Schema validation
- **Multer**: File upload handling
- **Winston**: Logging
- **Express Rate Limit**: Rate limiting
- **Helmet**: Security headers

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/quizlet-flashcard-generator.git
cd quizlet-flashcard-generator
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration
   - Set a proper JWT_SECRET for security
   - Configure your MongoDB connection string

5. Start the development server
```bash
npm run dev
```

## API Documentation

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login a user
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password with token
- `GET /api/v1/auth/me` - Get current user profile

### User Management

- `PUT /api/v1/users/profile` - Update user profile
- `DELETE /api/v1/users/profile` - Delete user account

### Flashcard Sets

- `POST /api/v1/flashcard-sets` - Create a new flashcard set
- `GET /api/v1/flashcard-sets` - Get all flashcard sets for the user
- `GET /api/v1/flashcard-sets/public` - Get public flashcard sets
- `GET /api/v1/flashcard-sets/search` - Search flashcard sets
- `GET /api/v1/flashcard-sets/:id` - Get a single flashcard set
- `GET /api/v1/flashcard-sets/:id/stats` - Get flashcard set statistics
- `PUT /api/v1/flashcard-sets/:id` - Update a flashcard set
- `POST /api/v1/flashcard-sets/:id/duplicate` - Duplicate a flashcard set
- `DELETE /api/v1/flashcard-sets/:id` - Delete a flashcard set

### Content Processing

- `POST /api/v1/processor/text` - Process text content
- `POST /api/v1/processor/url` - Process URL content
- `POST /api/v1/processor/file` - Process uploaded file
- `POST /api/v1/processor/generate` - Generate flashcards from content
- `GET /api/v1/processor/task/:taskId` - Get task status
- `DELETE /api/v1/processor/task/:taskId` - Cancel task

## Development

### Project Structure

```
src/
├── api/
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Express middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # Express routes
│   ├── services/       # Business logic
│   └── utils/          # Utility functions
├── config/             # Configuration
├── loaders/            # Application loaders
└── types/              # Type definitions
```

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

## License

This project is licensed under the ISC License.

## Acknowledgements

- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/) 