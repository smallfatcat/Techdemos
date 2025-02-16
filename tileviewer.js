let tiles = makeTiles();
let possibilities = generatePossibilities();
const gSize = 500;
const tSize = 10;
const colors = [
    "green",
    "blue",
];

window.onload = (event) => {
    tileCanvas = document.getElementById("tileCanvas");
    tilectx = tileCanvas.getContext("2d");
    tileCanvas.width = gSize * tSize;
    tileCanvas.height = gSize * tSize;

    // initGrid();
    draw(tilectx, tiles);

}

function makeTiles() {
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
    return tiles;
}

function draw(ctx, tiles) {
    for (let i = 0; i < tiles.length; i++) {
        drawTile(ctx, 0, i * 30, i)
        let jump = 0;
        for (let j = 0; j < possibilities[i].length; j++) {
            jump += 20;
            for (let k = 0; k < possibilities[i][j].length; k++) {
                drawTile(ctx, j * 80 + k * 20 + 20 + jump, i * 30, possibilities[i][j][k])
            }
        }
    }
}

function drawTile(ctx, x, y, tileIndex) {
    for (let j = 0; j < 4; j++) {
        let offset_x = (j % 2) * tSize;
        let offset_y = Math.floor(j / 2) * tSize;
        ctx.lineWidth = 2;
        ctx.fillStyle = colors[tiles[tileIndex][j]];
        ctx.fillRect(x + offset_x, y + offset_y, tSize, tSize);
    }
    ctx.font = "12px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(tileIndex, x + 10, y + 14);
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