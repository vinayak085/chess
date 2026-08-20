function GameOverModal({
  status,
  onPlayAgain,
  onGoToLobby,
}) {

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
        rounded-3xl
        bg-gray-900
        p-8
        text-center
        shadow-2xl
      ">

        <h2 className="
          text-3xl
          font-bold
          text-white
        ">
          Game Over
        </h2>


        <p className="
          mt-4
          text-xl
          font-semibold
          text-yellow-400
        ">
          {status}
        </p>


        <div className="
          mt-8
          flex
          flex-col
          gap-3
          sm:flex-row
        ">

          <button
            onClick={onPlayAgain}
            className="
              flex-1
              rounded-xl
              bg-yellow-500
              px-5
              py-3
              font-bold
              text-black
              hover:bg-yellow-400
            "
          >
            Play Again
          </button>


          <button
            onClick={onGoToLobby}
            className="
              flex-1
              rounded-xl
              bg-gray-700
              px-5
              py-3
              font-bold
              text-white
              hover:bg-gray-600
            "
          >
            Go to Lobby
          </button>

        </div>

      </div>

    </div>

  );
}


export default GameOverModal;