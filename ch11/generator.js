// Generators
function* powers(n) {
    for (let current = n;; current *= n) {
        console.log("in the generator");
        yield current;
    }
}

for (let power of powers(3)) {
    if (power > 50) break;
    console.log(power);
}
// -> 3
// -> 9
// -> 27