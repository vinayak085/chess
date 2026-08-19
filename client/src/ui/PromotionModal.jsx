function PromotionModal({
  promotion,
  onSelect,
}) {
  if (!promotion) {
    return null;
  }

  const pieces = [
    {
      type: "q",
      white: "♕",
      black: "♛",
      name: "Queen",
    },
    {
      type: "r",
      white: "♖",
      black: "♜",
      name: "Rook",
    },
    {
      type: "b",
      white: "♗",
      black: "♝",
      name: "Bishop",
    },
    {
      type: "n",
      white: "♘",
      black: "♞",
      name: "Knight",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

      <div className="rounded-2xl bg-gray-900 p-6 shadow-2xl">

        <h2 className="mb-5 text-center text-xl font-bold text-white">
          Choose Promotion
        </h2>

        <div className="flex gap-3">

          {pieces.map((piece) => (
            <button
              key={piece.type}
              onClick={() => onSelect(piece.type)}
              title={piece.name}
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-xl
                bg-gray-800
                text-4xl
                text-white
                transition
                hover:bg-gray-700
                md:h-20
                md:w-20
              "
            >
              {promotion.color === "w"
                ? piece.white
                : piece.black}
            </button>
          ))}

        </div>

      </div>

    </div>
  );
}

export default PromotionModal;