function countBs(words) {
  let Bs = 0
  for (let i = 0; i < words.length; i++){
    if(words[i] == 'B') Bs += 1;
  }
  return Bs
}

function countChar(words, char) {
  let CharCount = 0
  for (let i = 0; i < words.length; i++){
    if(words[i] == char) CharCount += 1;
  }
  return CharCount
}

console.log(countBs("BBC"));
// → 2
console.log(countChar("kakkerlak", "k"));
// → 4