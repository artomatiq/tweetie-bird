window.onload = () => {
    document.body.style.visibility = 'visible';
};
const scoreBox = document.querySelector('.score');
const scoreValue = document.querySelector('.score-value');
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
    trackScoreInterval: null,
    listenForCrashInterval: null,
    clearShipsInterval: null,

    slideShipsAnimation: null,
    gravityAnimation: null,
}

let score = 0;
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

function trackScoreInterval () {
    loops.trackScoreInterval = setInterval(() => {
        if (mode === gameStates.play) {
            document.querySelectorAll('.ships').forEach(ship => {
                if (parseInt(getComputedStyle(ship).left) < parseInt(getComputedStyle(bird).left) && !ship.isScored) {
                    score++;
                    scoreValue.textContent = score;
                    ship.isScored = true;
                }
            }
        )}
    }, 100)
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

    clearIntervalsAndAnimations();

    //remove enter button listener
    document.removeEventListener('keydown', handleEnter);
    //listen for enter button
    document.addEventListener('keydown', handleEnter);

    //remove jump button listener
    document.removeEventListener('keydown', handleSpace);
    //listen for jump button
    document.addEventListener('keydown', handleSpace)

    //start ships animation [ generateShipsInterval(), slideShipsAnimation(), clearShipsInterval() ]
    runShips();
    //start gravity animation [ gravity() ]
    startGravity()
    //start score tracking interval [ trackScoreInterval() ]
    trackScoreInterval();
    //start crash detection interval [ listenForCrashInterval() ]
    listenForCrashInterval();
}

function startGravity () {
    function gravity () {
        velocity += gravityConstant;
        let position = parseInt(getComputedStyle(bird).top) + velocity;
        bird.style.top = `${position}px`;
    
        loops.gravityAnimation = requestAnimationFrame(gravity);
    }

    loops.gravityAnimation = requestAnimationFrame(gravity);
}

function jump () {
    velocity = -9.5;
}

function runShips () {
    //create random ship every 5 seconds
    generateShipsInterval();

    function slideShipsAnimation() {
        document.querySelectorAll('.ships').forEach(ship => {
            ship.style.left = `${parseInt(getComputedStyle(ship).left) - 3}px`;
        });
        loops.slideShipsAnimation = requestAnimationFrame(slideShipsAnimation);
    }
    //run all ships across the screen
    loops.slideShipsAnimation = requestAnimationFrame(slideShipsAnimation);

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
    console.log('end game triggered. The score is: ', score)
    mode = gameStates.crash;

    clearIntervalsAndAnimations();

    //show final score
    const finalScore = document.querySelector('.final-score');
    finalScore.textContent = `Your Score: ${score}`;

    //reset values
    resetValues();

    //remove the jump event listener 
    document.removeEventListener('keydown', handleSpace);
    
    gameOverMessage.style.display = 'block';
    scoreBox.style.display = 'none';
    bird.style.display = 'none';

    //clear all ships
    document.querySelectorAll('.ships').forEach(shipPair => {
        shipPair.remove();
    })
}

function resetValues () {
    velocity = 0;
    bird.style.top = '50vh';
    score = 0;
    scoreValue.textContent = 0;
}

function clearIntervalsAndAnimations() {
    // Clear all intervals
    if (loops.generateShipsInterval) {
        clearInterval(loops.generateShipsInterval);
        loops.generateShipsInterval = null;
    }
    if (loops.listenForCrashInterval) {
        clearInterval(loops.listenForCrashInterval);
        loops.listenForCrashInterval = null;
    }
    if (loops.clearShipsInterval) {
        clearInterval(loops.clearShipsInterval);
        loops.clearShipsInterval = null;
    }
    if (loops.trackScoreInterval) {
        clearInterval(loops.trackScoreInterval);
        loops.trackScoreInterval = null;
    }
    // Cancel all animations
    if (loops.gravityAnimation) {
        cancelAnimationFrame(loops.gravityAnimation);
        loops.gravityAnimation = null;
    }
    if (loops.slideShipsAnimation) {
        cancelAnimationFrame(loops.slideShipsAnimation);
        loops.slideShipsAnimation = null;
    }
}