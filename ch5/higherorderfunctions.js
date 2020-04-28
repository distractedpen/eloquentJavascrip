/* higher order function for arrays
    1. forEach - loops over an array
    2. filter(predicate) - filters an array based on a predicate
    3. map(transform) - transforms an array by putting each element through the transform function
    4. reduce(combine, start) - combines all element in the array based on the combine function, starts at start
    5. some(criteria) - tests elements in an array on criteria(as a function). if criteria returns true, some returns true and stops checking
    6. findIndex(predicate) finds the first element that matches the predicate
*/


//repeating function
function repeat(n, action) {
    for (let i = 0; i < n; i++) {
        action(i);
    }
}


let labels = [];
repeat(5, i => {
    labels.push(`Unit ${i + 1}`);
});


function greaterThan(n) {
    return m => m > n;
}
let greaterThan10 = greaterThan(10);


function noisy(f) {
    return (...args) => {
        console.log("calling with", args);
        let result = f(...args);
        console.log("called with", args, ", retured", result);
        return result;
    };
}


//testing function
function unless(test, then) {
    if (!test) then();
}

repeat(3, n => {
    unless(n % 2 == 1, () => {
        //console.log(n, "is even");
    });
});


//filter function [standard array method]
function filter(array, test){
    let passed = [];
    for (let element of array){
        if (test(element)){
            passed.push(element);
        }
    }
    return passed;
}

//console.log(SCRIPTS.filter(s => s.direction == "ttb"));

// mapping a function to an array [standard array method]
function map(array, transform) {
    let mapped = [];
    for (let element of array) {
        mapped.push(transform(element));
    }
    return mapped;
}

//let rtlScripts = SCRIPTS.filter(s => s.direction == 'rtl');
//console.log(rtlScripts.map(s => s.name));

//standard arrray function ('combine' the elements to produce 1 value)
function reduce(array, combine, start) {
    let current = start;
    for (let element of array) {
        current = combine(current, element);
    }
    return current;
}

//console.log([1,2,3,4].reduce((a,b) => a+b));

function characterCount(script){
    return script.ranges.reduce((count, [from, to]) => {
        return count + (to - from);
    }, 0);
}

//console.log(SCRIPTS.reduce((a,b) => {
//    return characterCount(a) < characterCount(b) ? b : a;
//}));

function average(array) {
    return array.reduce((a,b) => a+b) / array.length;
}

// console.log(Math.round(average(
//     SCRIPTS.filter(s => s.living).map(s => s.year))));
// console.log(Math.round(average(
//     SCRIPTS.filter(s => !s.living).map(s => s.year))));


function characterScript(code) {
    for (let script of SCRIPTS) {
        if (script.ranges.some(([from, to]) => {
            return code >= from && code < to;
        })) {
            return script;
        }
    }
    return null;
}

//onsole.log(characterScript(121));

//two emoji characters, horse and shoe
let horseShoe = "🐴👟";
// console.log(horseShoe.length);
// console.log(horseShoe[0]);
// console.log(horseShoe.charCodeAt(0));
// console.log(horseShoe.codePointAt(0));
let roseDragon = "🌹🐉";
for (let char of roseDragon) {
    //console.log(char);
}

function countBy(items, groupName) {
    let counts = [];
    for (let item of items) {
        let name = groupName(item);
        let known = counts.findIndex(c => c.name == name);
        if (known == -1) {
            counts.push({name, count: 1});
        } else {
            counts[known].count++;
        }
    }
    return counts;
}
//console.log(countBy([1,2,3,4,5], n => n > 2));

function textScripts(text) {
    let scripts = countBy(text, char => {
        let script = characterScript(char.codePointAt(0));
        return script ? script.name : "none";
    }).filter(({name}) => name != "none");

    let total = scripts.reduce((n, {count}) => n + count, 0);
    if (total == 0) return "No Scripts found.";

    return scripts.map(({name, count}) => {
        return `${Math.round(count * 100 / total)}% ${name}`;
    }).join(", ");
}

console.log(textScripts('英国的狗说"woof", 俄罗斯的狗说"тяв'));
