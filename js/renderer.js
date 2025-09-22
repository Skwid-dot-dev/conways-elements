/**
 * @file renderer.js
 * Handles all canvas drawing.
 */

import { dom } from './ui.js';
import { getElements } from './data.js';
import { getWorld, getCelestialBodies } from './world.js';
import { CHUNK_SIZE, CELL_SIZE } from './constants.js';

const ctx = dom.canvas.getContext('2d');

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

function getColorForTemperature(ratio) {
    const coldColor = "#00BFFF";
    const neutralColor = "#FFFFFF";
    const hotColor = "#FF4500";

    if (ratio < 0.5) {
        return interpolateColor(coldColor, neutralColor, ratio * 2);
    } else {
        return interpolateColor(neutralColor, hotColor, (ratio - 0.5) * 2);
    }
}

function drawCelestialBody(body, state) {
    if (state.coresEnabled) {
        ctx.fillStyle = 'rgba(255, 100, 0, 0.8)';
        ctx.beginPath();
        ctx.arc(body.x * CELL_SIZE, body.y * CELL_SIZE, body.radius * CELL_SIZE / 2, 0, 2 * Math.PI);
        ctx.fill();
    }

    ctx.fillStyle = 'grey';
    ctx.beginPath();
    ctx.arc(body.x * CELL_SIZE, body.y * CELL_SIZE, body.radius * CELL_SIZE, 0, 2 * Math.PI);
    ctx.fill();

    if (state.atmospheresEnabled) {
        const atmosphereGrad = ctx.createRadialGradient(
            body.x * CELL_SIZE, body.y * CELL_SIZE, body.radius * CELL_SIZE,
            body.x * CELL_SIZE, body.y * CELL_SIZE, body.radius * CELL_SIZE * 1.5
        );
        atmosphereGrad.addColorStop(0, 'rgba(173, 216, 230, 0.5)');
        atmosphereGrad.addColorStop(1, 'rgba(173, 216, 230, 0)');
        ctx.fillStyle = atmosphereGrad;
        ctx.beginPath();
        ctx.arc(body.x * CELL_SIZE, body.y * CELL_SIZE, body.radius * CELL_SIZE * 1.5, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function renderSpace(state) {
    const { panX, panY, zoom } = state;
    const world = getWorld();
    const celestialBodies = getCelestialBodies();
    const elements = getElements();

    ctx.translate(panX, panY);
    ctx.scale(zoom, zoom);

    const visibleKeys = getVisibleChunkKeys(state);
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

    for (const body of celestialBodies) {
        drawCelestialBody(body, state);
    }
}

function renderPlanetSurface(state) {
    const { planetGrid } = state;
    const elements = getElements();
    if (!planetGrid) return;

    const gridWidth = planetGrid[0].length;
    const gridHeight = planetGrid.length;

    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            const cell = planetGrid[y][x];
            if (cell.symbol !== 'VACUUM') {
                const element = elements[cell.symbol];
                if (element) {
                    const tempRatio = Math.max(0, Math.min(1, (cell.temperature + 100) / 1100));
                    ctx.fillStyle = getColorForTemperature(tempRatio);
                    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                }
            }
        }
    }
}

export function getVisibleChunkKeys(state) {
    const { panX, panY, zoom } = state;
    const keys = new Set();
    const startX = -panX / (CELL_SIZE * zoom);
    const startY = -panY / (CELL_SIZE * zoom);
    const endX = startX + dom.canvas.width / (CELL_SIZE * zoom);
    const endY = startY + dom.canvas.height / (CELL_SIZE * zoom);

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

export function render(state) {
    ctx.save();
    ctx.clearRect(0, 0, dom.canvas.width, dom.canvas.height);

    if (state.simulationView.mode === 'space') {
        renderSpace(state);
    } else if (state.simulationView.mode === 'planet') {
        renderPlanetSurface(state);
    }

    ctx.restore();
}
