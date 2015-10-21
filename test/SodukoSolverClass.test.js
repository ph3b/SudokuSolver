/**
 * Created by mattiden on 21.10.15.
 */
import expect from 'expect.js';
import Cell from './../CellClass.js';

import SudokuSolver from './../SudokuSolverClass.js';

describe('SudokuSolver Unit tests', () => {

  it('Should import the board and convert it to an array', (done) => {
    var sudokuSolver = new SudokuSolver();
    sudokuSolver.setBoard('easy.txt');
    expect(sudokuSolver.getBoard()[0][0].getValue()).to.be.eql(8);
    expect(sudokuSolver.getBoard()[0][0].getValue()).to.be.a("number");
    expect(sudokuSolver.getBoard()[0][1].getValue()).to.be.eql(0);
    expect(sudokuSolver.getBoard()[0][1].getDomain()[0].getValue()).to.be.eql(1);
    expect(sudokuSolver.getBoard()[0][1].getDomain()[1].getValue()).to.be.eql(2);
    expect(sudokuSolver.getBoard()[0][1].getDomain()[2].getValue()).to.be.eql(3);
    expect(sudokuSolver.getBoard()[0][1].getDomain()[3].getValue()).to.be.eql(4);
    expect(sudokuSolver.getBoard()[0][2].getValue()).to.be.eql(7);
    expect(sudokuSolver.getBoard()[8][0].getValue()).to.be.eql(4);
    expect(sudokuSolver.getBoard()[8][2].getValue()).to.be.eql(0);
    expect(sudokuSolver.getBoard()[8][8].getValue()).to.be.eql(1);
    expect(sudokuSolver.getBoard().length).to.be.eql(9);
    expect(sudokuSolver.getBoard()[0].length).to.be.eql(9);
    done();
  });

  it("Should return a list of variables of the cells row", (done) => {
    var sudokuSolver = new SudokuSolver();
    sudokuSolver.setBoard("easy.txt");
    var rowArray = sudokuSolver._getVariablesFromRow(0,0);

    expect(rowArray).to.be.an("array");
    expect(rowArray[0].getValue()).to.be(8);
    expect(rowArray[1].getValue()).to.be(0);
    expect(rowArray[2].getValue()).to.be(7);
    expect(rowArray[3].getValue()).to.be(6);
    expect(rowArray[4].getValue()).to.be(9);
    expect(rowArray[5].getValue()).to.be(0);
    expect(rowArray[6].getValue()).to.be(0);
    expect(rowArray[7].getValue()).to.be(5);
    expect(rowArray[8].getValue()).to.be(4);
    expect(rowArray.length).to.be(9);
    done();

  });

  it("Should return a list of variables for the cells column", (done) => {
    var sudokuSolver = new SudokuSolver();
    sudokuSolver.setBoard("easy.txt");
    var columnArray = sudokuSolver._getVariablesFromColumn(4);

    expect(columnArray).to.be.an("array");
    expect(columnArray[0].getValue()).to.be(9);
    expect(columnArray[1].getValue()).to.be(4);
    expect(columnArray[2].getValue()).to.be(2);
    expect(columnArray[3].getValue()).to.be(0);
    expect(columnArray[4].getValue()).to.be(0);
    expect(columnArray[5].getValue()).to.be(0);
    expect(columnArray[6].getValue()).to.be(1);
    expect(columnArray[7].getValue()).to.be(8);
    expect(columnArray[8].getValue()).to.be(7);
    done();
  });

  it('Should return the unit of the cell', (done) => {
    var sudokuSolver = new SudokuSolver();
    sudokuSolver.setBoard("easy.txt");
    var unit = sudokuSolver._getUnitNumberForCell(3,1);

    expect(unit.x).to.be.eql(1);
    expect(unit.y).to.be.eql(0);
    done();
  });

  it('Should return the variables of the cells unit', (done) => {
    var sudokuSolver = new SudokuSolver();
    sudokuSolver.setBoard("easy.txt");
    var unit = sudokuSolver._getUnitNumberForCell(3,1);
    var variableArray = sudokuSolver._getVariablesFromUnit(unit.x, unit.y);

    expect(variableArray[0].getValue()).to.be.eql(0);
    expect(variableArray[1].getValue()).to.be.eql(0);
    expect(variableArray[2].getValue()).to.be.eql(0);
    expect(variableArray[3].getValue()).to.be.eql(3);
    expect(variableArray[4].getValue()).to.be.eql(0);
    expect(variableArray[5].getValue()).to.be.eql(0);
    expect(variableArray[6].getValue()).to.be.eql(0);
    expect(variableArray[7].getValue()).to.be.eql(9);
    expect(variableArray[8].getValue()).to.be.eql(5);
    done();
  });

  it('Should apply constraints to all cells', (done) => {
    var sudokuSolver = new SudokuSolver();
    sudokuSolver.setBoard("easy.txt");
    sudokuSolver.applyConstraints();
    var counter = 0;
    sudokuSolver.board.forEach((row) => {
      row.forEach((cell) => {
        if(cell.getValue() == 0){
          counter++;
        }
      })
    });

    expect(counter).to.be.eql(0);
    done();
  });

  it("Give difference of two arrays", (done) => {
    var sudokuSolver = new SudokuSolver();
    sudokuSolver.setBoard("easy.txt");
    var array1 = [];
    var array2 = [];

    array1.push(new Cell(1));
    array1.push(new Cell(2));
    array1.push(new Cell(3));
    array1.push(new Cell(4));
    array1.push(new Cell(5));
    array1.push(new Cell(6));
    array1.push(new Cell(7));
    array1.push(new Cell(8));
    array1.push(new Cell(9));

    array2.push(new Cell(0));
    array2.push(new Cell(2));
    array2.push(new Cell(6));
    array2.push(new Cell(0));
    array2.push(new Cell(0));
    array2.push(new Cell(9));
    array2.push(new Cell(0));
    array2.push(new Cell(3));
    array2.push(new Cell(8));

    var differenceArray = sudokuSolver._difference(array1, array2);
    expect(differenceArray[0].getValue()).to.be.eql(1);
    expect(differenceArray[1].getValue()).to.be.eql(4);
    expect(differenceArray[2].getValue()).to.be.eql(5);
    expect(differenceArray[3].getValue()).to.be.eql(7);
    done();
  });

  it('Should solve medium board', (done) => {
    var sudokuSolver = new SudokuSolver();
    sudokuSolver.setBoard("medium.txt");
    sudokuSolver.solve();

    expect(sudokuSolver.getBoard()[0][1].getValue()).to.be.eql(3);
    expect(sudokuSolver.getBoard()[0][4].getValue()).to.be.eql(2);
    expect(sudokuSolver.getBoard()[0][5].getValue()).to.be.eql(7);
    expect(sudokuSolver.getBoard()[0][7].getValue()).to.be.eql(4);
    expect(sudokuSolver.getBoard()[0][8].getValue()).to.be.eql(8);
    done();
  });


});