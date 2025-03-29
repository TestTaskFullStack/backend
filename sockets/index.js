import { Server } from 'socket.io';
import { verifySocketToken } from './middlewares/authMiddleware.js';
import { registerGameHandlers } from './handlers/gameHandlers.js';


let onlineUsers = 0


export default function initializeSocket(server) {
  console.log('Socket.io initialization started');

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true
    },
    transports: ['websocket'],
    allowEIO3: true,
    pingTimeout: 60000
  });
  
  console.log('Socket.io server created');
  
  
  io.use(verifySocketToken);
  
  io.on('connection', (socket) => {
    const authStatus = socket.auth?.authenticated 
      ? `Authenticated: ${socket.user.username}` 
      : 'Not authenticated';
      
    console.log(`SOCKET.IO: New connection established: ${socket.id} (${authStatus})`);
    
    socket.emit('welcome', { 
      message: 'Connected successfully!',
      authenticated: socket.auth?.authenticated || false,
    });
    
    if (socket.auth?.authenticated) {
      onlineUsers++
      io.emit('online:users', { count: onlineUsers });
    }
    
    registerGameHandlers(io, socket);
    
    socket.on('online:users', async () => {
      socket.emit('online:users_response', {
        count: onlineUsers
      });
    });


    socket.on('error', (err) => {
      console.error('SOCKET ERROR:', err);
    });
    
    socket.on('disconnect', (reason) => {
      if (socket.auth?.authenticated) {
        onlineUsers--
        io.emit('online:users', { count: onlineUsers });
      }
      console.log(`SOCKET.IO: Client disconnected. Reason: ${reason}`, socket.id);
    });
    
   
  });
  
  return io;
} 