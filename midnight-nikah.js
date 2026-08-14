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
     TWO-STAGE OPENING
     ========================================================== */

  const curtainGate = document.getElementById("mn-curtain-gate");
  const gateButton = document.getElementById("mn-gate-button");

  let invitationOpened = false;
  let gateOpened = false;

  function startFloralRain() {
    if (floralStarted) return;
    floralStarted = true;
    for (let i = 0; i < 45; i++) {
      window.setTimeout(createFloatingItem, i * 75);
    }
    window.setInterval(createFloatingItem, 260);
  }

  function openCurtainGate() {
    if (gateOpened) return;
    gateOpened = true;
    document.body.classList.remove("mn-is-opening");
    curtainGate.classList.add("is-open");
    document.body.classList.add("mn-floral-active");
    startFloralRain();

    window.setTimeout(function () {
      curtainGate.classList.add("is-gone");
    }, 1900);
  }

  if (gateButton) gateButton.addEventListener("click", openCurtainGate);

  function openInvitation() {
    if (invitationOpened) return;
    invitationOpened = true;

    opening.classList.add("is-hidden");
    document.body.classList.add("mn-invitation-opened");

    window.setTimeout(function () {
      main.classList.add("is-visible");
      musicButton.classList.add("is-visible");
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 650);

    if (audio && audio.querySelector("source")) {
      audio.volume = 0;
      audio.currentTime = 0;
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.then(function () {
          musicPlaying = true;
          musicButton.classList.add("is-playing");
          musicButton.textContent = "♫";
          fadeAudioIn(audio, 3500, 0.55);
        }).catch(function () {});
      }
    }
  }

  if (openButton) openButton.addEventListener("click", openInvitation);

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
     CINEMATIC FLORAL + HEART RAIN
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

  let floralStarted = false;

  function createFloatingItem() {
    const field = document.getElementById("mn-petal-field");
    if (!field) return;
    const item = document.createElement("span");
    const types = ["petal", "petal", "rose", "leaf", "heart", "heart", "spark"];
    const type = types[Math.floor(Math.random() * types.length)];
    item.className = "mn-floating-item mn-floating-" + type;
    item.style.left = (Math.random() * 100) + "vw";
    item.style.setProperty("--fall-duration", (6 + Math.random() * 8) + "s");
    item.style.setProperty("--drift", (-100 + Math.random() * 200) + "px");
    item.style.setProperty("--spin", (-360 + Math.random() * 720) + "deg");
    item.style.setProperty("--delay", (Math.random() * .7) + "s");
    item.style.setProperty("--size", (7 + Math.random() * 12) + "px");
    if (type === "heart") item.textContent = Math.random() > .5 ? "♥" : "♡";
    field.appendChild(item);
    window.setTimeout(function () { item.remove(); }, 16000);
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
        document.body.classList.add("mn-date-unlocked");
        createRevealBurst();
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

  function createRevealBurst() {
    const field = document.getElementById("mn-petal-field");
    if (!field) return;
    for (let i = 0; i < 26; i++) {
      const item = document.createElement("span");
      item.className = "mn-reveal-heart";
      item.textContent = i % 2 ? "♥" : "✦";
      item.style.left = "50%";
      item.style.top = "50%";
      item.style.setProperty("--burst-x", (-180 + Math.random() * 360) + "px");
      item.style.setProperty("--burst-y", (-130 + Math.random() * 260) + "px");
      field.appendChild(item);
      window.setTimeout(function () { item.remove(); }, 1500);
    }
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
