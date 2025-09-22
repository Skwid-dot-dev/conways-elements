/**
 * @file simulation.js
 * Main simulation controller.
 */

import { loadData, getElements } from './data.js';
import { dom, initUI, initEventListeners, updateInfoPanel } from './ui.js';
import {
    CelestialBody,
    clearWorld,
    setCell,
    getWorld,
    getCelestialBodies,
    addCelestialBody,
    setWorld,
} from './world.js';
import { updateSpace, updatePlanetSurface } from './engine.js';
import { render, getVisibleChunkKeys } from './renderer.js';
import { CELL_SIZE } from './constants.js';

let state = {
    isRunning: false,
    currentElement: 'C',
    brushSize: 1,
    zoom: 1,
    panX: 0,
    panY: 0,
    massBasedGravityEnabled: true,
    atmospheresEnabled: true,
    coresEnabled: true,
    globalVacuumTemp: -273,
    simulationView: {
        mode: 'space', // 'space' or 'planet'
        body: null,
    },
    planetGrid: null,
};

function update() {
    if (!state.isRunning) return;

    if (state.simulationView.mode === 'space') {
        const world = getWorld();
        const visibleKeys = getVisibleChunkKeys(state);
        updateSpace(world, visibleKeys);
    } else if (state.simulationView.mode === 'planet') {
        state.planetGrid = updatePlanetSurface(state.planetGrid, state.simulationView.body);
    }

    render(state);
    requestAnimationFrame(update);
}

const handlers = {
    onElementChange: (element) => (state.currentElement = element),
    onBrushSizeChange: (size) => (state.brushSize = size),
    onZoomChange: (zoom) => (state.zoom = zoom),
    onPanXChange: (panX) => (state.panX = panX),
    onPanYChange: (panY) => (state.panY = panY),
    onStartPause: () => {
        state.isRunning = !state.isRunning;
        if (state.isRunning) {
            update();
        }
        return state.isRunning;
    },
    onClear: clearWorld,
    onPaint: (e) => {
        const rect = dom.canvas.getBoundingClientRect();
        const selectedElement = getElements()[state.currentElement];
        if (!selectedElement) return;

        const radius = Math.floor(state.brushSize / 2);

        if (state.simulationView.mode === 'space') {
            const worldX = Math.floor(((e.clientX - rect.left) - state.panX) / state.zoom / CELL_SIZE);
            const worldY = Math.floor(((e.clientY - rect.top) - state.panY) / state.zoom / CELL_SIZE);

            for (let i = -radius; i <= radius; i++) {
                for (let j = -radius; j <= radius; j++) {
                    if (Math.sqrt(i * i + j * j) > radius) continue;
                    const newX = worldX + j;
                    const newY = worldY + i;
                    setCell(newX, newY, {
                        symbol: state.currentElement,
                        temperature: selectedElement.temperature || 25
                    }, state.globalVacuumTemp);
                }
            }
        } else if (state.simulationView.mode === 'planet' && state.planetGrid) {
            const gridX = Math.floor((e.clientX - rect.left) / CELL_SIZE);
            const gridY = Math.floor((e.clientY - rect.top) / CELL_SIZE);
            const gridHeight = state.planetGrid.length;
            const gridWidth = state.planetGrid[0].length;

            for (let i = -radius; i <= radius; i++) {
                for (let j = -radius; j <= radius; j++) {
                    if (Math.sqrt(i * i + j * j) > radius) continue;
                    const newX = gridX + j;
                    const newY = gridY + i;

                    if (newX >= 0 && newX < gridWidth && newY >= 0 && newY < gridHeight) {
                        state.planetGrid[newY][newX] = {
                            symbol: state.currentElement,
                            temperature: selectedElement.temperature || 25
                        };
                    }
                }
            }
        }
    },
    onMouseMove: (e) => {
        const rect = dom.canvas.getBoundingClientRect();
        let cell = null;
        let x = 0, y = 0;

        if (state.simulationView.mode === 'space') {
            x = Math.floor(((e.clientX - rect.left) - state.panX) / state.zoom / CELL_SIZE);
            y = Math.floor(((e.clientY - rect.top) - state.panY) / state.zoom / CELL_SIZE);
            cell = getCell(x, y, state.globalVacuumTemp);
        } else if (state.simulationView.mode === 'planet' && state.planetGrid) {
            x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
            y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
            const gridHeight = state.planetGrid.length;
            const gridWidth = state.planetGrid[0].length;
            if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
                cell = state.planetGrid[y][x];
            }
        }
        updateInfoPanel(cell, x, y);
    },
    onRightClick: (e) => {
        e.preventDefault();
        if (state.simulationView.mode !== 'space') return;

        const rect = dom.canvas.getBoundingClientRect();
        const worldX = ((e.clientX - rect.left) / state.zoom - state.panX) / CELL_SIZE;
        const worldY = ((e.clientY - rect.top) / state.zoom - state.panY) / CELL_SIZE;

        const celestialBodies = getCelestialBodies();
        for (const body of celestialBodies) {
            const dx = worldX - body.x;
            const dy = worldY - body.y;
            const distanceSq = dx * dx + dy * dy;

            if (distanceSq <= body.radius * body.radius) {
                initPlanetView(body);
                return;
            }
        }
    },
    onReturnToSpace: () => {
        state.simulationView.mode = 'space';
        state.simulationView.body = null;
        state.planetGrid = null;

        dom.returnToSpaceBtn.style.display = 'none';
        dom.createPlanetBtn.style.display = 'block';
    },
    onCreatePlanet: (composition) => {
        const rect = dom.canvas.getBoundingClientRect();
        const centerX = Math.floor(((rect.width / 2) - state.panX) / (CELL_SIZE * state.zoom));
        const centerY = Math.floor(((rect.height / 2) - state.panY) / (CELL_SIZE * state.zoom));

        const newBody = new CelestialBody(centerX, centerY, composition);

        let totalMass = 0;
        const elements = getElements();
        for (const symbol in composition) {
            const quantity = composition[symbol];
            const element = elements[symbol];
            if (element && element.mass) {
                totalMass += element.mass * quantity;
            }
        }
        newBody.mass = totalMass;
        newBody.radius = Math.cbrt(totalMass) * 2;

        addCelestialBody(newBody);
    },
    onToggleGravity: (enabled) => (state.massBasedGravityEnabled = enabled),
    onToggleAtmospheres: (enabled) => (state.atmospheresEnabled = enabled),
    onToggleCores: (enabled) => (state.coresEnabled = enabled),
    onVacuumTempChange: (temp) => (state.globalVacuumTemp = temp),
};

function initPlanetView(body) {
    state.simulationView.mode = 'planet';
    state.simulationView.body = body;

    dom.returnToSpaceBtn.style.display = 'block';
    dom.createPlanetBtn.style.display = 'none';

    const wasRunning = state.isRunning;
    if (wasRunning) {
        handlers.onStartPause();
    }

    const gridWidth = Math.max(100, Math.floor(body.radius * 10));
    const gridHeight = Math.max(50, Math.floor(body.radius * 5));

    state.planetGrid = Array(gridHeight).fill(null).map(() =>
        Array(gridWidth).fill(null).map(() => ({ symbol: 'VACUUM', temperature: body.temperature || 25 }))
    );

    const materials = [];
    const elements = getElements();
    for (const symbol in body.composition) {
        const count = body.composition[symbol];
        const element = elements[symbol];
        if (element) {
            for (let i = 0; i < count; i++) {
                materials.push(element);
            }
        }
    }
    materials.sort((a, b) => (b.density_proxy || 0) - (a.density_proxy || 0));

    let currentY = gridHeight - 1;
    let currentX = 0;
    for (const material of materials) {
        if (currentY >= 0) {
            state.planetGrid[currentY][currentX] = { symbol: material.symbol, temperature: material.temperature || 25 };
            currentX++;
            if (currentX >= gridWidth) {
                currentX = 0;
                currentY--;
            }
        }
    }

    if (wasRunning) {
        handlers.onStartPause();
    }
}

export async function init() {
    dom.canvas.width = window.innerWidth * 0.7;
    dom.canvas.height = window.innerHeight * 0.9;

    await loadData();
    initUI(state.currentElement);
    initEventListeners(handlers);
    clearWorld();
    render(state);
}

export function getState() {
    return state;
}
