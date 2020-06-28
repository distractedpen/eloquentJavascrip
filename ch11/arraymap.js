function square(x) {
    return x*x;
}

let a = [1, 2, 3, 4, 5];
let b = a.map(n => square(n));
b.map((n, i) => console.log(`${a[i]} squared equals ${b[i]}`));

