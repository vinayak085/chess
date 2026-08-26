import { registerGameHandlers } from "./gameHandlers.js";
import { registerRematchHandler } from "./rematchHandler.js";
import { registerResignHandler } from "./resignHandler.js";
import {  registerReconnectHandler } from "./reconnectHandler.js";

export function registerSocketHandlers(io) {

  io.on("connection", (socket) => {

    console.log(
      "Player connected:",
      socket.id
    );


    registerGameHandlers(
      io,
      socket
    );


    registerRematchHandler(
      io,
      socket
    );


    registerResignHandler(
      io,
      socket
    );

    registerReconnectHandler(
    io,
    socket
    );


    socket.on("disconnect", () => {

      console.log(
        "Player disconnected:",
        socket.id
      );

    });

  });

}