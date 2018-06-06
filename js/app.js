/*
 * Create a list that holds all of your cards
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
const starRating = document.querySelector('.stars');
const newGameButton = document.querySelector('.restart');

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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
// Shuffles the deck and lays the shuffled cards in order
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
  let stars = starRating.querySelectorAll('.fa');
  stars.forEach(function(star) {
    if (!star.classList.contains('fa-star')) {
      star.classList.add('fa-star');
    };
  });

};

function prepareGrid() {
  const allCards = document.querySelectorAll('.card');
  let openCards = [];
  let moves = 0;
  let matchedPairs = 0;

  allCards.forEach(function(card) {
    card.addEventListener('click', function(evt) {

      // If card is not turned yet, turn and add to list of open cards
      if (!card.classList.contains('open') && !card.classList.contains('show') && !card.classList.contains('match')) {
        card.classList.add('open', 'show');
        openCards.push(card);

      };
      // If two cards have been turned check whether they match
      if (openCards.length >= 2) {
        // Increment move counter and check star star rating
        // less than or equal to 15 three stars, 20 two stars, 25 one star
        moves = moves + 1;
        if (moves === 1) {
          moveCounter.textContent = '1 Move';
        }
        else {
          moveCounter.textContent = moves + ' Moves';
        };
        if (moves === 11 || moves === 16 || moves === 21) {
          let stars = starRating.querySelectorAll('.fa-star');
          stars[stars.length - 1].classList.remove('fa-star');
        };
        setTimeout(function (){
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
            if (matchedPairs === 8) {
              document.querySelector('h1').textContent = "Winner";
            };
          }
          else {
            openCards.forEach(function(card) {
              card.classList.add('no_match');
            });
          };
          openCards = [];
        }, 500);
      };
    });
  });
};


setUpNewGame();
prepareGrid();

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// Set up a new game if the new game button is pressed
newGameButton.addEventListener('click', function(evt) {
  setUpNewGame();
  prepareGrid();
});
