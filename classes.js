class idleState {
    constructor() {
        this.idleStart = 0;
        this.delay = 1000;
        this.noDelay = false;
        this.currentDirection = 0;
    }

    enter(grid, bot) {
        this.idleStart = Date.now();
        this.delay = Math.floor(Math.random() * 1000);
        // console.log("entered Idle State")
        bot.x = bot.nextX;
        bot.y = bot.nextY;
        bot.offsetX = bot.nextX;
        bot.offsetY = bot.nextY;
        bot.nextDistance = 0.0;
        this.setNextPosition(grid, bot);
    }

    exit(grid, bot) {
        bot.currentDirection = this.currentDirection;
        // console.log("exited Idle State")
    }

    move(grid, bot) {
        let timeSinceIdleStarted = Date.now() - this.idleStart;
        if (timeSinceIdleStarted > this.delay || this.noDelay) {
            let nextTileType = grid[bot.nextID].getbaseID();
            // Check if bridge
            if (nextTileType == 50 || nextTileType == 51) {
                bot.speed = 0.005;
            }
            // Check if dual carriageway
            else if (bot.nextEdgeType == 5) {
                bot.speed = 0.02;
            }
            // Default speed
            else {
                bot.speed = 0.01;
            }
            return new movingState();
        }
    }

    setNextPosition(grid, bot) {
        let x = bot.x;
        let y = bot.y;

        let width = Math.sqrt(grid.length);
        let gridIndex = x + y * width;
        let currentTile = grid[gridIndex];
        let edges = currentTile.edges;

        let roadEdges = [];
        for (let d = 0; d < 4; d++) {
            // check if edges are roads
            if (edges[d] == 1 || edges[d] == 5) {
                roadEdges.push(d);
            }
        }

        if (roadEdges.length == 0) {
            return;
        }

        let r = Math.floor(Math.random() * roadEdges.length);
        let newDirection = roadEdges[r];

        while ((currentTile.neighbours[newDirection] == undefined) || ((((newDirection + 2) % 4) == bot.currentDirection) && roadEdges.length > 1)) {
            r = (r + 1) % roadEdges.length;
            newDirection = roadEdges[r];
        }

        if (bot.currentDirection == newDirection || roadEdges.length == 2) {
            this.noDelay = true;
        }

        this.currentDirection = newDirection;
        bot.nextID = currentTile.neighbours[newDirection];
        bot.nextEdgeType = edges[newDirection];
        bot.nextX = grid[bot.nextID].x;
        bot.nextY = grid[bot.nextID].y;
    }
}

class movingState {
    constructor() {

    }

    enter(grid, bot) {
        // console.log("entered Moving State")
    }

    exit(grid, bot) {
        // console.log("exited Moving State")
    }

    move(grid, bot) {
        bot.nextDistance += bot.speed;
        bot.offsetX = bot.x + ((bot.nextX - bot.x) * bot.nextDistance);
        bot.offsetY = bot.y + ((bot.nextY - bot.y) * bot.nextDistance);
        if (bot.nextDistance > 1) {
            return new idleState();
        }
    }
}

class Bot {
    constructor(parameters) {
        this.x = parameters.x != undefined ? parameters.x : 0;
        this.y = parameters.y != undefined ? parameters.y : 0;
        this.activeState = new idleState();
        this.nextX = parameters.x ? parameters.x : 0;
        this.nextY = parameters.y ? parameters.y : 0;
        this.nextDistance = 0.0;
        this.offsetX = 0.0;
        this.offsetY = 0.0;
        this.speed = 0.01;
        this.color = parameters.color ? parameters.color : "white";
        this.currentDirection = 0;
        this.nextID = 0;
        this.nextEdgeType = 0;
    }

    changeState(newState, grid) {
        this.activeState.exit(grid, this);
        this.activeState = newState;
        this.activeState.enter(grid, this);
    }

    move(grid) {
        this.newState = this.activeState.move(grid, this);
        if (this.newState) {
            this.changeState(this.newState, grid);
        }
    }

    draw(ctx, x, y) {
        ctx.lineWidth = 2;
        ctx.fillStyle = this.color;
        // ctx.globalAlpha = 0.1;
        let laneOffsetX = 0;
        let laneOffsetY = 0;
        let width = 5;
        let height = 11;
        if (this.currentDirection == 0) {
            laneOffsetX = -8;
            laneOffsetY = 0;
        }
        if (this.currentDirection == 1) {
            laneOffsetX = 0;
            laneOffsetY = -7;
            width = 11;
            height = 5;
        }
        if (this.currentDirection == 2) {
            laneOffsetX = 2;
            laneOffsetY = 0;
        }
        if (this.currentDirection == 3) {
            laneOffsetX = 0;
            laneOffsetY = 2;
            width = 11;
            height = 5;
        }
        // ctx.fillRect(x, y, (config.tileSize / 4 + laneOffsetX) / zoom, (config.tileSize / 4 + laneOffsetY) / zoom);
        let temp = "car_" + this.color + "" + this.currentDirection;
        const image = document.getElementById(temp);
        ctx.drawImage(image, x + (laneOffsetX / zoom), y + (laneOffsetY / zoom), (width) / zoom, (height) / zoom);
        // ctx.fillRect(x + (laneOffsetX / zoom), y + (laneOffsetY / zoom), (config.tileSize / 4 - 10) / zoom, (config.tileSize / 4 - 10) / zoom);
        ctx.globalAlpha = 1.0;
    }
}

class GridTile {
    constructor(parameters) {
        this.x = parameters.x ? parameters.x : 0;
        this.y = parameters.y ? parameters.y : 0;
        this.candidates = parameters.candidates ? parameters.candidates : [];
        this.neighbours = parameters.neighbours ? parameters.neighbours : [];
        this.neighbourTypes = parameters.neighbourTypes ? parameters.neighbourTypes : [];
        this.edges = parameters.edges ? parameters.edges : [];
        this.id = parameters.id ? parameters.id : 0;
    }

    getEntropy() {
        return this.candidates.length;
    }

    getbaseID() {
        if (this.candidates.length == 1) {
            return this.candidates[0];
        }
        return 0;
    }
    setNeighbourTypes(grid) {
        for (let d = 0; d < 4; d++) {
            let neighbourType = undefined;
            let neighbourID = this.neighbours[d];
            if (neighbourID != undefined) {
                neighbourType = grid[neighbourID].getbaseID();
            }
            this.neighbourTypes.push(neighbourType);
        }
    }
    setEdges(baseTiles) {
        this.edges = baseTiles[this.getbaseID()].edges.slice();
    }
}

class BaseTile {
    constructor(parameters) {
        this.edges = parameters.edges ? parameters.edges : [];
        this.size = parameters.size ? parameters.size : 20;
        this.color = parameters.color ? parameters.color : "green";
        this.possible = parameters.possible ? parameters.possible : [[], [], [], []];
        this.id = parameters.id ? parameters.id : 0;
        this.icon = parameters.icon ? parameters.icon : "";
    }

    draw(ctx, x, y) {
        const image = document.getElementById(this.icon);
        ctx.drawImage(image, x, y, config.tileSize, config.tileSize)
    }

    generatePossibles(tiles) {
        tiles.forEach(candidate => {
            if (this.edges[EDGE_N] == candidate.edges[EDGE_S]) {
                this.possible[EDGE_N].push(candidate.id);
            }
            if (this.edges[EDGE_E] == candidate.edges[EDGE_W]) {
                this.possible[EDGE_E].push(candidate.id);
            }
            if (this.edges[EDGE_S] == candidate.edges[EDGE_N]) {
                this.possible[EDGE_S].push(candidate.id);
            }
            if (this.edges[EDGE_W] == candidate.edges[EDGE_E]) {
                this.possible[EDGE_W].push(candidate.id);
            }
        });
    }
}

// const LAND___ = 0;
// const ROAD___ = 1;
// const COAST_E = 2;
// const COAST_N = 2;
// const WATER__ = 3;
// const COAST_W = 4;
// const COAST_S = 4;

// const tileData = [
//     { edges: [0, 0, 0, 0], icon: "tile1"}, // 1
//     { edges: [1, 1, 0, 0], icon: "tile2"}, // 2
//     { edges: [0, 1, 1, 0], icon: "tile3"}, // 3
//     { edges: [0, 0, 1, 1], icon: "tile4"}, // 4
//     { edges: [1, 0, 1, 0], icon: "tile5"}, // 5
//     { edges: [0, 0, 0, 0], icon: "tile6"}, // 6
//     { edges: [1, 1, 0, 1], icon: "tile7"}, // 7
//     { edges: [1, 0, 1, 1], icon: "tile8"}, // 8
//     { edges: [1, 1, 1, 0], icon: "tile9"}, // 9
//     { edges: [0, 1, 0, 1], icon: "tile10"}, // 10
//     { edges: [0, 1, 1, 1], icon: "tile11"}, // 11
//     { edges: [1, 0, 0, 1], icon: "tile12"}, // 12
//     { edges: [1, 1, 1, 1], icon: "tile13"}, // 13
//     { edges: [0, 1, 0, 1], icon: "tile14"}, // 14
//     { edges: [1, 0, 1, 0], icon: "tile15"}, // 15
//     // { edges: [0, 0, 0, 1], icon: "tile16"}, // 16
//     { edges: [2, 3, 2, 0], icon: "tile17"}, // 17
//     { edges: [2, 2, 0, 0], icon: "tile18"}, // 18
//     { edges: [3, 2, 0, 2], icon: "tile19"}, // 19
//     { edges: [4, 0, 0, 4], icon: "tile20"}, // 20
//     { edges: [0, 0, 4, 4], icon: "tile21"}, // 21
//     { edges: [0, 4, 2, 0], icon: "tile22"}, // 22
//     { edges: [4, 0, 4, 3], icon: "tile23"}, // 23
//     { edges: [0, 4, 3, 4], icon: "tile24"}, // 24
//     { edges: [4, 4, 3, 3], icon: "tile25"}, // 25
//     { edges: [2, 3, 3, 4], icon: "tile26"}, // 26
//     { edges: [3, 2, 4, 3], icon: "tile27"}, // 27
//     { edges: [3, 3, 2, 2], icon: "tile28"}, // 28
//     { edges: [3, 3, 3, 3], icon: "tile29"}, // 29
//     // { edges: [1, 0, 0, 0], icon: "tile30"}, // 30
//     // { edges: [0, 1, 0, 0], icon: "tile31"}, // 31
//     // { edges: [0, 0, 1, 0], icon: "tile32"}, // 32
//     { edges: [1, 0, 1, 0], icon: "tile33"}, // 33
//     { edges: [0, 1, 0, 1], icon: "tile34"}, // 34
//     { edges: [0, 5, 0, 1], icon: "tile35"}, // 35
//     { edges: [0, 1, 0, 5], icon: "tile36"}, // 36
//     { edges: [1, 0, 5, 0], icon: "tile37"}, // 37
//     { edges: [5, 0, 1, 0], icon: "tile38"}, // 38
//     { edges: [0, 5, 0, 5], icon: "tile39"}, // 39
//     { edges: [5, 0, 5, 0], icon: "tile40"}, // 40
//     { edges: [0, 6, 0, 6], icon: "tile41"}, // 41
//     { edges: [0, 0, 6, 6], icon: "tile42"}, // 42
//     { edges: [6, 0, 0, 6], icon: "tile43"}, // 43
//     { edges: [6, 6, 0, 0], icon: "tile44"}, // 44
//     { edges: [0, 6, 6, 0], icon: "tile45"}, // 45
//     { edges: [6, 0, 6, 0], icon: "tile46"}, // 46
//     { edges: [0, 0, 0, 6], icon: "tile47"}, // 47
//     { edges: [6, 0, 0, 0], icon: "tile48"}, // 48
//     { edges: [0, 6, 0, 0], icon: "tile49"}, // 49
//     { edges: [0, 0, 6, 0], icon: "tile50"}, // 50
//     { edges: [1, 6, 1, 6], icon: "tile51"}, // 51
//     { edges: [6, 1, 6, 1], icon: "tile52"}, // 52
// ];