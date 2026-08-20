import {
  createGame,
  getGame,
} from "../chess/gameManager.js";


export function registerGameHandlers(io, socket) {

  // ==========================================
  // CREATE GAME
  // ==========================================

  socket.on(
    "createGame",
    ({ playerName }, callback) => {

      const gameId = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();


      const game = createGame(gameId);


      game.players.white = {
        id: socket.id,
        name: playerName,
      };


      socket.join(gameId);


      callback({
        success: true,
        gameId,
        color: "w",
        playerName,
      });


      console.log(
        `Game ${gameId} created by ${playerName}`
      );
    }
  );


  // ==========================================
  // JOIN GAME
  // ==========================================

  socket.on(
    "joinGame",
    ({ gameId, playerName }, callback) => {

      const game = getGame(gameId);


      if (!game) {

        callback({
          success: false,
          message: "Game not found",
        });

        return;
      }


      if (game.players.black) {

        callback({
          success: false,
          message: "Game is already full",
        });

        return;
      }


      game.players.black = {
        id: socket.id,
        name: playerName,
      };


      socket.join(gameId);


      callback({
        success: true,
        gameId,
        color: "b",
        playerName,
      });


      /*
      Tell both players
      that the game has started.
      */

      io.to(gameId).emit(
        "gameStarted",
        {
          gameId,

          players: {
            white:
              game.players.white,

            black:
              game.players.black,
          },

          position:
            game.chess.fen(),

          turn:
            game.chess.turn(),
        }
      );


      console.log(
        `Player ${playerName} joined game ${gameId}`
      );

    }
  );


  // ==========================================
  // MAKE MOVE
  // ==========================================

  socket.on(
    "makeMove",
    (
      {
        gameId,
        from,
        to,
        promotion,
      },
      callback
    ) => {

      const game = getGame(gameId);


      if (!game) {

        callback?.({
          success: false,
          message: "Game not found",
        });

        return;
      }


      /*
      ==========================================
      FIND PLAYER COLOR
      ==========================================
      */

      let playerColor = null;


      if (
        game.players.white?.id === socket.id
      ) {

        playerColor = "w";

      }


      if (
        game.players.black?.id === socket.id
      ) {

        playerColor = "b";

      }


      /*
      ==========================================
      PLAYER NOT IN GAME
      ==========================================
      */

      if (!playerColor) {

        callback?.({
          success: false,
          message:
            "You are not a player in this game",
        });

        return;
      }


      /*
      ==========================================
      CHECK TURN
      ==========================================
      */

      if (
        game.chess.turn() !== playerColor
      ) {

        callback?.({
          success: false,
          message: "It is not your turn",
        });

        return;
      }


      /*
      ==========================================
      MAKE MOVE
      ==========================================
      */

      try {

        const move =
          game.chess.move({
            from,
            to,
            promotion,
          });


        if (!move) {

          callback?.({
            success: false,
            message: "Illegal move",
          });

          return;
        }


        /*
        ==========================================
        GAME STATE
        ==========================================
        */

        const gameState = {

          gameId,

          move,

          position:
            game.chess.fen(),

          turn:
            game.chess.turn(),

          isCheck:
            game.chess.inCheck(),

          isCheckmate:
            game.chess.isCheckmate(),

          isDraw:
            game.chess.isDraw(),

        };


        /*
        ==========================================
        SEND TO BOTH PLAYERS
        ==========================================
        */

        io.to(gameId).emit(
          "moveMade",
          gameState
        );


        /*
        ==========================================
        SUCCESS
        ==========================================
        */

        callback?.({
          success: true,
        });


      } catch (error) {

        console.log(
          "MOVE ERROR:",
          error
        );


        callback?.({
          success: false,
          message: "Illegal move",
        });

      }

    }
  );

  // ==========================================
  // LEAVE GAME
  // ==========================================

socket.on(
  "leaveGame",
  ({ gameId }) => {

    const game = getGame(gameId);

    if (!game) {
      return;
    }


    console.log(
      `Player ${socket.id} leaving game ${gameId}`
    );


    // Remove player

    if (
      game.players.white?.id === socket.id
    ) {

      game.players.white = null;

    }


    if (
      game.players.black?.id === socket.id
    ) {

      game.players.black = null;

    }


    // Remove rematch request

    game.rematchRequests?.delete(
      socket.id
    );


    // Leave Socket.IO room

    socket.leave(gameId);


    // Tell remaining player

    socket.to(gameId).emit(
      "opponentLeft",
      {
        gameId,
      }
    );

  }
);

}