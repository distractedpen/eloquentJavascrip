const roads = [
    "Alice's House-Bob's House",   "Alice's House-Cabin",
    "Alice's House-Post Office",   "Bob's House-Town Hall",
    "Daria's House-Ernie's House", "Daria's House-Town Hall",
    "Ernie's House-Grete's House", "Grete's House-Farm",
    "Grete's House-Shop",          "Marketplace-Farm",
    "Marketplace-Post Office",     "Marketplace-Shop",
    "Marketplace-Town Hall",       "Shop-Town Hall"
];

const mailRoute = [
    "Alice's House", "Cabin", "Alice's House", "Bob's House",
    "Town Hall", "Daria's House", "Ernie's House",
    "Grete's House", "Shop", "Grete's House", "Farm",
    "Marketplace", "Post Office"
];


function buildGraph(edges) {
let graph = Object.create(null);
function addEdge(from, to) {
    if (graph[from] == null) {
    graph[from] = [to];
    } else {
    graph[from].push(to);
    }
}
for (let [from, to] of edges.map(r => r.split("-"))) {
    addEdge(from, to);
    addEdge(to, from);
}
return graph;
}

const roadGraph = buildGraph(roads);
//console.log(roadGraph);

class VillageState {
    constructor(place, parcels) {
        this.place = place;
        this.parcels = parcels;
    }

    move(destination) {
        if (!roadGraph[this.place].includes(destination)) {
            return this;
        } else {
            let parcels = this.parcels.map(p => {
                if (p.place != this.place) return p;
                return {place: destination, address: p.address};
            }).filter(p => p.place != p.address);
            return new VillageState(destination, parcels);
        }
    }
}

// let first = new VillageState(
//     "Post Office",
//     [{place: "Post Office", address: "Alice's House"}]
//   );
//   let next = first.move("Alice's House");
  
//   console.log(next.place);
//   // → Alice's House
//   console.log(next.parcels);
//   // → []
//   console.log(first.place);
//   // → Post Office

// function runRobot(state, robot, memory) {
//     for (let turn = 0;; turn++) {
//         if (state.parcels.length == 0) {
//             console.log(`Done in ${turn} turns`);
//             break;
//         }
//         let action = robot(state, memory);
//         state = state.move(action.direction);
//         memory = action.memory;
//         console.log(`Moved to ${action.direction}`);
//     }
//}

function randomPick(array) {
    let choice = Math.floor(Math.random() * array.length);
    return array[choice];
}

function findRoute(graph, from, to) {
    let work = [{at: from, route: []}];
    for (let i = 0; i < work.length; i++){
        let {at, route} = work[i];
        for (let place of graph[at]) {
            if (place == to) return route.concat(place);
            if (!work.some(w => w.at == place)) {
                work.push({at: place, route: route.concat(place)});
            }
        }
    }
}

function randomRobot(state) {
    return {direction: randomPick(roadGraph[state.place])};
}

function routeRobot(state, memory) {
    if (memory.length == 0){
        memory = mailRoute;
    }
    return {direction: memory[0], memory: memory.slice(1)};
}

function goalOrientedRobot({place, parcels}, route) {
    if (route.length == 0) {
        let parcel = parcels[0];
        if (parcel.place != place) {
            route = findRoute(roadGraph, place, parcel.place);
        } else {
            route = findRoute(roadGraph, place, parcel.address);
        }
    }
    return {direction: route[0], memory: route.slice(1)};
}

VillageState.random = function(parcelCount = 5) {
    let parcels = [];
    for (let i = 0; i < parcelCount; i++){
        let address = randomPick(Object.keys(roadGraph));
        let place;
        do {
            place = randomPick(Object.keys(roadGraph));
        } while(place == address);
        parcels.push({place, address});
    }
    return new VillageState("Post Office", parcels);
};

function compareRobots(robot1, memory1, robot2, memory2) {
    let runR1Tasks = [];
    let runR2Tasks = [];
    for (let run = 0; run < 100; run++) {
      let state = VillageState.random();  
      runR1Tasks.push(runRobot(state, robot1, memory1));
      runR2Tasks.push(runRobot(state, robot2, memory2));
    }
    let robot1Average = runR1Tasks.reduce((a,b) => a+b) / runR1Tasks.length;
    let robot2Average = runR2Tasks.reduce((a,b) => a+b) / runR2Tasks.length;
    return console.log(`Robot 1: ${robot1Average} turns\nRobot 2: ${robot2Average} turns`);
}
  
function runRobot(state, robot, memory) {
    for (let turn = 0;; turn++) {
      if (state.parcels.length == 0) {
        return turn;
      }
      let action = robot(state, memory);
      state = state.move(action.direction);
      memory = action.memory;
    }
}

compareRobots(routeRobot, [], goalOrientedRobot, []);



/*
improvements on Mailbot:
1. findRoute to nearest address or place instead of next on the parcels array
instead of taking the next parcel on the list, look through the list and determine
which package location or destination is closest and go there.

edit:
let parcel = parcel[0];

psudo:
let parcel = findShortestedRoute(parcels);

function findShortestRoute(parcels) {
    loop through the parcels list:
    1st: find the closest place with a parcel (if no parcels address are closer), return place
    2nd: if no place has a parcel, return closest address
}

*/