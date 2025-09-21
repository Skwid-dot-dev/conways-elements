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
     * Fetches element and rule data from JSON files.
     */
    async function loadData() {
        try {
            const [elementsResponse, compoundsResponse, rulesResponse] = await Promise.all([
                fetch('elements.json'),
                fetch('compounds.json'),
                fetch('rules.json')
            ]);
            const elementsData = await elementsResponse.json();
            const compoundsData = await compoundsResponse.json();
            rules = await rulesResponse.json();

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

        // --- Pass 2: Temperature State Changes ---
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

                if (element.is_life) {
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
     * Handles temperature-based state changes.
     */
    function applyTemperatureEffects(nextGrid) {
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const cell = nextGrid[y][x];
                const element = elements[cell.symbol];

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
                if (currentElement.symbol === 'VACUUM') continue;

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
                        if (belowElement.phase_at_stp !== 'Solid' && density > belowElement.density_proxy) {
                            swap(x, y, x, y + 1);
                        }
                    }
                } else if (phase === 'Liquid') {
                    // Liquids fall and spread
                    if (y < GRID_SIZE - 1) {
                        const belowCell = nextGrid[y + 1][x];
                        const belowElement = elements[belowCell.symbol];
                        if (density > belowElement.density_proxy) {
                            swap(x, y, x, y + 1);
                            continue;
                        }
                    }
                    // Spread to the sides
                    const dir = Math.random() < 0.5 ? 1 : -1;
                    if (x + dir >= 0 && x + dir < GRID_SIZE) {
                         const sideCell = nextGrid[y][x+dir];
                         const sideElement = elements[sideCell.symbol];
                         if (sideElement.phase_at_stp !== 'Solid' && sideElement.phase_at_stp !== 'Liquid') {
                             swap(x,y, x+dir, y);
                             continue;
                         }
                    }

                } else if (phase === 'Gas') {
                    // Gases rise and spread
                    if (y > 0) {
                        const aboveCell = nextGrid[y - 1][x];
                        const aboveElement = elements[aboveCell.symbol];
                        if (density < aboveElement.density_proxy) {
                            swap(x, y, x, y - 1);
                            continue;
                        }
                    }
                     // Spread to the sides
                    const dir = Math.random() < 0.5 ? 1 : -1;
                    if (x + dir >= 0 && x + dir < GRID_SIZE) {
                        const sideCell = nextGrid[y][x + dir];
                        const sideElement = elements[sideCell.symbol];
                        if (sideElement.phase_at_stp === 'Gas' && density > sideElement.density_proxy) {
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
    
    /** Populates the dropdown with elements */
    function populateElementSelector() {
        // A list of symbols that should not appear in the element selector dropdown.
        const nonSelectableSymbols = ['FIRE', 'VACUUM', 'H2O', 'NACL', 'CH4', 'ICE', 'STEAM', 'LIFE', 'DEAD'];

        Object.keys(elements)
            .filter(symbol => !nonSelectableSymbols.includes(symbol))
            .sort((a, b) => (elements[a].atomic_number ?? 1000) - (elements[b].atomic_number ?? 1000))
            .forEach(symbol => {
                const option = document.createElement('option');
                option.value = symbol;
                option.textContent = elements[symbol].name || symbol;
                elementSelector.appendChild(option);
            });
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
    async function init() {
        await loadData();
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
