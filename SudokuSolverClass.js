/**
 * Created by mattiden on 21.10.15.
 */
import fs from 'fs';
import Cell from './CellClass.js';
import clone from 'clone';

class SudokuSolver {

  // Public Class API
  setBoard(boardName){
    let boardString = fs.readFileSync('./boards/' + boardName, 'utf8');
    this.board = this._parseBoard(boardString);
    return this;
  }
  solve(){
    return this.applyConstraints();
  }
  getBoard(){
    this._hasValidBoard();
    return this.board;
  };

  printBoard(){
    let board = this.board.map((row) => {
      return row.map((cell) => {
          return cell.getValue();
      })
    });
    console.log(board);
  };

  applyConstraints(){
    this._hasValidBoard();
    var counter = 0;

    while(this._boardHasNotBeenComplete()) {
      counter++;
      this.board.forEach((row, rowIndex) => {
        row.forEach((cell, columnIndex) => {
          if (cell.getValue() == 0) {
            this._updateConstraintsOnCell(rowIndex, columnIndex);
          }
        })
      });
    }
  };


  //  ==== Algorithm helper function ======

  _hasValidBoard(){
    if(this.board == null) throw new Error("Please set a board first. setBoard(filename)");
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

    // Blir skummel hvis domain skal kunne gå ned til 0.
    if(newDomain.length == 1){
      cell.setValue(newDomain[0].getValue());
    }
    cell.setDomain(newDomain);
    return cell;

  }

  _difference(array1, array2){
    var differenceArray = clone(array1);

    // Evt bli litt smartere
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
        row.push((newCell))
      }
    }
    return board;
  }

  //  === Dont know what to do with these =====

  _selectUnassignedVariable(){
    //TODO: Implement
  }

  _orderDomainVariables(){
    //TODO: Implement

  }

  _inference(){
    //TODO: Implement
  }

}
export default SudokuSolver;