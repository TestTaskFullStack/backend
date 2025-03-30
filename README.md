# Game Library Backend

A Node.js backend service for managing a game library with user authentication, game management, and real-time features using Socket.io.

## Features

- User Authentication (JWT)
- Role-based Access Control (User/Admin)
- Game Management
- Genre Management
- Real-time Updates via Socket.io
- MongoDB Database Integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=8080
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_DB=gamelibrary
JWT_SECRET=your_jwt_secret
```

4. Start the server:
```bash
npm start
```

## Real-time Communication

The application uses Socket.io for real-time features. This enables instant updates and live interactions between clients and the server.

### WebSocket Connection

```javascript
// Client-side connection example
const socket = io('ws://localhost:8080', {
  auth: {
    token: 'your_jwt_token'
  }
});
```

### Event System

#### 1. Connection Events
| Event | Description | Payload |
|-------|-------------|---------|
| `connection` | Triggered on successful connection | None |
| `disconnect` | Triggered when client disconnects | None |

#### 2. Game Events
| Event | Description | Payload |
|-------|-------------|---------|
| `game:update` | Game data changes | ```json
{
  "type": "create|update|delete",
  "game": {
    "id": "string",
    "title": "string",
    "description": "string",
    "genre": "string",
    "releaseDate": "string",
    "rating": "number",
    "price": "number"
  }
}
``` |
| `game:list` | Initial games list | Array of Game objects |

#### 3. User Events
| Event | Description | Payload |
|-------|-------------|---------|
| `user:status` | User online/offline status | ```json
{
  "userId": "string",
  "status": "online|offline",
  "timestamp": "string"
}
``` |
| `user:join` | User joins the system | User object |
| `user:leave` | User leaves the system | User object |

#### 4. System Events
| Event | Description | Payload |
|-------|-------------|---------|
| `error` | System errors | ```json
{
  "message": "string",
  "code": "string",
  "timestamp": "string"
}
``` |
| `system:status` | System status updates | ```json
{
  "status": "string",
  "message": "string",
  "timestamp": "string"
}
``` |

### Error Handling

All WebSocket errors follow this format:
```json
{
  "message": "Error description",
  "code": "ERROR_CODE",
  "timestamp": "2024-03-21T10:00:00Z"
}
```

Common error codes:
- `AUTH_ERROR`: Authentication failed
- `VALIDATION_ERROR`: Invalid data format
- `PERMISSION_ERROR`: Insufficient permissions
- `CONNECTION_ERROR`: Connection issues

### Best Practices

1. **Reconnection**
```javascript
socket.on('disconnect', () => {
  // Implement reconnection logic
  setTimeout(() => {
    socket.connect();
  }, 5000);
});
```

2. **Error Handling**
```javascript
socket.on('error', (error) => {
  console.error('WebSocket error:', error);
  // Handle error appropriately
});
```

3. **Event Acknowledgment**
```javascript
socket.emit('game:update', data, (response) => {
  if (response.error) {
    console.error('Update failed:', response.error);
  } else {
    console.log('Update successful:', response);
  }
});
```

## API Endpoints

### Authentication

#### POST /api/auth/signup
Register a new user
- Request Body:
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "roles": ["user"]
}
```

#### POST /api/auth/signin
Login user
- Request Body:
```json
{
  "username": "string",
  "password": "string"
}
```

#### GET /api/auth/token
Verify JWT token
- Headers: Authorization: Bearer <token>

### Games

#### GET /api/games
Get all games
- No authentication required
- Returns list of all games

#### GET /api/games/:id
Get game by ID
- No authentication required
- Returns detailed game information

### Genres

#### GET /api/genres
Get all genres
- No authentication required
- Returns list of all genres

## Database Schema

### User
- username: String (unique)
- email: String (unique)
- password: String (hashed)
- roles: Array[String]

### Game
- title: String
- description: String
- genre: ObjectId (reference to Genre)
- releaseDate: Date
- rating: Number
- price: Number

### Genre
- name: String
- description: String

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS enabled with specific configuration
- Role-based access control
- Environment variables for sensitive data

## Development

The project structure follows MVC pattern:
```
├── controllers/    # Request handlers
├── models/        # Database models
├── routes/        # API routes
├── middlewares/   # Custom middlewares
├── services/      # Business logic
├── utils/         # Utility functions
└── sockets/       # Socket.io handlers
```

## Testing

To run tests:
```bash
npm test
```

