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
        let tileID = "car_" + this.color + "" + this.currentDirection;
        const image = document.getElementById(tileID);
        ctx.drawImage(image, x + (laneOffsetX / gameState.zoom), y + (laneOffsetY / gameState.zoom), (width) / gameState.zoom, (height) / gameState.zoom);
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
        // TODO: implement correct entropy calculation
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

    constrain(possiblesSet) {
        let res = [];
        this.candidates.forEach((candidate) => {
            if (possiblesSet.has(candidate)) {
                res.push(candidate);
            }
        });
        if (res.length != this.candidates.length && res.length > 0) {
            this.candidates = res;
            return true;
        }
        return false;
    }

    collapse() {
        let probabilities = [];
        let totalProbability = 0;
        for (let i = 0; i < this.candidates.length; i++) {
            let candidate = this.candidates[i];
            let probability = gameState.gBaseTiles[candidate].probability;
            probabilities.push(probability);
            totalProbability += probability;
        }
        console.assert(probabilities.length == this.candidates.length);

        let r = Math.floor(Math.random() * totalProbability);
        let baseValue = 0;
        let collapsedIndex = 0;
        for (let i = 0; i < probabilities.length; i++) {
            let probability = probabilities[i];
            if (r < probability + baseValue) {
                collapsedIndex = i;
                break;
            }
            baseValue += probability;
        }
        let collapsedCandidate = this.candidates[collapsedIndex];
        this.candidates = [collapsedCandidate];
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
        this.probability = parameters.probability ? parameters.probability : "";
        this.name = parameters.name ? parameters.name : "";
    }

    draw(ctx, x, y) {
        // TODO: move <img> element out of DOM into array
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
