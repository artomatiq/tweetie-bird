//loading
window.onload = () => {
    document.body.style.visibility = 'visible';
    localStorage.setItem('highScore', '0')

};
//mobile configs
function isMobile() {
    const userAgent = navigator.userAgent || window.opera;

    return /android|webos|iphone|ipad|ipod/i.test(userAgent)
        && !/windows|macintosh|linux|x11|cros/i.test(userAgent);
}

if (isMobile()) {
    const startMessageH3 = document.querySelector('.start-message h3');
    startMessageH3.textContent = 'Tap to Start';

    const readyMessageH1 = document.querySelector('.ready-message h1');
    readyMessageH1.textContent = 'Tap to Jump';

    const restartMessageH2 = document.querySelector('.restart-message');
    restartMessageH2.textContent = 'Tap to Restart';
}
//score
const scoreBox = document.querySelector('.score');
const scoreValue = document.querySelector('.score-value');
const highScorePlay = document.querySelector('.high-score-play');
const highScoreCrash = document.querySelector('.high-score-crash')
//sprites
const bird = document.querySelector('.bird');
const ship = document.querySelector('#ships1');
const surprisedElon = document.querySelector('.surprised-elon');
const laughingElon = document.querySelector('.laughing-elon');
const thoughtImg = document.querySelector('.thought');
//message boxes
const startMessage = document.querySelector('.start-message');
const readyMessage = document.querySelector('.ready-message');
const gameOverMessage = document.querySelector('.game-over');
//jump-frames
const birdFlap1 = birdFlap1Data;
const birdFlap2 = birdFlap2Data;
const birdFlap3 = birdFlap3Data;
const birdFinal = birdFinalData;

const birdFrames = [
    birdFlap1,
    birdFlap2,
    birdFlap3,
    birdFlap2,
    birdFlap1,
    birdFlap2,
    birdFlap3,
    birdFlap2,
    birdFlap1,
    birdFinal
];

//game states
const gameStates = {
    start: 'start',
    ready: 'ready',
    play: 'play',
    crash: 'crash',
}
const loops = {
    //interval IDs
    generateShipsInterval: null,
    trackScoreInterval: null,
    listenForCrashInterval: null,
    clearShipsInterval: null,
    runLaughingElon: null,
    runSurprisedElon: null,
    //animation IDs
    slideShipsAnimation: null,
    gravityAnimation: null,
}
//constants and variables
let velocity = 0;
const gravityConstant = 0.6;
let score = 0;
let surpriseCounter = 0
let mode = gameStates.start;

// laughingElon.style.display = 'block'
// thoughtImg.style.display = 'block'

//use local storage to track high score
if (!localStorage.getItem('highScore')) {
    localStorage.setItem('highScore', '0')
}

if (isMobile()) {
    //listen for tap
    document.addEventListener('touchstart', handleTap);
}
else {
    //listen for enter button
    document.addEventListener('keydown', handleEnter);
}


//clear local storage on reload
window.addEventListener('beforeunload', function () {
    localStorage.clear();
});


function handleEnter(e) {
    if (e.key === 'Enter') {
        if (mode === gameStates.play) return
        if (laughingElon.style.display === 'block') return

        if (mode === gameStates.start) {
            getReady();
        }
        if (mode === gameStates.crash) {
            getReady();
        }
    }
}

function handleTap() {
    if (mode === gameStates.start) {
        console.log('getting ready');
        getReady();
        return
    }
    if (mode === gameStates.play) {
        jump();
        return
    }
    if (laughingElon.style.display === 'block') return

    if (mode === gameStates.crash) {
        getReady();
        return
    }
    if (mode === gameStates.ready) {
        startGame();
        jump();
        return
    }
}

function handleSpace(e) {
    if (e.key === ' ') {
        if (mode === gameStates.ready) {
            startGame();
        }
        if (mode === gameStates.play) {
            jump();
        }
    }
}

function generateShipsInterval() {
    loops.generateShipsInterval = setInterval(() => {
        const randomShip = generateRandomShip();
        document.querySelector('.background').appendChild(randomShip);
    }, 2500);
}

function listenForCrashInterval() {
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

                    runLaughingElon();
                    endGame();
                }
            })
        }
    }, 10)
}

function trackScoreInterval() {
    highScorePlay.textContent = `High: ${localStorage.getItem('highScore')}`
    loops.trackScoreInterval = setInterval(() => {
        if (mode === gameStates.play) {
            document.querySelectorAll('.ships').forEach(ship => {
                if (parseInt(getComputedStyle(ship).left) < parseInt(getComputedStyle(bird).left) && !ship.isScored) {
                    score++;
                    if (JSON.parse(localStorage.getItem('highScore')) < score) {
                        highScorePlay.textContent = `High: ${score}`;
                        localStorage.setItem('highScore', `${score}`)
                    }
                    if (JSON.parse(localStorage.getItem('highScore')) >= 2 + surpriseCounter * 3) {
                        runSurprisedElon();
                    }
                    scoreValue.textContent = score;
                    ship.isScored = true;
                }
            }
            )
        }
    }, 100)
}

function startGravity() {

    // function gravity() {
    //     velocity += gravityConstant;
    //     let position = parseInt(getComputedStyle(bird).top) + velocity;
    //     bird.style.top = `${position}px`;

    //     loops.gravityAnimation = requestAnimationFrame(gravity);
    // }

    // loops.gravityAnimation = requestAnimationFrame(gravity);




    let previousTime = null;

    function gravity(currentTime) {
        if (!previousTime) {
            previousTime = currentTime;
        }
        let dt = (currentTime - previousTime) / 1000;
        velocity += gravityConstant * dt * 60;
        let position = parseInt(getComputedStyle(bird).top) + velocity * dt * 60;
        bird.style.top = `${position}px`;

        previousTime = currentTime;
        loops.gravityAnimation = requestAnimationFrame(gravity);
        
    }

    loops.gravityAnimation = requestAnimationFrame(gravity);

}



function jump() {
    const x = 32;

    birdFrames.forEach((frame, index) => {
        setTimeout(() => {
            bird.src = frame;
        }, index * x);
    });

    velocity = -9.5;
}

function runShips() {
    //create random ship every 5 seconds
    generateShipsInterval();








    // function slideShipsAnimation() {
    //     document.querySelectorAll('.ships').forEach(ship => {
    //         ship.style.left = `${parseInt(getComputedStyle(ship).left) - 3}px`;
    //     });
    //     loops.slideShipsAnimation = requestAnimationFrame(slideShipsAnimation);
    // }
    // //run all ships across the screen
    // loops.slideShipsAnimation = requestAnimationFrame(slideShipsAnimation);






    let previousTime = null;

    function slideShipsAnimation(currentTime) {
        if (!previousTime) {
            previousTime = currentTime;
        }
        let dt = (currentTime - previousTime) / 1000;
        // if (currentTime - previousTime > 100000) {
            document.querySelectorAll('.ships').forEach(ship => {
                ship.style.left = `${(parseInt(getComputedStyle(ship).left) - 1 * dt * 120)}px`;
            });
        // }

        previousTime = currentTime;
        loops.slideShipsAnimation = requestAnimationFrame(slideShipsAnimation);
    }
    loops.slideShipsAnimation = requestAnimationFrame(slideShipsAnimation);



    //clear ships that are out of the screen every 10 seconds
    clearShipsInterval();


}

let firstPlay = true;

function generateRandomShip() {

    if (mode !== gameStates.play) return;

    const differences = [0, 30, 30, 30, 40, 20, 20]
    let clone = ship.cloneNode(true);
    let gap = differences[Math.floor(Math.random() * differences.length)];
    if (firstPlay) {
        gap = 0;
    }
    clone.querySelector('#ship-up').style.height = `${100 - gap}%`;
    clone.querySelector(`#bounds-up`).style.height = `${100 - gap}%`;
    clone.querySelector('#ship-down').style.height = `${100 + gap}%`;
    clone.querySelector(`#bounds-down`).style.height = `${100 + gap}%`;
    clone.style.left = '100%';

    firstPlay = false;
    return clone;
}

function clearShipsInterval() {

    if (mode !== gameStates.play) return;

    loops.clearShipsInterval = setInterval(() => {
        document.querySelectorAll('.ships').forEach(ship => {
            if (parseInt(getComputedStyle(ship).left) < -100) {
                ship.remove();
            }
        })
    }, 10000)
}

function getReady() {
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

function startGame() {

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

async function endGame() {
    mode = gameStates.crash;

    //hide objects
    scoreBox.style.display = 'none';
    bird.style.display = 'none';

    clearIntervalsAndAnimations();

    //clear all ships
    document.querySelectorAll('.ships').forEach(shipPair => {
        shipPair.remove();
    })

    //remove the jump event listener 
    document.removeEventListener('keydown', handleSpace);

    //run laughing elon
    await runLaughingElon();

    //show game over message
    const finalScore = document.querySelector('.final-score');
    finalScore.textContent = `Your Score: ${score}`;
    highScoreCrash.textContent = `High Score: ${localStorage.getItem('highScore')}`
    gameOverMessage.style.display = 'block';

    //reset values
    resetValues();
}

function resetValues() {
    velocity = 0;
    bird.style.top = '50vh';
    score = 0;
    surpriseCounter = 0;
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

function runSurprisedElon() {
    if (isMobile()) return
    surpriseCounter++;
    surprisedElon.style.display = 'block';
    surprisedElon.classList.add('animate');
    setTimeout(() => {
        surprisedElon.classList.remove = 'animate';
        surprisedElon.style.display = 'none';
    }, 1000)
}

function runLaughingElon() {
    return new Promise((resolve) => {
        surprisedElon.style.display = 'none';

        laughingElon.style.display = 'block';
        laughingElon.classList.add('animate');

        runThoughtCloud();

        setTimeout(() => {
            laughingElon.classList.remove = 'animate';
            laughingElon.style.display = 'none';
            resolve();
        }, 2900)
    })


    function runThoughtCloud() {

        thoughtImg.src = './assets/visual/thought/thought-1.png'
        thoughtImg.style.display = 'block';

        setTimeout(() => {
            thoughtImg.src = './assets/visual/thought/thought-2.png'
        }, 250);
        setTimeout(() => {
            thoughtImg.src = './assets/visual/thought/thought-3.png'
        }, 500);
        setTimeout(() => {
            thoughtImg.src = './assets/visual/thought/thought-4.png'
        }, 850);
        setTimeout(() => {
            thoughtImg.style.display = 'none';
        }, 2900);

    }
}