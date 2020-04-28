//Fizz Buzz Code Snippet
for (let i = 1; i < 101; i++){

  fb = '';
  if (i % 3 == 0) fb += 'Fizz';
  if (i % 5 == 0) fb += 'Buzz';
  console.log(fb || i);
}