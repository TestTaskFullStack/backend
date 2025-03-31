import { Server } from 'socket.io';
import { verifySocketToken } from './middlewares/authMiddleware.js';
import { registerGameHandlers } from './handlers/gameHandlers.js';
import { registerUserHandlers } from './handlers/userHandlers.js';
import { SOCKET_EVENTS } from '../config/constants.js';

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
  });
  console.log('Socket.io server created');
  io.use(verifySocketToken);


  io.on('connection', async (socket) => {
    const authStatus = socket.auth?.authenticated
      ? `Authenticated: ${socket.user.username}`
      : 'Not authenticated';

    console.log(`SOCKET.IO: New connection established: ${socket.id} (${authStatus})`);

    socket.emit('welcome', {
      message: 'Connected successfully!',
      authenticated: socket.auth?.authenticated || false,
    });
    const sockets = await io.fetchSockets()
  


    io.emit(SOCKET_EVENTS.USERS_ONLINE, {
      count: sockets.length
    });

    registerGameHandlers(io, socket);
    registerUserHandlers(io, socket);


    socket.on('error', (err) => {
      console.error('SOCKET ERROR:', err);
    });

    socket.on('disconnect', async (reason) => {
      console.log(`SOCKET.IO: Client disconnected. Reason: ${reason}`, socket.id);
      const sockets = await io.fetchSockets()
      io.emit(SOCKET_EVENTS.USERS_ONLINE, {
        count: sockets.length
      });
  
    });

  });

  return io;
} 