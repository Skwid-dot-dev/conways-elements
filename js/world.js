/**
 * @file world.js
 * Manages the simulation state, including the world grid and celestial bodies.
 */

import { CHUNK_SIZE } from './constants.js';

let world = {}; // Using an object as a sparse grid for chunks
let celestialBodies = []; // To store planets and other large objects

/**
 * The CelestialBody class represents planets and other large objects.
 */
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
}

/**
 * Creates a new, empty chunk.
 * @param {number} chunkX - The x-coordinate of the chunk.
 * @param {number} chunkY - The y-coordinate of the chunk.
 * @param {number} globalVacuumTemp - The global vacuum temperature.
 * @returns {object} The new chunk object.
 */
function createChunk(chunkX, chunkY, globalVacuumTemp) {
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
 * @param {number} chunkX - The x-coordinate of the chunk.
 * @param {number} chunkY - The y-coordinate of the chunk.
 * @param {number} globalVacuumTemp - The global vacuum temperature.
 * @returns {object} The chunk object.
 */
function getChunk(chunkX, chunkY, globalVacuumTemp) {
    const key = `${chunkX},${chunkY}`;
    if (!world[key]) {
        world[key] = createChunk(chunkX, chunkY, globalVacuumTemp);
    }
    return world[key];
}

/**
 * Gets a cell at a specific world coordinate.
 * @param {number} x - The world x-coordinate of the cell.
 * @param {number} y - The world y-coordinate of the cell.
 * @param {number} globalVacuumTemp - The global vacuum temperature.
 * @returns {object} The cell object.
 */
function getCell(x, y, globalVacuumTemp) {
    const chunkX = Math.floor(x / CHUNK_SIZE);
    const chunkY = Math.floor(y / CHUNK_SIZE);
    const chunk = getChunk(chunkX, chunkY, globalVacuumTemp);
    const localX = x - (chunkX * CHUNK_SIZE);
    const localY = y - (chunkY * CHUNK_SIZE);
    return chunk.cells[localY][localX];
}

/**
 * Sets a cell at a specific world coordinate.
 * @param {number} x - The world x-coordinate of the cell.
 * @param {number} y - The world y-coordinate of the cell.
 * @param {object} cell - The cell object to set.
 * @param {number} globalVacuumTemp - The global vacuum temperature.
 */
function setCell(x, y, cell, globalVacuumTemp) {
    const chunkX = Math.floor(x / CHUNK_SIZE);
    const chunkY = Math.floor(y / CHUNK_SIZE);
    const chunk = getChunk(chunkX, chunkY, globalVacuumTemp);
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
 * Gets the entire world object.
 * @returns {object} The world object.
 */
function getWorld() {
    return world;
}

/**
 * Gets the array of celestial bodies.
 * @returns {Array} The celestial bodies array.
 */
function getCelestialBodies() {
    return celestialBodies;
}

/**
 * Adds a celestial body to the simulation.
 * @param {CelestialBody} body - The celestial body to add.
 */
function addCelestialBody(body) {
    celestialBodies.push(body);
}

/**
 * Replaces the world object with a new one.
 * @param {object} newWorld - The new world object.
 */
function setWorld(newWorld) {
    world = newWorld;
}

export {
    CelestialBody,
    getChunk,
    getCell,
    setCell,
    clearWorld,
    getWorld,
    getCelestialBodies,
    addCelestialBody,
    setWorld,
};
