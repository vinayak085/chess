import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

import {
  createGame,
  getGame,
} from "./chess/gameManager.js";


const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);


const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});


io.on("connection", (socket) => {

  console.log("Player connected:", socket.id);


  // ==========================================
  // CREATE GAME
  // ==========================================

  socket.on("createGame", ({ playerName }, callback) => {

    const gameId = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();


    const game = createGame(gameId);


    game.players.white = {
      id: socket.id,
      name: playerName,
    };


    socket.join(gameId);


    callback({
      success: true,
      gameId,
      color: "w",
      playerName,
    });


    console.log(
      `Game ${gameId} created by ${playerName}`
    );
  });


  // ==========================================
  // JOIN GAME
  // ==========================================

  socket.on(
    "joinGame",
    ({ gameId, playerName }, callback) => {

      const game = getGame(gameId);


      if (!game) {
        callback({
          success: false,
          message: "Game not found",
        });

        return;
      }


      if (game.players.black) {
        callback({
          success: false,
          message: "Game is already full",
        });

        return;
      }


      game.players.black = {
        id: socket.id,
        name: playerName,
      };


      socket.join(gameId);


      callback({
        success: true,
        gameId,
        color: "b",
        playerName,
      });


      // Tell both players that game has started

      io.to(gameId).emit("gameStarted", {
        gameId,

        players: {
          white: game.players.white,
          black: game.players.black,
        },

        position: game.chess.fen(),

        turn: game.chess.turn(),
      });


      console.log(
        `Player ${playerName} joined game ${gameId}`
      );
    }
  );


  // ==========================================
  // MAKE MOVE
  // ==========================================

  socket.on(
    "makeMove",
    ({ gameId, from, to, promotion }) => {

      const game = getGame(gameId);


      if (!game) {
        return;
      }


      // Find player color

      let playerColor = null;


      if (
        game.players.white?.id === socket.id
      ) {
        playerColor = "w";
      }


      if (
        game.players.black?.id === socket.id
      ) {
        playerColor = "b";
      }


      // Player isn't part of game

      if (!playerColor) {
        return;
      }


      // Make sure it's this player's turn

      if (
        game.chess.turn() !== playerColor
      ) {
        socket.emit("moveError", {
          message: "It's not your turn",
        });

        return;
      }


      try {

        const move = game.chess.move({
          from,
          to,
          promotion,
        });


        if (!move) {
          return;
        }


        // Broadcast updated game

        io.to(gameId).emit("gameState", {

          position: game.chess.fen(),

          turn: game.chess.turn(),

          lastMove: move,

          isCheck: game.chess.inCheck(),

          isCheckmate:
            game.chess.isCheckmate(),

          isDraw:
            game.chess.isDraw(),

        });


      } catch (error) {

        socket.emit("moveError", {
          message: "Illegal move",
        });

      }
    }
  );


  // ==========================================
  // DISCONNECT
  // ==========================================

  socket.on("disconnect", () => {

    console.log(
      "Player disconnected:",
      socket.id
    );

  });

});


const PORT = 5000;

server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});