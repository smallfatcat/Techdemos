const gridWidth = 300;
const gridHeight = 300;
const cellWidth = 30;
const cellHeight = 30;
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

    draw(ctx) {
        ctx.lineWidth = 2;
        ctx.fillStyle = this.constraints.length == 1 ? colors[this.constraints[0]] : colors[this.type];
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = 'gray';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.font = "10px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(this.constraints.length, this.x + cellWidth / 2, this.y + cellHeight / 2);
    }

    applyConstraints(constraints) {
        if (this.constraints.length > 0) {
            let constraintChanged = false;
            let combinedConstraints = new Set();
            for (let c of constraints) {
                for (let type of neighbours[c]) {
                    combinedConstraints.add(type);
                }
            }

            for (let constraint of this.constraints) {
            // for (let i = 0; i < this.constraints; i++){
                if (!combinedConstraints.has(constraint)) {
                    this.constraints.splice(this.constraints.indexOf(constraint), 1)
                    constraintChanged = true;
                }
            }
            if (constraintChanged) {
                applyConstraintToNeighbour(this);
            };
        }
    }

    collapse() {
        this.constraints = [this.constraints[Math.floor(Math.random() * this.constraints.length)]];
    }

}

function applyConstraintToNeighbour(cell) {
    if (cell.leftCol != undefined) {
        let targetCell = cells[cell.leftRow][cell.leftCol];
        targetCell.applyConstraints(cell.constraints);
    }
    if (cell.rightCol != undefined) {
        let targetCell = cells[cell.rightRow][cell.rightCol];
        targetCell.applyConstraints(cell.constraints);
    }
    if (cell.upRow != undefined) {
        let targetCell = cells[cell.upRow][cell.upCol];
        targetCell.applyConstraints(cell.constraints);
    }
    if (cell.downRow != undefined) {
        let targetCell = cells[cell.downRow][cell.downCol];
        targetCell.applyConstraints(cell.constraints);
    }
}



const colors = [
    "blue",
    "green",
    "yellow",
    "brown",
    'white',
];

const defaultConstraints = [
    0,
    1,
    2,
    3,
    4,
]

const neighbours = [
    [0, 2],
    [2, 1, 3],
    [0, 2, 1, 3],
    [1, 2, 3, 4],
    [3, 4]
];

let canvas = undefined;
let ctx = undefined;
const cells = [];

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
    // console.log(colors[cells[x][y].type]);
    // let newcolor = (cells[x][y].type + 1) % colors.length;
    // cells[x][y].type = newcolor;
    cells[x][y].collapse();
    applyConstraintToNeighbour(cells[x][y])

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
            cells[x][y].draw(ctx);
        }
    }

    // if (lastFrameTime > waitUntil) {
    //     waitUntil = waitUntil + frameTime;
    //     physics();
    // }
    requestAnimationFrame(animate);
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

