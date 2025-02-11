const websocket = new WebSocket("ws://localhost:6789/");
const CLIENT_ID = Math.floor(Math.random() * 1000000);

let activeBlock = {
    x: 3,
    y: 2,
    type: 0,
    rotation: 0,
    id: 0,
}
let nextBlock = {
    x: 3,
    y: 2,
    type: 0,
    rotation: 0,
    id: 1,
}
let grid = [];

let blankRow = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const blockColors = ["⬛", "🟦", "🟧", "🟨", "🟫", "🟩", "🟪", "🟥"]
const gridHeight = 24;
const startDisplay = 4;

function init() {
    grid = [];
    for (let i = 0; i < gridHeight; i++) {
        grid.push(blankRow.slice())
    }
    requestAnimationFrame(animate);
}

function animate() {
    drawGrid(grid, activeBlock);
    requestAnimationFrame(animate);
}

function drawGrid(grid, activeBlock) {
    document.getElementById("griddiv").innerHTML = renderGridElement(grid, activeBlock);
    // document.getElementById("nextdiv").innerHTML = renderBlockElement(nextBlock.type, 0);
    // document.getElementById("scorediv").innerHTML = "Score: " + score + "<br>" + "Level: " + level + "<br>" + "Lines: " + lines;
}

function renderGridElement(grid, activeBlock) {
    gridElement = '';
    for (let row = startDisplay; row < grid.length; row++) {
        var rowText = '';
        for (let col = 0; col < 10; col++) {
            var coords = blockCoords[activeBlock.type][activeBlock.rotation]
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

window.onload = (event) => {
    init();

    websocket.onmessage = ({ data }) => {
        const event = JSON.parse(data);
        switch (event.type) {
            case "g":
                grid = event.d; 
                console.log(event);
                break;
            case "b":
                activeBlock = event.d;
                console.log(event);
                break;
            case "r":
                console.log(event);
                break;
            case "open":
                console.log(event);
                websocket.send(JSON.stringify({cid: CLIENT_ID, type: "r", t: 0}));
                break;
            default:
                console.error("unsupported event", event);
        }
    };
    websocket.onerror = ({ data }) => {
        console.log(data);
    };
};