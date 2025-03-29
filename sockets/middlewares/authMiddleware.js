import jwt from 'jsonwebtoken';
import db from '../../models/index.js';
import config from '../../config/auth.config.js';
const User = db.User;

export const verifySocketToken = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || 
                  socket.handshake.headers.authorization?.split(' ')[1] || 
                  socket.handshake.query.token;
    
    if (!token) {
      socket.auth = { authenticated: false };
      return next();
    }

    const decoded = jwt.verify(token, config.secret);
    
    const user = await User.findById(decoded.id).populate('roles');
    
    if (!user) {
      socket.auth = { authenticated: false, error: 'User not found' };
      return next();
    }
    
    socket.user = user;
    socket.auth = { authenticated: true };
    socket.roles = user.roles.map(role => role.name);
    
    console.log(`Authenticated user connected: ${user.username}, roles: ${socket.roles.join(', ')}`);
    
    return next();
  } catch (error) {
    console.error('Socket authentication error:', error);
    socket.auth = { authenticated: false, error: error.message };
    return next();
  }
};

export const requireAuth = (socket, callback, errorCallback) => {
  if (!socket.auth || !socket.auth.authenticated) {
    console.log('Unauthorized socket access attempt');
    return errorCallback({ 
      success: false, 
      error: 'Authentication required', 
      code: 401 
    });
  }
  return callback();
};

export const requireAdmin = (socket, callback, errorCallback) => {
  if (!socket.auth || !socket.auth.authenticated) {
    console.log('Unauthorized socket access attempt');
    return errorCallback({ 
      success: false, 
      error: 'Authentication required', 
      code: 401 
    });
  }
  
  if (!socket.roles.includes('admin')) {
    console.log('Non-admin tried to access admin-only feature');
    return errorCallback({ 
      success: false, 
      error: 'Admin role required', 
      code: 403 
    });
  }
  
  return callback();
}; 