const rock = document.getElementById("rock");
const paper = document.getElementById("paper");
const scissors = document.getElementById("scissors");
const first = document.getElementById("first");
const second = document.getElementById("second");
const msg = document.getElementById("msg");

const rightHand = document.getElementById("right-hand");
const leftHand = document.getElementById("left-hand");

const countEl = document.getElementById("count");

let ran = 0;
let player = "";
let hearts = 5;
let com = "";
let gameTime = 0;
let timerRunning = false;
let timerInterval;


function startTimer() {
    if (!timerRunning) {
        timerRunning = true;
        timerInterval = setInterval(() => {
            gameTime++;
            document.getElementById("timer").innerText = "Time: " + gameTime + "s";
        }, 1000);
    }
}

function stopTimer() {
    timerRunning = false;
    clearInterval(timerInterval);
}


function triggerGameOver() {
    stopTimer();

    // fill final values
    document.getElementById("finalTime").innerText = gameTime + "s";
    document.getElementById("finalWins").innerText = winScore.innerText;
    document.getElementById("finalLoses").innerText = loseScore.innerText;
    document.getElementById("finalDraws").innerText = drawScore.innerText;

    // show popup
    document.getElementById("gameOverOverlay").classList.remove("hidden");

    // disable interaction
    document.body.style.pointerEvents = "none";
    document.getElementById("gameOverOverlay").style.pointerEvents = "auto";
}


// =============== FIX HEART CHECK ===============
function updateHearts() {
    const heartContainer = document.getElementById("hearts");
    heartContainer.innerHTML = "";

    for (let i = 0; i < hearts; i++) {
        heartContainer.innerHTML += `<span class="heart">❤️</span>`;
    }

    // If hearts reach 0 → GAME OVER
    if (hearts <= 0) {
        triggerGameOver();
    }
}

rock.onclick = () => { player = "rock"; startTimer(); counter(); };
paper.onclick = () => { player = "paper"; startTimer(); counter(); };
scissors.onclick = () => { player = "scissors"; startTimer(); counter(); };



document.getElementById("playAgainBtn").onclick = () => {

    // reset values
    hearts = 5;
    winScore.innerText = 0;
    loseScore.innerText = 0;
    drawScore.innerText = 0;
    updateHearts();

    gameTime = 0;

    // hide popup
    document.getElementById("gameOverOverlay").classList.add("hidden");

    // re-enable game
    document.body.style.pointerEvents = "auto";
};

const counter = () => {
    let value = Number(countEl.innerText);

    if (hearts <= 0) {
        hearts = 0;
        updateHearts();
  
        return; // stop game completely
    }

    // hide first screen, show second
    first.classList.add("hide");
    second.classList.remove("hide");

    // choose computer random now
    ran = Math.floor(Math.random() * 3);

    if (value > 0) {
        value--;

        // animation
        countEl.classList.add("animate");
        setTimeout(() => countEl.classList.remove("animate"), 200);

        countEl.innerText = value;

        setTimeout(counter, 800);
    } else {
        // countdown over → start game
        countEl.classList.add("hide");
        start();
    }
};




// =========================
// GAME LOGIC + RESULTS
// =========================
start = () => {
    // computer choice image
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

    // player image
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
    }

    else if (player == "scissors") {
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
    }

    else if (player == "paper") {
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

    // after showing result → reset for new game
    setTimeout(resetRound, 2500);
};


// =========================
// SCORE FUNCTIONS
// =========================
let winScore = document.getElementById("win-score");
let loseScore = document.getElementById("lose-score");
let drawScore = document.getElementById("draw-score");

function addWin() {
    if (hearts <= 4) {
        hearts++;
        updateHearts();
    }
    winScore.innerText = Number(winScore.innerText) + 1;
}

function addLose() {
    hearts--;
    updateHearts();
    loseScore.innerText = Number(loseScore.innerText) + 1;
}

function addDraw() {
       updateHearts();
    drawScore.innerText = Number(drawScore.innerText) + 1;
}


// =========================
// RESET FOR NEW ROUND
// =========================
function resetRound() {
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


const snowContainer = document.querySelector('.snow');
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
