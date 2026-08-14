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

  function openInvitation() {

    if (invitationOpened) {
      return;
    }

    invitationOpened = true;

    document.body.classList.remove("mn-is-opening");

    opening.classList.add("is-hidden");

    window.setTimeout(function () {
      main.classList.add("is-visible");
      musicButton.classList.add("is-visible");

      window.scrollTo({
        top: 0,
        behavior: "auto"
      });
    }, 450);


    /* Try to start music.

       Browsers may still block autoplay. The user has
       already interacted with the page, so this normally
       provides the best chance of successful playback.
    */

    if (audio && audio.querySelector("source")) {

      audio.volume = 0;
      audio.currentTime = 0;

      const playPromise = audio.play();

      if (playPromise && typeof playPromise.catch === "function") {

        playPromise
          .then(function () {
            musicButton.classList.add("is-playing");
            fadeAudioIn(audio, 3500, 0.55);
          })
          .catch(function () {
            /* Browser blocked playback. */
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

  let musicPlaying = false;


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
     CINEMATIC REVEAL + FLORAL RAIN
     ========================================================== */

  function fadeAudioIn(element, duration, target) {
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      element.volume = target * (1 - Math.pow(1 - progress, 3));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function createPetal() {
    const field = document.getElementById("mn-petal-field");
    if (!field) return;
    const petal = document.createElement("span");
    const types = ["petal", "rose", "leaf", "spark"];
    const type = types[Math.floor(Math.random() * types.length)];
    petal.className = "mn-floating-item mn-floating-" + type;
    petal.style.left = (Math.random() * 100) + "vw";
    petal.style.setProperty("--fall-duration", (7 + Math.random() * 8) + "s");
    petal.style.setProperty("--drift", (-80 + Math.random() * 160) + "px");
    petal.style.setProperty("--spin", (-240 + Math.random() * 480) + "deg");
    petal.style.setProperty("--delay", (Math.random() * 1.5) + "s");
    petal.style.setProperty("--size", (7 + Math.random() * 10) + "px");
    field.appendChild(petal);
    window.setTimeout(function () { petal.remove(); }, 17000);
  }

  let floralStarted = false;
  function startFloralRain() {
    if (floralStarted) return;
    floralStarted = true;
    for (let i = 0; i < 28; i++) {
      window.setTimeout(createPetal, i * 110);
    }
    window.setInterval(createPetal, 420);
  }

  /* Curtain reveal begins on the user's tap. */
  function cinematicReveal() {
    if (opening) opening.classList.add("mn-curtain-opening");
    window.setTimeout(startFloralRain, 650);
    window.setTimeout(function () {
      document.body.classList.add("mn-floral-active");
    }, 900);
  }

  /* Hook into the existing opening handler without replacing it. */
  const originalOpenButton = openButton;
  if (originalOpenButton) {
    originalOpenButton.addEventListener("click", cinematicReveal, { once: true });
  }


  /* ==========================================================
     SCRATCH TO REVEAL
     ========================================================== */

  const scratchCard = document.getElementById("mn-scratch-card");
  const scratchCanvas = document.getElementById("mn-scratch-canvas");

  if (scratchCard && scratchCanvas) {
    const ctx = scratchCanvas.getContext("2d", { willReadFrequently: true });
    let scratching = false;
    let revealed = false;

    function sizeScratchCanvas() {
      const rect = scratchCard.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      scratchCanvas.width = rect.width * ratio;
      scratchCanvas.height = rect.height * ratio;
      scratchCanvas.style.width = rect.width + "px";
      scratchCanvas.style.height = rect.height + "px";
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      gradient.addColorStop(0, "#8f6b2d");
      gradient.addColorStop(.45, "#d7b56d");
      gradient.addColorStop(1, "#6e4d1d");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = "rgba(255,255,255,.16)";
      for (let i = 0; i < 55; i++) {
        ctx.fillRect(Math.random() * rect.width, Math.random() * rect.height, 1.2, 1.2);
      }
      ctx.globalCompositeOperation = "destination-out";
    }

    function scratchAt(event) {
      const rect = scratchCanvas.getBoundingClientRect();
      const point = event.touches ? event.touches[0] : event;
      const x = point.clientX - rect.left;
      const y = point.clientY - rect.top;
      ctx.beginPath();
      ctx.arc(x, y, 23, 0, Math.PI * 2);
      ctx.fill();
    }

    function checkScratch() {
      if (revealed) return;
      const pixels = ctx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height).data;
      let transparent = 0;
      for (let i = 3; i < pixels.length; i += 32) {
        if (pixels[i] < 40) transparent++;
      }
      const total = pixels.length / 32;
      if (transparent / total > 0.48) {
        revealed = true;
        scratchCard.classList.add("is-revealed");
      }
    }

    scratchCanvas.addEventListener("pointerdown", function (e) {
      scratching = true;
      scratchCanvas.setPointerCapture(e.pointerId);
      scratchAt(e);
    });
    scratchCanvas.addEventListener("pointermove", function (e) {
      if (!scratching) return;
      scratchAt(e);
      checkScratch();
    });
    scratchCanvas.addEventListener("pointerup", function () {
      scratching = false;
      checkScratch();
    });
    scratchCanvas.addEventListener("pointercancel", function () { scratching = false; });

    window.addEventListener("resize", sizeScratchCanvas);
    sizeScratchCanvas();
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
