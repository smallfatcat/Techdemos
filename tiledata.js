const LAND___ = 0;
const ROAD___ = 1;
const COAST_W = 2;
const COAST_S = 3;
const WATER__ = 4;
const COAST_E = 5;
const COAST_N = 6;
const DUALCAR = 7;
const RIVER__ = 8;

const tileData = [
    { edges: [LAND___, LAND___, LAND___, LAND___,], icon: "tile1", probability: 100, name: "grass" },
    { edges: [ROAD___, ROAD___, LAND___, LAND___,], icon: "tile2", probability: 100, name: "road_ne" },
    { edges: [LAND___, ROAD___, ROAD___, LAND___,], icon: "tile3", probability: 100, name: "road_es" },
    { edges: [LAND___, LAND___, ROAD___, ROAD___,], icon: "tile4", probability: 100, name: "road_sw" },
    { edges: [ROAD___, LAND___, ROAD___, LAND___,], icon: "tile5", probability: 100, name: "road_ns" },
    { edges: [LAND___, LAND___, LAND___, LAND___,], icon: "tile6", probability: 100, name: "trees" },
    { edges: [ROAD___, ROAD___, LAND___, ROAD___,], icon: "tile7", probability: 100, name: "road_new" },
    { edges: [ROAD___, LAND___, ROAD___, ROAD___,], icon: "tile8", probability: 100, name: "road_nsw" },
    { edges: [ROAD___, ROAD___, ROAD___, LAND___,], icon: "tile9", probability: 100, name: "road_nes" },
    { edges: [LAND___, ROAD___, LAND___, ROAD___,], icon: "tile10", probability: 100, name: "road_ew" },
    { edges: [LAND___, ROAD___, ROAD___, ROAD___,], icon: "tile11", probability: 100, name: "road_esw" },
    { edges: [ROAD___, LAND___, LAND___, ROAD___,], icon: "tile12", probability: 100, name: "road_nw" },
    { edges: [ROAD___, ROAD___, ROAD___, ROAD___,], icon: "tile13", probability: 500, name: "road_nesw" },
    { edges: [LAND___, ROAD___, LAND___, ROAD___,], icon: "tile14", probability: 100, name: "road_ew_house" },
    { edges: [ROAD___, LAND___, ROAD___, LAND___,], icon: "tile15", probability: 100, name: "road_ns_house" },
    { edges: [LAND___, LAND___, LAND___, ROAD___,], icon: "tile16", probability: 1, name: "road_w"},
    { edges: [COAST_W, WATER__, COAST_W, LAND___,], icon: "tile17", probability: 10, name: "coast_w" },
    { edges: [COAST_W, COAST_S, LAND___, LAND___,], icon: "tile18", probability: 100, name: "coast_sw" },
    { edges: [WATER__, COAST_S, LAND___, COAST_S,], icon: "tile19", probability: 10, name: "coast_s" },
    { edges: [COAST_E, LAND___, LAND___, COAST_N,], icon: "tile20", probability: 100, name: "coast_es" },
    { edges: [LAND___, LAND___, COAST_E, COAST_N,], icon: "tile21", probability: 100, name: "coast_ne" },
    { edges: [LAND___, COAST_N, COAST_W, LAND___,], icon: "tile22", probability: 100, name: "coast_nw" },
    { edges: [COAST_E, LAND___, COAST_E, WATER__,], icon: "tile23", probability: 10, name: "coast_e" },
    { edges: [LAND___, COAST_N, WATER__, COAST_N,], icon: "tile24", probability: 10, name: "coast_n" },
    { edges: [COAST_E, COAST_N, WATER__, WATER__,], icon: "tile25", probability: 10, name: "coast_ne_c" },
    { edges: [COAST_W, WATER__, WATER__, COAST_N,], icon: "tile26", probability: 10, name: "coast_nw_c" },
    { edges: [WATER__, COAST_S, COAST_E, WATER__,], icon: "tile27", probability: 10, name: "coast_se_c" },
    { edges: [WATER__, WATER__, COAST_W, COAST_S,], icon: "tile28", probability: 10, name: "coast_sw" },
    { edges: [WATER__, WATER__, WATER__, WATER__,], icon: "tile29", probability: 1, name: "sea" },
    { edges: [ROAD___, LAND___, LAND___, LAND___,], icon: "tile30", probability: 1, name: "road_n"},
    { edges: [LAND___, ROAD___, LAND___, LAND___,], icon: "tile31", probability: 1, name: "road_e"},
    { edges: [LAND___, LAND___, ROAD___, LAND___,], icon: "tile32", probability: 1, name: "road_s"},
    { edges: [ROAD___, LAND___, ROAD___, LAND___,], icon: "tile33", probability: 100, name: "road_ns_g" },
    { edges: [LAND___, ROAD___, LAND___, ROAD___,], icon: "tile34", probability: 100, name: "road_ew_g" },
    { edges: [LAND___, DUALCAR, LAND___, ROAD___,], icon: "tile35", probability: 100, name: "dual_e_w" },
    { edges: [LAND___, ROAD___, LAND___, DUALCAR,], icon: "tile36", probability: 100, name: "dual_w_e" },
    { edges: [ROAD___, LAND___, DUALCAR, LAND___,], icon: "tile37", probability: 100, name: "dual_s_n" },
    { edges: [DUALCAR, LAND___, ROAD___, LAND___,], icon: "tile38", probability: 100, name: "dual_n_s" },
    { edges: [LAND___, DUALCAR, LAND___, DUALCAR,], icon: "tile39", probability: 200, name: "dual_ew" },
    { edges: [DUALCAR, LAND___, DUALCAR, LAND___,], icon: "tile40", probability: 200, name: "dual_ns" },
    { edges: [LAND___, RIVER__, LAND___, RIVER__,], icon: "tile41", probability: 1, name: "river_ew" },
    { edges: [LAND___, LAND___, RIVER__, RIVER__,], icon: "tile42", probability: 1, name: "river_sw" },
    { edges: [RIVER__, LAND___, LAND___, RIVER__,], icon: "tile43", probability: 1, name: "river_nw" },
    { edges: [RIVER__, RIVER__, LAND___, LAND___,], icon: "tile44", probability: 1, name: "river_ne" },
    { edges: [LAND___, RIVER__, RIVER__, LAND___,], icon: "tile45", probability: 1, name: "river_es" },
    { edges: [RIVER__, LAND___, RIVER__, LAND___,], icon: "tile46", probability: 1, name: "river_ns" },
    { edges: [LAND___, LAND___, LAND___, RIVER__,], icon: "tile47", probability: 10, name: "river_w" },
    { edges: [RIVER__, LAND___, LAND___, LAND___,], icon: "tile48", probability: 10, name: "river_n" },
    { edges: [LAND___, RIVER__, LAND___, LAND___,], icon: "tile49", probability: 10, name: "river_e" },
    { edges: [LAND___, LAND___, RIVER__, LAND___,], icon: "tile50", probability: 10, name: "river_s" },
    { edges: [ROAD___, RIVER__, ROAD___, RIVER__,], icon: "tile51", probability: 1, name: "bridge_ns" },
    { edges: [RIVER__, ROAD___, RIVER__, ROAD___,], icon: "tile52", probability: 1, name: "bridge_ew" },
];