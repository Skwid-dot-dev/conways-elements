# Conway's Elements

A cellular automata simulation inspired by Conway's Game of Life, but with a sophisticated twist: a complex chemistry and physics engine. Watch as elements interact, react, and change states in a dynamic, grid-based world.

## How to Run

Simply open `index.html` in a modern web browser.

## Features

- **Large Canvas & Navigation**: The simulation now runs on a larger canvas. You can use the **pan** and **zoom** sliders to navigate the world.
- **Element-Based Planet Creation**: Create your own planets! Click the "Create Planet" button to open a dialog where you can choose the elemental composition of your new world. The planet's mass is calculated from its constituent elements.
- **Mass-Based Gravity**: The new gravity system simulates the gravitational attraction between planets. Planets will pull on each other with a force proportional to their masses and the distance between them. This feature can be toggled on or off.
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
- **Extensible Data Files**: All elements, compounds, and rules are defined in separate data files for easy modification and expansion.
- **D3-based Visualization**: Grid cells are visually colored according to their temperature, giving an intuitive sense of heat flow and reactions.
- **Magnetism**: Magnetic elements will attract each other, creating interesting new simulation possibilities.
- **Conductivity**: Conductive elements transfer heat more efficiently, allowing for more realistic temperature simulations.
- **Sun Special**: A new `SUN` special that provides a gradient of heat, with the temperature decreasing as the distance from the sun increases.

## The Elements and Compounds

The simulation includes a wide variety of elements and compounds, each with its own unique properties.

- **Elements**: Basic building blocks, defined in `data/elements.js`. These are based on the real periodic table.
- **Compounds**: More complex substances formed by chemical reactions, defined in `data/compounds.js`. This includes everything from water (`H2O`) and salt (`NACL`) to fire, life, oil, and lava.
- **Special Sources**: `HEAT` and `COLD` are persistent sources that raise or lower the temperature of grid cells and their neighbors. The `SUN` is a special source that provides a gradient of heat.

## The Rules

The chemical reactions that govern the simulation are defined in `data/rules.js`. You can modify this file to create your own custom reactions.

## Extending

You can add more elements, compounds, or rules by editing the respective data files. The UI and engine will automatically incorporate your changes for rapid sandbox experimentation.
