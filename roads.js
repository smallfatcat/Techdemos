let robots = [];
let loopCount = 500;
let tilectx = undefined;
let gridctx = undefined;
let tileCanvas = undefined;
let gridCanvas = undefined;
let paused = false;

let baseTiles = [];
let gridTiles = [];
let drawRobot = false;

let config = {};
config.width = 400;
config.height = 400;
config.uniqueEdges = 2;
config.tileSize = 64;
// config.numberOfTiles = config.uniqueEdges ** 4;
config.numberOfTiles = 36;
config.gridWidth = 25;
config.gridSize = config.gridWidth * config.gridWidth;
// config.gridWidth = Math.sqrt(config.gridSize);


const EDGE_N = 0;
const EDGE_E = 1;
const EDGE_S = 2;
const EDGE_W = 3;

const roadColor = [
    "red",
    "green",
    "blue",
    // "white",
    // "grey",
];

class Robot {
    constructor(parameters) {
        this.x = parameters.x ? parameters.x : 0;
        this.y = parameters.y ? parameters.y : 0;
        this.nextX = parameters.x ? parameters.x : 0;
        this.nextY = parameters.y ? parameters.y : 0;
        this.nextDistance = 0.0;
        this.offsetX = 0.0;
        this.offsetY = 0.0;
        this.speed = 0.1;
        this.color = parameters.color ? parameters.color : "white";
    }

    getNextPosition(grid) {
        let x = this.x;
        let y = this.y;

        let width = Math.sqrt(grid.length);
        let i = x + y * width;
        let candidate = grid[i].candidates[0];
        let edges = baseTiles[candidate].edges;
        let directions = [];
        for (let id = 0; id < 4; id++) {
            if (edges[id] > 0) {
                directions.push(id);
            }
        }
        let r = Math.floor(Math.random() * directions.length);
        let newDirection = directions[r];
        if (directions.length == 0) {
            return;
        }
        while (grid[i].neighbours[newDirection] == undefined) {
            r = (r + 1) % directions.length;
            newDirection = directions[r];
        }
        let nextID = grid[i].neighbours[newDirection];
        // console.log(grid[nextID].x, grid[nextID].y);
        this.nextX = grid[nextID].x;
        this.nextY = grid[nextID].y;
    }

    move(grid) {
        this.nextDistance += this.speed;
        this.offsetX = this.x + ((this.nextX - this.x) * this.nextDistance);
        this.offsetY = this.y + ((this.nextY - this.y) * this.nextDistance);
        if (this.nextDistance > 1) {
            this.x = this.nextX;
            this.y = this.nextY;
            this.offsetX = this.nextX;
            this.offsetY = this.nextY;
            this.nextDistance = 0.0;
            this.getNextPosition(grid);
        }
    }

    draw(ctx, x, y) {
        ctx.lineWidth = 2;
        ctx.fillStyle = this.color;
        // ctx.globalAlpha = 0.1;
        ctx.fillRect(x, y, config.tileSize/4 -10, config.tileSize/4 -10);
        ctx.globalAlpha = 1.0;
        // console.log(x, y)
    }
}


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
        const image = document.getElementById("tile" + (this.id + 1));
        ctx.drawImage(image, x, y, config.tileSize, config.tileSize)
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
    initRobot();
    animate();
}

function initRobot() {
    drawRobot = false;
    robots = [];
    for (let i = 0; i < 3; i++) {
        let robot = new Robot({ x: Math.floor(config.gridWidth / 2), y: Math.floor(config.gridWidth / 2), color: roadColor[i] });
        robots.push(robot);
    }
}

function testInit() {
    let tiles = [];
    let edges = [
        [0, 0, 0, 0], // 1
        [1, 1, 0, 0], // 2
        [0, 1, 1, 0], // 3
        [0, 0, 1, 1], // 4
        [1, 0, 1, 0], // 5
        [0, 0, 0, 0], // 6
        [1, 1, 0, 1], // 7
        [1, 0, 1, 1], // 8
        [1, 1, 1, 0], // 9
        [0, 1, 0, 1], // 10
        [0, 1, 1, 1], // 11
        [1, 0, 0, 1], // 12
        [1, 1, 1, 1], // 13
        [0, 1, 0, 1], // 14
        [1, 0, 1, 0], // 15
        [0, 0, 0, 1], // 16
        [2, 3, 2, 0], // 17
        [2, 2, 0, 0], // 18
        [3, 2, 0, 2], // 19
        [4, 0, 0, 4], // 20
        [0, 0, 4, 4], // 21
        [0, 4, 2, 0], // 22
        [4, 0, 4, 3], // 23
        [0, 4, 3, 4], // 24
        [4, 4, 3, 3], // 25
        [2, 3, 3, 4], // 26
        [3, 2, 4, 3], // 27
        [3, 3, 2, 2], // 28
        [3, 3, 3, 3], // 29
        [1, 0, 0, 0], // 30
        [0, 1, 0, 0], // 31
        [0, 0, 1, 0], // 32
        // [0, 0, 0, 0], // 12
        // [0, 0, 0, 0], // 13
        // [0, 0, 0, 0], // 14
        // [0, 0, 0, 0], // 15
        // [0, 0, 0, 0], // 16
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
    initRobot();
    return tiles;
}

function changeValue(newVal) {
    document.getElementById("speedDisplay").innerText = Math.floor(2 ** (newVal / 100));
}
function pauseButton(newVal) {
    paused = !paused;
    if (paused) {
        document.getElementById("pause").textContent = "Play";
    }
    else {
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
        console.log(t, "finished");
        drawRobot = true;
        animateRobot();
    }
    drawBaseTiles(tilectx, baseTiles);
    drawGridTiles(gridctx, gridTiles, baseTiles);
}

function animateRobot() {
    if (drawRobot) {
        // robot.getNextPosition(gridTiles);
        // console.log(robot.x, robot.y)
        // drawGridTiles(gridctx, gridTiles, baseTiles);
        for (let robot of robots) {
            robot.move(gridTiles);
            let x = robot.offsetX * config.tileSize + (config.tileSize / 2);
            let y = robot.offsetY * config.tileSize + (config.tileSize / 2);
            if(x > config.gridWidth * config.tileSize){
                x -= config.gridWidth * config.tileSize;
            }
            if(x < 0){
                x += config.gridWidth * config.tileSize;
            }
            robot.draw(gridctx, x, y);
        }
        requestAnimationFrame(animateRobot);
    }
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

// function getNextPosition(tile, grid) {
//     let x = tile.x;
//     let y = tile.y;

//     let width = Math.sqrt(grid.length);
//     let i = x + y * width;
//     let candidate = grid[i].candidates[0];
//     let edges = baseTiles[candidate].edges;
//     let directions = [];
//     for (let id = 0; id < 4; id++) {
//         if (edges[id] > 0) {
//             directions.push(id);
//         }
//     }
//     let r = Math.floor(Math.random() * directions.length);
//     let newDirection = directions[r];
//     let nextID = grid[i].neighbours[newDirection];
//     console.log(grid[nextID].x, grid[nextID].y);
//     return grid[nextID];
// }
