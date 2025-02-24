const LAND___ = 0;
const ROAD___ = 1;
const COAST_W = 2;
const COAST_S = 2;
const WATER__ = 3;
const COAST_E = 4;
const COAST_N = 4;
const DUALCAR = 5;
const RIVER__ = 6;

const tileData = [
    { edges: [LAND___, LAND___, LAND___, LAND___,], icon: "tile1", probability: 100, name: "grass" }, // 1
    { edges: [ROAD___, ROAD___, LAND___, LAND___,], icon: "tile2", probability: 100, name: "road_ne" }, // 2
    { edges: [LAND___, ROAD___, ROAD___, LAND___,], icon: "tile3", probability: 100, name: "road_es" }, // 3
    { edges: [LAND___, LAND___, ROAD___, ROAD___,], icon: "tile4", probability: 100, name: "road_sw" }, // 4
    { edges: [ROAD___, LAND___, ROAD___, LAND___,], icon: "tile5", probability: 100, name: "road_ns" }, // 5
    { edges: [LAND___, LAND___, LAND___, LAND___,], icon: "tile6", probability: 100, name: "trees" }, // 6
    { edges: [ROAD___, ROAD___, LAND___, ROAD___,], icon: "tile7", probability: 100, name: "road_new" }, // 7
    { edges: [ROAD___, LAND___, ROAD___, ROAD___,], icon: "tile8", probability: 100, name: "road_nsw" }, // 8
    { edges: [ROAD___, ROAD___, ROAD___, LAND___,], icon: "tile9", probability: 100, name: "road_nes" }, // 9
    { edges: [LAND___, ROAD___, LAND___, ROAD___,], icon: "tile10", probability: 100, name: "road_ew" }, // 10
    { edges: [LAND___, ROAD___, ROAD___, ROAD___,], icon: "tile11", probability: 100, name: "road_esw" }, // 11
    { edges: [ROAD___, LAND___, LAND___, ROAD___,], icon: "tile12", probability: 100, name: "road_nw" }, // 12
    { edges: [ROAD___, ROAD___, ROAD___, ROAD___,], icon: "tile13", probability: 500, name: "road_nesw" }, // 13
    { edges: [LAND___, ROAD___, LAND___, ROAD___,], icon: "tile14", probability: 100, name: "road_ew_house" }, // 14
    { edges: [ROAD___, LAND___, ROAD___, LAND___,], icon: "tile15", probability: 100, name: "road_ns_house" }, // 15
    { edges: [LAND___, LAND___, LAND___, ROAD___,], icon: "tile16", probability: 1, name: "road_w"}, // 16
    { edges: [COAST_W, WATER__, COAST_W, LAND___,], icon: "tile17", probability: 10, name: "coast_w" }, // 17
    { edges: [COAST_W, COAST_S, LAND___, LAND___,], icon: "tile18", probability: 100, name: "coast_sw" }, // 18
    { edges: [WATER__, COAST_S, LAND___, COAST_S,], icon: "tile19", probability: 10, name: "coast_s" }, // 19
    { edges: [COAST_E, LAND___, LAND___, COAST_N,], icon: "tile20", probability: 100, name: "coast_es" }, // 20
    { edges: [LAND___, LAND___, COAST_E, COAST_N,], icon: "tile21", probability: 100, name: "coast_ne" }, // 21
    { edges: [LAND___, COAST_N, COAST_W, LAND___,], icon: "tile22", probability: 100, name: "coast_nw" }, // 22
    { edges: [COAST_E, LAND___, COAST_E, WATER__,], icon: "tile23", probability: 10, name: "coast_e" }, // 23
    { edges: [LAND___, COAST_N, WATER__, COAST_N,], icon: "tile24", probability: 10, name: "coast_n" }, // 24
    { edges: [COAST_E, COAST_N, WATER__, WATER__,], icon: "tile25", probability: 10, name: "coast_ne_c" }, // 25
    { edges: [COAST_W, WATER__, WATER__, COAST_N,], icon: "tile26", probability: 10, name: "coast_nw_c" }, // 26
    { edges: [WATER__, COAST_S, COAST_E, WATER__,], icon: "tile27", probability: 10, name: "coast_se_c" }, // 27
    { edges: [WATER__, WATER__, COAST_W, COAST_S,], icon: "tile28", probability: 10, name: "coast_sw" }, // 28
    { edges: [WATER__, WATER__, WATER__, WATER__,], icon: "tile29", probability: 1, name: "sea" }, // 29
    { edges: [ROAD___, LAND___, LAND___, LAND___,], icon: "tile30", probability: 1, name: "road_n"}, // 30
    { edges: [LAND___, ROAD___, LAND___, LAND___,], icon: "tile31", probability: 1, name: "road_e"}, // 31
    { edges: [LAND___, LAND___, ROAD___, LAND___,], icon: "tile32", probability: 1, name: "road_s"}, // 32
    { edges: [ROAD___, LAND___, ROAD___, LAND___,], icon: "tile33", probability: 100, name: "road_ns_g" }, // 33
    { edges: [LAND___, ROAD___, LAND___, ROAD___,], icon: "tile34", probability: 100, name: "road_ew_g" }, // 34
    { edges: [LAND___, DUALCAR, LAND___, ROAD___,], icon: "tile35", probability: 100, name: "dual_e_w" }, // 35
    { edges: [LAND___, ROAD___, LAND___, DUALCAR,], icon: "tile36", probability: 100, name: "dual_w_e" }, // 36
    { edges: [ROAD___, LAND___, DUALCAR, LAND___,], icon: "tile37", probability: 100, name: "dual_s_n" }, // 37
    { edges: [DUALCAR, LAND___, ROAD___, LAND___,], icon: "tile38", probability: 100, name: "dual_n_s" }, // 38
    { edges: [LAND___, DUALCAR, LAND___, DUALCAR,], icon: "tile39", probability: 200, name: "dual_ew" }, // 39
    { edges: [DUALCAR, LAND___, DUALCAR, LAND___,], icon: "tile40", probability: 200, name: "dual_ns" }, // 40
    { edges: [LAND___, RIVER__, LAND___, RIVER__,], icon: "tile41", probability: 1, name: "river_ew" }, // 41
    { edges: [LAND___, LAND___, RIVER__, RIVER__,], icon: "tile42", probability: 1, name: "river_sw" }, // 42
    { edges: [RIVER__, LAND___, LAND___, RIVER__,], icon: "tile43", probability: 1, name: "river_nw" }, // 43
    { edges: [RIVER__, RIVER__, LAND___, LAND___,], icon: "tile44", probability: 1, name: "river_ne" }, // 44
    { edges: [LAND___, RIVER__, RIVER__, LAND___,], icon: "tile45", probability: 1, name: "river_es" }, // 45
    { edges: [RIVER__, LAND___, RIVER__, LAND___,], icon: "tile46", probability: 1, name: "river_ns" }, // 46
    { edges: [LAND___, LAND___, LAND___, RIVER__,], icon: "tile47", probability: 10, name: "river_w" }, // 47
    { edges: [RIVER__, LAND___, LAND___, LAND___,], icon: "tile48", probability: 10, name: "river_n" }, // 48
    { edges: [LAND___, RIVER__, LAND___, LAND___,], icon: "tile49", probability: 10, name: "river_e" }, // 49
    { edges: [LAND___, LAND___, RIVER__, LAND___,], icon: "tile50", probability: 10, name: "river_s" }, // 50
    { edges: [ROAD___, RIVER__, ROAD___, RIVER__,], icon: "tile51", probability: 1, name: "bridge_ns" }, // 51
    { edges: [RIVER__, ROAD___, RIVER__, ROAD___,], icon: "tile52", probability: 1, name: "bridge_ew" }, // 52
];