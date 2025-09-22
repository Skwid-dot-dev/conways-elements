const COMPOUNDS_DATA = {
    "VACUUM": {
        "symbol": "VACUUM",
        "name": "Vacuum",
        "color": "#000000",
        "phase_at_stp": "Gas",
        "temperature": -273,
        "density_proxy": 0,
        "mass": 0
    },
    "HEAT": {
        "symbol": "HEAT",
        "name": "Heat Source",
        "color": "#FF4500",
        "phase_at_stp": "Solid",
        "temperature": 1000,
        "density_proxy": 10,
        "mass": 0
    },
    "COLD": {
        "symbol": "COLD",
        "name": "Cold Source",
        "color": "#00BFFF",
        "phase_at_stp": "Solid",
        "temperature": -100,
        "density_proxy": 10,
        "mass": 0
    },
    "FIRE": {
        "symbol": "FIRE",
        "name": "Fire",
        "color": "#FF4500",
        "phase_at_stp": "Gas",
        "lifespan": 15,
        "temperature": 800,
        "density_proxy": 0.1,
        "mass": 0
    },
    "H2O": {
        "symbol": "H2O",
        "name": "Water",
        "color": "#3498DB",
        "phase_at_stp": "Liquid",
        "temperature": 25,
        "density_proxy": 1.0,
        "temperature_thresholds": {
            "freeze": 0,
            "boil": 100
        },
        "mass": 10
    },
    "ICE": {
        "symbol": "ICE",
        "name": "Ice",
        "color": "#A9CCE3",
        "phase_at_stp": "Solid",
        "temperature": -10,
        "density_proxy": 0.917,
        "mass": 10
    },
    "STEAM": {
        "symbol": "STEAM",
        "name": "Steam",
        "color": "#F2F3F4",
        "phase_at_stp": "Gas",
        "temperature": 110,
        "density_proxy": 0.0006,
        "mass": 10
    },
    "LIFE": {
        "symbol": "LIFE",
        "name": "Life",
        "color": "#2ECC71",
        "phase_at_stp": "Solid",
        "temperature": 25,
        "density_proxy": 1.1,
        "is_life": true,
        "lifespan": 100,
        "mass": 10
    },
    "DEAD": {
        "symbol": "DEAD",
        "name": "Dead Matter",
        "color": "#784212",
        "phase_at_stp": "Solid",
        "temperature": 25,
        "density_proxy": 0.9,
        "mass": 10
    },
    "CO2": {
        "symbol": "CO2",
        "name": "Carbon Dioxide",
        "color": "#A0A0A0",
        "phase_at_stp": "Gas",
        "temperature": 25,
        "density_proxy": 1.977,
        "mass": 22
    },
    "SO2": {
        "symbol": "SO2",
        "name": "Sulfur Dioxide",
        "color": "#F0E68C",
        "phase_at__stp": "Gas",
        "temperature": 25,
        "density_proxy": 2.6288,
        "mass": 32
    },
    "H2SO4": {
        "symbol": "H2SO4",
        "name": "Sulfuric Acid",
        "color": "#FFD700",
        "phase_at_stp": "Liquid",
        "temperature": 25,
        "density_proxy": 1.83,
        "mass": 50
    },
    "NACL": {
        "symbol": "NACL",
        "name": "Salt",
        "color": "#FDFEFE",
        "phase_at_stp": "Solid",
        "temperature": 25,
        "density_proxy": 2.16,
        "mass": 28
    },
    "CH4": {
        "symbol": "CH4",
        "name": "Methane",
        "color": "#B2FF66",
        "phase_at_stp": "Gas",
        "flammability": true,
        "temperature": 25,
        "density_proxy": 0.657,
        "mass": 10
    },
    "OIL": {
        "symbol": "OIL",
        "name": "Oil",
        "color": "#333333",
        "phase_at_stp": "Liquid",
        "flammability": true,
        "temperature": 25,
        "density_proxy": 0.9,
        "mass": 66
    },
    "LAVA": {
        "symbol": "LAVA",
        "name": "Lava",
        "color": "#CF1020",
        "phase_at_stp": "Liquid",
        "temperature": 1200,
        "density_proxy": 2.5,
        "mass": 30
    },
    "SUN": {
        "symbol": "SUN",
        "name": "Sun",
        "color": "#FFD700",
        "phase_at_stp": "Solid",
        "temperature": 5500,
        "density_proxy": 100,
        "is_sun": true,
        "heat_range": 50,
        "heat_intensity": 100,
        "mass": 1000
    },
    "Hplus": {
        "symbol": "Hplus",
        "name": "Hydrogen Ion (Proton)",
        "color": "#FF4500",
        "phase_at_stp": "Gas",
        "temperature": 25,
        "density_proxy": 0.0001,
        "is_plasma": true,
        "mass": 1
    },
    "eminus": {
        "symbol": "eminus",
        "name": "Electron",
        "color": "#00BFFF",
        "phase_at_stp": "Gas",
        "temperature": 25,
        "density_proxy": 0.00001,
        "is_plasma": true,
        "mass": 0
    },
    "PLANET": {
        "symbol": "PLANET",
        "name": "Planet",
        "color": "#A9A9A9",
        "phase_at_stp": "Solid",
        "density_proxy": 1000,
        "mass": 0,
        "composition": {}
    }
};
