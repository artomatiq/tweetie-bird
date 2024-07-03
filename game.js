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
let velocity = 0;
const gravityConstant = 0.6;

const loops = {
    generateShipsInterval: null,
    slideShipsAnimation: null,
    clearShipsInterval: null,
    listenForCrashInterval: null,
    gravityAnimation: null,
}

let mode = gameStates.start;

document.addEventListener('keydown', handleEnter);

function handleEnter (e) {
    if (e.key === 'Enter') {
        if (mode === gameStates.play) return
        startGame();
    }
}

function handleSpace (e) {
    if (e.key === ' ') {
        jump();
    }
}




function generateShipsInterval () {
    loops.generateShipsInterval = setInterval(() => {
        const randomShip = generateRandomShip();
        document.querySelector('.background').appendChild(randomShip);
    }, 2500);
}

function listenForCrashInterval () {
    loops.listenForCrashInterval = setInterval(() => {
        if (mode === gameStates.play) {
            const birdBox = bird.getBoundingClientRect();
            document.querySelectorAll('.boundary-up, .boundary-down').forEach(ship => {
                const shipBox = ship.getBoundingClientRect();
                if (
                    //bird crashes with ship
                    (shipBox.left < birdBox.right &&
                    shipBox.right > birdBox.left &&
                    shipBox.top < birdBox.bottom && 
                    shipBox.bottom > birdBox.top)
                    || 
                    //bird crashes with window
                    birdBox.top < 0 || birdBox.bottom > window.innerHeight
                ) {
                        endGame();
                    }
            })
        }
    }, 10)
}




function startGame () {
    //set game mode to play
    mode = gameStates.play;
    //hide start message
    startMessage.style.display = 'none';
    //hide game over message
    gameOverMessage.style.display = 'none';
    //show the score box
    scoreBox.style.display = 'block';
    //show the bird
    bird.style.display = 'block';

    //reset values
    resetValues();
    //remove the jump event listener 
    document.removeEventListener('keydown', handleSpace);

    clearIntervalsAndAnimations();

    //listen for enter button
    document.addEventListener('keydown', handleEnter);
    //listen for jump button
    document.addEventListener('keydown', handleSpace)
    //start ships animation
    runShips();
    //start gravity and bird animation
    startGravity()
    //listen for crash
    listenForCrashInterval();
}

function startGravity () {
    function gravity () {
        velocity += gravityConstant;
        let position = parseInt(getComputedStyle(bird).top) + velocity;
        bird.style.top = `${position}px`;
    
        requestAnimationFrame(gravity);
    }

    loops.gravityAnimation = requestAnimationFrame(gravity);
}

function jump () {
    velocity = -9.5;
}

function runShips () {
    //create random ship every 5 seconds
    generateShipsInterval();

    function updateShipPositions() {
        document.querySelectorAll('.ships').forEach(ship => {
            ship.style.left = `${parseInt(getComputedStyle(ship).left) - 3}px`;
        });
        requestAnimationFrame(updateShipPositions);
    }
    //run all ships across the screen
    loops.slideShipsAnimation = requestAnimationFrame(updateShipPositions);

    //clear ships that are out of the screen every 10 seconds
    clearShipsInterval();
}



function generateRandomShip () {

    if (mode !== gameStates.play) return;

    const gaps = [
        {up: '100%', down: '100%'} ,
        {up: '100%', down: '50vh'}, 
        {up: '50vh', down: '100%'}
    ]
    let clone = ship.cloneNode(true);
    let gap = gaps[Math.floor(Math.random() * gaps.length)];
    clone.querySelector('#ship-up').style.height = gap.up;
    clone.querySelector('#ship-down').style.height = gap.down;
    clone.style.left = '100%';

    return clone;
}

function clearShipsInterval () {

    if (mode !== gameStates.play) return;

    loops.clearShipsInterval = setInterval(() => {
        document.querySelectorAll('.ships').forEach(ship => {
            if (parseInt(getComputedStyle(ship).left) < -100) {
                ship.remove();
            }
        })
    }, 10000)
}

function endGame () {
    mode = gameStates.crash;

    
    //reset values
    resetValues();
    //remove the jump event listener 
    document.removeEventListener('keydown', handleSpace);
    
    clearIntervalsAndAnimations();

    gameOverMessage.style.display = 'block';
    scoreBox.style.display = 'none';
    bird.style.display = 'none';
    document.querySelectorAll('.ships').forEach(shipPair => {
        shipPair.remove();
    })
}

function resetValues () {
    velocity = 0;
    bird.style.top = '50vh';
    score.textContent = 0;
}

function clearIntervalsAndAnimations() {
    // Clear all intervals
    if (loops.generateShipsInterval) {
        console.log('Clearing ships interval:', loops.generateShipsInterval);
        clearInterval(loops.generateShipsInterval);
        loops.generateShipsInterval = null;
    }
    if (loops.listenForCrashInterval) {
        console.log('Clearing crash detection interval:', loops.listenForCrashInterval);
        clearInterval(loops.listenForCrashInterval);
        loops.listenForCrashInterval = null;
    }
    if (loops.clearShipsInterval) {
        console.log('Clearing clear ships interval:', loops.clearShipsInterval);
        clearInterval(loops.clearShipsInterval);
        loops.clearShipsInterval = null;
    }
    // Cancel all animations
    if (loops.gravityAnimation) {
        console.log('Cancelling gravity animation:', loops.gravityAnimation);
        cancelAnimationFrame(loops.gravityAnimation);
        loops.gravityAnimation = null;
    }
    if (loops.slideShipsAnimation) {
        console.log('Cancelling ships animation:', loops.slideShipsAnimation);
        cancelAnimationFrame(loops.slideShipsAnimation);
        loops.slideShipsAnimation = null;
    }
}