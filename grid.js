const colors = [
    "darkblue",
    "blue",
    "yellow",
    "green",
    "darkgreen",
    "orange",
    "brown",
    "white",
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
    2,
    5,
    5,
    5,
    5,
    5,
    5,
    2,
];

const neighbours = [
    [0, 1],     // 0
    [0, 1, 2],     // 1
    [1, 2, 3],  // 2
    [2, 3, 4],     // 3
    [3, 4, 5],  // 4
    [4, 5, 6],     // 5
    [5, 6, 7],     // 6
    [6, 7],     // 7
];

// let nullcount = 0;
let canvas = undefined;
let ctx = undefined;

let completed = 0;
const startTime = Date.now();
const cellSize = 10;
const gSize = 50;
const loopLimit = 100;
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
    let ratioTotal = 0;
    let base = 0;
    let r = 0;
    for (let c in gCons[i]){
        ratioTotal += ratios[gCons[i][c]];
    }
    r = Math.floor(Math.random() * ratioTotal);
    for (let c in gCons[i]){
        // console.log(i, r, ratioTotal, gCons[i], gCons[i][c]);
        if(r <  (ratios[gCons[i][c]] + base)){
            gCons[i] = [gCons[i][c]];
            break;
        }    
        base += gCons[i][c];
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
            // lowest = gCons[i].length;
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

window.onload = (event) => {
    canvas = document.getElementById("gridCanvas");
    ctx = canvas.getContext("2d");
    canvas.width = gSize * cellSize;
    canvas.height = gSize * cellSize;
    for (let i = 0; i < 1; i++){
        let r = Math.floor(Math.random()*gSize*gSize)
        collapse(r);
        // gCons[r] = [0];
        propogateConstraints(r);
    }
    draw(ctx);
    animate();
}
