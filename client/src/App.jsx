import { useEffect, useState } from "react";

import Game from "./pages/Game";
import GameLobby from "./pages/GameLobby";

import {
  saveGameSession,
  getGameSession,
  clearGameSession,
} from "./services/gameSession";

import { socket } from "./services/socket";


function App() {

  const [game, setGame] = useState(null);

  const [restoringGame, setRestoringGame] =
    useState(true);


  // ==========================================
  // RESTORE GAME AFTER REFRESH
  // ==========================================

  useEffect(() => {

    const savedGame = getGameSession();


    // ==========================================
    // DEBUG SAVED SESSION
    // ==========================================

    console.log("====================================");
    console.log("💾 SAVED GAME SESSION");
    console.log("====================================");

    console.log(
      "savedGame:",
      savedGame
    );


    if (savedGame) {

      console.log(
        "gameId:",
        savedGame.gameId
      );

      console.log(
        "color:",
        savedGame.color
      );

      console.log(
        "playerName:",
        savedGame.playerName
      );

      console.log(
        "position:",
        savedGame.position
      );

      console.log(
        "turn:",
        savedGame.turn
      );

    }


    // ==========================================
    // NO SAVED GAME
    // ==========================================

    if (!savedGame) {

      console.log(
        "❌ No saved game found"
      );

      setRestoringGame(false);

      return;

    }


    console.log(
      "Saved game found:",
      savedGame
    );


    // ==========================================
    // RECONNECT GAME
    // ==========================================

    function reconnectGame() {

      console.log("====================================");
      console.log("🔄 RECONNECTING GAME");
      console.log("====================================");

      console.log(
        "Socket ID:",
        socket.id
      );

      console.log(
        "Socket connected:",
        socket.connected
      );


      socket.emit(
        "reconnectGame",
        savedGame,
        (response) => {

          // ==========================================
          // SERVER RESPONSE
          // ==========================================

          console.log("====================================");
          console.log("📥 RECONNECT RESPONSE");
          console.log("====================================");

          console.log(
            "Full response:",
            response
          );


          // ==========================================
          // RECONNECT FAILED
          // ==========================================

          if (!response?.success) {

            console.error(
              "❌ GAME RESTORE FAILED:",
              response?.message
            );


            clearGameSession();

            setGame(null);

            setRestoringGame(false);

            return;

          }


          // ==========================================
          // IMPORTANT
          //
          // SERVER RETURNS:
          //
          // {
          //   success: true,
          //   gameData: {...}
          // }
          //
          // So we MUST use response.gameData
          // ==========================================

          const restoredGame = {
            ...response.gameData,
          };


          // ==========================================
          // DEBUG RESTORED GAME
          // ==========================================

          console.log("====================================");
          console.log("♟️ GAME RESTORED");
          console.log("====================================");

          console.log(
            "restoredGame:",
            restoredGame
          );

          console.log(
            "gameId:",
            restoredGame.gameId
          );

          console.log(
            "color:",
            restoredGame.color
          );

          console.log(
            "playerName:",
            restoredGame.playerName
          );

          console.log(
            "position:",
            restoredGame.position
          );

          console.log(
            "turn:",
            restoredGame.turn
          );

          console.log(
            "players:",
            restoredGame.players
          );

          console.log(
            "Is player's turn:",
            restoredGame.color ===
              restoredGame.turn
          );


          // ==========================================
          // VALIDATE RESTORED GAME
          // ==========================================

          if (
            !restoredGame.gameId ||
            !restoredGame.color ||
            !restoredGame.position ||
            !restoredGame.turn
          ) {

            console.error(
              "❌ RESTORED GAME DATA IS INVALID:",
              restoredGame
            );


            clearGameSession();

            setGame(null);

            setRestoringGame(false);

            return;

          }


          // ==========================================
          // SAVE UPDATED SESSION
          // ==========================================

          saveGameSession(
            restoredGame
          );


          // ==========================================
          // RESTORE GAME STATE
          // ==========================================

          setGame(
            restoredGame
          );


          setRestoringGame(
            false
          );


          console.log("====================================");
          console.log("✅ GAME RESTORED SUCCESSFULLY");
          console.log("====================================");

        }
      );

    }


    // ==========================================
    // SOCKET ALREADY CONNECTED
    // ==========================================

    if (socket.connected) {

      console.log(
        "Socket already connected"
      );

      reconnectGame();

    }

    // ==========================================
    // SOCKET NOT CONNECTED
    // ==========================================

    else {

      console.log(
        "Waiting for socket connection..."
      );


      socket.once(
        "connect",
        reconnectGame
      );

    }


    // ==========================================
    // CLEANUP
    // ==========================================

    return () => {

      socket.off(
        "connect",
        reconnectGame
      );

    };

  }, []);


  // ==========================================
  // NEW GAME READY
  // ==========================================

  function handleGameReady(
    gameData
  ) {

    console.log("====================================");
    console.log("🎮 NEW GAME CREATED / JOINED");
    console.log("====================================");

    console.log(
      "gameData:",
      gameData
    );

    console.log(
      "gameId:",
      gameData?.gameId
    );

    console.log(
      "color:",
      gameData?.color
    );

    console.log(
      "playerName:",
      gameData?.playerName
    );

    console.log(
      "position:",
      gameData?.position
    );

    console.log(
      "turn:",
      gameData?.turn
    );


    console.log(
      "Is player's turn:",
      gameData?.color ===
        gameData?.turn
    );


    // ==========================================
    // SAVE SESSION
    // ==========================================

    saveGameSession(
      gameData
    );


    // ==========================================
    // SHOW GAME
    // ==========================================

    setGame(
      gameData
    );

  }


  // ==========================================
  // GO TO LOBBY
  // ==========================================

  function handleGoToLobby() {

    console.log(
      "🏠 Going back to lobby..."
    );


    // Remove saved game

    clearGameSession();


    // Remove game from React state

    setGame(null);

  }


  // ==========================================
  // RESTORING GAME SCREEN
  // ==========================================

  if (restoringGame) {

    return (

      <div className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-gray-950
        text-white
      ">

        <div className="
          text-center
        ">

          <div className="
            text-2xl
            font-bold
          ">

            Reconnecting...

          </div>


          <p className="
            mt-2
            text-gray-400
          ">

            Restoring your chess game

          </p>

        </div>

      </div>

    );

  }


  // ==========================================
  // LOBBY
  // ==========================================

  if (!game) {

    return (

      <GameLobby
        onGameReady={
          handleGameReady
        }
      />

    );

  }


  // ==========================================
  // GAME
  // ==========================================

  return (

    <Game
      gameData={game}
      onGoToLobby={
        handleGoToLobby
      }
    />

  );

}


export default App;