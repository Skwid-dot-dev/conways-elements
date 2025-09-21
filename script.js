/**
 * Cellular Automata Simulator
 *
 * A browser-based simulator where cells represent chemical elements
 * and interact based on simplified physics and chemistry rules.
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const canvas = document.getElementById('simulationCanvas');
    const ctx = canvas.getContext('2d');
    const elementSelector = document.getElementById('elementSelector');
    const brushSizeSlider = document.getElementById('brushSize');
    const startPauseBtn = document.getElementById('startPauseBtn');
    const clearBtn = document.getElementById('clearBtn');

    // --- Simulation Constants & State ---
    const GRID_SIZE = 100; // The number of cells in the grid's width and height
    const CELL_SIZE = 5;   // The size of each cell in pixels
    canvas.width = GRID_SIZE * CELL_SIZE;
    canvas.height = GRID_SIZE * CELL_SIZE;

    let elements = {};     // Holds the properties of all elements, loaded from JSON
    let grid = [];         // The 2D array representing the simulation world
    let isRunning = false; // Flag to control the simulation loop
    let currentElement = 'C'; // The element symbol currently selected by the user's brush
    let brushSize = 1;     // The size of the user's brush

    // --- Core Functions ---

    /**
     * Fetches element data from the JSON file and initializes special elements.
     */
    async function loadElements() {
        try {
            const response = await fetch('elements.json');
            elements = await response.json();
            // Define special, non-periodic table elements used by the simulation
            elements['VACUUM'] = { symbol: 'VACUUM', color: '#000000', phase_at_stp: 'Gas' };
            elements['FIRE'] = { symbol: 'FIRE', color: '#FF4500', phase_at_stp: 'Gas', lifespan: 15 };
            populateElementSelector();
        } catch (error) {
            console.error("Error loading elements.json:", error);
        }
    }

    /**
     * (Re)sets the simulation grid to its initial state (all VACUUM).
     */
    function initializeGrid() {
        grid = Array(GRID_SIZE).fill(null).map(() =>
            Array(GRID_SIZE).fill(null).map(() => ({ symbol: 'VACUUM' }))
        );
    }

    /**
     * The main simulation loop. Called once per frame when isRunning is true.
     * It processes chemistry and physics in distinct, ordered passes.
     */
    function update() {
        if (!isRunning) return;

        // --- Chemistry Pass ---
        // This pass reads from the current grid and writes to a new grid state (`nextGrid`)
        // to ensure reactions happen based on the state at the beginning of the frame,
        // preventing cascading reactions within a single tick.
        let nextGrid = grid.map(row => row.map(cell => ({ ...cell })));
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const cell = grid[y][x];
                const element = elements[cell.symbol];
                if (!element) continue;

                // Rule 1: Fire decay. If a FIRE cell is past its lifespan, it becomes VACUUM.
                if (cell.symbol === 'FIRE') {
                    const age = (cell.age || 0) + 1;
                    if (age > elements.FIRE.lifespan) {
                        nextGrid[y][x] = { symbol: 'VACUUM' };
                    } else {
                        nextGrid[y][x].age = age;
                    }
                    continue;
                }

                // Rule 2: Oxidation. Flammable elements next to Oxygen have a chance to ignite.
                if (element.flammability) {
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            if (dx === 0 && dy === 0) continue;
                            const nx = x + dx, ny = y + dy;
                            if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && grid[ny][nx].symbol === 'O' && Math.random() < 0.1) {
                                nextGrid[y][x] = { symbol: 'FIRE', age: 0 };
                                nextGrid[ny][nx] = { symbol: 'FIRE', age: 0 };
                            }
                        }
                    }
                }
            }
        }
        grid = nextGrid; // Commit all chemistry changes at once.

        // --- Physics Passes ---
        // These passes modify the grid in-place. The iteration order is crucial to
        // prevent particles from moving multiple cells in one frame.

        // Pass 1: Solids/Liquids Gravity (Falling and Spreading)
        // Iterates from the bottom-up to ensure particles fall correctly.
        for (let y = GRID_SIZE - 2; y >= 0; y--) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const element = elements[grid[y][x].symbol];
                if (!element || element.phase_at_stp === 'Gas') continue;

                // Check if the cell below is a gas (or vacuum), and fall straight down if so.
                const belowElement = elements[grid[y + 1][x].symbol];
                if (belowElement.phase_at_stp === 'Gas') {
                    [grid[y][x], grid[y + 1][x]] = [grid[y + 1][x], grid[y][x]]; // Swap
                    continue;
                }

                // If blocked below, try to slide diagonally.
                const dir = Math.random() < 0.5 ? 1 : -1; // Check left or right first randomly
                for (let i = 0; i < 2; i++) {
                    const checkX = x + (i === 0 ? dir : -dir);
                    if (checkX >= 0 && checkX < GRID_SIZE) {
                        const diagBelowElement = elements[grid[y + 1][checkX].symbol];
                        if (diagBelowElement.phase_at_stp === 'Gas') {
                            [grid[y][x], grid[y + 1][checkX]] = [grid[y + 1][checkX], grid[y][x]];
                            break; // Moved, so stop checking the other diagonal
                        }
                    }
                }
            }
        }

        // Pass 2: Gas Rising
        // Iterates from the top-down.
        for (let y = 1; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const element = elements[grid[y][x].symbol];
                if (element && element.phase_at_stp === 'Gas' && grid[y][x].symbol !== 'VACUUM') {
                    // Swap with VACUUM above to rise.
                    if (grid[y - 1][x].symbol === 'VACUUM') {
                        [grid[y][x], grid[y - 1][x]] = [grid[y - 1][x], grid[y][x]];
                    }
                }
            }
        }

        // Pass 3: Diffusion (Liquids and Gases)
        // Uses a `processed` grid to ensure each cell only diffuses once per frame.
        const processed = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false));
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                if (processed[y][x]) continue;
                const cell = grid[y][x];
                const element = elements[cell.symbol];
                if (!element || (element.phase_at_stp !== 'Liquid' && element.phase_at_stp !== 'Gas') || cell.symbol === 'VACUUM') continue;

                const dir = Math.random() < 0.5 ? 1 : -1; // Randomly check left or right
                const checkX = x + dir;
                if (checkX >= 0 && checkX < GRID_SIZE && !processed[y][checkX]) {
                    const neighbor = grid[y][checkX];
                    const neighborElement = elements[neighbor.symbol];
                    // Liquids diffuse into gases; gases diffuse into other gases.
                    const shouldSwap = (element.phase_at_stp === 'Liquid' && neighborElement.phase_at_stp === 'Gas') ||
                                     (element.phase_at_stp === 'Gas' && neighborElement.phase_at_stp === 'Gas');
                    if (shouldSwap) {
                        [grid[y][x], grid[y][checkX]] = [grid[y][checkX], grid[y][x]];
                        processed[y][x] = processed[y][checkX] = true;
                    }
                }
            }
        }

        requestAnimationFrame(update);
    }

    /**
     * Renders the current state of the grid to the canvas.
     * Called on every animation frame to ensure a smooth display.
     */
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const symbol = grid[y][x].symbol;
                if (elements[symbol]) {
                    ctx.fillStyle = elements[symbol].color;
                    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                }
            }
        }
        requestAnimationFrame(render);
    }

    // --- UI Functions & Event Listeners ---

    /**
     * Populates the element selector dropdown with elements from the loaded data.
     */
    function populateElementSelector() {
        // Sort elements by atomic number for a clean, ordered list.
        const sortedElements = Object.keys(elements).sort((a, b) => (elements[a].atomic_number ?? 1000) - (elements[b].atomic_number ?? 1000));
        sortedElements.forEach(symbol => {
            if (symbol === 'FIRE' || symbol === 'VACUUM') return; // Don't let user select these
            const option = document.createElement('option');
            option.value = symbol;
            option.textContent = symbol;
            elementSelector.appendChild(option);
        });
        elementSelector.value = currentElement; // Set to default 'C'
    }

    elementSelector.addEventListener('change', (e) => currentElement = e.target.value);
    brushSizeSlider.addEventListener('input', (e) => brushSize = parseInt(e.target.value, 10));

    startPauseBtn.addEventListener('click', () => {
        isRunning = !isRunning;
        startPauseBtn.textContent = isRunning ? 'Pause' : 'Start';
        if (isRunning) update();
    });

    clearBtn.addEventListener('click', initializeGrid);

    // Mouse listeners for painting elements onto the canvas
    let isMouseDown = false;
    canvas.addEventListener('mousedown', (e) => { isMouseDown = true; paint(e); });
    canvas.addEventListener('mouseup', () => isMouseDown = false);
    canvas.addEventListener('mouseleave', () => isMouseDown = false);
    canvas.addEventListener('mousemove', (e) => { if (isMouseDown) paint(e); });

    /**
     * Paints the currently selected element onto the grid based on mouse coordinates.
     * @param {MouseEvent} e The mouse event.
     */
    function paint(e) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
        const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
        const radius = Math.floor(brushSize / 2);
        // Paint in a circular area based on brush size
        for (let i = -radius; i <= radius; i++) {
            for (let j = -radius; j <= radius; j++) {
                if (Math.sqrt(i*i + j*j) > radius) continue;
                const newX = x + j;
                const newY = y + i;
                if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
                    grid[newY][newX] = { symbol: currentElement };
                }
            }
        }
    }

    /**
     * The main entry point for the application.
     */
    async function init() {
        await loadElements();
        initializeGrid();
        render(); // Start the rendering loop (it's independent of the update loop)
    }

    init();
});
