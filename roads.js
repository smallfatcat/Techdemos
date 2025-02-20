let loopCount = 500;
let tilectx = undefined;
let gridctx = undefined;
let tileCanvas = undefined;
let gridCanvas = undefined;
let paused = false;

let baseTiles = [];
let gridTiles = [];

let config = {};
config.width = 200;
config.height = 200;
config.uniqueEdges = 2;
config.tileSize = 20;
config.numberOfTiles = config.uniqueEdges ** 4;
// config.numberOfTiles = 13;
config.gridWidth = 50;
config.gridSize = config.gridWidth * config.gridWidth;
// config.gridWidth = Math.sqrt(config.gridSize);


const EDGE_N = 0;
const EDGE_E = 1;
const EDGE_S = 2;
const EDGE_W = 3;

const roadColor = [
    "blue",
    "white",
    "red",
    "white",
    "grey",
];

class GridTile {
    constructor(parameters) {
        this.x = parameters.x ? parameters.x : 0;
        this.y = parameters.y ? parameters.y : 0;
        this.candidates = parameters.candidates ? parameters.candidates : [];
        this.neighbours = parameters.neighbours ? parameters.neighbours : [];
        this.id = parameters.id ? parameters.id : 0;
    }

    getEntropy() {
        return this.candidates.length;
    }

    getbaseID() {
        let baseID;
        for (let candidate of this.candidates) {
            baseID = candidate;
            break;
        }
        return baseID;
    }
}

class BaseTile {
    constructor(parameters) {
        this.edges = parameters.edges ? parameters.edges : [];
        this.size = parameters.size ? parameters.size : 20;
        this.color = parameters.color ? parameters.color : "green";
        this.possible = parameters.possible ? parameters.possible : [[], [], [], []];
        this.id = parameters.id ? parameters.id : 0;
        // this.image = parameters.image ? parameters.image : "blank"
    }

    draw(ctx, x, y) {
        const image = document.getElementById("tile" + (this.id));
        ctx.drawImage(image, x, y, 20, 20)
        // ctx.lineWidth = 2;
        // ctx.fillStyle = this.color;
        // ctx.fillRect(x, y, this.size, this.size);
        // let edgeOffset = this.size / 2;
        // if (this.edges[EDGE_N]) {
        //     ctx.strokeStyle = roadColor[this.edges[EDGE_N]];
        //     ctx.beginPath();
        //     ctx.moveTo(x + edgeOffset, y);
        //     ctx.lineTo(x + edgeOffset, y + edgeOffset);
        //     ctx.stroke();
        // }
        // if (this.edges[EDGE_E]) {
        //     ctx.strokeStyle = roadColor[this.edges[EDGE_E]];
        //     ctx.beginPath();
        //     ctx.moveTo(x + this.size, y + edgeOffset);
        //     ctx.lineTo(x + edgeOffset, y + edgeOffset);
        //     ctx.stroke();
        // }
        // if (this.edges[EDGE_S]) {
        //     ctx.strokeStyle = roadColor[this.edges[EDGE_S]];
        //     ctx.beginPath();
        //     ctx.moveTo(x + edgeOffset, y + this.size);
        //     ctx.lineTo(x + edgeOffset, y + edgeOffset);
        //     ctx.stroke();
        // }
        // if (this.edges[EDGE_W]) {
        //     ctx.strokeStyle = roadColor[this.edges[EDGE_W]];
        //     ctx.beginPath();
        //     ctx.moveTo(x, y + edgeOffset);
        //     ctx.lineTo(x + edgeOffset, y + edgeOffset);
        //     ctx.stroke();
        // }
    }

    generatePossibles(tiles) {
        tiles.forEach(candidate => {
            if (this.edges[EDGE_N] == candidate.edges[EDGE_S]) {
                this.possible[EDGE_N].push(candidate.id);
            }
            if (this.edges[EDGE_E] == candidate.edges[EDGE_W]) {
                this.possible[EDGE_E].push(candidate.id);
            }
            if (this.edges[EDGE_S] == candidate.edges[EDGE_N]) {
                this.possible[EDGE_S].push(candidate.id);
            }
            if (this.edges[EDGE_W] == candidate.edges[EDGE_E]) {
                this.possible[EDGE_W].push(candidate.id);
            }
        });
    }
}

window.onload = (event) => {
    tileCanvas = document.getElementById("tileCanvas");
    tilectx = tileCanvas.getContext("2d");
    tileCanvas.width = config.width;
    tileCanvas.height = config.height;

    gridCanvas = document.getElementById("gridCanvas");
    gridctx = gridCanvas.getContext("2d");
    gridCanvas.width = config.gridWidth * config.tileSize;
    gridCanvas.height = config.gridWidth * config.tileSize;

    // baseTiles = initBaseTiles(config.numberOfTiles);
    baseTiles = testInit();
    gridTiles = initGridTiles(config.gridSize);
    animate();

}

function initButton() {
    gridTiles = initGridTiles(config.gridSize);
    animate();
}

function changeValue(newVal) {
    document.getElementById("speedDisplay").innerText = Math.floor(2 ** (newVal / 100));
}
function pauseButton(newVal) {
    paused = !paused;
    if(paused){
        document.getElementById("pause").textContent = "Play";
    }
    else{
        document.getElementById("pause").textContent = "Pause";
    }
}


function animate(t) {
    let finished = false;
    loopCount = Math.floor(2 ** (document.getElementById("speed").value / 100));
    // document.getElementById("speedDisplay").innerText = loopCount;
    for (i = 0; i < loopCount && !paused; i++) {
        finished = !wfc();
        if (finished) {
            break;
        }
    }
    if (!finished) {
        requestAnimationFrame(animate);
    }
    else {
        console.log(t, "finished")
    }
    drawBaseTiles(tilectx, baseTiles);
    drawGridTiles(gridctx, gridTiles, baseTiles);
}

function drawBaseTiles(ctx, tiles) {
    let i = 0;
    let sideLength = Math.sqrt(config.numberOfTiles);
    for (let tile of tiles) {
        let x = (i % sideLength) * config.tileSize;
        let y = Math.floor(i / sideLength) * config.tileSize;
        tile.draw(ctx, x, y);
        i++;
    }
}

function drawGridTiles(ctx, gridTiles, baseTiles) {
    for (let tile of gridTiles) {
        let x = tile.x * config.tileSize;
        let y = tile.y * config.tileSize;
        baseTiles[tile.getbaseID()].draw(ctx, x, y);
    }
}

function initBaseTiles(numberOfTiles) {
    let edges = generateEdges(config.uniqueEdges);
    let tiles = [];
    for (let id = 0; id < edges.length; id++) {
        let tile = generateBaseTile(edges, id);
        tiles.push(tile);
    }
    // tiles = generatePossibles(tiles);
    for (let tile of tiles) {
        tile.generatePossibles(tiles);
    }
    return tiles;
}

function initGridTiles() {
    let grid = [];
    let neighbours = generateNeighbours(config.gridSize, config.gridWidth);
    let id = 0;
    for (let j = 0; j < config.gridWidth; j++) {
        for (let i = 0; i < config.gridWidth; i++) {
            let candidates = generateCandidates(baseTiles.length);
            let tile = generateGridTile(i, j, neighbours[id], candidates, id++);
            grid.push(tile);
        }
    }
    return grid;
}

function generateCandidates(numberOfCandidates) {
    let candidates = [];
    for (let i = 0; i < numberOfCandidates; i++) {
        candidates.push(i);
    }
    return candidates;
}

function generateNeighbours(gridSize, gridWidth) {
    let neighbours = [];
    for (let id = 0; id < gridSize; id++) {
        let neighbour = [0, 0, 0, 0];
        neighbour[EDGE_N] = (id - gridWidth >= 0) ? id - gridWidth : undefined;
        neighbour[EDGE_E] = (id + 1 < gridWidth * gridWidth) ? id + 1 : undefined;
        neighbour[EDGE_S] = (id + gridWidth < gridWidth * gridWidth) ? id + gridWidth : undefined;
        neighbour[EDGE_W] = (id - 1 >= 0) ? id - 1 : undefined;
        neighbours.push(neighbour);
    }
    return neighbours;
}

function testInit() {
    let tiles = [];
    let edges = [
        [0, 0, 0, 0], // 0
        [1, 1, 0, 0], // 1
        [0, 0, 1, 1], // 2
        [1, 0, 0, 1], // 3
        [1, 1, 1, 1], // 4
        [1, 0, 1, 0], // 5
        [0, 1, 1, 0], // 6
        [0, 1, 1, 1], // 7
        [1, 1, 1, 0], // 8
        [1, 0, 1, 1], // 9
        [1, 1, 0, 1], // 10
        [0, 1, 0, 1], // 11
        [0, 0, 0, 0], // 12
        [0, 0, 0, 0], // 13
        [0, 0, 0, 0], // 14
        [0, 0, 0, 0], // 15
        [0, 0, 0, 0], // 16
        // [0,2,0,0], // 17
        // [0,0,0,2], // 18
        // [2,0,0,0], // 19
        // [0,0,2,0], // 20
    ];
    for (let id = 0; id < edges.length; id++) {
        tiles.push(generateBaseTile(edges, id));
    }
    for (let tile of tiles) {
        tile.generatePossibles(tiles);
    }
    return tiles;
}

function generateBaseTile(edges, id) {
    return new BaseTile({
        edges: edges[id],
        size: config.tileSize,
        color: "green",
        id: id,
    });
}

function generateGridTile(x, y, neighbours, candidates, id) {
    return new GridTile({
        x: x,
        y: y,
        id: id,
        neighbours: neighbours,
        candidates: candidates,
    });
}

function generateEdges(uniqueEdges) {
    let edges = [];
    for (let w = 0; w < uniqueEdges; w++) {
        for (let s = 0; s < uniqueEdges; s++) {
            for (let e = 0; e < uniqueEdges; e++) {
                for (let n = 0; n < uniqueEdges; n++) {
                    if ((n + e + s + w) == 2 || (n + e + s + w) == 0) {
                        edges.push([n, e, s, w]);
                    }
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
    gridTiles.forEach(tile => {
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
    // console.log(lowestTiles[r], lowestTiles.length, lowest);
    return lowestTiles.length > 0 ? lowestTiles[r] : -1;
}

function collapse(tile) {
    // console.log("collapse")
    let r = Math.floor(Math.random() * tile.candidates.length)
    let candidate = tile.candidates[r];
    tile.candidates = [candidate];
}

function constrain(tile, possiblesSet) {
    let res = [];
    tile.candidates.forEach((candidate) => {
        if (possiblesSet.has(candidate)) {
            res.push(candidate);
        }
    });
    if (res.length != tile.candidates.length && res.length > 0) {
        tile.candidates = res;
        return true;
    }
    return false;
}

function wfc() {
    let stack = [];
    let lowestEntropy = getLowestEntropy();
    if (lowestEntropy == -1) {
        return false;
    }
    collapse(gridTiles[lowestEntropy]);
    stack.push(gridTiles[lowestEntropy]);

    while (stack.length > 0) {
        let tile = stack.pop();
        for (let d = 0; d < 4; d++) {
            let possiblesSet = generatePossibleForAllCandidates(tile.candidates, d);
            let neighbourID = tile.neighbours[d];
            if (neighbourID != undefined) {
                let neighbour = gridTiles[neighbourID];
                let reduced = constrain(neighbour, possiblesSet);
                if (reduced) {
                    stack.push(neighbour);
                }
            }
        }
    }
    return true;
}

function generatePossibleForAllCandidates(candidates, direction) {
    let possiblesSet = new Set();
    candidates.forEach((candidate) => {
        let possibles = baseTiles[candidate].possible[direction];
        possibles.forEach((possible) => {
            possiblesSet.add(possible)
        })
    });
    return possiblesSet;
}
