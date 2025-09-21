# Conway's Elements

A cellular automata simulation inspired by Conway's Game of Life, but with a sophisticated twist: a complex chemistry and physics engine. Watch as elements interact, react, and change states in a dynamic, grid-based world.

## How to Run

Simply open `index.html` in a modern web browser that supports JavaScript ES6 modules.

## Features

- **Advanced Physics Engine**: Simulates realistic movement and segregation of solids, liquids, and gases. Solids sink, liquids flow and spread, and gases rise and disperse, with denser materials displacing lighter ones.
- **Temperature Simulation**: Elements are affected by temperature, which diffuses across the grid. Heat and cold sources can be painted, causing phase changes (water freezing/boiling/condensing, etc.).
- **Heat/Cold Source Testbed**: Paintable `HEAT` and `COLD` sources persistently modify the temperature of any element occupying or moving through their cells, enabling controlled thermal experiments.
- **Life and Decay**: A `LIFE` element that can grow and spread to adjacent cells, but will eventually decay into `DEAD` matter, which can further decompose.
- **Complex Chemistry Engine**: A rule-based engine allows elements and compounds to react according to an extensible, toggleable ruleset. Includes:
  - Water, salt, and methane formation
  - Combustion and fire spread
  - Photosynthesis and life generation
  - Acid rain, dissolution, neutralization, rusting, and decomposition
  - Phase transitions (melting, freezing, condensation)
- **Toggleable Rules**: You can enable or disable individual chemical reactions in real-time via the "Interaction Rules" panel in the UI, creating your own experimental testbed.
- **Interactive Painting**: Paint any periodic table element onto the grid using a variable-sized brush.
- **Simulation Controls**: Start, pause, and clear the simulation at any time.
- **Element Info Panel**: Hover over the grid to see details about any element or compound at that cell.
- **Extensible Data Files**: All elements, compounds, and rules are defined in separate JSON files for easy modification and expansion.
- **D3-based Visualization**: Grid cells are visually colored according to their temperature, giving an intuitive sense of heat flow and reactions.

## The Elements and Compounds

The simulation includes a wide variety of elements and compounds, each with its own unique properties.

- **Elements**: Basic building blocks, defined in `elements.json`. These are based on the real periodic table and are the only options in the paint dropdown.
- **Compounds**: More complex substances formed by chemical reactions, defined in `compounds.json`. This includes everything from water (`H2O`) and salt (`NACL`) to fire and life itself.
- **Special Sources**: `HEAT` and `COLD` are persistent sources that raise or lower the temperature of grid cells and their neighbors.

## The Rules

The chemical reactions that govern the simulation are defined in `rules.json`. You can modify this file to create your own custom reactions. The default ruleset includes:

- **Formation Reactions**: Hydrogen and oxygen form water, sodium and chlorine form salt, methane creation, etc.
- **Combustion**: Flammable elements will burn in the presence of oxygen.
- **Photosynthesis**: Carbon dioxide and water can combine to create `LIFE`.
- **Acid Rain**: Sulfur dioxide and water can react to form corrosive sulfuric acid.
- **Dissolution, Neutralization, Rusting, Decomposition, Phase Changes**: Many more lifelike rules for robust sandbox interactions.

## Extending

You can add more elements, compounds, or rules by editing the respective JSON files. The UI and engine will automatically incorporate your changes for rapid sandbox experimentation.
