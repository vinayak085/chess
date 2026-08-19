import { Chess } from "chess.js";

const games = new Map();

export function createGame(gameId) {
  const game = {
    id: gameId,

    chess: new Chess(),

    players: {
      white: null,
      black: null,
    },
  };

  games.set(gameId, game);

  return game;
}

export function getGame(gameId) {
  return games.get(gameId);
}

export function deleteGame(gameId) {
  games.delete(gameId);
}