import { useEffect, useState } from "react";
import { socket } from "../services/socket";

function ChessLobby({ onGameReady }) {
  const [playerName, setPlayerName] = useState("");

  const [gameId, setGameId] = useState("");

  const [joinGameId, setJoinGameId] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [waiting, setWaiting] = useState(false);


  // ==========================================
  // LISTEN FOR GAME START
  // ==========================================

  useEffect(() => {

    function handleGameStarted(data) {

      console.log("GAME STARTED:", data);

      const currentPlayer =
        data.players.white?.id === socket.id
          ? data.players.white
          : data.players.black;


      const color =
        data.players.white?.id === socket.id
          ? "w"
          : "b";


      // Tell App that the game is ready

      onGameReady({
        gameId: data.gameId,

        playerName: currentPlayer.name,

        color,

        players: data.players,

        position: data.position,

        turn: data.turn,
      });
    }


    socket.on(
      "gameStarted",
      handleGameStarted
    );


    return () => {
      socket.off(
        "gameStarted",
        handleGameStarted
      );
    };

  }, [onGameReady]);


  // ==========================================
  // CREATE GAME
  // ==========================================

  function createGame() {

    setError("");

    if (!playerName.trim()) {
      setError("Please enter your name.");
      return;
    }


    setLoading(true);


    socket.emit(
      "createGame",
      {
        playerName: playerName.trim(),
      },
      (response) => {

        setLoading(false);


        if (!response.success) {
          setError(
            response.message ||
            "Could not create game."
          );

          return;
        }


        console.log(
          "GAME CREATED:",
          response
        );


        setGameId(response.gameId);

        setWaiting(true);
      }
    );
  }


  // ==========================================
  // JOIN GAME
  // ==========================================

  function joinGame() {

    setError("");

    if (!playerName.trim()) {
      setError("Please enter your name.");
      return;
    }


    if (!joinGameId.trim()) {
      setError("Please enter a game code.");
      return;
    }


    setLoading(true);


    socket.emit(
      "joinGame",
      {
        gameId: joinGameId
          .trim()
          .toUpperCase(),

        playerName: playerName.trim(),
      },
      (response) => {

        setLoading(false);


        if (!response.success) {
          setError(
            response.message ||
            "Could not join game."
          );

          return;
        }


        console.log(
          "JOINED GAME:",
          response
        );

      }
    );
  }


  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gradient-to-br
      from-gray-950
      via-gray-900
      to-black
      p-4
    ">

      <div className="
        w-full
        max-w-md
        rounded-3xl
        border
        border-white/10
        bg-white/5
        p-6
        shadow-2xl
        backdrop-blur-xl
        md:p-8
      ">

        {/* =================================
            TITLE
        ================================= */}

        <div className="mb-8 text-center">

          <div className="
            mx-auto
            mb-4
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            bg-yellow-500/20
            text-4xl
          ">
            ♟
          </div>


          <h1 className="
            text-3xl
            font-bold
            text-white
          ">
            Chess Game
          </h1>


          <p className="
            mt-2
            text-sm
            text-gray-400
          ">
            Play chess with your friends
          </p>

        </div>


        {/* =================================
            PLAYER NAME
        ================================= */}

        <div className="mb-6">

          <label className="
            mb-2
            block
            text-sm
            font-medium
            text-gray-300
          ">
            Your Name
          </label>


          <input
            type="text"
            value={playerName}
            onChange={(e) =>
              setPlayerName(e.target.value)
            }
            placeholder="Enter your name"
            maxLength={20}
            disabled={waiting}
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-black/30
              px-4
              py-3
              text-white
              outline-none
              transition
              placeholder:text-gray-600
              focus:border-yellow-500
              focus:ring-2
              focus:ring-yellow-500/20
            "
          />

        </div>


        {/* =================================
            CREATE GAME
        ================================= */}

        {!waiting && (

          <button
            onClick={createGame}
            disabled={loading}
            className="
              w-full
              rounded-xl
              bg-yellow-500
              px-4
              py-3
              font-bold
              text-gray-950
              transition
              hover:bg-yellow-400
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading
              ? "Creating..."
              : "Create New Game"}
          </button>

        )}


        {/* =================================
            DIVIDER
        ================================= */}

        {!waiting && (
  <div className="my-6 flex items-center gap-3">

    <div className="h-px flex-1 bg-white/10" />

    <span className="text-xs text-gray-500">
      OR
    </span>

    <div className="h-px flex-1 bg-white/10" />

  </div>
)}


        {/* =================================
            JOIN GAME
        ================================= */}

        {!waiting && (

          <div>

            <label className="
              mb-2
              block
              text-sm
              font-medium
              text-gray-300
            ">
              Game Code
            </label>


            <input
              type="text"
              value={joinGameId}
              onChange={(e) =>
                setJoinGameId(
                  e.target.value.toUpperCase()
                )
              }
              placeholder="Enter game code"
              maxLength={6}
              className="
                w-full
                rounded-xl
                border
                border-white/10
                bg-black/30
                px-4
                py-3
                text-center
                font-bold
                tracking-[0.3em]
                text-white
                uppercase
                outline-none
                transition
                placeholder:tracking-normal
                placeholder:text-gray-600
                focus:border-yellow-500
                focus:ring-2
                focus:ring-yellow-500/20
              "
            />


            <button
              onClick={joinGame}
              disabled={loading}
              className="
                mt-3
                w-full
                rounded-xl
                border
                border-white/10
                bg-white/10
                px-4
                py-3
                font-semibold
                text-white
                transition
                hover:bg-white/15
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loading
                ? "Joining..."
                : "Join Game"}
            </button>

          </div>

        )}


        {/* =================================
            ERROR
        ================================= */}

        {error && (

          <div className="
            mt-5
            rounded-xl
            border
            border-red-500/20
            bg-red-500/10
            px-4
            py-3
            text-center
            text-sm
            text-red-400
          ">
            {error}
          </div>

        )}


        {/* =================================
            WAITING FOR PLAYER
        ================================= */}

        {waiting && (

          <div className="
            mt-6
            rounded-2xl
            border
            border-yellow-500/20
            bg-yellow-500/10
            p-5
            text-center
          ">

            <div className="
              mx-auto
              mb-4
              h-8
              w-8
              animate-spin
              rounded-full
              border-4
              border-yellow-500/20
              border-t-yellow-500
            " />

            <h2 className="
              text-lg
              font-bold
              text-white
            ">
              Waiting for opponent
            </h2>


            <p className="
              mt-2
              text-sm
              text-gray-400
            ">
              Share this game code with your friend
            </p>


            <div className="
              mt-4
              rounded-xl
              bg-black/40
              px-4
              py-4
            ">

              <p className="
                text-xs
                uppercase
                tracking-wider
                text-gray-500
              ">
                Game Code
              </p>


              <p className="
                mt-1
                text-3xl
                font-black
                tracking-[0.3em]
                text-yellow-400
              ">
                {gameId}
              </p>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default ChessLobby;