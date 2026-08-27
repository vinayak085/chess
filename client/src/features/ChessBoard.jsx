import { Chessboard } from "react-chessboard";

import { useChessGame } from "../hooks/useChessGame";

import PromotionModal from "../ui/PromotionModal";
import GameControls from "../ui/GameControls";
import GameOverModal from "../ui/GameOverModal";


function ChessBoard({
  gameData,
  onGoToLobby,
}) {

  const {
    position,
    status,
    gameOver,
    promotion,
    gameEndReason,

    onPieceDrop,
    promotePiece,
    undoMove,

    playAgain,
    goToLobby: leaveGame,
    resignGame,

  } = useChessGame(gameData);


  // ==========================================
  // GO TO LOBBY
  // ==========================================

  function handleGoToLobby() {

    console.log(
      "🏠 Leaving game and returning to lobby..."
    );

    leaveGame();

    onGoToLobby();

  }


  // ==========================================
  // RESIGN
  // ==========================================

  function handleResign() {

    if (gameOver) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to resign this game?"
    );

    if (!confirmed) {

      console.log(
        "❌ Resignation cancelled"
      );

      return;
    }

    console.log(
      "🏳️ Player confirmed resignation"
    );

    resignGame();

  }


  // ==========================================
  // CHESSBOARD OPTIONS
  // ==========================================

  const chessboardOptions = {

    position,

    onPieceDrop,

    boardOrientation:
      gameData.color === "b"
        ? "black"
        : "white",

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

      {/* HEADER */}

      <div className="
        mb-5
        text-center
      ">

        <h1 className="
          text-3xl
          font-bold
          text-white
          md:text-4xl
        ">
          Chess Game
        </h1>

        <p className="
          mt-2
          text-lg
          font-semibold
          text-gray-300
        ">
          {status}
        </p>

      </div>


      {/* BOARD */}

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


      {/* CONTROLS */}

      <GameControls

        onUndo={undoMove}

        onRestart={handleGoToLobby}

        onResign={handleResign}

      />


      {/* PROMOTION */}

      <PromotionModal

        promotion={promotion}

        onSelect={promotePiece}

      />


      {/* GAME OVER */}

      {gameOver && (

        <GameOverModal

          status={status}

          gameEndReason={gameEndReason}

          onPlayAgain={playAgain}

          onGoToLobby={handleGoToLobby}

        />

      )}

    </div>

  );

}


export default ChessBoard;