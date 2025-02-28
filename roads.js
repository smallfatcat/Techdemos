let robots = [];
let loopCount = 500;
let tilectx = undefined;
let gridctx = undefined;
let bufferctx = undefined;
let tileCanvas = undefined;
let gridCanvas = undefined;
let bufferCanvas = undefined;

let gBaseTiles = [];
let gGridTiles = [];

const gridWidth = 25;
const numberOfTiles = 50;
const tileSize = 64;

const config = {
    numberOfTiles: numberOfTiles,
    tileSize: tileSize,
    width: Math.ceil(Math.sqrt(numberOfTiles)) * tileSize,
    height: Math.ceil(Math.sqrt(numberOfTiles)) * tileSize,
    gridWidth: gridWidth,
    gridSize: gridWidth * gridWidth,
}

const EDGE_N = 0;
const EDGE_E = 1;
const EDGE_S = 2;
const EDGE_W = 3;

const roadColor = [
    "blue",
    "red",
    "purple",
];

const gameState = {
    drawRobot: false,
    paused: false,
    viewWindowX: config.gridWidth * config.tileSize / 2,
    viewWindowY: config.gridWidth * config.tileSize / 2,
    scrollSpeed: 2,
    zoom: 1.0,
    key_up: false,
    key_down: false,
    key_left: false,
    key_right: false,
    key_zoom_in: false,
    key_zoom_out: false,
}

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
            gameState.key_left = true;
        }
        if (keyString == 'd') {
            gameState.key_right = true;
        }
        if (keyString == 'w') {
            gameState.key_up = true;
        }
        if (keyString == 's') {
            gameState.key_down = true;
        }
        if (keyString == 'q') {
            gameState.key_zoom_in = true;
        }
        if (keyString == 'e') {
            gameState.key_zoom_out = true;
        }
    });

    document.addEventListener('keyup', function (event) {
        const keyString = event.key.toLowerCase();
        if (keyString == 'a') {
            gameState.key_left = false;
        }
        if (keyString == 'd') {
            gameState.key_right = false;
        }
        if (keyString == 'w') {
            gameState.key_up = false;
        }
        if (keyString == 's') {
            gameState.key_down = false;
        }
        if (keyString == 'q') {
            gameState.key_zoom_in = false;
        }
        if (keyString == 'e') {
            gameState.key_zoom_out = false;
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
    gameState.drawRobot = false;
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
    gameState.paused = !gameState.paused;
    if (gameState.paused) {
        document.getElementById("pause").textContent = "Play";
    }
    else {
        document.getElementById("pause").textContent = "Pause";
    }
}

function scroll() {
    if (gameState.key_up) {
        gameState.viewWindowY -= gameState.scrollSpeed;
    }
    if (gameState.key_down) {
        gameState.viewWindowY += gameState.scrollSpeed;
    }
    if (gameState.key_left) {
        gameState.viewWindowX -= gameState.scrollSpeed;
    }
    if (gameState.key_right) {
        gameState.viewWindowX += gameState.scrollSpeed;
    }
    if (gameState.key_zoom_in) {
        gameState.zoom -= 0.001;
    }
    if (gameState.key_zoom_out) {
        gameState.zoom += 0.001;
    }
}

function animateGenerationPhase(t) {
    let finished = false;
    loopCount = Math.floor(2 ** (document.getElementById("speed").value / 100));
    for (i = 0; i < loopCount && !gameState.paused; i++) {
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
        gameState.drawRobot = true;
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
    if (gameState.drawRobot) {
        let canvasX = config.gridWidth * config.tileSize;
        let portalX = canvasX * gameState.zoom;
        let sx = gameState.viewWindowX - (portalX / 2);
        let sy = gameState.viewWindowY - (portalX / 2);
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
            robot.draw(gridctx, convertScreenCoords(x, gameState.viewWindowX), convertScreenCoords(y, gameState.viewWindowY));
        }
        requestAnimationFrame(animateRobot);
    }
}

function convertScreenCoords(x, ox) {
    return (x - ox) / gameState.zoom + (config.gridWidth * config.tileSize) / 2;
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
        probability: tileData[id].probability,
        name: tileData[id].name,
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

function wfc() {
    let stack = [];
    let lowestEntropy = getLowestEntropy();
    if (lowestEntropy == -1) {
        return false;
    }
    let lowestEntropyTile = gGridTiles[lowestEntropy];
    lowestEntropyTile.collapse();
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
                let reduced = neighbour.constrain(possiblesSet);
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

