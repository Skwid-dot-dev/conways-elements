# Conway's Elements

A cellular automata simulation inspired by Conway's Game of Life, but with a sophisticated twist: a complex chemistry and physics engine. Watch as elements interact, react, and change states in a dynamic, grid-based world.

## How to Run

Simply open `index.html` in a modern web browser that supports JavaScript ES6 modules.

## Features

-   **Advanced Physics Engine**: A simulation where elements behave according to their density. Solids sink, liquids spread, and gases rise, with denser materials displacing lighter ones.
-   **Temperature Simulation**: Elements are affected by temperature, with heat diffusing across the grid. Watch water turn to ice or boil into steam!
-   **Life and Decay**: A `LIFE` element that can grow and spread to adjacent cells, but will eventually decay into `DEAD` matter.
-   **Complex Chemistry**: A rule-based chemistry engine that allows elements and compounds to react with each other.
-   **Toggleable Rules**: You can enable or disable individual chemical reactions in real-time via the "Interaction Rules" panel in the UI.
-   **Interactive Painting**: Paint different elements onto the grid using a variable-sized brush.
-   **Simulation Controls**: Start, pause, and clear the simulation at any time.

## The Elements and Compounds

The simulation includes a wide variety of elements and compounds, each with its own unique properties.

-   **Elements**: Basic building blocks, defined in `elements.json`. These are based on the real periodic table.
-   **Compounds**: More complex substances formed by chemical reactions, defined in `compounds.json`. This includes everything from water (`H2O`) and salt (`NACL`) to fire and life itself.

## The Rules

The chemical reactions that govern the simulation are defined in `rules.json`. You can modify this file to create your own custom reactions. The default ruleset includes:

-   **Formation Reactions**: Hydrogen and oxygen form water, sodium and chlorine form salt, etc.
-   **Combustion**: Flammable elements will burn in the presence of oxygen.
-   **Photosynthesis**: Carbon dioxide and water can combine to create `LIFE`.
-   **Acid Rain**: Sulfur dioxide and water can react to form corrosive sulfuric acid.
