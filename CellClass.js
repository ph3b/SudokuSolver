/**
 * Created by mattiden on 21.10.15.
 */
class Cell {
    constructor(value){
      this.value = value;
      this.domain = [];
      if(value == 0){
        for(var k = 1; k < 10; k++){
          this.domain.push(new Cell(k))
        }
      } else {
        this.domain = [value];
      }
    }

  getDomain(){
    return this.domain;
  }

  getValue(){
    return this.value;
  }
  setValue(value){
    if(this.value != 0){
      console.log("Ookkk... but this shouldn't be done.")
    }
    this.value = value;
    return this;
  }
  setDomain(domain){
    this.domain = domain;
  }
}
export default Cell;