const rock = document.getElementById("rock");
const paper = document.getElementById("paper");
const scissors = document.getElementById("scissors");
const first = document.getElementById("first");
const second = document.getElementById("second");
const msg = document.getElementById("msg");

const rightHand = document.getElementById("right-hand");
const leftHand = document.getElementById("left-hand");

const countEl = document.getElementById("count");
const reset = document.getElementById("reset");

let ran = 0;
let player = "";
let hearts = 5;
let com = "";
let timerRunning = false;
let timerInterval;
let gameSeconds = 0;

let activeTimers = [];

// helper: push timeout and return id
function pushTimeout(fn, delay) {
  const id = setTimeout(fn, delay);
  activeTimers.push(id);
  return id;
}

// clear all pending timeouts
function clearAllTimers() {
  activeTimers.forEach(id => clearTimeout(id));
  activeTimers = [];
}

// ------------- TIME FORMATTING & TIMER -------------
function formatTime(sec) {
  let hrs = Math.floor(sec / 3600);
  let mins = Math.floor((sec % 3600) / 60);
  let secs = sec % 60;

  if (hrs > 0) {
    return (
      String(hrs).padStart(2, "0") + ":" +
      String(mins).padStart(2, "0") + ":" +
      String(secs).padStart(2, "0")
    );
  }

  return (
    String(mins).padStart(2, "0") + ":" +
    String(secs).padStart(2, "0")
  );
}

function startTimer() {
  if (!timerRunning) {
    timerRunning = true;
    timerInterval = setInterval(() => {
      gameSeconds++;
      const t = document.getElementById("timer");
      if (t) t.innerText = "Time: " + formatTime(gameSeconds);
    }, 1000);
  }
}

function stopTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
  timerInterval = null;
}

// ------------- GAME OVER / UI -------------
function triggerGameOver() {
  // stop timer and pending timeouts
  stopTimer();
  clearAllTimers();

  // fill final values (guard elements exist)
  const finalTimeEl = document.getElementById("finalTime");
  if (finalTimeEl) finalTimeEl.innerText = formatTime(gameSeconds);

  const finalWins = document.getElementById("finalWins");
  const finalLoses = document.getElementById("finalLoses");
  const finalDraws = document.getElementById("finalDraws");

  if (finalWins) finalWins.innerText = (document.getElementById("win-score") || {innerText:0}).innerText;
  if (finalLoses) finalLoses.innerText = (document.getElementById("lose-score") || {innerText:0}).innerText;
  if (finalDraws) finalDraws.innerText = (document.getElementById("draw-score") || {innerText:0}).innerText;

  // show popup
  const overlay = document.getElementById("gameOverOverlay");
  if (overlay) overlay.classList.remove("hidden");

  // disable interaction behind overlay but keep overlay clickable
  document.body.style.pointerEvents = "none";
  if (overlay) overlay.style.pointerEvents = "auto";
}

// ------------- RESET BUTTON (STOP EVERYTHING & RESET UI) -------------
reset.onclick = () => {
  // Immediately stop everything (timeouts + timer)
  clearAllTimers();
  stopTimer();

  // Reset UI to initial state (same as fresh page)
  // Hide second screen, show first screen
  second.classList.add("hide");
  first.classList.remove("hide");

  // reset images and texts
  leftHand.src = "/Rochambeau/rock-removebg-preview.png";
  rightHand.src = "/Rochambeau/rock-removebg-preview.png";
  msg.innerText = "You vs Computer";

  // reset countdown
  countEl.innerText = "4";
  countEl.classList.remove("hide");

  // reset stats
  hearts = 5;
  updateHearts();

  const winScore = document.getElementById("win-score");
  const loseScore = document.getElementById("lose-score");
  const drawScore = document.getElementById("draw-score");

  if (winScore) winScore.innerText = 0;
  if (loseScore) loseScore.innerText = 0;
  if (drawScore) drawScore.innerText = 0;

  // reset timer display
  gameSeconds = 0;
  timerRunning = false;
  document.getElementById("timer").innerText = "Time: 00:00";

  // hide overlay if visible and re-enable interaction
  const overlay = document.getElementById("gameOverOverlay");
  if (overlay) overlay.classList.add("hidden");
  document.body.style.pointerEvents = "auto";
};

// ------------- HEARTS UPDATE -------------
function updateHearts() {
  const heartContainer = document.getElementById("hearts");
  if (!heartContainer) return;
  heartContainer.innerHTML = "";

  for (let i = 0; i < hearts; i++) {
    heartContainer.innerHTML += `<span class="heart">❤️</span>`;
  }

  // If hearts reach 0 → GAME OVER
  if (hearts <= 0) {
    // ensure hearts not negative
    hearts = 0;
    if (heartContainer) {
      heartContainer.innerHTML = "";
      for (let i = 0; i < hearts; i++) {
        heartContainer.innerHTML += `<span class="heart">❤️</span>`;
      }
    }
    triggerGameOver();
  }
}

// ------------- BUTTON HANDLERS -------------
rock.onclick = () => { player = "rock"; startTimer(); counter(); };
paper.onclick = () => { player = "paper"; startTimer(); counter(); };
scissors.onclick = () => { player = "scissors"; startTimer(); counter(); };

// Play Again button (inside overlay) — resets stats and hides overlay
document.getElementById("playAgainBtn").onclick = () => {
  // clear pending timers + stop internal timer
  clearAllTimers();
  stopTimer();

  hearts = 5;
  const winScore = document.getElementById("win-score");
  const loseScore = document.getElementById("lose-score");
  const drawScore = document.getElementById("draw-score");

  if (winScore) winScore.innerText = 0;
  if (loseScore) loseScore.innerText = 0;
  if (drawScore) drawScore.innerText = 0;

  updateHearts();

  // reset timer and display
  gameSeconds = 0;
  timerRunning = false;
  document.getElementById("timer").innerText = "Time: 00:00";

  // hide overlay and re-enable main page interaction
  const overlay = document.getElementById("gameOverOverlay");
  if (overlay) overlay.classList.add("hidden");
  document.body.style.pointerEvents = "auto";
};

// ------------- COUNTDOWN (counter) -------------
const counter = () => {
  // If someone already reset/cleared, do nothing
  // (activeTimers is cleared on reset/playAgain so pending timeouts won't call counter again)
  let value = Number(countEl.innerText);

  if (hearts <= 0) {
    hearts = 0;
    updateHearts();
    return; // stop game completely
  }

  // show result screen area (countdown state)
  first.classList.add("hide");
  second.classList.remove("hide");

  // choose computer random now
  ran = Math.floor(Math.random() * 3);

  if (value > 0) {
    value--;

    // animation: remove after 200ms
    countEl.classList.add("animate");
    let t1 = setTimeout(() => countEl.classList.remove("animate"), 200);
    activeTimers.push(t1);

    countEl.innerText = value;

    // call counter again after 800ms (store id so we can clear)
    let t2 = setTimeout(counter, 800);
    activeTimers.push(t2);
  } else {
    // countdown over → start game
    countEl.classList.add("hide");
    start();
  }
};

// ------------- GAME LOGIC (start) -------------
start = () => {
  // If reset happened between scheduling and now, do nothing
  // But since we clear timeouts on reset, this will rarely run after reset.
  if (ran == 0) {
    com = "rock";
    rightHand.src = "/Rochambeau/rock-removebg-preview.png";
  } else if (ran == 1) {
    com = "paper";
    rightHand.src = "/Rochambeau/page-removebg-preview.png";
  } else {
    com = "scissors";
    rightHand.src = "/Rochambeau/scissors-removebg-preview.png";
  }

  // player image + result logic
  if (player == "rock") {
    leftHand.src = "/Rochambeau/rock-removebg-preview.png";

    if (com == "paper") {
      msg.innerText = "You: Rock | Computer: Paper → Paper wins";
      addLose();
    } else if (com == "scissors") {
      msg.innerText = "You: Rock | Computer: Scissors → Rock wins (You win)";
      addWin();
    } else {
      msg.innerText = "You: Rock | Computer: Rock → Draw";
      addDraw();
    }
  } else if (player == "scissors") {
    leftHand.src = "/Rochambeau/scissors-removebg-preview.png";

    if (com == "rock") {
      msg.innerText = "You: Scissors | Computer: Rock → Rock wins";
      addLose();
    } else if (com == "paper") {
      msg.innerText = "You: Scissors | Computer: Paper → Scissors wins (You win)";
      addWin();
    } else {
      msg.innerText = "You: Scissors | Computer: Scissors → Draw";
      addDraw();
    }
  } else if (player == "paper") {
    leftHand.src = "/Rochambeau/page-removebg-preview.png";

    if (com == "rock") {
      msg.innerText = "You: Paper | Computer: Rock → Paper wins (You win)";
      addWin();
    } else if (com == "scissors") {
      msg.innerText = "You: Paper | Computer: Scissors → Scissors wins";
      addLose();
    } else {
      msg.innerText = "You: Paper | Computer: Paper → Draw";
      addDraw();
    }
  }

  // schedule resetRound after result; store timeout id
  let tid = setTimeout(() => resetRound(), 2500);
  activeTimers.push(tid);
};

// ------------- SCORE HANDLERS -------------
let winScore = document.getElementById("win-score");
let loseScore = document.getElementById("lose-score");
let drawScore = document.getElementById("draw-score");

function addWin() {
  if (hearts <= 4) {
    hearts++;
    updateHearts();
  }
  if (winScore) winScore.innerText = Number(winScore.innerText) + 1;
}

function addLose() {
  hearts--;
  updateHearts();
  if (loseScore) loseScore.innerText = Number(loseScore.innerText) + 1;
}

function addDraw() {
  // current design: draw doesn't change hearts (if you want different logic, change here)
  updateHearts();
  if (drawScore) drawScore.innerText = Number(drawScore.innerText) + 1;
}

// ------------- RESET FOR NEW ROUND -------------
function resetRound() {
  // if overlay is visible or we cleared timers, we may not want to continue
  // but clearing timers already prevents this function from being called if reset was pressed.
  second.classList.add("hide");     // hide result screen
  first.classList.remove("hide");   // show choice screen

  // reset countdown text back to 4
  countEl.innerText = "4";
  countEl.classList.remove("hide");

  // img reset
  leftHand.src = "/Rochambeau/rock-removebg-preview.png";
  rightHand.src = "/Rochambeau/rock-removebg-preview.png";

  msg.innerText = "You vs Computer";
}

// ------------- SNOW EFFECT (visual only) -------------
const snowContainer = document.querySelector('.snow');
if (snowContainer) {
  const snowflakeCount = 80; // number of snowflakes
  for (let i = 0; i < snowflakeCount; i++) {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');

    // Randomize size
    const size = Math.random() * 6 + 4; // 4px to 10px
    snowflake.style.width = `${size}px`;
    snowflake.style.height = `${size}px`;

    // Random starting position (top-right side)
    snowflake.style.top = `${Math.random() * 100}vh`;
    snowflake.style.left = `${Math.random() * 100}vw`;

    // Random duration and delay
    const duration = Math.random() * 10 + 5; // 5s to 15s
    const delay = Math.random() * 10;
    snowflake.style.animationDuration = `${duration}s`;
    snowflake.style.animationDelay = `${delay}s`;

    snowContainer.appendChild(snowflake);
  }
}
