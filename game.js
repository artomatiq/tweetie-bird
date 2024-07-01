window.onload = () => {
    document.body.style.visibility = 'visible';
};

const scoreBox = document.querySelector('.score');
const score = document.querySelector('.score-value');
const bird = document.querySelector('.bird');
const startMessage = document.querySelector('.start-message');
const gameOverMessage = document.querySelector('.game-over');

const ship1 = document.querySelector('#ship-1');
const ship2 = document.querySelector('#ship-2');
const ship3 = document.querySelector('#ship-3');
const ship4 = document.querySelector('#ship-4');

const ships = [ship1, ship2, ship3, ship4];

let gameState = 'start';

bird.style.display = 'none';
scoreBox.style.display = 'none';
gameOverMessage.style.display = 'none';
ships.forEach((ship) => {
    ship.style.display = 'none';
});



document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        gameState = 'play';
        startMessage.style.display = 'none';
        bird.style.display = 'block';
        scoreBox.style.display = 'block';
    }
});

