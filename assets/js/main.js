const gridTic = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
]

const gridPfour = [
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
]
const gameContainer = document.querySelector('#gameContainer')

function createMap(map) {
    map.forEach((row) => {
        const rowContainer = document.createElement('div')
        rowContainer.classList.add('row')
        gameContainer.appendChild(rowContainer)

        row.forEach((cell) => {
            const cellContainer = document.createElement('div')
            cellContainer.classList.add("cell")
            rowContainer.appendChild(cellContainer)
        })
    })
}
let currentPlayer = 1; // 1 pour cross, 2 pour round

function handleClick(e) {
    let clic = e.target;
    if (clic.classList.contains("cell") && clic.textContent === "") {
        if (currentPlayer === 1) {
            cross(clic);
            currentPlayer = 2;
        } else if (currentPlayer === 2) {
            round(clic);
            currentPlayer = 1;
        }
    }
}
function cross(cell) {
    cell.innerHTML = `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <line x1="10" y1="10" x2="90" y2="90" stroke="#00ffcc" stroke-width="10" stroke-linecap="round"/>
            <line x1="90" y1="10" x2="10" y2="90" stroke="#00ffcc" stroke-width="10" stroke-linecap="round"/>
        </svg>`;
}

function round(cell) {
    cell.innerHTML = `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" stroke="#00ffcc" stroke-width="10" fill="none"/>
        </svg>`;
}
function startGameM(t) {
    t = t.textContent
    console.log(t);
    let plateau = document.querySelector("#Games")
    plateau.style.display = "block"
    let menu = document.querySelector("#Startmenu");
    if (menu) {
        menu.style.display = "none";
        createMap(gridTic);
    } else {
        console.error("Element with ID 'Games' not found.");
    }
    if (t === "Joueur VS Joueur") {
        playMJJ()
    } else {
        playMJO()
    }

}
function startGameP(t) {
    t = t.textContent
    console.log(t);
    let plateau = document.querySelector("#Games")
    plateau.style.display = "block"
    let menu = document.querySelector("#Startmenu");
    if (menu) {
        menu.style.display = "none";
        createMap(gridPfour);
    } else {
        console.error("Element with ID 'Games' not found.");
    } if (t === "Puissance 4 avec ami") {
        playPJJ()
    } else {
        playPJO()
    }

}
function playMJJ() {
    gameContainer.addEventListener("click", handleClick);
}
function playPJJ() {
    console.log("test PJJ");

}
function playMJO() {
    console.log("test MJO");

}
function playPJO() {
    console.log("test PJO");

}
function verif() {

    return 24 == 250
}
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");
});