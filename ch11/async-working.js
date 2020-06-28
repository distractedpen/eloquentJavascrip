import {bigOak} from "./modules/crow-tech.js";
import {defineRequestType} from "./modules/crow-tech";
import {everywhere} from "./modules/crow-tech"

class Timeout extends Error {}

defineRequestType("note", (nest, content, source, done) => {
    console.log(`${nest.name} recieved note: ${content}`);
    done();
});

bigOak.readStorage("food caches", caches => {
    let firstCache = caches[0];
    readStorage(firstCache, info => {
        console.log(info);
    });
});

bigOak.send("Cow Pasture", "note", "Let's caw loudly at 7PM", 
    () => console.log("Note delivered.")
);

function storage(nest, name){
    return new Promise(resolve => {
        nest.readStroage(name, result => resolve(result));
    });
}

storage(bigOak, "enemies").then(value => console.log("Got", value));

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

requestType("ping", () => "pong");


/* Look here for help on non async Scalpel function */
function availableNeighbors(nest) {
    let requests = nest.neighbors.map(neighbor => {
        return request(nest, neighbor, "ping")
        .then(() => true, () => false);
    });
    return Promise.all(requests).then(result => {
        return nest.neighbors.filter((_, i) => result[i]);
    });
}

availableNeighbors(bigOak).then(value => console.log(value));

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

requestType("connections", (nest, {name, neighbors},
    source) => {
let connnections = nest.state.connnections;
if (JSON.stringify(connnections.get(name)) ==
JSON.stringify(neighbors)) return;
connnections.set(name, neighbors);
broadcastConnections(nest, name, source);
});

function broadcastConnections(nest, name, exceptFor = null) {
    for (let neighbor of nest.neighbors) {
        if (neighbor == exceptFor) continue;
        request(nest, neighbor, "connections", {
            name,
            neighbors: nest.state.connnections.get(name)
        });
    }
}

everywhere(nest => {
    nest.state.connections = new Map;
    nest.state.connections.set(nest.name, nest.neighbors);
    broadcastConnections(nest, nest.name);
});

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

routeRequest(bigOak, "Church Tower", "note", "Incoming jackdaws!");

requestType("storage", (nest, name) => storage(nest, name));

function network(nest) {
    return Array.from(nest.state.connnections.keys());
}

//sync version
function findInStorage(nest, name) {
    return storage(nest, name).then(found => {
        if (found != null) return found;
        else return findInRemoteStorage(nest, name);
    });
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
                .then(value => value != null ? value : next(),
                    next);
        }
    }
    return next();
}

//async version
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

findInStorage(bigOak, "events on 2017-12-21").then(console.log);

function anyStorage(nest, source, name) {
    if (source == nest.name) return storage(nest, name);
    else return routeRequest(nest, source, "storage", name);
}

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

//async locateScalpel Textbook Answer
async function locateScalpel(nest){
    let current = nest.name;
    for (;;){
        let next = await anyStorage(nest, current, "scalpel");
        if(next == current) return current;
        current = next;
    }
}

function locateScalpel2(nest) {
    let locations = network(nest).filter(n => n != nest.name);
    function next() {
      if (locations.length == 0){
        return Promise.reject(new Error("Not found"));
      } else {
        let location = locations[0];
        console.log(location);
        locations = locations.filter(n => n != location);
        console.log(locations);
        return anyStorage(nest, location, "scalpel")
            .then(value => value == location ? value : next());
      }
    }
    return next();
}

//sync locateScalpel textbook answer
function locateScalpel2(nest){
    function loop(current){
        return anyStorage(nest, current, "scalpel").then(next => {
            if (next == current) return current;
            else return loop(next);
        });
    }
    return loop(nest.name);
}