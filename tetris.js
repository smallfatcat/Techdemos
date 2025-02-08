const blocks = [
    {
        blockType: 'I',
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
        blockType: 'O',
        shape: [
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
    },
    {
        blockType: 'J',
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
    }
];

let activeBlock = {
    x: 3,
    y: 0,
    type: 2,
    rotation: 0,
    size: 3
};

function collidesWithGrid(grid, activeBlock, x, y, rotation){
    for (let j = 0; j < activeBlock.size; j++) {
        for (let i = 0; i <  activeBlock.size; i++) {
            if(blocks[activeBlock.type].shape[(activeBlock.rotation + rotation)%4][j][i] && ((activeBlock.x + x + i) < 0 || (activeBlock.x + x + i) > 9 || (activeBlock.y + y + j > 19))){
                return true;
            }
            if(blocks[activeBlock.type].shape[(activeBlock.rotation + rotation)%4][j][i] && grid[activeBlock.y + y + j][activeBlock.x + x + i]){
                return true;
            }
        }
    }
    return false;
}

function drawGrid(grid, activeBlock) {
    gridElement = '';
    for (let row = 0; row < 20; row++) {
        rowText = '';
        for (let col = 0; col < 10; col++) {
            let j = col - activeBlock.x;
            let i = row - activeBlock.y;
            if (i >= 0 && i < activeBlock.size && j >= 0 && j < activeBlock.size) {
                if (blocks[activeBlock.type].shape[activeBlock.rotation][i][j]) {
                    rowText += "🟦";
                    continue;
                }
            }


            switch (grid[row][col]) {
                case 1:
                    rowText += "🟦";
                    break;
                case 2:
                    rowText += "🟧";
                    break;
                case 3:
                    rowText += "🟫";
                    break;
                case 4:
                    rowText += "🟨";
                    break;
                case 5:
                    rowText += "🟩";
                    break;
                case 6:
                    rowText += "🟪";
                    break;
                case 7:
                    rowText += "🟥";
                    break;
                default:
                    rowText += "⬛";
                    break;
            }
        }
        gridElement += rowText + '<br>';
    }
    document.getElementById("griddiv").innerHTML = gridElement;
}

window.onload = (event) => {

    let grid = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 3, 3, 3, 0, 0, 0, 0],
        [0, 0, 0, 0, 4, 4, 0, 0, 0, 0],
        [0, 0, 0, 0, 4, 4, 0, 0, 0, 0],
        [0, 0, 0, 0, 5, 5, 0, 0, 0, 0],
        [0, 0, 0, 5, 5, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 6, 0, 0, 0, 0, 0],
        [0, 0, 0, 6, 6, 6, 0, 0, 0, 0],
        [0, 0, 0, 7, 7, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 7, 7, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 5, 0, 3, 4, 4, 2],
        [0, 0, 0, 0, 5, 5, 3, 4, 4, 2],
        [0, 0, 0, 7, 7, 5, 3, 3, 2, 2],
        [0, 0, 0, 6, 7, 7, 1, 1, 1, 1],
    ];

    drawGrid(grid, activeBlock);

    // Handle user input (add keypress events)
    document.addEventListener('keydown', function (event) {
        switch (event.key) {
            case 'a':
                if(!collidesWithGrid(grid,activeBlock, -1, 0, 0)){
                    activeBlock.x -= 1;
                }
                break;
            case 'd':
                if(!collidesWithGrid(grid,activeBlock, 1, 0, 0)){
                    activeBlock.x += 1;
                }
                break;
            case 's':
                if(!collidesWithGrid(grid,activeBlock, 0, 1, 0)){
                    activeBlock.y += 1;
                }
                break;
            case 'w':
                if(!collidesWithGrid(grid,activeBlock, 0, 0, 1)){
                    activeBlock.rotation = (activeBlock.rotation + 1) % 4;
                }
                break;
        }
        drawGrid(grid, activeBlock)
    });
};