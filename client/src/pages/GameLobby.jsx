import ChessLobby from "../features/ChessLobby";

function GameLobby({ onGameReady }) {
  return (
    <div>
      <ChessLobby
        onGameReady={onGameReady}
      />
    </div>
  );
}

export default GameLobby;