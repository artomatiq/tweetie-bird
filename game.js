const scoreBox = document.querySelector('.score');
const score = document.querySelector('.score-value');
const bird = document.querySelector('.bird');
const startMessage = document.querySelector('.start-message');

let gameState = 'start';

bird.style.display = 'none';
scoreBox.style.display = 'none';



document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        gameState = 'play';
        startMessage.style.display = 'none';
        bird.style.display = 'block';
        scoreBox.style.display = 'block';
    }
});

