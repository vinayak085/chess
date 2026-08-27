import {
  useEffect,
  useCallback,
} from "react";

import { socket } from "../services/socket";
import { useGameSounds } from "./useGameSounds";


export function useChessMultiplayer({

  chess,
  gameData,

  setPosition,
  setStatus,
  setGameOver,
  setPromotion,
  setGameEndReason,

}) {

  // ==========================================
  // MOVE SOUND
  // ==========================================

  const {
    playMoveSound,
  } = useGameSounds();


  // ==========================================
  // UPDATE STATUS
  // ==========================================

  const updateStatusFromChess =
    useCallback(() => {

      // CHECKMATE
      if (chess.isCheckmate()) {

        const winner =
          chess.turn() === "w"
            ? "Black"
            : "White";

        setStatus(
          `Checkmate! ${winner} wins!`
        );

        setGameOver(true);

        return;
      }


      // STALEMATE
      if (chess.isStalemate()) {

        setStatus(
          "Stalemate! Draw!"
        );

        setGameOver(true);

        return;
      }


      // THREEFOLD REPETITION
      if (
        chess.isThreefoldRepetition()
      ) {

        setStatus(
          "Draw by threefold repetition!"
        );

        setGameOver(true);

        return;
      }


      // INSUFFICIENT MATERIAL
      if (
        chess.isInsufficientMaterial()
      ) {

        setStatus(
          "Draw by insufficient material!"
        );

        setGameOver(true);

        return;
      }


      // OTHER DRAW
      if (chess.isDraw()) {

        setStatus(
          "Draw!"
        );

        setGameOver(true);

        return;
      }


      // CHECK
      if (chess.inCheck()) {

        const player =
          chess.turn() === "w"
            ? "White"
            : "Black";

        setStatus(
          `${player} is in check`
        );

        setGameOver(false);

        return;
      }


      // NORMAL TURN
      const player =
        chess.turn() === "w"
          ? "White"
          : "Black";

      setStatus(
        `${player}'s turn`
      );

      setGameOver(false);

    }, [
      chess,
      setStatus,
      setGameOver,
    ]);


  // ==========================================
  // RECEIVE MOVE FROM SERVER
  // ==========================================

  useEffect(() => {

    function handleMoveMade(data) {

      console.log(
        "MOVE RECEIVED FROM SERVER:",
        data
      );


      try {

        // ======================================
        // LOAD SERVER POSITION
        // ======================================

        chess.load(
          data.position
        );


        // ======================================
        // UPDATE BOARD
        // ======================================

        setPosition(
          data.position
        );


        // ======================================
        // PLAY MOVE SOUND
        // ======================================

        playMoveSound();


        // ======================================
        // UPDATE STATUS
        // ======================================

        updateStatusFromChess();

      }
      catch (error) {

        console.error(
          "FAILED TO LOAD SERVER POSITION:",
          error
        );

      }

    }


    // ==========================================
    // REGISTER SOCKET LISTENER
    // ==========================================

    socket.on(
      "moveMade",
      handleMoveMade
    );


    // ==========================================
    // CLEANUP
    // ==========================================

    return () => {

      socket.off(
        "moveMade",
        handleMoveMade
      );

    };

  }, [
    chess,
    setPosition,
    playMoveSound,
    updateStatusFromChess,
  ]);


  // ==========================================
  // REMATCH
  // ==========================================

  function playAgain() {

    console.log(
      "REQUESTING REMATCH"
    );


    socket.emit(
      "rematch",
      {
        gameId:
          gameData.gameId,
      }
    );

  }


  // ==========================================
  // GO TO LOBBY
  // ==========================================

  function goToLobby() {

    console.log(
      "LEAVING GAME"
    );


    socket.emit(
      "leaveGame",
      {
        gameId:
          gameData.gameId,
      }
    );

  }


  // ==========================================
  // RESIGN
  // ==========================================

  function resignGame() {

    console.log(
      "RESIGNING GAME"
    );

    console.log(
      "GAME ID:",
      gameData.gameId
    );


    socket.emit(
      "resignGame",
      {
        gameId:
          gameData.gameId,
      },
      (response) => {

        console.log(
          "RESIGN RESPONSE FROM SERVER:",
          response
        );


        if (!response?.success) {

          console.error(
            "RESIGN FAILED:",
            response?.message
          );

        }

      }
    );

  }


  // ==========================================
  // RECEIVE RESIGNATION
  // ==========================================

  useEffect(() => {

    function handleGameResigned(data) {

      console.log(
        "GAME RESIGNED:",
        data
      );


      // Game ended
      setGameOver(true);


      // Close promotion modal
      setPromotion(null);


      // Tell UI why game ended
      setGameEndReason(
        "resignation"
      );


      // ======================================
      // PLAYER WHO RESIGNED
      // ======================================

      if (
        data.resignedColor ===
        gameData.color
      ) {

        setStatus(
          `You resigned. ${data.winnerPlayerName} wins!`
        );

      }

      // ======================================
      // OTHER PLAYER
      // ======================================

      else {

        setStatus(
          `${data.resignedPlayerName} resigned. You win!`
        );

      }

    }


    socket.on(
      "gameResigned",
      handleGameResigned
    );


    return () => {

      socket.off(
        "gameResigned",
        handleGameResigned
      );

    };

  }, [
    gameData.color,
    setGameOver,
    setPromotion,
    setGameEndReason,
    setStatus,
  ]);


  // ==========================================
  // REMATCH STARTED
  // ==========================================

  useEffect(() => {

    function handleRematchStarted(data) {

      console.log(
        "REMATCH STARTED:",
        data
      );


      try {

        // Load new position
        chess.load(
          data.position
        );


        // Update board
        setPosition(
          data.position
        );


        // Close promotion
        setPromotion(
          null
        );


        // Game is active again
        setGameOver(
          false
        );


        // Clear game-end reason
        setGameEndReason(
          null
        );


        // Reset status
        setStatus(
          "White's turn"
        );

      }
      catch (error) {

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
    setGameEndReason,
    setStatus,
  ]);


  // ==========================================
  // RETURN
  // ==========================================

  return {

    playAgain,
    goToLobby,
    resignGame,

  };

}