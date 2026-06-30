window.onload = function () {
 
  var gameBoard = [
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
	[1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
	[0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
	[2, 0, 2, 0, 2, 0, 2, 0, 2, 0]
  ];
  
  var pieces = [];
  var tiles = [];
  
  let mydata = [];
  
    let timing = false;
	var minutes = 0; 
	var seconds = 0; 
	var appendseconds = document.getElementById("seconds")
	var appendminutes = document.getElementById("minutes")
	var buttonStart = document.getElementById('button-start');
	var buttonStop = document.getElementById('button-stop');
	var buttonReset = document.getElementById('button-reset');
	var Interval;
	
	
	let score;
	let whiteTurns = 0;
	let blackTurns = 0;
	let duration;
	
	let AI = false;
	
	let customStyle = false;
	
	let whitePiecesLeft = 20;
	let blackPiecesLeft = 20;
	
	let whitePiecesLeftDiv = document.getElementById("whitePiecesLeft");
	let blackPiecesLeftDiv = document.getElementById("blackPiecesLeft");
  
	whitePiecesLeftDiv.innerHTML = whitePiecesLeft + " Pieces Left";
	blackPiecesLeftDiv.innerHTML = blackPiecesLeft + " Pieces Left";

  //distance formula
  var dist = function (x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
  }
  //Piece object - there are 40 instances of them in a checkers game
  function Piece(element, position) {
    // when jump exist, regular move is not allowed
    // since there is no jump at round 1, all pieces are allowed to move initially
    this.allowedtomove = true;
    //linked DOM element
    this.element = element;
    //positions on gameBoard array in format row, column
    this.position = position;
    //which player's piece i it
    this.player = '';
    //figure out player by piece id
    if (this.element.attr("id") < 20)
      this.player = 1;
    else
      this.player = 2;
    //makes object a king
    this.king = false;
    this.makeKing = function () {
      this.element.css("backgroundImage", "url('../img/king1.png')");
      this.king = true;
    }
    //moves the piece
    this.move = function (tile) {
      this.element.removeClass('selected');
      if (!Board.isValidPlacetoMove(tile.position[0], tile.position[1])) return false;
      //make sure piece doesn't go backwards if it's not a king
      if (this.player == 1 && this.king == false) {
        if (tile.position[0] < this.position[0]) return false;
      } else if (this.player == 2 && this.king == false) {
        if (tile.position[0] > this.position[0]) return false;
      }
      //remove the mark from Board.board and put it in the new spot
      Board.board[this.position[0]][this.position[1]] = 0;
      Board.board[tile.position[0]][tile.position[1]] = this.player;
      this.position = [tile.position[0], tile.position[1]];
      //change the css using board's dictionary
      this.element.css('top', Board.dictionary[this.position[0]]);
      this.element.css('left', Board.dictionary[this.position[1]]);
      //if piece reaches the end of the row on opposite side crown it a king (can move all directions)
      if (!this.king && (this.position[0] == 0 || this.position[0] == 9))
        this.makeKing();
      return true;
    };

    //tests if piece can jump anywhere
    this.canJumpAny = function () {
      return (this.canOpponentJump([this.position[0] + 2, this.position[1] + 2]) ||
        this.canOpponentJump([this.position[0] + 2, this.position[1] - 2]) ||
        this.canOpponentJump([this.position[0] - 2, this.position[1] + 2]) ||
        this.canOpponentJump([this.position[0] - 2, this.position[1] - 2]))
    };

    //tests if an opponent jump can be made to a specific place
    this.canOpponentJump = function (newPosition) {
      //find what the displacement is
      var dx = newPosition[1] - this.position[1];
      var dy = newPosition[0] - this.position[0];
      //make sure object doesn't go backwards if not a king
      if (this.player == 1 && this.king == false) {
        if (newPosition[0] < this.position[0]) return false;
      } else if (this.player == 2 && this.king == false) {
        if (newPosition[0] > this.position[0]) return false;
      }
      //must be in bounds
      if (newPosition[0] > 9 || newPosition[1] > 9 || newPosition[0] < 0 || newPosition[1] < 0) return false;
      //middle tile where the piece to be conquered sits
      var tileToCheckx = this.position[1] + dx / 2;
      var tileToChecky = this.position[0] + dy / 2;
      if (tileToCheckx > 9 || tileToChecky > 9 || tileToCheckx < 0 || tileToChecky < 0) return false;
      //if there is a piece there and there is no piece in the space after that
      if (!Board.isValidPlacetoMove(tileToChecky, tileToCheckx) && Board.isValidPlacetoMove(newPosition[0], newPosition[1])) {
        //find which object instance is sitting there
        for (let pieceIndex in pieces) {
          if (pieces[pieceIndex].position[0] == tileToChecky && pieces[pieceIndex].position[1] == tileToCheckx) {
            if (this.player != pieces[pieceIndex].player) {
              //return the piece sitting there
              return pieces[pieceIndex];
            }
          }
        }
      }
      return false;
    };

    this.opponentJump = function (tile) {
      var pieceToRemove = this.canOpponentJump(tile.position);
      //if there is a piece to be removed, remove it
      if (pieceToRemove) {
        pieceToRemove.remove();
        return true;
      }
      return false;
    };

    this.remove = function () {
      //remove it and delete it from the gameboard
      this.element.css("display", "none");
      if (this.player == 1) {
        $('#player2').append("<div class='capturedPiece'></div>");
		whitePiecesLeft--;
		whitePiecesLeftDiv.innerHTML = whitePiecesLeft + " Pieces Left";
        Board.score.player2 += 1;
      }
      if (this.player == 2) {
        $('#player1').append("<div class='capturedPiece'></div>");
		blackPiecesLeft--;
		blackPiecesLeftDiv.innerHTML = blackPiecesLeft + " Pieces Left";
        Board.score.player1 += 1;
      }
      Board.board[this.position[0]][this.position[1]] = 0;
      //reset position so it doesn't get picked up by the for loop in the canOpponentJump method
      this.position = [];
      var playerWon = Board.checkifAnybodyWon();
      if (playerWon) {
        $('#winner').html("Player " + playerWon + " has won!");
		alert("Player " + playerWon + " has won!");
		score = playerWon;
		document.getElementById("stopTimer").click();
		saveGameData();
      }
    }
  }

  function Tile(element, position) {
    //linked DOM element
    this.element = element;
    //position in gameboard
    this.position = position;
    //if tile is in range from the piece
    this.inRange = function (piece) {
      for (let k of pieces)
        if (k.position[0] == this.position[0] && k.position[1] == this.position[1]) return 'wrong';
      if (!piece.king && piece.player == 1 && this.position[0] < piece.position[0]) return 'wrong';
      if (!piece.king && piece.player == 2 && this.position[0] > piece.position[0]) return 'wrong';
      if (dist(this.position[0], this.position[1], piece.position[0], piece.position[1]) == Math.sqrt(2)) {
        //regular move
        return 'regular';
      } else if (dist(this.position[0], this.position[1], piece.position[0], piece.position[1]) == 2 * Math.sqrt(2)) {
        //jump move
        return 'jump';
      }
    };
  }

  //Board object - controls logistics of game
  var Board = {
    board: gameBoard,
    score: {
      player1: 0,
      player2: 0
    },
    playerTurn: 1,
    jumpexist: false,
    continuousjump: false,
    tilesElement: $('div.tiles'),
    //dictionary to convert position in Board.board to the viewport units
    dictionary: ["0vmin", "9vmin", "18vmin", "27vmin", "36vmin", "45vmin", "54vmin", "63vmin", "72vmin", "81vmin", "90vmin", "99vmin"],

    //initialize the 10x10 board
    initalize: function () {
      var countPieces = 0;
      var countTiles = 0;
      for (let row in this.board) { //row is the index
        for (let column in this.board[row]) { //column is the index
          //whole set of if statements control where the tiles and pieces should be placed on the board
          if (row % 2 == 1) {
            if (column % 2 == 0) {
              countTiles = this.tileRender(row, column, countTiles)
            }
          } else {
            if (column % 2 == 1) {
              countTiles = this.tileRender(row, column, countTiles)
            }
          }
          if (this.board[row][column] == 1) {
            countPieces = this.playerPiecesRender(1, row, column, countPieces)
          } else if (this.board[row][column] == 2) {
            countPieces = this.playerPiecesRender(2, row, column, countPieces)
          }
        }
      }
    },
    tileRender: function (row, column, countTiles) {
      this.tilesElement.append("<div class='tile' id='tile" + countTiles + "' style='top:" + this.dictionary[row] + ";left:" + this.dictionary[column] + ";'></div>");
      tiles[countTiles] = new Tile($("#tile" + countTiles), [parseInt(row), parseInt(column)]);
      return countTiles + 1
    },

    playerPiecesRender: function (playerNumber, row, column, countPieces) {
      $(`.player${playerNumber}pieces`).append("<div class='piece' id='" + countPieces + "' style='top:" + this.dictionary[row] + ";left:" + this.dictionary[column] + ";'></div>");
      pieces[countPieces] = new Piece($("#" + countPieces), [parseInt(row), parseInt(column)]);
      return countPieces + 1;
    },
    //check if the location has an object
    isValidPlacetoMove: function (row, column) {
      // console.log(row); console.log(column); console.log(this.board);
      if (row < 0 || row > 9 || column < 0 || column > 9) return false;
      if (this.board[row][column] == 0) {
        return true;
      }
      return false;
    },
    //change the active player - also changes div.turn's CSS
    changePlayerTurn: function () {
      if (this.playerTurn == 1) {
        this.playerTurn = 2;
        $('.turn').css("background", "linear-gradient(to right, transparent 50%, #BEEE62 50%)");
      } else {
        this.playerTurn = 1;
        $('.turn').css("background", "linear-gradient(to right, #BEEE62 50%, transparent 50%)");
      }
      this.check_if_jump_exist()
	  
	  let currentPlayerHasMoves = pieces.some(piece => piece.player === Board.playerTurn && piece.allowedtomove);

    if (!currentPlayerHasMoves) {
        // No available moves for the current player

        // Compare the number of pieces left for each player
        if (whitePiecesLeft > blackPiecesLeft) {
            $('#winner').html("Player 1 has won!");
            score = 1;
        } else if (blackPiecesLeft > whitePiecesLeft) {
            $('#winner').html("Player 2 has won!");
            score = 2;
        } else {
            $('#winner').html("It's a draw!");
            score = 0;
        }

        document.getElementById("stopTimer").click();
        saveGameData();
    }
	  
      return;
    },
    checkifAnybodyWon: function () {
      if (this.score.player1 == 20) {
        return 1;
      } else if (this.score.player2 == 20) {
        return 2;
      }
      return false;
    },
    //reset the game
    clear: function () {
      location.reload();
    },
    check_if_jump_exist: function () {
      this.jumpexist = false
      this.continuousjump = false;
      for (let k of pieces) {
        k.allowedtomove = false;
        // if jump exist, only set those "jump" pieces "allowed to move"
        if (k.position.length != 0 && k.player == this.playerTurn && k.canJumpAny()) {
          this.jumpexist = true
          k.allowedtomove = true;
        }
      }
      // if jump doesn't exist, all pieces are allowed to move
      if (!this.jumpexist) {
        for (let k of pieces) k.allowedtomove = true;
      }
    },
	
	// Add a function in the Board object to get a Piece from a position
	getPieceAtPosition: function (row, column) {
		for (let piece of pieces) {
		if (piece.position[0] === row && piece.position[1] === column) {
			return piece;
		}
		}
		return null; // Return null if no piece is found at the specified position
	},

	

  }
  
  
  



		// Function to highlight all valid moves for a piece
function highlightPossibleMoves(piece) {
  // Iterate through all tiles to find valid moves
  for (let tile of tiles) {
    var inRange = tile.inRange(piece);
    if (inRange !== 'wrong') {
      // Check if it's a valid move
      if (inRange === 'regular' && !Board.jumpexist) {
			tile.element.css('background-color', 'lightblue');
      } else if (inRange === 'jump') {
        if (piece.canOpponentJump(tile.position)) {
			tile.element.css('background-color', 'lightblue');
        }
      }
    }
  }
}

function clearHighlights() {
	for(let tile of tiles) {
			tile.element.css('background-color','#232621');
	}
}



function saveGameData() {
    let maxID = myData.length;
    saverequest = new XMLHttpRequest();

    saverequest.onreadystatechange = function() {
        if (saverequest.readyState == 4 && saverequest.status == 200) {
            // Handle the response here if needed
            console.log(saverequest.responseText);
        }
    };

    saverequest.open('POST', 'saveGame.php');
    saverequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    // Concatenate data into a single string
    let dataString =
		'&maxID=' + encodeURIComponent(maxID) +
        '&score=' + encodeURIComponent(score) +
        '&duration=' + encodeURIComponent(duration) +
        '&whiteTurns=' + encodeURIComponent(whiteTurns) +
        '&blackTurns=' + encodeURIComponent(blackTurns);

    saverequest.send(dataString);
}





var httpRequestAllGames = new XMLHttpRequest();
httpRequestAllGames.onreadystatechange = function () {
    if (httpRequestAllGames.readyState == 4 && httpRequestAllGames.status == 200) {
        myData = JSON.parse(httpRequestAllGames.responseText);
    }
};
httpRequestAllGames.open('GET', 'getGame.php');
httpRequestAllGames.send();


function showGame() {
	alert(myData.length);
}



function updateBoard() {
	let checker1Color = document.getElementById("checker1Color").value;
	let checker2Color = document.getElementById("checker2Color").value;
	let whiteSquareColor = document.getElementById("whiteSquare").value;
	let blackSquareColor = document.getElementById("blackSquare").value;
	let boardDiv = document.getElementById("board");
	for(let piece of pieces) {
		if(piece.player == 1) {
			piece.element.css('background-color', checker1Color);
		}
		else {
			piece.element.css('background-color', checker2Color);
		}
	}
	for(let tile of tiles) {
		boardDiv.style.backgroundColor = whiteSquareColor;
		tile.element.css('background-color', blackSquareColor);
	}
	
}
 



function findRandomPiece() {
	blackTurns++;
  // Filter black pieces (pieces 19 to 39)
  let blackPieces = pieces.slice(20, 40);

  // Shuffle the black pieces to simulate randomness
  let shuffledBlackPieces = blackPieces.slice().sort(() => Math.random() - 0.5);

  for (let piece of shuffledBlackPieces) {
    // Check if the piece is allowed to move
    if (piece.allowedtomove) {
      for (let tile of tiles) {
        var inRange = tile.inRange(piece);
      if (inRange != 'wrong') {
        //if the move needed is jump, then move it but also check if another move can be made (double and triple jumps)
        if (inRange == 'jump') {
          if (piece.opponentJump(tile)) {
            piece.move(tile);
            if (piece.canJumpAny()) {
              piece.element.addClass('selected');
              // exist continuous jump, you are not allowed to de-select this piece or select other pieces
              Board.continuousjump = true;
			  for (let tile of tiles) {
				  inRange = null;
				  inRange = tile.inRange(piece);
				  if(inRange == "jump") {
					  if(piece.opponentJump(tile)) {
						  piece.move(tile);
						  Board.changePlayerTurn();
					  }
				  }
			  }
			  
            } else {
              Board.changePlayerTurn()
            }
			return;
          }
          //if it's regular then move it if no jumping is available
        } else if (inRange == 'regular' && !Board.jumpexist) {
          if (!piece.canJumpAny()) {
            piece.move(tile);
            Board.changePlayerTurn();
			return;
          } else {
            alert("You must jump when possible!");
          }
        }
      }
	  
      }
    }
  }

  // If no valid move is found, change the player's turn
  Board.continuousjump = false;
  Board.changePlayerTurn();
}






  //initialize the board
  Board.initalize();
  
 

  //select the piece on click if it is the player's turn
  $('.piece').on("click", function () {
	if(timing == false) {
		 document.getElementById("startTimer").click();
	 }
    var selected;
    var isPlayersTurn = ($(this).parent().attr("class").split(' ')[0] == "player" + Board.playerTurn + "pieces");
	if (this.id <= 19) {
		whiteTurns++;
	}
	else if(this.id > 19) {
		blackTurns++;
	}
    if (isPlayersTurn) {
      if (!Board.continuousjump && pieces[$(this).attr("id")].allowedtomove) {
        if ($(this).hasClass('selected')) selected = true;
        $('.piece').each(function (index) {
          $('.piece').eq(index).removeClass('selected')
        });
        if (!selected) {
          $(this).addClass('selected');
				// Find the selected piece
				var selectedPiece = pieces[$(this).attr("id")];
				// Pass the selected piece to the highlightPossibleMoves function
				highlightPossibleMoves(selectedPiece);
        }
      } else {
        let exist = "jump exist for other pieces, that piece is not allowed to move"
        let continuous = "continuous jump exist, you have to jump the same piece"
        let message = !Board.continuousjump ? exist : continuous
        console.log(message)
      }
    }
  });

  //reset game when clear button is pressed
  $('#cleargame').on("click", function () {
    Board.clear();
  });
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  //move piece when tile is clicked
  $('.tile').on("click", function () {
	  clearHighlights();
    //make sure a piece is selected
    if ($('.selected').length != 0) {
      //find the tile object being clicked
      var tileID = $(this).attr("id").replace(/tile/, '');
      var tile = tiles[tileID];
      //find the piece being selected
      var piece = pieces[$('.selected').attr("id")];
      //check if the tile is in range from the object
      var inRange = tile.inRange(piece);
      if (inRange != 'wrong') {
        //if the move needed is jump, then move it but also check if another move can be made (double and triple jumps)
        if (inRange == 'jump') {
          if (piece.opponentJump(tile)) {
            piece.move(tile);
            if (piece.canJumpAny()) {
              // Board.changePlayerTurn(); //change back to original since another turn can be made
              piece.element.addClass('selected');
              // exist continuous jump, you are not allowed to de-select this piece or select other pieces
              Board.continuousjump = true;
            } else {
              Board.changePlayerTurn()
            }
          }
          //if it's regular then move it if no jumping is available
        } else if (inRange == 'regular' && !Board.jumpexist) {
          if (!piece.canJumpAny()) {
            piece.move(tile);
            Board.changePlayerTurn()
          } else {
            alert("You must jump when possible!");
          }
        }
      }
	  
    }
	if(customStyle == true) {
	updateBoard(); }
	if(AI && Board.playerTurn == 2) {
				findRandomPiece();
				if(customStyle == true) {
				updateBoard(); }
			}
  });
  
  $('#startTimer').on("click", function () {
    timing = true;
    Interval = setInterval(function () {
        seconds++;
		duration++;
        if (seconds <= 9) {
            appendseconds.innerHTML = "0" + seconds;
        }
        if (seconds > 9) {
            appendseconds.innerHTML = seconds;
        }
        if (seconds > 59) {
            minutes++;
            appendminutes.innerHTML = (minutes <= 9 ? "0" : "") + minutes;
            seconds = 0;
            appendseconds.innerHTML = "00";
        }
        if (minutes > 59) {
            appendminutes.innerHTML = minutes;
        }
    }, 1000);

  });

$('#stopTimer').on("click", function () {
    clearInterval(Interval);
    timing = false;
});

$('#resetTimer').on("click", function () {
    clearInterval(Interval);
    timing = false;
    seconds = 0;
    minutes = 0;
    appendseconds.innerHTML = "00";
    appendminutes.innerHTML = "00";
	Board.clear();
});
	
$('#toggleAI').on("click", function() {
	AI = !AI;
	if(AI == true) {
		document.getElementById("toggleAI").innerHTML = "Currently Playing with AI!";
	}
	else {
		document.getElementById("toggleAI").innerHTML = "Play with AI!";
	}
	
});

$('#changeColor').on("click", function() {
	customStyle = true;
	let checker1Color = document.getElementById("checker1Color").value;
	let checker2Color = document.getElementById("checker2Color").value;
	let whiteSquareColor = document.getElementById("whiteSquare").value;
	let blackSquareColor = document.getElementById("blackSquare").value;
	let boardDiv = document.getElementById("board");
	for(let piece of pieces) {
		if(piece.player == 1) {
			piece.element.css('background-color', checker1Color);
		}
		else {
			piece.element.css('background-color', checker2Color);
		}
	}
	for(let tile of tiles) {
		boardDiv.style.backgroundColor = whiteSquareColor;
		tile.element.css('background-color', blackSquareColor);
	}
	
});
  
  
}