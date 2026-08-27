import { useEffect, useRef, useCallback } from "react";

import backgroundMusic from "/sounds/background.mp3";
import moveSound from "/sounds/move.mp3";


export function useGameSounds() {

  const backgroundAudio =
    useRef(null);


  /*
  ==========================================
  CREATE BACKGROUND AUDIO
  ==========================================
  */

  useEffect(() => {

    const audio =
      new Audio(backgroundMusic);

    audio.loop = true;

    audio.volume = 0.25;

    backgroundAudio.current =
      audio;


    return () => {

      audio.pause();

      audio.currentTime = 0;

      backgroundAudio.current =
        null;

    };

  }, []);


  /*
  ==========================================
  PLAY BACKGROUND MUSIC
  ==========================================
  */

  // const playBackgroundMusic =
  //   useCallback(() => {

  //     if (!backgroundAudio.current) {
  //       return;
  //     }


  //     backgroundAudio.current
  //       .play()
  //       .then(() => {

  //         console.log(
  //           "🎵 Background music started"
  //         );

  //       })
  //       .catch((error) => {

  //         console.log(
  //           "Browser blocked autoplay:",
  //           error
  //         );

  //       });

  //   }, []);


  // /*
  // ==========================================
  // STOP BACKGROUND MUSIC
  // ==========================================
  // */

  // const stopBackgroundMusic =
  //   useCallback(() => {

  //     if (!backgroundAudio.current) {
  //       return;
  //     }


  //     backgroundAudio.current.pause();

  //     backgroundAudio.current.currentTime = 0;


  //     console.log(
  //       "🎵 Background music stopped"
  //     );

  //   }, []);


  /*
  ==========================================
  MOVE SOUND
  ==========================================
  */

  const playMoveSound =
    useCallback(() => {

      const audio =
        new Audio(moveSound);

      audio.volume = 0.5;

      audio.currentTime = 0;


      audio.play()
        .catch((error) => {

          console.log(
            "Move sound failed:",
            error
          );

        });

    }, []);


  /*
  ==========================================
  RETURN
  ==========================================
  */

  return {

    // playBackgroundMusic,

    // stopBackgroundMusic,

    playMoveSound,

  };

}