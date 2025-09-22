/**
 * @file api.js
 * This file exposes a limited, clear API to the global scope.
 * It is the only script that should be directly included in index.html.
 * All other modules will be imported into this file.
 */

import { init } from './simulation.js';

// Expose the init function to the global scope so it can be called from index.html
window.ConwaysElements = {
    init,
};
