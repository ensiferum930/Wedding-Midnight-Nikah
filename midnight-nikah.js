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

  function startMusicAfterCurtain() {
    if (!audio || !audio.querySelector("source")) return;

    audio.volume = 0;
    audio.currentTime = 0;

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise.then(function () {
        musicPlaying = true;
        if (musicButton) {
          musicButton.classList.add("is-visible", "is-playing");
          musicButton.textContent = "♫";
        }
        fadeAudioIn(audio, 3200, 0.55);
      }).catch(function () {
        // The click on OPEN INVITATION is a user gesture. If the browser
        // still blocks playback, the music button remains available.
        if (musicButton) musicButton.classList.add("is-visible");
      });
    }
  }

  function openCurtainGate() {
    if (gateOpened) return;
    gateOpened = true;
    document.body.classList.remove("mn-is-opening");
    curtainGate.classList.add("is-open");
    document.body.classList.add("mn-floral-active");
    startFloralRain();

    // Music starts from the OPEN INVITATION click, immediately after
    // the initial curtain is opened — not after SHOW INVITATION.
    startMusicAfterCurtain();

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
     SCRATCH TO REVEAL — ROBUST TOUCH + MOUSE VERSION
     ========================================================== */

  const scratchCard = document.getElementById("mn-scratch-card");
  const scratchCanvas = document.getElementById("mn-scratch-canvas");

  if (scratchCard && scratchCanvas) {
    const ctx = scratchCanvas.getContext("2d", { willReadFrequently: true });
    let scratching = false;
    let revealed = false;
    let lastX = 0;
    let lastY = 0;
    let scratchDistance = 0;
    let initialized = false;

    function sizeScratchCanvas() {
      const rect = scratchCard.getBoundingClientRect();
      if (rect.width < 20 || rect.height < 20) return;

      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      scratchCanvas.width = Math.round(rect.width * ratio);
      scratchCanvas.height = Math.round(rect.height * ratio);
      scratchCanvas.style.width = rect.width + "px";
      scratchCanvas.style.height = rect.height + "px";

      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, rect.width, rect.height);

      const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      gradient.addColorStop(0, "#76521f");
      gradient.addColorStop(.25, "#c49a4d");
      gradient.addColorStop(.5, "#f4d98d");
      gradient.addColorStop(.72, "#b8883c");
      gradient.addColorStop(1, "#604116");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Gold foil texture.
      for (let i = 0; i < 320; i++) {
        const a = 0.04 + Math.random() * 0.12;
        ctx.fillStyle = "rgba(255,255,255," + a + ")";
        const size = Math.random() > .86 ? 2 : .7;
        ctx.fillRect(Math.random() * rect.width, Math.random() * rect.height, size, size);
      }

      ctx.strokeStyle = "rgba(255,248,215,.48)";
      ctx.lineWidth = 1;
      ctx.strokeRect(13, 13, rect.width - 26, rect.height - 26);

      ctx.globalCompositeOperation = "destination-out";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = Math.max(38, Math.min(58, rect.width * .14));
      initialized = true;
    }

    function getPoint(event) {
      const rect = scratchCanvas.getBoundingClientRect();
      return {
        x: Math.max(0, Math.min(rect.width, event.clientX - rect.left)),
        y: Math.max(0, Math.min(rect.height, event.clientY - rect.top))
      };
    }

    function scratchAt(event) {
      if (revealed || !initialized) return;
      const p = getPoint(event);

      if (lastX !== null) {
        scratchDistance += Math.hypot(p.x - lastX, p.y - lastY);
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }

      // A dot makes even a tap/short touch visibly scratch the card.
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(20, ctx.lineWidth / 2), 0, Math.PI * 2);
      ctx.fill();

      lastX = p.x;
      lastY = p.y;

      // Reveal after a realistic amount of scratching.
      const rect = scratchCard.getBoundingClientRect();
      const threshold = Math.max(520, rect.width * 2.15);
      if (scratchDistance >= threshold) revealScratchCard();
    }

    function revealScratchCard() {
      if (revealed) return;
      revealed = true;
      scratching = false;
      scratchCard.classList.add("is-revealed");
      document.body.classList.add("mn-date-unlocked");
      createRevealBurst();
    }

    function pointerDown(event) {
      if (revealed) return;
      event.preventDefault();
      if (!initialized) sizeScratchCanvas();
      scratching = true;
      lastX = null;
      lastY = null;
      if (scratchCanvas.setPointerCapture && event.pointerId != null) {
        try { scratchCanvas.setPointerCapture(event.pointerId); } catch (_) {}
      }
      scratchAt(event);
    }

    function pointerMove(event) {
      if (!scratching || revealed) return;
      event.preventDefault();
      scratchAt(event);
    }

    function pointerUp(event) {
      if (!scratching) return;
      event.preventDefault();
      scratching = false;
      lastX = null;
      lastY = null;
      if (scratchCanvas.releasePointerCapture && event.pointerId != null) {
        try { scratchCanvas.releasePointerCapture(event.pointerId); } catch (_) {}
      }
    }

    scratchCanvas.addEventListener("pointerdown", pointerDown, { passive: false });
    scratchCanvas.addEventListener("pointermove", pointerMove, { passive: false });
    scratchCanvas.addEventListener("pointerup", pointerUp, { passive: false });
    scratchCanvas.addEventListener("pointercancel", pointerUp, { passive: false });
    scratchCanvas.addEventListener("lostpointercapture", function () {
      scratching = false;
      lastX = null;
      lastY = null;
    });

    // Initialize immediately and again when the invitation becomes visible.
    function initializeScratch() {
      window.requestAnimationFrame(function () {
        sizeScratchCanvas();
      });
    }

    initializeScratch();
    window.addEventListener("resize", initializeScratch);
    window.addEventListener("orientationchange", function () {
      window.setTimeout(initializeScratch, 150);
    });

    if (window.ResizeObserver) {
      const observer = new ResizeObserver(initializeScratch);
      observer.observe(scratchCard);
    }
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
