let click_event_example = document.querySelector("#click_event_example");
click_event_example.addEventListener("click", () => {
    console.log("You Knocked?");
});

let button1 = document.querySelector("#button1");
button1.addEventListener("click", () => {
    console.log("Button clicked.");
});

function message(){
    console.log("The sky is blueviolet.");
}

let actOnceButton = document.querySelector("#act_once_button");
function once() {
    console.log("Done.");
    actOnceButton.removeEventListener("click", once);
}
actOnceButton.addEventListener("click", once);

let which_button = document.querySelector("#which_button");
which_button.addEventListener("mousedown", event => {
    if (event.button == 0) {
        console.log("Left button");
    } else if (event.button == 1) {
        console.log("Middle button");
    } else if (event.button == 2)  {
        console.log("Right button");
    }
});

let p1 = document.querySelector("#p1");
let button_propagation = document.querySelector("#button_propagation");
p1.addEventListener("mousedown", () =>{
    console.log("Handler for paragraph.");
});
button_propagation.addEventListener("mousedown", event => {
    console.log("Handler for button.");
    if (event.button == 2) event.stopPropagation();
});

document.body.addEventListener("click", event => {
    if (event.target.nodeName == "BUTTON") {
        console.log("Clicked", event.target.textContent);
    }
});

let link = document.querySelector("#jokeLink");
link.addEventListener("click", () => {
    console.log("Nope.");
    event.preventDefault();
});

let key_event = document.querySelector("#key_event");
window.addEventListener("keydown", event => {
    if (event.key == "v") {
        key_event.style.background = "violet";
    }
});
window.addEventListener("keyup", event => {
    if (event.key == "v") {
        key_event.style.background = "";
    }
});

let lastX; //Tracks the last observed position of mouse X position
let bar = document.querySelector("#bar");
bar.addEventListener("mousedown", event => {
    if (event.button == 0) {
        lastX = event.clientX;
        window.addEventListener("mousemove", moved);
        event.preventDefault(); //Prevent selection
    }
});

function moved(event) {
    if (event.buttons == 0) {
        window.removeEventListener("mousemove", moved);
    } else {
        let dist = event.clientX - lastX;
        let newWidth = Math.max(10, bar.offsetWidth + dist);
        bar.style.width = newWidth + "px";
        lastX = event.clientX;
    }
}

