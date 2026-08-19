import ChessBoard from "../features/ChessBoard";

function Game({ gameData }) {
  return (
    <div>
      <ChessBoard
        gameData={gameData}
      />
    </div>
  );
}

export default Game;