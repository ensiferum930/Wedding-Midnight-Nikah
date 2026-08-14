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
     OPEN INVITATION
     ========================================================== */

  let invitationOpened = false;
  let musicPlaying = false;

  function fadeAudioIn(element, targetVolume, duration) {
    if (!element) return;
    const start = performance.now();
    function step(now) {
      const progress = Math.min(1, (now - start) / duration);
      element.volume = targetVolume * progress;
      if (progress < 1 && !element.paused) {
        window.requestAnimationFrame(step);
      }
    }
    window.requestAnimationFrame(step);
  }

  function openInvitation() {

    if (invitationOpened) {
      return;
    }

    invitationOpened = true;

    document.body.classList.remove("mn-is-opening");
    document.body.classList.add("mn-invitation-open");

    /* Let the curtains perform the reveal before the opening screen fades away. */
    opening.classList.add("is-revealing");

    window.setTimeout(function () {
      opening.classList.add("is-hidden");
    }, 850);

    window.setTimeout(function () {
      main.classList.add("is-visible");
      musicButton.classList.add("is-visible");

      window.scrollTo({
        top: 0,
        behavior: "auto"
      });
    }, 1050);


    /* Try to start music.

       Browsers may still block autoplay. The user has
       already interacted with the page, so this normally
       provides the best chance of successful playback.
    */

    if (audio && audio.querySelector("source")) {
      audio.volume = 0;

      const playPromise = audio.play();

      if (playPromise && typeof playPromise.catch === "function") {
        playPromise
          .then(function () {
            musicPlaying = true;
            musicButton.classList.add("is-playing");
            musicButton.textContent = "♫";
            fadeAudioIn(audio, 0.28, 3500);
          })
          .catch(function () {
            /* Browser blocked playback; the music button remains available. */
          });
      }
    }
  }


  if (openButton) {
    openButton.addEventListener(
      "click",
      openInvitation
    );
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
     MUSIC
     ========================================================== */

  if (musicButton && audio) {

    musicButton.addEventListener(
      "click",
      function () {

        if (!audio.querySelector("source")) {
          return;
        }


        if (musicPlaying) {

          audio.pause();

          musicPlaying = false;

          musicButton.classList.remove(
            "is-playing"
          );

          musicButton.textContent = "♪";

        } else {

          const playPromise =
            audio.play();


          if (
            playPromise &&
            typeof playPromise.then === "function"
          ) {

            playPromise
              .then(function () {

                musicPlaying = true;

                musicButton.classList.add(
                  "is-playing"
                );

                musicButton.textContent = "♫";

              })
              .catch(function () {

                musicPlaying = false;

              });

          }

        }

      }
    );

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
     FLOATING HEARTS & FLOWERS
     ========================================================== */

  function createAtmosphere() {
    const openingParticles = document.querySelector(".mn-opening-particles");
    if (openingParticles) {
      const symbols = ["♥", "✿", "❀", "✦", "❁"];
      for (let i = 0; i < 28; i += 1) {
        const el = document.createElement("span");
        el.className = "mn-opening-particle " + (i % 3 === 0 ? "is-heart" : "is-flower");
        el.textContent = symbols[i % symbols.length];
        el.style.left = (Math.random() * 100) + "%";
        el.style.setProperty("--size", (8 + Math.random() * 11) + "px");
        el.style.setProperty("--drift", (-55 + Math.random() * 110) + "px");
        el.style.setProperty("--duration", (7 + Math.random() * 8) + "s");
        el.style.setProperty("--delay", (-Math.random() * 12) + "s");
        el.style.setProperty("--opacity", (.25 + Math.random() * .45).toFixed(2));
        openingParticles.appendChild(el);
      }
    }

    const atmosphere = document.createElement("div");
    atmosphere.className = "mn-floating-atmosphere";
    atmosphere.setAttribute("aria-hidden", "true");
    const symbols = ["♥", "✿", "❀", "✦", "❁"];
    for (let i = 0; i < 22; i += 1) {
      const el = document.createElement("span");
      el.className = "mn-floating-particle " + (i % 3 === 0 ? "heart" : "flower");
      el.textContent = symbols[i % symbols.length];
      el.style.left = (Math.random() * 100) + "%";
      el.style.setProperty("--size", (9 + Math.random() * 12) + "px");
      el.style.setProperty("--drift", (-65 + Math.random() * 130) + "px");
      el.style.setProperty("--duration", (10 + Math.random() * 10) + "s");
      el.style.setProperty("--delay", (-Math.random() * 18) + "s");
      atmosphere.appendChild(el);
    }
    document.body.appendChild(atmosphere);
  }

  createAtmosphere();


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
