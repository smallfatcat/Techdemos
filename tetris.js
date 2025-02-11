const blocks = [
    {
        blockType: 'I',
        size: 4,
        shape: [
            [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0]
            ],
            [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0]
            ]
        ]
    },
    {
        blockType: 'J',
        size: 3,
        shape: [
            [
                [1, 0, 0],
                [1, 1, 1],
                [0, 0, 0]
            ],
            [
                [0, 1, 1],
                [0, 1, 0],
                [0, 1, 0]
            ],
            [
                [0, 0, 0],
                [1, 1, 1],
                [0, 0, 1]
            ],
            [
                [0, 1, 0],
                [0, 1, 0],
                [1, 1, 0]
            ]
        ]
    },
    {
        blockType: 'L',
        size: 3,
        shape: [
            [
                [0, 0, 1],
                [1, 1, 1],
                [0, 0, 0]
            ],
            [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 1]
            ],
            [
                [0, 0, 0],
                [1, 1, 1],
                [1, 0, 0]
            ],
            [
                [1, 1, 0],
                [0, 1, 0],
                [0, 1, 0]
            ]
        ]
    },
    {
        blockType: 'O',
        size: 4,
        shape: [
            [
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ]
        ]
    },
    {
        blockType: 'S',
        size: 3,
        shape: [
            [
                [0, 1, 1],
                [1, 1, 0],
                [0, 0, 0]
            ],
            [
                [0, 1, 0],
                [0, 1, 1],
                [0, 0, 1]
            ],
            [
                [0, 0, 0],
                [0, 1, 1],
                [1, 1, 0]
            ],
            [
                [1, 0, 0],
                [1, 1, 0],
                [0, 1, 0]
            ]
        ]
    },
    {
        blockType: 'T',
        size: 3,
        shape: [
            [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0]
            ],
            [
                [0, 1, 0],
                [0, 1, 1],
                [0, 1, 0]
            ],
            [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0]
            ],
            [
                [0, 1, 0],
                [1, 1, 0],
                [0, 1, 0]
            ]
        ]
    },
    {
        blockType: 'Z',
        size: 3,
        shape: [
            [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0]
            ],
            [
                [0, 0, 1],
                [0, 1, 1],
                [0, 1, 0]
            ],
            [
                [0, 0, 0],
                [1, 1, 0],
                [0, 1, 1]
            ],
            [
                [0, 1, 0],
                [1, 1, 0],
                [1, 0, 0]
            ]
        ]
    }
];
let blankRow = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const blockColors = ["⬛", "🟦", "🟧", "🟨", "🟫", "🟩", "🟪", "🟥"]
const gridHeight = 24;
const startDisplay = 0;
const rotJLTSZright = [
    [
        [0, 0, 1],
        [-1, 0, 1],
        [-1, -1, 1],
        [0, 2, 1],
        [-1, 2, 1]
    ],
    [
        [0, 0, 1],
        [1, 0, 1],
        [1, 1, 1],
        [0, -2, 1],
        [1, -2, 1]
    ],
    [
        [0, 0, 1],
        [1, 0, 1],
        [1, -1, 1],
        [0, 2, 1],
        [1, 2, 1]
    ],
    [
        [0, 0, 1],
        [-1, 0, 1],
        [-1, 1, 1],
        [0, -2, 1],
        [-1, -2, 1]
    ]
];
const rotJLTSZleft = [
    [
        [0, 0, 3],
        [1, 0, 3],
        [1, -1, 3],
        [0, 2, 3],
        [1, 2, 3]
    ],
    [
        [0, 0, 3],
        [1, 0, 3],
        [1, 1, 3],
        [0, -2, 3],
        [1, -2, 3]
    ],
    [
        [0, 0, 3],
        [-1, 0, 3],
        [-1, -1, 3],
        [0, 2, 3],
        [-1, 2, 3]
    ],
    [
        [0, 0, 3],
        [-1, 0, 3],
        [-1, 1, 3],
        [0, -2, 3],
        [-1, -2, 3]
    ]
];
const rotIright = [
    [
        [0, 0, 1],
        [-2, 0, 1],
        [1, 0, 1],
        [-2, 1, 1],
        [1, -2, 1]
    ],
    [
        [0, 0, 1],
        [-1, 0, 1],
        [2, 0, 1],
        [-1, -2, 1],
        [2, 1, 1]
    ],
    [
        [0, 0, 1],
        [2, 0, 1],
        [-1, 0, 1],
        [2, -1, 1],
        [-1, 2, 1]
    ],
    [
        [0, 0, 1],
        [1, 0, 1],
        [-2, 0, 1],
        [1, 2, 1],
        [-2, -1, 1]
    ]
];
const rotIleft = [
    [
        [0, 0, 3],
        [-1, 0, 3],
        [2, 0, 3],
        [-1, -2, 3],
        [2, 1, 3]
    ],
    [
        [0, 0, 3],
        [2, 0, 3],
        [-1, 0, 3],
        [2, -1, 3],
        [-1, 2, 3]
    ],
    [
        [0, 0, 3],
        [1, 0, 3],
        [-2, 0, 3],
        [1, 2, 3],
        [-2, -1, 3]
    ],
    [
        [0, 0, 3],
        [-2, 0, 3],
        [1, 0, 3],
        [-2, 1, 3],
        [1, -2, 3]
    ]
];

let activeBlock = {};
let nextBlock = {};
let grid = [];
let lastGrid = [];
let lastActiveBlock = {};
let gameOver = false;
let score = 0;
let lines = 0;
let startLevel = 1;
let level = startLevel;
let speed = 800;
let dropTickStart = Date.now();
let startTime = Date.now();
let history = [];
let historyNext = [];
let historyActiveBlock = [];

let replayMode = false;



function init() {
    history = [];
    historyNext = [];
    historyActiveBlock = [];
    grid = [];
    for (let i = 0; i < gridHeight; i++) {
        grid.push(blankRow.slice())
    }
    lastGrid = getGridCopy(grid);
    activeBlock = {};
    nextBlock = {
        x: 3,
        y: 2,
        type: getRandomInt(0, 7),
        rotation: 0,
    }
    lastActiveBlock = getActiveBlockCopy(nextBlock);

    gameOver = false;
    score = 0;
    lines = 0;
    startLevel = Number(document.getElementById("startlevel").value);
    level = startLevel;
    speed = 800;
    spawnBlock();
    dropTickStart = Date.now();
    startTime = Date.now();
    drawGrid(grid, activeBlock);
    requestAnimationFrame(animate);
}

function checkLines() {
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
            score += 100 * level;
            break;
        case 2:
            score += 300 * level;
            break;
        case 3:
            score += 500 * level;
            break;
        case 4:
            score += 800 * level;
            break;
        default:
            break;
    }
    lines += clearedCount;
    level = Math.floor(lines / 5) + startLevel;
    speed = Math.floor(((0.8 - ((level - 1) * 0.007)) ** (level - 1)) * 1000);
}

function spawnBlock() {
    if (!gameOver) {
        checkLines();
        if (collidesWithGrid(grid, nextBlock, 0, 0, 0)) {
            console.log("Game Ended");
            gameOver = true;
        }
        else {
            activeBlock = {
                x: 3,
                y: 2,
                type: nextBlock.type,
                rotation: 0
            }

            nextBlock.type = getRandomInt(0, 7);
        }
    }
}

function lockBlock(grid) {
    for (let i = 0; i < blocks[activeBlock.type].size; i++) {
        for (let j = 0; j < blocks[activeBlock.type].size; j++) {
            var x = activeBlock.x + i;
            var y = activeBlock.y + j;
            if (blocks[activeBlock.type].shape[activeBlock.rotation][j][i]) {
                grid[y][x] = activeBlock.type + 1;
            }
        }
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
    for (let j = 0; j < blocks[activeBlock.type].size; j++) {
        for (let i = 0; i < blocks[activeBlock.type].size; i++) {
            var x = activeBlock.x + new_x + i;
            var y = activeBlock.y + new_y + j;
            if (blocks[activeBlock.type].shape[(activeBlock.rotation + new_rotation) % 4][j][i] && ((x < 0) || (x > 9) || (y > gridHeight - 1) || grid[y][x])) {
                return true;
            }
        }
    }
    return false;
}

function drawGrid(grid, activeBlock) {
    gridElement = '';
    for (let row = startDisplay; row < grid.length; row++) {
        var rowText = '';
        for (let col = 0; col < 10; col++) {
            let j = col - activeBlock.x;
            let i = row - activeBlock.y;
            if (i >= 0 && i < blocks[activeBlock.type].size && j >= 0 && j < blocks[activeBlock.type].size) {
                if (blocks[activeBlock.type].shape[activeBlock.rotation][i][j]) {
                    rowText += blockColors[activeBlock.type + 1];
                    continue;
                }
            }
            rowText += blockColors[grid[row][col]];
        }
        gridElement += rowText + '<br>';
    }
    nextElement = '';
    var size = blocks[nextBlock.type].size;
    for (let x = 0; x < size; x++) {
        var rowText = '';
        for (let y = 0; y < size; y++) {
            if (blocks[nextBlock.type].shape[nextBlock.rotation][x][y]) {
                rowText += blockColors[nextBlock.type + 1];
            }
            else {
                rowText += blockColors[0];
            }
        }
        nextElement += rowText + '<br>';;
    }
    document.getElementById("griddiv").innerHTML = gridElement;
    document.getElementById("nextdiv").innerHTML = nextElement;
    document.getElementById("scorediv").innerHTML = "Score: " + score + "<br>" + "Level: " + level + "<br>" + "Lines: " + lines;
}

function animate() {
    if (Date.now() - dropTickStart > speed) {
        dropTickStart = Date.now();
        if (collidesWithGrid(grid, activeBlock, 0, 1, 0)) {
            lockBlock(grid);
            spawnBlock();
        }
        else {
            activeBlock.y += 1;
        }
    }

    if (gridChanged(grid, lastGrid)) {
        // console.log(grid);
        history.push([Date.now() - startTime, getGridCopy(grid)]);
    }
    if (activeBlockChanged(activeBlock, lastActiveBlock)) {
        // console.log(activeBlock);
        historyActiveBlock.push([Date.now() - startTime, getActiveBlockCopy(activeBlock)]);
    }
    lastActiveBlock = getActiveBlockCopy(activeBlock);
    lastGrid = getGridCopy(grid);
    drawGrid(grid, activeBlock);
    if (!gameOver) {
        requestAnimationFrame(animate);
    }
}

function activeBlockChanged(activeBlock, lastActiveBlock) {
    if (activeBlock.x != lastActiveBlock.x || activeBlock.y != lastActiveBlock.y
        || activeBlock.rotation != lastActiveBlock.rotation || activeBlock.type != lastActiveBlock.type) {
        return true;
    }
    return false;
}

function gridChanged(grid, lastGrid) {
    var changedGrid = false;
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] != lastGrid[i][j]) {
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

function getActiveBlockCopy(activeBlockOriginal) {
    let activeBlockCopy = {
        x: activeBlockOriginal.x,
        y: activeBlockOriginal.y,
        type: activeBlockOriginal.type,
        rotation: activeBlockOriginal.rotation
    }
    return activeBlockCopy
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

window.onload = (event) => {
    init();
    // drawGrid(grid, activeBlock);
    // requestAnimationFrame(animate);

    // Handle user input (add keypress events)
    document.addEventListener('keydown', function (event) {
        switch (event.key.toLowerCase()) {
            case 'a':
                left();
                break;
            case 'd':
                right();
                break;
            case 's':
                down();
                break;
            case 'w':
                rotateRight();
                break;
            case 'e':
                rotateRight();
                break;
            case 'q':
                rotateLeft();
                break;
        }
        drawGrid(grid, activeBlock)
    });
};

function down() {
    if (!collidesWithGrid(grid, activeBlock, 0, 1, 0)) {
        activeBlock.y += 1;
        dropTickStart = Date.now();
    }
    else {
        lockBlock(grid);
        spawnBlock();
    }
}
function left() {
    if (!collidesWithGrid(grid, activeBlock, -1, 0, 0)) {
        activeBlock.x -= 1;
    }
}
function right() {
    if (!collidesWithGrid(grid, activeBlock, 1, 0, 0)) {
        activeBlock.x += 1;
    }
}

function rotateLeft() {
    if (activeBlock.type == 0) {
        rotateUsingSRS(rotIleft[activeBlock.rotation]);
    }
    else if (activeBlock.type != 3) {
        rotateUsingSRS(rotJLTSZleft[activeBlock.rotation]);
    }
}

function rotateRight() {
    if (activeBlock.type == 0) {
        rotateUsingSRS(rotIright[activeBlock.rotation]);
    }
    else if (activeBlock.type != 3) {
        rotateUsingSRS(rotJLTSZright[activeBlock.rotation]);
    }
}

function rotateUsingSRS(srsArray) {
    for (let i = 0; i < srsArray.length; i++) {
        if (skipCheck(srsArray[i][0], srsArray[i][1], srsArray[i][2])) {
            break;
        }
    }
}

function skipCheck(x, y, r) {
    if (!collidesWithGrid(grid, activeBlock, x, y, r)) {   // left/up
        activeBlock.x += x;
        activeBlock.y += y;
        activeBlock.rotation = (activeBlock.rotation + r) % 4;
        return true;
    }
    return false;
}
