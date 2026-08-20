import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

import { registerSocketHandlers } from "./socket/connection.js";


const app = express();


/*
==========================================
EXPRESS CORS
==========================================
*/

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);


/*
==========================================
HTTP SERVER
==========================================
*/

const server =
  http.createServer(app);


/*
==========================================
SOCKET.IO
==========================================
*/

const io = new Server(server, {

  cors: {
    origin:
      "http://localhost:5173",

    methods: [
      "GET",
      "POST",
    ],
  },

});


/*
==========================================
REGISTER SOCKET EVENTS
==========================================
*/

registerSocketHandlers(io);


/*
==========================================
START SERVER
==========================================
*/

const PORT = 5000;


server.listen(
  PORT,
  () => {

    console.log(
      `Server running on port ${PORT}`
    );

  }
);