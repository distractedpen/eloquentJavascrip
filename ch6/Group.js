/*
Method list:
    add: add an element if it is not already an element
    delete: remove an element if it exisits
    has: return 'true' if the element exists in the Group
    static from: takes an iterable object and creates a group from it
*/

class Group {
    constructor() {
        this.elements = [];
    }

    add(element) {
        if (!this.has(element)) this.elements.push(element);
    }

    delete(element) {
        this.elements = this.elements.filter(v => v !== element);
    }

    has(element) {
        return this.elements.includes(element);
    }


    static from(iterableObject){
        let group = new Group();
        for (let i of iterableObject)
            group.add(i);
        return group;
    }

/*     [Symbol.iterator] = function() {
        return new GroupIterator(this);
    } */
}

// class GroupIterator {
//     constructor(group){
//         this.index = 0;
//         this.group = group;
//     }

//     next() {
//         if (this.index >= this.group.elements.length) return {done: true};

//         let result = { value: this.group.elements[this.index],
//                       done: false};

//         this.index++;
//         return result;
//     }
// }

//This iterator uses a generating function learning in chapter 11
Group.prototype[Symbol.iterator] = function*() {
    for (let i = 0; i < this.members.length; i++) {
        yield this.members[i];
    }
};

for (let value of Group.from(["a", "b", "c"])) {
    console.log(value);
  }
let group = Group.from([10, 20]);
console.log(group.has(10));
// → true
console.log(group.has(30));
// → false
group.add(10);
group.delete(10);
console.log(group.has(10));
// → false

