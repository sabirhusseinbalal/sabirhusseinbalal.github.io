// simple, robust vanilla dice game
(() => {
  // UI
  const startBtn = document.getElementById("start-btn");
  const startScreen = document.getElementById("start-screen");
  const gameScreen = document.getElementById("game-screen");
  const pauseBtn = document.getElementById("pause-btn");
  const exitBtn = document.getElementById("exit-btn");
  const resetBtn = document.getElementById("reset-btn");
  const statusEl = document.getElementById("status");
  const selectText = document.getElementById("select-text");
  const numsContainer = document.getElementById("numbers");
  const scoreValue = document.getElementById("score-value");
  const timerEl = document.getElementById("timer");
  const diceArea = document.getElementById("dice-area");
  const cube = document.getElementById("cube");
  const rollSound = document.getElementById("roll-sound");
  const playagain = document.getElementById("playAgainBtn");

  // state
  let selectedNumber = null;
  let score = 0;
  let timeSec = 0;
  let hearts = 5;

  let timerId = null;
  let isTimerRunning = false;
  let isPaused = false;
  let rolling = false; // prevent overlapping rolls
  let currentRotation = { x: 0, y: 0 };

  // face -> base rotation (degrees)
  const faceRot = {
    1: { x: 0, y: 0 }, // front
    6: { x: 0, y: 180 }, // back
    3: { x: 0, y: -90 }, // right
    4: { x: 0, y: 90 }, // left
    2: { x: -90, y: 0 }, // top
    5: { x: 90, y: 0 }, // bottom
  };

  function updateHearts() {
    const heartContainer = document.getElementById("hearts");
    heartContainer.innerHTML = "";

    for (let i = 0; i < hearts; i++) {
      heartContainer.innerHTML += `<span class="heart">❤️</span>`;
    }
  }
  // helpers
  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? "0" + sec : sec}`;
  }

  function startTimer() {
    if (timerId) clearInterval(timerId);
    timerId = setInterval(() => {
      timeSec++;
      timerEl.textContent = formatTime(timeSec);
    }, 1000);
    isTimerRunning = true;
    isPaused = false;
    pauseBtn.textContent = "Pause";
  }

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    isTimerRunning = false;
    isPaused = true;
    pauseBtn.textContent = "Resume";
  }

  function resetAll() {
    selectedNumber = null;
    score = 0;
    timeSec = 0;
    isPaused = false;
    hearts = 5;
    updateHearts();
    document.getElementById("gameOverOverlay").classList.add("hidden");
    scoreValue.textContent = "0";
    timerEl.textContent = "0:00";
    statusEl.textContent = "......";
    selectText.textContent = "Select a Number";
    selectText.style.color = "";
    // clear active number highlight
    document
      .querySelectorAll(".num")
      .forEach((n) => n.classList.remove("active"));
    // keep timer stopped and not started
    stopTimer();
    rolling = false;
    // reset cube rotation visually (but keep a smooth transition)
    currentRotation = { x: 0, y: 0 };
    cube.style.transition = "transform 0.6s ease";
    cube.style.transform = `rotateX(0deg) rotateY(0deg)`;
    // small timeout to restore normal transition
    setTimeout(() => {
      cube.style.transition = "transform 1.25s cubic-bezier(.18,.9,.32,1)";
    }, 700);
  }

  // number click handling
  numsContainer.addEventListener("click", (ev) => {
    const item = ev.target.closest(".num");
    if (!item) return;
    // toggle selection
    document
      .querySelectorAll(".num")
      .forEach((n) => n.classList.remove("active"));
    item.classList.add("active");
    selectedNumber = Number(item.dataset.num);
    selectText.textContent = "Select a Number";
    selectText.style.color = "";
  });


playagain.addEventListener("click", () => {
  resetAll();
  startScreen.classList.remove("hidden");
  gameScreen.classList.add("hidden");
})  
  // start game
  startBtn.addEventListener("click", () => {
    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    // start timer immediately
    resetAll(); // ensure clean state
    startTimer();
  });

  // pause/resume (only timer)
  pauseBtn.addEventListener("click", () => {
    isPaused = !isPaused;
    if (isTimerRunning) stopTimer();
    else startTimer();
    // IMPORTANT: do not disable UI; user can still select/roll while paused
  });

  // exit -> go back to start screen and reset
  exitBtn.addEventListener("click", () => {
    resetAll();
    startScreen.classList.remove("hidden");
    gameScreen.classList.add("hidden");
  });

  // reset button
  resetBtn.addEventListener("click", () => {
    resetAll();
  });

  // dice rolling
  diceArea.addEventListener("click", () => {
    if (isPaused) {
      statusEl.textContent = "Please resume the game first";
      statusEl.style.color = "red";
      return;
    } else {
      statusEl.style.color = "";
    }

    if (rolling) return; // prevent overlapping

    if (selectedNumber === null) {
      selectText.textContent = "Please Select a Number";
      selectText.style.color = "red";
      return;
    }

    rolling = true;
    // sound (ignore errors if not loaded)
    if (rollSound) {
      rollSound.currentTime = 0;
      rollSound.play().catch(() => {});
    }

    // pick random dice face
    const result = Math.floor(Math.random() * 6) + 1;
    const your = selectedNumber;
    const opp = result;

    // compute rotation: choose base from faceRot, add full spins
    const base = faceRot[result];
    // add random extra spins (1 or 2 full turns each axis) for effect
    const extraX = 360 * (Math.floor(Math.random() * 2) + 1);
    const extraY = 360 * (Math.floor(Math.random() * 2) + 1);

    // ensure currentRotation keeps accumulating to avoid snapping backwards
    // compute desired final = currentRotation + minimal delta to reach base (approx) + extras
    // For simplicity we directly add base + extras to current absolute rotation:
    const finalX =
      currentRotation.x +
      normalizeDelta(base.x - mod(currentRotation.x, 360)) +
      extraX;
    const finalY =
      currentRotation.y +
      normalizeDelta(base.y - mod(currentRotation.y, 360)) +
      extraY;

    // apply transform with CSS transition
    cube.style.transition = "transform 1.1s cubic-bezier(.18,.9,.32,1)";
    cube.style.transform = `rotateX(${finalX}deg) rotateY(${finalY}deg)`;

    // when transition ends, finalize
    const onEnd = () => {
      if (your === opp) {
  // CORRECT → add 2 hearts but max 5
  hearts = Math.min(5, hearts + 2);
} else {
  // WRONG → lose 1 heart
  hearts--;

  if (hearts <= 0) {
    hearts = 0;
    updateHearts();
    document.getElementById("gameOverOverlay").classList.remove("hidden");
    document.getElementById("finalScore").textContent = score;
    statusEl.innerHTML = `<strong style="color:red">Game Over! You lost all hearts.</strong>`;
    stopTimer();
    rolling = false;
    return; // stop game completely
  }
}

updateHearts();
      cube.removeEventListener("transitionend", onEnd);
      // lock rotation and update state
      currentRotation.x = finalX;
      currentRotation.y = finalY;
      // update score and UI
      if (your === opp) score += opp;
      else score -= opp;
      scoreValue.textContent = String(score);
      statusEl.innerHTML = `You Enter ${your} and Dice Roll ${
        your === opp
          ? `<strong>${opp}</strong>`
          : `<strong style="color:${opp > 0 ? "#c0392b" : ""}">${opp}</strong>`
      }`;
      // clear selection
      selectedNumber = null;
      document
        .querySelectorAll(".num")
        .forEach((n) => n.classList.remove("active"));
      rolling = false;
    };

    // safety: also clear rolling if transition doesn't fire
    const safety = setTimeout(() => {
      if (rolling) {
        rolling = false;
        currentRotation.x = finalX;
        currentRotation.y = finalY;
        scoreValue.textContent = String(score);
      }
    }, 1600);

    cube.addEventListener(
      "transitionend",
      () => {
        clearTimeout(safety);
        onEnd();
      },
      { once: true }
    );
  });

  // small helper: modulus for possibly-negative numbers
  function mod(n, m) {
    return ((n % m) + m) % m;
  }

  // normalize delta to nearest (-180,180] for nicer spins (keeps movement forward/back minimal)
  function normalizeDelta(delta) {
    let d = delta;
    // bring to (-180,180]
    while (d > 180) d -= 360;
    while (d <= -180) d += 360;
    // if too small, push a full spin to make animation visible
    if (Math.abs(d) < 30) d += d >= 0 ? 360 : -360;
    return d;
  }

  // initial reset to set everything consistent
  resetAll();
})();
