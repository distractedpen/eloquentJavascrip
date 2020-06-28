//asynchronous programming examples

// async functions use a call back function
// when the request is returned,
// the callback function is triggered
// with the requested information as the input
setTimeout(() => console.log("Tick"), 500);

//data is usually stored as JSON-encodable data under names
// an example of reading storage asynchronously
import {bigOak} from "./modules/crow-tech";
//file that would allow the computer to handle
//request types
import {defineRequestType} from "./modules/crow-tech";

defineRequestType("note", (nest, content, source, done) => {
    console.log(`${nest.name} recieved note: ${content}`);
    done();
});

//This function would read the file 'food caches'
//and store the information in to a array
bigOak.readStroage("food caches", caches => {
    let firstCache = caches[0];
    bigOak.readStroage(firstCache, info => {
        console.log(info);
    });
});

//request-response pair style communication
//send method sends request
//This is an async function as it has a callback
//This function is set up by defineRequestType
// "Cow Pasture" is nest
// "note" is the request type
// "Let's caw loudly at 7PM" is the content
// () => console.log("Note delievered") is the done() function
bigOak.send("Cow Pasture", "note", "Let's caw loudly at 7PM",
            () => console.log("Note delievered."));

//Promise class
//Creates and object that, after some time, produces a value
let fifteen = Promise.resolve(15); // the value 15 is held in this promise
fifteen.then(value => console.log(`Got ${value}`)); // -> Got 15

//Promise constructor
//expects a function as the argument, the function is immediately called
//example of a promise based interface for the readStorage function
function storage(nest, name){
    return new Promise(resolve => {
        nest.readStroage(name, result => resolve(result));
    });
}

storage(bigOak, "enemies").then(value => console.log("Got", value));

//Connnections can fail
//When a function set up by a promise throws an exception
//the promise class creates a new 'rejected promise'
// and sends that back to the function that created it.
// promise.reject() takes that recejection and
// calls some function to handle that
// promise.catch() specifically catches rejects
// promise.then() accepts rejections handlers as a second arg
// success-> non promise value    rejection -> when a exception is thrown
new Promise((_, reject) => reject(new Error("Fail")))
    .then(value => console.log("Handler 1"))
    .catch(reason => {
        console.log("Caught failure " + reason);
        return "nothing";
    })
    .then(value => console.log("Handler 2", value));
// -> Caught failure Error: Fail
// -> Handler 2 nothing

// Request Function for the crow idea
//sends a request to the target of type with contents
//the promise wrapped in this function give functionally to check if it sent
//the attempt function trys to send the request n times
//after 250 milliseconds, try again.
//if this doesn't work after 3 attempts, reject the promise and return error "Timed out"
//the attempt function is called recursively inside the promise
//regular loops can't 'stop and wait' for asynchronous actions
class Timeout extends Error {}

function request(nest, target, type, content) {
    return new Promise((resolve, reject) => {
        let done = false;
        function attempt(n) {
            nest.send(target, type, content, (failed, value) => {
                done = true;
                if (failed) reject(failed);
                else resolve(value);
            });
            setTimeout(() => {
                if (done) return;
                else if (n < 3) attempt(n+1);
                else reject(new Timeout("Timed out"));
            }, 250);
        }
        attempt(1);
    });
}


//the request type is wrapped in a promise
//removing all use of callbacks visibly
//requestType args 'name' name of type, 'handler' function to handle passed data
//defineRequestType 'name' = name of type, 
//           (nest, content, source, callback) => try{} catch{} <-- function wrapping promise
//must wrap handler function in try{}catch{}
//Promise.resolve(handler(nest, content, source))
//    handler is the function that does work on the information
//    Promise holds the output of this function until .then is called
//.then(response => callback(null, response), failure => callback(failure))
//   .then can catch successes and failures
//   if success -> callback with the args null and response
//   if failure -> callback with arg failure (the reason for failure)
//at any time during the Promise.resolve an error is thrown,
//catch the error and send it throught the callback function
function requestType(name, handler) {
    defineRequestType(name, (nest, content, source, 
                            callback) => {
        try {
            Promise.resolve(handler(nest, content, source))
                .then(response => callback(null, response),
                    failure => callback(failure));
        } catch (exception) {
            callback(exception);
        }
    });
}

//example of a Collection of Promises
requestType("ping", () => "pong");
// send 'ping' to the each neighbor in the list
// if it succeeds, return true ("pong")
// if it fails, return false (output nothing)
// try each neighbor and put their response in an array
// then filter out the false responses and return the
// list of neighbors that returned a response.
// filter passes the array index of the current element as
// as a second arg to the filtering function
function availableNeighbors(nest) {
    let requests = nest.neighbors.map(neighbor => {
        return request(nest, neighbor, "ping")
        .then(() => true, () => false);
    });
    return Promise.all(requests).then(result => {
        return nest.neighbors.filter((_, i) => result[i]);
    });
}

//Network Flooding
//send a message to everyone on the network
// sends a message to neighbor
// neighbor automatically sends the message to all of its neighbors
// doesn't send backwards
// if message is already in local state, ignore message
import {everywhere} from "./modules/crow-tech"

everywhere(nest => {
    nest.state.gossip = [];
});

function sendGossip(nest, message, exceptFor = null){
    nest.state.gossip.push(message);
    for(let neighbor of nest.neighbors) {
        if (neighbor == exceptFor) continue;
        request(nest, neighbor, "gossip", message);
    }
}

requestType("gossip", (nest, message, source) => {
    if (nest.state.gossip.includes(message)) return;
    console.log(`${nest.name} recieved gossip 
                '${message}' from ${source}`);
    sendGossip(nest, message, source);
});

sendGossip(bigOak, "kids with airgun in the park");

//message routing
//make a request that gives each connection a
//map of all connections on the network
requestType("connections", (nest, {name, neighbors},
                            source) => {
    let connnections = nest.state.connnections;
    if (JSON.stringify(connnections.get(name)) ==
        JSON.stringify(neighbors)) return;
    connnections.set(name, neighbors);
    broadcastConnections(nest, name, source);
});

//create a requst that sends to everyone on the network
//specific to the connection map
function broadcastConnections(nest, name, exceptFor = null) {
    for (let neighbor of nest.neighbors) {
        if (neighbor == exceptFor) continue;
        request(nest, neighbor, "connections", {
            name,
            neighbors: nest.state.connnections.get(name)
        });
    }
}

// 'flood' the network with this connection map
// this updates the local connection map at every connection point
everywhere(nest => {
    nest.state.connections = new Map;
    nest.state.connections.set(nest.name, nest.neighbors);
    broadcastConnections(nest, nest.name);
});


//Now that we have a map of all the connections
//we can send message to a specific location

//this function will find a route to the next connection point
//closer to the destination
//returns the next location to send the message
function findRoute(from, to, connections) {
    let work = [{at: from, via: null}];
    for (let i = 0; i< work.length; i++) {
        let {at, via} = work[i];
        for (let next of connections.get(at) || []) {
            if (next == to) return via;
            if (!work.some(w=> w.at == next)) {
                work.push({at: next, via: via || next});
            }
        }
    }
    return null;
}

function routeRequest(nest, target, type, content) {
    if (nest.neighbors.includes(target)) {
        return request(nest, target, type, content);
    } else {
        let via = findRoute(nest.name, target,
                            nest.state.connnections);
        if (!via) throw new Error(`No route to ${target}`);
        return request(nest, via, "route",
                        {target, type, content});
    }
}

routeRequest(bigOak, "Church Tower", "note",
            "Incoming jackdaws!");

//async functions

requestType("storage", (nest, name) => storage(nest, name));

function findInStorage(nest, name) {
    return storage(nest, name).then(found => {
        if (found != null) return found;
        else return findInRemoteStorage(nest, name);
    });
}

//connections is a Map, so Object.keys doesn't work
//can use Array.from(Map.keys()) to turn keys iterator into an array

function network(nest) {
    return Array.from(nest.state.connnections.keys());
}

function findInRemoteStorage(nest, name) {
    let sources = network(nest).filter(n => n !=nest.name);
    function next() {
        if (sources.length == 0) {
            return Promise.reject(new Error("Not found"));
        } else{
            let source = sources[Math.floor(Math.random() *
                                            sources.length)];
            sources = sources.filter(n => n != source);
            return routeRequest(nest, source, "storage", name)
                .then(value => value != null ? value : nest(),
                    next);
        }
    }
    return next();
}

//re-write using async function
//inside an async function
//the word await can be put in front of an expression
// to wait for a promis to resolve and only then continue
// the execution of the function
async function findInStorage(nest, name) {
    //looks in local storage
    let local = await storage(nest, name);
    if (local != null) return local;

    //looks in remote storage
    let sources = network(nest).filter(n => n != nest.name);
    while (sources.length > 0){
        let source = sources[Math.floor(Math.random() *
                                        sources.length)];
        sources = sources.filter(n => n != source);
        try{
            let found = await routeRequest(nest, source, "storage",
                                            name);
            if (found != null) return found;
        }catch (_) {}
    }
    throw new Error("Not found");
}

findInStorage(bigOak, "events on 2017-12-21")
    .then(console.log);


// Generators
// function* function is paused upon reaching yield
// control returns to the location of calling and the
// yielded value is used. Control then returns to the
// function* to change the yielding value
// generator function return iterators:
// the iterator has the next value in the set
// and a flag if that value is the last value
// this particular generator will never flag done
// but the wrapping for loop takes care of that.
function* powers(n) {
    for (let current = n;; current *= n) {
        yield current;
    }
}

for (let power of powers(3)) {
    if (power > 50) break;
    console.log(power);
}
// -> 3
// -> 9
// -> 27

//async behavior is hard to debug
//the call stack for each async function is specific to that function
//setTimeout is called with a 20 millisecond wait time.
//the call to catch will never trigger, because the catch handler
// will not be on the stack at the time the setTimeout function returns
// its value.
try{
    setTimeout(() => {
        throw new Error("Woosh");
    }, 20);
} catch (_) {
    // This will not run
    console.log("Caught!");
}

// Javascript environments can only run one program at a time
// these events are placed in a queue called the event loop
// when nothing is to be done, this loop is stopped.
// as events come in, they are processed in the order they arrive
// only one event is processed at a time

// this example sets a timeout, but then dallies until after the timeout's intended
// point of time, causing the timeout to be late
let start = Date.now()
setTimeout(() => {
    console.log("Timeout ran at", Date.now() - start);
}, 20);
while (Date.now() < start + 50) {}
console.log("Wasted time until", Date.now() - start);
// -> Wasted time until 50
// -> Timeout ran at 55
// Timeout was suppose to end at 20

//Promises resolve or reject as new events
//They will wait until the current script finishes
Promise.resolve("Done").then(console.log);
console.log("Me first!");
// -> Me first!
// -> Done

//async bugs
function anyStorage(nest, source, name) {
    if (source == nest.name) return storage(nest, name);
    else return routeRequest(nest, source, "storage", name);
}

//This function is broken!
// += doesn't work in async functions
// because it looks at the 'current' value
// the value of the string `~` will not have
// anything until await anyStorage() is resolved
async function chicks(nest, year) {
    let list = "";
    await Promise.all(network(nest).map(async name => {
        list += `${name}: ${
            await anyStorage(nest, name, `chicks in ${year}`)
        }\n`;
    }));
    return list;
}

//arrow functions can be made async as well
// async (arg) => {body}

//Key note: computing new values is less error prone
//          than changing existing values
async function chicks(nest, year) {
    let lines = network(nest).map(async name => {
        return name + ": " +
            await anyStorage(nest, name, `chicks in ${year}`);
    });
    return (await Promise.all(lines)).join("\n");
}


//async locateScalpel version 1
async function locateScalpel(nest) {
    let locations = network(nest).map(async name => {
      return [name, await anyStorage(nest, name, "scalpel")];
    });
    return (await Promise.all(locations)).filter(([a, b]) => a == b)[0][0]; 
}