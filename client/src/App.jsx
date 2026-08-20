import { useState } from "react";

import Game from "./pages/Game";
import GameLobby from "./pages/GameLobby";


function App() {

  const [game, setGame] = useState(null);


  // ==========================================
  // GAME READY
  // ==========================================

  function handleGameReady(gameData) {

    console.log(
      "GAME READY:",
      gameData
    );

    setGame(gameData);
  }


  // ==========================================
  // GO TO LOBBY
  // ==========================================

  function handleGoToLobby() {

    console.log(
      "Going back to lobby..."
    );

    setGame(null);
  }


  // ==========================================
  // SHOW LOBBY
  // ==========================================

  if (!game) {

    return (
      <GameLobby
        onGameReady={handleGameReady}
      />
    );

  }


  // ==========================================
  // SHOW GAME
  // ==========================================

  return (
    <Game
      gameData={game}
      onGoToLobby={handleGoToLobby}
    />
  );

}


export default App;