const colors = [
    "darkblue",     // 0
    "blue",         // 1
    "yellow",       // 2
    "green",        // 3
    "darkgreen",    // 4    
    "orange",       // 5
    "brown",        // 6
    "white",        // 7
];

const defaultConstraints = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
];

const ratios = [
    10,     // 0
    2,     // 1
    20,     // 2
    40,     // 3
    30,     // 4
    10,     // 5
    20,     // 6
    5,      // 7
];

const neighbours = [
    [0, 1],     // 0
    [0, 1, 2],     // 1
    [1, 2, 3],  // 2
    [2, 3, 4],     // 3
    [3, 4, 5, 6],  // 4
    [4, 5, 6],     // 5
    [4, 5, 6, 7],     // 6
    [6, 7],     // 7
];

let canvas = undefined;
let ctx = undefined;

let completed = 0;
let startTime = Date.now();
const cellSize = 10;
const gSize = 100;
const loopLimit = 100;
const neighbourOffsets = [
    gSize * -1,
    gSize * -1 - 1,
    gSize * -1 + 1,
    gSize,
    gSize - 1,
    gSize + 1,
    -1,
    1,
];

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
    let ratioTotal = 0;
    let base = 0;
    let r = 0;
    for (let c of gCons[i]) {
        ratioTotal += ratios[c];
    }
    r = Math.floor(Math.random() * ratioTotal);
    for (let c of gCons[i]) {
        if (r < (ratios[c] + base)) {
            gCons[i] = [c];
            break;
        }
        base += ratios[c];
    }
}

function lowestEntropy() {
    completed = 0;
    let lowest = Infinity;
    let lowestIndexes = [];
    for (let i in gCons) {
        if (gCons[i].length == 1) {
            completed += 1;
        }
        if (gCons[i].length == 0) {
            console.log("null");
        }
        if (gCons[i].length < lowest && gCons[i].length > 1) {
            lowest = gCons[i].length;
            lowestIndexes = [];
            lowestIndexes.push(i);
        }
        if (gCons[i].length == lowest && gCons[i].length > 1) {
            lowestIndexes.push(i);
        }
    }
    let r = Math.floor(Math.random() * lowestIndexes.length)
    return Number(lowestIndexes.length > 0 ? lowestIndexes[r] : -1);
}

function animate(lastFrameTime) {
    let i = 0;
    for (let j = 0; j < loopLimit; j++) {
        i = lowestEntropy();
        if (completed != gSize * gSize) {
            collapse(i);
            propogateConstraints(i);
        }
    }
    draw(ctx);
    if (completed != gSize * gSize) {
        requestAnimationFrame(animate);
    }
    else {
        console.log("Completed in " + (Date.now() - startTime) + "ms");
        grids.push(gCons);
    }
}

function draw(ctx) {
    for (let i in gCons) {
        ctx.lineWidth = 2;
        ctx.fillStyle = gCons[i].length == 1 ? colors[gCons[i][0]] : "black";
        let coord = indexToCoord(i);
        ctx.fillRect(coord[0] * cellSize, coord[1] * cellSize, cellSize, cellSize);
    }

    // ctx.strokeStyle = 'gray';
    // ctx.strokeRect(cell.x, cell.y, cell.width, cell.height);
    // ctx.font = "10px Arial";
    // ctx.fillStyle = "white";
    // ctx.fillText(cell.constraints.length, cell.x + cellWidth / 2, cell.y + cellHeight / 2);
}

let gCons = [];
let grids = [];

function initGrid() {
    startTime = 0;
    completed = 0;
    gCons = [];
    for (let i = 0; i < gSize * gSize; i++) {
        gCons.push(defaultConstraints.slice());
    }
    for (let i = 0; i < 1; i++) {
        let r = Math.floor(Math.random() * gSize * gSize)
        collapse(r);
        propogateConstraints(r);
    }
    animate();
    console.log("Init")
}

window.onload = (event) => {
    canvas = document.getElementById("gridCanvas");
    ctx = canvas.getContext("2d");
    canvas.width = gSize * cellSize;
    canvas.height = gSize * cellSize;
    initGrid();
}

function loadGrid(i) {
    gCons = grids[i];
    draw(ctx);
}
