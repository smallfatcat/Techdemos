let robots = [];
let loopCount = 500;
let tilectx = undefined;
let gridctx = undefined;
let bufferctx = undefined;
let tileCanvas = undefined;
let gridCanvas = undefined;
let bufferCanvas = undefined;


let paused = false;

let baseTiles = [];
let gridTiles = [];
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
    "red",
    "green",
    "blue",
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

    // baseTiles = initBaseTiles(config.numberOfTiles);
    baseTiles = initStart();
    gridTiles = initGridTiles(config.gridSize);
    createBorder();
    animate();
}

function initButton() {
    gridTiles = initGridTiles(config.gridSize);
    createBorder();
    initRobot();
    animate();
}

function initRobot() {
    drawRobot = false;
    robots = [];
    for (let i = 0; i < 100; i++) {
        spawnRobot(Math.floor(config.gridWidth / 2), Math.floor(config.gridWidth / 2), roadColor[i%3]);
    }
}

function spawnRobot(x, y, color) {
    let robot = new Robot({ x: x, y: y, color: color });
    robots.push(robot);
}

function initStart() {
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
        [1, 0, 1, 0], // 33
        [0, 1, 0, 1], // 34
        [0, 5, 0, 1], // 35
        [0, 1, 0, 5], // 36
        [1, 0, 5, 0], // 37
        [5, 0, 1, 0], // 38
        [0, 5, 0, 5], // 39
        [5, 0, 5, 0], // 40
        [0, 6, 0, 6], // 41
        [0, 0, 6, 6], // 42
        [6, 0, 0, 6], // 43
        [6, 6, 0, 0], // 44
        [0, 6, 6, 0], // 45
        [6, 0, 6, 0], // 46
        [0, 0, 0, 6], // 47
        [6, 0, 0, 0], // 48
        [0, 6, 0, 0], // 49
        [0, 0, 6, 0], // 50
        [1, 6, 1, 6], // 51
        [6, 1, 6, 1], // 52
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

function animate(t) {
    let finished = false;
    loopCount = Math.floor(2 ** (document.getElementById("speed").value / 100));
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
    drawGridTiles(bufferctx, gridTiles, baseTiles);
    gridctx.drawImage(bufferCanvas, 0, 0);
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
            robot.move(gridTiles, baseTiles);
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

function convertScreenCoords(x, ox){
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

function initBaseTiles(numberOfTiles) {
    let edges = generateEdges(config.uniqueEdges);
    let tiles = [];
    for (let id = 0; id < edges.length; id++) {
        let tile = generateBaseTile(edges, id);
        tiles.push(tile);
    }
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
    collapse(gridTiles[lowestEntropy]);
    stack.push(gridTiles[lowestEntropy]);

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
                let neighbour = gridTiles[neighbourID];
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
        gridTiles[y].candidates = [28];
        stack.push(gridTiles[y]);
    }
    for (let y = config.gridWidth - 1 + config.gridWidth; y < config.gridSize - config.gridWidth; y += config.gridWidth) {
        gridTiles[y].candidates = [28];
        stack.push(gridTiles[y]);
    }
    for (let x = 0; x < config.gridWidth; x++) {
        gridTiles[x].candidates = [28];
        stack.push(gridTiles[x]);
    }
    for (let x = config.gridSize - config.gridWidth; x < config.gridSize; x++) {
        gridTiles[x].candidates = [28];
        stack.push(gridTiles[x]);
    }
    let m = Math.floor(config.gridSize / 2);
    gridTiles[m].candidates = [12];
    stack.push(gridTiles[m]);

    wfcLoop(stack);
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

