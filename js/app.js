/*
 * Create a list that holds of the cards
 */
const cards = ['fa-diamond', 'fa-diamond',
               'fa-paper-plane-o', 'fa-paper-plane-o',
               'fa-anchor', 'fa-anchor',
               'fa-bolt', 'fa-bolt',
               'fa-cube', 'fa-cube',
               'fa-bicycle', 'fa-bicycle',
               'fa-leaf', 'fa-leaf',
               'fa-bomb', 'fa-bomb',
               ];


/*
 * Declare global variables
 */
const moveCounter = document.querySelector('.moves');
const starDisplay = document.querySelector('.stars');
const container = document.querySelector('.container');
let newGameButton = document.querySelector('.restart');
let gameTime = document.querySelector('.currentTime');
let timeElapsed;
let minutesElapsed = '';
let secondsElapsed = '';


/*
 * A timer function
 */
function timer() {
  let minutes = 0;
  let seconds = 0;
  timeElapsed = setInterval(function() {
    seconds = seconds + 1;
    if (seconds == 60) {
      minutes = minutes + 1;
      seconds = 0
    };
    if (seconds < 10) {
      secondsElapsed = `0${seconds}`;
    }
    else {
      secondsElapsed = `${seconds}`;
    };
    if (minutes < 10) {
      minutesElapsed = `0${minutes}`;
    }
    else {
      minutesElapsed = `${minutes}`;
    };
    gameTime.textContent = `${minutesElapsed}:${secondsElapsed}`;
  }, 1000);
};


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    };
    return array;
};


// A function to set up the page
// Shuffles the deck using the shuffle function
// Creates HTML or each card and lays the shuffled cards in order by adding HTML to the page
// Reset the move counter to zero and the star rating to three
function setUpNewGame() {

  // Shuffle deck and re-deal cards
  shuffle(cards);
  let deckHTML = document.createElement('ul');
  deckHTML.classList.add('deck');
  let deckHTMLToAdd = '';
  cards.forEach(function(card) {
    newCard = `<li class="card"><i class="fa ${card}"></i></li>`;
    deckHTMLToAdd = deckHTMLToAdd + newCard;
  });
  deckHTML.insertAdjacentHTML('beforeEnd', deckHTMLToAdd);
  const oldCards = document.querySelector('.deck');
  oldCards.replaceWith(deckHTML);

  // Reset move counter
  moveCounter.textContent = '0 Moves';

  // Reset star rating
  let stars = starDisplay.querySelectorAll('.fa');
  stars.forEach(function(star) {
    if (!star.classList.contains('fa-star')) {
      star.classList.add('fa-star');
    };
    if (star.classList.contains('fa-star-o')) {
      star.classList.remove('fa-star-o');
    };
  });
};


// A function that, if card is not turned yet, turns it and adds to list of open cards
function revealCard(card, openCards) {
  if (!card.classList.contains('open') && !card.classList.contains('show') && !card.classList.contains('match')) {
    card.classList.add('open', 'show');
    openCards.push(card);
  };
};


// A function to increment the move moveCounter
function incrementMoveCounter(moves) {
  if (moves === 1) {
    moveCounter.textContent = '1 Move';
  }
  else {
    moveCounter.textContent = moves + ' Moves';
  };
  if (moves === 5 || moves === 16 || moves === 21) {
    removeStar();
  };
};


// A function to remove a star if necessary
function removeStar(starRating) {
  let stars = starDisplay.querySelectorAll('.fa-star');
  stars[stars.length - 1].classList.remove('fa-star');
  stars[stars.length - 1].classList.add('fa-star-o');
};


// A function to either turn cards back over if they don't match
// Or to change the backgroun color and leave the cards overturned if they do match
// Parameters are an array of open cards, the number of pairs matched so far and the number of moves taken
// Returns the number of pairs matched (which gets incremented by 1 if the open cards match)
function checkForMatch(openCards, matchedPairs, moves) {
  openCards.forEach(function(card) {
    card.classList.remove('open', 'show');
  });
  // If cards match leave unturned and change background color
  if (openCards[0].querySelector('.fa').classList.value === openCards[1].querySelector('.fa').classList.value) {
    openCards.forEach(function(card) {
      card.classList.add('match');
    });

    // Increment the match counter by 1
    matchedPairs = matchedPairs + 1;

    // If all pairs have been matched then display a congratulatory message, stop timer
    if (matchedPairs === 8) {
        displayVictoryMessage(moves);
    };
  }
  else {
    openCards.forEach(function(card) {
      card.classList.add('no_match');
    });
    setTimeout(function() {
      openCards.forEach(function(card) {
        card.classList.remove('no_match');
      });
    }, 1000);
  };
  return matchedPairs;
};

// A function which displays a vicotry message including a button to start a new game
function displayVictoryMessage(moves) {

  // Get the star rating for the game
  let starRating = starDisplay.querySelectorAll('.fa-star').length;

  // Create the HTML for the victory message
  let victoryHTML = document.createElement('div');
  victoryHTML.classList.add('container');
  let victoryText = '<h1>Congratulations, you defeated the matching game!</h1>';
  victoryText = `${victoryText} <h2>You took ${moves} moves</h2>`;
  victoryText = `${victoryText} <h2>With a star rating of ${starRating} stars</h2>`;
  victoryText = `${victoryText} <h4>It took you ${minutesElapsed} minutes and ${secondsElapsed} seconds</h2>`;
  victoryHTML.insertAdjacentHTML('beforeEnd', victoryText);
  let victoryButton = '<button type="button" class="replay">Play again</button>';
  victoryHTML.insertAdjacentHTML('beforeEnd', victoryButton);

  // Replace the content of the page with the victory message
  container.replaceWith(victoryHTML);

  // Add an event listener to the replay button to start a new game if desired
  replayButton = document.querySelector('.replay');
  replayButton.addEventListener('click', function(evt) {
    victoryHTML.replaceWith(container);
    startGame();
  });
};


// A function to set up all the game logic, to be called at the start of any game
function prepareGrid() {
  const allCards = document.querySelectorAll('.card');
  let openCards = [];
  let moves = 0;
  let matchedPairs = 0;
  let bothCardsTurned = 0;

  allCards.forEach(function(card) {
    card.addEventListener('click', function(evt) {

      // Only turn over cards if zero or one cards have been turned so far
      if (bothCardsTurned === 0) {

        // If card is not turned yet, turn and add to list of open cards
        revealCard(card, openCards);

        // If two cards have been turned then increment the move counter and check whether the cards match
        if (openCards.length === 2) {
          bothCardsTurned = 1;
          moves++;
          incrementMoveCounter(moves);
          matchedPairs = checkForMatch(openCards, matchedPairs, moves);

          // Empty the array of open cards
          openCards = [];

          // After the cards turn back over or match, reset this variables
          setTimeout(function() {
            bothCardsTurned = 0;
          }, 1000);

        };
      };
    });
  });
};

// A function to start a new game
// To be called upon loading the page, as well as when a restart button is clicked by the user
function startGame() {
  setUpNewGame();
  prepareGrid();
  clearInterval(timeElapsed);
  timer();
};

// Start the game on loading the page
startGame();

// Set up a new game if the new game button is pressed
newGameButton.addEventListener('click', function(evt) {
  startGame();
});
