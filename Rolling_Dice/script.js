'use strict';

// Selecting elements
const score0Element = document.querySelector('#score--0');
const score1Element = document.getElementById('score--1');
const player0Element = document.querySelector('.player--0');
const player1Element = document.querySelector('.player--1');
const diceElement = document.querySelector('.dice');
const rollDiceBtn = document.querySelector('.btn--roll');
const newBtn = document.querySelector('.btn--new');
const holdBtn = document.querySelector('.btn--hold');
const currentScore0 = document.getElementById('current--0');
const currentScore1 = document.getElementById('current--1');

let score;
let currentScore;
let activePlayer;
let gameState;

const init = function () {
  score1Element.textContent = 0;
  score0Element.textContent = 0;
  currentScore0.textContent = 0;
  currentScore1.textContent = 0;
  diceElement.classList.add('hidden');
  document.querySelector(`.player--0`).classList.remove('player--winner');
  document.querySelector(`.player--1`).classList.remove('player--winner');
  document.querySelector(`.player--0`).classList.add('player--active');
  document.querySelector(`.player--1`).classList.remove('player--active');
  gameState = true;
  currentScore = 0;
  activePlayer = 0;
  score = [0, 0];
};

init();
// The reason why classList was used here is "add" is in there, and we need it to add hidden class we created to the class in order to hide the class.
const hideDice = function () {
  diceElement.classList.add('hidden');
};
hideDice();

rollDiceBtn.addEventListener('click', function () {
  // Generate random number from 1-6
  if (gameState === true) {
    const dice = Math.trunc(Math.random() * 6) + 1;
    diceElement.classList.remove('hidden');
    diceElement.src = `dice-${dice}.png`;
    currentScore = 0;
    // If its not 1, add number to current
    //   if (score[0] <= 100 && score[1] <= 100) {

    if (dice !== 1) {
      currentScore = Number(
        document.getElementById(`current--${activePlayer}`).textContent
      );
      currentScore += dice;
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
    } else {
      switchPlayer();
    }
  }
  //   if (activePlayer === 0) {
  //     if (dice !== 1) {
  //       currentScore = Number(currentScore0.textContent);
  //       currentScore += dice;
  //       currentScore0.textContent = currentScore;
  //     } else if (dice === 1) {
  //       currentScore0.textContent = 0;
  //       activePlayer = activePlayer === 1 ? 0 : 1;
  //       player1Element.classList.toggle('player--active');
  //       player0Element.classList.toggle('player--active');
  //     }
  //   } else {
  //     if (dice !== 1) {
  //       currentScore = Number(currentScore1.textContent);
  //       currentScore += dice;
  //       currentScore1.textContent = currentScore;
  //     } else {
  //       currentScore1.textContent = 0;
  //       activePlayer = activePlayer === 0 ? 1 : 0;
  //       player0Element.classList.toggle('player--active');
  //       player1Element.classList.toggle('player--active');
  //     }
  //   }
  //   }
  // } else {
  //   if (score[0] >= 100) {
  //     player0Element.classList.remove('player--active');
  //   } else {
  //     player1Element.classList.remove('player--active');
  //   }
});

newBtn.addEventListener('click', init);

const switchPlayer = function () {
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  activePlayer = activePlayer === 1 ? 0 : 1;
  currentScore = 0;
  player1Element.classList.toggle('player--active');
  player0Element.classList.toggle('player--active');
};

holdBtn.addEventListener('click', function () {
  // switch player
  if (gameState) {
    score[activePlayer] += currentScore;
    console.log(score[activePlayer]);
    document.getElementById(`score--${activePlayer}`).textContent =
      score[activePlayer];
    document.getElementById(`current--${activePlayer}`).textContent = 0;
    //   activePlayer = activePlayer === 0 ? 1 : 0;
    //   if (activePlayer === 0) {
    //     score[0] += Number(currentScore0.textContent);
    //     score0Element.textContent = score[0];
    //     currentScore0.textContent = 0;
    //     activePlayer = 1;
    //     player0Element.classList.toggle('player--active');
    //     player1Element.classList.toggle('player--active');
    //   } else {
    //     score[1] += Number(currentScore1.textContent);
    //     score1Element.textContent = score[1];
    //     currentScore1.textContent = 0;
    //     activePlayer = 0;
    //     player0Element.classList.toggle('player--active');
    //     player1Element.classList.toggle('player--active');
    //   }
    if (score[activePlayer] >= 100) {
      console.log(`Player ${activePlayer} won!`);
      gameState = false;
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove('player--active');
      diceElement.classList.add('hidden');
    } else {
      switchPlayer();
    }
  }
});
