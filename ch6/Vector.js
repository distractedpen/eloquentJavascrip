//create a vector object with two parameters: x, y (numbers)
//Vec prototype methods:
//              plus(Vec) returns this.Vec + Vec
//              minus(Vec) returns this.Vec - Vec
//              get length = return length of Vec --> distance of (x, y) from (0, 0)

class Vec {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    plus(vector){
        return new Vec((this.x + vector.x), (this.y + vector.y));
    }

    minus(vector){
        return new Vec((this.x - vector.x), (this.y - vector.y));
    }

    get length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
}

  //testing code
console.log(new Vec(1, 2).plus(new Vec(2, 3)));
  // → Vec{x: 3, y: 5}
console.log(new Vec(1, 2).minus(new Vec(2, 3)));
  // → Vec{x: -1, y: -1}
console.log(new Vec(3, 4).length);
  // → 5