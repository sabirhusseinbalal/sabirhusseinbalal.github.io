const headbtn = document.getElementById("headsBtn");
const tailbtn = document.getElementById("tailsBtn");
const quickToss = document.getElementById("quickToss");

const statTosses = document.getElementById("statTosses");
const statHeads = document.getElementById("statHeads");
const statTails = document.getElementById("statTails");
const statwins = document.getElementById("statwins");
const statlosses = document.getElementById("statlosses");

const resetBtn = document.getElementById("resetBtn");

let player = "";
let com = "";
let tosses = 0;
let heads = 0;
let tails = 0;
let wins = 0;
let loss = 0;

let timerRunning = false;
let timerInterval;
let activeTimers = [];
let gameSeconds = 0;

let hearts = 5;

// ---------------- TIMER -----------------

function pushTimeout(fn, delay) {
  const id = setTimeout(fn, delay);
  activeTimers.push(id);
  return id;
}

function clearAllTimers() {
  activeTimers.forEach(id => clearTimeout(id));
  activeTimers = [];
}

function formatTime(sec) {
  let mins = Math.floor(sec / 60);
  let secs = sec % 60;
  return String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
}

function startTimer() {
  if (!timerRunning) {
    timerRunning = true;
    timerInterval = setInterval(() => {
      gameSeconds++;
      document.getElementById("timer").innerText = formatTime(gameSeconds);
    }, 1000);
  }
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerRunning = false;
}

// ---------------- COIN TOSS -----------------

function tossCoin() {
  const coin = document.getElementById("coin");

  coin.classList.remove("flip-heads", "flip-tails");
  void coin.offsetWidth; // force reflow

  const result = Math.random() < 0.5 ? "heads" : "tails";
  com = result;

  coin.classList.add(result === "heads" ? "flip-heads" : "flip-tails");

  return result;
}

// ---------------- STAT ANIM -----------------

function animateStat(statId, type) {
  const stat = document.querySelector(`#${statId}`).parentElement;
  const plus = stat.querySelector(".plus");
  const minus = stat.querySelector(".minus");

  plus.classList.remove("show");
  minus.classList.remove("show");

  const elem = type === "plus" ? plus : minus;

  setTimeout(() => elem.classList.add("show"), 30);
  setTimeout(() => elem.classList.remove("show"), 2000);
}

// ---------------- GAME LOGIC -----------------

function start() {
  startTimer();

  quickToss.disabled = true;
  quickToss.style.opacity = "0.4";

  // Player choice
  player = headbtn.classList.contains("primary") ? "heads" : "tails";

  // Update heads/tails stats
  if (player === "heads") {
    heads++;
    statHeads.textContent = heads;
  } else {
    tails++;
    statTails.textContent = tails;
  }

  const result = tossCoin();
  const coin = document.getElementById("coin");

  const handler = () => {
    coin.removeEventListener("animationend", handler);

    if (hearts > 0) {
      quickToss.disabled = false;
      quickToss.style.opacity = "1";
    }

    if (hearts === 0) {
      stopTimer();
      clearAllTimers();
      quickToss.disabled = true;
      quickToss.style.opacity = "0.4";
    }
  };

  coin.addEventListener("animationend", handler);

  if (player === result) {
    wins++;
    statwins.textContent = wins;
    hearts = Math.min(hearts + 1, 5);
    animateStat("statwins", "plus");

  } else {
    loss++;
    statlosses.textContent = loss;
    hearts--;
    animateStat("statlosses", "plus");
    animateStat("statwins", "minus");
  }

  updateHearts();
}

// ---------------- CHOICE BUTTONS -----------------

function change(e) {
  if (e.target.classList.contains("primary")) return;

  headbtn.classList.toggle("primary");
  tailbtn.classList.toggle("primary");
}

headbtn.addEventListener("click", change);
tailbtn.addEventListener("click", change);

// ---------------- RESET -----------------

function reset() {
  quickToss.disabled = false;
  quickToss.style.opacity = "1";

  stopTimer();
  clearAllTimers();

  gameSeconds = 0;
  player = "";
  com = "";
  hearts = 5;
  tosses = 0;
  heads = 0;
  tails = 0;
  wins = 0;
  loss = 0;

  document.getElementById("timer").innerText = "00:00";

  statTosses.textContent = tosses;
  statHeads.textContent = heads;
  statTails.textContent = tails;
  statwins.textContent = wins;
  statlosses.textContent = loss;

  updateHearts();
}

resetBtn.addEventListener("click", reset);

// ---------------- QUICK TOSS -----------------

quickToss.addEventListener("click", () => {
  tosses++;
  statTosses.textContent = tosses;

  animateStat("statTosses", "plus");

  start();
});

// ---------------- HEARTS -----------------

function updateHearts() {
  const heartContainer = document.getElementById("hearts");
  heartContainer.innerHTML = "";

  for (let i = 0; i < hearts; i++) {
    heartContainer.innerHTML += `<span class="heart">❤️</span>`;
  }
}

updateHearts();
