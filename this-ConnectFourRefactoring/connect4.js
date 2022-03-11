/*
* Part One: Make Game Into a Class
*   - Height, width, and the board will move from global variables to instance attributes on the class
*   - Make a constructor that sets default values for these
*   - Move the current functions onto the class as methods
*
* Part Two: Small Improvements
* Make it so that you have a button to “start the game” — it should only start the game when this is clicked, and you should be able to click this to restart a new game.
*
* Add a property for when the game is over, and make it so that you can’t continue to make moves after the game has ended.
*/
class Game {
  constructor(height, width) {
    this.height = height;
    this.width = width;
    this.currPlayer = 1;
    this.board = [];
    this.gameOver = false;
    this.makeBoard();
    this.makeHtmlBoard();
  }

  makeBoard() {
    for(let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  makeHtmlBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');

    this.gameHandleClick = this.handleClick.bind(this);
    top.addEventListener('click', this.gameHandleClick);

    for(let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
    board.append(top);

    // make main part of board
    for(let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
      for(let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
      board.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`p${this.currPlayer}`);
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    // Change the value of gameOver to TRUE
    this.gameOver = true;
    // Remove the EventListener to column top board
    const columnTopBoard = document.querySelector("#column-top");
    columnTopBoard.removeEventListener("click", this.gameHandleClick);
    // Show msn with the winner player
    alert(msg);
  }

  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    
    // check for win
    if(this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer} won!`);
    }
    
    // check for tie
    if(this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players
    this.currPlayer = this.currPlayer === 1 ? 2 : 1;
  }

  checkForWin() {
    const _win = cells =>
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
  
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}


// The only other code being a single line at the bottom:
// Assuming constructor takes height, width
const startGameButton = document.getElementById('startGame');
startGameButton.addEventListener('click', function(){
  new Game(6, 7); 
  startGameButton.innerText = 'Restart Game!';
});