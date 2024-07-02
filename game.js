window.onload = () => {
    document.body.style.visibility = 'visible';
};

const scoreBox = document.querySelector('.score');
const score = document.querySelector('.score-value');
const bird = document.querySelector('.bird');
const startMessage = document.querySelector('.start-message');
const gameOverMessage = document.querySelector('.game-over');

const ships1 = document.querySelector('#ships1');
// const ships2 = document.querySelector('#ships2');
// const ships3 = document.querySelector('#ships3');

const ships = [
    ships1, 
    // ships2, 
    // ships3
];





let gameState = 'start';

//hide the bird
bird.style.display = 'none';

//hide the score box
scoreBox.style.display = 'none';

//hide the game over message
gameOverMessage.style.display = 'none';

//hide the ships and get their positions
ships.forEach((ship) => {
    // ship.style.display = 'none';
    ship.position = ship.getBoundingClientRect();
    console.log(ship);
});

// ships1.style.left = '100%';

console.log(getComputedStyle(ships1).left)

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
        // generate random integer for array index
        

        ships1.style.left = `${parseInt(getComputedStyle(ships1).left) - 1}px`;
    }, 20)
}

console.log(ships1)

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