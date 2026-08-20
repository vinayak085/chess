import { getGame } from "../chess/gameManager.js";

export function registerRematchHandler(io, socket) {

  socket.on("rematch", ({ gameId }) => {

    const game = getGame(gameId);

    if (!game) {
      console.log("Game not found:", gameId);
      return;
    }


    console.log(
      "REMATCH REQUEST:",
      gameId,
      socket.id
    );


    /*
    ==========================================
    MAKE SURE PLAYER BELONGS TO GAME
    ==========================================
    */

    const isPlayer =
      game.players.white?.id === socket.id ||
      game.players.black?.id === socket.id;


    if (!isPlayer) {

      console.log(
        "Unauthorized rematch request:",
        socket.id
      );

      return;
    }


    /*
    ==========================================
    CREATE REMATCH REQUEST SET
    ==========================================
    */

    game.rematchRequests ??= new Set();


    /*
    ==========================================
    ADD PLAYER REQUEST
    ==========================================
    */

    game.rematchRequests.add(
      socket.id
    );


    console.log(
      `Rematch requests: ${game.rematchRequests.size}/2`
    );


    /*
    ==========================================
    WAIT FOR BOTH PLAYERS
    ==========================================
    */

    if (
      game.rematchRequests.size !== 2
    ) {

      /*
      Tell the player that we are
      waiting for the opponent.
      */

      socket.emit(
        "rematchWaiting",
        {
          gameId,
          message:
            "Waiting for opponent to accept rematch...",
        }
      );

      return;
    }


    /*
    ==========================================
    BOTH PLAYERS ACCEPTED
    ==========================================
    */

    console.log(
      "Both players accepted rematch:",
      gameId
    );


    /*
    Reset chess board
    */

    game.chess.reset();


    /*
    Clear rematch requests
    */

    game.rematchRequests.clear();


    /*
    ==========================================
    SEND NEW GAME TO BOTH PLAYERS
    ==========================================
    */

    io.to(gameId).emit(
      "rematchStarted",
      {
        gameId,

        position:
          game.chess.fen(),

        turn:
          game.chess.turn(),

        players:
          game.players,
      }
    );

  });

}