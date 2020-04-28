// recursive version (my solution)
function arrayToList(array){
    if (array.length <=0) return null;
    else {
      return {
        value: array.shift(),
        rest: arrayToList(array)
      }
    }
}
// looping version (text solution)
function arrayToListLoop(array){
  let list = null;
  for (let i = array.length - 1; i >=0; i--){
    list = {value: array[i], rest: list};
  }
  return list;
}

  let array = [];
  function listToArray(list){
    if (list.rest == null) {
      array.push(list.value);
      return array;
    }
    else{
      array.push(list.value);
      return listToArray(list.rest);
    }
  }
  // textbook solution to listToArray
  // function listToArray(list) {
  //   let array = [];
  //   for (let node = list; node; node = node.rest) {
  //     array.push(node.value);
  //   }
  //   return array;
  // }
   
  function prepend(element, list){
    return {value: element, rest: list};
  }
   
  function nth(list, index){
    if (!list) return undefined;
    if(index == 0) { 
       return list.value;
    }
    else {
       return nth(list.rest, index - 1)
    }
       
  }
   
  console.log(arrayToList([10, 20]));
  // → {value: 10, rest: {value: 20, rest: null}}
  console.log(listToArray(arrayToList([10, 20, 30])));
  // → [10, 20, 30]
  console.log(prepend(10, prepend(20, null)));
  // → {value: 10, rest: {value: 20, rest: null}}
  console.log(nth(arrayToList([10, 20, 30]), 1));
  // → 20
  