import { socket } from "../services/socket";

export function useChessMoves({
  chess,
  gameData,
  gameOver,
  setPosition,
  updateStatus,
  setPromotion,
}) {

  function onPieceDrop({
    sourceSquare,
    targetSquare,
  }) {

    console.log(
      "DROP:",
      sourceSquare,
      targetSquare
    );


    if (!targetSquare) {
      return false;
    }


    if (gameOver) {
      return false;
    }


    /*
    ======================================
    CHECK TURN
    ======================================
    */

    if (
      chess.turn() !==
      gameData.color
    ) {

      console.log(
        "NOT YOUR TURN"
      );

      return false;
    }


    /*
    ======================================
    GET PIECE
    ======================================
    */

    const piece =
      chess.get(sourceSquare);


    if (!piece) {
      return false;
    }


    /*
    ======================================
    OWN PIECE
    ======================================
    */

    if (
      piece.color !==
      gameData.color
    ) {

      console.log(
        "YOU CANNOT MOVE THIS PIECE"
      );

      return false;
    }


    /*
    ======================================
    PROMOTION
    ======================================
    */

    const isPromotion =
      piece.type === "p" &&
      (
        (
          piece.color === "w" &&
          targetSquare[1] === "8"
        )
        ||
        (
          piece.color === "b" &&
          targetSquare[1] === "1"
        )
      );


    if (isPromotion) {

      const legalMoves =
        chess.moves({
          square: sourceSquare,
          verbose: true,
        });


      const isLegal =
        legalMoves.some(
          move =>
            move.to === targetSquare
        );


      if (!isLegal) {

        console.log(
          "ILLEGAL PROMOTION"
        );

        return false;
      }


      setPromotion({
        from: sourceSquare,
        to: targetSquare,
        color: piece.color,
      });


      return false;
    }


    /*
    ======================================
    NORMAL MOVE
    ======================================
    */

    const previousPosition =
      chess.fen();


    try {

      const move =
        chess.move({
          from: sourceSquare,
          to: targetSquare,
        });


      if (!move) {
        return false;
      }


      console.log(
        "LOCAL MOVE:",
        move
      );


      /*
      ======================================
      SEND TO SERVER
      ======================================
      */

      socket.emit(
        "makeMove",
        {
          gameId:
            gameData.gameId,

          from:
            sourceSquare,

          to:
            targetSquare,
        },

        (response) => {

          console.log(
            "SERVER MOVE RESPONSE:",
            response
          );


          if (
            !response?.success
          ) {

            console.log(
              "SERVER REJECTED MOVE:",
              response?.message
            );


            /*
            Restore old position
            */

            chess.load(
              previousPosition
            );


            setPosition(
              previousPosition
            );

          }

        }
      );


      /*
      ======================================
      OPTIMISTIC UI
      ======================================
      */

      setPosition(
        chess.fen()
      );


      updateStatus();


      return true;

    } catch (error) {

      console.error(
        "MOVE ERROR:",
        error
      );

      return false;
    }
  }


  return {
    onPieceDrop,
  };
}