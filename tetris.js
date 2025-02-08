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
        [0, 0, 6, 7, 7, 5, 3, 3, 2, 2],
        [0, 6, 6, 6, 7, 7, 1, 1, 1, 1],
    ];

    drawGrid(grid, activeBlock);

    // Handle user input (add keypress events)
    document.addEventListener('keydown', function (event) {
        switch (event.key) {
            case 'a':
                console.log("left")
                activeBlock.x -= 1;
                drawGrid(grid, activeBlock)
                break;
            case 'd':
                console.log("right")
                activeBlock.x += 1;
                drawGrid(grid, activeBlock)
                break;
            case 's':
                console.log("down")
                activeBlock.y += 1;
                drawGrid(grid, activeBlock)
                break;
            case 'w':
                console.log("down")
                activeBlock.rotation = (activeBlock.rotation + 1) % 4;
                drawGrid(grid, activeBlock)
                break;
        }
    });
};