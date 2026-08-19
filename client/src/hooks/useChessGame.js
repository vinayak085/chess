import { useEffect,useState } from "react";
import { socket } from "../services/socket";
import { createGame } from "../features/rules";
import { isPawnPromotion } from "../utils/chessUtils";

export function useChessGame() {
  const [game] = useState(() => createGame());

  const [position, setPosition] = useState(() => game.fen());

  const [status, setStatus] = useState("White's turn");

  const [gameOver, setGameOver] = useState(false);

  const [promotion, setPromotion] = useState(null);


  // ==========================================
  // UPDATE GAME STATUS
  // ==========================================

  function updateGameState() {
    setPosition(game.fen());

    // Checkmate
    if (game.isCheckmate()) {
      const winner =
        game.turn() === "w"
          ? "Black"
          : "White";

      setStatus(`Checkmate! ${winner} wins!`);
      setGameOver(true);

      return;
    }

    // Stalemate
    if (game.isStalemate()) {
      setStatus("Stalemate! Draw!");
      setGameOver(true);

      return;
    }

    // Threefold repetition
    if (game.isThreefoldRepetition()) {
      setStatus("Draw by threefold repetition!");
      setGameOver(true);

      return;
    }

    // Insufficient material
    if (game.isInsufficientMaterial()) {
      setStatus("Draw by insufficient material!");
      setGameOver(true);

      return;
    }

    // Other draw
    if (game.isDraw()) {
      setStatus("Draw!");
      setGameOver(true);

      return;
    }

    // Check
    if (game.inCheck()) {
      const player =
        game.turn() === "w"
          ? "White"
          : "Black";

      setStatus(`${player} is in check!`);
      setGameOver(false);

      return;
    }

    // Normal turn
    const player =
      game.turn() === "w"
        ? "White"
        : "Black";

    setStatus(`${player}'s turn`);
    setGameOver(false);
  }


  // ==========================================
  // PIECE DROP
  // ==========================================

  function onPieceDrop({ sourceSquare, targetSquare }) {
    if (!targetSquare) {
      return false;
    }

    if (game.isGameOver()) {
      return false;
    }

    const piece = game.get(sourceSquare);

    if (!piece) {
      return false;
    }


    // Check promotion
    if (
      isPawnPromotion(piece, targetSquare)
    ) {
      const legalMoves = game.moves({
        square: sourceSquare,
        verbose: true,
      });

      const legalMove = legalMoves.some(
        (move) => move.to === targetSquare
      );

      if (!legalMove) {
        return false;
      }

      // Don't make move yet.
      // Wait for promotion choice.
      setPromotion({
        from: sourceSquare,
        to: targetSquare,
        color: piece.color,
      });

      return false;
    }


    // Normal move
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
      });

      if (!move) {
        return false;
      }

      updateGameState();

      return true;

    } catch (error) {
      console.log("Illegal move:", error);

      return false;
    }
  }


  // ==========================================
  // PROMOTION
  // ==========================================

  function promotePiece(pieceType) {
    if (!promotion) {
      return;
    }

    try {
      game.move({
        from: promotion.from,
        to: promotion.to,
        promotion: pieceType,
      });

      setPromotion(null);

      updateGameState();

    } catch (error) {
      console.error("Promotion error:", error);
    }
  }


  // ==========================================
  // UNDO
  // ==========================================

  function undoMove() {
    if (promotion) {
      setPromotion(null);
      return;
    }

    const move = game.undo();

    if (!move) {
      return;
    }

    setPosition(game.fen());
    setGameOver(false);

    const player =
      game.turn() === "w"
        ? "White"
        : "Black";

    setStatus(`${player}'s turn`);
  }


  // ==========================================
  // RESTART
  // ==========================================

  function restartGame() {
    game.reset();

    setPosition(game.fen());
    setStatus("White's turn");
    setGameOver(false);
    setPromotion(null);
  }


  // ==========================================
  // RETURN DATA TO COMPONENT
  // ==========================================

  return {
    position,
    status,
    gameOver,
    promotion,

    onPieceDrop,
    promotePiece,
    undoMove,
    restartGame,
  };
}