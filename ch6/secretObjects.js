let rabbit = {}; //rabbit object
rabbit.speak = function(line) {
    console.log(`The ${this.type} rabbit says '${line}'`);
}; // method of rabbit object

function speak(line) {
    console.log(`The ${this.type} rabbit says '${line}'`);
}; // method of rabbit object


let whiteRabbit = {type: "white", speak};
let hungryRabbit = {type: "hungry", speak};

whiteRabbit.speak("Oh my ears and whiskers, " +
                  "how late it's getting!");

hungryRabbit.speak("I could use a carrot right now.");

speak.call(hungryRabbit, "Burp!");
//functions have their own 'this' binding
//functions defined with the 'function' keyword will create their own 'this' binding
//functions defined with => do not create their own 'this' binding and can access the 'this' binding of the wrapping scope


// take a vector (array) and make it have a length of 1.
function normalize(){
    console.log(this.coords.map(n => n/ this.length));
}
normalize.call({coords: [0, 2, 3], length: 5});

/*
There are 3 main Prototypes: Object.prototype   Function.prototype  Array.prototype  (Function & Array prototypes both are Object)
*/

let protoRabbit = {
    speak(line){
        console.log(`The ${this.type} rabbit says '${line}'`);
    }
};
//let killerRabbit = Object.create(protoRabbit);
//killerRabbit.type = "killer";
//killerRabbit.speak("SKREEEE!");


//constructor for Rabbit
function makeRabbit(type) {
    let rabbit = Object.create(protoRabbit);
    rabbit.type = type;
    return rabbit;
}


/* function Rabbit(type) {
    this.type = type;
} //prototype Function
Rabbit.prototype.speak = function(line) {
    console.log(`The ${this.type} rabbit says '${line}'`);
}; 

let weirdRabbit = new Rabbit("weird"); // prototype Object */

class Rabbit {
    constructor(type){
        this.type = type;
    }
    speak(line) {
        console.log(`The ${this.type} rabbit says '${line}'`);
    }
}
Rabbit.prototype.teeth = "small";
Rabbit.prototype.toString = function() {
    return `a ${this.type} rabbit`;
};

let killerRabbit = new Rabbit("killer");
killerRabbit.teeth = "large and bloody";
let blackRabbit = new Rabbit("black");

console.log(killerRabbit.teeth);
console.log(blackRabbit.teeth);
console.log(String(blackRabbit));

let sym = Symbol("name");
console.log(sym == Symbol("name"));
Rabbit.prototype[sym] = 55;
console.log(blackRabbit[sym]);

const toStringSymbol = Symbol("toString");
Array.prototype[toStringSymbol] = function() {
    return `${this.length} cm of blue yarn`;
};

console.log([1, 2].toString());
console.log([1,2][toStringSymbol]());


let stringObject = {
    [toStringSymbol]() { return "a jute rope"; }
};
console.log(stringObject[toStringSymbol]());

let okIterator = "OK"[Symbol.iterator]();
console.log(okIterator.next());
console.log(okIterator.next());
console.log(okIterator.next());