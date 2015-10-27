/**
 * Created by mattiden on 21.10.15.
 */
import fs from 'fs';
import Cell from './CellClass.js';
import clone from 'clone';
import Constants from './Constants.js';

class SudokuSolver {
  // Public Class API
  setBoard(boardName){
    let boardString = fs.readFileSync('./boards/' + boardName, 'utf8');
    this.board = this._parseBoard(boardString);
    return this;
  }

  solve(){
    // Set up some function scope variables. Used for backtracking.
    var valuesWeHaveTried = [];
    var smallestDomain = [];
    var cellWithSmallestDomain;
    var savedState = [];
    var amountOfBacktracks = 0;
    // We run the AC3 algorithm until it either solves the puzzle or needs to make a choice

    // We evaluate the result from the AC3 algorithm.
    while(true){
      var resultFromAC3Algorithm = this._runAC3();

      switch(resultFromAC3Algorithm) {

        case Constants.SOLVED:
          // YAY. We solved it;
          if(amountOfBacktracks){
            console.log(`We had to backtrack ${amountOfBacktracks} times`);
          }
          else {
            console.log(" Didn't even backtrack once \n");
          }
          return true;

        case Constants.UNFINISHED:
          savedState.push(clone(this.board));

          // AC3 ran one time but didn't solve the puzzle
          cellWithSmallestDomain = this._getCellWithSmallestDomain();
          smallestDomain = cellWithSmallestDomain.getDomain();


          // Then we need to try one of the values from the domain we haven't tried before;
          smallestDomain.some((domainCell, domainCellIndex) => {
            var index = valuesWeHaveTried.indexOf(domainCell);
            if(index == -1){
              cellWithSmallestDomain.setValue(domainCell.getValue());
              smallestDomain.splice(domainCellIndex, 1);
              cellWithSmallestDomain.setDomain(smallestDomain);
              valuesWeHaveTried.push(domainCell);
              return true;
            }
          });


          break;

        case Constants.WRONG_CHOICE:
          // We made an incorrect choice. Revert to last state;
          this.board = savedState.pop();
          amountOfBacktracks++;
          break;

        default :
          // Should never end up here
          break
      }
    }

  }

  getBoard(){
    this._hasValidBoard();
    return this.board;
  };

  printBoard(){
    this._hasValidBoard();
    let board = this.board.map((row) => {
      return row.map((cell) => {
          return cell.getValue();
      })
    });
    console.log(board);
  };

  //  ==== Algorithm helper function ======

  _runAC3(){
    this._hasValidBoard();

    while(this._boardHasNotBeenComplete()) {
      var amountOfDomainsBefore = this._getSumOfDomains();
      var amountOfDomainsAfter;
      var choiceWasWrong = false;
      // Inference until it's solved or we need to make a choice
      this.board.forEach((row, rowIndex) => {
        row.forEach((cell, columnIndex) => {
          if (cell.getValue() == 0) {
            this._updateConstraintsOnCell(rowIndex, columnIndex);
            if(cell.getDomain().length == 1){
              cell.setValue(cell.getDomain()[0].getValue());
            }
            if(cell.getDomain().length == 0){
              choiceWasWrong = true;
            }
          }
        });
      });

      amountOfDomainsAfter = this._getSumOfDomains();
      // AC3 didn't solve the board and it's not making progress. We stop here.
      if(amountOfDomainsBefore == amountOfDomainsAfter){
        return Constants.UNFINISHED;
      }

      // We reduced a domain set to zero length. That means we made a wrong choice
      else if(choiceWasWrong){
        return Constants.WRONG_CHOICE
      }
    }
    return Constants.SOLVED;
  };

  _getCellWithSmallestDomain(){
    var cellWithSmallestDomain = new Cell(0);
    this.board.forEach((row) => {
      row.forEach((cell) => {
        if(cell.getValue() == 0 && cell.getDomain().length < cellWithSmallestDomain.getDomain().length){
          cellWithSmallestDomain = cell;
        }
      })
    });
    return cellWithSmallestDomain;
  }
  _hasValidBoard(){
    if(this.board == null) throw new Error("Please set a board first. setBoard(filename)");
  }

  _getSumOfDomains(){
    var sum = 0;
    this.board.forEach((row) => {
      row.forEach((cell) => {
          sum += cell.getDomain().length
      })
    });
    return sum;
  }

  _boardHasNotBeenComplete(){
    for(var k = 0; k < this.board.length; k++){
      for(var i = 0; i < this.board[k].length; i++){
        if(this.board[k][i].getValue() == 0){
          return true;
        }
      }
    }
    return false;
  }

  _updateConstraintsOnCell(cellX, cellY){
    var cell = this.board[cellX][cellY];
    let newDomain = cell.getDomain();
    newDomain = this._difference(newDomain, this._getVariablesFromColumn(cellY));
    newDomain = this._difference(newDomain, this._getVariablesFromRow(cellX));
    newDomain = this._difference(newDomain, this._getVariablesFromUnit(cellX, cellY));
    cell.setDomain(newDomain);
    return cell;

  }

  _difference(array1, array2){
    var differenceArray = clone(array1);

    for(var i = 0; i < array2.length; i++){
      for(var k = 0; k < array1.length; k++){
        if(array1[k].getValue() == array2[i].getValue()){
          differenceArray[k] = null;
        }
      }
    }

    while(differenceArray.indexOf(null) > -1){
      differenceArray.splice(differenceArray.indexOf(null), 1);
    }
    return differenceArray;
  }

  _getVariablesFromRow(rowNumber){
    this._hasValidBoard();
    return this.board[rowNumber]
  }

  _getVariablesFromColumn(columnNumber){
    var columnArray = [];
    for(var i = 0; i < this.board.length; i++){
      columnArray.push(this.board[i][columnNumber]);
    }
    return columnArray;
  }
  _getVariablesFromUnit(unitX, unitY){
    var unit = this._getUnitNumberForCell(unitX, unitY);
    var unitArray = [];
    var xStartIndex = unit.x * 3;
    var yStartIndex = unit.y * 3;
    for(var k = 0; k < 3; k++){
      unitArray.push(this.board[xStartIndex+k][yStartIndex]);
      unitArray.push(this.board[xStartIndex+k][yStartIndex+1]);
      unitArray.push(this.board[xStartIndex+k][yStartIndex+2]);
    }
    return unitArray;
  }

  _getUnitNumberForCell(cellX, cellY){
    var unit = {
      x: null,
      y: null
    };

    if(cellX/3 < 1){
      unit.x = 0;
    }
    else if(cellX/3 >= 1 && cellX/3 < 2){
      unit.x = 1
    }
    else if(cellX/3 >= 2 && cellX/3 < 3){
      unit.x = 2
    }

    if(cellY/3 < 1){
      unit.y = 0;
    }
    else if(cellY/3 >= 1 && cellY/3 < 2){
      unit.y = 1
    }
    else if(cellY/3 >= 2 && cellY/3 < 3){
      unit.y = 2
    }
    return unit;
  }

  _parseBoard(boardString){
    var board = [];
    var row = [];

    for(var cell of boardString){
      if(cell == '\n'){
        board.push(row);
        row = [];
      } else {
        var newCell = new Cell(parseInt(cell));
        row.push(newCell)
      }
    }
    return board;
  }

}
export default SudokuSolver;