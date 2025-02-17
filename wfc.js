let reducedSet = new Set();
let animate = true;
let labels = true;
const noOfColors = 2;
let tiles = makeTiles();
let possibilities = generatePossibilities();
const gridSize = 50;
const width = gridSize * 20;
const height = gridSize * 20;
const tSize = 10;
const loopCount = 20;
let grid = [];
const colors = [
    "darkblue",
    "blue",
    "yellow",
    "green",
    "darkgreen",
    "brown",
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

const directions = [
    gridSize * -1,
    1,
    gridSize,
    -1,
];

function initGrid() {
    grid = [];
    for (let i = 0; i < gridSize * gridSize; i++) {
        let constraints = [];
        for (let j = 0; j < tiles.length; j++) {
            constraints.push(j);
        }
        grid.push(constraints);
    }
}

window.onload = (event) => {
    tileCanvas = document.getElementById("tileCanvas");
    tilectx = tileCanvas.getContext("2d");
    tileCanvas.width = width;
    tileCanvas.height = height;

    initGrid();
    drawGrid(tilectx, grid);

}

function generateButton() {
    initGrid();
    animate = true;
    labels = true;
    wfc();
}

function wfc() {
    for (let j = 0; j < loopCount; j++) {
        let lowest = lowestEntropy();
        if (lowest == undefined) {
            animate = false;
            console.log("finished");
            labels = false;
            break;
        }
        let stack = [];
        collapse(lowest);
        stack.push(lowest);

        while (stack.length > 0) {
            let i = stack.pop();
            for (let d = 0; d < 4; d++) {
                let possible = getPossible(i, d);
                let target = i + directions[d]
                let reduced = constrain(target, possible);
                if (reduced) {
                    stack.push(target);
                }
            }
        }
    }
    drawGrid(tilectx, grid);
    if (animate) {
        requestAnimationFrame(wfc);
    }
}

function collapse(i) {
    // TODO: use probabilty to determine most likely collapse
    let constraints = grid[i];
    let r = Math.floor(Math.random() * constraints.length);
    grid[i] = [constraints[r]];
    reducedSet.delete(i);
}

function getPossible(i, direction) {
    let tile = grid[i];
    let possibleSet = new Set();
    for (let j = 0; j < tile.length; j++) {
        let temp = possibilities[tile[j]][direction];
        for (let possible of temp) {
            possibleSet.add(possible);
        }
    }
    return possibleSet;
}

function lowestEntropy() {
    let lowest = Infinity;
    let lowestIDs = [];
    if (reducedSet.size > 0) {
        for (i of reducedSet) {
            let entropy = grid[i].length;
            if (entropy < lowest && entropy > 1) {
                lowest = entropy;
                lowestIDs = [];
            }
            if (entropy == lowest) {
                lowestIDs.push(i);
            }
        }
    }
    else {
        for (let i = 0; i < grid.length; i++) {
            let entropy = grid[i].length;
            if (entropy < lowest && entropy > 1) {
                lowest = entropy;
                lowestIDs = [];
            }
            if (entropy == lowest) {
                lowestIDs.push(i);
            }
        }
    }
    let r = Math.floor(Math.random() * lowestIDs.length);
    return lowestIDs[r];
}

function constrain(i, newConstraints) {
    let reduced = false;
    if (i >= 0 && i < grid.length && grid[i].length > 1) {
        let oldConstraints = grid[i];
        let res = [];
        for (let j = 0; j < oldConstraints.length; j++) {
            let constraint = oldConstraints[j];
            if (newConstraints.has(constraint)) {
                res.push(constraint);
            }
        }
        if (res.length > 0 && res.length != grid[i].length) {
            if (res.length > 1) {
                reducedSet.add(i);
            }
            else {
                reducedSet.delete(i);
            }
            reduced = true;
            grid[i] = res;
        }
    }
    return reduced;
}

function makeTiles() {
    let tiles = [];
    for (let i = 0; i < noOfColors; i++) {
        for (let j = 0; j < noOfColors; j++) {
            for (let k = 0; k < noOfColors; k++) {
                for (let l = 0; l < noOfColors; l++) {
                    tiles.push([i, j, k, l]);
                }
            }
        }
    }

    getExtra(1, noOfColors);
    getExtra(2, noOfColors);
    getExtra(3, noOfColors);
    getExtra(4, noOfColors);
    getExtra(5, noOfColors);

    return tiles;

    function getExtra(c, distinct) {
        let skipFirst = true;
        for (let i = 0; i < distinct; i++) {
            for (let j = 0; j < distinct; j++) {
                for (let k = 0; k < distinct; k++) {
                    for (let l = 0; l < distinct; l++) {
                        if (!skipFirst) {
                            tiles.push([i + c, j + c, k + c, l + c]);
                        }
                        skipFirst = false;
                    }
                }
            }
        }
        return { c, skipFirst };
    }
}

function generatePossibilities() {
    let possibleForTile = [];
    let directions = [
        [0, 1, 2, 3], // N
        [1, 3, 0, 2], // E
        [2, 3, 0, 1], // S
        [0, 2, 1, 3]  // W
    ]

    for (let i = 0; i < tiles.length; i++) {
        let possibilities = [];
        for (let d = 0; d < directions.length; d++) {
            let possible = [];
            for (let j = 0; j < tiles.length; j++) {
                if (tiles[i][directions[d][0]] == tiles[j][directions[d][2]] && tiles[i][directions[d][1]] == tiles[j][directions[d][3]]) {
                    possible.push(j);
                }
            }
            possibilities.push(possible);
        }
        possibleForTile.push(possibilities);
    }

    return possibleForTile;
}

function drawPossibilities(ctx, tiles) {
    for (let i = 0; i < tiles.length; i++) {
        drawTile(ctx, 0, i * 30, i)
        let jump = 0;
        for (let j = 0; j < possibilities[i].length; j++) {
            jump += 20;
            for (let k = 0; k < possibilities[i][j].length; k++) {
                drawTile(ctx, j * 320 + k * 20 + 20 + jump, i * 30, possibilities[i][j][k])
            }
        }
    }
}

function drawGrid(ctx, grid) {
    for (let i = 0; i < grid.length; i++) {
        let coords = indexToCoord(i);
        drawTile(ctx, coords[0] * 20, coords[1] * 20, grid[i][0], labels, i)
    }
}

function drawTile(ctx, x, y, tileIndex, showLabels, i) {
    for (let j = 0; j < 4; j++) {
        let offset_x = (j % 2) * tSize;
        let offset_y = Math.floor(j / 2) * tSize;
        ctx.lineWidth = 2;
        let tileColor = grid[i].length == 1 ? tiles[tileIndex][j] : 0;
        ctx.fillStyle = colors[tileColor];
        ctx.fillRect(x + offset_x, y + offset_y, tSize, tSize);
    }
    if (showLabels) {
        ctx.font = "12px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(grid[i].length, x + 10, y + 14);
    }
}

function indexToCoord(i) {
    let x = i % gridSize;
    let y = Math.floor(i / gridSize);
    return [x, y];
}

function coordToIndex(coord) {
    let i = coord[0] + coord[1] * gridSize;
    return i;
}