const GAME_SESSION_KEY =
  "chess_game_session";


export function saveGameSession(gameData) {

  localStorage.setItem(
    GAME_SESSION_KEY,
    JSON.stringify({

      gameId:
        gameData.gameId,

      color:
        gameData.color,

      playerName:
        gameData.playerName,

    })
  );

}


export function getGameSession() {

  const saved =
    localStorage.getItem(
      GAME_SESSION_KEY
    );

  if (!saved) {
    return null;
  }

  try {

    return JSON.parse(saved);

  } catch (error) {

    console.error(
      "Invalid game session:",
      error
    );

    return null;

  }

}


export function clearGameSession() {

  localStorage.removeItem(
    GAME_SESSION_KEY
  );

}