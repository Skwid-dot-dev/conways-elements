/**
 * @file ui.js
 * Manages all DOM interactions, event listeners, and UI updates.
 */

import { getElements, getRules } from './data.js';

// --- DOM Element References ---
const dom = {
    canvas: document.getElementById('simulationCanvas'),
    elementSelector: document.getElementById('elementSelector'),
    brushSizeSlider: document.getElementById('brushSize'),
    brushSizeValue: document.getElementById('brushSizeValue'),
    startPauseBtn: document.getElementById('startPauseBtn'),
    clearBtn: document.getElementById('clearBtn'),
    infoPanel: document.getElementById('infoPanel'),
    rulesetContainer: document.getElementById('ruleset'),
    zoomSlider: document.getElementById('zoomSlider'),
    zoomValue: document.getElementById('zoomValue'),
    panXSlider: document.getElementById('panXSlider'),
    panXValue: document.getElementById('panXValue'),
    panYSlider: document.getElementById('panYSlider'),
    panYValue: document.getElementById('panYValue'),
    createPlanetBtn: document.getElementById('createPlanetBtn'),
    planetModal: document.getElementById('planetModal'),
    closeButton: document.querySelector('.close-button'),
    elementList: document.getElementById('elementList'),
    addPlanetButton: document.getElementById('addPlanetButton'),
    gravityToggle: document.getElementById('gravityToggle'),
    returnToSpaceBtn: document.getElementById('returnToSpaceBtn'),
    atmospheresToggle: document.getElementById('atmospheresToggle'),
    coresToggle: document.getElementById('coresToggle'),
    vacuumTempSlider: document.getElementById('vacuumTempSlider'),
    vacuumTempValue: document.getElementById('vacuumTempValue'),
};

/**
 * Populates the dropdown with categorized elements and compounds.
 * @param {string} currentElement - The symbol of the currently selected element.
 */
function populateElementSelector(currentElement) {
    const elements = getElements();
    dom.elementSelector.innerHTML = '';

    const elementGroup = document.createElement('optgroup');
    elementGroup.label = 'Elements';

    const specialGroup = document.createElement('optgroup');
    specialGroup.label = 'Special';

    const periodicElements = Object.keys(elements)
        .filter(symbol => elements[symbol].atomic_number !== undefined)
        .sort((a, b) => elements[a].atomic_number - elements[b].atomic_number);

    const specialElements = Object.keys(elements)
        .filter(symbol => elements[symbol].atomic_number === undefined && symbol !== 'VACUUM')
        .sort((a,b) => (elements[a].name || a).localeCompare(elements[b].name || b));

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
        dom.elementSelector.appendChild(elementGroup);
    }
    if (specialElements.length > 0) {
        dom.elementSelector.appendChild(specialGroup);
    }

    if (elements[currentElement]) {
        dom.elementSelector.value = currentElement;
    } else if (periodicElements.length > 0) {
        dom.elementSelector.value = periodicElements[0];
    } else if (specialElements.length > 0) {
        dom.elementSelector.value = specialElements[0];
    }
}

/**
 * Populates the ruleset container with toggleable checkboxes.
 */
function populateRuleset() {
    const rules = getRules();
    dom.rulesetContainer.innerHTML = '<h3>Interaction Rules</h3>';
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

        let description = '';
        if (rule.reactants) {
            const reactants = [rule.reactants.center, ...(rule.reactants.neighbors || [])].join(' + ');
            const products = rule.products.center;
            description = `${reactants} → ${products}`;
        } else if (rule.is_combustion) {
            description = 'Flammable + Oxygen → Fire';
        }

        if (description) {
            const descSpan = document.createElement('span');
            descSpan.className = 'rule-description';
            descSpan.textContent = ` (${description})`;
            label.appendChild(descSpan);
        }

        container.appendChild(checkbox);
        container.appendChild(label);
        dom.rulesetContainer.appendChild(container);
    });
}

/**
 * Updates the info panel with details about the hovered cell.
 * @param {object} cell - The cell object from the simulation.
 * @param {number} x - The x-coordinate of the cell.
 * @param {number} y - The y-coordinate of the cell.
 */
function updateInfoPanel(cell, x, y) {
    if (!cell) {
        dom.infoPanel.innerHTML = '<h3>Element Information</h3><p>Hover over the grid to see details.</p>';
        return;
    }
    const elements = getElements();
    const element = elements[cell.symbol];
    if (element) {
        dom.infoPanel.innerHTML = `
            <h3>Element Information</h3>
            <p><strong>Coords:</strong> ${x}, ${y}</p>
            <p><strong>Symbol:</strong> ${element.symbol}</p>
            <p><strong>Name:</strong> ${element.name || 'N/A'}</p>
            <p><strong>State:</strong> ${element.phase_at_stp || 'N/A'}</p>
            <p><strong>Temp:</strong> ${cell.temperature.toFixed(1)}°C</p>
            ${element.atomic_number ? `<p><strong>Atomic #:</strong> ${element.atomic_number}</p>` : ''}
            ${element.density_proxy ? `<p><strong>Density:</strong> ${element.density_proxy}</p>` : ''}
        `;
    } else {
        dom.infoPanel.innerHTML = '<h3>Element Information</h3><p>Unknown element</p>';
    }
}

/**
 * Initializes all event listeners for the UI controls.
 * @param {object} handlers - An object containing handler functions for UI events.
 */
function initEventListeners(handlers) {
    dom.elementSelector.addEventListener('change', (e) => handlers.onElementChange(e.target.value));
    dom.brushSizeSlider.addEventListener('input', (e) => {
        const size = parseInt(e.target.value, 10);
        dom.brushSizeValue.textContent = size;
        handlers.onBrushSizeChange(size);
    });
    dom.zoomSlider.addEventListener('input', (e) => {
        const zoom = parseFloat(e.target.value);
        dom.zoomValue.textContent = zoom.toFixed(1);
        handlers.onZoomChange(zoom);
    });
    dom.panXSlider.addEventListener('input', (e) => {
        const panX = parseInt(e.target.value, 10);
        dom.panXValue.textContent = panX;
        handlers.onPanXChange(panX);
    });
    dom.panYSlider.addEventListener('input', (e) => {
        const panY = parseInt(e.target.value, 10);
        dom.panYValue.textContent = panY;
        handlers.onPanYChange(panY);
    });
    dom.startPauseBtn.addEventListener('click', () => {
        const isRunning = handlers.onStartPause();
        dom.startPauseBtn.textContent = isRunning ? 'Pause' : 'Start';
    });
    dom.clearBtn.addEventListener('click', handlers.onClear);

    let isMouseDown = false;
    dom.canvas.addEventListener('mousedown', (e) => {
        isMouseDown = true;
        handlers.onPaint(e);
    });
    dom.canvas.addEventListener('mouseup', () => isMouseDown = false);
    dom.canvas.addEventListener('mouseleave', () => isMouseDown = false);
    dom.canvas.addEventListener('mousemove', (e) => {
        handlers.onMouseMove(e);
        if (isMouseDown) {
            handlers.onPaint(e);
        }
    });

    dom.canvas.addEventListener('contextmenu', handlers.onRightClick);
    dom.returnToSpaceBtn.addEventListener('click', handlers.onReturnToSpace);

    dom.createPlanetBtn.addEventListener('click', () => {
        dom.planetModal.style.display = 'block';
        populateElementList();
    });

    dom.closeButton.addEventListener('click', () => {
        dom.planetModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target == dom.planetModal) {
            dom.planetModal.style.display = 'none';
        }
    });

    dom.addPlanetButton.addEventListener('click', () => {
        const planetComposition = {};
        const inputs = dom.elementList.querySelectorAll('input');
        inputs.forEach(input => {
            if (parseInt(input.value) > 0) {
                planetComposition[input.dataset.symbol] = parseInt(input.value);
            }
        });
        handlers.onCreatePlanet(planetComposition);
        dom.planetModal.style.display = 'none';
    });

    dom.gravityToggle.addEventListener('change', (e) => handlers.onToggleGravity(e.target.checked));
    dom.atmospheresToggle.addEventListener('change', (e) => handlers.onToggleAtmospheres(e.target.checked));
    dom.coresToggle.addEventListener('change', (e) => handlers.onToggleCores(e.target.checked));
    dom.vacuumTempSlider.addEventListener('input', (e) => {
        const temp = parseInt(e.target.value);
        dom.vacuumTempValue.textContent = temp;
        handlers.onVacuumTempChange(temp);
    });
}

/**
 * Populates the list of elements in the planet creation modal.
 */
function populateElementList() {
    const elements = getElements();
    dom.elementList.innerHTML = '';
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
        dom.elementList.appendChild(item);
    });
}

/**
 * Initializes the UI components.
 * @param {string} currentElement - The initially selected element.
 */
function initUI(currentElement) {
    populateElementSelector(currentElement);
    populateRuleset();
    dom.infoPanel.innerHTML = '<h3>Element Information</h3><p>Hover over the grid to see details.</p>';
}

export { dom, initUI, initEventListeners, updateInfoPanel };
