window.onload = () => {
    document.body.style.visibility = 'visible';
};
const scoreBox = document.querySelector('.score');
const scoreValue = document.querySelector('.score-value');
const bird = document.querySelector('.bird');
const startMessage = document.querySelector('.start-message');
const readyMessage = document.querySelector('.ready-message');
const gameOverMessage = document.querySelector('.game-over');
const ship = document.querySelector('#ships1');
const gameStates = {
    start: 'start',
    ready: 'ready',
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
        if (mode === gameStates.start) {
            getReady();
        }
        if (mode === gameStates.crash) {
            getReady();
        }
    }
}

function handleSpace (e) {
    if (e.key === ' ') {
        if (mode === gameStates.ready) {
            startGame();
        }
        if (mode === gameStates.play) {
            jump();
        }
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

    setTimeout(() => {
        bird.src = './assets/visual/animation/bird-flap-1.PNG'
    }, 0);
    setTimeout(() => {
        bird.src = './assets/visual/animation/bird-flap-2.PNG'
    }, 30);
    setTimeout(() => {
        bird.src = './assets/visual/animation/bird-flap-3.png'
    }, 60);
    setTimeout(() => {
        bird.src = './assets/visual/animation/bird-flap-0.png'
    }, 100);
    setTimeout(() => {
        bird.src = './assets/visual/animation/bird-flap-4.png'
    }, 110);
    setTimeout(() => {
        bird.src = './assets/visual/animation/bird-flap-5.png'
    }, 140);
    setTimeout(() => {
        bird.src = './assets/visual/animation/bird-flap-4.png'
    }, 180);
    setTimeout(() => {
        bird.src = './assets/visual/bird.png'
    }, 200);

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

function getReady () {
    mode = gameStates.ready;
    //hide
    startMessage.style.display = 'none';
    gameOverMessage.style.display = 'none';
    scoreBox.style.display = 'none';
    //show
    readyMessage.style.display = 'block';
    bird.style.display = 'block';

    document.addEventListener('keydown', handleSpace);
}

function startGame () {
    
    mode = gameStates.play;
    //hide
    readyMessage.style.display = 'none';
    //show
    scoreBox.style.display = 'block';

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