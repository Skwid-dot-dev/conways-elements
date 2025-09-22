/**
 * @file engine.js
 * Contains the core simulation logic for physics and rules.
 */

import { getElements, getRules } from './data.js';
import { getCell, getCelestialBodies, setCell } from './world.js';
import { CHUNK_SIZE } from './constants.js';

function applyTemperatureDiffusion(chunk, nextChunk) {
    const elements = getElements();
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

function applyTemperatureEffects(chunk, nextChunk) {
    const elements = getElements();
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
    const elements = getElements();
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

function applyRules(chunk, nextChunk) {
    const elements = getElements();
    const rules = getRules();
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

function applyPhysics(chunk, nextChunk, crossChunkMovers) {
    const elements = getElements();
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
                    if (nextChunk.cells[toY - chunkY * CHUNK_SIZE][toX - chunkX * CHUNK_SIZE].symbol === 'VACUUM') {
                        const temp = nextChunk.cells[fromY][fromX];
                        nextChunk.cells[fromY][fromX] = nextChunk.cells[toY - chunkY * CHUNK_SIZE][toX - chunkX * CHUNK_SIZE];
                        nextChunk.cells[toY - chunkY * CHUNK_SIZE][toX - chunkX * CHUNK_SIZE] = temp;
                    }
                } else {
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

function applyMassBasedGravity() {
    const celestialBodies = getCelestialBodies();
    const G = 0.1;
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

function applyParticleCollection(nextStates) {
    const celestialBodies = getCelestialBodies();
    const elements = getElements();
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

export function updateSpace(world, visibleKeys) {
    const nextStates = new Map();
    const crossChunkMovers = [];

    for (const key of visibleKeys) {
        const chunk = world[key];
        if (!chunk) continue;

        let nextChunk = JSON.parse(JSON.stringify(chunk));

        applyTemperatureDiffusion(chunk, nextChunk);
        applyTemperatureEffects(chunk, nextChunk);
        applyIonization(chunk, nextChunk);
        applyLifeAndDecay(chunk, nextChunk);
        applyRules(chunk, nextChunk);
        applyPhysics(chunk, nextChunk, crossChunkMovers);

        nextStates.set(key, nextChunk);
    }

    for (const [key, nextChunk] of nextStates.entries()) {
        world[key] = nextChunk;
    }

    for (const move of crossChunkMovers) {
        setCell(move.to.x, move.to.y, move.cell);
    }

    applyMassBasedGravity();
    applyParticleCollection(nextStates);

    const celestialBodies = getCelestialBodies();
    for (const body of celestialBodies) {
        const tempX = body.x;
        const tempY = body.y;
        body.x += body.x - body.prevX + body.ax * 0.01;
        body.y += body.y - body.prevY + body.ay * 0.01;
        body.prevX = tempX;
        body.prevY = tempY;
    }
}

export function updatePlanetSurface(planetGrid, body) {
    if (!planetGrid) return null;

    const nextGrid = JSON.parse(JSON.stringify(planetGrid));
    const elements = getElements();
    const gridHeight = nextGrid.length;
    const gridWidth = nextGrid[0].length;
    const gravity = Math.min(5, 1 + Math.floor(body.mass / 1000));

    for (let y = gridHeight - 2; y >= 0; y--) {
        for (let x = 0; x < gridWidth; x++) {
            const currentCell = nextGrid[y][x];
            const currentElement = elements[currentCell.symbol];

            if (!currentElement || currentElement.symbol === 'VACUUM') continue;

            const phase = currentElement.phase_at_stp;
            const density = currentElement.density_proxy || 1.0;

            if (phase === 'Solid' || phase === 'Liquid') {
                let targetY = y;
                for (let i = 1; i <= gravity; i++) {
                    const newY = y + i;
                    if (newY >= gridHeight) break;
                    const belowCell = nextGrid[newY][x];
                    const belowElement = elements[belowCell.symbol];
                    if (!belowElement || belowElement.symbol === 'VACUUM' || density > (belowElement.density_proxy || 0)) {
                        targetY = newY;
                    } else {
                        break;
                    }
                }

                if (targetY !== y) {
                    const temp = nextGrid[y][x];
                    nextGrid[y][x] = nextGrid[targetY][x];
                    nextGrid[targetY][x] = temp;
                    continue;
                }
            }

            if (phase === 'Liquid') {
                const dir = Math.random() < 0.5 ? 1 : -1;
                const sideX = x + dir;
                if (sideX >= 0 && sideX < gridWidth) {
                     const sideCell = nextGrid[y][sideX];
                     const sideElement = elements[sideCell.symbol];
                     if (sideElement && sideElement.symbol === 'VACUUM') {
                         const temp = nextGrid[y][x];
                         nextGrid[y][x] = nextGrid[y][sideX];
                         nextGrid[y][sideX] = temp;
                     }
                }
            } else if (phase === 'Gas') {
                let targetY = y;
                 for (let i = 1; i <= gravity; i++) {
                    const newY = y - i;
                    if (newY < 0) break;
                    const aboveCell = nextGrid[newY][x];
                    const aboveElement = elements[aboveCell.symbol];
                    if (!aboveElement || aboveElement.symbol === 'VACUUM' || density < (aboveElement.density_proxy || 0)) {
                        targetY = newY;
                    } else {
                        break;
                    }
                }
                 if (targetY !== y) {
                    const temp = nextGrid[y][x];
                    nextGrid[y][x] = nextGrid[targetY][x];
                    nextGrid[targetY][x] = temp;
                    continue;
                }
            }
        }
    }
    return nextGrid;
}
