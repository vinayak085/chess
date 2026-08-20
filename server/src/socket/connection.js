import { registerGameHandlers } from "./gameHandlers.js";
import { registerRematchHandler } from "./rematchHandler.js";


export function registerSocketHandlers(io) {

  io.on("connection", (socket) => {

    console.log(
      "Player connected:",
      socket.id
    );


    /*
    ==========================================
    GAME EVENTS
    ==========================================
    */

    registerGameHandlers(
      io,
      socket
    );


    /*
    ==========================================
    REMATCH EVENTS
    ==========================================
    */

    registerRematchHandler(
      io,
      socket
    );


    /*
    ==========================================
    DISCONNECT
    ==========================================
    */

    socket.on("disconnect", () => {

      console.log(
        "Player disconnected:",
        socket.id
      );

    });

  });

}