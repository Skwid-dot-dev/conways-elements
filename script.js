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
    const GRID_SIZE = 100;
    const CELL_SIZE = 5;
    canvas.width = GRID_SIZE * CELL_SIZE;
    canvas.height = GRID_SIZE * CELL_SIZE;

    let elements = {};
    let grid = [];
    let isRunning = false;
    let currentElement = 'C';
    let brushSize = 1;

    // --- Core Functions ---

    async function loadElements() {
        try {
            const response = await fetch('elements.json');
            elements = await response.json();
            // Define special elements
            elements['VACUUM'] = { symbol: 'VACUUM', color: '#000000', phase_at_stp: 'Gas' };
            elements['FIRE'] = { symbol: 'FIRE', color: '#FF4500', phase_at_stp: 'Gas', lifespan: 15 };
            elements['H2O'] = { symbol: 'H2O', name: 'Water', color: '#3498DB', phase_at_stp: 'Liquid' };
            elements['NACL'] = { symbol: 'NACL', name: 'Salt', color: '#FDFEFE', phase_at_stp: 'Solid' };
            elements['T'] = { symbol: 'T', name: 'Trigger', color: '#E74C3C', phase_at_stp: 'Solid' };
            elements['CH4'] = { symbol: 'CH4', name: 'Methane', color: '#B2FF66', phase_at_stp: 'Gas', flammability: true };
            populateElementSelector();
        } catch (error) {
            console.error("Error loading elements.json:", error);
        }
    }

    function initializeGrid() {
        grid = Array(GRID_SIZE).fill(null).map(() =>
            Array(GRID_SIZE).fill(null).map(() => ({ symbol: 'VACUUM', is_energized: false }))
        );
    }

    function update() {
        if (!isRunning) return;

        let nextGrid = grid.map(row => row.map(cell => ({ ...cell })));

        // --- Pass 1: Signal Propagation ---
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const cell = grid[y][x];
                const element = elements[cell.symbol];

                if (cell.is_energized) nextGrid[y][x].is_energized = false;

                if (cell.symbol === 'T' && cell.is_active) {
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            if (dx === 0 && dy === 0) continue;
                            const nx = x + dx, ny = y + dy;
                            if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && elements[grid[ny][nx].symbol]?.conductive) {
                                nextGrid[ny][nx].is_energized = true;
                            }
                        }
                    }
                }

                if (element?.conductive && cell.is_energized) {
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            if (dx === 0 && dy === 0) continue;
                            const nx = x + dx, ny = y + dy;
                            if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && elements[grid[ny][nx].symbol]?.conductive && !grid[ny][nx].is_energized) {
                                nextGrid[ny][nx].is_energized = true;
                            }
                        }
                    }
                }
            }
        }

        // --- Pass 2: Chemistry ---
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const cell = grid[y][x];
                const element = elements[cell.symbol];
                if (!element) continue;

                if (cell.symbol === 'FIRE') {
                    const age = (cell.age || 0) + 1;
                    if (age > elements.FIRE.lifespan) nextGrid[y][x] = { symbol: 'VACUUM' }; else nextGrid[y][x].age = age;
                    continue;
                }

                if (cell.symbol === 'O') {
                    const neighbors = [];
                    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
                        if (dx === 0 && dy === 0) continue;
                        const nx = x + dx, ny = y + dy;
                        if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) neighbors.push({x: nx, y: ny, symbol: grid[ny][nx].symbol});
                    }
                    const hydrogenNeighbors = neighbors.filter(n => n.symbol === 'H');
                    if (hydrogenNeighbors.length >= 2) {
                        nextGrid[y][x] = { symbol: 'H2O' };
                        nextGrid[hydrogenNeighbors[0].y][hydrogenNeighbors[0].x] = { symbol: 'VACUUM' };
                        nextGrid[hydrogenNeighbors[1].y][hydrogenNeighbors[1].x] = { symbol: 'VACUUM' };
                    }
                }

                if (cell.symbol === 'NA' || cell.symbol === 'CL') {
                     for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
                        if (dx === 0 && dy === 0) continue;
                        const nx = x + dx, ny = y + dy;
                        if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
                            const neighborSymbol = grid[ny][nx].symbol;
                            if (((cell.symbol === 'NA' && neighborSymbol === 'CL') || (cell.symbol === 'CL' && neighborSymbol === 'NA')) && Math.random() < 0.2) {
                               nextGrid[y][x] = { symbol: 'NACL' };
                               nextGrid[ny][nx] = { symbol: 'VACUUM' };
                            }
                        }
                    }
                }

                if (cell.symbol === 'C') {
                    const neighbors = [];
                    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
                        if (dx === 0 && dy === 0) continue;
                        const nx = x + dx, ny = y + dy;
                        if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) neighbors.push({x: nx, y: ny, symbol: grid[ny][nx].symbol});
                    }
                    const hydrogenNeighbors = neighbors.filter(n => n.symbol === 'H');
                    if (hydrogenNeighbors.length >= 4 && Math.random() < 0.05) {
                        nextGrid[y][x] = { symbol: 'CH4' };
                        for(let i = 0; i < 4; i++) {
                            nextGrid[hydrogenNeighbors[i].y][hydrogenNeighbors[i].x] = { symbol: 'VACUUM' };
                        }
                    }
                }

                if (element.flammability) {
                    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
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
        grid = nextGrid;

        // --- Pass 3: Physics ---
        for (let y = GRID_SIZE - 2; y >= 0; y--) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const cell = grid[y][x];
                const element = elements[cell.symbol];
                if (!element || element.phase_at_stp === 'Gas') continue;

                if (cell.symbol === 'NACL') {
                    let hasNaClNeighbor = false;
                    for (let dy = -1; dy <= 1; dy++) { for (let dx = -1; dx <= 1; dx++) {
                        if (dx === 0 && dy === 0) continue;
                        const nx = x + dx, ny = y + dy;
                        if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && grid[ny][nx].symbol === 'NACL') {
                            hasNaClNeighbor = true; break;
                        }
                    } if (hasNaClNeighbor) break; }
                    if (hasNaClNeighbor) continue;
                }

                const belowElement = elements[grid[y + 1][x].symbol];
                if (belowElement.phase_at_stp === 'Gas') {
                    [grid[y][x], grid[y + 1][x]] = [grid[y + 1][x], grid[y][x]];
                    continue;
                }

                const dir = Math.random() < 0.5 ? 1 : -1;
                for (let i = 0; i < 2; i++) {
                    const checkX = x + (i === 0 ? dir : -dir);
                    if (checkX >= 0 && checkX < GRID_SIZE && elements[grid[y + 1][checkX].symbol].phase_at_stp === 'Gas') {
                        [grid[y][x], grid[y + 1][checkX]] = [grid[y + 1][checkX], grid[y][x]];
                        break;
                    }
                }
            }
        }

        for (let y = 1; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const element = elements[grid[y][x].symbol];
                if (element?.phase_at_stp === 'Gas' && grid[y][x].symbol !== 'VACUUM' && grid[y-1][x].symbol === 'VACUUM') {
                    [grid[y][x], grid[y - 1][x]] = [grid[y - 1][x], grid[y][x]];
                }
            }
        }

        const processed = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false));
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                if (processed[y][x]) continue;
                const cell = grid[y][x];
                const element = elements[cell.symbol];
                if (!element || (element.phase_at_stp !== 'Liquid' && element.phase_at_stp !== 'Gas') || cell.symbol === 'VACUUM') continue;
                const dir = Math.random() < 0.5 ? 1 : -1;
                const checkX = x + dir;
                if (checkX >= 0 && checkX < GRID_SIZE && !processed[y][checkX]) {
                    const neighborElement = elements[grid[y][checkX].symbol];
                    const shouldSwap = (element.phase_at_stp === 'Liquid' && neighborElement.phase_at_stp === 'Gas') || (element.phase_at_stp === 'Gas' && neighborElement.phase_at_stp === 'Gas');
                    if (shouldSwap) {
                        [grid[y][x], grid[y][checkX]] = [grid[y][checkX], grid[y][x]];
                        processed[y][x] = processed[y][checkX] = true;
                    }
                }
            }
        }

        requestAnimationFrame(update);
    }

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const cell = grid[y][x];
                const element = elements[cell.symbol];
                if (element) {
                    ctx.fillStyle = (element.conductive && cell.is_energized) ? '#F1C40F' : element.color;
                    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                }
            }
        }
        requestAnimationFrame(render);
    }

    function populateElementSelector() {
        const sortedElements = Object.keys(elements).sort((a, b) => (elements[a].atomic_number ?? 1000) - (elements[b].atomic_number ?? 1000));
        sortedElements.forEach(symbol => {
            if (['FIRE', 'VACUUM', 'H2O', 'NACL', 'CH4'].includes(symbol)) return;
            const option = document.createElement('option');
            option.value = symbol;
            option.textContent = symbol;
            elementSelector.appendChild(option);
        });
        elementSelector.value = currentElement;
    }

    function paint(e) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
        const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);

        if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return;

        if (grid[y][x].symbol === 'T') {
            grid[y][x].is_active = !grid[y][x].is_active;
            return;
        }

        const radius = Math.floor(brushSize / 2);
        for (let i = -radius; i <= radius; i++) {
            for (let j = -radius; j <= radius; j++) {
                if (Math.sqrt(i*i + j*j) > radius) continue;
                const newX = x + j;
                const newY = y + i;
                if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
                    grid[newY][newX] = { symbol: currentElement, is_energized: false };
                }
            }
        }
    }

    async function init() {
        await loadElements();
        initializeGrid();
        elementSelector.addEventListener('change', (e) => currentElement = e.target.value);
        brushSizeSlider.addEventListener('input', (e) => brushSize = parseInt(e.target.value, 10));
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
        canvas.addEventListener('mousemove', (e) => { if (isMouseDown) paint(e); });
        render();
    }

    init();
});
