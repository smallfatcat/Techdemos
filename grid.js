const colors = [
    "blue",
    "blue",
    "yellow",
    "green",
    "darkgreen",
    "brown",
];

const defaultConstraints = [
    0,
    1,
    2,
    3,
    4,
    5,
];

// const ratios = [
//     5,
//     5,
//     5,
//     5,
//     5,
//     5,
// ];

const neighbours = [
    [0, 1],     // 0
    [1, 2],     // 1
    [1, 2, 3],  // 2
    [2, 3, 4],     // 3
    [3, 4, 5],  // 4
    [4, 5],     // 5
];

// let nullcount = 0;
let canvas = undefined;
let ctx = undefined;

let completed = 0;
const cellSize = 10;
const gSize = 100;
let gCons = [];
const neighbourOffsets = [gSize * -1, gSize, -1, 1];
for (let i = 0; i < gSize * gSize; i++) {
    gCons.push(defaultConstraints.slice());
}

function indexToCoord(i) {
    let x = i % gSize;
    let y = Math.floor(i / gSize);
    return [x, y];
}

function coordToIndex(coord) {
    let i = coord[0] + coord[1] * gSize;
    return i;
}

function removeConstraints(originals, valids) {
    let newCons = [];
    for (let con of originals) {
        if (valids.includes(con)) {
            newCons.push(con);
        }
    }
    return newCons;
}

function propogateConstraints(i) {
    // check each neighbour
    for (let neighbourOffset of neighbourOffsets) {
        if ((i + neighbourOffset < 0) || (i + neighbourOffset >= gSize * gSize)) {
            continue;
        }
        if (gCons[i + neighbourOffset].length < 2) {
            continue;
        }
        let newCons = removeConstraints(gCons[i + neighbourOffset], getValids(gCons[i]));
        if (newCons.length == gCons[i + neighbourOffset].length || newCons.length == 0) {
            return;
        }
        gCons[i + neighbourOffset] = newCons;
        propogateConstraints(i + neighbourOffset);
    }
}

function getValids(constraints) {
    let valids = [];
    for (let c of constraints) {
        for (let n of neighbours[c]) {
            if (!valids.includes(n)) {
                valids.push(n);
            }
        }
    }
    return valids;
}

function collapse(i) {
    let r = Math.floor(Math.random() * gCons[i].length)
    gCons[i] = [gCons[i][r]];
}

let completedCells = new Set();

function getSmallest() {
    completed = 0;
    let lowest = Infinity;
    let lowestIndexes = [];
    for (let i in gCons) {
        if (gCons[i].length == 1) {
            completed += 1;
            // continue;
        }
        if (gCons[i].length == 0) {
            console.log("null");
            // continue;
        }
        if (gCons[i].length <= lowest && gCons[i].length > 1) {
            lowest = gCons[i].length;
            lowestIndexes.push(i);
        }
    }
    let r = Math.floor(Math.random() * lowestIndexes.length);
    return Number(lowestIndexes.length > 0 ? lowestIndexes[r] : -1);
}

let loopLimit = 100;

function animate(lastFrameTime) {
    let i = 0;
    for (let j = 0; j < loopLimit; j++) {
        i = getSmallest();
        if (completed != gSize * gSize) {
            collapse(i);
            propogateConstraints(i);
        }
    }
    draw(ctx);
    requestAnimationFrame(animate);
}


function draw(ctx) {
    for (let i in gCons) {
        ctx.lineWidth = 2;
        ctx.fillStyle = gCons[i].length == 1 ? colors[gCons[i][0]] : "black";
        let coord = indexToCoord(i);
        ctx.fillRect(coord[0] * cellSize, coord[1] * cellSize, cellSize, cellSize);
        // console.log(coord[0] * 10, coord[1] * 10, 10, 10);
    }

    // ctx.strokeStyle = 'gray';
    // ctx.strokeRect(cell.x, cell.y, cell.width, cell.height);
    // ctx.font = "10px Arial";
    // ctx.fillStyle = "white";
    // ctx.fillText(cell.constraints.length, cell.x + cellWidth / 2, cell.y + cellHeight / 2);
}

window.onload = (event) => {
    canvas = document.getElementById("gridCanvas");
    ctx = canvas.getContext("2d");
    canvas.width = gSize * cellSize;
    canvas.height = gSize * cellSize;
    collapse((gSize * gSize) / 2 + gSize / 2);
    propogateConstraints((gSize * gSize) / 2 + gSize / 2);
    draw(ctx);
    animate();
}
