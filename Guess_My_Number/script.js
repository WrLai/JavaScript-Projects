'use strict';
//select method
// NOTE DOM: Document Object Model -> change text, html attributes and even CSS styles.
// console.log(document.querySelector('.message').textContent);
// document.querySelector('.message').textContent = 'Correct Number!';
// document.querySelector('.number').textContent = 13;
// document.querySelector('.score').textContent = 10;
// NOTE For an input field, we use .value to get the value property
// document.querySelector('.guess').value = 23;
// NOTE eventlistener + event handler
let secretNumber = Math.trunc(Math.random() * 20) + 1;
console.log(secretNumber);
let maxScore = 0;
let score = 20;
// Helper Functions
const displayMessage = function (string) {
  document.querySelector('.message').textContent = string;
};

//Event for check button
document.querySelector('.check').addEventListener('click', function () {
  console.log(score);
  const guess = Number(document.querySelector('.guess').value);
  document.querySelector('.highscore').textContent = maxScore;
  // When no input
  if (!guess) {
    displayMessage('You need to input a valid number!');
    //   When player wins
  } else if (guess === secretNumber) {
    displayMessage(`That's the correct number!`);
    document.querySelector('.number').textContent = secretNumber;
    document.querySelector('body').style.backgroundColor = '#60b347';
    document.querySelector('.number').style.width = '30rem';
    if (score > maxScore) {
      document.querySelector('.highscore').textContent = score;
      maxScore = score;
    }
    // When too high/too low
  } else if (guess !== secretNumber) {
    if (score > 0) {
      displayMessage(guess > secretNumber ? 'Too high!' : 'Too Low!');
      score--;
      document.querySelector('.score').textContent = score;
    }
  }
  //   else if (guess > secretNumber) {
  //     if (score > 0) {
  //       document.querySelector('.message').textContent =
  //         'Your number is higher than the secret number!';
  //       score--;
  //       document.querySelector('.score').textContent = score;
  //     }
  //     // When too low
  //   } else if (guess < secretNumber) {
  //     if (score > 1) {
  //       document.querySelector('.message').textContent =
  //         'Your number is Lower than the secret number!';
  //       score--;
  //       document.querySelector('.score').textContent = score;
  //     }}
  // when score is 0
  //   else if (score === 0) {
  //     displayMessage(`You LOST!`);
  //   }

  if (score === 0) {
    displayMessage(`You Lost!`);
  }
});

//Event for Again button
document.querySelector('.again').addEventListener('click', function () {
  displayMessage('Start guessing...');
  document.querySelector('.score').textContent = 20;
  document.querySelector('.number').textContent = '?';
  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.number').style.width = '15rem';
  document.querySelector('.guess').value = null;
  secretNumber = Math.trunc(Math.random() * 20) + 1;
  document.querySelector('.highscore').textContent = maxScore;
  score = 20;
  console.log(secretNumber);
});
