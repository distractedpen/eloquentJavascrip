let todoList = [];

function remember(task){
    todoList.push(task); // pushes entries from left to right (puts entry in max index)
}

function getTask(){
    return todoList.shift(); // returns the entries in index 0
}

function rememberUrgently(task) {
    todoList.unshift(task); // puts entry in index 0
}

function forgetTask(task){
    index = todoList.indexOf(task);
    todoList = todoList.slice(0, index)
        .concat(todoList.slice(index+1));
}


remember("groceries");
remember("laundry");
// todolist: "groceries", "laundry"
console.log(getTask()); //groceries
rememberUrgently("Get Dinner");
console.log(todoList)