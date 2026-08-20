import { useEffect, useCallback } from "react";
import { socket } from "../services/socket";

export function useChessMultiplayer({
  chess,
  gameData,
  setPosition,
  setStatus,
  setGameOver,
  setPromotion,
  updateStatus,
}) {

  /*
  ==========================================
  RECEIVE MOVE FROM SERVER
  ==========================================
  */

  useEffect(() => {

    function handleMoveMade(data) {

      console.log(
        "MOVE RECEIVED:",
        data
      );


      try {

        chess.load(
          data.position
        );


        setPosition(
          data.position
        );


        setPromotion(null);


        /*
         * Let status hook calculate
         * check/checkmate/draw.
         */
        updateStatus();

      } catch (error) {

        console.error(
          "Failed to update position:",
          error
        );

      }

    }


    socket.on(
      "moveMade",
      handleMoveMade
    );


    return () => {

      socket.off(
        "moveMade",
        handleMoveMade
      );

    };

  }, [
    chess,
    setPosition,
    setPromotion,
    updateStatus,
  ]);


  /*
  ==========================================
  REMATCH
  ==========================================
  */

  useEffect(() => {

    function handleRematchStarted(data) {

      console.log(
        "REMATCH STARTED:",
        data
      );


      try {

        chess.load(
          data.position
        );


        setPosition(
          data.position
        );


        setPromotion(null);


        setGameOver(false);


        setStatus(
          "White's turn"
        );

      } catch (error) {

        console.error(
          "REMATCH ERROR:",
          error
        );

      }

    }


    socket.on(
      "rematchStarted",
      handleRematchStarted
    );


    return () => {

      socket.off(
        "rematchStarted",
        handleRematchStarted
      );

    };

  }, [
    chess,
    setPosition,
    setPromotion,
    setGameOver,
    setStatus,
  ]);


  /*
  ==========================================
  PLAY AGAIN
  ==========================================
  */

  const playAgain = useCallback(() => {

    socket.emit(
      "rematch",
      {
        gameId:
          gameData.gameId,
      }
    );

  }, [gameData.gameId]);


  /*
  ==========================================
  GO TO LOBBY
  ==========================================
  */

  const goToLobby = useCallback(() => {

    socket.emit(
      "leaveGame",
      {
        gameId:
          gameData.gameId,
      }
    );

  }, [gameData.gameId]);


  return {
    playAgain,
    goToLobby,
  };
}