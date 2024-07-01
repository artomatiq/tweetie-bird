window.onload = () => {
    document.body.style.visibility = 'visible';
};

const scoreBox = document.querySelector('.score');
const score = document.querySelector('.score-value');
const bird = document.querySelector('.bird');
const startMessage = document.querySelector('.start-message');
const gameOverMessage = document.querySelector('.game-over');

const ship1 = document.querySelector('#ship1-bounds');
const ship2 = document.querySelector('#ship2-bounds');
const ship3 = document.querySelector('#ship3-bounds');
const ship4 = document.querySelector('#ship4-bounds');

const ships = [ship1, ship2, ship3, ship4];

let gameState = 'start';

bird.style.display = 'none';
scoreBox.style.display = 'none';
gameOverMessage.style.display = 'none';
ships.forEach((ship) => {
    // ship.style.display = 'none';
    ship.position = ship.getBoundingClientRect();
});

console.log(ships[0].position);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        gameState = 'play';
        startMessage.style.display = 'none';
        bird.style.display = 'block';
        scoreBox.style.display = 'block';
    }
});

function runShips (ships) {
    setInterval( () => {

    }, )
}
