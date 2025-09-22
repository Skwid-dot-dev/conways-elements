/**
 * @file data.js
 * Handles loading and managing all simulation data.
 */

// We can't use ES6 imports for the data files because they are not modules.
// Instead, we can use a little trick with dynamic import() to load them.
// This is a modern approach to avoid using <script> tags in the HTML.
async function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

let elements = {};
let rules = [];

/**
 * Loads all the simulation data from the data files.
 * This function must be called before the simulation can start.
 */
async function loadData() {
    // Load data scripts
    await Promise.all([
        loadScript('data/elements.js'),
        loadScript('data/compounds.js'),
        loadScript('data/rules.js')
    ]);

    if (typeof ELEMENTS_DATA === 'undefined' || typeof COMPOUNDS_DATA === 'undefined' || typeof RULES_DATA === 'undefined') {
        console.error("Data files not loaded correctly. Make sure elements.js, compounds.js, and rules.js are available.");
        // Provide a basic fallback to prevent total crash
        elements = {
            'VACUUM': { symbol: 'VACUUM', name: 'Vacuum', color: '#000000', phase_at_stp: 'Gas', temperature: -273, density_proxy: 0 },
            'ERROR': { symbol: 'ERROR', name: 'Error', color: '#FF00FF', phase_at_stp: 'Solid', temperature: 0, density_proxy: 1 }
        };
        rules = [];
        return;
    }

    // Add default temperature to elements that don't have it
    Object.keys(ELEMENTS_DATA).forEach(key => {
        if (!ELEMENTS_DATA[key].temperature) {
            ELEMENTS_DATA[key].temperature = 25; // Room temperature default
        }
    });

    // Merge elements and compounds
    elements = { ...ELEMENTS_DATA, ...COMPOUNDS_DATA };
    rules = RULES_DATA;

    console.log('Data loaded successfully:', Object.keys(elements).length, 'elements loaded');
}

/**
 * Gets the entire elements object.
 * @returns {object} The elements object.
 */
function getElements() {
    return elements;
}

/**
 * Gets a specific element by its symbol.
 * @param {string} symbol - The symbol of the element to get.
 * @returns {object} The element object.
 */
function getElement(symbol) {
    return elements[symbol];
}

/**
 * Gets the entire rules array.
 * @returns {Array} The rules array.
 */
function getRules() {
    return rules;
}

export { loadData, getElements, getElement, getRules };
