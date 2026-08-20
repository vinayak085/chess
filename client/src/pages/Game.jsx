import ChessBoard from "../features/ChessBoard";


function Game({
  gameData,
  onGoToLobby,
}) {

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