const gridWidth = 300;
const gridHeight = 300;
const cellWidth = 10;
const cellHeight = 10;
const maxCol = gridWidth / cellWidth;
const maxRow = gridHeight / cellHeight;

class Cell {
    constructor(x, y, width, height, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.constraints = defaultConstraints.slice();
        this.col = Math.floor(y / width);
        this.row = Math.floor(x / height);

        this.leftCol = this.col - 1 >= 0 ? this.col - 1 : undefined;
        this.leftRow = this.row;

        this.rightCol = this.col + 1 < maxCol ? this.col + 1 : undefined;
        this.rightRow = this.row;

        this.upRow = this.row - 1 >= 0 ? this.row - 1 : undefined;
        this.upCol = this.col;

        this.downRow = this.row + 1 < maxRow ? this.row + 1 : undefined;
        this.downCol = this.col;
    }

    // draw(ctx) {
    //     ctx.lineWidth = 2;
    //     ctx.fillStyle = this.constraints.length == 1 ? colors[this.constraints[0]] : colors[this.type];
    //     ctx.fillRect(this.x, this.y, this.width, this.height);
    //     ctx.strokeStyle = 'gray';
    //     ctx.strokeRect(this.x, this.y, this.width, this.height);
    //     ctx.font = "10px Arial";
    //     ctx.fillStyle = "white";
    //     ctx.fillText(this.constraints.length, this.x + cellWidth / 2, this.y + cellHeight / 2);
    // }

    // applyConstraints(constraints) {
    //     if (this.constraints.length > 0) {
    //         let constraintChanged = false;
    //         let combinedConstraints = new Set();
    //         for (let c of constraints) {
    //             for (let type of neighbours[c]) {
    //                 combinedConstraints.add(type);
    //             }
    //         }

    //         for (let constraint of this.constraints) {
    //         // for (let i = 0; i < this.constraints; i++){
    //             if (!combinedConstraints.has(constraint)) {
    //                 this.constraints.splice(this.constraints.indexOf(constraint), 1)
    //                 constraintChanged = true;
    //             }
    //         }
    //         if (constraintChanged) {
    //             applyConstraintToNeighbour(this);
    //         };
    //     }
    // }

    // collapse() {
    //     this.constraints = [this.constraints[Math.floor(Math.random() * this.constraints.length)]];
    // }

}

function draw(ctx, cell) {
    ctx.lineWidth = 2;
    ctx.fillStyle = cell.constraints.length == 1 ? colors[cell.constraints[0]] : colors[cell.type];
    ctx.fillRect(cell.x, cell.y, cell.width, cell.height);
    ctx.strokeStyle = 'gray';
    ctx.strokeRect(cell.x, cell.y, cell.width, cell.height);
    // ctx.font = "10px Arial";
    // ctx.fillStyle = "white";
    // ctx.fillText(cell.constraints.length, cell.x + cellWidth / 2, cell.y + cellHeight / 2);
}

function applyConstraints(constraints, cell) {
    if (cell.constraints.length > 0) {
        let constraintChanged = false;
        let combinedConstraints = new Set();
        for (let c of constraints) {
            for (let type of neighbours[c]) {
                combinedConstraints.add(type);
            }
        }

        for (let constraint of cell.constraints) {
            // for (let i = 0; i < cell.constraints; i++){
            if (!combinedConstraints.has(constraint)) {
                cell.constraints.splice(cell.constraints.indexOf(constraint), 1)
                constraintChanged = true;
            }
        }
        if (constraintChanged) {
            applyConstraintToNeighbour(constraints, cell);
        };
    }
}

function collapse(cell) {
    cell.constraints = [cell.constraints[Math.floor(Math.random() * cell.constraints.length)]];
}

function applyConstraintToNeighbour(constraints, cell) {
    if (cell.leftCol != undefined) {
        let targetCell = cells[cell.leftRow][cell.leftCol];
        applyConstraints(cell.constraints, targetCell);
    }
    if (cell.rightCol != undefined) {
        let targetCell = cells[cell.rightRow][cell.rightCol];
        applyConstraints(cell.constraints, targetCell);
    }
    if (cell.upRow != undefined) {
        let targetCell = cells[cell.upRow][cell.upCol];
        applyConstraints(cell.constraints, targetCell);
    }
    if (cell.downRow != undefined) {
        let targetCell = cells[cell.downRow][cell.downCol];
        applyConstraints(cell.constraints, targetCell);
    }
}



const colors = [
    "blue",
    "yellow",
    "green",
    'brown'
];

const defaultConstraints = [
    0,
    1,
    2,
    3
]

const neighbours = [
    [0, 1,],
    [0, 1, 2],
    [1, 2, 3],
    [2, 3]
];

let canvas = undefined;
let ctx = undefined;
let cells = [];

for (let x = 0; x < gridWidth; x += cellWidth) {
    rows = [];
    for (let y = 0; y < gridHeight; y += cellHeight) {
        rows.push(new Cell(x, y, cellWidth, cellHeight, 0));
    }
    cells.push(rows);
}

window.onload = (event) => {
    canvas = document.getElementById("gridCanvas");
    ctx = canvas.getContext("2d");
    canvas.width = gridWidth;
    canvas.height = gridHeight;

    animate();

    document.addEventListener('mousedown', function (event) {
        let x = Math.floor(event.offsetX / cellWidth);
        let y = Math.floor(event.offsetY / cellHeight);
        // console.log(event.offsetX, event.offsetY, x, y);
        targetCell(x, y);
    });
}

function targetCell(x, y) {
    oldCells = JSON.stringify(cells);

    collapse(cells[x][y]);
    applyConstraintToNeighbour(cells[x][y].constraints, cells[x][y])


    let target = getLowestEntropyCell(cells);
    collapse(target);
    applyConstraintToNeighbour(target.constraints, target);

    if(checkForNull(cells)){
        cells = JSON.parse(oldCells);
    }
}

function getLowestEntropyCell(cells) {
    lowestX = 0;
    lowestY = 0;
    lowestEntropy = Infinity;
    for (let x = 0; x < maxCol; x++) {
        for (let y = 0; y < maxRow; y++) {
            let entropy = cells[x][y].constraints.length;
            if (entropy < lowestEntropy && entropy > 1) {
                lowestEntropy = entropy;
                lowestX = x;
                lowestY = y;
            }
        }
    }
    return cells[lowestX][lowestY];
}

function checkForNull(cells) {
    for (let x = 0; x < maxCol; x++) {
        for (let y = 0; y < maxRow; y++) {
            let entropy = cells[x][y].constraints.length;
            if (entropy == 0) {
                return true;
            }
        }
    }
    return false;
}

function getRandomColor() {
    return colors[Math.floor(Math.random() * 7)];
}

let previousFrameTime = 0;
const frameTime = 100;
let waitUntil = frameTime;

function animate(lastFrameTime) {
    previousFrameTime = lastFrameTime;
    for (let y = 0; y < cells.length; y++) {
        for (let x = 0; x < cells[0].length; x++) {
            draw(ctx, cells[x][y]);
        }
    }

    // if (lastFrameTime > waitUntil) {
    //     waitUntil = waitUntil + frameTime;
    //     physics();
    // }
    requestAnimationFrame(animate);
    targetCell(5,5);
}

function physics() {
}

// for (row of cells) {
//     for (col of row) {
//         console.log(col.x, col.y, col.neighbours);
//     }
// }


function addNeighbours(cells) {
    for (let row = 0; row < cells.length - 1; row++) {
        for (let col = 0; col < cells[0].length; col++) {
            let thisColor = cells[row][col].type;
            setNeighbourColors(row - 1, col, thisColor);
            setNeighbourColors(row + 1, col, thisColor);
            setNeighbourColors(row, col - 1, thisColor);
            setNeighbourColors(row, col + 1, thisColor);
        }
    }

    function setNeighbourColors(row, col, thisColor) {
        if (row >= 0 && row < cells.length && col >= 0 && col < cells[0].length) {
            let neighbourColor = cells[row][col].type;
            if (!neighbours[thisColor].includes(neighbourColor)) {
                neighbours[thisColor].push(neighbourColor);
            }
        }
    }
}

