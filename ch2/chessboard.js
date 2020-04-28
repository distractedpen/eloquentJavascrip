board = ''
size = 100
for (let row = 0; row < size; row++) {
  for (let col = 0; col < size; col++) {
    if (row % 2 === 0 && col % 2 === 0)
      board += ' '
    else if (row % 2 !== 0 && col % 2 !== 0)
      board += ' '
    else
      board += '#'    
  }
  board +='\n'
}
console.log(board)