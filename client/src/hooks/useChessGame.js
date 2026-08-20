import {
  useRef,
  useState,
  useCallback,
} from "react";

import { Chess } from "chess.js";

import { useChessStatus } from "./useChessStatus";
import { useChessMoves } from "./useChessMoves";
import { useChessPromotion } from "./useChessPromotion";
import { useChessMultiplayer } from "./useChessMultiplayer";


export function useChessGame(gameData) {

  /*
  ==========================================
  CHESS INSTANCE
  ==========================================
  */

  const chessRef = useRef(
    new Chess(gameData.position)
  );

  const chess = chessRef.current;


  /*
  ==========================================
  STATE
  ==========================================
  */

  const [position, setPosition] =
    useState(gameData.position);

  const [status, setStatus] =
    useState(
      gameData.turn === "w"
        ? "White's turn"
        : "Black's turn"
    );

  const [gameOver, setGameOver] =
    useState(false);

  const [promotion, setPromotion] =
    useState(null);


  /*
  ==========================================
  STATUS
  ==========================================
  */

  const {
    getGameStatus,
  } = useChessStatus(chess);


  /*
  ==========================================
  UPDATE STATUS
  ==========================================
  */

  const updateStatus = useCallback(() => {

    const result =
      getGameStatus();


    setStatus(
      result.status
    );


    setGameOver(
      result.gameOver
    );

  }, [getGameStatus]);


  /*
  ==========================================
  MOVES
  ==========================================
  */

  const {
    onPieceDrop,
  } = useChessMoves({

    chess,

    gameData,

    gameOver,

    setPosition,

    updateStatus,

    setPromotion,

  });


  /*
  ==========================================
  PROMOTION
  ==========================================
  */

  const {
    promotePiece,
  } = useChessPromotion({

    chess,

    gameData,

    promotion,

    setPromotion,

    setPosition,

    updateStatus,

  });


  /*
  ==========================================
  MULTIPLAYER
  ==========================================
  */

  const {
    playAgain,
    goToLobby,
  } = useChessMultiplayer({

    chess,

    gameData,

    setPosition,

    setStatus,

    setGameOver,

    setPromotion,

    updateStatus,

  });


  /*
  ==========================================
  UNDO
  ==========================================
  */

  function undoMove() {

    console.log(
      "UNDO is currently disabled for multiplayer."
    );

  }


  /*
  ==========================================
  RETURN
  ==========================================
  */

  return {

    position,

    status,

    gameOver,

    promotion,

    onPieceDrop,

    promotePiece,

    undoMove,

    playAgain,

    goToLobby,

  };
}