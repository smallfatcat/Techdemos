const colors = [
    "darkblue",
    "blue",
    "yellow",
    "green",
    "brown",
    "orange",
    "darkgrey",
];

const defaultConstraints = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,

];

const ratios = [
    30,     // 0
    20,     // 1
    20,     // 2
    20,     // 3
    10,     // 4
    10,     // 5
    20,     // 6

];

const neighbours = [
    [0, 1],     // 0
    [0, 1, 2],     // 1
    [1, 2, 3],  // 2
    [2, 3, 4],     // 3
    [3, 4, 5, 6],  // 4
    [4, 5, 6],     // 5
    [4, 5, 6],     // 6
];

let tileCanvas = undefined;
let tilectx = undefined;

let completed = 0;
let startTime = Date.now();
const cellSize = 10;
const gSize = 50;
const loopLimit = 100;
const neighbourOffsets = [
    gSize * -1,
    gSize * -1 - 1,
    gSize * -1 + 1,
    -1,
    1,
    gSize,
    gSize - 1,
    gSize + 1,
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
        if (tilePixels[i + neighbourOffset].length < 2) {
            continue;
        }
        let newCons = removeConstraints(tilePixels[i + neighbourOffset], getValids(tilePixels[i]));
        if (newCons.length == tilePixels[i + neighbourOffset].length || newCons.length == 0) {
            return;
        }
        tilePixels[i + neighbourOffset] = newCons;
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
    for (let c of tilePixels[i]) {
        ratioTotal += ratios[c];
    }
    r = Math.floor(Math.random() * ratioTotal);
    for (let c of tilePixels[i]) {
        if (r < (ratios[c] + base)) {
            tilePixels[i] = [c];
            break;
        }
        base += ratios[c];
    }
}

function lowestEntropy() {
    completed = 0;
    let lowest = Infinity;
    let lowestIndexes = [];
    for (let i in tilePixels) {
        if (tilePixels[i].length == 1) {
            completed += 1;
        }
        if (tilePixels[i].length == 0) {
            console.log("null");
        }
        if (tilePixels[i].length < lowest && tilePixels[i].length > 1) {
            lowest = tilePixels[i].length;
            lowestIndexes = [];
            lowestIndexes.push(i);
        }
        if (tilePixels[i].length == lowest && tilePixels[i].length > 1) {
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
    drawPossibilities(tilectx);
    if (completed != gSize * gSize) {
        requestAnimationFrame(animate);
    }
    else {
        console.log("Completed in " + (Date.now() - startTime) + "ms");
        grids.push(tilePixels);
    }
}

function drawPossibilities(ctx) {
    for (let i in tilePixels) {
        ctx.lineWidth = 2;
        ctx.fillStyle = tilePixels[i].length == 1 ? colors[tilePixels[i][0]] : "black";
        let coord = indexToCoord(i);
        ctx.fillRect(coord[0] * cellSize, coord[1] * cellSize, cellSize, cellSize);
    }

    // ctx.strokeStyle = 'gray';
    // ctx.strokeRect(cell.x, cell.y, cell.width, cell.height);
    // ctx.font = "10px Arial";
    // ctx.fillStyle = "white";
    // ctx.fillText(cell.constraints.length, cell.x + cellWidth / 2, cell.y + cellHeight / 2);
}

let tilePixels = [];
let grids = [];

function copyGridEdge(edge) {
    if (grids.length > 0) {
        if (edge = "right") {
            for (let i = gSize - 1; i < gSize * gSize; i += gSize) {
                tilePixels[i - gSize + 1] = grids[grids.length - 1][i];
            }
        }
    }
}

function initGrid() {
    startTime = Date.now();
    completed = 0;
    tilePixels = [];
    for (let i = 0; i < gSize * gSize; i++) {
        tilePixels.push(defaultConstraints.slice());
    }
    copyGridEdge("right");
    for (let i = 0; i < 1; i++) {
        let r = Math.floor(Math.random() * gSize * gSize)
        if (grids.length > 0) {
            for ( r = 0; r < gSize * gSize; r += gSize){
                propogateConstraints(r);
            }
        }
        else {
            collapse(r);
            propogateConstraints(r);
        }
    }
    animate();
    console.log("Init")
}

window.onload = (event) => {
    tileCanvas = document.getElementById("gridCanvas");
    tilectx = tileCanvas.getContext("2d");
    tileCanvas.width = gSize * cellSize;
    tileCanvas.height = gSize * cellSize;
    initGrid();
}

function loadGrid(i) {
    tilePixels = grids[i];
    drawPossibilities(tilectx);
}
