let user1 = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        let user2 = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        const wins = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],   
            [0, 3, 6], [1, 4, 7], [2, 5, 8],   
            [0, 4, 8], [2, 4, 6]            
        ];
        let turn = true; // true = X, false = O
        let run = true;
        let count = 0;

        const cells = document.querySelectorAll('.cell');
        const statusDiv = document.getElementById('status');
        const resetBtn = document.getElementById('reset-btn');

        function check_winner(user, symbol) {
            for (let w of wins) {
                if (user[w[0]] === symbol && user[w[1]] === symbol && user[w[2]] === symbol) {
                    return true;
                }
            }
            return false;
        }

        function updateBoardDisplay() {
            cells.forEach((cell, index) => {
                if (user1[index] === "X") {
                    cell.textContent = "X";
                    cell.classList.add("x");
                    cell.classList.remove("o");
                } else if (user2[index] === "O") {
                    cell.textContent = "O";
                    cell.classList.add("o");
                    cell.classList.remove("x");
                } else {
                    cell.textContent = index;
                    cell.classList.remove("x", "o");
                }
            });
        }

        cells.forEach(cell => {
            cell.addEventListener('click', () => {
                if (!run) return;

                let value = parseInt(cell.getAttribute('data-index'));

                if (user1[value] === "X" || user2[value] === "O") {
                    statusDiv.textContent = "Already Filled!";
                    return;
                }

                if (turn) {  
                    turn = false;
                    user1[value] = "X";
                    statusDiv.textContent = "O Turn";
                } else {
                    turn = true;
                    user2[value] = "O";
                    statusDiv.textContent = "X Turn";
                }

                updateBoardDisplay();
                count += 1;

                if (check_winner(user1, "X")) {
                    statusDiv.textContent = "X wins!";
                    run = false;
                    return;
                }

                if (check_winner(user2, "O")) {
                    statusDiv.textContent = "O wins!";
                    run = false;
                    return;   
                }

                if (count === 9) {
                    statusDiv.textContent = "Game Draw!";
                    run = false;
                }
            });
        });

        resetBtn.addEventListener('click', () => {
            user1 = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            user2 = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            turn = true;
            run = true;
            count = 0;
            statusDiv.textContent = "X Turn";
            updateBoardDisplay();
        });

        // Initialize display numbers
        updateBoardDisplay();
