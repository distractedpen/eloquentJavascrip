let re1 = new RegExp("abc");
let re2 = /abc/;

/*
Common character group short cuts for RegExpression:

\d any digit character
\w any alphanumeric character ('word character')
\s any whitespace character (space, tab, newline, and similar)
\D a character that is NOT a digit
\W a NONalphanumeric character
\S a NONwhitespace character
.  any character except for newline

*/

// test() looks for the specified regEx in the string, returns true/false

let dateTime = /\d\d-\d\d-\d\d\d\d \d\d:\d\d/;
console.log(dateTime.test("01-30-2003 15:20"));  //return true
console.log(dateTime.test("30-jan-2003 15:20")); //return false

let notBinary = /[^01]/
console.log(notBinary.test("1100100010100110")); //return false
console.log(notBinary.test("1100100010200110")); //return true


// + allows for repeating values \d looks for 1 digit \d+ looks for any number of digits in a row
console.log(/'\d+'/.test("'123'")); //true
console.log(/'\d+'/.test("''")); //false
// * allows for zero matching 
console.log(/'\d*'/.test("'123'")); //true
console.log(/'\d*'/.test("''")); //true zero match

// ? allows the character preceding it to be optional
let neighbor = /neighbou?r/
console.log(neighbor.test("neighbour")); //true
console.log(neighbor.test("neighbor")); //true

// {x} allows for a precise pattern to occur x times
let dateTime2 = /\d{1,2}-\d{1,2}-\d{4} \d{1,2}:\d{2}/;
console.log(dateTime2.test("1-30-2003 8:45")); //true

// to use operators like + or * more than once,
// enclose parts that repeat in ( )
// i at the end makes the regEx case insensitive
let cartoonCrying = /boo+(hoo+)+/i;
console.log(cartoonCrying.test("Boohoooohoohooo")); //true


// exec() returns object about the match obj -> {value, index}
let match = /\d+/.exec("one two 100");
console.log(match); // -> ["100"]
console.log(match.index); // -> 8

// the match obj shows the matches by subgroup as well
let quotedText = /'([^']*)'/;
console.log(quotedText.exec("she said 'hello'")); // returns ["'hello'", "hello"]

//Javascript Date Class
console.log(new Date());
console.log(new Date(2009, 11, 9)); // Wed Dec 09 2009 00:00:00 GMT+0100 (CET)
console.log(new Date(2009, 11, 9, 12, 59, 59, 999)); // Wed Dec 09 2009 12:59:59 GMT+0100 (CET)

//convert a string date to a date object
function getDate(string) {
    let [_, month, day , year] =
        /(\d{1,2})-(\d{1,2})-(\d{4})/.exec(string);
    return new Date(year, month - 1, day);
}
console.log(getDate("1-30-2003"));

// \b word boundry -> looks for the regEx at the start of a string or a substring
// with a character on the left and noncharacter on the right
console.log(/cat/.test("concatenate")); //true
console.log(/\bcat\b/.test("concatenate")); //false 


// | allows to test for a set of matches. Put choices in ( ).
let animalCount = /\b\d+ (pig|cow|chicken)s?\b/;
console.log(animalCount.test("15 pigs")); //true
console.log(animalCount.test("15 pigchickens")); //false


console.log("Borobudur".replace(/[ou]/, "a")); //only replaces the first instance
console.log("Borobudur".replace(/[ou]/g, "a")); //replaces all instances.

//example of replace
console.log("Liskov, Barbara\nMcCarthy, John\nWadler, Philip"
    .replace(/(\w+), (\w+)/g, "$2 $1"));

// match groups can be referenced by $1 to $9.
// The whole match is referenced by $&

//replace(regEx, function)
let s = "the cia and fbi";
console.log(s.replace(/\b(fbi|cia)\b/g,
            str => str.toUpperCase()));

let stock = "1 lemon, 2 cabbages, and 101 eggs";
function minusOne(match, amount, unit) {
    amount = Number(amount) - 1;
    if (amount == 1) { //only one left, remove the 's'
        unit = unit.slice(0, unit.length - 1);
    } else if (amount == 0) {
        amount = "no";
    }
    return amount + " " + unit;
}
console.log(stock.replace(/(\d+) (\w+)/g, minusOne)); 

// repetition operators +, *, ?, and {} are greedy by default
// checks the largest possible subset first, then removes from end one by one
function stripCommentsGreedy(code) {
    return code.replace(/\/\/.*|\/\*[^]*\*\//g, "");
}
console.log(stripCommentsGreedy("1 /* a */+/* b */ 1"));

// add ? after the operator to make it nongreedy
// checks the smallest possible subset first, then adds to end one by one
function stripCommentsNonGreedy(code) {
    return code.replace(/\/\/.*|\/\*[^]*?\*\//g, ""); 
}
console.log(stripCommentsNonGreedy("1 /* a */+/* b */ 1"));

//we can create a regExpression dynamically
let name = "harry";
let text = "Harry is a suspicious character.";
let regexp = new RegExp("\\b(" + name + ")\\b", "gi"); //must use // because string, g is match all, i is case insensitive
console.log(text.replace(regexp, "_$1_"));

//what if the name has special characters? 
let name2 = "dea+hl[]rd";
let text2 = "This dea+hl[]rd guy is super annoying.";
let escaped = name2.replace(/[\\[.+*?(){|^$]/g, "\\$&");
let regexp2 = new RegExp("\\b" + escaped + "\\b", "gi");
console.log(text2.replace(regexp2, "_$&_"));

//string search functions can use regExp
console.log("  word".search(/\S/));// -> 2
console.log("    ".search(/\S/));// -> -1 (not found)

//last index property
let pattern = /y/g;
pattern.lastIndex = 3;
let match3 = pattern.exec("xyzzy");
console.log(match3.index); // -> 4
console.log(pattern.lastIndex); // -> 5
//lastIndex is init as 0 and set to 0 if no match is found

//not bound by lastIndex
let global = /abc/g;
console.log(global.lastIndex)
console.log(global.exec("xyz abc")); // -> ["abc"]

//the match must start directly at last index
let sticky = /abc/y;
console.log(sticky.exec("xyz abc")); // -> null
sticky.lastIndex = 4;
console.log(sticky.exec("xyz abc")); // -> ["abc"]

//be careful when sharing a regExp with multiple exec calls
let digit = /\d/g;
console.log(digit.exec("here it is: 1")); // -> ["1"]  lastIndex = 12
console.log(digit.exec("and now: 1")); // -> null starting from lastIndex = 12

//global regExp work different with string match function
console.log("Banana".match(/an/g)); // -> ["an", "an"]
/* Use global regExp only in calls to .replace() or when we want to use lastIndex. */

//looping over matches
let input = "A string with 3 numbers in it... 42 and 88."
let number = /\b\d+\b/g;
let match4;
while (match = number.exec(input)) {
    console.log("Found", match[0], "at", match.index);
}
// -> Found 3 at 14
// -> Found 42 at 33
// -> Found 88 at 40

function parseINI(string) {
    // Start with an object to hold the top-level fields
    let result = {};
    let section = result;
    string.split(/\r?\n/).forEach(line => {
        let match;
        if (match = line.match(/^(\w+)=(.*)$/)) {
            section[match[1]] = match[2];
        } else if (match = line.match(/^\[(.*)\]$/)) {
            section = result[match[1]] = {};
        } else if (!/^\s*(;.*)?$/.test(line)) {
            throw new Error("Line '" + line + "' is not valid");
        }
    });
    return result;
}

console.log(parseINI(`
name=Vasilis
[address]
city=Tessaloniki`));
