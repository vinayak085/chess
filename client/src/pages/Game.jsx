import ChessBoard from "../features/ChessBoard";

function Game({
  gameData,
  onGoToLobby,
}) {

  console.log("====================================");
  console.log("♟️ GAME PAGE");
  console.log("====================================");

  console.log("gameData:", gameData);

  console.log("gameId:", gameData?.gameId);
  console.log("color:", gameData?.color);
  console.log("playerName:", gameData?.playerName);
  console.log("position:", gameData?.position);
  console.log("turn:", gameData?.turn);


  return (
    <div>

      <ChessBoard
        gameData={gameData}
        onGoToLobby={onGoToLobby}
      />

    </div>
  );
}

export default Game;