function GameOverModal({
  status,
  gameEndReason,
  onPlayAgain,
  onGoToLobby,
}) {

  const isResignation =
    gameEndReason === "resignation";

  return (
    <div className="
      fixed
      inset-0
      z-50
      flex
      items-center
      justify-center
      bg-black/70
      p-4
    ">

      <div className="
        w-full
        max-w-md
        rounded-2xl
        bg-gray-900
        p-8
        text-center
        shadow-2xl
      ">

        {/* TITLE */}

        <h2 className="
          text-3xl
          font-bold
          text-white
        ">
          Game Over
        </h2>


        {/* RESULT */}

        <p className="
          mt-4
          text-lg
          font-semibold
          text-yellow-400
        ">
          {status}
        </p>


        {/* BUTTONS */}

        <div className="
          mt-8
          flex
          flex-col
          gap-3
        ">

          {/* PLAY AGAIN */}

          {!isResignation && (
            <button
              onClick={onPlayAgain}
              className="
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
              🔄 Play Again
            </button>
          )}


          {/* GO TO LOBBY */}

          <button
            onClick={onGoToLobby}
            className="
              rounded-xl
              bg-gray-700
              px-6
              py-3
              font-semibold
              text-white
              transition
              hover:bg-gray-600
            "
          >
            🏠 Go to Lobby
          </button>

        </div>

      </div>

    </div>
  );
}

export default GameOverModal;