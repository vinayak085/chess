import { useState } from 'react';
import Game from './pages/Game'
import GameLobby from './pages/GameLobby'


function App() {

  const [game, setGame] = useState(null);

  function handleGameReady(gameData) {
    console.log("GAME READY:", gameData);

    setGame(gameData);
  }

  if (!game) {
    return (
      <GameLobby
        onGameReady={handleGameReady}
      />
    );
  }

  return (
    <Game gameData={game} />
  );
}

export default App;