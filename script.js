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
            const [elementsResponse, rulesResponse] = await Promise.all([
                fetch('elements.json'),
                fetch('rules.json')
            ]);
            elements = await elementsResponse.json();
            rules = await rulesResponse.json();

            // Define special runtime elements
            elements['VACUUM'] = { symbol: 'VACUUM', name: 'Vacuum', color: '#000000', phase_at_stp: 'Gas', temperature: -273 };
            elements['FIRE'] = { symbol: 'FIRE', name: 'Fire', color: '#FF4500', phase_at_stp: 'Gas', lifespan: 15, temperature: 800 };
            elements['H2O'] = { symbol: 'H2O', name: 'Water', color: '#3498DB', phase_at_stp: 'Liquid', temperature: 25 };
            elements['NACL'] = { symbol: 'NACL', name: 'Salt', color: '#FDFEFE', phase_at_stp: 'Solid', temperature: 25 };
            elements['CH4'] = { symbol: 'CH4', name: 'Methane', color: '#B2FF66', phase_at_stp: 'Gas', flammability: true, temperature: 25 };

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

        // --- Pass 2: Chemistry (Rules Engine) ---
        applyRules(nextGrid);

        // --- Pass 3: Physics (Gravity, Gas/Liquid movement) ---
        // Your existing physics simulation logic from the repo goes here.
        // For brevity, I am omitting the large physics block, but you should copy it here.
        // Make sure to use `nextGrid` for reads and writes, then assign `grid = nextGrid` at the end.


        grid = nextGrid;
        requestAnimationFrame(update);
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
        Object.keys(elements)
            .filter(s => !['FIRE', 'VACUUM', 'H2O', 'NACL', 'CH4'].includes(s))
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
