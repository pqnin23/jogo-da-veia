// script.js
const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset');
const gameModeSelect = document.getElementById('gameMode');

let currentPlayer = 'X';
let gameActive = true;
let gameState = Array(9).fill('');
let gameMode = 'twoPlayers';

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const clickSound = document.getElementById('clickSound');
const gameOverSound = document.getElementById('gameOverSound');
const victorySound = document.getElementById('victorySound');

// Atualiza o modo de jogo quando o usuário seleciona
gameModeSelect.addEventListener('change', () => {
    gameMode = gameModeSelect.value;
    resetGame();
});

const animateCell = (cell) => {
    cell.classList.add('animate');
    setTimeout(() => {
        cell.classList.remove('animate');
    }, 300);
};

const playClickSound = () => {
    clickSound.currentTime = 0; // Reinicia o som se já estiver tocando
    clickSound.play();
};

const computerTurn = () => {
    if (!gameActive) return;

    const emptyCells = gameState.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const cellIndex = emptyCells[randomIndex];

    gameState[cellIndex] = currentPlayer;
    cells[cellIndex].textContent = currentPlayer;
    cells[cellIndex].classList.add(currentPlayer.toLowerCase());
    animateCell(cells[cellIndex]);
    playClickSound();
    
    checkWinner();
    currentPlayer = 'X';
};

const handleCellClick = (event) => {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());
    animateCell(clickedCell);
    playClickSound();

    checkWinner();

    if (gameActive) {
        if (gameMode === 'computer' && currentPlayer === 'X') {
            currentPlayer = 'O';
            setTimeout(computerTurn, 500);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            message.textContent = `Turno do jogador ${currentPlayer}`;
        }
    }
};

const checkWinner = () => {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const condition = winningConditions[i];
        const a = gameState[condition[0]];
        const b = gameState[condition[1]];
        const c = gameState[condition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        if (gameMode === 'computer' && currentPlayer === 'X') {
            message.textContent = 'Você venceu!';
        } else if (gameMode === 'computer' && currentPlayer === 'O') {
            message.textContent = 'Você perdeu!';
        } else {
            message.textContent = `Jogador ${currentPlayer} ganhou!`;
        }
        gameActive = false;
        victorySound.play();
        return;
    }

    if (!gameState.includes('')) {
        message.textContent = 'Empate!';
        gameActive = false;
        gameOverSound.play();
        return;
    }
};

const resetGame = () => {
    gameActive = true;
    currentPlayer = 'X';
    gameState.fill('');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
    message.textContent = `Turno do jogador ${currentPlayer}`;
};

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

resetButton.addEventListener('click', resetGame);
message.textContent = `Turno do jogador ${currentPlayer}`;
