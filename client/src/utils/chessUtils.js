export function isPawnPromotion(piece, targetSquare) {
  if (!piece || piece.type !== "p") {
    return false;
  }

  const isWhitePromotion =
    piece.color === "w" &&
    targetSquare[1] === "8";

  const isBlackPromotion =
    piece.color === "b" &&
    targetSquare[1] === "1";

  return (
    isWhitePromotion ||
    isBlackPromotion
  );
}