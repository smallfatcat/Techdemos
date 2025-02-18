let gTiles = [];

let config = {};
config.width = 1000;
config.height = 1000;
config.uniqueEdges = 2;
config.tileSize = 20;
config.numberOfTiles = config.uniqueEdges ** 4;


const EDGE_N = 0;
const EDGE_E = 1;
const EDGE_S = 2;
const EDGE_W = 3;

const roadColor = [
    "green",
    "white",
    "grey",
    "black",
    "red",
];

class Tile {
    constructor(parameters) {
        this.x = parameters.x ? parameters.x : 0;
        this.y = parameters.y ? parameters.y : 0;
        this.rot = parameters.rot ? parameters.rot : 0;
        this.edges = parameters.edges ? parameters.edges : [];
        this.pixels = parameters.pixels ? parameters.pixels : [];
        this.size = parameters.size ? parameters.size : 20;
        this.color = parameters.color ? parameters.color : "green";
        this.possible = parameters.possible ? parameters.possible : [[], [], [], []];
        this.id = parameters.id ? parameters.id : 0;
        this.neighbours = parameters.neighbours ? parameters.neighbours : [];
    }

    draw(ctx) {
        ctx.lineWidth = 2;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        let edgeOffset = this.size / 2;
        if (this.edges[EDGE_N]) {
            ctx.strokeStyle = roadColor[this.edges[EDGE_N]];
            ctx.beginPath();
            ctx.moveTo(this.x + edgeOffset, this.y);
            ctx.lineTo(this.x + edgeOffset, this.y + edgeOffset);
            ctx.stroke();
        }
        if (this.edges[EDGE_E]) {
            ctx.strokeStyle = roadColor[this.edges[EDGE_E]];
            ctx.beginPath();
            ctx.moveTo(this.x + this.size, this.y + edgeOffset);
            ctx.lineTo(this.x + edgeOffset, this.y + edgeOffset);
            ctx.stroke();
        }
        if (this.edges[EDGE_S]) {
            ctx.strokeStyle = roadColor[this.edges[EDGE_S]];
            ctx.beginPath();
            ctx.moveTo(this.x + edgeOffset, this.y + this.size);
            ctx.lineTo(this.x + edgeOffset, this.y + edgeOffset);
            ctx.stroke();
        }
        if (this.edges[EDGE_W]) {
            ctx.strokeStyle = roadColor[this.edges[EDGE_W]];
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + edgeOffset);
            ctx.lineTo(this.x + edgeOffset, this.y + edgeOffset);
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
    let sideLength = Math.sqrt(numberOfTiles);
    let id = 0;
    let neighbours = generateNeighbours(numberOfTiles, sideLength);
    for (let j = 0; j < sideLength; j++) {
        for (let i = 0; i < sideLength; i++) {
            let tile = generateTile(i, j, edges, sideLength, neighbours[id], id++);
            tiles.push(tile);
        }
    }
    return tiles;
}

function generateNeighbours(numberOfTiles, sideLength) {
    let neighbours = [];
    for (let id = 0; id < numberOfTiles; id++) {
        let neighbour = [0, 0, 0, 0];
        neighbour[EDGE_N] = (id - sideLength >= 0) ? id - sideLength : undefined;
        neighbour[EDGE_E] = (id + 1 < sideLength * sideLength) ? id + 1 : undefined;
        neighbour[EDGE_S] = (id + sideLength < sideLength * sideLength) ? id + sideLength : undefined;
        neighbour[EDGE_W] = (id - 1 >= 0) ? id - 1 : undefined;
        neighbours.push(neighbour);
    }
    return neighbours;
}

function generateTile(i, j, edges, sideLength, neighbours, id) {
    return new Tile({
        x: i * config.tileSize,
        y: j * config.tileSize,
        rot: 0,
        edges: edges[i + j * sideLength],
        pixels: [],
        size: config.tileSize,
        color: "green",
        id: id,
        neighbours: neighbours,
    });
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

function generatePossibles(gTiles) {
    gTiles.forEach(tile => {
        gTiles.forEach(candidate => {
            if (tile.edges[EDGE_N] == candidate.edges[EDGE_S]) {
                tile.possible[EDGE_N].push(candidate.id);
            }
            if (tile.edges[EDGE_E] == candidate.edges[EDGE_W]) {
                tile.possible[EDGE_E].push(candidate.id);
            }
            if (tile.edges[EDGE_S] == candidate.edges[EDGE_N]) {
                tile.possible[EDGE_S].push(candidate.id);
            }
            if (tile.edges[EDGE_W] == candidate.edges[EDGE_E]) {
                tile.possible[EDGE_W].push(candidate.id);
            }
        });
    });
}

function getLowestEntropy() {

}

function wfc() {
    let stack = [];
    let lowestEntropy = getLowestEntropy();
    stack.push(gTiles[lowestEntropy]);

    while (stack.length > 0) {
        let tile = stack.pop();

    }

}