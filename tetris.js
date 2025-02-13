const websocket = new WebSocket("ws://localhost:6789/");
const CLIENT_ID = Math.floor(Math.random() * 1000000);

const logEnabled = false;
const websocketEnabled = false;

let keys = {};
let keyTimer = {};
let keyRepeatTime = {};
let timeDelayDas = 400;
let timeDelayARE = 33;

let blankRow = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const gridHeight = 24;

let Block = {};
let Next = {};
let grid = [];
let lastGrid = [];
let lastBlock = {};
let lastNext = {};

let gameOver = false;
let score = 0;
let lines = 0;
let startLevel = 0;
let level = startLevel;
let speed = gravityAtLevel[0];
let startTime = Date.now();
let dropTickStart = startTime;

let history = [];
let historyNext = [];
let historyBlock = [];
let nextBlockID = 0;

let reassignMode = false;
let reassignControl = '';

let softDrop = 0;
let levelUp = startLevel * 10 + 10;

let keymap = {
    rotateL: 'q',
    rotateR: 'e',
    moveU: 'w',
    moveD: 's',
    moveL: 'a',
    moveR: 'd',
}

function reassign(elementID) {
    document.getElementById(elementID).classList.add("highlight-yellow");
    reassignControl = elementID;
    reassignMode = true;
}

function init() {
    history = [];
    historyNext = [];
    historyBlock = [];
    grid = [];
    for (let i = 0; i < gridHeight; i++) {
        grid.push(blankRow.slice())
    }
    lastGrid = getGridCopy(grid);
    Block = {};
    nextBlockID = 0;
    Next = {
        x: 3,
        y: 2,
        type: getRandomInt(0, 7),
        rotation: 0,
        id: nextBlockID,
    }
    lastBlock = getBlockCopy(Next);
    
    gameOver = false;
    score = 0;
    lines = 0;
    startLevel = Number(document.getElementById("startlevel").value);
    level = startLevel;
    levelUp = (startLevel * 10) + 10;
    speed = gravityAtLevel[0];
    spawnBlock();
    dropTickStart = Date.now();
    startTime = Date.now();
    drawGrid(grid, Block);
    requestAnimationFrame(animate);
}

function animate() {
    checkKeys();
    highlightKeys();
    applyGravity();
    
    storeHistory();
    
    
    drawGrid(grid, Block);
    if (!gameOver) {
        requestAnimationFrame(animate);
    }
}

function drawGrid(grid, activeBlock) {
    document.getElementById("griddiv").innerHTML = renderGridElement(grid, activeBlock);
    document.getElementById("nextdiv").innerHTML = renderBlockElement(Next.type, 0);
    document.getElementById("scorediv").innerHTML = "Score: " + score + "<br>" + "Level: " + level + "<br>" + "Lines: " + lines;
}

function clearLines() {
    var clearedCount = 0;
    for (let row = 0; row < grid.length; row++) {
        lineCleared = true;
        for (let col = 0; col < 10; col++) {
            if (grid[row][col] == 0) {
                lineCleared = false;
            }
        }
        if (lineCleared) {
            clearedCount += 1;
            grid.splice(row, 1);
            grid.unshift(blankRow.slice());
        }
    }
    switch (clearedCount) {
        case 1:
            score += 40 * (level + 1);
            break;
        case 2:
            score += 100 * (level + 1);
            break;
        case 3:
            score += 300 * (level + 1);
            break;
        case 4:
            score += 1200 * (level + 1);
            break;
        default:
            break;
    }
    lines += clearedCount;
}

function calcLevel(lines, level) {
    if (lines >= levelUp) {
        level += 1;
        levelUp += 10;
    }
    return level;
}

function calcSpeed(level) {
    return gravityAtLevel[level];
    // return Math.floor(((0.8 - ((level - 1) * 0.007)) ** (level - 1)) * 1000);
}

function spawnBlock() {
    if (!gameOver) {
        nextBlockID += 1;
        clearLines();
        level = calcLevel(lines, level);
        speed = calcSpeed(level);
        if (collidesWithGrid(grid, Next, 0, 0, 0)) {
            console.log("Game Ended");
            gameOver = true;
        }
        else {
            Block = {
                x: 3,
                y: 2,
                type: Next.type,
                rotation: 0,
                id: Next.id,
            }

            Next.type = getRandomInt(0, 7);
            Next.id = nextBlockID;

        }
    }
}

function lockBlock(grid) {
    score = score += softDrop;
    softDrop = 0;
    var coords = blockCoords[Block.type][Block.rotation];
    for (var coord of coords) {
        var col = Block.x + coord[0];
        var row = Block.y + coord[1];
        grid[row][col] = Block.type + 1;
    }
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    var res = Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);

    historyNext.push(res);

    return res; // The maximum is exclusive and the minimum is inclusive
}

function collidesWithGrid(grid, activeBlock, new_x, new_y, new_rotation) {
    var coords = blockCoords[activeBlock.type][(activeBlock.rotation + new_rotation) % 4];
    for (var coord of coords) {
        var col = activeBlock.x + new_x + coord[0];
        var row = activeBlock.y + new_y + coord[1];
        if ((col < 0 || col > 9) || (row > gridHeight - 1) || grid[row][col]) {
            return true;
        }
    }
    return false;
}


function applyGravity() {
    if (Date.now() - dropTickStart > speed) {
        dropTickStart = Date.now();
        if (collidesWithGrid(grid, Block, 0, 1, 0)) {
            lockBlock(grid);
            spawnBlock();
        }
        else {
            Block.y += 1;
        }
    }
}

function storeHistory() {
    if (gridChanged(grid, lastGrid)) {
        history.push([Date.now() - startTime, getGridCopy(grid)]);
        if (websocketEnabled) {
            websocket.send(JSON.stringify({ cid: CLIENT_ID, type: "g", t: Date.now() - startTime, d: getGridCopy(grid) }));
        }
    }
    if (blockChanged(Block, lastBlock)) {
        historyBlock.push([Date.now() - startTime, getBlockCopy(Block)]);
        if (websocketEnabled) {
            websocket.send(JSON.stringify({ cid: CLIENT_ID, type: "b", t: Date.now() - startTime, d: getBlockCopy(Block), n: Next.type }));
        }
    }
    lastBlock = getBlockCopy(Block);
    lastGrid = getGridCopy(grid);
}

function blockChanged(block, lastblock) {
    if (block.x != lastblock.x
        || block.y != lastblock.y
        || block.rotation != lastblock.rotation
        || block.type != lastblock.type
        || block.id != lastblock.id) {
        return true;
    }
    return false;
}

function gridChanged(grid, lastGrid) {
    var changedGrid = false;
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            if (grid[row][col] != lastGrid[row][col]) {
                changedGrid = true;
                break;
            }
        }
        if (changedGrid) {
            break;
        }
    }
    return changedGrid;
}

function getBlockCopy(blockOriginal) {
    let blockCopy = {
        x: blockOriginal.x,
        y: blockOriginal.y,
        type: blockOriginal.type,
        rotation: blockOriginal.rotation,
        id: blockOriginal.id,
    }
    return blockCopy
}

function getGridCopy(originalGrid) {
    let copyOfGrid = [];
    for (let i = 0; i < originalGrid.length; i++) {
        row = []
        for (let j = 0; j < originalGrid[0].length; j++) {
            row.push(originalGrid[i][j]);
        }
        copyOfGrid.push(row);
    }
    return copyOfGrid;
}

function down() {
    if (!collidesWithGrid(grid, Block, 0, 1, 0)) {
        Block.y += 1;
        dropTickStart = Date.now();
    }
    else {
        lockBlock(grid);
        spawnBlock();
    }
}

function left() {
    if (!collidesWithGrid(grid, Block, -1, 0, 0) && Block.y >= 4) {
        Block.x -= 1;
    }
}

function right() {
    if (!collidesWithGrid(grid, Block, 1, 0, 0) && Block.y >= 4) {
        Block.x += 1;
    }
}

function rotateLeft() {
    if (Block.type == BLOCK_I) {
        rotateUsingSRS(rotIleft[Block.rotation]);
    }
    else if (Block.type != BLOCK_O) {
        rotateUsingSRS(rotJLTSZleft[Block.rotation]);
    }
}

function rotateRight() {
    if (Block.type == BLOCK_I) {
        rotateUsingSRS(rotIright[Block.rotation]);
    }
    else if (Block.type != BLOCK_O) {
        rotateUsingSRS(rotJLTSZright[Block.rotation]);
    }
}

function rotateUsingSRS(srsArray) {
    for (let i = 0; i < srsArray.length; i++) {
        if (skipCheck(srsArray[i][0], srsArray[i][1], srsArray[i][2])) {
            break;
        }
    }
}

function hardDrop() {
    let locked = false;
    while (!locked) {
        if (!collidesWithGrid(grid, Block, 0, 1, 0) && Block.y >= 4) {
            Block.y += 1;
            // dropTickStart = Date.now();
        }
        else {
            // lockBlock(grid);
            // spawnBlock();
            locked = true;
        }
    }
}

function skipCheck(x, y, r) {
    if (!collidesWithGrid(grid, Block, x, y, r)) {   // left/up
        Block.x += x;
        Block.y += y;
        Block.rotation = (Block.rotation + r) % 4;
        return true;
    }
    return false;
}

function highlightKeys() {
    for (id in keymap) {
        if (keys[keymap[id]]) {
            document.getElementById(id).classList.add("highlight")
        }
        else {
            document.getElementById(id).classList.remove("highlight")
        }
    }
}


function checkKeys() {
    for (let key of Object.keys(keys)) {
        // highlightKey(key);
        if (keys[key] && Date.now() - keyTimer[key] > keyRepeatTime[key]) {
            keyTimer[key] = Date.now();
            if (keyRepeatTime[key] == 0) {
                keyRepeatTime[key] = timeDelayDas;
            }
            else {
                if (key == keymap['md']) {
                    softDrop += 1;
                    // console.log(softDrop);
                }
                keyRepeatTime[key] = timeDelayARE;
            }
            switch (key) {
                case keymap['moveL']:
                    left();
                    break;
                case keymap['moveR']:
                    right();
                    break;
                case keymap['moveD']:
                    down();
                    break;
                case keymap['moveU']:
                    hardDrop();
                    break;
                case keymap['rotateR']:
                    rotateRight();
                    break;
                case keymap['rotateL']:
                    rotateLeft();
                    break;
            }
        }
    }
}

window.onload = (event) => {
    init();

    // Detect Key Press and release
    document.addEventListener('keydown', function (event) {
        const keyString = event.key.toLowerCase();
        if (reassignMode) {
            keymap[reassignControl] = keyString;
            document.getElementById(reassignControl).classList.remove("highlight-yellow");
            document.getElementById(reassignControl).innerHTML = event.key.toUpperCase();
            reassignMode = false;
        }

        if (!keys[keyString]) {
            keys[keyString] = true;
            keyTimer[keyString] = Date.now();
            keyRepeatTime[keyString] = 0;
        }
    });

    document.addEventListener('keyup', function (event) {
        keys[event.key.toLowerCase()] = false;
    });

    websocket.onmessage = ({ data }) => {
        const event = JSON.parse(data);
        switch (event.type) {
            case "g":
                if (logEnabled) {
                    console.log(event);
                }
                break;
            case "b":
                if (logEnabled) {
                    console.log(event);
                }
                break;
            case "r":
                if (logEnabled) {
                    console.log(event);
                }
                break;
            case "open":
                if (logEnabled) {
                    console.log(event);
                }
                if (websocketEnabled) {
                    websocket.send(JSON.stringify({ cid: CLIENT_ID, type: "r", t: 0 }));
                }
                break;
            default:
                if (logEnabled) {
                    console.error("unsupported event", event);
                }
        }
    };
    websocket.onerror = ({ error }) => {
        // if (loggingOn) {
        console.log(error);
        // }
    };
};
