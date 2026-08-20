import { useCallback } from "react";

export function useChessStatus(chess) {

  const getGameStatus = useCallback(() => {

    // CHECKMATE
    if (chess.isCheckmate()) {

      const winner =
        chess.turn() === "w"
          ? "Black"
          : "White";

      return {
        status: `Checkmate! ${winner} wins!`,
        gameOver: true,
      };
    }


    // STALEMATE
    if (chess.isStalemate()) {

      return {
        status: "Stalemate! Draw!",
        gameOver: true,
      };
    }


    // THREEFOLD REPETITION
    if (chess.isThreefoldRepetition()) {

      return {
        status: "Draw by threefold repetition!",
        gameOver: true,
      };
    }


    // INSUFFICIENT MATERIAL
    if (chess.isInsufficientMaterial()) {

      return {
        status: "Draw by insufficient material!",
        gameOver: true,
      };
    }


    // OTHER DRAW
    if (chess.isDraw()) {

      return {
        status: "Draw!",
        gameOver: true,
      };
    }


    // CHECK
    if (chess.inCheck()) {

      const player =
        chess.turn() === "w"
          ? "White"
          : "Black";

      return {
        status: `${player} is in check!`,
        gameOver: false,
      };
    }


    // NORMAL TURN
    const currentPlayer =
      chess.turn() === "w"
        ? "White"
        : "Black";

    return {
      status: `${currentPlayer}'s turn`,
      gameOver: false,
    };

  }, [chess]);


  return {
    getGameStatus,
  };
}