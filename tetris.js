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
                [1, 0, 0],
                [1, 1, 0],
                [0, 1, 0]
            ]
        ]
    }
];
let grid = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
const blockColors = ["⬛", "🟦", "🟧", "🟫", "🟨", "🟩", "🟪", "🟥"]
let activeBlock = {};
let nextBlock = {
    x: 3,
    y: 0,
    type: getRandomInt(0, 7),
    rotation: 0,
}
let tickTime = 1000;
let gameOver = false;
let score = 0;
let lines = 0;
let level = 1;
let speed = 800;
spawnBlock();
let dropTickStart = Date.now();

function checkLines() {
    var clearedCount = 0;
    for (let row = 0; row < 20; row++) {
        lineCleared = true;
        for (let col = 0; col < 10; col++) {
            if (grid[row][col] == 0) {
                lineCleared = false;
            }
        }
        if (lineCleared) {
            clearedCount += 1;
            grid.splice(row, 1);
            grid.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        }
    }
    switch (clearedCount) {
        case 1:
            score += 100 * level;
            lines += 1;
            break;
        case 2:
            score += 300 * level;
            lines += 2;
            break;
        case 3:
            score += 500 * level;
            lines += 3;
            break;
        case 4:
            score += 800 * level;
            lines += 4;
            break;

        default:
            break;
    }
    level = Math.floor(lines / 5) + 1;
    speed = Math.floor(((0.8-((level - 1) * 0.007))**(level-1)) * 1000);
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
                y: 0,
                type: nextBlock.type,
                rotation: 0,
            }
            nextBlock.type = getRandomInt(0, 7);
        }
    }
}

function freezeBlock(grid) {
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
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

function collidesWithGrid(grid, activeBlock, new_x, new_y, new_rotation) {
    for (let j = 0; j < blocks[activeBlock.type].size; j++) {
        for (let i = 0; i < blocks[activeBlock.type].size; i++) {
            var x = activeBlock.x + new_x + i;
            var y = activeBlock.y + new_y + j;
            if (blocks[activeBlock.type].shape[(activeBlock.rotation + new_rotation) % 4][j][i] && ((x < 0) || (x > 9) || (y > 19) || grid[y][x])) {
                return true;
            }
        }
    }
    return false;
}

function hasValidMoves(grid, activeBlock) {
    if (!collidesWithGrid(grid, activeBlock, 1, 0, 0) || !collidesWithGrid(grid, activeBlock, -1, 0, 0) || !collidesWithGrid(grid, activeBlock, 0, 1, 0) || !collidesWithGrid(grid, activeBlock, 0, 0, 1)) {
        return true;
    }
    return false;
}

function drawGrid(grid, activeBlock) {
    gridElement = '';
    for (let row = 0; row < 20; row++) {
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
        // console.log(dropTickStart)
        dropTickStart = Date.now();
        if (collidesWithGrid(grid, activeBlock, 0, 1, 0)) {
            freezeBlock(grid);
            spawnBlock();
        }
        else {
            activeBlock.y += 1;
        }
    }
    drawGrid(grid, activeBlock);
    requestAnimationFrame(animate);
}

window.onload = (event) => {
    drawGrid(grid, activeBlock);
    requestAnimationFrame(animate);

    // Handle user input (add keypress events)
    document.addEventListener('keydown', function (event) {
        switch (event.key.toLowerCase()) {
            case 'a':
                if (!collidesWithGrid(grid, activeBlock, -1, 0, 0)) {
                    activeBlock.x -= 1;
                }
                break;
            case 'd':
                if (!collidesWithGrid(grid, activeBlock, 1, 0, 0)) {
                    activeBlock.x += 1;
                }
                break;
            case 's':
                if (!collidesWithGrid(grid, activeBlock, 0, 1, 0)) {
                    activeBlock.y += 1;
                    dropTickStart = Date.now();
                }
                else {
                    freezeBlock(grid);
                    spawnBlock();
                }
                break;
            case 'w':
                if (!collidesWithGrid(grid, activeBlock, 0, 0, 1)) {
                    activeBlock.rotation = (activeBlock.rotation + 1) % 4;
                }
                else if (!collidesWithGrid(grid, activeBlock, -1, 0, 1)) {
                    activeBlock.x -= 1;
                    activeBlock.rotation = (activeBlock.rotation + 1) % 4;
                }
                else if (!collidesWithGrid(grid, activeBlock, 1, 0, 1)) {
                    activeBlock.x += 1;
                    activeBlock.rotation = (activeBlock.rotation + 1) % 4;
                }

                break;
            case 'e':
                if (!collidesWithGrid(grid, activeBlock, 0, 0, 1)) {
                    activeBlock.rotation = (activeBlock.rotation + 1) % 4;
                }
                else if (!collidesWithGrid(grid, activeBlock, -1, 0, 1)) {
                    activeBlock.x -= 1;
                    activeBlock.rotation = (activeBlock.rotation + 1) % 4;
                }
                else if (!collidesWithGrid(grid, activeBlock, 1, 0, 1)) {
                    activeBlock.x += 1;
                    activeBlock.rotation = (activeBlock.rotation + 1) % 4;
                }

                break;
            case 'q':
                if (!collidesWithGrid(grid, activeBlock, 0, 0, 3)) {
                    activeBlock.rotation = (activeBlock.rotation + 3) % 4;
                }
                else if (!collidesWithGrid(grid, activeBlock, -1, 0, 3)) {
                    activeBlock.x -= 1;
                    activeBlock.rotation = (activeBlock.rotation + 3) % 4;
                }
                else if (!collidesWithGrid(grid, activeBlock, 1, 0, 3)) {
                    activeBlock.x += 1;
                    activeBlock.rotation = (activeBlock.rotation + 3) % 4;
                }

                break;
        }
        // if (!hasValidMoves(grid, activeBlock)) {
        //     freezeBlock(grid);
        //     spawnBlock();
        // }
        drawGrid(grid, activeBlock)
    });
};

// rotate left: {{0,0,},{0,-1,},{1,0,},{1,-1,},{-1,0,},{-1,-1,},{0,1,},{1,1,},{-1,1,},}
// rotate right: {{0,0,},{0,-1,},{-1,0,},{-1,-1,},{1,0,},{1,-1,},{0,1,},{-1,1,},{1,1,},}