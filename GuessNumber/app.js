const start = document.getElementById("start");
const reset = document.getElementById("reset");
const input = document.getElementById("guess");
const msg = document.getElementById("msg");
const attempts = document.getElementById("atms");
const num = document.getElementById("num");
const hintbtn = document.getElementById("hintbtn");
const checkbtn = document.getElementById("checkbtn");
const title = document.getElementById("title");

let startgame = false;
let nu = 0;
let hearts = 5;
const hints = document.querySelectorAll(".hint");

let maxHints = 3;
let hintCount = 0;
let score = 0;
let highscore = 0;

let timerRunning = false;
let timerInterval;
let activeTimers = [];
let gameSeconds = 0;
let highis = false;





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
      if (t) t.innerText = formatTime(gameSeconds);
    }, 1000);
  }
}

function stopTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
  timerInterval = null;
}



function updateHearts() {
  const heartContainer = document.getElementById("hearts");
  heartContainer.innerHTML = "";


  for (let i = 0; i < hearts; i++) {
    heartContainer.innerHTML += `<span class="heart">❤️</span>`;
  }
}

gamestart = () => {
  startgame = true;
  title.style.opacity = "1";
  msg.textContent = "Good Luck!";
  msg.style.color = "white";
  start.style.opacity = "0.4";
  start.style.cursor = "not-allowed";
  start.disabled = true;
    input.value = "";
      nu = Math.floor(Math.random() * 100) + 1;
  startTimer();
};

resetexcepthighscore = () => {
      highis = false;
     if (score > highscore) {
          highscore = score;
    document.getElementById("highscore").textContent = highscore;
      }
   setTimeout(() => {
       msg.textContent = "Reset Successful...";
        msg.style.color = "green";
          start.textContent = "Start Game!";
          score = 0

  document.getElementById("score").textContent = score;

stopTimer();
  clearAllTimers();
    gameSeconds = 0;
  timerRunning = false;
  document.getElementById("timer").innerText = "00:00";
      
    }, 0);
                 resetgame();
};

gamereset = () => {
  if (startgame) {
      
resetexcepthighscore();
  }else if(score > 0){
   resetexcepthighscore();

  } else {
    msg.textContent = "Game not started...";
    msg.style.color = "red";
  }
};

gamecheck = () => {
  if (score >= 1 && !startgame){
    msg.textContent = "You must generate a new number before continuing.";
     msg.style.color = "white";
     
       return;
  }
  if (!startgame) {
    msg.textContent = "Please start the game first...";
    msg.style.color = "red";
  } else if (input.value == "") {
    msg.textContent = "Please enter a number...";
    msg.style.color = "red";
  } else if (input.value > 100) {
    msg.textContent = "Please enter a number between 1 and 100...";
    msg.style.color = "red";
  } else {
    check();
  }
};

resetgame = () => {
  startgame = false;
  nu = 0;
  input.value = "";
  attempts.textContent = "3";
  num.textContent = "?";
  start.style.opacity = "1";
  start.style.cursor = "pointer";
  start.disabled = false;
  checkbtn.disabled = false;
  hintbtn.disabled = false;
  checkbtn.style.opacity = "1";
  hintbtn.style.opacity = "1";
  checkbtn.style.cursor = "pointer";
  hintbtn.style.cursor = "pointer";
  hearts = 5;
  hints[0].textContent = "";
  hints[1].textContent = "";
  hints[2].textContent = "";
  maxHints = 3;
  hintCount = 0;
  
  
  updateHearts();
};
playagain = () => {
  start.textContent = "Next Number";
  score++;
  document.getElementById("score").textContent = score;
  if (score > highscore && !highis) {
      msg.textContent = "Congratulations! You broke the high score!";
      highis = true;
  }

  resetgame();
};

check = () => {
  if (input.value == nu) {
    msg.textContent = "Correct!";
    msg.style.color = "green";
    playagain();
  } else {
     hearts--;
    msg.textContent = "You Wrong! lost a life... Remaining: " + hearts;
    msg.style.color = "red";
   
    updateHearts();
    if (hearts <= 0) {
      msg.textContent = "Game Over! You lost all hearts.";
      msg.style.color = "red";
      checkbtn.disabled = true;
      hintbtn.disabled = true;
      checkbtn.style.opacity = "0.4";
      hintbtn.style.opacity = "0.4";
      checkbtn.style.cursor = "not-allowed";
      hintbtn.style.cursor = "not-allowed";
      num.textContent = nu;
      msg.textContent = "The number was " + nu;
      if (score > highscore) {
          highscore = score;
    document.getElementById("highscore").textContent = highscore;
        highis = false;
      }
      stopTimer();
    }
  }
};

hintbtn.addEventListener("click", () => {

  if (score >= 1 && !startgame){
      msg.textContent = "Please generate a new number first.";
      msg.style.color = "white";
      return;
  }

  if (!startgame) {
      msg.textContent = "Please start the game first...";
      msg.style.color = "red";
      return;
  }

  if (hintCount >= maxHints) {
      msg.textContent = "No more hints!";
      msg.style.color = "red";
      hintbtn.disabled = true;
      hintbtn.style.opacity = "0.4";
      hintbtn.style.cursor = "not-allowed";
      return;
  }

  hintCount++;
  attempts.textContent--; // subtract attempt every hint


  if (hintCount === 1) {
      hints[0].textContent = `Hint 1: The number is ${
          nu % 2 === 0 ? "even" : "odd"
      }.`;
  }



  else if (hintCount === 2) {

      let low = nu - 6;
      let high = nu + 6;

      if (low < 1) low = 1;
      if (high > 100) high = 100;

      hints[1].textContent = `Hint 2: The number is between ${low} and ${high}.`;
  }



  else if (hintCount === 3) {

      let middle = nu > 50 ? nu - 3 : nu + 3;

      // ensures hint NEVER reveals exact number
      if (middle < 1) middle = 1;
      if (middle > 100) middle = 100;

      hints[2].textContent = `Hint 3: The number is ${
          nu > middle ? "greater" : "less"
      } than ${middle}.`;
  }

});


start.addEventListener("click", gamestart);
reset.addEventListener("click", gamereset);
checkbtn.addEventListener("click", gamecheck);
