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
    }

    return array;
}

// A function to set up the page
// Shuffles the deck and lays the shuffled cards in order
function shuffleCards() {
  shuffle(cards);
  let deckHTML = document.createElement('ul');
  deckHTML.classList.add('deck');
  let deckHTMLToAdd = '';
  cards.forEach(function(card) {
    newCard = `<li class="card"><i class="fa ${card}"></i></li>`
    deckHTMLToAdd = deckHTMLToAdd + newCard;
  });
  deckHTML.insertAdjacentHTML('beforeEnd', deckHTMLToAdd);
  const oldCards = document.querySelector('.deck');
  oldCards.replaceWith(deckHTML);
};

ShuffleCards();

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

const allCards = document.querySelectorAll('.card');
const moveCounter = document.querySelector('.moves');
let openCards = [];
let moves = 0;

allCards.forEach(function(card) {
  card.addEventListener('click', function(evt) {
    // If card is not turned yet, turn and add to list of open cards
    // Increment and update the move counter
    if (!card.classList.contains('open') && !card.classList.contains('show') && !card.classList.contains('match')) {
      card.classList.add('open', 'show');
      openCards.push(card);
      moves = moves + 1;
      if (moves === 1) {
        moveCounter.textContent = '1 Move';
      }
      else {
        moveCounter.textContent = moves + ' Moves';
      };
    };
    // If two cards have been turned check whether they match
    if (openCards.length >= 2) {
      setTimeout(function (){
        openCards.forEach(function(card) {
          card.classList.remove('open', 'show');
        });
        // If cards match leave unturned and change background color
        console.log(openCards[0].querySelector('.fa'));
        if (openCards[0].querySelector('.fa').classList.value === openCards[1].querySelector('.fa').classList.value) {
          openCards.forEach(function(card) {
            card.classList.add('match');
          });
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
