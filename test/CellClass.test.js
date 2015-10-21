/**
 * Created by mattiden on 21.10.15.
 */
import expect from 'expect.js';
import CellClass from '../CellClass.js';

describe('CellClass Unit tests', () => {

    it('Should instantiate class', (done) => {
        var cellClass = new CellClass();
        done();
    });

  it('Should create a cell with zero value', (done) => {
    var cellClass = new CellClass(0);
    expect(cellClass.getValue()).to.be.eql(0);
    expect(cellClass.getValue()).to.be.a("number");
    done();
  });

  it('Should create a cell with a non-zero value and generate correct domain', (done) => {
    var cellClass = new CellClass(5);
    expect(cellClass.getValue()).to.be.eql(5);
    expect(cellClass.getValue()).to.be.a("number");
    expect(cellClass.getDomain()).to.be.an("array");
    expect(cellClass.getDomain().length).to.be(1);
    expect(cellClass.getDomain()[0]).to.be(5);
    done();
  });

  it('Should create a cell with zero value and generate correct domain', (done) => {
    var cellClass = new CellClass(0);
    expect(cellClass.getDomain()[0].getValue()).to.be.eql(1);

    done();
  });

  it('Should set new value of cell', (done) => {
    var cellClass = new CellClass(0);
    cellClass.setValue(7);
    expect(cellClass.getValue()).to.be.eql(7);
    done();
  })

});