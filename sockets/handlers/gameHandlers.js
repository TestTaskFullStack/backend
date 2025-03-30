import { gameService } from '../../services/game.service.js';
import { commentService } from '../../services/comment.service.js';
import { socketCatchAsync } from '../../utils/errors.js';
import { SOCKET_EVENTS } from '../../config/constants.js';


export const registerGameHandlers = (io, socket) => {
 

  const handleGameCreate = socketCatchAsync(socket, SOCKET_EVENTS.GAME_CREATED)(
    async (gameData) => {
      if (!socket.user?.roles.includes('admin')) {
        throw new Error('Unauthorized: Admin access required');
      }

      const game = await gameService.create(gameData);
      
      socket.emit(SOCKET_EVENTS.GAME_CREATED, {
        success: true,
        data: game
      });

      io.to('game:events').emit(SOCKET_EVENTS.GAME_CREATED, { game });
    }
  );
  
  const handleGameUpdate = socketCatchAsync(socket, SOCKET_EVENTS.GAME_UPDATED)(
    async ({ gameId, updateData }) => {
      if (!socket.user?.roles.includes('admin')) {
        throw new Error('Unauthorized: Admin access required');
      }

      const game = await gameService.update(gameId, updateData);
      
      socket.emit(SOCKET_EVENTS.GAME_UPDATED, {
        success: true,
        data: game
      });

      io.to('game:events').emit(SOCKET_EVENTS.GAME_UPDATED, { game });
    }
  );

  const handleGameDelete = socketCatchAsync(socket, SOCKET_EVENTS.GAME_DELETED)(
    async ({ gameId }) => {
      if (!socket.user?.roles.includes('admin')) {
        throw new Error('Unauthorized: Admin access required');
      }

      const game = await gameService.delete(gameId);
      
      socket.emit(SOCKET_EVENTS.GAME_DELETED, {
        success: true,
        data: game
      });

      io.to('game:events').emit(SOCKET_EVENTS.GAME_DELETED, { gameId });
    }
  );

  const handleGameComment = socketCatchAsync(socket, SOCKET_EVENTS.GAME_COMMENT_RESPONSE)(
    async ({ gameId, text }) => {
      if (!socket.user) {
        throw new Error('Unauthorized: User not authenticated');
      }

      const { game, comment } = await commentService.create({
        text,
        authorId: socket.user._id,
        gameId
      });

        socket.emit(SOCKET_EVENTS.GAME_COMMENT_RESPONSE, {
        success: true,
        data: comment
      });

      io.to('game:events').emit(SOCKET_EVENTS.GAME_COMMENTED, {
        gameId,
        comment
      });
    }
  );


  socket.on(SOCKET_EVENTS.GAME_CREATED, handleGameCreate);
  socket.on(SOCKET_EVENTS.GAME_UPDATED, handleGameUpdate);
  socket.on(SOCKET_EVENTS.GAME_DELETED, handleGameDelete);
  socket.on(SOCKET_EVENTS.GAME_COMMENT, handleGameComment);

  socket.on(SOCKET_EVENTS.GAME_SUBSCRIBE, () => {
    socket.join('game:events');
    socket.emit(SOCKET_EVENTS.GAME_SUBSCRIBED, { success: true });
  });

  socket.on(SOCKET_EVENTS.GAME_UNSUBSCRIBE, () => {
    socket.leave('game:events');
    socket.emit(SOCKET_EVENTS.GAME_UNSUBSCRIBED, { success: true });
  });


}; 