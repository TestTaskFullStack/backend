import db from '../../models/index.js';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js';

const Game = db.Game;
const Genre = db.Genre;

export const registerGameHandlers = (io, socket) => {


  socket.on('game:subscribe', () => {
    socket.join('game:events');
    socket.emit('game:subscribed', { success: true });
  });

  socket.on('game:unsubscribe', () => {
    socket.leave('game:events');
    socket.emit('game:unsubscribed', { success: true });
  });

  socket.on('game:create', async (gameData) => {
    console.log()
    try {
      if (!socket.user || socket.user.roles[0].name !== 'admin') {
        socket.emit('game:create_response', {
          success: false,
          error: 'Unauthorized: Admin access required'
        });
        return;
      }

      const game = new Game(gameData);
      await game.save();

      socket.emit('game:create_response', {
        success: true,
        message: "🕹️ Нова гра додана"
      });


      io.to('game:events').emit('game:created', {
        success: true,
        message: '🕹️ Хороші новини! Нова гра вже доступна для вас. Грайте просто зараз!'
      });


      
    } catch (error) {
      console.error('Error creating game:', error);
      socket.emit('game:create_response', {
        success: false,
        error: error.message
      });
    }
  });

  socket.on('game:update', async ({ gameId, updateData }) => {
    try {
      if (!socket.user || !socket.user.roles.includes('admin')) {
        socket.emit('game:update_response', {
          success: false,
          error: 'Unauthorized: Admin access required'
        });
        return;
      }

      const game = await Game.findByIdAndUpdate(
        gameId,
        { $set: updateData },
        { new: true }
      ).populate('genre');

      if (!game) {
        socket.emit('game:update_response', {
          success: false,
          error: 'Game not found'
        });
        return;
      }

      socket.emit('game:update_response', {
        success: true,
        data: game
      });

      io.to('game:events').emit('game:updated', { game });
    } catch (error) {
      console.error('Error updating game:', error);
      socket.emit('game:update_response', {
        success: false,
        error: error.message
      });
    }
  });

  socket.on('game:delete', async ({ gameId }) => {

    try {
      if (!socket.user || !socket.user.roles.includes('admin')) {
        socket.emit('game:delete_response', {
          success: false,
          error: 'Unauthorized: Admin access required'
        });
        return;
      }

      const game = await Game.findByIdAndDelete(gameId);

      if (!game) {
        socket.emit('game:delete_response', {
          success: false,
          error: 'Game not found'
        });
        return;
      }

      socket.emit('game:delete_response', {
        success: true,
        data: game
      });

      io.to('game:events').emit('game:deleted', { gameId });
    } catch (error) {
      console.error('Error deleting game:', error);
      socket.emit('game:delete_response', {
        success: false,
        error: error.message
      });
    }
  });




}; 