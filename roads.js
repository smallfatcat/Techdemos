let gTiles = [];

let config = {};
config.width = 1000;
config.height = 1000;
config.uniqueEdges = 5;
config.tileSize = 20;
config.numberOfTiles = config.uniqueEdges ** 4;


const roadColor = [
    "green",
    "white",
    "grey",
    "black",
    "red",
];

class Tile {
    constructor(x, y, rot, edges, pixels, size, color) {
        this.x = x;
        this.y = y;
        this.rot = rot;
        this.edges = edges;
        this.pixels = pixels;
        this.size = size;
        this.color = color;
    }

    draw(ctx) {
        ctx.lineWidth = 2;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        let temp = this.size / 2;
        if (this.edges[0]) {
            ctx.strokeStyle = roadColor[this.edges[0]];
            ctx.beginPath();
            ctx.moveTo(this.x + temp, this.y);
            ctx.lineTo(this.x + temp, this.y + temp);
            ctx.stroke();
        }
        if (this.edges[1]) {
            ctx.strokeStyle = roadColor[this.edges[1]];
            ctx.beginPath();
            ctx.moveTo(this.x + this.size, this.y + temp);
            ctx.lineTo(this.x + temp, this.y + temp);
            ctx.stroke();
        }
        if (this.edges[2]) {
            ctx.strokeStyle = roadColor[this.edges[2]];
            ctx.beginPath();
            ctx.moveTo(this.x + temp, this.y + this.size);
            ctx.lineTo(this.x + temp, this.y + temp);
            ctx.stroke();
        }
        if (this.edges[3]) {
            ctx.strokeStyle = roadColor[this.edges[3]];
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + temp);
            ctx.lineTo(this.x + temp, this.y + temp);
            ctx.stroke();
        }
    }
}

window.onload = (event) => {
    tileCanvas = document.getElementById("tileCanvas");
    tilectx = tileCanvas.getContext("2d");
    tileCanvas.width = config.width;
    tileCanvas.height = config.height;

    gTiles = initTiles(config.numberOfTiles);
    drawTiles(tilectx, gTiles);
}

function drawTiles(ctx, tiles) {
    for (let tile of tiles) {
        tile.draw(ctx);
    }
}

function initTiles(numberOfTiles) {
    let edges = generateEdges(config.uniqueEdges);
    let tiles = [];
    let sideLength = Math.sqrt(numberOfTiles)
    for (let j = 0; j < sideLength; j++) {
        for (let i = 0; i < sideLength; i++) {
            let tile = new Tile(i * config.tileSize, j * config.tileSize, 0, edges[i + j * sideLength], [], config.tileSize, "green");
            tiles.push(tile);
        }
    }
    return tiles;
}

function generateEdges(uniqueEdges) {
    let edges = [];
    for (let w = 0; w < uniqueEdges; w++) {
        for (let s = 0; s < uniqueEdges; s++) {
            for (let e = 0; e < uniqueEdges; e++) {
                for (let n = 0; n < uniqueEdges; n++) {
                    edges.push([n, e, s, w]);
                }
            }
        }
    }
    return edges;
}