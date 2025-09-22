const RULES_DATA = [
    {
        "name": "Water Formation (O + 2H)",
        "enabled": true,
        "reactants": { "center": "O", "neighbors": ["H", "H"] },
        "products": { "center": "H2O", "consumed_neighbors": 2 },
        "probability": 1.0
    },
    {
        "name": "Salt Formation (Na + Cl)",
        "enabled": true,
        "reactants": { "center": "Na", "neighbors": ["Cl"] },
        "products": { "center": "NACL", "consumed_neighbors": 1 },
        "probability": 0.2
    },
    {
        "name": "Methane Formation (C + 4H)",
        "enabled": true,
        "reactants": { "center": "C", "neighbors": ["H", "H", "H", "H"] },
        "products": { "center": "CH4", "consumed_neighbors": 4 },
        "probability": 0.05
    },
    {
        "name": "Combustion (Flammable + O)",
        "enabled": true,
        "is_combustion": true,
        "probability": 0.1
    },
    {
        "name": "Oil Combustion (OIL + FIRE)",
        "enabled": true,
        "reactants": { "center": "OIL", "neighbors": ["FIRE"] },
        "products": { "center": "FIRE", "consumed_neighbors": 1 },
        "probability": 1.0
    },
    {
        "name": "CO2 Formation (C + O)",
        "enabled": true,
        "reactants": { "center": "C", "neighbors": ["O"] },
        "products": { "center": "CO2", "consumed_neighbors": 1 },
        "probability": 0.5
    },
    {
        "name": "SO2 Formation (S + O)",
        "enabled": true,
        "reactants": { "center": "S", "neighbors": ["O"] },
        "products": { "center": "SO2", "consumed_neighbors": 1 },
        "probability": 0.5
    },
    {
        "name": "Photosynthesis (CO2 + H2O)",
        "enabled": true,
        "reactants": { "center": "CO2", "neighbors": ["H2O"] },
        "products": { "center": "LIFE", "consumed_neighbors": 1 },
        "probability": 0.1
    },
    {
        "name": "Acid Rain (SO2 + H2O)",
        "enabled": true,
        "reactants": { "center": "SO2", "neighbors": ["H2O"] },
        "products": { "center": "H2SO4", "consumed_neighbors": 1 },
        "probability": 0.2
    },
    {
        "name": "Salt Dissolution (NACL + H2O)",
        "enabled": true,
        "reactants": { "center": "NACL", "neighbors": ["H2O"] },
        "products": { "center": "H2O", "consumed_neighbors": 1 },
        "probability": 0.4
    },
    {
        "name": "Neutralization (H2SO4 + Na)",
        "enabled": true,
        "reactants": { "center": "H2SO4", "neighbors": ["Na"] },
        "products": { "center": "NACL", "consumed_neighbors": 1 },
        "probability": 0.2
    },
    {
        "name": "Rusting (Fe + O)",
        "enabled": true,
        "reactants": { "center": "Fe", "neighbors": ["O"] },
        "products": { "center": "DEAD", "consumed_neighbors": 1 },
        "probability": 0.05
    },
    {
        "name": "Life Decay (LIFE)",
        "enabled": true,
        "reactants": { "center": "LIFE", "neighbors": [] },
        "products": { "center": "DEAD", "consumed_neighbors": 0 },
        "probability": 0.005
    },
    {
        "name": "Dead Matter Decomposition (DEAD + O)",
        "enabled": true,
        "reactants": { "center": "DEAD", "neighbors": ["O"] },
        "products": { "center": "CO2", "consumed_neighbors": 1 },
        "probability": 0.01
    },
    {
        "name": "Steam Condensation (STEAM + COLD)",
        "enabled": true,
        "reactants": { "center": "STEAM", "neighbors": ["COLD"] },
        "products": { "center": "H2O", "consumed_neighbors": 1 },
        "probability": 1.0
    },
    {
        "name": "Ice Melting (ICE + HEAT)",
        "enabled": true,
        "reactants": { "center": "ICE", "neighbors": ["HEAT"] },
        "products": { "center": "H2O", "consumed_neighbors": 1 },
        "probability": 1.0
    },
    {
        "name": "Water Freezing (H2O + COLD)",
        "enabled": true,
        "reactants": { "center": "H2O", "neighbors": ["COLD"] },
        "products": { "center": "ICE", "consumed_neighbors": 1 },
        "probability": 1.0
    },
    {
        "name": "Magnetism (Attraction)",
        "enabled": true,
        "is_magnetism": true,
        "probability": 0.5
    },
    {
        "name": "Hydrogen Fusion (2H_PLASMA -> HE_PLASMA + Energy)",
        "enabled": true,
        "reactants": { "center": "H_PLASMA", "neighbors": ["H_PLASMA"] },
        "products": { "center": "HE_PLASMA", "consumed_neighbors": 1 },
        "probability": 0.8,
        "min_temperature": 6000
    },
    {
        "name": "Sun Formation (H_PLASMA + HE_PLASMA -> FUSION_SUN)",
        "enabled": true,
        "reactants": { "center": "H_PLASMA", "neighbors": ["HE_PLASMA"] },
        "products": { "center": "FUSION_SUN", "consumed_neighbors": 1 },
        "probability": 0.01,
        "min_temperature": 7000
    }
];
