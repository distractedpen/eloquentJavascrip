const box = {
    locked: true,
    unlock() {this.locked = false;},
    lock() {this.locked = true},
    _content: [],
    get content() {
        if (this.locked) throw new Error("Locked!");
        return this._content;
    }
}

function withBoxUnlocked(body) {
    unlocked = false;
    if (!box.locked) unlocked = true;
    try{
        if(!unlocked) box.unlock();
        console.log(box.content);
        body();
    } finally{
        if (unlocked) box.lock();
    }
}

//book answer
/*
function withBoxUnlocked(body) {
    let locked = box.locked;
    if (!locked){
        return body();
    }

    box.unlock()
    try{
        return body();
    } finally {
        box.lock();
    }
}
*/

withBoxUnlocked(function() {
    box.content.push("gold piece");
});

try {
    withBoxUnlocked(function() {
        throw new Error("Pirates on the horizon! Abort!");
    });
}catch (e) {
    console.log("Error raised: " + e)
}

console.log(box.locked);