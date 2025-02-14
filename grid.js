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
    [0, 1],
    [1, 2],
    [1, 2, 3],
    [2, 3],
    [3,4,5],
    [4,5],
];

// let nullcount = 0;
let canvas = undefined;
let ctx = undefined;

const gSize = 50;
let gCons = [];
const U = -10;
const D = 10;
const L = -1;
const R = 1;
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
        // console.log((i + neighbourOffset < 0), ((i + neighbourOffset) >= gSize * gSize));
        if ((i + neighbourOffset < 0) || (i + neighbourOffset >= gSize * gSize)) {
            continue;
        }
        // console.log("here", gCons[i + neighbourOffset].length < 2);
        if (gCons[i + neighbourOffset].length < 2) {
            continue;
        }
        let newCons = removeConstraints(gCons[i + neighbourOffset], getValids(gCons[i]));
        if (newCons.length == gCons[i + neighbourOffset].length) {
            continue;
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

function test() {
    let i = getSmallest();
    for ( let j = 0; j < 100000; j++) {
        i = getSmallest();
        collapse(i);
        propogateConstraints(i);
    }
}

function getSmallest() {
    let lowest = Infinity;
    let lowestIndex = 0;
    for (let i in gCons) {
        if (gCons[i].length < lowest && gCons[i].length > 1) {
            lowest = gCons[i].length;
            lowestIndex = i;
        }
    }
    // console.log(lowestIndex)
    return Number(lowestIndex);
}

function animate(lastFrameTime) {
    let i = getSmallest();
    collapse(i);
    propogateConstraints(i);
    draw(ctx);
    requestAnimationFrame(animate);
}

function draw(ctx) {
    for (let i in gCons){
        ctx.lineWidth = 2;
        ctx.fillStyle = gCons[i].length == 1 ? colors[gCons[i][0]] : "black";
        let coord = indexToCoord(i);
        ctx.fillRect(coord[0] * 10, coord[1] * 10, 10, 10);
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
    canvas.width = gSize * 10;
    canvas.height = gSize * 10;
    collapse((gSize*gSize)/2);
    animate();
}
