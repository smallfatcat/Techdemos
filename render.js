const blockColors = ["⬛", "🟦", "🟧", "🟨", "🟫", "🟩", "🟪", "🟥"]
const startDisplay = 4;

function renderGridElement(grid, activeBlock) {
    gridElement = '';
    for (let row = startDisplay; row < grid.length; row++) {
        var rowText = '';
        for (let col = 0; col < 10; col++) {
            var coords = blockCoords[activeBlock.type][activeBlock.rotation];
            var noActiveBlockAtThisCoord = true;
            for (let coord of coords) {
                var x = activeBlock.x + coord[0];
                var y = activeBlock.y + coord[1];
                if (row == y && col == x) {
                    rowText += blockColors[activeBlock.type + 1];
                    noActiveBlockAtThisCoord = false;
                    break;
                }
            }
            if (noActiveBlockAtThisCoord) {
                rowText += blockColors[grid[row][col]];
            }
        }
        gridElement += rowText + '<br>';
    }
    return gridElement;
}
function renderBlockElement(blockType, blockRotation) {
    nextElement = '';
    var size = 3;
    if (blockType == BLOCK_I || blockType == BLOCK_O) {
        size = 4;
    }
    for (let x = 0; x < size; x++) {
        var rowText = '';
        for (let y = 0; y < size; y++) {
            var coords = blockCoords[blockType][blockRotation];
            var flag = false;
            for (let coord of coords) {
                if (coord[0] == y && coord[1] == x) {
                    flag = true;
                    break;
                }
            }
            if (flag) {
                rowText += blockColors[blockType + 1];
            }
            else {
                rowText += blockColors[0];
            }
        }
        nextElement += rowText + '<br>';;
    }
    return nextElement;
}
