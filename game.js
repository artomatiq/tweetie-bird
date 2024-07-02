window.onload = () => {
    document.body.style.visibility = 'visible';
};
const scoreBox = document.querySelector('.score');
const score = document.querySelector('.score-value');
const bird = document.querySelector('.bird');
const startMessage = document.querySelector('.start-message');
const gameOverMessage = document.querySelector('.game-over');
const ship = document.querySelector('#ships1');
const gameStates = {
    start: 'start',
    play: 'play',
    crash: 'crash'
}

let mode = gameStates.start;

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        startGame();

        
    }
});

function startGame () {
    gameState = 'play';
    //hide start message
    startMessage.style.display = 'none';
    //show the score box
    scoreBox.style.display = 'block';
    //show the bird and allow it to fly
    bird.style.display = 'block';

    document.addEventListener('keydown', (e) => {
        if (e.key === ' ') {

        }
    })

    runShips();
    startGravity()
}




function startGravity () {
    let velocity = 0;
    const gravityConstant = 0.25;
    
    function gravity () {
        velocity += gravityConstant;
        let position = parseInt(getComputedStyle(bird).top) + velocity;
        bird.style.top = `${position}px`;
    
        requestAnimationFrame(gravity);
    }

    requestAnimationFrame(gravity);
}

function runShips () {

    //create random ship every 5 seconds
    setInterval(() => {
        const randomShip = generateRandomShip();
        document.querySelector('.background').appendChild(randomShip);
    }, 5000);

    //run all ships across the screen
    requestAnimationFrame(updateShipPositions);

    //clear ships that are out of the screen every 10 seconds
    clearShips();
}

function generateRandomShip () {
    const gaps = [
        {up: '100%', down: '100%'} ,
        {up: '100%', down: '50vh'}, 
        {up: '50vh', down: '100%'}
    ]
    let clone = ship.cloneNode(true);
    let gap = gaps[Math.floor(Math.random() * gaps.length)];
    console.log(gap)
    clone.querySelector('#ship-up').style.height = gap.up;
    clone.querySelector('#ship-down').style.height = gap.down;
    clone.style.left = '100%';

    return clone;
}

function updateShipPositions() {
    document.querySelectorAll('.ships').forEach(ship => {
        ship.style.left = `${parseInt(getComputedStyle(ship).left) - 1}px`;
    });
    requestAnimationFrame(updateShipPositions);
}

function clearShips () {
    setInterval(() => {
        document.querySelectorAll('.ships').forEach(ship => {
            if (parseInt(getComputedStyle(ship).left) < -100) {
                ship.remove();
            }
        })
    }, 10000)
}

// startGame();