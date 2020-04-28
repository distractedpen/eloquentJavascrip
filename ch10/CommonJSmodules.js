//NOTE
// This file will not run.
// methods require/export need CommonJS to work.
// Can be run from Node.js


//example of a module OBSOLETE MODULE TYPE
/* Module weekDay
interface:
    weekDay.name
    weekDay.number
*/
const weekDay = function() {
    const names = ["Sunday", "Monday", "Tuesday", "Wednesday",
                    "Thursday", "Friday", "Saturday"];
    return {
        name(number) {return names[number];},
        number(name) {return names.indexOf(name);}
    };
}();


//Evaluating data as code

// eval is a function that can run strings as code
// not recommended as it is not predictable
const x = 1;
function evalAndReturnX(code){
    eval(code);
    return x;
}

console.log(evalAndReturnX("var x = 2")); // 2
console.log(x); // 1

//Function constructor
let plusOne = Function("n", "return n + 1;");
console.log(plusOne(4)); //5

const {formatDate} = require("./dateFormat");
console.log(formatDate(new Date(2017, 9, 13),
                        "dddd the Do"));  //Friday the 13th

require.cache = Object.create(null);

function require(name) {
    if (!(name in require.cache)) {
        let code = readFile(name); // readFile is made up | doesn't work
        let module = {exports: {}};
        require.cache[name] = module;
        let wrapper = Function ("require, export, module", code);
        wrapper(require, module.exports, module);
    }
    return require.cache[name].exports;
}

const {parse} = require("ini"); // Would grab the module ini parser
console.log(parse("x = 10\ny = 20")); // -> {x: "10", y: "20"}