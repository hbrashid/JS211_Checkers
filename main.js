'use strict';

const assert = require('assert');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


class Checker {
  constructor(color) {
    // Your code here
    if (color === "white") {
      this.symbol = String.fromCharCode(0x125CB);
    }
    else {
      this.symbol = String.fromCharCode(0x125CF);
    }
  }
}


class Board {
  constructor() {
    this.grid = []
    this.checkers = []
  
  }
  // method that creates an 8x8 array, filled with null values
  createGrid() {
    // loop to create the 8 rows
    for (let row = 0; row < 8; row++) {
      this.grid[row] = [];
      // push in 8 columns of nulls
      for (let column = 0; column < 8; column++) {
        this.grid[row].push(null);
      }
    }
  }
  viewGrid() {
    // add our column numbers
    let string = "  0 1 2 3 4 5 6 7\n";
    for (let row = 0; row < 8; row++) {
      // we start with our row number in our array
      const rowOfCheckers = [row];
      // a loop within a loop
      for (let column = 0; column < 8; column++) {
        // if the location is "truthy" (contains a checker piece, in this case)
        if (this.grid[row][column]) {
          // push the symbol of the check in that location into the array
          rowOfCheckers.push(this.grid[row][column].symbol);
        } else {
          // just push in a blank space
          rowOfCheckers.push(' ');
        }
      }
      // join the rowOfCheckers array to a string, separated by a space
      string += rowOfCheckers.join(' ');
      // add a 'new line'
      string += "\n";
    }
    console.log(string);
  }

  // Your code here
  createCheckers() {
    let whitePositions = [
    [0, 1], [0, 3], [0, 5], [0, 7],
    [1, 0], [1, 2], [1, 4], [1, 6],
    [2, 1], [2, 3], [2, 5], [2, 7]
    ]
    let blackPositions = [
    [5, 0], [5, 2], [5, 4], [5, 6],
    [6, 1], [6, 3], [6, 5], [6, 7],
    [7, 0], [7, 2], [7, 4], [7, 6]
    ]
    for (let i = 0; i < 12; i++) {
      let whiteChecker = new Checker("white");
      this.grid[whitePositions[i][0]][whitePositions[i][1]] = whiteChecker;
      this.checkers.push(whiteChecker);
    }
    // We have checkers on the board! I had to change my function up top of 'Checkers' to a class. Then make a new instance of it here.

    for (let i = 0; i < 12; i++) {
      let blackChecker = new Checker("black");
      this.grid[blackPositions[i][0]][blackPositions[i][1]] = blackChecker;
      this.checkers.push(blackChecker);
    }
  }

  selectChecker(row, column) {
    return this.grid[row][column];
  }

  killChecker(position) {
    let checker = this.selectChecker(position[0], position[1]);
    let indexChecker = this.checkers.indexOf(checker);
      this.checkers.splice(indexChecker, 1);
      this.grid[position[0]][position[1]] = null;



  }

}

class Game {
  constructor() {
    this.board = new Board;
  }
  start() {
    this.board.createGrid();
    this.board.createCheckers();
  }

  // Here we are writing a method to move the checker. Start and end will take a row and column. Once it moves, that spot will be null.
  moveChecker(start, end) {
    const startRow = parseInt(start[0]);
    const startCol = parseInt(start[1]);
    const endRow = parseInt(end[0]);
    const endCol = parseInt(end[1]);


    let checker = this.board.selectChecker(start[0], start[1]);

    this.board.grid[endRow][endCol] = checker;
    this.board.grid[startRow][startCol] = null;


// Need to declare killRow and killCol to be used in the conditional statement.
    let killRow;
    let killCol;

    if (Math.abs(endRow - startRow) == 2) {
      if (endRow > startRow) {
        killRow = startRow + 1;
      } else 
        killRow = startRow - 1;
      
      if (endCol > startCol) {
        killCol = startCol + 1;
      } else 
        killCol = startCol - 1;
        
        this.board.grid[killRow][killCol] = null;
        this.board.checkers.pop();
      }


  }
}

function getPrompt() {
  game.board.viewGrid();
  rl.question('which piece?: ', (whichPiece) => {
    rl.question('to where?: ', (toWhere) => {
      game.moveChecker(whichPiece, toWhere);
      getPrompt();
    });
  });
}

const game = new Game();
game.start();


// Tests
if (typeof describe === 'function') {
  describe('Game', () => {
    it('should have a board', () => {
      assert.equal(game.board.constructor.name, 'Board');
    });
    it('board should have 24 checkers', () => {
      assert.equal(game.board.checkers.length, 24);
    });
  });

  describe('Game.moveChecker()', () => {
    it('should move a checker', () => {
      assert(!game.board.grid[4][1]);
      game.moveChecker('50', '41');
      assert(game.board.grid[4][1]);
      game.moveChecker('21', '30');
      assert(game.board.grid[3][0]);
      game.moveChecker('52', '43');
      assert(game.board.grid[4][3]);
    });
    it('should be able to jump over and kill another checker', () => {
      game.moveChecker('30', '52');
      assert(game.board.grid[5][2]);
      assert(!game.board.grid[4][1]);
      assert.equal(game.board.checkers.length, 23);
    });
  });
} else {
  getPrompt();
}
