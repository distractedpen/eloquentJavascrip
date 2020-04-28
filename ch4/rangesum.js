function range(start, end, step = 1) {
    let array = [];
    let index = 0;
    if (start <= end) {
        for (let i = start; i <= end; i += step){
          array[index] = i;
          index += 1;
        }
      return array;
      }
    else {
      for (let i = start; i >= end; i += step){
          array[index] = i;
          index += 1;
        }
      return array;
    }
  }
  
  function sum(array) {
    sum = 0;
    for (i of array) sum += i;
    return sum;
  }
  console.log(range(1, 10));
  // → [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  console.log(range(5, 2, -1));
  // → [5, 4, 3, 2]
  console.log(sum(range(1, 10)));
  // → 55