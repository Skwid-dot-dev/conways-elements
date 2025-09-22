const elementsData = {
    "H": {
        "symbol": "H",
        "atomic_number": 1,
        "phase_at_stp": "Gas",
        "valence": 1,
        "common_oxidation_states": [1, -1],
        "electronegativity": 2.20,
        "reactivity_class": "Diatomic Nonmetal",
        "flammability": true,
        "solubility": false,
        "density_proxy": 0.08988,
        "color": "#FFFFFF"
    },
    "He": {
        "symbol": "He",
        "atomic_number": 2,
        "phase_at_stp": "Gas",
        "valence": 0,
        "common_oxidation_states": [],
        "electronegativity": null,
        "reactivity_class": "Noble Gas",
        "flammability": false,
        "solubility": false,
        "density_proxy": 0.1786,
        "color": "#D9FFFF"
    },
    "Li": {
        "symbol": "Li",
        "atomic_number": 3,
        "phase_at_stp": "Solid",
        "valence": 1,
        "common_oxidation_states": [1],
        "electronegativity": 0.98,
        "reactivity_class": "Alkali Metal",
        "flammability": true,
        "solubility": true,
        "density_proxy": 0.534,
        "color": "#CC80FF"
    },
    "Be": {
        "symbol": "Be",
        "atomic_number": 4,
        "phase_at_stp": "Solid",
        "valence": 2,
        "common_oxidation_states": [2],
        "electronegativity": 1.57,
        "reactivity_class": "Alkaline Earth Metal",
        "flammability": false,
        "solubility": false,
        "density_proxy": 1.85,
        "color": "#C2FF00"
    },
    "B": {
        "symbol": "B",
        "atomic_number": 5,
        "phase_at_stp": "Solid",
        "valence": 3,
        "common_oxidation_states": [3],
        "electronegativity": 2.04,
        "reactivity_class": "Metalloid",
        "flammability": false,
        "solubility": false,
        "density_proxy": 2.34,
        "color": "#FFB5B5"
    },
    "C": {
        "symbol": "C",
        "atomic_number": 6,
        "phase_at_stp": "Solid",
        "valence": 4,
        "common_oxidation_states": [4, 2, -4],
        "electronegativity": 2.55,
        "reactivity_class": "Polyatomic Nonmetal",
        "flammability": true,
        "solubility": false,
        "density_proxy": 2.267,
        "color": "#909090"
    },
    "N": {
        "symbol": "N",
        "atomic_number": 7,
        "phase_at_stp": "Gas",
        "valence": 3,
        "common_oxidation_states": [5, 4, 3, 2, 1, -1, -2, -3],
        "electronegativity": 3.04,
        "reactivity_class": "Diatomic Nonmetal",
        "flammability": false,
        "solubility": false,
        "density_proxy": 1.251,
        "color": "#3050F8"
    },
    "O": {
        "symbol": "O",
        "atomic_number": 8,
        "phase_at_stp": "Gas",
        "valence": 2,
        "common_oxidation_states": [-2],
        "electronegativity": 3.44,
        "reactivity_class": "Diatomic Nonmetal",
        "flammability": false,
        "solubility": false,
        "density_proxy": 1.429,
        "color": "#FF0D0D"
    },
    "F": {
        "symbol": "F",
        "atomic_number": 9,
        "phase_at_stp": "Gas",
        "valence": 1,
        "common_oxidation_states": [-1],
        "electronegativity": 3.98,
        "reactivity_class": "Halogen",
        "flammability": false,
        "solubility": true,
        "density_proxy": 1.696,
        "color": "#90E050"
    },
    "Ne": {
        "symbol": "Ne",
        "atomic_number": 10,
        "phase_at_stp": "Gas",
        "valence": 0,
        "common_oxidation_states": [],
        "electronegativity": null,
        "reactivity_class": "Noble Gas",
        "flammability": false,
        "solubility": false,
        "density_proxy": 0.9002,
        "color": "#B3E3F5"
    },
    "Na": {
        "symbol": "Na",
        "atomic_number": 11,
        "phase_at_stp": "Solid",
        "valence": 1,
        "common_oxidation_states": [1],
        "electronegativity": 0.93,
        "reactivity_class": "Alkali Metal",
        "flammability": true,
        "solubility": true,
        "density_proxy": 0.971,
        "color": "#AB5CF2"
    },
    "Mg": {
        "symbol": "Mg",
        "atomic_number": 12,
        "phase_at_stp": "Solid",
        "valence": 2,
        "common_oxidation_states": [2],
        "electronegativity": 1.31,
        "reactivity_class": "Alkaline Earth Metal",
        "flammability": true,
        "solubility": false,
        "density_proxy": 1.738,
        "color": "#8AFF00"
    },
    "Al": {
        "symbol": "Al",
        "atomic_number": 13,
        "phase_at_stp": "Solid",
        "valence": 3,
        "common_oxidation_states": [3],
        "electronegativity": 1.61,
        "reactivity_class": "Post-transition Metal",
        "flammability": true,
        "solubility": false,
        "density_proxy": 2.698,
        "color": "#BFA6A6"
    },
    "Si": {
        "symbol": "Si",
        "atomic_number": 14,
        "phase_at_stp": "Solid",
        "valence": 4,
        "common_oxidation_states": [4, 2, -4],
        "electronegativity": 1.90,
        "reactivity_class": "Metalloid",
        "flammability": false,
        "solubility": false,
        "density_proxy": 2.3296,
        "color": "#F0C8A0"
    },
    "P": {
        "symbol": "P",
        "atomic_number": 15,
        "phase_at_stp": "Solid",
        "valence": 3,
        "common_oxidation_states": [5, 3, -3],
        "electronegativity": 2.19,
        "reactivity_class": "Polyatomic Nonmetal",
        "flammability": true,
        "solubility": false,
        "density_proxy": 1.82,
        "color": "#FF8000"
    },
    "S": {
        "symbol": "S",
        "atomic_number": 16,
        "phase_at_stp": "Solid",
        "valence": 2,
        "common_oxidation_states": [6, 4, 2, -2],
        "electronegativity": 2.58,
        "reactivity_class": "Polyatomic Nonmetal",
        "flammability": true,
        "solubility": false,
        "density_proxy": 2.07,
        "color": "#FFFF30"
    },
    "Cl": {
        "symbol": "Cl",
        "atomic_number": 17,
        "phase_at_stp": "Gas",
        "valence": 1,
        "common_oxidation_states": [7, 5, 3, 1, -1],
        "electronegativity": 3.16,
        "reactivity_class": "Halogen",
        "flammability": false,
        "solubility": true,
        "density_proxy": 3.214,
        "color": "#1FF01F"
    },
    "Ar": {
        "symbol": "Ar",
        "atomic_number": 18,
        "phase_at_stp": "Gas",
        "valence": 0,
        "common_oxidation_states": [],
        "electronegativity": null,
        "reactivity_class": "Noble Gas",
        "flammability": false,
        "solubility": false,
        "density_proxy": 1.784,
        "color": "#80D1E3"
    },
    "K": {
        "symbol": "K",
        "atomic_number": 19,
        "phase_at_stp": "Solid",
        "valence": 1,
        "common_oxidation_states": [1],
        "electronegativity": 0.82,
        "reactivity_class": "Alkali Metal",
        "flammability": true,
        "solubility": true,
        "density_proxy": 0.862,
        "color": "#8F40D4"
    },
    "Ca": {
        "symbol": "Ca",
        "atomic_number": 20,
        "phase_at_stp": "Solid",
        "valence": 2,
        "common_oxidation_states": [2],
        "electronegativity": 1.00,
        "reactivity_class": "Alkaline Earth Metal",
        "flammability": true,
        "solubility": true,
        "density_proxy": 1.54,
        "color": "#3DFF00"
    },
    "Sc": {
        "symbol": "Sc",
        "atomic_number": 21,
        "phase_at_stp": "Solid",
        "valence": 3,
        "common_oxidation_states": [3],
        "electronegativity": 1.36,
        "reactivity_class": "Transition Metal",
        "flammability": false,
        "solubility": false,
        "density_proxy": 2.989,
        "color": "#E6E6E6"
    },
    "Ti": {
        "symbol": "Ti",
        "atomic_number": 22,
        "phase_at_stp": "Solid",
        "valence": 4,
        "common_oxidation_states": [4, 3, 2],
        "electronegativity": 1.54,
        "reactivity_class": "Transition Metal",
        "flammability": true,
        "solubility": false,
        "density_proxy": 4.54,
        "color": "#BFC2C7"
    },
    "V": {
        "symbol": "V",
        "atomic_number": 23,
        "phase_at_stp": "Solid",
        "valence": 5,
        "common_oxidation_states": [5, 4, 3, 2],
        "electronegativity": 1.63,
        "reactivity_class": "Transition Metal",
        "flammability": false,
        "solubility": false,
        "density_proxy": 6.11,
        "color": "#A6A6AB"
    },
    "Cr": {
        "symbol": "Cr",
        "atomic_number": 24,
        "phase_at_stp": "Solid",
        "valence": 3,
        "common_oxidation_states": [6, 3, 2],
        "electronegativity": 1.66,
        "reactivity_class": "Transition Metal",
        "flammability": false,
        "solubility": false,
        "density_proxy": 7.15,
        "color": "#8A99C7"
    },
    "Mn": {
        "symbol": "Mn",
        "atomic_number": 25,
        "phase_at_stp": "Solid",
        "valence": 2,
        "common_oxidation_states": [7, 4, 3, 2],
        "electronegativity": 1.55,
        "reactivity_class": "Transition Metal",
        "flammability": false,
        "solubility": false,
        "density_proxy": 7.44,
        "color": "#9C7AC7"
    },
    "Fe": {
        "symbol": "Fe",
        "atomic_number": 26,
        "phase_at_stp": "Solid",
        "valence": 3,
        "common_oxidation_states": [3, 2],
        "electronegativity": 1.83,
        "reactivity_class": "Transition Metal",
        "flammability": false,
        "solubility": false,
        "density_proxy": 7.874,
        "color": "#E06633"
    },
    "Co": {
        "symbol": "Co",
        "atomic_number": 27,
        "phase_at_stp": "Solid",
        "valence": 2,
        "common_oxidation_states": [3, 2],
        "electronegativity": 1.88,
        "reactivity_class": "Transition Metal",
        "flammability": false,
        "solubility": false,
        "density_proxy": 8.86,
        "color": "#F090A0"
    },
    "Ni": {
        "symbol": "Ni",
        "atomic_number": 28,
        "phase_at_stp": "Solid",
        "valence": 2,
        "common_oxidation_states": [3, 2],
        "electronegativity": 1.91,
        "reactivity_class": "Transition Metal",
        "flammability": false,
        "solubility": false,
        "density_proxy": 8.908,
        "color": "#50D050"
    },
    "Cu": {
        "symbol": "Cu",
        "atomic_number": 29,
        "phase_at_stp": "Solid",
        "valence": 2,
        "common_oxidation_states": [2, 1],
        "electronegativity": 1.90,
        "reactivity_class": "Transition Metal",
        "flammability": false,
        "solubility": false,
        "density_proxy": 8.96,
        "color": "#C88033",
        "conductive": true
    },
    "Zn": {
        "symbol": "Zn",
        "atomic_number": 30,
        "phase_at_stp": "Solid",
        "valence": 2,
        "common_oxidation_states": [2],
        "electronegativity": 1.65,
        "reactivity_class": "Transition Metal",
        "flammability": false,
        "solubility": false,
        "density_proxy": 7.134,
        "color": "#7D80B0"
    }
};
const compoundsData = {
    "VACUUM": {
        "symbol": "VACUUM",
        "name": "Vacuum",
        "color": "#000000",
        "phase_at_stp": "Gas",
        "temperature": -273,
        "density_proxy": 0
    },
    "HEAT": {
        "symbol": "HEAT",
        "name": "Heat Source",
        "color": "#FF4500",
        "phase_at_stp": "Solid",
        "temperature": 1000,
        "density_proxy": 10
    },
    "COLD": {
        "symbol": "COLD",
        "name": "Cold Source",
        "color": "#00BFFF",
        "phase_at_stp": "Solid",
        "temperature": -100,
        "density_proxy": 10
    },
    "FIRE": {
        "symbol": "FIRE",
        "name": "Fire",
        "color": "#FF4500",
        "phase_at_stp": "Gas",
        "lifespan": 15,
        "temperature": 800,
        "density_proxy": 0.1
    },
    "H2O": {
        "symbol": "H2O",
        "name": "Water",
        "color": "#3498DB",
        "phase_at_stp": "Liquid",
        "temperature": 25,
        "density_proxy": 1.0,
        "temperature_thresholds": {
            "freeze": 0,
            "boil": 100
        }
    },
    "ICE": {
        "symbol": "ICE",
        "name": "Ice",
        "color": "#A9CCE3",
        "phase_at_stp": "Solid",
        "temperature": -10,
        "density_proxy": 0.917
    },
    "STEAM": {
        "symbol": "STEAM",
        "name": "Steam",
        "color": "#F2F3F4",
        "phase_at_stp": "Gas",
        "temperature": 110,
        "density_proxy": 0.0006
    },
    "LIFE": {
        "symbol": "LIFE",
        "name": "Life",
        "color": "#2ECC71",
        "phase_at_stp": "Solid",
        "temperature": 25,
        "density_proxy": 1.1,
        "is_life": true,
        "lifespan": 100
    },
    "DEAD": {
        "symbol": "DEAD",
        "name": "Dead Matter",
        "color": "#784212",
        "phase_at_stp": "Solid",
        "temperature": 25,
        "density_proxy": 0.9
    },
    "CO2": {
        "symbol": "CO2",
        "name": "Carbon Dioxide",
        "color": "#A0A0A0",
        "phase_at_stp": "Gas",
        "temperature": 25,
        "density_proxy": 1.977
    },
    "SO2": {
        "symbol": "SO2",
        "name": "Sulfur Dioxide",
        "color": "#F0E68C",
        "phase_at_stp": "Gas",
        "temperature": 25,
        "density_proxy": 2.6288
    },
    "H2SO4": {
        "symbol": "H2SO4",
        "name": "Sulfuric Acid",
        "color": "#FFD700",
        "phase_at_stp": "Liquid",
        "temperature": 25,
        "density_proxy": 1.83
    },
    "NACL": {
        "symbol": "NACL",
        "name": "Salt",
        "color": "#FDFEFE",
        "phase_at_stp": "Solid",
        "temperature": 25,
        "density_proxy": 2.16
    },
    "CH4": {
        "symbol": "CH4",
        "name": "Methane",
        "color": "#B2FF66",
        "phase_at_stp": "Gas",
        "flammability": true,
        "temperature": 25,
        "density_proxy": 0.657
    }
};
const rulesData = [
    {
        "name": "Water Formation (O + 2H)",
        "enabled": true,
        "reactants": { "center": "O", "neighbors": ["H", "H"] },
        "products": { "center": "H2O", "consumed_neighbors": 2 },
        "probability": 1.0
    },
    {
        "name": "Salt Formation (Na + Cl)",
        "enabled": true,
        "reactants": { "center": "Na", "neighbors": ["Cl"] },
        "products": { "center": "NACL", "consumed_neighbors": 1 },
        "probability": 0.2
    },
    {
        "name": "Methane Formation (C + 4H)",
        "enabled": true,
        "reactants": { "center": "C", "neighbors": ["H", "H", "H", "H"] },
        "products": { "center": "CH4", "consumed_neighbors": 4 },
        "probability": 0.05
    },
    {
        "name": "Combustion (Flammable + O)",
        "enabled": true,
        "is_combustion": true,
        "probability": 0.1
    },
    {
        "name": "CO2 Formation (C + O)",
        "enabled": true,
        "reactants": { "center": "C", "neighbors": ["O"] },
        "products": { "center": "CO2", "consumed_neighbors": 1 },
        "probability": 0.5
    },
    {
        "name": "SO2 Formation (S + O)",
        "enabled": true,
        "reactants": { "center": "S", "neighbors": ["O"] },
        "products": { "center": "SO2", "consumed_neighbors": 1 },
        "probability": 0.5
    },
    {
        "name": "Photosynthesis (CO2 + H2O)",
        "enabled": true,
        "reactants": { "center": "CO2", "neighbors": ["H2O"] },
        "products": { "center": "LIFE", "consumed_neighbors": 1 },
        "probability": 0.1
    },
    {
        "name": "Acid Rain (SO2 + H2O)",
        "enabled": true,
        "reactants": { "center": "SO2", "neighbors": ["H2O"] },
        "products": { "center": "H2SO4", "consumed_neighbors": 1 },
        "probability": 0.2
    },
    {
        "name": "Salt Dissolution (NACL + H2O)",
        "enabled": true,
        "reactants": { "center": "NACL", "neighbors": ["H2O"] },
        "products": { "center": "H2O", "consumed_neighbors": 1 },
        "probability": 0.4
    },
    {
        "name": "Neutralization (H2SO4 + Na)",
        "enabled": true,
        "reactants": { "center": "H2SO4", "neighbors": ["Na"] },
        "products": { "center": "NACL", "consumed_neighbors": 1 },
        "probability": 0.2
    },
    {
        "name": "Rusting (Fe + O)",
        "enabled": true,
        "reactants": { "center": "Fe", "neighbors": ["O"] },
        "products": { "center": "DEAD", "consumed_neighbors": 1 },
        "probability": 0.05
    },
    {
        "name": "Life Decay (LIFE)",
        "enabled": true,
        "reactants": { "center": "LIFE", "neighbors": [] },
        "products": { "center": "DEAD", "consumed_neighbors": 0 },
        "probability": 0.005
    },
    {
        "name": "Dead Matter Decomposition (DEAD + O)",
        "enabled": true,
        "reactants": { "center": "DEAD", "neighbors": ["O"] },
        "products": { "center": "CO2", "consumed_neighbors": 1 },
        "probability": 0.01
    },
    {
        "name": "Steam Condensation (STEAM + COLD)",
        "enabled": true,
        "reactants": { "center": "STEAM", "neighbors": ["COLD"] },
        "products": { "center": "H2O", "consumed_neighbors": 1 },
        "probability": 1.0
    },
    {
        "name": "Ice Melting (ICE + HEAT)",
        "enabled": true,
        "reactants": { "center": "ICE", "neighbors": ["HEAT"] },
        "products": { "center": "H2O", "consumed_neighbors": 1 },
        "probability": 1.0
    },
    {
        "name": "Water Freezing (H2O + COLD)",
        "enabled": true,
        "reactants": { "center": "H2O", "neighbors": ["COLD"] },
        "products": { "center": "ICE", "consumed_neighbors": 1 },
        "probability": 1.0
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const canvas = document.getElementById('simulationCanvas');
    const ctx = canvas.getContext('2d');
    const elementSelector = document.getElementById('elementSelector');
    const brushSizeSlider = document.getElementById('brushSize');
    const brushSizeValue = document.getElementById('brushSizeValue');
    const startPauseBtn = document.getElementById('startPauseBtn');
    const clearBtn = document.getElementById('clearBtn');
    const infoPanel = document.getElementById('infoPanel');
    const rulesetContainer = document.getElementById('ruleset');

    // --- Simulation Constants & State ---
    const GRID_SIZE = 100;
    const CELL_SIZE = 5;
    canvas.width = GRID_SIZE * CELL_SIZE;
    canvas.height = GRID_SIZE * CELL_SIZE;

    let elements = {};
    let rules = [];
    let grid = [];
    let isRunning = false;
    let currentElement = 'C';
    let brushSize = 1;

    // --- Color Scale for Temperature ---
    const colorScale = d3.interpolateRgbBasis(["#00BFFF", "#FFFFFF", "#FF4500"]); // Cold -> Neutral -> Hot

    // --- Core Functions ---

    /**
     * Loads element and rule data from embedded objects.
     */
    function loadData() {
        try {
            rules = rulesData;
            elements = { ...elementsData, ...compoundsData };

            populateElementSelector();
            populateRuleset();
        } catch (error) {
            console.error("Error loading data:", error);
        }
    }

    /**
     * Initializes the grid with default values (Vacuum).
     */
    function initializeGrid() {
        const vacuumTemp = elements['VACUUM'].temperature;
        grid = Array(GRID_SIZE).fill(null).map(() =>
            Array(GRID_SIZE).fill(null).map(() => ({ symbol: 'VACUUM', temperature: vacuumTemp }))
        );
    }
    
    /**
     * The main simulation loop.
     */
    function update() {
        if (!isRunning) return;

        let nextGrid = grid.map(row => row.map(cell => ({ ...cell })));

        // --- Pass 1: Temperature Diffusion ---
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const cell = grid[y][x];
                const element = elements[cell.symbol];

                // Static temperature for sources
                if (element.symbol === 'HEAT' || element.symbol === 'COLD') {
                    nextGrid[y][x].temperature = element.temperature;
                    continue;
                }

                let tempSum = cell.temperature;
                let count = 1;

                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (dx === 0 && dy === 0) continue;
                        const nx = x + dx, ny = y + dy;
                        if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
                            tempSum += grid[ny][nx].temperature;
                            count++;
                        }
                    }
                }
                // Apply a diffusion factor to smooth out the temperature change
                nextGrid[y][x].temperature = cell.temperature + (tempSum / count - cell.temperature) * 0.5;
            }
        }

        // --- Pass 2: Temperature State Changes and Special Source Effects ---
        applyTemperatureEffects(nextGrid);

        // --- Pass 3: Life and Decay ---
        applyLifeAndDecay(nextGrid);

        // --- Pass 4: Chemistry (Rules Engine) ---
        applyRules(nextGrid);

        // --- Pass 5: Physics (Gravity, Gas/Liquid movement) ---
        applyPhysics(nextGrid);

        grid = nextGrid;
        requestAnimationFrame(update);
    }
    
    /**
     * Handles the spread of life and decay.
     */
    function applyLifeAndDecay(nextGrid) {
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const cell = grid[y][x];
                const element = elements[cell.symbol];

                if (element && element.is_life) {
                    // Spread to neighbors
                    if (Math.random() < 0.1) {
                        const dx = Math.floor(Math.random() * 3) - 1;
                        const dy = Math.floor(Math.random() * 3) - 1;
                        if (dx === 0 && dy === 0) continue;
                        const nx = x + dx;
                        const ny = y + dy;
                        if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && nextGrid[ny][nx].symbol === 'VACUUM') {
                            nextGrid[ny][nx].symbol = 'LIFE';
                            nextGrid[ny][nx].lifespan = element.lifespan;
                        }
                    }

                    // Decay
                    let newLifespan = (cell.lifespan || element.lifespan) - 1;
                    if (newLifespan <= 0) {
                        nextGrid[y][x].symbol = 'DEAD';
                    } else {
                        nextGrid[y][x].lifespan = newLifespan;
                    }
                }
            }
        }
    }

    /**
     * Handles temperature-based state changes and HEAT/COLD source effects.
     */
    function applyTemperatureEffects(nextGrid) {
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const cell = nextGrid[y][x];
                const element = elements[cell.symbol];

                // HEAT/COLD cells act as sources, persistently setting temperature
                if (cell.symbol === 'HEAT' || cell.symbol === 'COLD') {
                    nextGrid[y][x].temperature = element.temperature;
                    continue;
                }

                // If cell is not source but overlaps a source in the original grid, adjust its temp toward the source
                const orig = grid[y][x];
                if (orig.symbol === 'HEAT' || orig.symbol === 'COLD') {
                    nextGrid[y][x].temperature += (elements[orig.symbol].temperature - cell.temperature) * 0.5;
                }

                // Phase changes for water
                if (element.symbol === 'H2O' && cell.temperature < 0) {
                    nextGrid[y][x].symbol = 'ICE';
                } else if (element.symbol === 'ICE' && cell.temperature > 0) {
                    nextGrid[y][x].symbol = 'H2O';
                } else if (element.symbol === 'H2O' && cell.temperature > 100) {
                    nextGrid[y][x].symbol = 'STEAM';
                } else if (element.symbol === 'STEAM' && cell.temperature < 100) {
                    nextGrid[y][x].symbol = 'H2O';
                }
            }
        }
    }

    /**
     * Handles the physics simulation for particle movement.
     */
    function applyPhysics(nextGrid) {
        for (let y = GRID_SIZE - 1; y >= 0; y--) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const currentCell = nextGrid[y][x];
                const currentElement = elements[currentCell.symbol];
                if (!currentElement || currentElement.symbol === 'VACUUM') continue;

                const density = currentElement.density_proxy || 1.0;
                const phase = currentElement.phase_at_stp;

                // Helper to swap cells
                const swap = (x1, y1, x2, y2) => {
                    const temp = nextGrid[y1][x1];
                    nextGrid[y1][x1] = nextGrid[y2][x2];
                    nextGrid[y2][x2] = temp;
                };

                if (phase === 'Solid') {
                    // Solids fall down
                    if (y < GRID_SIZE - 1) {
                        const belowCell = nextGrid[y + 1][x];
                        const belowElement = elements[belowCell.symbol];
                        if (belowElement && belowElement.phase_at_stp !== 'Solid' && density > belowElement.density_proxy) {
                            swap(x, y, x, y + 1);
                        }
                    }
                } else if (phase === 'Liquid') {
                    // Liquids fall and spread
                    if (y < GRID_SIZE - 1) {
                        const belowCell = nextGrid[y + 1][x];
                        const belowElement = elements[belowCell.symbol];
                        if (belowElement && density > belowElement.density_proxy) {
                            swap(x, y, x, y + 1);
                            continue;
                        }
                    }
                    // Spread to the sides
                    const dir = Math.random() < 0.5 ? 1 : -1;
                    if (x + dir >= 0 && x + dir < GRID_SIZE) {
                         const sideCell = nextGrid[y][x+dir];
                         const sideElement = elements[sideCell.symbol];
                         if (sideElement && sideElement.phase_at_stp !== 'Solid' && sideElement.phase_at_stp !== 'Liquid') {
                             swap(x,y, x+dir, y);
                             continue;
                         }
                    }

                } else if (phase === 'Gas') {
                    // Gases rise and spread
                    if (y > 0) {
                        const aboveCell = nextGrid[y - 1][x];
                        const aboveElement = elements[aboveCell.symbol];
                        if (aboveElement && density < aboveElement.density_proxy) {
                            swap(x, y, x, y - 1);
                            continue;
                        }
                    }
                     // Spread to the sides
                    const dir = Math.random() < 0.5 ? 1 : -1;
                    if (x + dir >= 0 && x + dir < GRID_SIZE) {
                        const sideCell = nextGrid[y][x + dir];
                        const sideElement = elements[sideCell.symbol];
                        if (sideElement && sideElement.phase_at_stp === 'Gas' && density > sideElement.density_proxy) {
                            swap(x, y, x + dir, y);
                            continue;
                        }
                    }
                }
            }
        }
    }

    /**
     * Applies the enabled rules from rules.json to the grid.
     */
    function applyRules(nextGrid) {
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const cell = grid[y][x];
                const element = elements[cell.symbol];
                if (!element) continue;

                for (const rule of rules) {
                    if (!rule.enabled || Math.random() > (rule.probability || 1.0)) continue;

                    // Generic combustion rule
                    if (rule.is_combustion && element.flammability) {
                         for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
                            const nx = x + dx, ny = y + dy;
                            if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && grid[ny][nx].symbol === 'O') {
                                nextGrid[y][x] = { ...nextGrid[y][x], symbol: 'FIRE', temperature: elements.FIRE.temperature };
                                break;
                            }
                        }
                        continue; // Move to next rule
                    }

                    // Standard reaction rule
                    if (cell.symbol === rule.reactants.center) {
                        const neighbors = [];
                        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
                             if (dx === 0 && dy === 0) continue;
                             const nx = x + dx, ny = y + dy;
                             if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
                                 neighbors.push({x: nx, y: ny, symbol: grid[ny][nx].symbol});
                             }
                        }

                        const requiredNeighbors = [...rule.reactants.neighbors];
                        const foundNeighbors = [];

                        for (const required of requiredNeighbors) {
                            const foundIndex = neighbors.findIndex(n => n.symbol === required && !foundNeighbors.some(fn => fn.x === n.x && fn.y === n.y));
                            if (foundIndex !== -1) {
                                foundNeighbors.push(neighbors.splice(foundIndex, 1)[0]);
                            }
                        }

                        if (foundNeighbors.length === requiredNeighbors.length) {
                            nextGrid[y][x] = { ...nextGrid[y][x], symbol: rule.products.center };
                            for (let i = 0; i < rule.products.consumed_neighbors; i++) {
                                const neighborToConsume = foundNeighbors[i];
                                nextGrid[neighborToConsume.y][neighborToConsume.x] = { ...grid[neighborToConsume.y][neighborToConsume.x], symbol: 'VACUUM' };
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * Renders the grid to the canvas, with cell color based on temperature.
     */
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const cell = grid[y][x];
                const element = elements[cell.symbol];
                if (element) {
                    // Normalize temperature to a 0-1 range for the color scale
                    // Clamping temperature between -100 and 1000 for visualization
                    const tempRatio = Math.max(0, Math.min(1, (cell.temperature + 100) / 1100));
                    ctx.fillStyle = colorScale(tempRatio);
                    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                }
            }
        }
        requestAnimationFrame(render);
    }
    
    /** Populates the dropdown with categorized elements and compounds */
    function populateElementSelector() {
        elementSelector.innerHTML = '';

        // --- Create Option Groups ---
        const elementGroup = document.createElement('optgroup');
        elementGroup.label = 'Elements';

        const specialGroup = document.createElement('optgroup');
        specialGroup.label = 'Special';

        // --- Filter and Sort ---
        const periodicElements = Object.keys(elements)
            .filter(symbol => elements[symbol].atomic_number !== undefined)
            .sort((a, b) => elements[a].atomic_number - elements[b].atomic_number);

        const specialElements = Object.keys(elements)
            .filter(symbol => elements[symbol].atomic_number === undefined)
            .sort((a,b) => (elements[a].name || a).localeCompare(elements[b].name || b));


        // --- Populate Groups ---
        periodicElements.forEach(symbol => {
            const option = document.createElement('option');
            option.value = symbol;
            option.textContent = elements[symbol].name || symbol;
            elementGroup.appendChild(option);
        });

        specialElements.forEach(symbol => {
            const option = document.createElement('option');
            option.value = symbol;
            option.textContent = elements[symbol].name || symbol;
            specialGroup.appendChild(option);
        });

        elementSelector.appendChild(elementGroup);
        elementSelector.appendChild(specialGroup);

        elementSelector.value = currentElement;
    }

    /** Populates the ruleset container with toggleable checkboxes */
    function populateRuleset() {
        rulesetContainer.innerHTML = '<h3>Interaction Rules</h3>';
        rules.forEach((rule, index) => {
            const container = document.createElement('div');
            container.className = 'rule';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `rule_${index}`;
            checkbox.checked = rule.enabled;
            checkbox.addEventListener('change', () => rules[index].enabled = checkbox.checked);

            const label = document.createElement('label');
            label.htmlFor = `rule_${index}`;
            label.textContent = rule.name;

            container.appendChild(checkbox);
            container.appendChild(label);
            rulesetContainer.appendChild(container);
        });
    }

    /** Paints the selected element on the grid */
    function paint(e) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
        const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);

        if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return;

        const radius = Math.floor(brushSize / 2);
        for (let i = -radius; i <= radius; i++) {
            for (let j = -radius; j <= radius; j++) {
                if (Math.sqrt(i*i + j*j) > radius) continue;
                const newX = x + j;
                const newY = y + i;
                if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
                    const selectedElement = elements[currentElement];
                    grid[newY][newX] = { symbol: currentElement, temperature: selectedElement.temperature };
                }
            }
        }
    }

    /** Updates the info panel based on the cell under the mouse */
    function updateInfoPanel(e) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
        const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);

        if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) {
            infoPanel.innerHTML = '<h3>Element Information</h3><p>Hover over the grid to see details.</p>';
            return;
        }

        const cell = grid[y][x];
        const element = elements[cell.symbol];
        infoPanel.innerHTML = `
            <h3>Element Information</h3>
            <p><strong>Symbol:</strong> ${element.symbol}</p>
            <p><strong>Name:</strong> ${element.name || 'N/A'}</p>
            <p><strong>State:</strong> ${element.phase_at_stp || 'N/A'}</p>
            <p><strong>Temp:</strong> ${cell.temperature.toFixed(1)}°C</p>
        `;
    }

    /** Initializes the entire application */
    function init() {
        loadData();
        initializeGrid();

        // Event Listeners
        elementSelector.addEventListener('change', (e) => currentElement = e.target.value);
        brushSizeSlider.addEventListener('input', (e) => {
            brushSize = parseInt(e.target.value, 10);
            brushSizeValue.textContent = brushSize;
        });
        startPauseBtn.addEventListener('click', () => {
            isRunning = !isRunning;
            startPauseBtn.textContent = isRunning ? 'Pause' : 'Start';
            if (isRunning) update();
        });
        clearBtn.addEventListener('click', initializeGrid);

        let isMouseDown = false;
        canvas.addEventListener('mousedown', (e) => { isMouseDown = true; paint(e); });
        canvas.addEventListener('mouseup', () => isMouseDown = false);
        canvas.addEventListener('mouseleave', () => isMouseDown = false);
        canvas.addEventListener('mousemove', (e) => {
            updateInfoPanel(e);
            if (isMouseDown) paint(e);
        });
        
        render();
    }

    init();
});
