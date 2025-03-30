import { socketCatchAsync } from '../../utils/errors.js';
import { SOCKET_EVENTS, ACHIEVEMENTS } from '../../config/constants.js';
import { userService } from '../../services/user.service.js';

export const registerUserHandlers = (io, socket) => {
  const handleStartGame = socketCatchAsync(socket, SOCKET_EVENTS.USER_STARTED_GAME_RESPONSE)(
    async ({ gameId }) => {
      if (!socket.user) {
        throw new Error('Unauthorized: User not authenticated');
      }

      const { user, game } = await userService.startGame(socket.user._id, gameId);

      socket.emit(SOCKET_EVENTS.USER_STARTED_GAME_RESPONSE, {
        success: true,
        data: { game }
      });

      // Отправляем уведомление во все вкладки пользователя
      const userSockets = await io.fetchSockets();
      userSockets
        .filter(s => s.user?._id.toString() === socket.user._id.toString())
        .forEach(s => {
          if (s.id !== socket.id) {
            s.emit(SOCKET_EVENTS.USER_STARTED_GAME_RESPONSE, {
              success: true,
              data: { game }
            });
          }
        });

      // Проверяем достижение за первую игру
      if (user.startedGames.length === 1) {
        const achievement = ACHIEVEMENTS.FIRST_GAME;
        userSockets
          .filter(s => s.user?._id.toString() === socket.user._id.toString())
          .forEach(s => {
            s.emit(SOCKET_EVENTS.USER_ACHIEVEMENT, {
              success: true,
              data: achievement
            });
          });
      }
    }
  );

  const handleGetStartedGames = socketCatchAsync(socket, SOCKET_EVENTS.USER_STARTED_GAMES_RESPONSE)(
    async () => {
      if (!socket.user) {
        throw new Error('Unauthorized: User not authenticated');
      }

      const games = await userService.getStartedGames(socket.user._id);

      socket.emit(SOCKET_EVENTS.USER_STARTED_GAMES_RESPONSE, {
        success: true,
        data: games
      });
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
  socket.on(SOCKET_EVENTS.USER_GET_STARTED_GAMES, handleGetStartedGames);
  socket.on(SOCKET_EVENTS.USER_GET_ACHIEVEMENTS, handleGetAchievements);
}; 