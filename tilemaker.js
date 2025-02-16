let savedTiles = [];

let tileCanvas = undefined;
let tilectx = undefined;
let tilePixels = [];

let savedCanvas = undefined;
let savedctx = undefined;

let paletteCanvas = undefined;
let palettectx = undefined;
let palettePixels = [];

const gSize = 10;
const tSize = 20;

paletteSelected = 0;


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

window.onload = (event) => {
    tileCanvas = document.getElementById("tileCanvas");
    tilectx = tileCanvas.getContext("2d");
    tileCanvas.width = gSize * tSize;
    tileCanvas.height = gSize * tSize;

    savedCanvas = document.getElementById("savedCanvas");
    savedctx = savedCanvas.getContext("2d");
    savedCanvas.width = gSize * tSize;
    savedCanvas.height = gSize * tSize;

    paletteCanvas = document.getElementById("paletteCanvas");
    palettectx = paletteCanvas.getContext("2d");
    paletteCanvas.width = colors.length * tSize;
    paletteCanvas.height = tSize;

    initGrid();
    draw(tilectx, tilePixels, gSize, gSize);
    draw(palettectx, palettePixels, 10, 1);

    tileCanvas.addEventListener('mousedown', function (event) {
        console.log(event.offsetX, event.offsetY);
        if (event.offsetX < tileCanvas.width && event.offsetY < tileCanvas.height) {
            tilePixels[coordToIndex([Math.floor(event.offsetX / tSize), Math.floor(event.offsetY / tSize)])] = paletteSelected;
            draw(tilectx, tilePixels, gSize);
        }
    });
    paletteCanvas.addEventListener('mousedown', function (event) {
        console.log(event.offsetX, event.offsetY);
        if (event.offsetX < paletteCanvas.width && event.offsetY < paletteCanvas.height) {
            console.log(coordToIndex([Math.floor(event.offsetX / tSize), Math.floor(event.offsetY / tSize)]));
            paletteSelected = coordToIndex([Math.floor(event.offsetX / tSize), Math.floor(event.offsetY / tSize)]);
            // palettePixels[coordToIndex([Math.floor(event.offsetX / tSize), Math.floor(event.offsetY / tSize)])] = 1;
            draw(palettectx, palettePixels, gSize);
        }
    });
}

const transforms = {
    RR: [6, 3, 0, 7, 4, 1, 8, 5, 2],
    RR2: [8, 7, 6, 5, 4, 3, 2, 1, 0],
    RR3: [2, 5, 8, 1, 4, 7, 0, 3, 6],
    FLIPV: [6, 7, 8, 3, 4, 5, 0, 1, 2],
    FLIPH: [2, 1, 0, 5, 4, 3, 8, 7, 6],
    FLIPDR: [0, 3, 6, 1, 4, 7, 2, 5, 8],
    FLIPDL: [8, 5, 2, 7, 4, 1, 6, 3, 0]
}
const transformsArr = [
    [6, 3, 0, 7, 4, 1, 8, 5, 2],
    [8, 7, 6, 5, 4, 3, 2, 1, 0],
    [2, 5, 8, 1, 4, 7, 0, 3, 6],
    [6, 7, 8, 3, 4, 5, 0, 1, 2],
    [2, 1, 0, 5, 4, 3, 8, 7, 6],
    [0, 3, 6, 1, 4, 7, 2, 5, 8],
    [8, 5, 2, 7, 4, 1, 6, 3, 0]
]

function transformBox(transform, box) {
    let res = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let j = 0; j < 9; j++) {
        res[j] = box[transform[j]];
    }
    return res;
}

function generatePossibilities() {
    let tiles = [];

    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            for (let k = 0; k < 2; k++) {
                for (let l = 0; l < 2; l++) {
                    tiles.push([i, j, k, l]);
                }
            }
        }
    }

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

function getDupes(boxes) {
    // let boxes = make9x9();
    let dupes = [];
    let dupeSet = new Set();
    let newBoxes = [];
    for (let i = 0; i < boxes.length; i++) {
        let box = boxes[i];
        let dupe = [];
        for (let j = i + 1; j < boxes.length; j++) {
            let testbox = boxes[j];
            for (let transform of transformsArr) {
                let transformedBox = transformBox(transform, box);
                if (JSON.stringify(testbox) == JSON.stringify(transformedBox)) {
                    if (!dupeSet.has(Number(j)) && !dupeSet.has(Number(i))) {
                        dupe.push([i, j]);
                    }
                    dupeSet.add(j)
                }
            }

        }
        if (dupe.length > 0) {
            dupes.push(dupe);
        }

        // dupeSet.add(dupe[1])
    }
    // for (let i in boxes) {
    //     if (!dupeSet.has(Number(i))) {
    //         newBoxes.push(boxes[i]);
    //     }
    // }
    // return newBoxes;
    return dupes;
}

function make3way() {
    let boxes = [];
    for (let i = 0; i < 3 ** 9; i++) {
        let box = [];
        let baseString = i.toString(3).padStart(9, "0");
        if (baseString[4] == '0') {
            for (let j = 0; j < 9; j++) {
                box.push(baseString[j]);
            }
            boxes.push(box);
        }
    }
    return boxes;
}

function make9x9() {
    let boxes = [];
    for (let i = 0; i < 512; i++) {
        let box = [];
        for (let j = 0; j < 9; j++) {
            box.push((i >> j) & 1);
        }
        boxes.push(box);
    }
    return boxes;
}

function initGrid() {
    for (let i = 0; i < gSize * gSize; i++) {
        tilePixels.push(3);
    }
    for (let i = 0; i < 10; i++) {
        palettePixels.push(i);
    }
}

function saveTile() {
    savedTiles.push(tilePixels.slice());
    draw(savedctx, savedTiles[savedTiles.length - 1], gSize, gSize);
}

function draw(ctx, pixels, width) {
    for (let i in pixels) {
        ctx.lineWidth = 2;
        ctx.fillStyle = colors[pixels[i]];
        let coord = indexToCoord(i, width);
        ctx.fillRect(coord[0] * tSize, coord[1] * tSize, tSize, tSize);
    }

    // ctx.strokeStyle = 'gray';
    // ctx.strokeRect(cell.x, cell.y, cell.width, cell.height);
    // ctx.font = "10px Arial";
    // ctx.fillStyle = "white";
    // ctx.fillText(cell.constraints.length, cell.x + cellWidth / 2, cell.y + cellHeight / 2);
}

function indexToCoord(i, width) {
    let x = i % width;
    let y = Math.floor(i / width);
    return [x, y];
}

function coordToIndex(coord) {
    let i = coord[0] + coord[1] * gSize;
    return i;
}