const LAND___ = 0;
const ROAD___ = 1;
const COAST_W = 2;
const COAST_S = 2;
const WATER__ = 3;
const COAST_E = 4;
const COAST_N = 4;
const DUALCAR = 5;
const BRIDGE_ = 6;

const tileData = [
    { edges: [LAND___, LAND___, LAND___, LAND___,], icon: "tile1"}, // 1
    { edges: [ROAD___, ROAD___, LAND___, LAND___,], icon: "tile2"}, // 2
    { edges: [LAND___, ROAD___, ROAD___, LAND___,], icon: "tile3"}, // 3
    { edges: [LAND___, LAND___, ROAD___, ROAD___,], icon: "tile4"}, // 4
    { edges: [ROAD___, LAND___, ROAD___, LAND___,], icon: "tile5"}, // 5
    { edges: [LAND___, LAND___, LAND___, LAND___,], icon: "tile6"}, // 6
    { edges: [ROAD___, ROAD___, LAND___, ROAD___,], icon: "tile7"}, // 7
    { edges: [ROAD___, LAND___, ROAD___, ROAD___,], icon: "tile8"}, // 8
    { edges: [ROAD___, ROAD___, ROAD___, LAND___,], icon: "tile9"}, // 9
    { edges: [LAND___, ROAD___, LAND___, ROAD___,], icon: "tile10"}, // 10
    { edges: [LAND___, ROAD___, ROAD___, ROAD___,], icon: "tile11"}, // 11
    { edges: [ROAD___, LAND___, LAND___, ROAD___,], icon: "tile12"}, // 12
    { edges: [ROAD___, ROAD___, ROAD___, ROAD___,], icon: "tile13"}, // 13
    { edges: [LAND___, ROAD___, LAND___, ROAD___,], icon: "tile14"}, // 14
    { edges: [ROAD___, LAND___, ROAD___, LAND___,], icon: "tile15"}, // 15
    // { edges: [LAND___, LAND___, LAND___, ROAD___,], icon: "tile16"}, // 16
    { edges: [COAST_W, WATER__, COAST_W, LAND___,], icon: "tile17"}, // 17
    { edges: [COAST_W, COAST_S, LAND___, LAND___,], icon: "tile18"}, // 18
    { edges: [WATER__, COAST_S, LAND___, COAST_S,], icon: "tile19"}, // 19
    { edges: [COAST_E, LAND___, LAND___, COAST_N,], icon: "tile20"}, // 20
    { edges: [LAND___, LAND___, COAST_E, COAST_N,], icon: "tile21"}, // 21
    { edges: [LAND___, COAST_N, COAST_W, LAND___,], icon: "tile22"}, // 22
    { edges: [COAST_E, LAND___, COAST_E, WATER__,], icon: "tile23"}, // 23
    { edges: [LAND___, COAST_N, WATER__, COAST_N,], icon: "tile24"}, // 24
    { edges: [COAST_E, COAST_N, WATER__, WATER__,], icon: "tile25"}, // 25
    { edges: [COAST_W, WATER__, WATER__, COAST_N,], icon: "tile26"}, // 26
    { edges: [WATER__, COAST_S, COAST_E, WATER__,], icon: "tile27"}, // 27
    { edges: [WATER__, WATER__, COAST_W, COAST_S,], icon: "tile28"}, // 28
    { edges: [WATER__, WATER__, WATER__, WATER__,], icon: "tile29"}, // 29
    // { edges: [ROAD___, LAND___, LAND___, LAND___,], icon: "tile30"}, // 30
    // { edges: [LAND___, ROAD___, LAND___, LAND___,], icon: "tile31"}, // 31
    // { edges: [LAND___, LAND___, ROAD___, LAND___,], icon: "tile32"}, // 32
    { edges: [ROAD___, LAND___, ROAD___, LAND___,], icon: "tile33"}, // 33
    { edges: [LAND___, ROAD___, LAND___, ROAD___,], icon: "tile34"}, // 34
    { edges: [LAND___, DUALCAR, LAND___, ROAD___,], icon: "tile35"}, // 35
    { edges: [LAND___, ROAD___, LAND___, DUALCAR,], icon: "tile36"}, // 36
    { edges: [ROAD___, LAND___, DUALCAR, LAND___,], icon: "tile37"}, // 37
    { edges: [DUALCAR, LAND___, ROAD___, LAND___,], icon: "tile38"}, // 38
    { edges: [LAND___, DUALCAR, LAND___, DUALCAR,], icon: "tile39"}, // 39
    { edges: [DUALCAR, LAND___, DUALCAR, LAND___,], icon: "tile40"}, // 40
    { edges: [LAND___, BRIDGE_, LAND___, BRIDGE_,], icon: "tile41"}, // 41
    { edges: [LAND___, LAND___, BRIDGE_, BRIDGE_,], icon: "tile42"}, // 42
    { edges: [BRIDGE_, LAND___, LAND___, BRIDGE_,], icon: "tile43"}, // 43
    { edges: [BRIDGE_, BRIDGE_, LAND___, LAND___,], icon: "tile44"}, // 44
    { edges: [LAND___, BRIDGE_, BRIDGE_, LAND___,], icon: "tile45"}, // 45
    { edges: [BRIDGE_, LAND___, BRIDGE_, LAND___,], icon: "tile46"}, // 46
    { edges: [LAND___, LAND___, LAND___, BRIDGE_,], icon: "tile47"}, // 47
    { edges: [BRIDGE_, LAND___, LAND___, LAND___,], icon: "tile48"}, // 48
    { edges: [LAND___, BRIDGE_, LAND___, LAND___,], icon: "tile49"}, // 49
    { edges: [LAND___, LAND___, BRIDGE_, LAND___,], icon: "tile50"}, // 50
    { edges: [ROAD___, BRIDGE_, ROAD___, BRIDGE_,], icon: "tile51"}, // 51
    { edges: [BRIDGE_, ROAD___, BRIDGE_, ROAD___,], icon: "tile52"}, // 52
];