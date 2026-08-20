import { useCallback } from "react";
import { socket } from "../services/socket";

export function useChessPromotion({
  chess,
  gameData,
  promotion,
  setPromotion,
  setPosition,
  updateStatus,
}) {

  const promotePiece = useCallback(
    (pieceType) => {

      if (!promotion) {
        return;
      }


      const {
        from,
        to,
      } = promotion;


      const previousPosition =
        chess.fen();


      try {

        /*
         * Temporarily promote locally
         */
        const move = chess.move({
          from,
          to,
          promotion: pieceType,
        });


        if (!move) {

          console.log(
            "Invalid promotion"
          );

          return;
        }


        /*
         * Update board
         */
        setPosition(
          chess.fen()
        );


        /*
         * Send promotion to server
         */
        socket.emit(
          "makeMove",
          {
            gameId: gameData.gameId,

            from,

            to,

            promotion: pieceType,
          },
          (response) => {

            console.log(
              "PROMOTION RESPONSE:",
              response
            );


            /*
             * Server rejected promotion
             */
            if (!response?.success) {

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


        setPromotion(null);

      } catch (error) {

        console.error(
          "PROMOTION ERROR:",
          error
        );


        chess.load(
          previousPosition
        );

        setPosition(
          previousPosition
        );
      }

    },
    [
      chess,
      gameData,
      promotion,
      setPromotion,
      setPosition,
      updateStatus,
    ]
  );


  return {
    promotePiece,
  };
}