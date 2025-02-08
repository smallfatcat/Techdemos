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
    }
];

function drawGrid(grid, activeBlock) {
    gridElement = '';
    for (let row = 0; row < 20; row++) {
        rowText = '';
        for (let col = 0; col < 10; col++) {
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
        [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 2, 2, 2, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
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

    let activeBlock = {
        x: 3,
        y: 0,
        type: "I",
        rotation: 0
    };

    drawGrid(grid, activeBlock);



    // Handle user input (add keypress events)
    document.addEventListener('keydown', function (event) {
        switch (event.key) {
            case 'ArrowLeft':
                console.log("left")
                // moveTetrominoLeft();
                break;
            case 'ArrowRight':
                console.log("right")
                // moveTetrominoRight();
                break;
            case 'ArrowDown':
                console.log("down")
                // moveTetrominoDown();
                break;
            // Add more key presses for rotation (e.g., 'ArrowUp')
        }
    });
};