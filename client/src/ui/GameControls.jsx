function GameControls({
  onUndo,
  onRestart,
  onResign,
}) {
  return (
    <div className="mt-6 flex gap-3">

      {/* <button
        onClick={onUndo}
        className="
          rounded-xl
          bg-gray-700
          px-5
          py-3
          font-semibold
          text-white
          transition
          hover:bg-gray-600
        "
      >
        ↩ Undo
      </button> */}

      {/* <button
        onClick={onRestart}
        className="
          rounded-xl
          bg-white
          px-5
          py-3
          font-semibold
          text-gray-900
          transition
          hover:bg-gray-200
        "
      >
        🔄 Restart
      </button> */}

      <button
        onClick={onResign}
        className="
          rounded-xl
          bg-red-600
          px-5
          py-3
          font-semibold
          text-white
          transition
          hover:bg-red-700
        "
      >
        🏳 Resign
      </button>

    </div>
  );
}

export default GameControls;