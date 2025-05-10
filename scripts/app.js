const board = document.getElementById('board');
const cells = document.querySelectorAll('[data-cell]');
const status = document.getElementById('status');
const restartButton = document.getElementById('restartButton');
const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
let circleTurn;

const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
    circleTurn = false;
    cells.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(CIRCLE_CLASS);
        cell.classList.remove('winning');
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    status.textContent = "Player X's turn";
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    
    placeMark(cell, currentClass);
    
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        updateStatus();
    }
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    // Add aria-label for accessibility
    cell.setAttribute('aria-label', currentClass);
}

function swapTurns() {
    circleTurn = !circleTurn;
}

function updateStatus() {
    status.textContent = `Player ${circleTurn ? 'O' : 'X'}'s turn`;
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
}

function endGame(draw) {
    if (draw) {
        status.textContent = "Draw!";
    } else {
        status.textContent = `Player ${circleTurn ? 'O' : 'X'} Wins!`;
        highlightWinningCombination(circleTurn ? CIRCLE_CLASS : X_CLASS);
    }
}

function highlightWinningCombination(winningClass) {
    WINNING_COMBINATIONS.some(combination => {
        if (combination.every(index => cells[index].classList.contains(winningClass))) {
            combination.forEach(index => cells[index].classList.add('winning'));
            return true;
        }
        return false;
    });
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS);
    });
}