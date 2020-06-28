"use strict";

let promiseObj = new Promise((resolve, reject) => {
    resolve("This promise resolved.");
});


function inside_Promise(value) {
    if (value < 0) throw new Error("Value too small. inside_Promise");
    else return value;
}

function promiseWrapper(arg) {
    return new Promise( (resolve, reject) => {
        if (arg < 0) reject(arg);
        else resolve(arg);
    });
}

function promiseWrapperwithFunction(value){
    return new Promise((resolve, reject) => {
        try {
            let v = inside_Promise(value);
            resolve(v);
        }catch(e) {
            reject(e);
        }
    });
}

function soon(val) {
    return new Promise(resolve => {
      setTimeout(() => resolve(val), Math.random() * 500);
    });
}

function Promise_all(promises){
    return new Promise( (resolve, reject) => {
      let resolved = [];
      for (let i = promises.length; i=>0; i--) {
        promises[promises.length - i].then(val => resolved.push(val),
                        e => reject(e));
      }
      return resolved;
    });
}

// Test code.
Promise_all([]).then(array => {
  console.log("This should be []:", array);
});

function soon(val) {
    return new Promise(resolve => {
      setTimeout(() => resolve(val), Math.random() * 500);
    });
}

Promise_all([soon(1), soon(2), soon(3)]).then(array => {
    console.log("This should be [1, 2, 3]:", array);
});

Promise_all([soon(1), Promise.reject("X"), soon(3)])
    .then(array => {
      console.log("We should not get here");
    })
    .catch(error => {
      if (error != "X") {
        console.log("Unexpected failure:", error);
      }
});


//Textbook Solution for Promise_all
function Promise_all(promises){
    return new Promise( (resolve, reject) => {
      let results = [];
      let pending = promises.length;
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(val => {
          results[i] = val;
          pending--;
          if (pending == 0) resolve(results);
        }).catch(reject);
      }
      if (promises.length == 0) resolve(results);
    });
}