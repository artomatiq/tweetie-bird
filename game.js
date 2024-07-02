window.onload = () => {
    document.body.style.visibility = 'visible';
};

const scoreBox = document.querySelector('.score');
const score = document.querySelector('.score-value');
const bird = document.querySelector('.bird');
const startMessage = document.querySelector('.start-message');
const gameOverMessage = document.querySelector('.game-over');

const ship = document.querySelector('#ships1');

let gameState = 'start';

//hide the bird
bird.style.display = 'none';

//hide the score box
scoreBox.style.display = 'none';

//hide the game over message
gameOverMessage.style.display = 'none';

//hide the ship
// ship.style.display = 'none';

// ship.style.left = '100%';

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        gameState = 'play';
        startMessage.style.display = 'none';
        bird.style.display = 'block';
        scoreBox.style.display = 'block';
    }
});

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

// runShips()












//find the difference between the .ships
//have only one ship in HTML and programatically generate the rest of them by cloning the first one
//append them to the document at consistent intervals to have them run across the screen
//remove them from the document when they reach the end of the screen



/* #ship-2-up {
	height: 100%;
}

#ship-2-down {
	height: 50vh;
} */




/* #ship-3-up {
	height: 50vh;
}

#ship-3-down {
	height: 100%;
} */