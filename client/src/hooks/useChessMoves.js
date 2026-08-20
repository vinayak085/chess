import { useCallback } from "react";
import { socket } from "../services/socket";

export function useChessMoves({
  chess,
  gameData,
  gameOver,
  setPosition,
  updateStatus,
  setPromotion,
}) {

  const onPieceDrop = useCallback(
    ({ sourceSquare, targetSquare }) => {

      console.log(
        "DROP:",
        sourceSquare,
        targetSquare
      );


      if (!targetSquare) {
        return false;
      }


      // Game already ended
      if (gameOver) {
        return false;
      }


      // Check turn
      if (gameData.color !== chess.turn()) {

        console.log("Not your turn");

        return false;
      }


      // Get piece
      const piece = chess.get(sourceSquare);

      if (!piece) {
        return false;
      }


      // Player can only move their own pieces
      if (piece.color !== gameData.color) {

        console.log(
          "You cannot move this piece"
        );

        return false;
      }


      // Check promotion
      const isPromotion =
        piece.type === "p" &&
        (
          (
            piece.color === "w" &&
            targetSquare[1] === "8"
          ) ||
          (
            piece.color === "b" &&
            targetSquare[1] === "1"
          )
        );


      if (isPromotion) {

        const legalMoves = chess.moves({
          square: sourceSquare,
          verbose: true,
        });


        const isLegal = legalMoves.some(
          (move) =>
            move.to === targetSquare
        );


        if (!isLegal) {

          console.log(
            "Illegal promotion move"
          );

          return false;
        }


        // Open promotion modal
        setPromotion({
          from: sourceSquare,
          to: targetSquare,
          color: piece.color,
        });


        return false;
      }


      // Save old position
      const previousPosition = chess.fen();


      try {

        /*
         * Temporarily make the move locally
         */
        const move = chess.move({
          from: sourceSquare,
          to: targetSquare,
        });


        if (!move) {
          return false;
        }


        /*
         * Update local board
         */
        setPosition(chess.fen());


        /*
         * Send move to server
         */
        socket.emit(
          "makeMove",
          {
            gameId: gameData.gameId,
            from: sourceSquare,
            to: targetSquare,
          },
          (response) => {

            console.log(
              "MOVE RESPONSE:",
              response
            );


            /*
             * Server rejected move
             */
            if (!response?.success) {

              console.log(
                "Move rejected:",
                response?.message
              );


              chess.load(
                previousPosition
              );

              setPosition(
                previousPosition
              );

              updateStatus();
            }

          }
        );


        return true;

      } catch (error) {

        console.error(
          "MOVE ERROR:",
          error
        );

        return false;
      }

    },
    [
      chess,
      gameData,
      gameOver,
      setPosition,
      updateStatus,
      setPromotion,
    ]
  );


  return {
    onPieceDrop,
  };
}