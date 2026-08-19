import { Chessboard } from "react-chessboard";

import { useChessGame } from "../hooks/useChessGame"

import PromotionModal from "../ui/PromotionModal"
import GameControls from "../ui/GameControls";


function ChessBoard() {

  const {
    position,
    status,
    gameOver,
    promotion,

    onPieceDrop,
    promotePiece,
    undoMove,
    restartGame,

  } = useChessGame();


  const chessboardOptions = {
    position,
    onPieceDrop,
  };


  return (
    <div className="
      relative
      flex
      min-h-screen
      flex-col
      items-center
      justify-center
      bg-gradient-to-br
      from-gray-900
      to-black
      p-4
    ">

      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-5 text-center">

        <h1 className="
          text-3xl
          font-bold
          text-white
          md:text-4xl
        ">
          Chess Game
        </h1>

        <p
          className={`
            mt-2
            text-lg
            font-semibold
            ${
              gameOver
                ? "text-yellow-400"
                : "text-gray-300"
            }
          `}
        >
          {status}
        </p>

      </div>


      {/* =========================
          CHESS BOARD
      ========================= */}

      <div className="
        w-full
        max-w-[35rem]
        rounded-2xl
        bg-yellow-900
        p-4
        shadow-2xl
      ">

        <Chessboard
          options={chessboardOptions}
        />

      </div>


      {/* =========================
          CONTROLS
      ========================= */}

      <GameControls
        onUndo={undoMove}
        onRestart={restartGame}
      />


      {/* =========================
          GAME OVER
      ========================= */}

      {gameOver && (

        <button
          onClick={restartGame}
          className="
            mt-5
            rounded-xl
            bg-yellow-500
            px-6
            py-3
            font-bold
            text-black
            transition
            hover:bg-yellow-400
          "
        >
          Play Again
        </button>

      )}


      {/* =========================
          PROMOTION
      ========================= */}

      <PromotionModal
        promotion={promotion}
        onSelect={promotePiece}
      />

    </div>
  );
}

export default ChessBoard;