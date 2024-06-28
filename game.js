const score = document.querySelector('.score-value');
const bird = document.querySelector('.bird');
const startMessage = document.querySelector('.start-message');

const gameState = 'start';

gameState === 'start' 
    ? bird.style.display = 'none'
    : startMessage.style.display = 'block'


