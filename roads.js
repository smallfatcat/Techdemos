let baseTiles = [];

let config = {};
config.width = 1000;
config.height = 1000;
config.uniqueEdges = 3;
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

class GridTile {
    constructor(parameters) {
        this.x = parameters.x ? parameters.x : 0;
        this.y = parameters.y ? parameters.y : 0;
        this.candidates = parameters.candidates ? parameters.candidates : [];
        this.neighbours = parameters.neighbours ? parameters.neighbours : [];
        this.id = parameters.id ? parameters.id : 0;
    }
}

class BaseTile {
    constructor(parameters) {
        this.edges = parameters.edges ? parameters.edges : [];
        this.size = parameters.size ? parameters.size : 20;
        this.color = parameters.color ? parameters.color : "green";
        this.possible = parameters.possible ? parameters.possible : [[], [], [], []];
        this.id = parameters.id ? parameters.id : 0;
    }

    draw(ctx, x, y) {
        ctx.lineWidth = 2;
        ctx.fillStyle = this.color;
        ctx.fillRect(x, y, this.size, this.size);
        let edgeOffset = this.size / 2;
        if (this.edges[EDGE_N]) {
            ctx.strokeStyle = roadColor[this.edges[EDGE_N]];
            ctx.beginPath();
            ctx.moveTo(x + edgeOffset, y);
            ctx.lineTo(x + edgeOffset, y + edgeOffset);
            ctx.stroke();
        }
        if (this.edges[EDGE_E]) {
            ctx.strokeStyle = roadColor[this.edges[EDGE_E]];
            ctx.beginPath();
            ctx.moveTo(x + this.size, y + edgeOffset);
            ctx.lineTo(x + edgeOffset, y + edgeOffset);
            ctx.stroke();
        }
        if (this.edges[EDGE_S]) {
            ctx.strokeStyle = roadColor[this.edges[EDGE_S]];
            ctx.beginPath();
            ctx.moveTo(x + edgeOffset, y + this.size);
            ctx.lineTo(x + edgeOffset, y + edgeOffset);
            ctx.stroke();
        }
        if (this.edges[EDGE_W]) {
            ctx.strokeStyle = roadColor[this.edges[EDGE_W]];
            ctx.beginPath();
            ctx.moveTo(x, y + edgeOffset);
            ctx.lineTo(x + edgeOffset, y + edgeOffset);
            ctx.stroke();
        }
    }

    getEntropy() {
        return this.candidates.length;
    }
}

window.onload = (event) => {
    tileCanvas = document.getElementById("tileCanvas");
    tilectx = tileCanvas.getContext("2d");
    tileCanvas.width = config.width;
    tileCanvas.height = config.height;

    baseTiles = initTiles(config.numberOfTiles);
    drawTiles(tilectx, baseTiles);
}

function drawTiles(ctx, tiles) {
    let i = 0;
    let sideLength = Math.sqrt(config.numberOfTiles);
    for (let tile of tiles) {
        let x = (i % sideLength) * config.tileSize;
        let y = Math.floor(i / sideLength) * config.tileSize;
        tile.draw(ctx, x, y);
        i++;
    }
}

function initTiles(numberOfTiles) {
    let edges = generateEdges(config.uniqueEdges);
    let tiles = [];
    let sideLength = Math.sqrt(numberOfTiles);
    let id = 0;
    // let neighbours = generateNeighbours(numberOfTiles, sideLength);
    // let candidates = generateCandidates(numberOfTiles);
    for (let j = 0; j < sideLength; j++) {
        for (let i = 0; i < sideLength; i++) {
            let tile = generateTile(edges, id++);
            tiles.push(tile);
        }
    }
    tiles = generatePossibles(tiles);
    return tiles;
}

function generateCandidates(numberOfTiles) {
    let candidates = [];
    for (let i = 0; i < numberOfTiles; i++) {
        candidates.push(i);
    }
    return candidates;
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

function generateTile(edges, id) {
    return new BaseTile({
        // x: i * config.tileSize,
        // y: j * config.tileSize,
        // rot: 0,
        edges: edges[id],
        // pixels: [],
        size: config.tileSize,
        color: "green",
        id: id,
        // neighbours: neighbours,
        // candidates: candidates,
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

function generatePossibles(tiles) {
    tiles.forEach(tile => {
        tiles.forEach(candidate => {
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
    return tiles;
}

function getLowestEntropy() {
    let lowestTiles = [];
    let lowest = Infinity;
    baseTiles.forEach(tile => {
        let entropy = tile.getEntropy();
        if (entropy > 1) {
            if (entropy < lowest) {
                lowest = entropy;
                lowestTiles = [];
            }
            if (entropy == lowest) {
                lowestTiles.push(tile.id);
            }
        }
    });
    let r = Math.floor(Math.random() * lowestTiles.length);
    return lowestTiles.length > 0 ? lowestTiles[r] : -1;
}

function collapse(tile) {
    let r = Math.floor(Math.random() * tile.candidates.length);
    let candidate = tile.candidates[r];
    tile.candidates = [candidate]
}

function constrain(tile, possible) {
    let res = [];
    tile.candidates.forEach((candidate) => {
        if (possible.includes(candidate)) {
            res.push(candidate);
        }
    });
    if (res.length == tile.candidates.length || res.length == 0) {
        return false;
    }
    tile.candidates = res;
    return true;
}

function wfc() {
    let stack = [];
    let lowestEntropy = getLowestEntropy();
    if (lowestEntropy == -1) {
        return false;
    }
    collapse(baseTiles[lowestEntropy]);
    stack.push(baseTiles[lowestEntropy]);

    while (stack.length > 0) {
        let tile = stack.pop();
        let neighbourID = tile.neighbours[EDGE_N];
        if (neighbourID != undefined) {
            let neighbour = baseTiles[neighbourID];
            let reduced = constrain(neighbour, tile.possible[EDGE_N]);
            if (reduced) {
                stack.push(neighbour);
            }
        }
    }
    return true;
}

function animate(t) {
    console.log(t);
    if (wfc()) {
        requestAnimationFrame(animate);
    }
    else {
        console.log(t, "finished")
    }
}