import { getGame } from "../chess/gameManager.js";


export function registerReconnectHandler(io, socket) {

  socket.on(
    "reconnectGame",
    (
      {
        gameId,
        playerName,
      },
      callback
    ) => {

      console.log("================================");
      console.log("RECONNECT REQUEST");
      console.log("Game ID:", gameId);
      console.log("Player:", playerName);
      console.log("New socket:", socket.id);


      // ==========================================
      // FIND GAME
      // ==========================================

      const game = getGame(gameId);


      if (!game) {

        callback?.({
          success: false,
          message: "Game not found",
        });

        return;
      }


      // ==========================================
      // FIND PLAYER
      // ==========================================

      let playerColor = null;


      if (
        game.players.white?.name === playerName
      ) {

        playerColor = "w";

      }
      else if (
        game.players.black?.name === playerName
      ) {

        playerColor = "b";

      }


      // ==========================================
      // PLAYER NOT FOUND
      // ==========================================

      if (!playerColor) {

        console.log(
          "PLAYER NOT FOUND IN GAME"
        );

        callback?.({
          success: false,
          message:
            "Player is not part of this game",
        });

        return;
      }


      // ==========================================
      // UPDATE PLAYER SOCKET ID
      // ==========================================

      if (playerColor === "w") {

        game.players.white.id =
          socket.id;

      }

      else {

        game.players.black.id =
          socket.id;

      }


      // ==========================================
      // JOIN GAME ROOM
      // ==========================================

      socket.join(gameId);


      // ==========================================
      // GET CURRENT SERVER STATE
      // ==========================================

      const position =
        game.chess.fen();

      const turn =
        game.chess.turn();


      console.log(
        "PLAYER COLOR:",
        playerColor
      );

      console.log(
        "CURRENT TURN:",
        turn
      );

      console.log(
        "CURRENT POSITION:",
        position
      );


      // ==========================================
      // SEND RESTORED GAME
      // ==========================================

      callback?.({

        success: true,

        gameId,

        color:
          playerColor,

        playerName,

        position,

        turn,

        players:
          game.players,

      });


      console.log(
        "RECONNECT SUCCESS"
      );

      console.log("================================");

    }
  );

}