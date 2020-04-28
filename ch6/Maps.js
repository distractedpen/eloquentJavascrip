//Map as an Object
// let ages = {
//     Boris: 39,
//     Liang: 22,
//     Júlia: 62
// };

// console.log(`Júlia is ${ages['Júlia']}`);
// console.log("Is Jack's age known?", "Jack" in ages);
// console.log("Is toString's age known?", "toString" in ages);

let ages = new Map();
ages.set("Boris", 39);
ages.set("Liang", 22);
ages.set("Júlia", 62);

console.log(`Júlia is ${ages.get('Júlia')}`);
console.log("Is Jack's age known?", ages.has("Jack"));
console.log(ages.has("toString"));

console.log({x: 1}.hasOwnProperty("x"));
console.log({x: 1}.hasOwnProperty("toString"));