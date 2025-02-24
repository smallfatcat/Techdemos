let robots = [];
let loopCount = 500;
let tilectx = undefined;
let gridctx = undefined;
let bufferctx = undefined;
let tileCanvas = undefined;
let gridCanvas = undefined;
let bufferCanvas = undefined;


let paused = false;

let gBaseTiles = [];
let gGridTiles = [];
let drawRobot = false;

let config = {};
config.numberOfTiles = 50;
config.tileSize = 64;
config.width = Math.ceil(Math.sqrt(config.numberOfTiles)) * config.tileSize;
config.height = Math.ceil(Math.sqrt(config.numberOfTiles)) * config.tileSize;
config.uniqueEdges = 5;
// config.numberOfTiles = config.uniqueEdges ** 4;
config.gridWidth = 25;
config.gridSize = config.gridWidth * config.gridWidth;
// config.gridWidth = Math.sqrt(config.gridSize);

let sx = 0;
let sy = 0;
let ox = config.gridWidth * config.tileSize / 2;
let oy = config.gridWidth * config.tileSize / 2;
let scrollSpeed = 2;
let zoom = 1.0;

const EDGE_N = 0;
const EDGE_E = 1;
const EDGE_S = 2;
const EDGE_W = 3;

const roadColor = [
    "blue",
    "red",
    "purple",
];

let key_up = false;
let key_down = false;
let key_left = false;
let key_right = false;
let key_zoom_in = false;
let key_zoom_out = false;

window.onload = (event) => {
    tileCanvas = document.getElementById("tileCanvas");
    tilectx = tileCanvas.getContext("2d");
    tileCanvas.width = config.width;
    tileCanvas.height = config.height;

    bufferCanvas = document.createElement("canvas");
    bufferctx = bufferCanvas.getContext("2d");
    bufferCanvas.width = config.gridWidth * config.tileSize;
    bufferCanvas.height = config.gridWidth * config.tileSize;

    gridCanvas = document.getElementById("gridCanvas");
    gridctx = gridCanvas.getContext("2d");
    gridCanvas.width = config.gridWidth * config.tileSize;
    gridCanvas.height = config.gridWidth * config.tileSize;

    document.addEventListener('keydown', function (event) {
        const keyString = event.key.toLowerCase();
        if (keyString == 'a') {
            key_left = true;
        }
        if (keyString == 'd') {
            key_right = true;
        }
        if (keyString == 'w') {
            key_up = true;
        }
        if (keyString == 's') {
            key_down = true;
        }
        if (keyString == 'q') {
            key_zoom_in = true;
        }
        if (keyString == 'e') {
            key_zoom_out = true;
        }
    });
    
    document.addEventListener('keyup', function (event) {
        const keyString = event.key.toLowerCase();
        if (keyString == 'a') {
            key_left = false;
        }
        if (keyString == 'd') {
            key_right = false;
        }
        if (keyString == 'w') {
            key_up = false;
        }
        if (keyString == 's') {
            key_down = false;
        }
        if (keyString == 'q') {
            key_zoom_in = false;
        }
        if (keyString == 'e') {
            key_zoom_out = false;
        }
    });

    gBaseTiles = initBaseTiles();
    gGridTiles = initGridTiles(config.gridSize);
    createBorder();
    animateGenerationPhase();
}

function initBaseTiles() {
    let tiles = [];
    for (let id = 0; id < tileData.length; id++) {
        tiles.push(generateBaseTile(tileData, id));
    }
    for (let tile of tiles) {
        tile.generatePossibles(tiles);
    }
    initRobot();
    return tiles;
}

function initGridTiles() {
    let grid = [];
    let neighbours = generateNeighbours(config.gridSize, config.gridWidth);
    let id = 0;
    for (let j = 0; j < config.gridWidth; j++) {
        for (let i = 0; i < config.gridWidth; i++) {
            let candidates = generateCandidates(gBaseTiles.length);
            let tile = generateGridTile(i, j, neighbours[id], candidates, id++);
            grid.push(tile);
        }
    }
    return grid;
}

function initButton() {
    gGridTiles = initGridTiles(config.gridSize);
    createBorder();
    initRobot();
    animateGenerationPhase();
}

function initRobot() {
    drawRobot = false;
    robots = [];
    for (let i = 0; i < 100; i++) {
        spawnRobot(Math.floor(config.gridWidth / 2), Math.floor(config.gridWidth / 2), roadColor[i % 3]);
    }
}

function spawnRobot(x, y, color) {
    let robot = new Bot({ x: x, y: y, color: color });
    robots.push(robot);
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

function scroll() {
    if (key_up) {
        oy -= scrollSpeed;
    }
    if (key_down) {
        oy += scrollSpeed;
    }
    if (key_left) {
        ox -= scrollSpeed;
    }
    if (key_right) {
        ox += scrollSpeed;
    }
    if (key_zoom_in) {
        zoom -= 0.001;
    }
    if (key_zoom_out) {
        zoom += 0.001;
    }
}

function animateGenerationPhase(t) {
    let finished = false;
    loopCount = Math.floor(2 ** (document.getElementById("speed").value / 100));
    for (i = 0; i < loopCount && !paused; i++) {
        finished = !wfc();
        if (finished) {
            break;
        }
    }
    if (!finished) {
        requestAnimationFrame(animateGenerationPhase);
    }
    else {
        console.log(t, "finished");
        generateNeighbourTypes(gGridTiles);
        drawRobot = true;
        animateRobot();
    }
    drawBaseTiles(tilectx, gBaseTiles);
    drawGridTiles(bufferctx, gGridTiles, gBaseTiles);
    gridctx.drawImage(bufferCanvas, 0, 0);
}

function generateNeighbourTypes(grid) {
    for (let gridTile of grid) {
        gridTile.setNeighbourTypes(grid);
        gridTile.setEdges(gBaseTiles);
    }
}

function animateRobot() {
    scroll();
    if (drawRobot) {
        let canvasX = config.gridWidth * config.tileSize;
        let portalX = canvasX * zoom;
        let sx = ox - (portalX / 2);
        let sy = oy - (portalX / 2);
        gridctx.drawImage(bufferCanvas, sx, sy, portalX, portalX, 0, 0, canvasX, canvasX);
        for (let robot of robots) {
            robot.move(gGridTiles);
            let x = robot.offsetX * config.tileSize + (config.tileSize / 2);
            let y = robot.offsetY * config.tileSize + (config.tileSize / 2);
            if (x > config.gridWidth * config.tileSize) {
                x -= config.gridWidth * config.tileSize;
            }
            if (x < 0) {
                x += config.gridWidth * config.tileSize;
            }
            robot.draw(gridctx, convertScreenCoords(x, ox), convertScreenCoords(y, oy));
        }
        requestAnimationFrame(animateRobot);
    }
}

function convertScreenCoords(x, ox) {
    return (x - ox) / zoom + (config.gridWidth * config.tileSize) / 2;
}

function drawBaseTiles(ctx, tiles) {
    let i = 0;
    let sideLength = Math.ceil(Math.sqrt(config.numberOfTiles));
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

function generateBaseTile(tileData, id) {
    return new BaseTile({
        edges: tileData[id].edges,
        size: config.tileSize,
        color: "green",
        id: id,
        icon: tileData[id].icon,
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
    gGridTiles.forEach(tile => {
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
    collapse(gGridTiles[lowestEntropy]);
    stack.push(gGridTiles[lowestEntropy]);

    wfcLoop(stack);

    return true;
}

function wfcLoop(stack) {
    while (stack.length > 0) {
        let tile = stack.pop();
        for (let d = 0; d < 4; d++) {
            let possiblesSet = generatePossibleForAllCandidates(tile.candidates, d);
            let neighbourID = tile.neighbours[d];
            if (neighbourID != undefined) {
                let neighbour = gGridTiles[neighbourID];
                let reduced = constrain(neighbour, possiblesSet);
                if (reduced) {
                    stack.push(neighbour);
                }
            }
        }
    }
}

function createBorder() {
    let stack = [];
    for (let y = config.gridWidth; y < config.gridSize - config.gridWidth; y += config.gridWidth) {
        gGridTiles[y].candidates = [0];
        stack.push(gGridTiles[y]);
    }
    for (let y = config.gridWidth - 1 + config.gridWidth; y < config.gridSize - config.gridWidth; y += config.gridWidth) {
        gGridTiles[y].candidates = [0];
        stack.push(gGridTiles[y]);
    }
    for (let x = 0; x < config.gridWidth; x++) {
        gGridTiles[x].candidates = [0];
        stack.push(gGridTiles[x]);
    }
    for (let x = config.gridSize - config.gridWidth; x < config.gridSize; x++) {
        gGridTiles[x].candidates = [0];
        stack.push(gGridTiles[x]);
    }
    let m = Math.floor(config.gridSize / 2);
    gGridTiles[m].candidates = [12];
    stack.push(gGridTiles[m]);

    wfcLoop(stack);
}

function generatePossibleForAllCandidates(candidates, direction) {
    let possiblesSet = new Set();
    candidates.forEach((candidate) => {
        let possibles = gBaseTiles[candidate].possible[direction];
        possibles.forEach((possible) => {
            possiblesSet.add(possible)
        })
    });
    return possiblesSet;
}

