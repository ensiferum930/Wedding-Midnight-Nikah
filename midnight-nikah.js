/* ============================================================
   MIDNIGHT NIKAH
   Completely independent JavaScript.
   Namespace: mn-
   ============================================================ */

(function () {
  "use strict";


  /* ==========================================================
     ELEMENTS
     ========================================================== */

  const opening = document.getElementById("mn-opening");
  const openButton = document.getElementById("mn-open-button");
  const main = document.getElementById("mn-main");

  const audio = document.getElementById("mn-audio");
  const musicButton = document.getElementById("mn-music-button");

  const daysElement = document.getElementById("mn-days");
  const hoursElement = document.getElementById("mn-hours");
  const minutesElement = document.getElementById("mn-minutes");
  const secondsElement = document.getElementById("mn-seconds");


  /* ==========================================================
     OPEN INVITATION + MUSIC
     ========================================================== */

  let invitationOpened = false;
  let musicPlaying = false;
  let fadeTimer = null;

  function stopMusicFade() {
    if (fadeTimer) {
      window.clearInterval(fadeTimer);
      fadeTimer = null;
    }
  }

  function fadeInMusic(targetVolume = 0.28, duration = 3500) {
    if (!audio || !audio.querySelector("source")) {
      return Promise.resolve(false);
    }

    stopMusicFade();
    audio.volume = 0;

    const playPromise = audio.play();

    if (!playPromise || typeof playPromise.then !== "function") {
      audio.volume = targetVolume;
      musicPlaying = true;
      musicButton && musicButton.classList.add("is-playing");
      return Promise.resolve(true);
    }

    return playPromise
      .then(function () {
        musicPlaying = true;

        if (musicButton) {
          musicButton.classList.add("is-playing");
          musicButton.textContent = "♫";
        }

        const steps = Math.max(1, Math.round(duration / 100));
        const volumeStep = targetVolume / steps;
        let currentVolume = 0;

        fadeTimer = window.setInterval(function () {
          currentVolume += volumeStep;

          if (currentVolume >= targetVolume) {
            currentVolume = targetVolume;
            stopMusicFade();
          }

          audio.volume = currentVolume;
        }, 100);

        return true;
      })
      .catch(function () {
        musicPlaying = false;
        return false;
      });
  }

  function openInvitation() {

    if (invitationOpened) {
      return;
    }

    invitationOpened = true;

    document.body.classList.remove("mn-is-opening");
    opening.classList.add("is-hidden");

    /* Start the music from the user's button interaction.
       The browser is much more likely to allow playback here. */
    fadeInMusic();

    window.setTimeout(function () {
      main.classList.add("is-visible");

      if (musicButton) {
        musicButton.classList.add("is-visible");
      }

      window.scrollTo({
        top: 0,
        behavior: "auto"
      });
    }, 450);
  }

  if (openButton) {
    openButton.addEventListener("click", openInvitation);
  }

  /* ==========================================================
     COUNTDOWN
     ========================================================== */

  /*
     Wedding date:
     22 September 2026
     2:00 PM

     The time is interpreted as local time in the
     visitor's browser.
  */

  const weddingDate = new Date(
    2026,
    8,
    22,
    14,
    0,
    0
  );


  function padNumber(number) {

    return String(number).padStart(2, "0");

  }


  function updateCountdown() {

    const now = new Date();

    let difference =
      weddingDate.getTime() - now.getTime();


    if (difference < 0) {
      difference = 0;
    }


    const totalSeconds =
      Math.floor(difference / 1000);


    const days =
      Math.floor(
        totalSeconds / 86400
      );


    const hours =
      Math.floor(
        (totalSeconds % 86400) / 3600
      );


    const minutes =
      Math.floor(
        (totalSeconds % 3600) / 60
      );


    const seconds =
      totalSeconds % 60;


    if (daysElement) {
      daysElement.textContent =
        padNumber(days);
    }

    if (hoursElement) {
      hoursElement.textContent =
        padNumber(hours);
    }

    if (minutesElement) {
      minutesElement.textContent =
        padNumber(minutes);
    }

    if (secondsElement) {
      secondsElement.textContent =
        padNumber(seconds);
    }

  }


  updateCountdown();

  window.setInterval(
    updateCountdown,
    1000
  );


  /* ==========================================================
     MUSIC CONTROL
     ========================================================== */

  if (musicButton && audio) {

    musicButton.addEventListener("click", function () {

      if (!audio.querySelector("source")) {
        return;
      }

      if (musicPlaying && !audio.paused) {

        stopMusicFade();
        audio.pause();
        musicPlaying = false;

        musicButton.classList.remove("is-playing");
        musicButton.textContent = "♪";

        return;
      }

      fadeInMusic();
    });

    audio.addEventListener("ended", function () {
      musicPlaying = false;
      musicButton.classList.remove("is-playing");
      musicButton.textContent = "♪";
    });
  }

  /* ==========================================================
     REVEAL ANIMATIONS
     ========================================================== */

  const revealElements =
    document.querySelectorAll(
      ".mn-section, .mn-closing"
    );


  if ("IntersectionObserver" in window) {

    const observer =
      new IntersectionObserver(
        function (entries) {

          entries.forEach(
            function (entry) {

              if (entry.isIntersecting) {

                entry.target.classList.add(
                  "mn-in-view"
                );

                observer.unobserve(
                  entry.target
                );

              }

            }
          );

        },
        {
          threshold: 0.12
        }
      );


    revealElements.forEach(
      function (element) {
        observer.observe(element);
      }
    );

  }


  /* ==========================================================
     ESCAPE KEY
     ========================================================== */

  document.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key === "Enter" &&
        !invitationOpened &&
        document.activeElement === openButton
      ) {

        openInvitation();

      }

    }
  );


})();
