const form = document.getElementById("guess-form");
const input = document.getElementById("guess");
const msg = document.getElementById("msg");
const num = document.getElementById("num");
const checkbtn = document.getElementById("checkbtn");
const reset = document.getElementById("reset");

let secretNum = Math.floor(Math.random() * 100) + 1;

function checkGuess(event) {
    event.preventDefault();

    if (checkbtn.disabled) return;

    const val = input.valueAsNumber;

    if (!Number.isInteger(val) || val < 1 || val > 100) {
        msg.textContent = "Please enter a valid number between 1 and 100.";
        msg.style.color = "red";
        input.focus();
        return;
    }

    if (val === secretNum) {
        msg.textContent = "Correct! You guessed the number!";
        msg.style.color = "green";

        num.textContent = secretNum;

        checkbtn.disabled = true;
        input.disabled = true;

    } else if (val > secretNum) {
        msg.textContent = "Too high! Try a lower number.";
        msg.style.color = "orange";

    } else {
        msg.textContent = "Too low! Try a higher number.";
        msg.style.color = "orange";
    }
}

function resetGame() {
    secretNum = Math.floor(Math.random() * 100) + 1;

    input.value = "";
    input.disabled = false;

    msg.textContent = "Start guessing...";
    msg.style.color = "#e5e5ff";

    num.textContent = "?";

    checkbtn.disabled = false;

    input.focus();
}

form.addEventListener("submit", checkGuess);
reset.addEventListener("click", resetGame);