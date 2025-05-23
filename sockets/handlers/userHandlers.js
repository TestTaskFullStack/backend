import { socketCatchAsync } from '../../utils/errors.js';
import { SOCKET_EVENTS, ACHIEVEMENTS } from '../../config/constants.js';
import { userService } from '../../services/user.service.js';
import db from '../../models/index.js';

const Achievement = db.Achievement;
export const registerUserHandlers = (io, socket) => {
  const handleStartGame = socketCatchAsync(socket, SOCKET_EVENTS.USER_STARTED_GAME_RESPONSE)(
    async ({ gameId }) => {
      if (!socket.user) {
        throw new Error('Unauthorized: User not authenticated');
      }

      const { user, game } = await userService.startGame(socket.user._id, gameId);
      

      socket.emit(SOCKET_EVENTS.USER_STARTED_GAME_RESPONSE, {
        success: true,
        message: "Гра запущена" 
      });

       
      if (user.startedGames.length === 1) {
        const achievement = await Achievement.findById("67ea7ff631454d19bf12e7ef");
        socket.emit(SOCKET_EVENTS.USER_ACHIEVEMENT, {
          success: true,
          message: `Досягнення ${achievement.title} отримано`,
          description: achievement.description
        });
      }
    }
  );

  const handleGetAchievements = socketCatchAsync(socket, SOCKET_EVENTS.USER_ACHIEVEMENTS_RESPONSE)(
    async () => {
      if (!socket.user) {
        throw new Error('Unauthorized: User not authenticated');
      }

      const achievements = await userService.getAchievements(socket.user._id);

      socket.emit(SOCKET_EVENTS.USER_ACHIEVEMENTS_RESPONSE, {
        success: true,
        data: achievements
      });
    }
  );

  socket.on(SOCKET_EVENTS.USER_STARTED_GAME, handleStartGame);
  socket.on(SOCKET_EVENTS.USER_GET_ACHIEVEMENTS, handleGetAchievements);
}; 