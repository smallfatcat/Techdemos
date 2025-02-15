let tileCanvas = undefined;
let tilectx = undefined;
let tilePixels = [];
let paletteCanvas = undefined;
let palettectx = undefined;
let palettePixels = [];
const gSize = 10;
const tSize = 20;

paletteSelected = 0;


const colors = [
    "darkblue",     // 0
    "blue",         // 1
    "yellow",       // 2
    "green",        // 3
    "darkgreen",    // 4    
    "orange",       // 5
    "brown",        // 6
    "white",        // 7
];

window.onload = (event) => {
    tileCanvas = document.getElementById("tileCanvas");
    tilectx = tileCanvas.getContext("2d");
    tileCanvas.width = gSize * tSize;
    tileCanvas.height = gSize * tSize;

    paletteCanvas = document.getElementById("paletteCanvas");
    palettectx = paletteCanvas.getContext("2d");
    paletteCanvas.width = colors.length * tSize;
    paletteCanvas.height = tSize;
    initGrid();
    draw(tilectx, tilePixels, gSize, gSize);
    draw(palettectx, palettePixels, 10, 1);

    tileCanvas.addEventListener('mousedown', function (event) {
        console.log(event.offsetX, event.offsetY);
        if(event.offsetX < tileCanvas.width && event.offsetY < tileCanvas.height){
            tilePixels[coordToIndex([Math.floor(event.offsetX / tSize), Math.floor(event.offsetY / tSize)])] = paletteSelected;
            draw(tilectx, tilePixels, gSize);
        }
    });
    paletteCanvas.addEventListener('mousedown', function (event) {
        console.log(event.offsetX, event.offsetY);
        if(event.offsetX < paletteCanvas.width && event.offsetY < paletteCanvas.height){
            console.log(coordToIndex([Math.floor(event.offsetX / tSize), Math.floor(event.offsetY / tSize)]));
            paletteSelected = coordToIndex([Math.floor(event.offsetX / tSize), Math.floor(event.offsetY / tSize)]);
            // palettePixels[coordToIndex([Math.floor(event.offsetX / tSize), Math.floor(event.offsetY / tSize)])] = 1;
            draw(palettectx, palettePixels, gSize);
        }
    });
}

function initGrid() {
    for (let i = 0; i < gSize * gSize; i++) {
        tilePixels.push(3);
    }
    for (let i = 0; i < 10; i++) {
        palettePixels.push(i);
    }
}

function draw(ctx, pixels, width) {
    for (let i in pixels) {
        ctx.lineWidth = 2;
        ctx.fillStyle = colors[pixels[i]];
        let coord = indexToCoord(i, width);
        ctx.fillRect(coord[0] * tSize, coord[1] * tSize, tSize, tSize);
    }

    // ctx.strokeStyle = 'gray';
    // ctx.strokeRect(cell.x, cell.y, cell.width, cell.height);
    // ctx.font = "10px Arial";
    // ctx.fillStyle = "white";
    // ctx.fillText(cell.constraints.length, cell.x + cellWidth / 2, cell.y + cellHeight / 2);
}

function indexToCoord(i, width) {
    let x = i % width;
    let y = Math.floor(i / width);
    return [x, y];
}

function coordToIndex(coord) {
    let i = coord[0] + coord[1] * gSize;
    return i;
}