export const SOCKET_EVENTS = {
  // Auth events
  WELCOME: 'welcome',
  AUTH_STATUS: 'auth:status',
  AUTH_STATUS_RESPONSE: 'auth:status_response',

  // Game events
  GAME_CREATED: 'game:create',
  GAME_UPDATED: 'game:update',
  GAME_DELETED: 'game:delete',
  GAME_SUBSCRIBE: 'game:subscribe',
  GAME_UNSUBSCRIBE: 'game:unsubscribe',
  GAME_SUBSCRIBED: 'game:subscribed',
  GAME_UNSUBSCRIBED: 'game:unsubscribed',
  GAME_COMMENT: 'game:comment',
  GAME_COMMENT_RESPONSE: 'game:comment_response',
  GAME_COMMENTED: 'game:commented', 
  GAME_COMMENT_DELETE: 'game:comment_delete',
  GAME_COMMENT_DELETED: 'game:comment_deleted', 
  // Comment events
  COMMENT_CREATE: 'game:comment',
  COMMENT_RESPONSE: 'game:comment_response',
  COMMENT_CREATED: 'game:commented',
  COMMENT_DELETE: 'game:comment_delete',
  COMMENT_DELETED: 'game:comment_deleted',

  // User events
  USER_STARTED_GAME: 'user:startGame',
  USER_STARTED_GAME_RESPONSE: 'user:startGame_response',
  USER_GET_STARTED_GAMES: 'user:getStartedGames',
  USER_STARTED_GAMES_RESPONSE: 'user:startedGames_response',
  USER_GET_ACHIEVEMENTS: 'user:getAchievements',
  USER_ACHIEVEMENTS_RESPONSE: 'user:achievements_response',
  USER_ACHIEVEMENT: 'user:achievementUnlocked',
  USERS_ONLINE: 'users:online'
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 9,
  MAX_LIMIT: 100
};

export const ERROR_MESSAGES = {
  // Auth errors
  INVALID_CREDENTIALS: 'Invalid username or password',
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User already exists',
  INVALID_TOKEN: 'Invalid token',
  TOKEN_EXPIRED: 'Token has expired',
  NO_TOKEN: 'No token provided',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  ADMIN_REQUIRED: 'Admin role required',

  // Resource errors
  INVALID_ID: 'Invalid ID format',
  NOT_FOUND: 'Resource not found',
  ALREADY_EXISTS: 'Resource already exists',
  VALIDATION_ERROR: 'Validation error',
  DUPLICATE_KEY: 'Duplicate key error',

  // Server errors
  INTERNAL_ERROR: 'Internal server error',
  DB_ERROR: 'Database error',
  VALIDATION_FAILED: 'Validation failed'
};

export const ERROR_CODES = {
  // Client errors (4xx)
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,

  // Server errors (5xx)
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

export const ACHIEVEMENTS = {
  FIRST_GAME: {
    title: 'First Blood',
    description: 'Зіграйте першу гру',
  }
};