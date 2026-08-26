import { getGame } from "../chess/gameManager.js";

export function registerResignHandler(io, socket) {

  socket.on(
    "resignGame",
    ({ gameId }, callback) => {

      console.log(
        "RESIGN REQUEST RECEIVED:",
        gameId,
        socket.id
      );


      // ==========================================
      // FIND GAME
      // ==========================================

      const game = getGame(gameId);


      if (!game) {

        console.log(
          "RESIGN ERROR: Game not found"
        );

        callback?.({
          success: false,
          message: "Game not found",
        });

        return;
      }


      // ==========================================
      // FIND PLAYER
      // ==========================================

      let resignedColor = null;
      let resignedPlayerName = null;


      if (
        game.players.white?.id ===
        socket.id
      ) {

        resignedColor = "w";

        resignedPlayerName =
          game.players.white.name;
      }


      if (
        game.players.black?.id ===
        socket.id
      ) {

        resignedColor = "b";

        resignedPlayerName =
          game.players.black.name;
      }


      // ==========================================
      // PLAYER NOT FOUND
      // ==========================================

      if (!resignedColor) {

        console.log(
          "RESIGN ERROR: Player not found in game"
        );

        callback?.({
          success: false,
          message:
            "You are not a player in this game",
        });

        return;
      }


      // ==========================================
      // GAME ALREADY ENDED
      // ==========================================

      if (
        game.chess.isGameOver() ||
        game.resigned
      ) {

        callback?.({
          success: false,
          message:
            "Game has already ended",
        });

        return;
      }


      // ==========================================
      // MARK GAME AS RESIGNED
      // ==========================================

      game.resigned = true;

      game.resignedColor =
        resignedColor;


      // ==========================================
      // FIND WINNER
      // ==========================================

      const winnerColor =
        resignedColor === "w"
          ? "b"
          : "w";


      const winner =
        winnerColor === "w"
          ? game.players.white
          : game.players.black;


      console.log(
        `${resignedPlayerName} resigned`
      );


      // ==========================================
      // SEND RESULT TO BOTH PLAYERS
      // ==========================================

      io.to(gameId).emit(
        "gameResigned",
        {

          gameId,

          resignedColor,

          resignedPlayerName,

          winnerColor,

          winnerPlayerName:
            winner?.name,

        }
      );


      // ==========================================
      // RESPONSE TO RESIGNING PLAYER
      // ==========================================

      callback?.({
        success: true,
      });

    }
  );
}