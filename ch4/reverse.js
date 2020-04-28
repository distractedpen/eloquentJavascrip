function reverseArray(array) {
    let rev_array = [];
    for (let i = 0; i < array.length; i++){
        rev_array.unshift(array[i]);
    }
    return rev_array;
}

function reverseArrayInPlace(array){
    for (let i = 0; i < Math.floor(array.length / 2); i++){
        temp = array[i];
        array[i] = array[array.length - 1 - i];
        array[array.length - 1 - i] = temp;
    }
}

console.log(reverseArray(["A", "B", "C"]));
let arrayValue = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
reverseArrayInPlace(arrayValue);
console.log(arrayValue);

