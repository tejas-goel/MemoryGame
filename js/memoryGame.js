var symbols = ['bicycle', 'bicycle', 'leaf', 'leaf', 'cube', 'cube', 'anchor', 'anchor', 'paper-plane-o', 'paper-plane-o', 'bolt', 'bolt', 'bomb', 'bomb', 'diamond', 'diamond'],
		opened = [],
		match = 0,
		steps = 0,
		$deck = jQuery('.deck'),
		$scoreCard = $('#score-card'),
		$moveCount = $('.steps'),
		$rating = $('i'),
		$restart = $('.restart'),
		delay = 600,
		cardQty = symbols.length / 2,
		rank3stars = cardQty + 2,
		rank2stars = cardQty + 6,
		rank1stars = cardQty + 10;
//Shuffle Cards for array of cards passed
function shuffleCards(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;	
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
// Start Game
function startGame() {
  var cards = shuffleCards(symbols);
  $deck.empty();
  match = 0;
  steps = 0;
  $moveCount.text('0');
  $rating.removeClass('fa-star-o').addClass('fa-star');
	for (var i = 0; i < cards.length; i++) {
		$deck.append($('<li class="card"><i class="fa fa-' + cards[i] + '"></i></li>'))
	}
	addCardListener();
};

// Set Rating and final Score
function setRating(steps) {
	var rating = 3;
	if (steps > rank3stars && steps < rank2stars) {
		$rating.eq(2).removeClass('fa-star').addClass('fa-star-o');
		rating = 2;
	} else if (steps > rank2stars && steps < rank1stars) {
		$rating.eq(1).removeClass('fa-star').addClass('fa-star-o');
		rating = 1;
	} else if (steps > rank1stars) {
		$rating.eq(0).removeClass('fa-star').addClass('fa-star-o');
		rating = 0;
	}	
	return { score: rating };
};

// Stop Game and display steps taken to complete and score of player
function endGame(steps, score) {
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'Hey well done! You have Won!',
		text: 'With ' + steps + ' steps and ' + score + ' Stars.\n Woooooo!',
		type: 'success',
		confirmButtonColor: '#02ccba',
		confirmButtonText: 'Play again!'
	}).then(function(isConfirm) {
		if (isConfirm) {
			initGame();
		}
	})
}

// Restart Game if user select to restart
$restart.bind('click', function() {
  swal({
    allowEscapeKey: false,
    allowOutsideClick: false,
    title: 'Are you sure?',
    text: "Your progress will be Lost!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#02ccba',
    cancelButtonColor: '#f95c3c',
    confirmButtonText: 'Yes, Restart Game!'
  }).then(function(isConfirm) {
    if (isConfirm) {
      initGame();
    }
  })
});

var addCardListener = function() {

// Flip Card 
$deck.find('.card:not(".match, .open")').on('click' , function() {
	if($('.show').length > 1) { return true; }
	
	var $this = $(this),
			card = $this.context.innerHTML;
  $this.addClass('open show');
	opened.push(card);

	// Compare with opened cardif equal to early selected one
  if (opened.length > 1) {
    if (card === opened[0]) {
      $deck.find('.open').addClass('match animated infinite rubberBand');
      setTimeout(function() {
        $deck.find('.match').removeClass('open show animated infinite rubberBand');
      }, delay);
      match++;
    } else {
      $deck.find('.open').addClass('notmatch animated infinite wobble');
			setTimeout(function() {
				$deck.find('.open').removeClass('animated infinite wobble');
			}, delay / 1.5);
      setTimeout(function() {
        $deck.find('.open').removeClass('open show notmatch animated infinite wobble');
      }, delay);
    }
    opened = [];
		steps++;
		setRating(steps);
		$moveCount.html(steps);
  }
	
	// End Game if match all cards
	if (cardQty === match) {
		setRating(steps);
		var score = setRating(steps).score;
		setTimeout(function() {
			endGame(steps, score);
		}, 500);
  }
});
};
startGame();