const colors = [
    "blue",
    "yellow",
    "green",
    "brown",
];

const defaultConstraints = [
    0,
    1,
    2,
    3,
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
    [0, 1, 2],
    [1, 2, 3],
    [2, 3],
];

// let nullcount = 0;
// let canvas = undefined;
// let ctx = undefined;
// let cells = [];
// const gridWidth = 500;
// const gridHeight = 500;
// const cellWidth = 20;
// const cellHeight = 20;
// const maxCol = gridWidth / cellWidth;
// const maxRow = gridHeight / cellHeight;
// const nullLimit = 25;

// class Cell {
//     constructor(x, y, width, height, type) {
//         this.x = x;
//         this.y = y;
//         this.width = width;
//         this.height = height;
//         this.type = type;
//         this.constraints = defaultConstraints.slice();
//         this.col = Math.floor(y / width);
//         this.row = Math.floor(x / height);

//         this.leftCol = this.col - 1 >= 0 ? this.col - 1 : undefined;
//         this.leftRow = this.row;

//         this.rightCol = this.col + 1 < maxCol ? this.col + 1 : undefined;
//         this.rightRow = this.row;

//         this.upRow = this.row - 1 >= 0 ? this.row - 1 : undefined;
//         this.upCol = this.col;

//         this.downRow = this.row + 1 < maxRow ? this.row + 1 : undefined;
//         this.downCol = this.col;
//     }
// }

const gSize = 10;
let gCons = [];
const U = -10;
const D = 10;
const L = -1;
const R = 1;
const neighbourOffsets = [-10, 10, -1, 1];
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
    for (let con of originals){
        if (valids.includes(con)){
            newCons.push(con);
        }
    }
    return newCons;
}

function propogateConstraints(i) {
    // check each neighbour
    for (let neighbourOffset of neighbourOffsets) {
        if ((i + neighbourOffset < 0) || (i + neighbourOffset >= gSize * gSize)){
            continue;
        }
        if(gCons[i + neighbourOffset].length < 2){
            return;
        }
        let newCons = removeConstraints(gCons[i + neighbourOffset], getValids(gCons[i]));
        if(newCons.length == gCons[i + neighbourOffset].length){
            return;
        }
        gCons[i + neighbourOffset] = newCons;
        propogateConstraints(i + neighbourOffset);
    }
}

function getValids(constraints) {
    let valids = [];
    for(let c of constraints){
        for(let n of neighbours[c]){
            if(!valids.includes(n)){
                valids.push(n);
            }
        }
    }
    return valids;
}

function collapse(){
    
}


// function draw(ctx, cell) {
//     ctx.lineWidth = 2;
//     ctx.fillStyle = cell.constraints.length == 1 ? colors[cell.constraints[0]] : "black";
//     ctx.fillRect(cell.x, cell.y, cell.width, cell.height);
//     // ctx.strokeStyle = 'gray';
//     // ctx.strokeRect(cell.x, cell.y, cell.width, cell.height);
//     // ctx.font = "10px Arial";
//     // ctx.fillStyle = "white";
//     // ctx.fillText(cell.constraints.length, cell.x + cellWidth / 2, cell.y + cellHeight / 2);
// }

// function applyConstraints(constraints, cell) {
//     if (cell.constraints.length > 0) {
//         let constraintChanged = false;
//         let combinedConstraints = new Set();
//         for (let c of constraints) {
//             for (let type of neighbours[c]) {
//                 combinedConstraints.add(type);
//             }
//         }

//         for (let constraint of cell.constraints) {
//             if (!combinedConstraints.has(constraint)) {
//                 cell.constraints.splice(cell.constraints.indexOf(constraint), 1)
//                 constraintChanged = true;
//             }
//         }
//         if (constraintChanged) {
//             applyConstraintToNeighbour(constraints, cell);
//         };
//     }
// }

// function collapse(cell) {
//     let totalOfRatios = 0;
//     for (let i in cell.constraints) {
//         totalOfRatios += ratios[cell.constraints[i]];
//     }
//     let r = Math.floor(Math.random() * totalOfRatios);

//     let base = 0;
//     for (let i in cell.constraints) {
//         if (r < ratios[cell.constraints[i]] + base) {
//             cell.constraints = [cell.constraints[i]];
//             break;
//         }
//         base += ratios[cell.constraints[i]];
//     }
//     // cell.constraints = [cell.constraints[Math.floor(Math.random() * cell.constraints.length)]];
// }

// function applyConstraintToNeighbour(constraints, cell) {
//     if (cell.leftCol != undefined) {
//         let targetCell = cells[cell.leftRow][cell.leftCol];
//         applyConstraints(cell.constraints, targetCell);
//     }
//     if (cell.rightCol != undefined) {
//         let targetCell = cells[cell.rightRow][cell.rightCol];
//         applyConstraints(cell.constraints, targetCell);
//     }
//     if (cell.upRow != undefined) {
//         let targetCell = cells[cell.upRow][cell.upCol];
//         applyConstraints(cell.constraints, targetCell);
//     }
//     if (cell.downRow != undefined) {
//         let targetCell = cells[cell.downRow][cell.downCol];
//         applyConstraints(cell.constraints, targetCell);
//     }
// }

// for (let x = 0; x < gridWidth; x += cellWidth) {
//     rows = [];
//     for (let y = 0; y < gridHeight; y += cellHeight) {
//         rows.push(new Cell(x, y, cellWidth, cellHeight, 0));
//     }
//     cells.push(rows);
// }

// window.onload = (event) => {
//     canvas = document.getElementById("gridCanvas");
//     ctx = canvas.getContext("2d");
//     canvas.width = gridWidth;
//     canvas.height = gridHeight;

//     animate();

//     document.addEventListener('mousedown', function (event) {
//         let x = Math.floor(event.offsetX / cellWidth);
//         let y = Math.floor(event.offsetY / cellHeight);
//         targetCell();
//     });
// }

// function targetCell() {
//     oldCells = JSON.stringify(cells);

//     let target = getLowestEntropyCell(cells);
//     if (target == undefined) {
//         return;
//     }
//     collapse(target);
//     applyConstraintToNeighbour(target.constraints, target);

//     if (checkForNull(cells)) {
//         cells = JSON.parse(oldCells);
//     }
// }

// function getLowestEntropyCell(cells) {
//     lowestX = [];
//     lowestY = [];
//     highestX = [];
//     highestY = [];
//     lowestEntropy = Infinity;
//     for (let x = 0; x < maxCol; x++) {
//         for (let y = 0; y < maxRow; y++) {
//             let entropy = cells[x][y].constraints.length;
//             if (entropy == lowestEntropy && entropy > 1) {
//                 lowestX.push(x);
//                 lowestY.push(y);
//             }
//             if (entropy < lowestEntropy && entropy > 1) {
//                 lowestX = [x];
//                 lowestY = [y];
//                 lowestEntropy = entropy;
//             }
//             if (entropy > lowestEntropy && entropy > 1) {
//                 highestX.push(x);
//                 highestY.push(y);
//             }
//         }
//     }
//     let i = Math.floor(Math.random() * lowestX.length);
//     let j = Math.floor(Math.random() * highestX.length);
//     if (nullcount > nullLimit) {
//         nullcount = 0;
//         return cells[highestX[j]][highestY[j]];
//     }

//     if (lowestX.length > 0) {
//         return cells[lowestX[i]][lowestY[i]];
//     }

//     return undefined;
// }

// function checkForNull(cells) {
//     for (let x = 0; x < maxCol; x++) {
//         for (let y = 0; y < maxRow; y++) {
//             let entropy = cells[x][y].constraints.length;
//             if (entropy == 0) {
//                 nullcount += 1;
//                 return true;
//             }
//         }
//     }
//     nullcount = 0;
//     return false;
// }

// function getRandomColor() {
//     return colors[Math.floor(Math.random() * 7)];
// }

// let previousFrameTime = 0;
// const frameTime = 100;
// let waitUntil = frameTime;

// function animate(lastFrameTime) {
//     previousFrameTime = lastFrameTime;
//     for (let y = 0; y < cells.length; y++) {
//         for (let x = 0; x < cells[0].length; x++) {
//             draw(ctx, cells[x][y]);
//         }
//     }

//     requestAnimationFrame(animate);
//     targetCell();
// }
