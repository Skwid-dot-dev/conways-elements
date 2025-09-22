document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded event fired. script.js is running.");
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
    const zoomSlider = document.getElementById('zoomSlider');
    const zoomValue = document.getElementById('zoomValue');
    const panXSlider = document.getElementById('panXSlider');
    const panXValue = document.getElementById('panXValue');
    const panYSlider = document.getElementById('panYSlider');
    const panYValue = document.getElementById('panYValue');
    const createPlanetBtn = document.getElementById('createPlanetBtn');
    const planetModal = document.getElementById('planetModal');
    const closeButton = document.querySelector('.close-button');
    const elementList = document.getElementById('elementList');
    const addPlanetButton = document.getElementById('addPlanetButton');
    const gravityToggle = document.getElementById('gravityToggle');

    // --- Simulation Constants & State ---
    const CHUNK_SIZE = 32; // 32x32 cells per chunk
    const CELL_SIZE = 5;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let elements = {};
    let rules = [];
    let world = {}; // Using an object as a sparse grid for chunks
    let celestialBodies = []; // To store planets and other large objects
    let isRunning = false;
    let currentElement = 'C';
    let brushSize = 1;
    let zoom = 1;
    let panX = 0;
    let panY = 0;
    let massBasedGravityEnabled = true;
    let atmospheresEnabled = true;
    let coresEnabled = true;
    let globalVacuumTemp = -273;

    class CelestialBody {
        constructor(x, y, composition) {
            this.x = x;
            this.y = y;
            this.prevX = x;
            this.prevY = y;
            this.composition = composition;
            this.mass = 0;
            this.radius = 0;
            this.vx = 0;
            this.vy = 0;
            this.ax = 0;
            this.ay = 0;
        }

        draw(ctx) {
            if (coresEnabled) {
                ctx.fillStyle = 'rgba(255, 100, 0, 0.8)';
                ctx.beginPath();
                ctx.arc(this.x * CELL_SIZE, this.y * CELL_SIZE, this.radius * CELL_SIZE / 2, 0, 2 * Math.PI);
                ctx.fill();
            }

            // Draw body
            ctx.fillStyle = 'grey';
            ctx.beginPath();
            ctx.arc(this.x * CELL_SIZE, this.y * CELL_SIZE, this.radius * CELL_SIZE, 0, 2 * Math.PI);
            ctx.fill();

            if (atmospheresEnabled) {
                const atmosphereGrad = ctx.createRadialGradient(
                    this.x * CELL_SIZE, this.y * CELL_SIZE, this.radius * CELL_SIZE,
                    this.x * CELL_SIZE, this.y * CELL_SIZE, this.radius * CELL_SIZE * 1.5
                );
                atmosphereGrad.addColorStop(0, 'rgba(173, 216, 230, 0.5)');
                atmosphereGrad.addColorStop(1, 'rgba(173, 216, 230, 0)');
                ctx.fillStyle = atmosphereGrad;
                ctx.beginPath();
                ctx.arc(this.x * CELL_SIZE, this.y * CELL_SIZE, this.radius * CELL_SIZE * 1.5, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    }

    // --- Color Scale for Temperature ---
    // const colorScale = d3.interpolateRgbBasis(["#00BFFF", "#FFFFFF", "#FF4500"]); // Cold -> Neutral -> Hot

    // --- Core Functions ---

    /**
     * Simple linear interpolation between two hex colors.
     * @param {string} color1 - Start color in hex format (e.g., "#00BFFF")
     * @param {string} color2 - End color in hex format (e.g., "#FF4500")
     * @param {number} factor - A value between 0 and 1.
     * @returns {string} The interpolated color in hex format.
     */
    function interpolateColor(color1, color2, factor) {
        const r1 = parseInt(color1.substring(1, 3), 16);
        const g1 = parseInt(color1.substring(3, 5), 16);
        const b1 = parseInt(color1.substring(5, 7), 16);

        const r2 = parseInt(color2.substring(1, 3), 16);
        const g2 = parseInt(color2.substring(3, 5), 16);
        const b2 = parseInt(color2.substring(5, 7), 16);

        const r = Math.round(r1 + factor * (r2 - r1));
        const g = Math.round(g1 + factor * (g2 - g1));
        const b = Math.round(b1 + factor * (b2 - b1));

        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    /**
     * Gets a color from a 3-color gradient (cold, neutral, hot).
     * @param {number} ratio - A value between 0 and 1.
     * @returns {string} The interpolated color.
     */
    function getColorForTemperature(ratio) {
        const coldColor = "#00BFFF";
        const neutralColor = "#FFFFFF";
        const hotColor = "#FF4500";

        if (ratio < 0.5) {
            // Interpolate between cold and neutral
            return interpolateColor(coldColor, neutralColor, ratio * 2);
        } else {
            // Interpolate between neutral and hot
            return interpolateColor(neutralColor, hotColor, (ratio - 0.5) * 2);
        }
    }

    /**
     * Handles temperature-based ionization of Hydrogen.
     */
    function applyIonization(nextGrid) {
        const IONIZATION_TEMP = 15000; // Temperature in Celsius for ionization
        const IONIZATION_PROBABILITY = 0.5;

        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const cell = grid[y][x];
                if (cell.symbol === 'H' && cell.temperature > IONIZATION_TEMP) {
                    if (Math.random() < IONIZATION_PROBABILITY) {
                        // Find an empty neighbor cell for the electron
                        const neighbors = [];
                        for (let dy = -1; dy <= 1; dy++) {
                            for (let dx = -1; dx <= 1; dx++) {
                                if (dx === 0 && dy === 0) continue;
                                const nx = x + dx;
                                const ny = y + dy;
                                if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && nextGrid[ny][nx].symbol === 'VACUUM') {
                                    neighbors.push({x: nx, y: ny});
                                }
                            }
                        }

                        if (neighbors.length > 0) {
                            const electronCell = neighbors[Math.floor(Math.random() * neighbors.length)];

                            // Ionize: H -> H+
                            nextGrid[y][x].symbol = 'Hplus';

                            // Create electron
                            nextGrid[electronCell.y][electronCell.x].symbol = 'eminus';
                            nextGrid[electronCell.y][electronCell.x].temperature = cell.temperature; // Electron inherits temperature
                        }
                    }
                }
            }
        }
    }

    function applyParticleCollection(nextStates) {
        if (celestialBodies.length === 0) return;

        const collectibleParticles = new Map();

        for (const [key, chunk] of nextStates.entries()) {
            const chunkX = chunk.x * CHUNK_SIZE;
            const chunkY = chunk.y * CHUNK_SIZE;
            for (let y = 0; y < CHUNK_SIZE; y++) {
                for (let x = 0; x < CHUNK_SIZE; x++) {
                    const cell = chunk.cells[y][x];
                    if (cell.symbol !== 'VACUUM' && elements[cell.symbol] && elements[cell.symbol].mass > 0) {
                        const worldX = chunkX + x;
                        const worldY = chunkY + y;
                        let closestBody = null;
                        let minDistanceSq = Infinity;

                        for (const body of celestialBodies) {
                            const dx = body.x - worldX;
                            const dy = body.y - worldY;
                            const distanceSq = dx * dx + dy * dy;
                            if (distanceSq < minDistanceSq) {
                                minDistanceSq = distanceSq;
                                closestBody = body;
                            }
                        }

                        if (closestBody && minDistanceSq < Math.pow(closestBody.radius * 1.6, 2)) {
                            collectibleParticles.set(`${worldX},${worldY}`, {
                                cell: cell,
                                body: closestBody,
                                chunkKey: key,
                                localX: x,
                                localY: y
                            });
                        }
                    }
                }
            }
        }

        for (const [coords, particle] of collectibleParticles.entries()) {
            const { cell, body, chunkKey, localX, localY } = particle;
            const element = elements[cell.symbol];

            body.composition[cell.symbol] = (body.composition[cell.symbol] || 0) + 1;
            body.mass += element.mass;
            body.radius = Math.cbrt(body.mass) * 2;

            const chunkToModify = nextStates.get(chunkKey);
            chunkToModify.cells[localY][localX] = { symbol: 'VACUUM', temperature: -273 };
        }
    }

    function applyCanvasGravity(chunk, nextChunk) {
        for (let y = CHUNK_SIZE - 2; y >= 0; y--) {
            for (let x = 0; x < CHUNK_SIZE; x++) {
                const cell = chunk.cells[y][x];
                const element = elements[cell.symbol];
                if (element && element.phase_at_stp !== 'Gas' && element.symbol !== 'VACUUM') {
                    const belowCell = chunk.cells[y + 1][x];
                    if (belowCell.symbol === 'VACUUM') {
                        const temp = nextChunk.cells[y][x];
                        nextChunk.cells[y][x] = nextChunk.cells[y+1][x];
                        nextChunk.cells[y+1][x] = temp;
                    }
                }
            }
        }
    }

    function applyMassBasedGravity() {
        const G = 0.1; // Gravitational constant
        for (const body of celestialBodies) {
            body.ax = 0;
            body.ay = 0;
        }
        for (let i = 0; i < celestialBodies.length; i++) {
            for (let j = i + 1; j < celestialBodies.length; j++) {
                const body1 = celestialBodies[i];
                const body2 = celestialBodies[j];
                const dx = body2.x - body1.x;
                const dy = body2.y - body1.y;
                const distSq = dx * dx + dy * dy;
                if (distSq < 1) continue;
                const force = G * body1.mass * body2.mass / distSq;
                const angle = Math.atan2(dy, dx);
                const forceX = Math.cos(angle) * force;
                const forceY = Math.sin(angle) * force;
                body1.ax += forceX / body1.mass;
                body1.ay += forceY / body1.mass;
                body2.ax -= forceX / body2.mass;
                body2.ay -= forceY / body2.mass;
            }
        }
    }

    /**
     * Loads element and rule data from the pre-loaded JavaScript data files.
     */
    function loadData() {
        if (typeof ELEMENTS_DATA === 'undefined' || typeof COMPOUNDS_DATA === 'undefined' || typeof RULES_DATA === 'undefined') {
            console.error("Data files not loaded correctly. Make sure elements.js, compounds.js, and rules.js are included before script.js.");
            // Provide a basic fallback to prevent total crash
            elements = {
                'VACUUM': { symbol: 'VACUUM', name: 'Vacuum', color: '#000000', phase_at_stp: 'Gas', temperature: -273, density_proxy: 0 },
                'ERROR': { symbol: 'ERROR', name: 'Error', color: '#FF00FF', phase_at_stp: 'Solid', temperature: 0, density_proxy: 1 }
            };
            rules = [];
            populateElementSelector();
            return;
        }

        // Add default temperature to elements that don't have it
        Object.keys(ELEMENTS_DATA).forEach(key => {
            if (!ELEMENTS_DATA[key].temperature) {
                ELEMENTS_DATA[key].temperature = 25; // Room temperature default
            }
        });

        // Merge elements and compounds
        elements = { ...ELEMENTS_DATA, ...COMPOUNDS_DATA };
        rules = RULES_DATA;

        populateElementSelector();
        populateRuleset();

        console.log('Data loaded successfully:', Object.keys(elements).length, 'elements loaded');
    }

    /**
     * Creates a new chunk with default values.
     */
    function createChunk(chunkX, chunkY) {
        const chunk = {
            cells: Array(CHUNK_SIZE).fill(null).map(() =>
                Array(CHUNK_SIZE).fill(null).map(() => ({ symbol: 'VACUUM', temperature: globalVacuumTemp }))
            ),
            x: chunkX,
            y: chunkY
        };
        return chunk;
    }

    /**
     * Gets a chunk from the world, creating it if it doesn't exist.
     */
    function getChunk(chunkX, chunkY) {
        const key = `${chunkX},${chunkY}`;
        if (!world[key]) {
            world[key] = createChunk(chunkX, chunkY);
        }
        return world[key];
    }

    /**
     * Gets a cell at a specific world coordinate.
     */
    function getCell(x, y) {
        const chunkX = Math.floor(x / CHUNK_SIZE);
        const chunkY = Math.floor(y / CHUNK_SIZE);
        const chunk = getChunk(chunkX, chunkY);
        const localX = x - (chunkX * CHUNK_SIZE);
        const localY = y - (chunkY * CHUNK_SIZE);
        return chunk.cells[localY][localX];
    }

    /**
     * Sets a cell at a specific world coordinate.
     */
    function setCell(x, y, cell) {
        const chunkX = Math.floor(x / CHUNK_SIZE);
        const chunkY = Math.floor(y / CHUNK_SIZE);
        const chunk = getChunk(chunkX, chunkY);
        const localX = x - (chunkX * CHUNK_SIZE);
        const localY = y - (chunkY * CHUNK_SIZE);
        chunk.cells[localY][localX] = cell;
    }

    /**
     * Clears the world of all particles and celestial bodies.
     */
    function clearWorld() {
        world = {};
        celestialBodies = [];
    }
    
    /**
     * The main simulation loop.
     */
    function update() {
        if (!isRunning) return;

        const visibleKeys = getVisibleChunkKeys();
        const nextStates = new Map();
        const crossChunkMovers = [];

        // Pass 1: Process each visible chunk
        for (const key of visibleKeys) {
            const chunk = world[key];
            if (!chunk) continue;

            let nextChunk = JSON.parse(JSON.stringify(chunk));

            // Note: The order of these passes is important!
            applyTemperatureDiffusion(chunk, nextChunk);
            applyTemperatureEffects(chunk, nextChunk);
            applyIonization(chunk, nextChunk);
            applyLifeAndDecay(chunk, nextChunk);
            // applyMagnetism(chunk, nextChunk);
            applyRules(chunk, nextChunk);
            applyPhysics(chunk, nextChunk, crossChunkMovers);

            nextStates.set(key, nextChunk);
        }

        // Commit the next states to the world
        for (const [key, nextChunk] of nextStates.entries()) {
            world[key] = nextChunk;
        }

        // Process cross-chunk movements
        for (const move of crossChunkMovers) {
            setCell(move.to.x, move.to.y, move.cell);
        }

        if (massBasedGravityEnabled) {
            applyMassBasedGravity();
        } else {
            for (const key of visibleKeys) {
                const chunk = nextStates.get(key);
                if (chunk) {
                    applyCanvasGravity(chunk, chunk);
                }
            }
        }

        applyParticleCollection(nextStates);

        for (const body of celestialBodies) {
            const tempX = body.x;
            const tempY = body.y;
            body.x += body.x - body.prevX + body.ax * 0.01;
            body.y += body.y - body.prevY + body.ay * 0.01;
            body.prevX = tempX;
            body.prevY = tempY;
        }

        requestAnimationFrame(update);
    }

function applyPhysics(chunk, nextChunk, crossChunkMovers) {
    const chunkX = chunk.x;
    const chunkY = chunk.y;

    for (let y = CHUNK_SIZE - 1; y >= 0; y--) {
        for (let x = 0; x < CHUNK_SIZE; x++) {
            const currentCell = nextChunk.cells[y][x];
            const currentElement = elements[currentCell.symbol];
            if (!currentElement || currentElement.symbol === 'VACUUM') continue;

            const density = currentElement.density_proxy || 1.0;
            const phase = currentElement.phase_at_stp;

            const move = (fromX, fromY, toX, toY) => {
                const toChunkX = Math.floor(toX / CHUNK_SIZE);
                const toChunkY = Math.floor(toY / CHUNK_SIZE);

                if (toChunkX === chunkX && toChunkY === chunkY) {
                    // Local move
                    if (nextChunk.cells[toY - chunkY * CHUNK_SIZE][toX - chunkX * CHUNK_SIZE].symbol === 'VACUUM') {
                        const temp = nextChunk.cells[fromY][fromX];
                        nextChunk.cells[fromY][fromX] = nextChunk.cells[toY - chunkY * CHUNK_SIZE][toX - chunkX * CHUNK_SIZE];
                        nextChunk.cells[toY - chunkY * CHUNK_SIZE][toX - chunkX * CHUNK_SIZE] = temp;
                    }
                } else {
                    // Cross-chunk move
                    crossChunkMovers.push({ from: { x: fromX, y: fromY }, to: { x: toX, y: toY }, cell: currentCell });
                    nextChunk.cells[fromY][fromX] = { symbol: 'VACUUM', temperature: -273 };
                }
            };

            if (phase === 'Solid') {
                const toX = x;
                const toY = y + 1;
                if (toY < CHUNK_SIZE * (chunkY + 1)) {
                    const belowCell = getCell(chunkX * CHUNK_SIZE + toX, chunkY * CHUNK_SIZE + toY);
                    if (belowCell) {
                        const belowElement = elements[belowCell.symbol];
                        if (belowElement && belowElement.phase_at_stp !== 'Solid' && density > (belowElement.density_proxy || 0)) {
                            move(x, y, toX, toY);
                        }
                    }
                }
            } else if (phase === 'Liquid') {
                let toX = x;
                let toY = y + 1;
                if (toY < CHUNK_SIZE * (chunkY + 1)) {
                    const belowCell = getCell(chunkX * CHUNK_SIZE + toX, chunkY * CHUNK_SIZE + toY);
                    if (belowCell) {
                        const belowElement = elements[belowCell.symbol];
                        if (belowElement && density > (belowElement.density_proxy || 0)) {
                            move(x, y, toX, toY);
                            continue;
                        }
                    }
                }
                const dir = Math.random() < 0.5 ? 1 : -1;
                toX = x + dir;
                toY = y;
                const sideCell = getCell(chunkX * CHUNK_SIZE + toX, chunkY * CHUNK_SIZE + toY);
                if (sideCell) {
                    const sideElement = elements[sideCell.symbol];
                    if (sideElement && sideElement.phase_at_stp !== 'Solid' && sideElement.phase_at_stp !== 'Liquid') {
                        move(x, y, toX, toY);
                        continue;
                    }
                }
            } else if (phase === 'Gas') {
                let toX = x;
                let toY = y - 1;
                if (toY >= chunkY * CHUNK_SIZE) {
                    const aboveCell = getCell(chunkX * CHUNK_SIZE + toX, chunkY * CHUNK_SIZE + toY);
                    if (aboveCell) {
                        const aboveElement = elements[aboveCell.symbol];
                        if (aboveElement && density < (aboveElement.density_proxy || 0)) {
                            move(x, y, toX, toY);
                            continue;
                        }
                    }
                }
                const dir = Math.random() < 0.5 ? 1 : -1;
                toX = x + dir;
                toY = y;
                const sideCell = getCell(chunkX * CHUNK_SIZE + toX, chunkY * CHUNK_SIZE + toY);
                if (sideCell) {
                    const sideElement = elements[sideCell.symbol];
                    if (sideElement && sideElement.phase_at_stp === 'Gas' && density > (sideElement.density_proxy || 0)) {
                        move(x, y, toX, toY);
                        continue;
                    }
                }
            }
        }
    }
}

function applyTemperatureDiffusion(chunk, nextChunk) {
    for (let y = 0; y < CHUNK_SIZE; y++) {
        for (let x = 0; x < CHUNK_SIZE; x++) {
            const cell = chunk.cells[y][x];
            const element = elements[cell.symbol];
            if (!element) continue;

            if (element.symbol === 'HEAT' || element.symbol === 'COLD' || element.is_sun) {
                nextChunk.cells[y][x].temperature = element.temperature;
                continue;
            }

            let tempSum = cell.temperature;
            let count = 1;
            const diffusionFactor = element.conductive ? 0.9 : 0.5;

            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dx === 0 && dy === 0) continue;
                    const nx = x + dx;
                    const ny = y + dy;
                    if (nx >= 0 && nx < CHUNK_SIZE && ny >= 0 && ny < CHUNK_SIZE) {
                        tempSum += chunk.cells[ny][nx].temperature;
                        count++;
                    }
                }
            }
            nextChunk.cells[y][x].temperature = cell.temperature + (tempSum / count - cell.temperature) * diffusionFactor;
        }
    }
}

function applyIonization(chunk, nextChunk) {
    for (let y = 0; y < CHUNK_SIZE; y++) {
        for (let x = 0; x < CHUNK_SIZE; x++) {
            const cell = chunk.cells[y][x];
            if (cell.symbol === 'H' && cell.temperature > 15000) {
                if (Math.random() < 0.5) {
                    const neighbors = [];
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            if (dx === 0 && dy === 0) continue;
                            const nx = x + dx;
                            const ny = y + dy;
                            if (nx >= 0 && nx < CHUNK_SIZE && ny >= 0 && ny < CHUNK_SIZE && nextChunk.cells[ny][nx].symbol === 'VACUUM') {
                                neighbors.push({x: nx, y: ny});
                            }
                        }
                    }

                    if (neighbors.length > 0) {
                        const electronCell = neighbors[Math.floor(Math.random() * neighbors.length)];
                        nextChunk.cells[y][x].symbol = 'Hplus';
                        nextChunk.cells[electronCell.y][electronCell.x].symbol = 'eminus';
                        nextChunk.cells[electronCell.y][electronCell.x].temperature = cell.temperature;
                    }
                }
            }
        }
    }
}

function applyLifeAndDecay(chunk, nextChunk) {
    for (let y = 0; y < CHUNK_SIZE; y++) {
        for (let x = 0; x < CHUNK_SIZE; x++) {
            const cell = chunk.cells[y][x];
            const element = elements[cell.symbol];

            if (element && element.is_life) {
                if (Math.random() < 0.1) {
                    const dx = Math.floor(Math.random() * 3) - 1;
                    const dy = Math.floor(Math.random() * 3) - 1;
                    if (dx !== 0 || dy !== 0) {
                        const nx = x + dx;
                        const ny = y + dy;
                        if (nx >= 0 && nx < CHUNK_SIZE && ny >= 0 && ny < CHUNK_SIZE && nextChunk.cells[ny][nx].symbol === 'VACUUM') {
                            nextChunk.cells[ny][nx].symbol = 'LIFE';
                            nextChunk.cells[ny][nx].lifespan = element.lifespan;
                        }
                    }
                }

                let newLifespan = (cell.lifespan || element.lifespan) - 1;
                if (newLifespan <= 0) {
                    nextChunk.cells[y][x].symbol = 'DEAD';
                } else {
                    nextChunk.cells[y][x].lifespan = newLifespan;
                }
            }
        }
    }
}

function applyTemperatureEffects(chunk, nextChunk) {
    for (let y = 0; y < CHUNK_SIZE; y++) {
        for (let x = 0; x < CHUNK_SIZE; x++) {
            const cell = nextChunk.cells[y][x];
            const element = elements[cell.symbol];
            if (!element) continue;

            if (cell.symbol === 'HEAT' || cell.symbol === 'COLD') {
                cell.temperature = element.temperature;
                continue;
            }

            const orig = chunk.cells[y][x];
            if (orig.symbol === 'HEAT' || orig.symbol === 'COLD') {
                const sourceElement = elements[orig.symbol];
                if (sourceElement) {
                    cell.temperature += (sourceElement.temperature - cell.temperature) * 0.5;
                }
            }

            if (element.symbol === 'H2O' && cell.temperature < 0) {
                cell.symbol = 'ICE';
            } else if (element.symbol === 'ICE' && cell.temperature > 0) {
                cell.symbol = 'H2O';
            } else if (element.symbol === 'H2O' && cell.temperature > 100) {
                cell.symbol = 'STEAM';
            } else if (element.symbol === 'STEAM' && cell.temperature < 100) {
                cell.symbol = 'H2O';
            }
        }
    }
}

function applyRules(chunk, nextChunk) {
    for (let y = 0; y < CHUNK_SIZE; y++) {
        for (let x = 0; x < CHUNK_SIZE; x++) {
            const cell = chunk.cells[y][x];
            const element = elements[cell.symbol];
            if (!element) continue;

            for (const rule of rules) {
                if (!rule.enabled || Math.random() > (rule.probability || 1.0)) continue;

                if (rule.is_combustion && element.flammability) {
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            if (dx === 0 && dy === 0) continue;
                            const nx = x + dx;
                            const ny = y + dy;
                            if (nx >= 0 && nx < CHUNK_SIZE && ny >= 0 && ny < CHUNK_SIZE && chunk.cells[ny][nx].symbol === 'O') {
                                const fireElement = elements.FIRE;
                                nextChunk.cells[y][x] = {
                                    ...nextChunk.cells[y][x],
                                    symbol: 'FIRE',
                                    temperature: fireElement ? fireElement.temperature : 800
                                };
                                break;
                            }
                        }
                    }
                    continue;
                }

                if (rule.reactants && cell.symbol === rule.reactants.center) {
                    const neighbors = [];
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            if (dx === 0 && dy === 0) continue;
                            const nx = x + dx;
                            const ny = y + dy;
                            if (nx >= 0 && nx < CHUNK_SIZE && ny >= 0 && ny < CHUNK_SIZE) {
                                neighbors.push({x: nx, y: ny, symbol: chunk.cells[ny][nx].symbol});
                            }
                        }
                    }

                    const requiredNeighbors = [...(rule.reactants.neighbors || [])];
                    const foundNeighbors = [];

                    for (const required of requiredNeighbors) {
                        const foundIndex = neighbors.findIndex(n => n.symbol === required && !foundNeighbors.some(fn => fn.x === n.x && fn.y === n.y));
                        if (foundIndex !== -1) {
                            foundNeighbors.push(neighbors.splice(foundIndex, 1)[0]);
                        }
                    }

                    if (foundNeighbors.length === requiredNeighbors.length) {
                        const productElement = elements[rule.products.center];
                        nextChunk.cells[y][x] = {
                            ...nextChunk.cells[y][x],
                            symbol: rule.products.center,
                            temperature: productElement ? productElement.temperature : nextChunk.cells[y][x].temperature
                        };
                        for (let i = 0; i < (rule.products.consumed_neighbors || 0); i++) {
                            if (foundNeighbors[i]) {
                                const neighborToConsume = foundNeighbors[i];
                                const vacuumElement = elements['VACUUM'];
                                nextChunk.cells[neighborToConsume.y][neighborToConsume.x] = {
                                    ...chunk.cells[neighborToConsume.y][neighborToConsume.x],
                                    symbol: 'VACUUM',
                                    temperature: vacuumElement ? vacuumElement.temperature : -273
                                };
                            }
                        }
                    }
                }
            }
        }
    }
}

    /**
     * Handles the attraction between magnetic particles.
     */
    function applyMagnetism(nextGrid) {
        const magnetismRule = rules.find(r => r.is_magnetism && r.enabled);
        if (!magnetismRule) return;

        const magneticParticles = [];
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const cell = grid[y][x];
                const element = elements[cell.symbol];
                if (element && element.magnetic) {
                    magneticParticles.push({x, y});
                }
            }
        }

        for (const particle of magneticParticles) {
            if (Math.random() > magnetismRule.probability) continue;

            let nearest = null;
            let minDistance = Infinity;

            for (const otherParticle of magneticParticles) {
                if (particle.x === otherParticle.x && particle.y === otherParticle.y) continue;

                const distance = Math.sqrt(Math.pow(particle.x - otherParticle.x, 2) + Math.pow(particle.y - otherParticle.y, 2));
                if (distance < minDistance) {
                    minDistance = distance;
                    nearest = otherParticle;
                }
            }

            if (nearest) {
                const dx = Math.sign(nearest.x - particle.x);
                const dy = Math.sign(nearest.y - particle.y);
                const nx = particle.x + dx;
                const ny = particle.y + dy;

                if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
                    const targetCell = nextGrid[ny][nx];
                    if (targetCell.symbol === 'VACUUM') {
                        const temp = nextGrid[particle.y][particle.x];
                        nextGrid[particle.y][particle.x] = nextGrid[ny][nx];
                        nextGrid[ny][nx] = temp;
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

                if (!element) continue;

                // HEAT/COLD cells act as sources, persistently setting temperature
                if (cell.symbol === 'HEAT' || cell.symbol === 'COLD') {
                    nextGrid[y][x].temperature = element.temperature;
                    continue;
                }

                // If cell is not source but overlaps a source in the original grid, adjust its temp toward the source
                const orig = grid[y][x];
                if (orig.symbol === 'HEAT' || orig.symbol === 'COLD') {
                    const sourceElement = elements[orig.symbol];
                    if (sourceElement) {
                        nextGrid[y][x].temperature += (sourceElement.temperature - cell.temperature) * 0.5;
                    }
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

                if (phase === 'Solid' && currentElement.symbol !== 'PLANET') {
                    // Solids fall down
                    if (y < GRID_SIZE - 1) {
                        const belowCell = nextGrid[y + 1][x];
                        const belowElement = elements[belowCell.symbol];
                        if (belowElement && belowElement.phase_at_stp !== 'Solid' && density > (belowElement.density_proxy || 0)) {
                            swap(x, y, x, y + 1);
                        }
                    }
                } else if (phase === 'Liquid') {
                    // Liquids fall and spread
                    if (y < GRID_SIZE - 1) {
                        const belowCell = nextGrid[y + 1][x];
                        const belowElement = elements[belowCell.symbol];
                        if (belowElement && density > (belowElement.density_proxy || 0)) {
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
                        if (aboveElement && density < (aboveElement.density_proxy || 0)) {
                            swap(x, y, x, y - 1);
                            continue;
                        }
                    }
                     // Spread to the sides
                    const dir = Math.random() < 0.5 ? 1 : -1;
                    if (x + dir >= 0 && x + dir < GRID_SIZE) {
                        const sideCell = nextGrid[y][x + dir];
                        const sideElement = elements[sideCell.symbol];
                        if (sideElement && sideElement.phase_at_stp === 'Gas' && density > (sideElement.density_proxy || 0)) {
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
                                const fireElement = elements.FIRE;
                                nextGrid[y][x] = { 
                                    ...nextGrid[y][x], 
                                    symbol: 'FIRE', 
                                    temperature: fireElement ? fireElement.temperature : 800 
                                };
                                break;
                            }
                        }
                        continue; // Move to next rule
                    }

                    // Standard reaction rule
                    if (rule.reactants && cell.symbol === rule.reactants.center) {
                        const neighbors = [];
                        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
                             if (dx === 0 && dy === 0) continue;
                             const nx = x + dx, ny = y + dy;
                             if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
                                 neighbors.push({x: nx, y: ny, symbol: grid[ny][nx].symbol});
                             }
                        }

                        const requiredNeighbors = [...(rule.reactants.neighbors || [])];
                        const foundNeighbors = [];

                        for (const required of requiredNeighbors) {
                            const foundIndex = neighbors.findIndex(n => n.symbol === required && !foundNeighbors.some(fn => fn.x === n.x && fn.y === n.y));
                            if (foundIndex !== -1) {
                                foundNeighbors.push(neighbors.splice(foundIndex, 1)[0]);
                            }
                        }

                        if (foundNeighbors.length === requiredNeighbors.length) {
                            const productElement = elements[rule.products.center];
                            nextGrid[y][x] = { 
                                ...nextGrid[y][x], 
                                symbol: rule.products.center,
                                temperature: productElement ? productElement.temperature : nextGrid[y][x].temperature
                            };
                            for (let i = 0; i < (rule.products.consumed_neighbors || 0); i++) {
                                if (foundNeighbors[i]) {
                                    const neighborToConsume = foundNeighbors[i];
                                    const vacuumElement = elements['VACUUM'];
                                    nextGrid[neighborToConsume.y][neighborToConsume.x] = { 
                                        ...grid[neighborToConsume.y][neighborToConsume.x], 
                                        symbol: 'VACUUM',
                                        temperature: vacuumElement ? vacuumElement.temperature : -273
                                    };
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * Renders the visible chunks to the canvas.
     */
    function render() {
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(panX, panY);
        ctx.scale(zoom, zoom);

        const visibleKeys = getVisibleChunkKeys();
        for (const key of visibleKeys) {
            const chunk = world[key];
            if (!chunk) continue;

            const chunkX = chunk.x * CHUNK_SIZE;
            const chunkY = chunk.y * CHUNK_SIZE;

            for (let y = 0; y < CHUNK_SIZE; y++) {
                for (let x = 0; x < CHUNK_SIZE; x++) {
                    const cell = chunk.cells[y][x];
                    if (cell.symbol !== 'VACUUM') {
                        const element = elements[cell.symbol];
                        if (element) {
                            const tempRatio = Math.max(0, Math.min(1, (cell.temperature + 100) / 1100));
                            ctx.fillStyle = getColorForTemperature(tempRatio);
                            ctx.fillRect((chunkX + x) * CELL_SIZE, (chunkY + y) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                        }
                    }
                }
            }
        }

        // Draw celestial bodies
        for (const body of celestialBodies) {
            body.draw(ctx);
        }

        ctx.restore();
        requestAnimationFrame(render);
    }

    function getVisibleChunkKeys() {
        const keys = new Set();
        const startX = -panX / (CELL_SIZE * zoom);
        const startY = -panY / (CELL_SIZE * zoom);
        const endX = startX + canvas.width / (CELL_SIZE * zoom);
        const endY = startY + canvas.height / (CELL_SIZE * zoom);

        const startChunkX = Math.floor(startX / CHUNK_SIZE);
        const startChunkY = Math.floor(startY / CHUNK_SIZE);
        const endChunkX = Math.ceil(endX / CHUNK_SIZE);
        const endChunkY = Math.ceil(endY / CHUNK_SIZE);

        for (let y = startChunkY; y < endChunkY; y++) {
            for (let x = startChunkX; x < endChunkX; x++) {
                keys.add(`${x},${y}`);
            }
        }
        return keys;
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
            .filter(symbol => elements[symbol].atomic_number === undefined && symbol !== 'VACUUM')
            .sort((a,b) => (elements[a].name || a).localeCompare(elements[b].name || b));

        // --- Populate Groups ---
        periodicElements.forEach(symbol => {
            const option = document.createElement('option');
            option.value = symbol;
            option.textContent = `${symbol} - ${elements[symbol].name || symbol}`;
            elementGroup.appendChild(option);
        });

        specialElements.forEach(symbol => {
            const option = document.createElement('option');
            option.value = symbol;
            option.textContent = elements[symbol].name || symbol;
            specialGroup.appendChild(option);
        });

        if (periodicElements.length > 0) {
            elementSelector.appendChild(elementGroup);
        }
        if (specialElements.length > 0) {
            elementSelector.appendChild(specialGroup);
        }

        // Set default element if it exists
        if (elements[currentElement]) {
            elementSelector.value = currentElement;
        } else if (periodicElements.length > 0) {
            currentElement = periodicElements[0];
            elementSelector.value = currentElement;
        } else if (specialElements.length > 0) {
            currentElement = specialElements[0];
            elementSelector.value = currentElement;
        }
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
        const worldX = Math.floor(((e.clientX - rect.left) / zoom - panX) / CELL_SIZE);
        const worldY = Math.floor(((e.clientY - rect.top) / zoom - panY) / CELL_SIZE);

        const radius = Math.floor(brushSize / 2);
        for (let i = -radius; i <= radius; i++) {
            for (let j = -radius; j <= radius; j++) {
                if (Math.sqrt(i * i + j * j) > radius) continue;
                const newX = worldX + j;
                const newY = worldY + i;
                const selectedElement = elements[currentElement];
                if (selectedElement) {
                    setCell(newX, newY, {
                        symbol: currentElement,
                        temperature: selectedElement.temperature || 25
                    });
                }
            }
        }
    }

    /** Updates the info panel based on the cell under the mouse */
    function updateInfoPanel(e) {
        const rect = canvas.getBoundingClientRect();
        const worldX = Math.floor(((e.clientX - rect.left) / zoom - panX) / CELL_SIZE);
        const worldY = Math.floor(((e.clientY - rect.top) / zoom - panY) / CELL_SIZE);

        const cell = getCell(worldX, worldY);
        if (!cell) {
            infoPanel.innerHTML = '<h3>Element Information</h3><p>Hover over the grid to see details.</p>';
            return;
        }

        const element = elements[cell.symbol];
        if (element) {
            infoPanel.innerHTML = `
                <h3>Element Information</h3>
                <p><strong>Coords:</strong> ${worldX}, ${worldY}</p>
                <p><strong>Symbol:</strong> ${element.symbol}</p>
                <p><strong>Name:</strong> ${element.name || 'N/A'}</p>
                <p><strong>State:</strong> ${element.phase_at_stp || 'N/A'}</p>
                <p><strong>Temp:</strong> ${cell.temperature.toFixed(1)}°C</p>
                ${element.atomic_number ? `<p><strong>Atomic #:</strong> ${element.atomic_number}</p>` : ''}
                ${element.density_proxy ? `<p><strong>Density:</strong> ${element.density_proxy}</p>` : ''}
            `;
        } else {
            infoPanel.innerHTML = '<h3>Element Information</h3><p>Unknown element</p>';
        }
    }

    /** Initializes the entire application */
    function init() {
        infoPanel.innerHTML = '<h3>Loading...</h3><p>Loading element data...</p>';
        loadData();
        clearWorld();

        // Event Listeners
        elementSelector.addEventListener('change', (e) => currentElement = e.target.value);
        brushSizeSlider.addEventListener('input', (e) => {
            brushSize = parseInt(e.target.value, 10);
            brushSizeValue.textContent = brushSize;
        });
        zoomSlider.addEventListener('input', (e) => {
            zoom = parseFloat(e.target.value);
            zoomValue.textContent = zoom.toFixed(1);
        });
        panXSlider.addEventListener('input', (e) => {
            panX = parseInt(e.target.value, 10);
            panXValue.textContent = panX;
        });
        panYSlider.addEventListener('input', (e) => {
            panY = parseInt(e.target.value, 10);
            panYValue.textContent = panY;
        });
        startPauseBtn.addEventListener('click', () => {
            isRunning = !isRunning;
            startPauseBtn.textContent = isRunning ? 'Pause' : 'Start';
            if (isRunning) {
                update();
            }
        });
        clearBtn.addEventListener('click', clearWorld);

        let isMouseDown = false;
        canvas.addEventListener('mousedown', (e) => { isMouseDown = true; paint(e); });
        canvas.addEventListener('mouseup', () => isMouseDown = false);
        canvas.addEventListener('mouseleave', () => isMouseDown = false);
        canvas.addEventListener('mousemove', (e) => {
            updateInfoPanel(e);
            if (isMouseDown) paint(e);
        });
        
        createPlanetBtn.addEventListener('click', () => {
            planetModal.style.display = 'block';
            populateElementList();
        });

        closeButton.addEventListener('click', () => {
            planetModal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target == planetModal) {
                planetModal.style.display = 'none';
            }
        });

        addPlanetButton.addEventListener('click', () => {
            const planetComposition = {};
            const inputs = elementList.querySelectorAll('input');
            inputs.forEach(input => {
                if (parseInt(input.value) > 0) {
                    planetComposition[input.dataset.symbol] = parseInt(input.value);
                }
            });
            createPlanet(planetComposition);
            planetModal.style.display = 'none';
        });

        gravityToggle.addEventListener('change', (e) => {
            massBasedGravityEnabled = e.target.checked;
        });

        atmospheresToggle.addEventListener('change', (e) => {
            atmospheresEnabled = e.target.checked;
        });

        coresToggle.addEventListener('change', (e) => {
            coresEnabled = e.target.checked;
        });

        vacuumTempSlider.addEventListener('input', (e) => {
            globalVacuumTemp = parseInt(e.target.value);
            vacuumTempValue.textContent = e.target.value;
        });

        infoPanel.innerHTML = '<h3>Element Information</h3><p>Hover over the grid to see details.</p>';

        render();
    }

    function populateElementList() {
        elementList.innerHTML = '';
        const sortedElements = Object.keys(elements).sort((a, b) => (elements[a].atomic_number || 999) - (elements[b].atomic_number || 999));

        sortedElements.forEach(symbol => {
            if (symbol === 'VACUUM') return;
            const element = elements[symbol];
            const item = document.createElement('div');
            item.className = 'element-item';
            item.innerHTML = `
                <label for="el-${symbol}">${element.name || symbol}</label>
                <input type="number" id="el-${symbol}" data-symbol="${symbol}" value="0" min="0">
            `;
            elementList.appendChild(item);
        });
    }

    function applyMassBasedGravity(nextGrid) {
        const planets = [];
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                if (nextGrid[y][x].symbol === 'PLANET') {
                    planets.push({ x, y, cell: nextGrid[y][x] });
                }
            }
        }

        if (planets.length < 2) return;

        const G = 0.1; // Gravitational constant - needs tweaking

        for (let i = 0; i < planets.length; i++) {
            for (let j = i + 1; j < planets.length; j++) {
                const p1 = planets[i];
                const p2 = planets[j];

                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < 1) distSq = 1; // Avoid division by zero

                const force = G * p1.cell.mass * p2.cell.mass / distSq;

                const angle = Math.atan2(dy, dx);
                const forceX = Math.cos(angle) * force;
                const forceY = Math.sin(angle) * force;

                // Update velocities
                p1.cell.vx += forceX / p1.cell.mass;
                p1.cell.vy += forceY / p1.cell.mass;
                p2.cell.vx -= forceX / p2.cell.mass;
                p2.cell.vy -= forceY / p2.cell.mass;
            }
        }

        // Move planets
        for (const p of planets) {
            const newX = Math.round(p.x + p.cell.vx);
            const newY = Math.round(p.y + p.cell.vy);

            if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE && (newX !== p.x || newY !== p.y)) {
                if (nextGrid[newY][newX].symbol === 'VACUUM') {
                    nextGrid[newY][newX] = p.cell;
                    nextGrid[p.y][p.x] = { symbol: 'VACUUM', temperature: -273 };
                }
            }
        }
    }

    function createPlanet(composition) {
        const rect = canvas.getBoundingClientRect();
        const centerX = Math.floor(((rect.width / 2) - panX) / (CELL_SIZE * zoom));
        const centerY = Math.floor(((rect.height / 2) - panY) / (CELL_SIZE * zoom));

        const newBody = new CelestialBody(centerX, centerY, composition);
        celestialBodies.push(newBody);

        let totalMass = 0;
        for (const symbol in composition) {
            const quantity = composition[symbol];
            const element = elements[symbol];
            if (element && element.mass) {
                totalMass += element.mass * quantity;
            }
        }
        newBody.mass = totalMass;
        newBody.radius = Math.cbrt(totalMass) * 2;

        const radius = newBody.radius;
        for (const symbol in composition) {
            const quantity = composition[symbol];
            const element = elements[symbol];
            if (element) {
                for (let i = 0; i < quantity; i++) {
                    const angle = Math.random() * 2 * Math.PI;
                    const r = Math.random() * radius;
                    const x = Math.floor(centerX + r * Math.cos(angle));
                    const y = Math.floor(centerY + r * Math.sin(angle));
                    setCell(x, y, { symbol: symbol, temperature: element.temperature || 25 });
                }
            }
        }
    }

    init();
});
